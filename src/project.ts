export interface coord {
  lat: number;
  lon: number;
}
export type coordOp = (c: coord, checkChina?: boolean) => coord;

/// Krasovsky 1940 ellipsoid
const GCJ_A = 6378245;
const GCJ_EE = 0.006693421622965943; // f = 1/298.3; e^2 = 2*f - f**2

/// Epsilon to use for "exact" iterations.
/// Wanna troll? Use Number.EPSILON. 1e-13 in 15 calls for gcj.
const PRC_EPS = 1e-6;

/// Baidu's artificial deviations
const BD_DLAT = 0.006;
const BD_DLON = 0.0065;

function sanity_in_china_p(coords: coord) {
  return (
    coords.lat >= 0.8293 &&
    coords.lat <= 55.8271 &&
    coords.lon >= 72.004 &&
    coords.lon <= 137.8347
  );
}

function _coord_diff(a: coord, b: coord) {
  return {
    lat: a.lat - b.lat,
    lon: a.lon - b.lon,
  };
}

function _stringify(c: coord) {
  return '(' + c.lat + ', ' + c.lon + ')';
}

function wgs_gcj(wgs: coord, checkChina?: boolean): coord {
  if ((checkChina === undefined || checkChina) && !sanity_in_china_p(wgs)) {
    console.warn(
      'Non-Chinese coords found, returning as-is: ' + _stringify(wgs),
    );
    return wgs;
  }

  const x = wgs.lon - 105,
    y = wgs.lat - 35;

  // These distortion functions accept (x = lon - 105, y = lat - 35).
  // They return distortions in terms of arc lengths, in meters.
  //
  // In other words, you can pretty much figure out how much you will be off
  // from WGS-84 just through evaulating them...
  //
  // For example, at the (mapped) center of China (105E, 35N), you get a
  // default deviation of <300, -100> meters.
  const dLat_m =
    -100 +
    2 * x +
    3 * y +
    0.2 * y * y +
    0.1 * x * y +
    0.2 * Math.sqrt(Math.abs(x)) +
    ((2 * Math.sin(x * 6 * Math.PI) +
      2 * Math.sin(x * 2 * Math.PI) +
      2 * Math.sin(y * Math.PI) +
      4 * Math.sin((y / 3) * Math.PI) +
      16 * Math.sin((y / 12) * Math.PI) +
      32 * Math.sin((y / 30) * Math.PI)) *
      20) /
      3;
  const dLon_m =
    300 +
    x +
    2 * y +
    0.1 * x * x +
    0.1 * x * y +
    0.1 * Math.sqrt(Math.abs(x)) +
    ((2 * Math.sin(x * 6 * Math.PI) +
      2 * Math.sin(x * 2 * Math.PI) +
      2 * Math.sin(x * Math.PI) +
      4 * Math.sin((x / 3) * Math.PI) +
      15 * Math.sin((x / 12) * Math.PI) +
      30 * Math.sin((x / 30) * Math.PI)) *
      20) /
      3;

  const radLat = (wgs.lat / 180) * Math.PI;
  const magic = 1 - GCJ_EE * Math.pow(Math.sin(radLat), 2); // just a common expr

  // [[:en:Latitude#Length_of_a_degree_of_latitude]]
  const lat_deg_arclen =
    ((Math.PI / 180) * (GCJ_A * (1 - GCJ_EE))) / Math.pow(magic, 1.5);
  // [[:en:Longitude#Length_of_a_degree_of_longitude]]
  const lon_deg_arclen =
    (Math.PI / 180) * ((GCJ_A * Math.cos(radLat)) / Math.sqrt(magic));

  // The screwers pack their deviations into degrees and disappear.
  // Note how they are mixing WGS-84 and Krasovsky 1940 ellipsoids here...
  return {
    lat: wgs.lat + dLat_m / lat_deg_arclen,
    lon: wgs.lon + dLon_m / lon_deg_arclen,
  };
}

// rev_transform_rough; accuracy ~2e-6 deg (meter-level)
function gcj_wgs_once(gcj: coord, checkChina?: boolean): coord {
  return _coord_diff(gcj, _coord_diff(wgs_gcj(gcj, checkChina), gcj));
}

function gcj_bd(gcj: coord): coord {
  const x = gcj.lon;
  const y = gcj.lat;

  // trivia: pycoordtrans actually describes how these values are calculated
  const r =
    Math.sqrt(x * x + y * y) + 0.00002 * Math.sin((y * Math.PI * 3000) / 180);
  const θ = Math.atan2(y, x) + 0.000003 * Math.cos((x * Math.PI * 3000) / 180);

  // Hard-coded default deviations again!
  return {
    lat: r * Math.sin(θ) + BD_DLAT,
    lon: r * Math.cos(θ) + BD_DLON,
  };
}

// Yes, we can implement a "precise" one too.
// accuracy ~1e-7 deg (decimeter-level; exceeds usual data accuracy)
function bd_gcj_once(bd: coord): coord {
  const x = bd.lon - BD_DLON;
  const y = bd.lat - BD_DLAT;

  // trivia: pycoordtrans actually describes how these values are calculated
  const r =
    Math.sqrt(x * x + y * y) - 0.00002 * Math.sin((y * Math.PI * 3000) / 180);
  const θ = Math.atan2(y, x) - 0.000003 * Math.cos((x * Math.PI * 3000) / 180);

  return {
    lat: r * Math.sin(θ),
    lon: r * Math.cos(θ),
  };
}

function bd_wgs_once(bd: coord, checkChina?: boolean): coord {
  return gcj_wgs_once(bd_gcj_once(bd), checkChina);
}

function wgs_bd(bd: coord, checkChina?: boolean): coord {
  return gcj_bd(wgs_gcj(bd, checkChina));
}

// gcj: 4 calls to wgs_gcj; ~0.1mm acc
function __iteration__(fwd: coordOp, rev: coordOp) {
  return function (
    heck: coord,
    checkChina?: boolean,
    tolerance: number = PRC_EPS,
  ) {
    if (checkChina === undefined) checkChina = true;
    let curr = rev(heck, checkChina);
    let diff = { lat: Infinity, lon: Infinity };

    let i = 0;
    while (
      Math.max(Math.abs(diff.lat), Math.abs(diff.lon)) > tolerance &&
      i++ < 10
    ) {
      diff = _coord_diff(fwd(curr, checkChina), heck);
      curr = _coord_diff(curr, diff);
    }

    return curr;
  };
}
const gcj_wgs = __iteration__(wgs_gcj, gcj_wgs_once);
const bd_gcj = __iteration__(gcj_bd, bd_gcj_once);
const bd_wgs = __iteration__(wgs_bd, bd_wgs_once);
export {
  wgs_gcj,
  gcj_wgs_once,
  gcj_bd,
  bd_gcj_once,
  wgs_bd,
  bd_wgs_once,
  __iteration__,
  gcj_wgs,
  bd_gcj,
  bd_wgs,
};

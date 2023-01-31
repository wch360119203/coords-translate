const _ = 0.006693421622965943, y = 1e-6, u = 6e-3, f = 65e-4;
function m(t) {
  return t.lat >= 0.8293 && t.lat <= 55.8271 && t.lon >= 72.004 && t.lon <= 137.8347;
}
function r(t, a) {
  return {
    lat: t.lat - a.lat,
    lon: t.lon - a.lon
  };
}
function q(t) {
  return "(" + t.lat + ", " + t.lon + ")";
}
function c(t, a) {
  if ((a === void 0 || a) && !m(t))
    return console.warn(
      "Non-Chinese coords found, returning as-is: " + q(t)
    ), t;
  const n = t.lon - 105, o = t.lat - 35, s = -100 + 2 * n + 3 * o + 0.2 * o * o + 0.1 * n * o + 0.2 * Math.sqrt(Math.abs(n)) + (2 * Math.sin(n * 6 * Math.PI) + 2 * Math.sin(n * 2 * Math.PI) + 2 * Math.sin(o * Math.PI) + 4 * Math.sin(o / 3 * Math.PI) + 16 * Math.sin(o / 12 * Math.PI) + 32 * Math.sin(o / 30 * Math.PI)) * 20 / 3, h = 300 + n + 2 * o + 0.1 * n * n + 0.1 * n * o + 0.1 * Math.sqrt(Math.abs(n)) + (2 * Math.sin(n * 6 * Math.PI) + 2 * Math.sin(n * 2 * Math.PI) + 2 * Math.sin(n * Math.PI) + 4 * Math.sin(n / 3 * Math.PI) + 15 * Math.sin(n / 12 * Math.PI) + 30 * Math.sin(n / 30 * Math.PI)) * 20 / 3, M = t.lat / 180 * Math.PI, i = 1 - _ * Math.pow(Math.sin(M), 2), b = Math.PI / 180 * (6378245 * (1 - _)) / Math.pow(i, 1.5), g = Math.PI / 180 * (6378245 * Math.cos(M) / Math.sqrt(i));
  return {
    lat: t.lat + s / b,
    lon: t.lon + h / g
  };
}
function I(t, a) {
  return r(t, r(c(t, a), t));
}
function l(t) {
  const a = t.lon, n = t.lat, o = Math.sqrt(a * a + n * n) + 2e-5 * Math.sin(n * Math.PI * 3e3 / 180), s = Math.atan2(n, a) + 3e-6 * Math.cos(a * Math.PI * 3e3 / 180);
  return {
    lat: o * Math.sin(s) + u,
    lon: o * Math.cos(s) + f
  };
}
function P(t) {
  const a = t.lon - f, n = t.lat - u, o = Math.sqrt(a * a + n * n) - 2e-5 * Math.sin(n * Math.PI * 3e3 / 180), s = Math.atan2(n, a) - 3e-6 * Math.cos(a * Math.PI * 3e3 / 180);
  return {
    lat: o * Math.sin(s),
    lon: o * Math.cos(s)
  };
}
function x(t, a) {
  return I(P(t), a);
}
function d(t, a) {
  return l(c(t, a));
}
function e(t, a) {
  return function(n, o, s = y) {
    o === void 0 && (o = !0);
    let h = a(n, o), M = { lat: 1 / 0, lon: 1 / 0 }, i = 0;
    for (; Math.max(Math.abs(M.lat), Math.abs(M.lon)) > s && i++ < 10; )
      M = r(t(h, o), n), h = r(h, M);
    return h;
  };
}
const L = e(c, I), p = e(l, P), A = e(d, x), D = { wgs_gcj: c, gcj_wgs: L, gcj_bd: l, bd_gcj: p, wgs_bd: d, bd_wgs: A };
export {
  p as bd_gcj,
  A as bd_wgs,
  D as default,
  l as gcj_bd,
  L as gcj_wgs,
  d as wgs_bd,
  c as wgs_gcj
};

import {
  wgs_gcj,
  gcj_wgs,
  gcj_bd,
  bd_gcj,
  wgs_bd,
  bd_wgs,
  type coord,
} from './project';
type translateFn = (
  heck: coord,
  checkChina?: boolean,
  tolerance?: number,
) => coord;
export { wgs_gcj, gcj_wgs, gcj_bd, bd_gcj, wgs_bd, bd_wgs, type translateFn };
export default { wgs_gcj, gcj_wgs, gcj_bd, bd_gcj, wgs_bd, bd_wgs };
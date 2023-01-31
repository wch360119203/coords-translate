import { wgs_gcj, gcj_wgs, gcj_bd, bd_gcj, wgs_bd, bd_wgs, type coord } from './project';
type translateFn = (heck: coord, checkChina?: boolean, tolerance?: number) => coord;
export { wgs_gcj, gcj_wgs, gcj_bd, bd_gcj, wgs_bd, bd_wgs, type translateFn };
declare const _default: {
    wgs_gcj: typeof wgs_gcj;
    gcj_wgs: (heck: coord, checkChina?: boolean | undefined, tolerance?: number) => coord;
    gcj_bd: typeof gcj_bd;
    bd_gcj: (heck: coord, checkChina?: boolean | undefined, tolerance?: number) => coord;
    wgs_bd: typeof wgs_bd;
    bd_wgs: (heck: coord, checkChina?: boolean | undefined, tolerance?: number) => coord;
};
export default _default;

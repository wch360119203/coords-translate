export interface coord {
    lat: number;
    lon: number;
}
export type coordOp = (c: coord, checkChina?: boolean) => coord;
declare function wgs_gcj(wgs: coord, checkChina?: boolean): coord;
declare function gcj_wgs_once(gcj: coord, checkChina?: boolean): coord;
declare function gcj_bd(gcj: coord): coord;
declare function bd_gcj_once(bd: coord): coord;
declare function bd_wgs_once(bd: coord, checkChina?: boolean): coord;
declare function wgs_bd(bd: coord, checkChina?: boolean): coord;
declare function __iteration__(fwd: coordOp, rev: coordOp): (heck: coord, checkChina?: boolean, tolerance?: number) => coord;
declare const gcj_wgs: (heck: coord, checkChina?: boolean, tolerance?: number) => coord;
declare const bd_gcj: (heck: coord, checkChina?: boolean, tolerance?: number) => coord;
declare const bd_wgs: (heck: coord, checkChina?: boolean, tolerance?: number) => coord;
export { wgs_gcj, gcj_wgs_once, gcj_bd, bd_gcj_once, wgs_bd, bd_wgs_once, __iteration__, gcj_wgs, bd_gcj, bd_wgs, };

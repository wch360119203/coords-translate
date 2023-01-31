(function(s,c){typeof exports=="object"&&typeof module!="undefined"?c(exports):typeof define=="function"&&define.amd?define(["exports"],c):(s=typeof globalThis!="undefined"?globalThis:s||self,c(s.coordsTranslate={}))})(this,function(s){"use strict";const d=.006693421622965943,w=1e-6,P=.006,I=.0065;function q(t){return t.lat>=.8293&&t.lat<=55.8271&&t.lon>=72.004&&t.lon<=137.8347}function l(t,a){return{lat:t.lat-a.lat,lon:t.lon-a.lon}}function L(t){return"("+t.lat+", "+t.lon+")"}function h(t,a){if((a===void 0||a)&&!q(t))return console.warn("Non-Chinese coords found, returning as-is: "+L(t)),t;const n=t.lon-105,o=t.lat-35,i=-100+2*n+3*o+.2*o*o+.1*n*o+.2*Math.sqrt(Math.abs(n))+(2*Math.sin(n*6*Math.PI)+2*Math.sin(n*2*Math.PI)+2*Math.sin(o*Math.PI)+4*Math.sin(o/3*Math.PI)+16*Math.sin(o/12*Math.PI)+32*Math.sin(o/30*Math.PI))*20/3,M=300+n+2*o+.1*n*n+.1*n*o+.1*Math.sqrt(Math.abs(n))+(2*Math.sin(n*6*Math.PI)+2*Math.sin(n*2*Math.PI)+2*Math.sin(n*Math.PI)+4*Math.sin(n/3*Math.PI)+15*Math.sin(n/12*Math.PI)+30*Math.sin(n/30*Math.PI))*20/3,e=t.lat/180*Math.PI,r=1-d*Math.pow(Math.sin(e),2),v=Math.PI/180*(6378245*(1-d))/Math.pow(r,1.5),A=Math.PI/180*(6378245*Math.cos(e)/Math.sqrt(r));return{lat:t.lat+i/v,lon:t.lon+M/A}}function g(t,a){return l(t,l(h(t,a),t))}function _(t){const a=t.lon,n=t.lat,o=Math.sqrt(a*a+n*n)+2e-5*Math.sin(n*Math.PI*3e3/180),i=Math.atan2(n,a)+3e-6*Math.cos(a*Math.PI*3e3/180);return{lat:o*Math.sin(i)+P,lon:o*Math.cos(i)+I}}function b(t){const a=t.lon-I,n=t.lat-P,o=Math.sqrt(a*a+n*n)-2e-5*Math.sin(n*Math.PI*3e3/180),i=Math.atan2(n,a)-3e-6*Math.cos(a*Math.PI*3e3/180);return{lat:o*Math.sin(i),lon:o*Math.cos(i)}}function T(t,a){return g(b(t),a)}function u(t,a){return _(h(t,a))}function f(t,a){return function(n,o,i=w){o===void 0&&(o=!0);let M=a(n,o),e={lat:1/0,lon:1/0},r=0;for(;Math.max(Math.abs(e.lat),Math.abs(e.lon))>i&&r++<10;)e=l(t(M,o),n),M=l(M,e);return M}}const y=f(h,g),j=f(_,b),m=f(u,T),p={wgs_gcj:h,gcj_wgs:y,gcj_bd:_,bd_gcj:j,wgs_bd:u,bd_wgs:m};s.bd_gcj=j,s.bd_wgs=m,s.default=p,s.gcj_bd=_,s.gcj_wgs=y,s.wgs_bd=u,s.wgs_gcj=h,Object.defineProperties(s,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
# wgs84&gcj-02&bd09 坐标互转工具

使用:

```bash
npm i @wuch96/coords-translate
```

```typescript
import {
  wgs_gcj,
  gcj_wgs,
  gcj_bd,
  bd_gcj,
  wgs_bd,
  bd_wgs,
} from '@wuch96/coords-translate';
const res = wgs_gcj({ lon: 123, lat: 12 });
```

/* EnglishVerse – VÙNG HOANG DÃ vòng 1 quanh thành phố (Lv.1–25). Xem docs/design/voice-combat.html mục 1.
   5 hướng = 5 mùa: N đông (Frost Peaks) · NE thu (Maple Highlands) · E sa mạc (Sunset Canyon) · SE biển nhiệt đới (Coral Coast) · S xuân (Blossom Valley).
   Vòng 1 = ngoài thành phố (|x| > 150 hoặc |z| > 150), x > -150, max(|x|,|z|) ≤ 240. Vòng 2 (240..330) làm sau: chỉ cần mở rộng R1 và thêm bãi.
   Cách dựng cho nhẹ máy: nền đất = 1 ảnh vẽ bằng canvas (3 mảng phẳng, 1 lần vẽ); cây / đá / trang trí = khối gộp theo ô 40 m, tô màu theo đỉnh,
   chỉ vẽ ô gần người chơi (xem "quản lý hiển thị" cuối file) → thường < 40 lần vẽ ở vùng hoang dã. Vật cản lớn dùng solid(x, z, hw, hd) của lõi game.
   API: WILDS.walkable / sectorAt / gates / spawnPoints / drawMap, buildWilds(). Dữ liệu trả về từ sectorAt là đối tượng dùng chung: ĐỪNG sửa. */
const WILDS = (function () {
  const CITY = 150, R1 = 240, SEA = 227;   // SEA: từ đây ra ngoài (hướng SE) là biển, không đi được
  const SEC = {
    N: { dir: "N", ring: 1, season: "winter", name: "Frost Peaks" },
    NE: { dir: "NE", ring: 1, season: "autumn", name: "Maple Highlands" },
    E: { dir: "E", ring: 1, season: "desert", name: "Sunset Canyon" },
    SE: { dir: "SE", ring: 1, season: "tropic", name: "Coral Coast" },
    S: { dir: "S", ring: 1, season: "spring", name: "Blossom Valley" }
  };
  const ORDER = ["N", "NE", "E", "SE", "S"], A0 = { N: -45, NE: 30, E: 60, SE: 120, S: 150 }, A1 = { N: 30, NE: 60, E: 120, SE: 150, S: 225 };
  const ICON = { N: "❄", NE: "🍁", E: "🌵", SE: "🌴", S: "🌸" };
  // Cổng: (x, z) = chỗ đứng NGAY NGOÀI cổng phía hoang dã; (cx, cz) = tâm cổng ở mép thành phố; th = góc xoay cổng
  const GATES = [
    { dir: "N", cx: 0, cz: -150, x: 0, z: -156, th: 0, dx: 0, dz: -1 },
    { dir: "NE", cx: 150, cz: -150, x: 157, z: -157, th: -Math.PI / 4, dx: 0.7071, dz: -0.7071 },
    { dir: "E", cx: 150, cz: 0, x: 156, z: 0, th: -Math.PI / 2, dx: 1, dz: 0 },
    { dir: "SE", cx: 150, cz: 150, x: 157, z: 157, th: Math.PI / 4, dx: 0.7071, dz: 0.7071 },
    { dir: "S", cx: 0, cz: 150, x: 0, z: 156, th: 0, dx: 0, dz: 1 }
  ];
  const GATE_OF = {}; GATES.forEach(g => GATE_OF[g.dir] = g);
  const PATH_LEN = 78, PATH_AMP = 3.5;   // đường mòn từ cổng đi vào vùng hoang dã

  const ang = (x, z) => Math.atan2(x, -z) * 180 / Math.PI;
  function dirOf(a) { if (a >= 150 || a <= -135) return "S"; if (a >= 120) return "SE"; if (a >= 60) return "E"; if (a >= 30) return "NE"; if (a >= -45) return "N"; return null; }
  const cheb = (x, z) => Math.max(Math.abs(x), Math.abs(z));
  const inRegion = (x, z) => x > -CITY && cheb(x, z) > CITY && cheb(x, z) <= R1;
  function dirAny(x, z) { const a = ang(x, z); return dirOf(a) || (a < -90 ? "S" : "N"); }   // cả điểm nằm ngoài vùng (phần tô nền, phông xa)
  function walkable(x, z) { if (!inRegion(x, z)) return false; return !(dirOf(ang(x, z)) === "SE" && cheb(x, z) > SEA); }
  function sectorAt(x, z) { if (!inRegion(x, z)) return null; const d = dirOf(ang(x, z)); return d ? SEC[d] : null; }

  /* ---------- số ngẫu nhiên cố định (mọi máy thấy cùng một bản đồ) + nhiễu ---------- */
  let seed = 20261113;
  const rnd = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const hash = (ix, iy) => { let h = (Math.imul(ix, 374761393) + Math.imul(iy, 668265263)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  function vnoise(x, y) { const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy), a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; }
  const sm = (a, b, v) => { const t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); };

  /* ---------- đường mòn + cảnh cố định (dùng cho cả vẽ nền và rải cây) ---------- */
  const PATHS = GATES.map(g => ({ x0: g.cx, z0: g.cz, dx: g.dx, dz: g.dz }));
  function pathDist(x, z) {   // khoảng cách tới đường mòn gần nhất (Infinity nếu xa)
    let best = Infinity;
    for (let i = 0; i < 5; i++) { const p = PATHS[i], rx = x - p.x0, rz = z - p.z0, al = rx * p.dx + rz * p.dz; if (al < -2 || al > PATH_LEN) continue;
      const d = Math.abs(-rx * p.dz + rz * p.dx - PATH_AMP * Math.sin(al * 0.07) * sm(0, 14, al)); if (d < best) best = d; }
    return best;
  }
  const LAKE = { x: -72, z: -196, rx: 19, rz: 12 };   // hồ băng (đi được: mặt băng)
  const lakeE = (x, z) => { const a = (x - LAKE.x) / LAKE.rx, b = (z - LAKE.z) / LAKE.rz; return a * a + b * b; };
  const streamX = z => -45 + 14 * Math.sin((z - 150) * 0.08);   // suối ở vùng xuân
  const streamW = z => 1.9 + 0.4 * Math.sin(z * 0.2);
  const BRIDGE_Z = 188;

  /* ---------- 1. NỀN ĐẤT: một ảnh canvas phủ cả vùng ---------- */
  const TX0 = -180, TX1 = 270, TZ0 = -270, TZ1 = 270, TS = 1024;
  const C = h => [(h >> 16) & 255, (h >> 8) & 255, h & 255];
  const mixc = (o, a, b, t) => { o[0] = a[0] + (b[0] - a[0]) * t; o[1] = a[1] + (b[1] - a[1]) * t; o[2] = a[2] + (b[2] - a[2]) * t; };
  const K = {
    cityGrass: C(0x8fd17a),
    w1: C(0xf4f8fc), w2: C(0xdde8f3), ice1: C(0xb2e1f4), ice2: C(0xe4f5fd), rim: C(0xc4d2de), rockW: C(0xc3ccd6),
    a1: C(0xdcaa45), a2: C(0xcf7b2b), a3: C(0xb4431f), a4: C(0xeac95e),
    d1: C(0xe7cb92), d2: C(0xd8ab68), d3: C(0xc8704a),
    g1: C(0x6cb64c), g2: C(0x58a24a), sand: C(0xf4e4b0), wet: C(0xd9c78f), sea1: C(0x6dd7ea), sea2: C(0x2fa9de), foam: C(0xffffff),
    s1: C(0x88da60), s2: C(0x6cc94c), s3: C(0xa8ea7c), water1: C(0x6ec6ff), water2: C(0x9ad8ff), bank: C(0x4f9a3a),
    fl: [C(0xff7eb6), C(0xffd43b), C(0xffffff), C(0xb197fc)]
  };
  const PATHC = { N: C(0xc3cdd8), NE: C(0xb8863f), E: C(0xcfa56a), SE: C(0xe9d6a4), S: C(0xc9ae7e) };
  const tmpW = [0, 0, 0, 0, 0], tmp = [0, 0, 0];
  const CEN = { N: -7.5, NE: 45, E: 90, SE: 135, S: 187.5 }, HW = { N: 37.5, NE: 15, E: 30, SE: 15, S: 37.5 };
  function paintSector(d, x, z, n1, n2, m, o) {
    switch (d) {
      case "N": { mixc(o, K.w1, K.w2, n1); const e = lakeE(x, z); if (e < 1) { mixc(o, K.ice1, K.ice2, n2); if (e > 0.82) mixc(o, o, K.w1, (e - 0.82) * 5); } else if (e < 1.35) mixc(o, o, K.rim, (1.35 - e) / 0.35 * 0.7); else if (n2 > 0.8) mixc(o, o, K.rockW, (n2 - 0.8) * 2.4); break; }
      case "NE": { mixc(o, K.a1, K.a2, n1); if (n2 > 0.68) mixc(o, o, K.a3, Math.min(1, (n2 - 0.68) * 3)); else if (n2 < 0.24) mixc(o, o, K.a4, (0.24 - n2) * 3); break; }
      case "E": { const b = 0.5 + 0.5 * Math.sin((x * 0.7 + z * 0.45) * 0.3 + n1 * 7); mixc(o, K.d1, K.d2, b); if (n2 > 0.72) mixc(o, o, K.d3, Math.min(1, (n2 - 0.72) * 3)); break; }
      case "SE": { mixc(o, K.g1, K.g2, n1); mixc(o, o, K.sand, sm(190, 206, m)); mixc(o, o, K.wet, sm(216, 225, m));
        if (m > SEA - 1.2) { const w = sm(SEA - 0.6, SEA + 0.6, m); mixc(tmp, K.sea1, K.sea2, sm(SEA + 4, SEA + 16, m)); tmp[0] += (n2 - 0.5) * 18; tmp[1] += (n2 - 0.5) * 18; mixc(o, o, tmp, w);
          const f = Math.max(0, 1 - Math.abs(m - SEA) / 1.1) * (0.55 + n2 * 0.5); if (f > 0) mixc(o, o, K.foam, Math.min(0.85, f)); } break; }
      default: { mixc(o, K.s1, K.s2, n1); if (n2 > 0.64) mixc(o, o, K.s3, Math.min(1, (n2 - 0.64) * 3));
        if (z > 148) { const dd = Math.abs(x - streamX(z)), w = streamW(z); if (dd < w) mixc(o, K.water1, K.water2, n2); else if (dd < w + 1.3) mixc(o, o, K.bank, 0.55); }
        if (hash(Math.floor(x * 1.7), Math.floor(z * 1.7)) > 0.965) mixc(o, o, K.fl[Math.floor(hash(Math.floor(z), Math.floor(x)) * 4)], 0.85); }
    }
  }
  function paintGround() {
    const cv = document.createElement("canvas"); cv.width = cv.height = TS;
    const cx = cv.getContext("2d"), img = cx.createImageData(TS, TS), px = img.data, o = [0, 0, 0], o2 = [0, 0, 0];
    for (let j = 0; j < TS; j++) {
      const z = TZ0 + (j + 0.5) * (TZ1 - TZ0) / TS;
      for (let i = 0; i < TS; i++) {
        const x = TX0 + (i + 0.5) * (TX1 - TX0) / TS, m = cheb(x, z); if (m < CITY - 1.5) continue;   // phần trong thành phố không phủ
        const a = ang(x, z);
        const n1 = vnoise(x * 0.06, z * 0.06) * 0.6 + vnoise(x * 0.17, z * 0.17) * 0.4, n2 = vnoise(x * 0.09 + 31, z * 0.09 + 17);
        // trọng số mùa theo góc: trộn mượt ±6° quanh ranh giới
        let sum = 0, bi = "N", bd = 1e9;
        for (let k = 0; k < 5; k++) { const dn = ORDER[k], dd = Math.abs(((a - CEN[dn] + 540) % 360) - 180), dist = Math.max(0, dd - HW[dn]); if (dist < bd) { bd = dist; bi = dn; } const w = Math.max(0, 1 - dist / 6); tmpW[k] = w; sum += w; }
        if (sum === 0) { for (let k = 0; k < 5; k++) tmpW[k] = ORDER[k] === bi ? 1 : 0; sum = 1; }
        o[0] = o[1] = o[2] = 0; let dom = bi, dw = 0;
        for (let k = 0; k < 5; k++) { const w = tmpW[k] / sum; if (w < 0.004) continue; if (w > dw) { dw = w; dom = ORDER[k]; } paintSector(ORDER[k], x, z, n1, n2, m, o2); o[0] += o2[0] * w; o[1] += o2[1] * w; o[2] += o2[2] * w; }
        const pd = pathDist(x, z);   // đường mòn
        if (pd < 2.2) { const t = 1 - sm(1.3, 2.2, pd + (n2 - 0.5) * 0.7); if (t > 0) { mixc(o, o, PATHC[dom], t * 0.92); } }
        const g = GATE_OF[dom]; if (g) { const dd = Math.hypot(x - g.x, z - g.z); if (dd < 9) mixc(o, o, PATHC[dom], (1 - sm(6, 9, dd)) * 0.9); }
        o[0] *= 0.86; o[1] *= 0.86; o[2] *= 0.86;   // đèn trong game sáng hơn màu thật nên tô sậm lại một chút
        const t = sm(0, 9, m - CITY); if (t < 1) { mixc(o, K.cityGrass, o, t); }   // chuyển tiếp mép thành phố
        const q = (j * TS + i) * 4; px[q] = o[0]; px[q + 1] = o[1]; px[q + 2] = o[2]; px[q + 3] = 255;
      }
    }
    cx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(cv); tex.anisotropy = 4; return tex;
  }
  function groundMesh() {
    // 3 mảng: phía bắc, phía đông (giữa), phía nam — phủ khung hình chữ C quanh thành phố (chồng 1 m vào thành phố)
    const Q = [[TX0, TZ0, TX1, -CITY + 1], [CITY - 1, -CITY + 1, TX1, CITY - 1], [TX0, CITY - 1, TX1, TZ1]];
    const pos = [], uv = [], idx = [];
    Q.forEach((q, n) => { const [x0, z0, x1, z1] = q, b = n * 4;
      [[x0, z0], [x1, z0], [x1, z1], [x0, z1]].forEach(p => { pos.push(p[0], 0, p[1]); uv.push((p[0] - TX0) / (TX1 - TX0), 1 - (p[1] - TZ0) / (TZ1 - TZ0)); });
      idx.push(b, b + 3, b + 1, b + 1, b + 3, b + 2); });
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(pos.map((v, i) => i % 3 === 1 ? 1 : 0), 3)); g.setIndex(idx);
    const m = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ map: paintGround() })); m.position.y = -0.02; m.userData.flat = true; m.userData.flag = true; m.receiveShadow = true;
    return m;
  }

  /* ---------- 2. KHỐI GỘP: cây / đá / hàng rào... (tô màu theo đỉnh, gộp theo ô 40 m) ---------- */
  const CH = 40, chunks = new Map(), TP = {};
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3(), _a = new THREE.Vector3(), _b = new THREE.Vector3(), _c = new THREE.Vector3(), _n = new THREE.Vector3();
  function tpl(g, ty, tz) { if (ty || tz) g.translate(0, ty || 0, tz || 0); return g.toNonIndexed().attributes.position.array; }
  function initTpl() {
    TP.cone6 = tpl(new THREE.ConeGeometry(1, 1, 6, 1, true), 0.5);
    TP.cyl5 = tpl(new THREE.CylinderGeometry(1, 1, 1, 5), 0.5);
    TP.tcyl8 = tpl(new THREE.CylinderGeometry(0.7, 1, 1, 8), 0.5);
    TP.box = tpl(new THREE.BoxGeometry(1, 1, 1), 0.5);
    TP.leaf = tpl(new THREE.BoxGeometry(1, 1, 1), 0.5, 0.5);   // từ gốc kéo dài ra +z (lá cọ)
    TP.ico = tpl(new THREE.IcosahedronGeometry(1, 0));
    TP.sph = tpl(new THREE.SphereGeometry(1, 7, 5));
  }
  function chunkAt(x, z) { const k = Math.floor(x / CH) + "," + Math.floor(z / CH); let c = chunks.get(k); if (!c) { c = { p: [], c: [], n: [] }; chunks.set(k, c); } return c; }
  function put(tn, col, x, y, z, sx, sy, sz, ry, rx, rz, jit) {   // đặt 1 khối mẫu (cone6 / cyl5 / box / ico / sph / leaf) vào ô gộp
    const P = TP[tn], C = chunkAt(x, z), cp = C.p, cc = C.c, cn = C.n;
    _e.set(rx || 0, ry || 0, rz || 0, "YXZ"); _q.setFromEuler(_e); _m.compose(_p.set(x, y, z), _q, _s.set(sx, sy === undefined ? sx : sy, sz === undefined ? sx : sz));
    const j = 1 + (rnd() - 0.5) * (jit === undefined ? 0.16 : jit), r = Math.min(1, ((col >> 16) & 255) / 255 * j), g = Math.min(1, ((col >> 8) & 255) / 255 * j), b = Math.min(1, (col & 255) / 255 * j);
    for (let i = 0; i < P.length; i += 9) {
      _a.set(P[i], P[i + 1], P[i + 2]).applyMatrix4(_m); _b.set(P[i + 3], P[i + 4], P[i + 5]).applyMatrix4(_m); _c.set(P[i + 6], P[i + 7], P[i + 8]).applyMatrix4(_m);
      _n.subVectors(_c, _b).cross(_p.subVectors(_a, _b)).normalize();
      cp.push(_a.x, _a.y, _a.z, _b.x, _b.y, _b.z, _c.x, _c.y, _c.z);
      for (let k = 0; k < 3; k++) { cc.push(r, g, b); cn.push(_n.x, _n.y, _n.z); }
    }
  }

  /* ---------- 3. CÂY, ĐÁ, TRANG TRÍ (mỗi hàm tự gọi solid() cho vật to) ---------- */
  const occ = [];   // chỗ đã chiếm {x, z, r}
  const taken = (x, z, r) => occ.some(o => (o.x - x) * (o.x - x) + (o.z - z) * (o.z - z) < (o.r + r) * (o.r + r));
  const reserve = (x, z, r) => occ.push({ x, z, r });
  function pine(x, z, s, sol) {
    put("cyl5", 0x6d4b33, x, 0, z, 0.22 * s, 0.9 * s, 0.22 * s);
    for (let i = 0; i < 3; i++) { const r = (1.55 - 0.42 * i) * s, y = (0.7 + 0.85 * i) * s, h = 1.35 * s, ry = rnd() * 6;
      put("cone6", 0x3f7a5c, x, y, z, r, h, r, ry); put("cone6", 0xffffff, x, y + 0.42 * s, z, r * 0.74, h * 0.72, r * 0.74, ry, 0, 0, 0.04); }
    if (sol) solid(x, z, 0.5 * s, 0.5 * s);
  }
  function maple(x, z, s, sol) {
    const cols = [0xd9481f, 0xf08a24, 0xe9b82f, 0xc23a1c];
    put("cyl5", 0x7a5236, x, 0, z, 0.26 * s, 1.7 * s, 0.26 * s);
    put("ico", cols[(rnd() * 4) | 0], x, 2.5 * s, z, 1.5 * s, 1.2 * s, 1.5 * s, rnd() * 6);
    put("ico", cols[(rnd() * 4) | 0], x + 0.8 * s, 2.0 * s, z + 0.3 * s, s, 0.85 * s, s, rnd() * 6);
    put("ico", cols[(rnd() * 4) | 0], x - 0.7 * s, 2.1 * s, z - 0.4 * s, 0.95 * s, 0.8 * s, 0.95 * s, rnd() * 6);
    if (sol) solid(x, z, 0.45 * s, 0.45 * s);
  }
  function cactus(x, z, s, sol) {
    const c = 0x4f9d4e;
    put("box", c, x, 0, z, 0.5 * s, 2.3 * s, 0.5 * s, rnd() * 3);
    put("box", c, x + 0.5 * s, 0.95 * s, z, 0.55 * s, 0.3 * s, 0.3 * s); put("box", c, x + 0.7 * s, 0.95 * s, z, 0.3 * s, 0.9 * s, 0.3 * s);
    if (rnd() < 0.7) { put("box", c, x - 0.45 * s, 1.3 * s, z, 0.5 * s, 0.3 * s, 0.3 * s); put("box", c, x - 0.65 * s, 1.3 * s, z, 0.3 * s, 0.7 * s, 0.3 * s); }
    put("ico", 0xff7eb6, x, 2.35 * s, z, 0.18 * s);
    if (sol) solid(x, z, 0.4 * s, 0.4 * s);
  }
  function mesa(x, z, w, h, d, sol) {
    put("box", 0xb55234, x, 0, z, w, h * 0.5, d, 0, 0, 0, 0.1); put("box", 0xc9663f, x, h * 0.5, z, w * 0.82, h * 0.3, d * 0.82, 0, 0, 0, 0.1); put("box", 0xdc7b4b, x, h * 0.8, z, w * 0.6, h * 0.2, d * 0.6, 0, 0, 0, 0.1);
    if (sol) solid(x, z, w / 2, d / 2);
  }
  function rock(x, z, r, col, cap, sol) {
    put("ico", col, x, r * 0.45, z, r, r * 0.7, r * 0.85, rnd() * 6); if (cap) put("ico", 0xffffff, x, r * 0.78, z, r * 0.7, r * 0.4, r * 0.6, rnd() * 6, 0, 0, 0.03);
    if (sol && r >= 1.1) solid(x, z, r * 0.8, r * 0.8);
  }
  function column(x, z, h, sol) {
    put("box", 0xd9c79c, x, 0, z, 1.5, 0.35, 1.5); put("cyl5", 0xe8d6ab, x, 0.35, z, 0.55, h, 0.55, rnd() * 3);
    if (h > 3) put("box", 0xd9c79c, x, 0.35 + h, z, 1.4, 0.3, 1.4);
    if (sol) solid(x, z, 0.6, 0.6);
  }
  function palm(x, z, s, sol) {
    const lx = (rnd() - 0.5) * 0.5, lz = (rnd() - 0.5) * 0.5;
    for (let i = 0; i < 4; i++) put("cyl5", 0x9c7448, x + lx * i * s * 0.6, i * 1.2 * s, z + lz * i * s * 0.6, (0.26 - i * 0.03) * s, 1.25 * s, (0.26 - i * 0.03) * s, 0, 0, 0, 0.1);
    const cx = x + lx * 3.6 * s * 0.6, cz = z + lz * 3.6 * s * 0.6, cy = 4.8 * s;
    for (let i = 0; i < 7; i++) put("leaf", i % 2 ? 0x2e9e4a : 0x3cb85a, cx, cy, cz, 0.95 * s, 0.12 * s, 3.0 * s, i * 0.9 + rnd() * 0.4, 0.55 + rnd() * 0.25);
    put("sph", 0x6b4a2f, cx + 0.2 * s, cy - 0.3 * s, cz, 0.22 * s); put("sph", 0x6b4a2f, cx - 0.2 * s, cy - 0.3 * s, cz + 0.1 * s, 0.22 * s);
    if (sol) solid(x + lx * 0.6 * s, z + lz * 0.6 * s, 0.4 * s, 0.4 * s);
  }
  function mangrove(x, z, s, sol) {
    put("ico", 0x2f7d46, x, 2.0 * s, z, 1.4 * s, 0.9 * s, 1.4 * s, rnd() * 6);
    for (let i = 0; i < 5; i++) { const f = i * 1.2566 + rnd() * 0.4, th = 0.45; put("cyl5", 0x6b4a2f, x + Math.cos(f) * 0.8 * s, 0, z + Math.sin(f) * 0.8 * s, 0.08 * s, 2.0 * s, 0.08 * s, 0, -th * Math.sin(f), th * Math.cos(f), 0.1); }
    if (sol) solid(x, z, 0.9 * s, 0.9 * s);
  }
  function bamboo(x, z, sol) {
    for (let i = 0; i < 6; i++) { const dx = (rnd() - 0.5) * 1.6, dz = (rnd() - 0.5) * 1.6, h = 4.5 + rnd() * 2.5;
      put("cyl5", i % 2 ? 0x7bc558 : 0x5da843, x + dx, 0, z + dz, 0.1, h, 0.1, 0, 0, 0, 0.1); put("ico", 0x4e9e3a, x + dx, h, z + dz, 0.55, 0.25, 0.55, rnd() * 6); }
    if (sol) solid(x, z, 1.0, 1.0);
  }
  function lushTree(x, z, s, cherry, sol) {
    const cs = cherry ? [0xf7a8c4, 0xffc2d8, 0xf48fb1] : [0x62c24a, 0x7edb5a, 0x4fb046];
    put("cyl5", 0x7b5a3a, x, 0, z, 0.25 * s, 1.6 * s, 0.25 * s);
    put("ico", cs[(rnd() * 3) | 0], x, 2.4 * s, z, 1.4 * s, 1.1 * s, 1.4 * s, rnd() * 6); put("ico", cs[(rnd() * 3) | 0], x + 0.7 * s, 1.9 * s, z + 0.3 * s, 0.9 * s, 0.75 * s, 0.9 * s, rnd() * 6);
    if (sol) solid(x, z, 0.45 * s, 0.45 * s);
  }
  function flowers(x, z) { const cs = [0xff7eb6, 0xffd43b, 0xffffff, 0xb197fc, 0xff922b]; const c = cs[(rnd() * 5) | 0]; for (let i = 0; i < 5; i++) { const dx = (rnd() - 0.5) * 1.6, dz = (rnd() - 0.5) * 1.6; put("cone6", 0x4e9e3a, x + dx, 0, z + dz, 0.05, 0.3, 0.05); put("ico", i === 0 ? 0xffd43b : c, x + dx, 0.34, z + dz, 0.13); } }
  function mound(x, z, s) { put("sph", 0xffffff, x, 0, z, 1.4 * s, 0.6 * s, 1.2 * s, rnd() * 3, 0, 0, 0.04); }
  function crystals(x, z) { for (let i = 0; i < 4; i++) put("cone6", 0x9fe0ff, x + (rnd() - 0.5) * 1.4, 0, z + (rnd() - 0.5) * 1.4, 0.3, 1.0 + rnd() * 1.2, 0.3, 0, (rnd() - 0.5) * 0.4, (rnd() - 0.5) * 0.4, 0.05); }
  function dune(x, z) { put("sph", 0xe9cf98, x, -0.2, z, 5 + rnd() * 4, 1.2 + rnd(), 4 + rnd() * 3, rnd() * 3, 0, 0, 0.05); }
  function pumpkin(x, z) { put("sph", 0xf08a1c, x, 0.05, z, 0.45, 0.35, 0.45); put("cone6", 0x4e9e3a, x, 0.35, z, 0.08, 0.18, 0.08); }
  function hay(x, z, sol) { put("cyl5", 0xe3b341, x, 0, z, 0.95, 1.2, 0.95); put("cone6", 0xc99a2e, x, 1.2, z, 1.05, 0.7, 1.05); if (sol) solid(x, z, 0.9, 0.9); }
  function coral(x, z) { const c = [0xff7a9c, 0xff9f68, 0xd96bd0][(rnd() * 3) | 0]; for (let i = 0; i < 4; i++) put("cone6", c, x + (rnd() - 0.5) * 1.2, 0, z + (rnd() - 0.5) * 1.2, 0.22, 0.6 + rnd() * 0.5, 0.22, 0, (rnd() - 0.5) * 0.6, (rnd() - 0.5) * 0.6); }
  function snowman(x, z) {
    put("sph", 0xffffff, x, 0.1, z, 0.66, 0.6, 0.66, 0, 0, 0, 0.03); put("sph", 0xffffff, x, 0.95, z, 0.48, 0.45, 0.48, 0, 0, 0, 0.03); put("sph", 0xffffff, x, 1.65, z, 0.35, 0.34, 0.35, 0, 0, 0, 0.03);
    put("cone6", 0xff8f1f, x, 1.67, z + 0.3, 0.07, 0.45, 0.07, 0, 1.5708); put("ico", 0x222222, x - 0.12, 1.78, z + 0.3, 0.05); put("ico", 0x222222, x + 0.12, 1.78, z + 0.3, 0.05);
    put("cyl5", 0xd33a2c, x, 1.32, z, 0.4, 0.14, 0.4); put("cyl5", 0x2d3037, x, 1.95, z, 0.26, 0.3, 0.26); put("cyl5", 0x2d3037, x, 1.95, z, 0.4, 0.05, 0.4);
    solid(x, z, 0.7, 0.7);
  }
  function windmill(x, z) {
    put("tcyl8", 0xf4e4c1, x, 0, z, 3.4, 6.4, 3.4); put("cone6", 0xb5442a, x, 6.4, z, 3.2, 2.6, 3.2); put("box", 0x7a5236, x, 0, z + 1.6, 1.0, 1.7, 0.3);
    put("box", 0x6bb5e8, x - 1.0, 3.2, z + 1.55, 0.7, 0.9, 0.2); put("box", 0x6bb5e8, x + 1.0, 3.2, z + 1.55, 0.7, 0.9, 0.2);
    solid(x, z, 3.0, 3.0);
    const sail = new THREE.Group(), wood = 0x8a5a33, cloth = 0xfff7e6;   // cánh quạt quay (đưa vào spinners của lõi game)
    lb(sail, 0.45, 8.4, 0.2, wood, 0, 0, 0); lb(sail, 8.4, 0.45, 0.2, wood, 0, 0, 0);
    [[0, 2.7, 1], [0, -2.7, 1], [2.7, 0, 0], [-2.7, 0, 0]].forEach(p => lb(sail, p[2] ? 1.3 : 2.4, p[2] ? 2.4 : 1.3, 0.12, cloth, p[0] + (p[2] ? 0.8 : 0), p[1] + (p[2] ? 0 : 0.8), 0.12));
    lb(sail, 0.8, 0.8, 0.6, 0x5a3a22, 0, 0, 0.1);
    sail.position.set(x, 5.6, z + 2.3); sail.userData.flag = true; scene.add(sail); if (typeof spinners !== "undefined") spinners.push(sail);
    managed.push({ o: sail, x, z, r: 8 });
  }
  function boat(x, z) { put("box", 0x9a6b3f, x, 0, z, 1.7, 0.55, 3.6); put("box", 0xc79a63, x, 0.4, z, 1.3, 0.2, 3.1); put("box", 0xf4f1e8, x, 0.55, z - 0.3, 0.1, 1.9, 0.1); solid(x, z, 0.95, 1.9); }
  function bridge(x, z) {
    put("box", 0x9b6b3d, x, 0.08, z, 7, 0.28, 2.6, 0, 0, 0, 0.05); [-1.15, 1.15].forEach(dz => { put("box", 0x7a5236, x, 0.35, z + dz, 7, 0.1, 0.12); [-3.2, 0, 3.2].forEach(dx => put("box", 0x7a5236, x + dx, 0.08, z + dz, 0.18, 0.95, 0.18)); });
  }

  /* ---------- 4. CỔNG (gỗ + đá, biển tên vùng) ---------- */
  const managed = [];   // vật cần ẩn/hiện theo khoảng cách {o, x, z, r}
  function signTex(g) {
    const S = SEC[g.dir], cv = document.createElement("canvas"); cv.width = 512; cv.height = 160; const x = cv.getContext("2d");
    const bg = { N: "#35506b", NE: "#8a4a1c", E: "#a4492b", SE: "#146a86", S: "#2f7a3e" }[g.dir];
    x.fillStyle = "#5a3a22"; x.fillRect(0, 0, 512, 160); x.fillStyle = bg; x.fillRect(8, 8, 496, 144); x.strokeStyle = "#f3d9a4"; x.lineWidth = 4; x.strokeRect(14, 14, 484, 132);
    x.textAlign = "center"; x.textBaseline = "middle"; x.fillStyle = "#fff"; x.font = "bold 56px system-ui, 'Segoe UI', sans-serif"; x.fillText(S.name, 266, 66);
    x.font = "bold 28px system-ui, 'Segoe UI', sans-serif"; x.fillStyle = "#ffe08a"; x.fillText("Recommended Lv.1–25", 266, 118);
    x.font = "44px system-ui, 'Apple Color Emoji', 'Segoe UI Emoji'"; x.fillStyle = "#fff"; x.fillText(ICON[g.dir], 44, 74);
    const t = new THREE.CanvasTexture(cv); t.anisotropy = 4; return t;
  }
  function buildGate(g) {
    const th = g.th, c = Math.cos(th), s = Math.sin(th), L = (lx, lz) => [g.cx + lx * c + lz * s, g.cz - lx * s + lz * c];
    const accent = { N: 0x4f9de8, NE: 0xd33a2c, E: 0xc8573a, SE: 0x1ca6c9, S: 0xff8fc0 }[g.dir];
    const pl = (tn, col, lx, y, lz, sx, sy, sz, rx) => { const p = L(lx, lz); put(tn, col, p[0], y, p[1], sx, sy, sz, th, rx); };
    [-1, 1].forEach(k => {
      pl("box", 0x8e98a3, k * 5.6, 0, 0, 1.8, 1.0, 1.8); pl("box", 0x7a5236, k * 5.6, 1.0, 0, 0.95, 5.0, 0.95); pl("box", 0x9aa5b1, k * 5.6, 6.0, 0, 1.3, 0.35, 1.3);
      pl("cone6", accent, k * 5.6, 6.3, 0, 0.9, 1.0, 0.9);
      const p = L(k * 5.6, 0); solid(p[0], p[1], 1.0, 1.0);
      // cánh hàng rào hai bên cổng (đi vòng vẫn được nếu muốn, nhưng cổng là lối chính)
      for (let i = 0; i < 4; i++) { const lx = k * (8 + i * 3.6); pl("box", 0x8a5a33, lx, 0, 0, 0.22, 1.3, 0.22); pl("box", 0x8a5a33, lx - k * 1.8, 0.55, 0, 3.6, 0.12, 0.1); pl("box", 0x8a5a33, lx - k * 1.8, 0.98, 0, 3.6, 0.12, 0.1); }
      const w0 = L(k * 8, 0), w1 = L(k * 22.4, 0);
      if (Math.abs(s) < 0.01 || Math.abs(c) < 0.01) solid((w0[0] + w1[0]) / 2, (w0[1] + w1[1]) / 2, Math.abs(c) > 0.5 ? 7.2 : 0.4, Math.abs(c) > 0.5 ? 0.4 : 7.2);
      else for (let i = 0; i < 9; i++) { const q = L(k * (8.5 + i * 1.6), 0); solid(q[0], q[1], 0.9, 0.9); }
    });
    pl("box", 0x7a5236, 0, 5.0, 0, 12.2, 0.8, 0.9); pl("box", 0x9b6b3d, 0, 5.8, 0, 13.2, 0.25, 1.6);
    const tex = signTex(g), mt = new THREE.MeshBasicMaterial({ map: tex, side: THREE.FrontSide });
    [0, 1].forEach(f => { const m = new THREE.Mesh(new THREE.PlaneGeometry(8.4, 2.625), mt), p = L(0, f ? -0.48 : 0.48); m.position.set(p[0], 3.9, p[1]); m.rotation.y = th + (f ? Math.PI : 0); m.userData.flag = true; m.userData.flat = true; scene.add(m); managed.push({ o: m, x: p[0], z: p[1], r: 10 }); });
    [-3.9, 3.9].forEach(k => { const p = L(k, 0); put("cyl5", 0x4a3320, p[0], 3.85, p[1], 0.05, 1.15, 0.05); });   // dây treo biển
    reserve(g.x, g.z, 16);
  }

  /* ---------- 5. RẢI CÂY / ĐÁ / PHÔNG THEO MÙA + RANH NGOÀI ---------- */
  const fbm = (x, z) => vnoise(x * 0.035 + 7, z * 0.035 + 3) * 0.65 + vnoise(x * 0.09, z * 0.09) * 0.35;
  function clear(x, z, r) {
    const m = cheb(x, z); if (m < CITY + 4 || m > R1 - 3 || !inRegion(x, z) || !walkable(x, z)) return false;
    if (dirOf(ang(x, z)) === "SE" && m > SEA - 3) return false;
    if (pathDist(x, z) < 5 + r) return false;
    if (lakeE(x, z) < 1.5) return false;
    if (z > 148 && Math.abs(x - streamX(z)) < streamW(z) + 2.5 + r) return false;
    return !taken(x, z, r);
  }
  function landmarks() {
    // BẮC: người tuyết, đá tuyết, tinh thể băng quanh hồ
    [[22, -184], [27, -190], [-30, -176]].forEach(p => { snowman(p[0], p[1]); reserve(p[0], p[1], 2); });
    [[60, -214, 3.2], [66, -208, 2.2], [55, -208, 1.8], [-110, -170, 2.6], [-116, -176, 1.8]].forEach(p => { rock(p[0], p[1], p[2], 0x8f9aa8, true, true); reserve(p[0], p[1], p[2] + 1); });
    for (let i = 0; i < 9; i++) { const a = rnd() * 6.28, x = LAKE.x + Math.cos(a) * (LAKE.rx + 3 + rnd() * 2), z = LAKE.z + Math.sin(a) * (LAKE.rz + 3 + rnd() * 2); crystals(x, z); }
    // ĐÔNG BẮC: cối xay gió, đống rơm, bí ngô
    windmill(190, -198); reserve(190, -198, 8);
    [[168, -176], [172, -182], [165, -183]].forEach(p => { hay(p[0], p[1], true); reserve(p[0], p[1], 2); });
    for (let i = 0; i < 10; i++) { const x = 205 + rnd() * 12, z = -172 + rnd() * 10; pumpkin(x, z); }
    reserve(210, -168, 9);
    // ĐÔNG: mesa đỏ, cột phế tích, vòm đá
    [[215, -62, 9, 11, 7], [203, 64, 8, 9, 8], [188, -104, 7, 8, 6], [226, 18, 6, 7, 6], [182, 100, 6, 7, 6]].forEach(p => { mesa(p[0], p[1], p[2], p[3], p[4], true); reserve(p[0], p[1], p[2] * 0.7 + 1); });
    for (let i = 0; i < 8; i++) { const a = i / 8 * 6.28, x = 204 + Math.cos(a) * 7, z = -30 + Math.sin(a) * 7; column(x, z, i % 3 === 0 ? 2.0 : 3.8 + (i % 2), true); }
    reserve(204, -30, 11);
    column(226, 40, 4.6, true); column(233, 40, 4.6, true); put("box", 0xd9c79c, 229.5, 4.95, 40, 9.2, 0.7, 1.7); reserve(229, 40, 7);
    // ĐÔNG NAM: thuyền mắc cạn, san hô ven bờ
    boat(207, 193); reserve(207, 193, 4);
    for (let i = 0; i < 12; i++) { const m = 211 + rnd() * 9, a = (122 + rnd() * 26) * Math.PI / 180, x = Math.sin(a) * m / Math.max(Math.abs(Math.sin(a)), Math.abs(Math.cos(a))), z = -Math.cos(a) * m / Math.max(Math.abs(Math.sin(a)), Math.abs(Math.cos(a))); if (walkable(x, z)) coral(x, z); }
    // NAM: cầu gỗ qua suối
    bridge(streamX(BRIDGE_Z), BRIDGE_Z); reserve(streamX(BRIDGE_Z), BRIDGE_Z, 5);
  }
  function scatter() {
    for (let gx = -150; gx < R1; gx += 7) for (let gz = -R1; gz < R1; gz += 7) {
      const x = gx + rnd() * 7, z = gz + rnd() * 7;
      if (!inRegion(x, z)) continue;
      const d = dirOf(ang(x, z)); if (!d) continue;
      const f = fbm(x, z), forest = f > 0.6, sol = true;
      const wantTree = forest ? rnd() < 0.65 : rnd() < 0.06, s = 0.9 + rnd() * 0.8;
      if (wantTree && clear(x, z, 2.2)) {
        if (d === "N") pine(x, z, s, sol); else if (d === "NE") maple(x, z, s, sol);
        else if (d === "E") { if (rnd() < 0.7) cactus(x, z, 0.8 + rnd() * 0.6, sol); else rock(x, z, 1.3 + rnd(), 0xb86a46, false, sol); }
        else if (d === "SE") { if (cheb(x, z) > 214) mangrove(x, z, 0.9 + rnd() * 0.5, sol); else palm(x, z, 0.8 + rnd() * 0.6, sol); }
        else { if (rnd() < 0.3) bamboo(x, z, sol); else lushTree(x, z, s, rnd() < 0.4, sol); }
        reserve(x, z, 2.2);
      } else if (rnd() < 0.5) {   // đồ nhỏ, đi xuyên qua được
        const sx = x + (rnd() - 0.5) * 3, sz = z + (rnd() - 0.5) * 3; if (!clear(sx, sz, 0.8)) continue;
        if (d === "N") { if (rnd() < 0.5) mound(sx, sz, 0.6 + rnd() * 0.8); else rock(sx, sz, 0.5 + rnd() * 0.5, 0x8f9aa8, true, false); }
        else if (d === "NE") { if (rnd() < 0.5) put("sph", [0xd9481f, 0xf08a24, 0xe9b82f][(rnd() * 3) | 0], sx, 0.02, sz, 1 + rnd() * 0.6, 0.18, 0.9 + rnd() * 0.5, rnd() * 3, 0, 0, 0.06); else rock(sx, sz, 0.5 + rnd() * 0.5, 0x8d7355, false, false); }
        else if (d === "E") { if (rnd() < 0.3) put("ico", 0x9a8a55, sx, 0.2, sz, 0.45, 0.35, 0.45); else rock(sx, sz, 0.5 + rnd() * 0.6, 0xc07a52, false, false); }
        else if (d === "SE") { if (rnd() < 0.5) rock(sx, sz, 0.5 + rnd() * 0.5, 0xc9c1ab, false, false); else put("ico", 0xff9fb0, sx, 0.1, sz, 0.25, 0.18, 0.25); }
        else { if (rnd() < 0.7) flowers(sx, sz); else rock(sx, sz, 0.5 + rnd() * 0.4, 0x9aa5a0, false, false); }
      }
    }
  }
  const SIDES = [   // 5 cạnh của khung chữ C (điểm bắt đầu, hướng đi, độ dài, pháp tuyến hướng ra ngoài)
    { x0: -150, z0: -R1 - 1, dx: 1, dz: 0, len: 391, nx: 0, nz: -1 }, { x0: R1 + 1, z0: -R1 - 1, dx: 0, dz: 1, len: 482, nx: 1, nz: 0 },
    { x0: R1 + 1, z0: R1 + 1, dx: -1, dz: 0, len: 391, nx: 0, nz: 1 }, { x0: -151, z0: -R1 - 1, dx: 0, dz: 1, len: 92, nx: -1, nz: 0 }, { x0: -151, z0: CITY, dx: 0, dz: 1, len: 92, nx: -1, nz: 0 }
  ];
  function perimeter() {
    SIDES.forEach(sd => {
      const ry = sd.dx !== 0 ? 0 : Math.PI / 2;
      for (let t = 0; t < sd.len; t += 3.6) {
        const x = sd.x0 + sd.dx * t, z = sd.z0 + sd.dz * t, d = dirAny(x, z); if (d === "SE" && cheb(x, z) > SEA - 3) continue;   // đoạn biển: không cần hàng rào
        if (d === "N") { put("box", 0x9aa5b1, x, 0, z, 3.7, 1.2, 1.0, ry); put("box", 0xffffff, x, 1.2, z, 3.8, 0.28, 1.1, ry, 0, 0, 0.03); if ((t / 3.6 | 0) % 4 === 0) put("cone6", 0x9fe0ff, x, 0, z, 0.4, 2.6, 0.4, 0, 0, 0, 0.06); }
        else if (d === "NE" || d === "S") { const wc = d === "NE" ? 0x8a5a33 : 0xb98a5a; put("box", wc, x, 0, z, 0.24, 1.4, 0.24); put("box", wc, x + sd.dx * 1.8, 0.5, z + sd.dz * 1.8, sd.dx ? 3.6 : 0.1, 0.13, sd.dx ? 0.1 : 3.6); put("box", wc, x + sd.dx * 1.8, 1.0, z + sd.dz * 1.8, sd.dx ? 3.6 : 0.1, 0.13, sd.dx ? 0.1 : 3.6); if (d === "S" && rnd() < 0.3) flowers(x - sd.nx * 1.2, z - sd.nz * 1.2); }
        else if (d === "E") { const h = 1.8 + rnd() * 1.8; put("box", rnd() < 0.5 ? 0xb85a38 : 0xc9663f, x, 0, z, 3.7, h, 1.3, ry); put("box", 0xe3c488, x, h, z, 3.4, 0.25, 1.1, ry); }
        else rock(x, z, 1.7 + rnd() * 0.5, 0x8e9aa6, false, false);
        // phông xa ngoài ranh: núi tuyết / rừng phong / mesa / đồi hoa (chỉ để nhìn, không đi tới được)
        if ((t / 3.6 | 0) % 3 === 0) {
          const o = 8 + rnd() * 22, bx = x + sd.nx * o, bz = z + sd.nz * o, k = rnd();
          if (d === "N") { const r = 9 + rnd() * 8, h = 22 + rnd() * 22; put("cone6", 0x8e9fb3, bx, -1, bz, r, h, r, rnd() * 6, 0, 0, 0.1); put("cone6", 0xffffff, bx, h * 0.5, bz, r * 0.52, h * 0.52, r * 0.52, 0, 0, 0, 0.03); }
          else if (d === "NE") maple(bx, bz, 3 + rnd() * 1.5, false);
          else if (d === "E") mesa(bx, bz, 14 + rnd() * 8, 12 + rnd() * 12, 12 + rnd() * 6, false);
          else if (d === "SE") { if (k < 0.5) palm(bx, bz, 1.5, false); else rock(bx, bz, 4 + rnd() * 3, 0x9aa5a0, false, false); }
          else { put("sph", 0x7fcf5a, bx, -2, bz, 14 + rnd() * 8, 6 + rnd() * 6, 14 + rnd() * 8, rnd() * 3, 0, 0, 0.1); if (k < 0.4) lushTree(bx + 3, bz + 3, 2.5, rnd() < 0.5, false); }
        }
      }
    });
  }

  /* ---------- 6. QUẢN LÝ HIỂN THỊ: chỉ vẽ ô gần người chơi (giữ ≤ 260 lần vẽ) ---------- */
  function finalize() {
    const mt = new THREE.MeshLambertMaterial({ vertexColors: true });
    chunks.forEach((c, k) => {
      const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(c.p, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(c.n, 3)); g.setAttribute("color", new THREE.Float32BufferAttribute(c.c, 3));
      g.computeBoundingSphere(); const m = new THREE.Mesh(g, mt); m.userData.flat = true; m.userData.flag = true; m.receiveShadow = false; scene.add(m);
      managed.push({ o: m, x: g.boundingSphere.center.x, z: g.boundingSphere.center.z, r: g.boundingSphere.radius });
    });
    chunks.clear();
  }
  function updateVis() {
    try {
      const inside = (typeof room !== "undefined" && room) || (typeof maze !== "undefined" && maze), p = player.position, far = (typeof camWide !== "undefined" && camWide ? 178 : 96);
      managed.forEach(it => { it.o.visible = !inside && Math.hypot(it.x - p.x, it.z - p.z) - it.r < far; });
      if (ground) ground.visible = !inside && cheb(p.x, p.z) > CITY - 110;
    } catch (e) {}
  }
  let ground = null;

  /* ---------- 7. ĐIỂM XUẤT HIỆN QUÁI ---------- */
  const SPAWN = {};
  function spawnPoints(dir, ring) {
    if (ring !== 1 && ring !== undefined) return [];
    if (SPAWN[dir]) return SPAWN[dir];
    const g = GATE_OF[dir]; if (!g) return [];
    const r = mulberry(777 + dir.charCodeAt(0)), cand = [];
    for (let i = 0; i < 6000; i++) { const x = -150 + r() * 390, z = -R1 + r() * 480; if (!walkable(x, z) || dirOf(ang(x, z)) !== dir) continue;
      const m = cheb(x, z); if (m < CITY + 10 || m > R1 - 6 || Math.hypot(x - g.x, z - g.z) < 20) continue; if (dir === "SE" && m > SEA - 5) continue;
      if (!freeSpot(x, z)) continue; cand.push({ x: Math.round(x * 10) / 10, z: Math.round(z * 10) / 10 }); }
    let out = [];
    for (const sep of [18, 15, 12, 10, 8, 6]) { out = []; for (const c of cand) if (out.every(o => Math.hypot(o.x - c.x, o.z - c.z) >= sep)) out.push(c); if (out.length >= 14) break; }
    return SPAWN[dir] = out;
  }
  function freeSpot(x, z) { if (blocked(x, z)) return false; for (let k = 0; k < 8; k++) { const a = k * 0.7854; if (blocked(x + Math.cos(a) * 1.3, z + Math.sin(a) * 1.3)) return false; } return true; }
  function mulberry(s) { return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  /* ---------- 8. BẢN ĐỒ 2D (hệ toạ độ thế giới x, z, giống drawCity) ---------- */
  const MAPC = { N: "#e6f0f8", NE: "#e3a64a", E: "#dcae72", SE: "#f1e0a8", S: "#8fdb68" };
  function drawMap(x) {
    x.save(); x.beginPath(); x.rect(-150, -R1, 390, 90); x.rect(CITY, -CITY, 90, 300); x.rect(-150, CITY, 390, 90); x.clip();
    ORDER.forEach(d => {
      const poly = () => { x.beginPath(); x.moveTo(0, 0); for (let a = A0[d]; a <= A1[d] + 0.01; a += 5) { const r = a * Math.PI / 180; x.lineTo(Math.sin(r) * 500, -Math.cos(r) * 500); } x.closePath(); };
      x.fillStyle = MAPC[d]; poly(); x.fill();
      if (d === "SE") { x.save(); poly(); x.clip(); x.fillStyle = "#4bbde6"; x.beginPath(); x.rect(-400, -400, 800, 800); x.rect(-SEA, -SEA, SEA * 2, SEA * 2); x.fill("evenodd"); x.restore(); }
    });
    x.strokeStyle = "rgba(120,80,40,.6)"; x.lineWidth = 1; x.strokeRect(-150, -R1, 390, 480);   // ranh vòng 1
    x.restore();
    x.font = "bold 8px system-ui"; x.textAlign = "center"; x.textBaseline = "middle"; x.lineWidth = 2.2; x.strokeStyle = "rgba(255,255,255,.9)"; x.fillStyle = "#3b2a1a";
    [["N", -10, -198], ["NE", 196, -196], ["E", 205, -50], ["SE", 188, 180], ["S", -45, 198]].forEach(t => { const nm = SEC[t[0]].name; x.strokeText(nm, t[1], t[2]); x.fillText(nm, t[1], t[2]); });
    GATES.forEach(g => { x.fillStyle = "#7a3b12"; x.beginPath(); x.arc(g.x, g.z, 3, 0, 7); x.fill(); x.fillStyle = "#ffd43b"; x.beginPath(); x.arc(g.x, g.z, 1.8, 0, 7); x.fill(); });
  }

  const api = { walkable, sectorAt, gates: GATES.map(g => ({ dir: g.dir, x: g.x, z: g.z })), spawnPoints, drawMap, _build() {
    initTpl(); ground = groundMesh(); scene.add(ground);
    GATES.forEach(buildGate); landmarks(); scatter(); perimeter(); finalize();
    updateVis(); setInterval(updateVis, 250);
  } };
  return api;
})();
function buildWilds() { WILDS._build(); }

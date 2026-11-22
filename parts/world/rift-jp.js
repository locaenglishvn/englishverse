/* ===== KHU NHẬT – SAKURA RIFT (bản đồ riêng, Lv.50–60) =====
   Vào từ cổng ở mép NAM vùng hoang dã (Blossom Valley / Bamboo Hills) → xuất hiện ở cổng BẮC của khu; lâu đài Himeji ở cuối bản đồ phía NAM.
   Toạ độ cục bộ: khu rộng 300 × 300 m (lx, lz ∈ −150…150), bắc = −z. Tường thành bao quanh ở ±147 (đi được tới ±143).
   Bố cục (bắc → nam): cổng thành có vết rách · phố cổ nhà gỗ (jōkamachi) · đại lộ anh đào + đèn đá · giữa khu: ĐÔNG – hàng torii dẫn tới chùa tháp 5 tầng
   + gác chuông; TÂY – vườn đá Thiền + chánh điện, hồ cá koi có cầu cong · góc TB rừng trúc, góc ĐB phong đỏ · NAM: hào nước + đảo thành + lâu đài Himeji. */
(function () {
  if (typeof RIFTS === "undefined") return;
  const OX = 0, OZ = 2300;
  const C = { plaster: 0xf2efe6, roof: 0x56606b, roofD: 0x454c55, stone: 0x8e8a80, stoneD: 0x77736a, wood: 0x4a3526, woodL: 0x6b4e35, dark: 0x2b2b2b,
    gold: 0xd4a83a, verm: 0xd9411e, black: 0x1f1f22, gravel: 0xc9bc98, water: 0x3f7f9a, bamboo: 0x6e9b3a, leaf: 0x86b84f, bronze: 0x8c6a3a, paper: 0xf6eccf, indigo: 0x2b3a67 };
  const MOAT = { ox: 46, z0: 54, z1: 146, ix: 38, iz0: 62, iz1: 138, bridge: 3.2 };
  const POND = { x: -85, z: 28, rx: 18, rz: 12 };
  const CASTLE = { x: 0, z: 118, hw: 20, hd: 15 };
  let fogN = null, fogW = null, PL = null, ST = null;
  function plaster(K) { return PL || (PL = K.mat(C.plaster, { emissive: 0x3d3a34 })); }   // vôi trắng: mặt khuất nắng vẫn sáng (không xám xanh)
  function stoneMat() {   // vân đá xếp (ishigaki) cho chân thành / chân tường
    if (ST) return ST; const N = 256, c = document.createElement("canvas"); c.width = c.height = N; const g = c.getContext("2d"); g.fillStyle = "#8a857b"; g.fillRect(0, 0, N, N);
    let sd = 5; const r = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
    for (let y = 0; y < N; y += 22) for (let x = -20 + (y / 22 % 2) * 18; x < N; ) { const w = 26 + r() * 22, v = 120 + r() * 40 | 0; g.fillStyle = "rgb(" + v + "," + (v - 4) + "," + (v - 12) + ")"; g.fillRect(x + 2, y + 2, w - 4, 18); x += w; }
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6, 1.4); return ST = new THREE.MeshLambertMaterial({ map: t });
  }

  function blocked(lx, lz) {
    if (Math.abs(lx) > 143 || Math.abs(lz) > 143) return true;   // tường thành
    const inO = Math.abs(lx) <= MOAT.ox && lz >= MOAT.z0 && lz <= MOAT.z1, inI = Math.abs(lx) < MOAT.ix && lz > MOAT.iz0 && lz < MOAT.iz1;
    if (inO && !inI && !(Math.abs(lx) < MOAT.bridge && lz < MOAT.iz0 + 2)) return true;   // hào nước (trừ cầu)
    if (Math.abs(lx - CASTLE.x) < CASTLE.hw && Math.abs(lz - CASTLE.z) < CASTLE.hd) return true;   // chân thành đá
    const px = (lx - POND.x) / POND.rx, pz = (lz - POND.z) / POND.rz; if (px * px + pz * pz < 1) return true;   // hồ koi
    return false;
  }

  /* ---------- các khối kiến trúc Nhật ---------- */
  function tieredRoof(K, w, d, y, lx, lz, ry) {   // mái ngói vát xoè + bờ nóc
    K.fr(w + 3.4, d + 3.4, w * 0.6, d * 0.6, 1.4, C.roof, lx, y, lz, ry);
    K.fr(w * 0.62, d * 0.62, w * 0.5, d * 0.5, 0.35, C.roofD, lx, y + 1.4, lz, ry);
  }
  function windows(K, w, d, y, lx, lz, n) {   // hàng cửa sổ tối ở mặt bắc + nam
    for (let i = 0; i < n; i++) { const x = lx - w / 2 + (i + 0.5) * w / n; K.box(0.9, 0.9, 0.12, C.dark, x, y, lz - d / 2 - 0.04); K.box(0.9, 0.9, 0.12, C.dark, x, y, lz + d / 2 + 0.04); }
  }
  function keep(K, lx, lz, y0, tiers, top) {   // tháp thành nhiều tầng (tenshu)
    let y = y0;
    tiers.forEach(([w, d, h], i) => {
      K.block(K.box(w, h, d, plaster(K), lx, y, lz)); windows(K, w, d, y + h * 0.55, lx, lz, Math.max(2, Math.round(w / 4)));
      tieredRoof(K, w, d, y + h - 0.2, lx, lz);
      if (i % 2 === 1) { K.pr(w * 0.45, 2.1, 1.4, plaster(K), lx, y + h + 0.9, lz - d / 2 - 1.2); K.pr(w * 0.55, 2.5, 1.6, C.roof, lx, y + h + 0.75, lz - d / 2 - 1.3); }   // đầu hồi tam giác (chidori-hafu)
      y += h + 1.0;
    });
    if (top) { const [w, d] = tiers[tiers.length - 1]; K.box(w * 0.5, 0.5, 0.5, C.roofD, lx, y + 0.2, lz); [-1, 1].forEach(s => K.box(0.45, 1.1, 0.5, C.gold, lx + s * w * 0.26, y + 0.4, lz)); }   // cá chép vàng (shachihoko) hai đầu nóc
  }
  function wallRun(K, along, a0, a1, pos) {   // một đoạn tường thành: chân đá dốc + tường vôi trắng + mái ngói (along: "x" = chạy theo trục x)
    const L = a1 - a0, mid = (a0 + a1) / 2, ry = along === "x" ? 0 : Math.PI / 2, lx = along === "x" ? mid : pos, lz = along === "x" ? pos : mid;
    K.fr(L, 5.6, L, 3.2, 3.2, stoneMat(), lx, 0, lz, ry);
    K.block(K.add(new THREE.BoxGeometry(L, 2.2, 0.8), plaster(K), lx, 3.2 + 1.1, lz, ry));
    K.fr(L + 0.4, 2, L, 0.3, 0.7, C.roof, lx, 5.3, lz, ry);
  }
  function turret(K, lx, lz) {   // vọng lâu góc tường (yagura)
    K.box(9, 4, 9, plaster(K), lx, 3.2, lz); windows(K, 9, 9, 5.2, lx, lz, 2); tieredRoof(K, 9, 9, 7.0, lx, lz);
    K.box(5.5, 2.8, 5.5, plaster(K), lx, 8.6, lz); tieredRoof(K, 5.5, 5.5, 11.2, lx, lz);
  }
  function lantern(K, lx, lz) {   // đèn đá (tōrō)
    K.box(1.0, 0.35, 1.0, C.stoneD, lx, 0, lz); K.cyl(0.22, 0.26, 1.2, C.stone, lx, 0.35, lz, 6);
    K.box(0.9, 0.75, 0.9, C.stone, lx, 1.55, lz); K.box(0.55, 0.4, 0.95, 0xffe7a3, lx, 1.72, lz);   // ô sáng
    K.fr(1.5, 1.5, 0.25, 0.25, 0.55, C.stoneD, lx, 2.3, lz); K.solid(lx, lz, 0.5, 0.5);
  }
  function torii(K, lx, lz, ry, s) {   // cổng torii đỏ son
    s = s || 1; const off = 2.1 * s, cx = Math.cos(ry), sz = Math.sin(ry);
    [-1, 1].forEach(k => { const px = lx + k * off * cx, pz = lz - k * off * sz; K.cyl(0.24 * s, 0.3 * s, 4.4 * s, C.verm, px, 0, pz, 10); K.cyl(0.38 * s, 0.38 * s, 0.4 * s, C.black, px, 0, pz, 10); K.solid(px, pz, 0.35, 0.35); });
    K.box(5.4 * s, 0.3 * s, 0.45 * s, C.verm, lx, 4.15 * s, lz, ry); K.box(6.0 * s, 0.32 * s, 0.55 * s, C.black, lx, 4.45 * s, lz, ry); K.box(4.6 * s, 0.24 * s, 0.24 * s, C.verm, lx, 3.45 * s, lz, ry);
  }
  function machiya(K, lx, lz, w, d, face) {   // nhà phố gỗ (face = 1: mặt tiền quay +x, -1: quay -x)
    K.block(K.box(d, 3.6, w, C.wood, lx, 0, lz)); K.box(d - 0.2, 1.1, w - 0.2, plaster(K), lx, 2.5, lz);
    K.box(0.12, 1.8, w * 0.7, C.woodL, lx + face * (d / 2 + 0.05), 0.4, lz);   // mặt tiền lưới gỗ
    K.box(0.06, 0.9, w * 0.35, C.indigo, lx + face * (d / 2 + 0.12), 1.6, lz - w * 0.15);   // rèm noren
    K.pr(d + 1.6, 1.9, w + 0.8, C.roofD, lx, 3.6, lz); K.solid(lx, lz, d / 2, w / 2);
  }
  function pagoda(K, lx, lz) {   // chùa tháp 5 tầng
    K.box(14, 1.2, 14, C.stone, lx, 0, lz); K.solid(lx, lz, 7, 7);
    let y = 1.2; for (let i = 0; i < 5; i++) { const s = 8.2 - i * 1.0, h = 2.9; K.block(K.box(s, h, s, 0x7a2f22, lx, y, lz)); K.box(s - 1.2, 1.0, s + 0.05, plaster(K), lx, y + 1.0, lz);
      K.fr(s + 5, s + 5, s + 0.6, s + 0.6, 1.0, C.roofD, lx, y + h - 0.1, lz); y += h + 0.8; }
    K.cyl(0.16, 0.2, 6, C.gold, lx, y - 0.6, lz, 8); for (let i = 0; i < 5; i++) K.cyl(0.55 - i * 0.05, 0.55 - i * 0.05, 0.14, C.gold, lx, y + 0.6 + i * 0.85, lz, 10);   // ngọn tháp (sōrin)
  }
  function bellTower(K, lx, lz) {   // gác chuông + chuông đồng lớn
    [[-2.2, -2.2], [2.2, -2.2], [-2.2, 2.2], [2.2, 2.2]].forEach(([a, b]) => K.cyl(0.22, 0.26, 5, C.wood, lx + a, 0.6, lz + b, 8));
    K.box(6.4, 0.6, 6.4, C.stone, lx, 0, lz); tieredRoof(K, 5.4, 5.4, 5.6, lx, lz);
    K.cyl(1.0, 1.25, 2.3, C.bronze, lx, 2.6, lz, 18); K.cyl(0.35, 0.35, 0.3, C.bronze, lx, 4.9, lz, 10); K.solid(lx, lz, 3.2, 3.2);
  }
  function rock(K, lx, lz, r, c) { const m = K.add(new THREE.DodecahedronGeometry(r, 0), c || 0x6f6f6a, lx, r * 0.55, lz, Math.random() * 6); m.scale.set(1.2, 0.75, 1); K.solid(lx, lz, r * 0.9, r * 0.8); return m; }
  function stripes() {   // sỏi cào vườn Thiền
    const N = 256, c = document.createElement("canvas"); c.width = c.height = N; const g = c.getContext("2d"); g.fillStyle = "#e9e5d8"; g.fillRect(0, 0, N, N);
    g.strokeStyle = "#cfc9b6"; g.lineWidth = 3; for (let y = 4; y < N; y += 12) { g.beginPath(); g.moveTo(0, y); g.lineTo(N, y); g.stroke(); }
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6, 5); return new THREE.MeshLambertMaterial({ map: t });
  }

  RIFTS.define({
    id: "jp", name: "Sakura Rift", vi: "Khu Nhật · Lv.50–60 · lâu đài ở cuối bản đồ phía Nam", ox: OX, oz: OZ, half: 150,
    gate: { x: 0, z: 318, view: Math.PI, back: { x: 0, z: 311, ang: 0 } },   // view: hướng camera khi đứng gần cổng (cổng ở phía nam → nhìn về nam)   // cổng ở mép nam vùng hoang dã; về lại: đứng trước cổng, nhìn về thành phố (bắc)
    arrive: { x: 0, z: -128, ang: Math.PI },   // vào khu: đứng ngay trong cổng bắc, nhìn về phía nam (lâu đài)
    portal: { x: 0, z: -145 },
    fog: wide => wide ? (fogW || (fogW = new THREE.Fog(0xf3e4ea, 70, 210))) : (fogN || (fogN = new THREE.Fog(0xf3e4ea, 42, 165))),   // sương hồng mùa anh đào, nhìn xa hơn thành phố
    blocked,
    build(K, R) {
      /* nền: cỏ toàn khu (rộng ra ngoài tường để nhìn qua tường không thấy khoảng trống) */
      if (typeof flat === "function") flat(560, 560, 0x8fd17a, OX, OZ, 0); else K.flat(560, 560, 0x7db552, 0, 0, 0);
      const grav = K.mat(C.gravel);
      K.flat(7, 200, C.gravel, 0, -46, 0.03, grav);   // đại lộ bắc → nam
      K.flat(34, 14, C.gravel, 0, 46, 0.03, grav);   // sân trước cầu
      K.flat(72, 36, C.gravel, 0, 82, 0.03, grav);   // sân thành (sau này: đấu trường trùm / trạm an toàn)
      K.flat(74, 4, C.gravel, 45, -30, 0.03, grav);   // lối torii (đông)
      K.flat(30, 4, C.gravel, -30, -30, 0.03, grav);   // lối sang vườn Thiền (tây)

      /* tường thành bao quanh + vọng lâu */
      wallRun(K, "x", -147, -8, -147); wallRun(K, "x", 8, 147, -147); wallRun(K, "x", -147, 147, 147);
      wallRun(K, "z", -147, 147, -147); wallRun(K, "z", -147, 147, 147);
      [[-147, -147], [147, -147], [-147, 147], [147, 147], [-147, 0], [147, 0], [0, 147]].forEach(([x, z]) => turret(K, x, z));
      /* cổng bắc (yaguramon) + vết rách quay về */
      [-1, 1].forEach(s => { K.fr(7, 7.5, 6, 5, 3.2, stoneMat(), s * 11, 0, -147); K.cyl(0.4, 0.45, 6.2, C.wood, s * 7, 0, -146.5, 8); });
      K.block(K.box(30, 4.2, 7.5, plaster(K), 0, 6.2, -147)); windows(K, 30, 7.5, 8.3, 0, -147, 6); tieredRoof(K, 30, 7.5, 10.2, 0, -147);
      [-1, 1].forEach(s => K.box(0.25, 5.8, 6, C.woodL, s * 9.6, 0, -141.6, s * 0.6));   // hai cánh cổng gỗ mở vào trong
      R.portal(OX, 3.2, OZ - 145.5, 3, 2.05, 0);

      /* phố cổ nhà gỗ hai bên đại lộ */
      for (let i = 0; i < 4; i++) { const z = -126 + i * 11; machiya(K, -10.5, z, 9.5, 7, 1); machiya(K, 10.5, z, 9.5, 7, -1); }
      /* đèn đá + anh đào dọc đại lộ */
      for (let z = -78; z <= 38; z += 16) { lantern(K, -5.2, z); lantern(K, 5.2, z); }
      if (typeof NATURE !== "undefined") for (let z = -82; z <= 40; z += 10) { NATURE.tree(OX - 11 - (z % 20 ? 1.5 : 0), OZ + z, 1.25, true); NATURE.tree(OX + 11 + (z % 20 ? 0 : 1.5), OZ + z + 5, 1.25, true); K.solid(-11, z, 0.5, 0.5); K.solid(11, z + 5, 0.5, 0.5); }

      /* ĐÔNG: hàng torii → chùa tháp 5 tầng + gác chuông */
      for (let x = 14; x <= 76; x += 4.5) torii(K, x, -30, Math.PI / 2, 0.95);
      K.flat(36, 30, C.gravel, 98, -24, 0.03, grav); pagoda(K, 98, -32); bellTower(K, 112, -14); lantern(K, 86, -20); lantern(K, 86, -40);
      /* TÂY: chánh điện + vườn đá Thiền */
      K.box(26, 0.6, 13, C.woodL, -95, 0, -64); K.block(K.box(22, 4.2, 9, C.wood, -95, 0.6, -64)); K.box(21.8, 1.2, 9.05, plaster(K), -95, 3.3, -64);
      K.fr(28, 15, 15, 3.5, 3.4, C.roof, -95, 4.7, -64); K.box(15, 0.5, 0.6, C.roofD, -95, 8.0, -64); K.solid(-95, -64, 13, 6.5);
      K.flat(52, 38, 0, -95, -32, 0.04, stripes());
      [[-108, -40, 1.6], [-104, -37, 0.9], [-90, -26, 1.9], [-86, -29, 1.0], [-80, -42, 1.3], [-112, -22, 1.1]].forEach(([x, z, r]) => { rock(K, x, z, r); K.flat(r * 3.2, r * 2.6, 0x7a9a4a, x, z, 0.05); });
      /* TÂY NAM: hồ cá koi + cầu cong đỏ */
      { const m = K.add(new THREE.CircleGeometry(1, 40), C.water, POND.x, 0.06, POND.z); m.rotation.x = -Math.PI / 2; m.scale.set(POND.rx, POND.rz, 1); m.userData.flat = true;
        for (let a = 0; a < 6.28; a += 0.42) rock(K, POND.x + Math.cos(a) * (POND.rx + 0.6), POND.z + Math.sin(a) * (POND.rz + 0.6), 0.7 + (a * 7 % 1) * 0.5, 0x7d7a72);
        for (let i = -4; i <= 4; i++) { const y = Math.cos(i / 4 * Math.PI / 2) * 2.2; K.box(1.9, 0.3, 2.6, C.verm, POND.x + i * 1.9, y + 0.4, POND.z); }   // cầu cong (taiko-bashi) – để ngắm
        [[-8, 1], [8, 1]].forEach(([dx]) => K.cyl(0.12, 0.12, 1.2, C.verm, POND.x + dx, 0, POND.z - 1.4, 6));
        K.flat(5, 2, 0xe67e22, POND.x - 5, POND.z + 4, 0.08); K.flat(3, 1.5, 0xf2f2f2, POND.x + 6, POND.z - 4, 0.08); }   // vài bóng cá koi
      /* góc TB: rừng trúc · góc ĐB: phong đỏ */
      { const stalk = new THREE.CylinderGeometry(0.09, 0.12, 1, 5), top = new THREE.IcosahedronGeometry(1, 0);
        let sd = 7; const r = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
        for (let i = 0; i < 220; i++) { const x = -140 + r() * 46, z = -140 + r() * 42, h = 6 + r() * 4; if (Math.abs(x + 11) < 8 && z > -132) continue;
          const s = K.add(stalk, C.bamboo, x, h / 2, z); s.scale.y = h; s.rotation.z = (r() - 0.5) * 0.12;
          if (i % 2) { const t = K.add(top, C.leaf, x, h - 0.4, z); t.scale.set(1.2, 0.5, 1.2); } if (i % 6 === 0) K.solid(x, z, 0.3, 0.3); } }
      if (typeof NATURE !== "undefined") for (let i = 0; i < 26; i++) { const x = 104 + (i % 5) * 8 + (i * 13 % 5), z = -138 + Math.floor(i / 5) * 8 + (i * 7 % 4); NATURE.place("maple", OX + x, OZ + z, 1.1); K.solid(x, z, 0.5, 0.5); }

      /* NAM: hào nước + đảo thành + lâu đài Himeji */
      const wm = K.mat(C.water);
      K.flat(MOAT.ox * 2, MOAT.iz0 - MOAT.z0, 0, 0, (MOAT.z0 + MOAT.iz0) / 2, 0.05, wm); K.flat(MOAT.ox * 2, MOAT.z1 - MOAT.iz1, 0, 0, (MOAT.iz1 + MOAT.z1) / 2, 0.05, wm);
      [-1, 1].forEach(s => K.flat(MOAT.ox - MOAT.ix, MOAT.z1 - MOAT.z0, 0, s * (MOAT.ox + MOAT.ix) / 2, (MOAT.z0 + MOAT.z1) / 2, 0.05, wm));
      [[0, MOAT.z0, MOAT.ox * 2, 0.6], [0, MOAT.iz0, MOAT.ix * 2, 0.6]].forEach(([x, z, w, d]) => K.box(w, 0.5, d, C.stoneD, x, 0, z));   // bờ đá
      [-1, 1].forEach(s => { K.box(0.6, 0.5, MOAT.z1 - MOAT.z0, C.stoneD, s * MOAT.ox, 0, (MOAT.z0 + MOAT.z1) / 2); K.box(0.6, 0.5, MOAT.iz1 - MOAT.iz0, C.stoneD, s * MOAT.ix, 0, (MOAT.iz0 + MOAT.iz1) / 2); });
      K.box(6.4, 0.4, 12, C.woodL, 0, 0.05, 58); [-1, 1].forEach(s => K.box(0.25, 1.0, 12, C.verm, s * 3.1, 0.45, 58));   // cầu gỗ qua hào
      // tường thấp quanh đảo + cổng đảo
      const lowWall = (along, a0, a1, pos) => { const L = a1 - a0, m = (a0 + a1) / 2, ry = along === "x" ? 0 : Math.PI / 2, lx = along === "x" ? m : pos, lz = along === "x" ? pos : m;
        K.add(new THREE.BoxGeometry(L, 1.8, 0.6), plaster(K), lx, 0.9, lz, ry); K.fr(L + 0.4, 1.4, L, 0.25, 0.5, C.roof, lx, 1.8, lz, ry);
        if (along === "x") K.solid(m, pos, L / 2, 0.4); else K.solid(pos, m, 0.4, L / 2); };
      lowWall("x", -37.5, -4.5, 62.6); lowWall("x", 4.5, 37.5, 62.6); lowWall("z", 62.6, 137.5, -37.5); lowWall("z", 62.6, 137.5, 37.5);
      [-1, 1].forEach(s => K.cyl(0.35, 0.4, 4.2, C.wood, s * 4.2, 0, 62.6, 8)); K.pr(3.2, 1.8, 11, C.roof, 0, 4.2, 62.6, Math.PI / 2);
      // chân thành đá + tháp chính 5 tầng + 2 tháp phụ (dáng Himeji)
      K.block(K.fr(CASTLE.hw * 2, CASTLE.hd * 2, CASTLE.hw * 2 - 7, CASTLE.hd * 2 - 6, 8, stoneMat(), CASTLE.x, 0, CASTLE.z));
      for (let i = 0; i < 9; i++) K.box(4.2 - i * 0.12, 0.42, 1.6, C.stoneD, 0, i * 0.42, CASTLE.z - CASTLE.hd - 0.8 + i * 0.66);   // bậc đá lên thành (để ngắm)
      keep(K, 0, 116, 8, [[21, 15, 5.2], [18, 13, 4.6], [15, 11, 4.2], [12, 8.6, 3.8], [9, 6.6, 3.6]], true);
      [-1, 1].forEach(s => { keep(K, s * 12.5, 126, 8, [[8, 7, 4.0], [6, 5.2, 3.4], [4.4, 3.8, 3.0]], true); K.box(4, 3.4, 4, plaster(K), s * 9.0, 8, 124); tieredRoof(K, 4, 4, 11.2, s * 9.0, 124); });
      // anh đào quanh hào + rải trong khu
      if (typeof NATURE !== "undefined") {
        let sd = 31; const r = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
        const free = (x, z) => !blocked(x, z) && Math.abs(x) > 14 && !(x > 10 && x < 80 && Math.abs(z + 30) < 5) && !(x > 76 && x < 122 && z > -48 && z < 0) && !(x < -66 && x > -124 && z > -76 && z < -10) && !(Math.abs(x) < 50 && z > 40) && !(x < -96 && z < -96) && !(x > 98 && z < -100) && !(Math.abs(x) < 18 && z < -80);
        for (let n = 0, k = 0; n < 120 && k < 2000; k++) { const x = -138 + r() * 276, z = -120 + r() * 256; if (!free(x, z)) continue; const pink = r() < 0.75;
          NATURE.tree(OX + x, OZ + z, 1.05 + r() * 0.45, pink); K.solid(x, z, 0.5, 0.5); n++; if (r() < 0.5) NATURE.bush(OX + x + 2, OZ + z + 1.5, 1); }
        for (let i = 0; i < 70; i++) { const x = -136 + r() * 272, z = -110 + r() * 240; if (free(x, z)) NATURE.ground(OX + x, OZ + z, "flower"); }
      }
      /* núi tuyết xa (phông nền phía tây nam, ngoài tường) */
      K.add(new THREE.ConeGeometry(78, 88, 28), 0x7d8fa6, -70, 44, 222); K.add(new THREE.ConeGeometry(30, 26, 28), 0xf4f6fa, -70, 75, 222);

      /* cánh anh đào bay quanh người chơi (chỉ khi đang ở khu) */
      const N = 260, pos = new Float32Array(N * 3); for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 50; pos[i * 3 + 1] = Math.random() * 14; pos[i * 3 + 2] = (Math.random() - 0.5) * 50; }
      const pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const cv = document.createElement("canvas"); cv.width = cv.height = 32; const cx = cv.getContext("2d"); cx.fillStyle = "#ffc4d6"; cx.beginPath(); cx.ellipse(16, 16, 12, 7, 0.6, 0, 7); cx.fill();
      const pts = new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.28, map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false })); pts.userData.flag = true; pts.frustumCulled = false; pts.visible = false; scene.add(pts);
      R.tickers.push((dt, D, p) => { const on = D && D.id === "jp"; pts.visible = !!on; if (!on) return; pts.position.set(p.x, 0, p.z);
        for (let i = 0; i < N; i++) { pos[i * 3 + 1] -= dt * 0.9; pos[i * 3] += dt * 0.5; if (pos[i * 3 + 1] < 0) { pos[i * 3 + 1] = 14; pos[i * 3] = (Math.random() - 0.5) * 50; pos[i * 3 + 2] = (Math.random() - 0.5) * 50; } }
        pg.attributes.position.needsUpdate = true; });
    },
    buildGate(K, R) {   // cổng kiểu Nhật ở mép nam vùng hoang dã (toạ độ thế giới), mặt quay về phía bắc (thành phố)
      const gx = 0, gz = 320;
      [-1, 1].forEach(s => { K.cyl(0.42, 0.48, 6.6, C.wood, gx + s * 5.6, 0, gz, 10); K.fr(8, 4.5, 7, 3.2, 2.6, stoneMat(), gx + s * 10.5, 0, gz + 0.5); K.box(7, 2.2, 0.7, plaster(K), gx + s * 10.5, 2.6, gz + 0.5); K.fr(7.4, 1.8, 7, 0.3, 0.6, C.roof, gx + s * 10.5, 4.8, gz + 0.5);
        K.solid(gx + s * 5.6, gz, 0.6, 0.6); K.solid(gx + s * 10.5, gz + 0.5, 3.8, 2.3); });
      K.box(13.4, 0.6, 0.7, C.wood, gx, 6.0, gz); K.pr(4.4, 2.4, 15, C.roof, gx, 6.6, gz, Math.PI / 2); K.box(9, 0.4, 0.6, C.roofD, gx, 9.0, gz);
      [-1, 1].forEach(s => K.box(0.5, 1.0, 0.5, C.gold, gx + s * 4.4, 9.0, gz));
      // biển tên
      const cv = document.createElement("canvas"); cv.width = 256; cv.height = 64; const x = cv.getContext("2d"); x.fillStyle = "#2b1d14"; x.fillRect(0, 0, 256, 64); x.strokeStyle = "#d4a83a"; x.lineWidth = 4; x.strokeRect(4, 4, 248, 56);
      x.fillStyle = "#f6e7c1"; x.font = "bold 26px system-ui, sans-serif"; x.textAlign = "center"; x.fillText("SAKURA RIFT", 128, 32); x.font = "bold 15px system-ui"; x.fillStyle = "#ffc4d6"; x.fillText("Lv.50+", 128, 52);
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.05), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv) })); sign.position.set(gx, 5.2, gz - 0.42); sign.rotation.y = Math.PI; sign.userData.flag = true; scene.add(sign);
      R.portal(gx, 2.9, gz + 0.1, 2.8, 1.85, Math.PI);   // mặt quay về bắc (phía người chơi đi tới)
      if (typeof NATURE !== "undefined") [-1, 1].forEach(s => NATURE.tree(gx + s * 16, gz - 4, 1.2, true));
    },
    drawMap(x) {   // bản đồ nhỏ (toạ độ cục bộ đã dịch sẵn)
      x.fillStyle = "#9bd07f"; x.fillRect(-150, -150, 300, 300);
      x.fillStyle = "#d6cdb4"; x.fillRect(-3.5, -146, 7, 200); x.fillRect(-36, 64, 72, 36); x.fillRect(10, -32, 72, 4); x.fillRect(-45, -32, 30, 4);
      x.fillStyle = "#e9e5d8"; x.fillRect(-121, -51, 52, 38);
      x.fillStyle = "#3f7f9a"; x.fillRect(-46, 54, 92, 92); x.fillStyle = "#9bd07f"; x.fillRect(-38, 62, 76, 76); x.fillStyle = "#d6cdb4"; x.fillRect(-36, 64, 72, 36);
      x.fillStyle = "#3f7f9a"; x.beginPath(); x.ellipse(POND.x, POND.z, POND.rx, POND.rz, 0, 0, 7); x.fill();
      x.fillStyle = "#f2efe6"; x.fillRect(-20, 103, 40, 30); x.fillStyle = "#56606b"; x.fillRect(-10, 108, 20, 15);
      x.fillStyle = "#7a2f22"; x.fillRect(91, -39, 14, 14); x.fillStyle = "#4a3526"; for (let i = 0; i < 4; i++) { x.fillRect(-14, -131 + i * 11, 7, 9.5); x.fillRect(7, -131 + i * 11, 7, 9.5); } x.fillRect(-106, -68, 22, 9);
      x.fillStyle = "#6e9b3a"; x.fillRect(-140, -140, 46, 42); x.fillStyle = "#d9534f"; x.fillRect(104, -138, 40, 40);
      x.strokeStyle = "#8e8a80"; x.lineWidth = 6; x.strokeRect(-147, -147, 294, 294);
      x.fillStyle = "#9b6dff"; x.beginPath(); x.arc(0, -145, 4, 0, 7); x.fill();
    }
  });
})();

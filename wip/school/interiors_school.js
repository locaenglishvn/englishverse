/* EnglishVerse – nội thất "school" (layout: "campus"). Tách khỏi index.html để mỗi nơi 1 file (xem docs/TEAM.md).
   Dùng các hàm chung của index.html (lb, lc, mat, skin, face, textPlate, archPath, archWin, addBox, pot…) – chúng có sẵn khi nội thất được dựng. */
/* VERSE SCHOOL – khuôn viên trường kiểu Pháp thuộc địa ở Sài Gòn (Lê Hồng Phong, Lê Quý Đôn, Marie Curie…), 60 × 72 m, ngoài trời (bright):
   tường vàng nghệ, viền trắng, cửa chớp xanh lá, hành lang vòm 2 tầng, mái ngói đỏ, sân trường giữa có phượng + bàng, cột cờ, trống trường, ghế đá, bảng tin.
   Sân (x ±17, z −20…36) có cổng ở z = +36. Cánh trái (x −30…−17): lớp học, phòng khoa học, phòng tin học, phòng nhạc, phòng mỹ thuật.
   Cánh phải (x 17…30): thư viện, căn tin, phòng hiệu trưởng, phòng y tế. Phía bắc (z −36…−20): nhà thi đấu (bóng rổ, bóng đá).
   Tọa độ trong file này đều tính từ GIỮA khuôn viên (cx, cz). Cửa các phòng nằm ở z ≡ 0 (mod 4) để khớp cửa sổ trên mặt tiền. */
function furnishCampus(P, g, cx, cz, W, D, fur) {
  const S = P.room.solids, PI = Math.PI, REP = THREE.RepeatWrapping;
  const sol = (x, z, hw, hd) => S.push({ x: cx + x, z: cz + z, hw, hd });
  const bx = (w, h, d, c, x, y, z) => lb(g, w, h, d, c, cx + x, y, cz + z);
  const cy = (rt, rb, h, c, x, y, z, s) => lc(g, rt, rb, h, c, cx + x, y, cz + z, s);
  const flat = m => { m.userData.flat = true; return m; };
  const rep = t => { t.wrapS = t.wrapT = REP; return t; };
  const LM = (t, o) => new THREE.MeshLambertMaterial(Object.assign({ map: t }, o));
  const ball = (r, c, x, y, z, sx, sy, sz) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), mat(c)); m.position.set(cx + x, y, cz + z); m.scale.set(sx || 1, sy || 1, sz || 1); g.add(m); return m; };
  const sign = (t, w, h, bg, fg, x, y, z, ry) => { const p = textPlate(t, w, h, bg, fg); p.position.set(cx + x, y, cz + z); p.rotation.y = ry || 0; g.add(p); return p; };
  const hplane = (w, d, m, x, y, z, up, tile) => {   // mặt phẳng nằm ngang; tile = cạnh 1 ô hoa văn (mét)
    const geo = new THREE.PlaneGeometry(w, d); if (tile) { const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / tile, uv.getY(i) * d / tile); }
    const p = new THREE.Mesh(geo, m); p.rotation.x = up === false ? PI / 2 : -PI / 2; p.position.set(cx + x, y, cz + z); flat(p); g.add(p); return p; };
  const quad = (m, a, b, c, d, uw, vh) => {   // 4 điểm [x,y,z] (tính từ giữa khuôn viên) → 1 tấm tuỳ ý (mái dốc)
    const geo = new THREE.BufferGeometry(), P4 = [a, b, c, d];
    geo.setAttribute("position", new THREE.Float32BufferAttribute(P4.reduce((r, p) => r.concat([cx + p[0], p[1], cz + p[2]]), []), 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute([0, 0, uw, 0, uw, vh, 0, vh], 2)); geo.setIndex([0, 1, 2, 0, 2, 3]); geo.computeVertexNormals();
    const mm = new THREE.Mesh(geo, m); flat(mm); g.add(mm); return mm; };
  const ST = (x, c) => { x.fillStyle = c; };
  /* ---------- ẢNH VẼ (canvas, ít loại – dùng lại nhiều nơi) ---------- */
  const shut = (x, X, Y, w, h) => { ST(x, "#2f7d4f"); x.fillRect(X, Y, w, h); ST(x, "#25683f"); for (let j = Y + 0.1; j < Y + h - 0.05; j += 0.11) x.fillRect(X + 0.03, j, w - 0.06, 0.035); };
  const T = {};
  T.facade = rep(skin(4, 9, 28, (x, W, H) => {   // mặt tiền: tường vàng nghệ, chân đá, cửa chớp xanh lá, cửa sổ vòm tầng 2, gờ trắng
    const Y = h => H - h;
    ST(x, "#e7b845"); x.fillRect(0, 0, W, H); ST(x, "#dcab38"); for (let j = 0.35; j < H; j += 0.7) x.fillRect(0, j, W, 0.025);
    ST(x, "#8f7a5c"); x.fillRect(0, Y(0.8), W, 0.8); ST(x, "#a89270"); x.fillRect(0, Y(0.86), W, 0.07);
    ST(x, "#f7f1e0"); x.fillRect(1.42, Y(3.3), 1.16, 2.35); shut(x, 1.5, Y(3.22), 1.0, 2.2); ST(x, "#f7f1e0"); x.fillRect(1.97, Y(3.22), 0.06, 2.2); x.fillRect(1.42, Y(3.3), 1.16, 0.08);
    ST(x, "#f6f0df"); x.fillRect(0, Y(4.75), W, 0.32); x.fillRect(0, Y(4.45), W, 0.06);
    ST(x, "#f7f1e0"); archPath(x, 1.35, Y(8.1), 1.3, 3.0); x.fill(); ST(x, "#2f7d4f"); archPath(x, 1.45, Y(8.0), 1.1, 2.9); x.fill();
    ST(x, "#25683f"); for (let j = Y(5.4); j > Y(6.95); j -= 0.11) x.fillRect(1.47, j, 1.06, 0.035); ST(x, "#f7f1e0"); x.fillRect(1.97, Y(7.2), 0.06, 1.8);
    ST(x, "#f6f0df"); x.fillRect(0, 0, W, 0.5); x.fillRect(0, 0.5, W, 0.08); ST(x, "#d8b24a"); for (let X = 0.1; X < W; X += 0.3) x.fillRect(X, 0.35, 0.12, 0.12);
    ST(x, "#cfa43a"); x.fillRect(1.0, Y(8.6), 2.0, 0.05); })); T.facade.anisotropy = 4;
  T.arcade = rep(skin(4, 5.8, 28, (x, W, H) => {   // hành lang vòm: cột + vòm cuốn trắng kem; lan can con tiện tầng 2 (phần trong suốt = lỗ)
    const Y = h => H - h;
    ST(x, "#f4ead2"); x.fillRect(0, Y(4.45), W, 4.45);
    x.globalCompositeOperation = "destination-out"; [-1.7, 2.3].forEach(X => { archPath(x, X, Y(3.9), 3.4, 3.9); x.fill(); }); x.globalCompositeOperation = "source-over";
    ST(x, "#d9c9a3"); [-1.7, 2.3].forEach(X => { x.lineWidth = 0.07; x.strokeStyle = "#d9c9a3"; archPath(x, X, Y(3.9), 3.4, 3.9); x.stroke(); });
    ST(x, "#e9dcc0"); x.fillRect(1.7, Y(0.3), 0.6, 0.3); x.fillRect(1.65, Y(2.4), 0.7, 0.14);
    ST(x, "#f4ead2"); x.fillRect(0, Y(4.85), W, 0.4); x.fillRect(0, Y(5.8), W, 0.12); x.fillRect(0, Y(4.98), W, 0.12);
    for (let X = 0.1; X < W; X += 0.28) x.fillRect(X, Y(5.7), 0.1, 0.8); })); T.arcade.anisotropy = 4;
  const rw = win => rep(skin(4, 5.2, 24, (x, W, H) => {   // tường trong phòng: kem + chân tường xanh; (win) cửa sổ
    const Y = h => H - h;
    ST(x, "#f3e9cf"); x.fillRect(0, 0, W, H); ST(x, "#5b9a78"); x.fillRect(0, Y(1.25), W, 1.25); ST(x, "#ffffff"); x.fillRect(0, Y(1.3), W, 0.06); ST(x, "#d9ccae"); x.fillRect(0, 0, W, 0.12);
    if (win) { ST(x, "#f7f1e0"); x.fillRect(1.42, Y(3.5), 1.16, 2.1); ST(x, "#bfe3f6"); x.fillRect(1.5, Y(3.42), 1.0, 1.94); ST(x, "#f7f1e0"); x.fillRect(1.97, Y(3.42), 0.06, 1.94); x.fillRect(1.5, Y(2.5), 1, 0.05); ST(x, "#ffffff"); x.fillRect(1.55, Y(3.3), 0.3, 0.8); } }));
  T.rwPlain = rw(false); T.rwWin = rw(true);
  T.gym = rep(skin(4, 7.5, 24, (x, W, H) => { const Y = h => H - h;
    ST(x, "#efd77c"); x.fillRect(0, 0, W, H); ST(x, "#2f7d4f"); x.fillRect(0, Y(2), W, 2); ST(x, "#ffffff"); x.fillRect(0, Y(2.08), W, 0.08); ST(x, "#f7f1e0"); x.fillRect(0, 0, W, 0.2);
    ST(x, "#f7f1e0"); x.fillRect(0.55, Y(6.6), 2.9, 1.9); ST(x, "#bfe3f6"); x.fillRect(0.65, Y(6.5), 2.7, 1.7); ST(x, "#f7f1e0"); for (let X = 1.3; X < 3.3; X += 0.7) x.fillRect(X, Y(6.5), 0.05, 1.7); }));
  T.front = rep(skin(4, 3.6, 28, (x, W, H) => { const Y = h => H - h;   // tường rào: vàng + mũ trắng + ô vòm lõm
    ST(x, "#e7b845"); x.fillRect(0, 0, W, H); ST(x, "#f7f1e0"); x.fillRect(0, 0, W, 0.3); x.fillRect(0, 0.3, W, 0.06); ST(x, "#8f7a5c"); x.fillRect(0, Y(0.45), W, 0.45);
    ST(x, "#d4a431"); archPath(x, 0.7, 0.7, 2.6, 2.4); x.fill(); ST(x, "#e0b13e"); archPath(x, 0.85, 0.85, 2.3, 2.25); x.fill(); }));
  T.tile = rep(skin(2, 2, 32, (x, W, H) => { ST(x, "#e9dfc6"); x.fillRect(0, 0, W, H); ST(x, "#ddd1b4"); x.fillRect(0, 0, 1, 1); x.fillRect(1, 1, 1, 1); ST(x, "#c9bc9c"); x.fillRect(0, 0, W, 0.03); x.fillRect(0, 1, W, 0.03); x.fillRect(0, 0, 0.03, H); x.fillRect(1, 0, 0.03, H); }));
  T.conc = rep(skin(3, 3, 24, (x, W, H) => { ST(x, "#cdc4b0"); x.fillRect(0, 0, W, H); for (let i = 0; i < 90; i++) { ST(x, i % 2 ? "#c2b8a3" : "#d6cdba"); x.fillRect((i * 0.73) % W, (i * 1.31) % H, 0.14, 0.1); } ST(x, "#b3a98f"); x.fillRect(0, 0, W, 0.04); x.fillRect(0, 0, 0.04, H); x.fillRect(0, 1.5, W, 0.02); x.fillRect(1.5, 0, 0.02, H); }));
  T.brick = rep(skin(1, 1, 40, (x, W, H) => { ST(x, "#a9573a"); x.fillRect(0, 0, W, H); ST(x, "#c06b48"); for (let j = 0; j < 4; j++) for (let i = -1; i < 3; i++) x.fillRect(i * 0.5 + (j % 2) * 0.25 + 0.02, j * 0.25 + 0.02, 0.46, 0.21); }));
  T.wood = rep(skin(2, 2, 32, (x, W, H) => { ST(x, "#d9a85f"); x.fillRect(0, 0, W, H); for (let j = 0; j < 4; j++) { ST(x, j % 2 ? "#cf9d52" : "#e0b36c"); x.fillRect(0, j * 0.5, W, 0.47); ST(x, "#b98a45"); x.fillRect(0, j * 0.5, W, 0.025); ST(x, "#b98a45"); x.fillRect(((j * 0.7) % 2), j * 0.5, 0.02, 0.5); } }));
  T.roof = rep(skin(1.2, 1.2, 36, (x, W, H) => { ST(x, "#c4482c"); x.fillRect(0, 0, W, H); for (let j = 0; j < 6; j++) { ST(x, "#9c3320"); x.fillRect(0, j * 0.2 + 0.17, W, 0.04); ST(x, j % 2 ? "#cf5532" : "#b93f26"); for (let i = 0; i < 6; i++) x.fillRect(i * 0.2 + (j % 2) * 0.1, j * 0.2, 0.16, 0.16); } }));
  const M = {   // chất liệu dùng chung
    facade: LM(T.facade), arcade: LM(T.arcade, { side: THREE.DoubleSide, alphaTest: 0.5 }), rwPlain: LM(T.rwPlain), rwWin: LM(T.rwWin), gym: LM(T.gym), front: LM(T.front),
    conc: LM(T.conc), tile: LM(T.tile), brick: LM(T.brick), wood: LM(T.wood), roof: LM(T.roof, { side: THREE.DoubleSide }), slab: mat(0xe4d6b4, { side: THREE.DoubleSide }),
    ceil: mat(0xf5f0e4, { side: THREE.DoubleSide }), glass: mat(0xd0ebff, { transparent: true, opacity: 0.35 })
  };
  /* ---------- TƯỜNG: 1 đoạn phẳng có tọa độ ảnh liên tục (cửa sổ khớp mặt trong – mặt ngoài) ---------- */
  const wall = (m, x0, z0, x1, z1, y0, y1, s0, tw, th) => {
    const len = Math.hypot(x1 - x0, z1 - z0), hh = y1 - y0; if (len < 0.05 || hh < 0.05) return;
    const geo = new THREE.PlaneGeometry(len, hh), uv = geo.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (s0 + uv.getX(i) * len) / tw, (y0 + uv.getY(i) * hh) / th);
    const mm = new THREE.Mesh(geo, m), dx = (x1 - x0) / len, dz = (z1 - z0) / len;
    mm.position.set(cx + (x0 + x1) / 2, (y0 + y1) / 2, cz + (z0 + z1) / 2); mm.rotation.y = Math.atan2(-dz, dx); flat(mm); g.add(mm); };
  // chạy tường (mặt quay vào TRÁI hướng đi); o: { y1, th, gaps:[tâm cửa], gw, dh, O (gốc cửa sổ), solid }
  const run = (m, ax, az, bx, bz, o) => {
    const horiz = az === bz, t0 = horiz ? ax : az, t1 = horiz ? bx : bz, dir = Math.sign(t1 - t0), gw = o.gw || 2.4, dh = o.dh || 2.8, y1 = o.y1, tw = o.tw || 4, th = o.th || y1;
    const s0w = (o.O === undefined ? 0 : (dir > 0 ? t0 - o.O : o.O - t0)), pt = t => horiz ? [t, az] : [ax, t];
    const gaps = (o.gaps || []).filter(c => (c - t0) * dir > 0 && (t1 - c) * dir > 0).sort((a, b) => (a - b) * dir);
    const piece = (p0, p1, y0) => { const a = pt(p0), b = pt(p1); wall(m, a[0], a[1], b[0], b[1], y0, y1, s0w + Math.abs(p0 - t0), tw, th); };
    const solid = (p0, p1) => { if (o.solid === false) return; const len = Math.abs(p1 - p0); if (len < 0.05) return; const mid = (p0 + p1) / 2; if (horiz) sol(mid, az, len / 2, 0.12); else sol(ax, mid, 0.12, len / 2); };
    let cur = t0; gaps.forEach(c => { const g0 = c - dir * gw / 2, g1 = c + dir * gw / 2; piece(cur, g0, 0); solid(cur, g0); piece(g0, g1, dh); cur = g1; }); piece(cur, t1, 0); solid(cur, t1); };
  const ORG = -36, ORGX = -20;   // gốc cửa sổ: z = −36 (tường dọc), x = −20 (tường ngang)
  /* ---------- NỀN, ĐẤT, ĐƯỜNG NGOÀI CỔNG ---------- */
  const f0 = g.children[0]; f0.material = M.conc; { const uv = f0.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * W / 3, uv.getY(i) * D / 3); }
  hplane(400, 400, mat(0x7fbf5f), 0, -0.04, 0, true);
  hplane(60, 9, mat(0x6f747a), 0, -0.02, 42, true); hplane(60, 0.3, mat(0xefe9d8), 0, -0.015, 42, true);
  /* ---------- CÂY: phượng (tán hoa đỏ) + bàng (tán tầng ngang) ---------- */
  const phuong = (x, z, s) => {
    cy(0.28 * s, 0.45 * s, 4.6 * s, 0x7a4b25, x, 2.3 * s, z, 8); sol(x, z, 0.5 * s, 0.5 * s);
    [[0, 5.6, 0, 3.6], [2.4, 5.2, 1, 2.6], [-2.3, 5.3, -.6, 2.7], [.4, 5.4, -2.4, 2.4], [-.5, 5.2, 2.5, 2.5]].forEach(([dx, y, dz, r], i) => { const b = ball(r * s, i % 2 ? 0x3e9a3f : 0x2f8a3a, x + dx * s, y * s, z + dz * s, 1, 0.42, 1); flat(b); });
    for (let i = 0; i < 16; i++) { const a = i * 2.4, r = (1 + (i % 4) * 0.9) * s, b = ball(0.38 * s, i % 3 ? 0xe03a2b : 0xf0632a, x + Math.cos(a) * r, (6.1 + (i % 3) * 0.1) * s, z + Math.sin(a) * r, 1.3, 0.7, 1.3); flat(b); } };
  const bang = (x, z, s) => {
    cy(0.22 * s, 0.38 * s, 5 * s, 0x6e4a2a, x, 2.5 * s, z, 8); sol(x, z, 0.45 * s, 0.45 * s);
    [[3.6, 5, 0x4f9a3b], [2.8, 6.1, 0x3f8a33], [1.8, 7.1, 0x58a843]].forEach(([r, y, c]) => flat(cy(r * s, r * 0.9 * s, 0.55 * s, c, x, y * s, z, 14))); };
  /* ---------- CỔNG TRƯỜNG + TƯỜNG RÀO PHÍA TRƯỚC ---------- */
  run(M.front, 17, 36, -17, 36, { y1: 3.6, th: 3.6, gaps: [0], gw: 7.2, dh: 3.6, solid: false });
  [[-17, -3.6], [3.6, 17]].forEach(([a, b]) => sol((a + b) / 2, 36, (b - a) / 2, 0.15));
  [-1, 1].forEach(s => {
    bx(1, 4.4, 1, 0xe7b845, s * 3.9, 2.2, 36); bx(1.3, 0.3, 1.3, 0xf7f1e0, s * 3.9, 4.5, 36); bx(1.15, 0.25, 1.15, 0xf7f1e0, s * 3.9, 0.12, 36); ball(0.3, 0xfff0b3, s * 3.9, 4.95, 36); sol(s * 3.9, 36, 0.55, 0.55);
    bx(0.08, 1.9, 2.1, 0x2b2b2b, s * 3.3, 1.0, 34.9);   // cánh cổng sắt mở vào trong
  });
  sign("TRƯỜNG VERSE · VERSE SCHOOL", 6.4, 0.8, "#1c4e80", "#ffe9a8", 0, 4.3, 35.88, PI);
  sign("VERSE SCHOOL · Since 1902", 2.6, 0.45, "#f7f1e0", "#1c4e80", 4.1, 2.2, 35.45, PI);
  bx(7.8, 0.3, 0.9, 0xf7f1e0, 0, 4.9 - 0.65, 36);
  /* ---------- MẶT TIỀN CÁC CÁNH (nhìn từ sân) + HÀNH LANG VÒM + MÁI NGÓI ---------- */
  const doorsW = [-12, -4, 8, 20, 32], doorsE = [-12, 8, 20, 32];   // z của cửa từng phòng (cánh trái / cánh phải)
  run(M.facade, -17, 36, -17, -20, { y1: 9, th: 9, O: ORG, gaps: doorsW, solid: false });   // cánh trái nhìn ra sân (mặt hướng +x)
  run(M.facade, 17, -20, 17, 36, { y1: 9, th: 9, O: ORG, gaps: doorsE, solid: false });
  run(M.facade, -17, -20, 17, -20, { y1: 9, th: 9, O: ORGX, gaps: [0], gw: 7, dh: 4.6, solid: false });   // nhà thi đấu nhìn ra sân
  [-1, 1].forEach(s => {
    wall(M.arcade, s * 14.2, -20, s * 14.2, 36, 0, 5.8, 0, 4, 5.8);   // vòm cuốn (2 mặt)
    hplane(2.8, 56, M.slab, s * 15.6, 4.42, 8, true); hplane(2.8, 56, M.slab, s * 15.6, 4.42, 8, false);   // sàn tầng 2 / trần hành lang
    hplane(2.8, 56, M.tile, s * 15.6, 0.012, 8, true, 2);   // nền hành lang lát gạch
    for (let z = -18; z <= 34; z += 4) sol(s * 14.2, z, 0.35, 0.35);   // cột vòm
    // mái ngói: lấp ló trên đỉnh mặt tiền + gờ trắng
    quad(M.roof, [s * 13.4, 9.0, -20.8], [s * 23.5, 12.3, -20.8], [s * 23.5, 12.3, 36.8], [s * 13.4, 9.0, 36.8], 9, 47);
    quad(M.roof, [s * 23.5, 12.3, -20.8], [s * 30.8, 9.2, -20.8], [s * 30.8, 9.2, 36.8], [s * 23.5, 12.3, 36.8], 6, 47);
    bx(0.2, 0.45, 57.6, 0xf6f0df, s * 13.4, 8.85, 8);
    for (let z = -14; z <= 34; z += 12) pot(g, cx + s * 13.4, cz + z, 1.5), sol(s * 13.4, z, 0.35, 0.35);   // chậu cây trước hành lang
  });
  quad(M.roof, [-17.8, 9.0, -19.4], [-17.8, 12.5, -28], [17.8, 12.5, -28], [17.8, 9.0, -19.4], 30, 8);
  quad(M.roof, [-17.8, 12.5, -28], [-17.8, 8.8, -36.6], [17.8, 8.8, -36.6], [17.8, 12.5, -28], 30, 8);
  bx(36, 0.45, 0.2, 0xf6f0df, 0, 8.85, -19.4);
  { const clk = skin(1.2, 1.2, 64, (x) => { ST(x, "#f7f1e0"); x.beginPath(); x.arc(0.6, 0.6, 0.58, 0, 7); x.fill(); x.strokeStyle = "#2b2b2b"; x.lineWidth = 0.05; x.stroke(); for (let i = 0; i < 12; i++) { const a = i * PI / 6; x.beginPath(); x.moveTo(0.6 + Math.sin(a) * 0.46, 0.6 - Math.cos(a) * 0.46); x.lineTo(0.6 + Math.sin(a) * 0.53, 0.6 - Math.cos(a) * 0.53); x.stroke(); } x.lineWidth = 0.06; x.beginPath(); x.moveTo(0.6, 0.6); x.lineTo(0.6, 0.2); x.moveTo(0.6, 0.6); x.lineTo(0.85, 0.7); x.stroke(); });
    const m = new THREE.Mesh(new THREE.CircleGeometry(0.6, 20), new THREE.MeshBasicMaterial({ map: clk })); m.position.set(cx, 7.9, cz - 19.9); m.rotation.y = 0; g.add(m); T.clock = clk;
    sign("NHÀ THI ĐẤU · SCHOOL GYM", 6, 0.7, "#1c4e80", "#ffffff", 0, 5.4, -19.88, 0); }
  /* ---------- SÂN TRƯỜNG ---------- */
  hplane(6.4, 56, M.brick, 0, 0.014, 8, true, 1);   // lối gạch từ cổng
  [[-8, 21], [8, 21]].forEach(([x, z]) => { hplane(8.4, 17.4, mat(0x69b85a), x, 0.02, z, true); [[0, -8.8, 8.8, 0.3], [0, 8.8, 8.8, 0.3], [-4.3, 0, 0.3, 17.4], [4.3, 0, 0.3, 17.4]].forEach(([a, b, w, d]) => bx(w, 0.18, d, 0xf1ead8, x + a, 0.09, z + b)); });
  phuong(-8, 21, 1); phuong(8, 21, 1); bang(-9.5, -12, 1); bang(9.5, -12, 1); phuong(-12.3, 31.5, 0.85); phuong(12.3, 8, 0.8);
  [[-3.5, 17], [-3.5, 25], [3.5, 17], [3.5, 25]].forEach(([x, z]) => { bx(0.6, 0.12, 2.4, 0xb9b2a2, x, 0.5, z); [-0.9, 0.9].forEach(dz => bx(0.5, 0.45, 0.14, 0xa59e8e, x, 0.22, z + dz)); bx(0.14, 0.4, 2.4, 0xa59e8e, x + Math.sign(x) * 0.28, 0.75, z); sol(x, z, 0.4, 1.2); });   // ghế đá
  [[-9.5, -8.6], [9.5, -8.6]].forEach(([x, z]) => { bx(2.4, 0.12, 0.6, 0xb9b2a2, x, 0.5, z); [-0.9, 0.9].forEach(dx => bx(0.14, 0.45, 0.5, 0xa59e8e, x + dx, 0.22, z)); sol(x, z, 1.2, 0.4); });
  // sân chào cờ: bục + cột cờ
  bx(7, 0.35, 3.4, 0xcfc8b6, 0, 0.18, -2); bx(5.6, 0.35, 2.4, 0xdcd5c3, 0, 0.5, -2); sol(0, -2, 3.5, 1.7);
  flagPole(g, cx, cz - 2, 9);
  hplane(1.2, 3.8, LM(rep(skin(1.2, 3.8, 40, (x, W, H) => { x.strokeStyle = "#ffffff"; x.lineWidth = 0.06; x.fillStyle = "#ffffff"; x.font = "bold 0.34px system-ui"; x.textAlign = "center"; x.textBaseline = "middle"; for (let i = 0; i < 6; i++) { const Yy = 0.1 + i * 0.6; if (i === 3) { x.strokeRect(0.05, 0.1 + Yy - 0.1 + 0.0 - 0.0, 0.5, 0.5); x.strokeRect(0.65, Yy + 0.0, 0.5, 0.5); x.fillText("" + (4 + 0), 0.3, Yy + 0.28); x.fillText("5", 0.9, Yy + 0.28); } else { x.strokeRect(0.35, Yy, 0.5, 0.5); x.fillText("" + (i < 3 ? i + 1 : i + 2), 0.6, Yy + 0.28); } } })), { transparent: true }), 7.8, 0.025, 8, true);   // ô nhảy
  // trống trường trên giá gỗ
  [-0.7, 0.7].forEach(dz => { bx(0.2, 1.6, 0.2, 0x6b4a2b, 12.7, 0.8, 4 + dz); bx(0.9, 0.2, 0.2, 0x6b4a2b, 12.7, 0.12, 4 + dz); }); bx(0.2, 0.2, 1.6, 0x6b4a2b, 12.7, 1.55, 4); sol(12.7, 4, 0.5, 0.9);
  { const dm = cy(0.62, 0.62, 1.0, 0xb5251c, 12.7, 1.0, 4, 18); dm.rotation.x = PI / 2; cy(0.56, 0.56, 1.04, 0xe8d3a3, 12.7, 1.0, 4, 18).rotation.x = PI / 2; [-0.52, 0.52].forEach(dz => { const r = cy(0.64, 0.64, 0.06, 0xd9a441, 12.7, 1.0, 4 + dz, 18); r.rotation.x = PI / 2; }); bx(0.06, 0.06, 0.5, 0x6b4a2b, 12.1, 1.55, 3.3); }
  // bảng tin
  { const nb = skin(3.4, 2.2, 48, (x, Wd, Hh) => { ST(x, "#7a4b25"); x.fillRect(0, 0, Wd, Hh); ST(x, "#c8985a"); x.fillRect(0.1, 0.1, Wd - 0.2, Hh - 0.2);
      [["#fff", 0.3, 0.6, 0.8, 0.6], ["#ffe066", 1.3, 0.55, 0.7, 0.8], ["#a5d8ff", 2.2, 0.6, 0.9, 0.55], ["#ffc9c9", 0.4, 1.4, 0.7, 0.6], ["#d3f9d8", 1.4, 1.5, 0.8, 0.5], ["#fff", 2.4, 1.3, 0.7, 0.7]].forEach(([c, a, b, w, h]) => { ST(x, c); x.fillRect(a, b, w, h); ST(x, "#d6336c"); x.fillRect(a + w / 2 - 0.03, b - 0.03, 0.06, 0.06); ST(x, "#868e96"); for (let j = 0.12; j < h - 0.08; j += 0.12) x.fillRect(a + 0.08, b + j, w - 0.16, 0.03); });
      ST(x, "#1c4e80"); x.fillRect(0.1, 0.1, Wd - 0.2, 0.32); ST(x, "#ffffff"); x.font = "bold 0.24px system-ui"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("THÔNG BÁO · NOTICE BOARD", Wd / 2, 0.27); });
    [-1.2, 1.2].forEach(dz => bx(0.14, 2.6, 0.14, 0x6b4a2b, -12.6, 1.3, 2 + dz)); const b = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.2), new THREE.MeshLambertMaterial({ map: nb })); b.position.set(cx - 12.5, 1.8, cz + 2); b.rotation.y = PI / 2; flat(b); g.add(b); sol(-12.6, 2, 0.2, 1.8); }
  // nhà xe đạp
  bx(4, 0.12, 6.4, 0x8fa1a8, 11.7, 2.5, 30); [[-1.9, -3.1], [1.9, -3.1], [-1.9, 3.1], [1.9, 3.1]].forEach(([a, b]) => bx(0.1, 2.5, 0.1, 0x6c757d, 11.7 + a, 1.25, 30 + b)); sol(11.7, 30, 1.0, 3.2);
  [[10.9, 28], [10.9, 29.9], [10.9, 31.8], [12.4, 28.9]].forEach(([x, z], i) => { const col = [0xe03131, 0x1c7ed6, 0x2f9e44, 0xfab005][i];
    [-0.5, 0.5].forEach(dz => { const w = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.03, 5, 14), mat(0x212529)); w.position.set(cx + x, 0.34, cz + z + dz); w.rotation.y = PI / 2; g.add(w); });
    bx(0.04, 0.05, 1.1, col, x, 0.62, z); bx(0.04, 0.5, 0.05, col, x, 0.62, z - 0.2); bx(0.3, 0.05, 0.1, 0x222222, x, 0.95, z - 0.55); bx(0.12, 0.05, 0.3, 0x222222, x, 0.9, z + 0.4); });
  sign("NHÀ XE · BIKE PARKING", 2.2, 0.35, "#1c4e80", "#ffffff", 11.7, 2.2, 26.85, 0);
  // bồn hoa + bảo vệ
  [-1, 1].forEach(s => { bx(3.2, 0.45, 1.3, 0xf1ead8, s * 6.2, 0.22, 33.6); bx(2.9, 0.1, 1.0, 0x6b4a2b, s * 6.2, 0.48, 33.6); sol(s * 6.2, 33.6, 1.6, 0.65);
    for (let i = 0; i < 9; i++) ball(0.16, [0xff6b81, 0xffd43b, 0xff922b, 0xf06595, 0xffa94d][i % 5], s * 6.2 - 1.2 + (i % 5) * 0.6, 0.62 + (i % 2) * 0.08, 33.3 + (i % 3) * 0.3); });
  bx(3.2, 2.6, 2.6, 0xe7b845, -10.2, 1.3, 33.4); bx(3.5, 0.2, 2.9, 0xf7f1e0, -10.2, 2.7, 33.4); quad(M.roof, [-12.1, 2.7, 34.9], [-12.1, 3.5, 33.4], [-8.3, 3.5, 33.4], [-8.3, 2.7, 34.9], 3, 1.5);   // trạm bảo vệ nhỏ
  bx(1.6, 1.0, 0.06, 0x3f5a68, -10.2, 1.5, 32.05); sign("BẢO VỆ · SECURITY", 2.0, 0.3, "#1c4e80", "#ffffff", -10.2, 2.4, 32.04, 0); sol(-10.2, 33.4, 1.6, 1.3);
  // vài cây xa ngoài cổng
  [[-12, 47], [-5, 48], [6, 47.5], [13, 48], [-22, 46], [24, 47]].forEach(([x, z], i) => bigTree(g, cx + x, cz + z, 1.3 + (i % 3) * 0.3));
  /* ---------- PHÒNG HỌC: công cụ dựng 1 phòng ---------- */
  const zones = [{ x0: cx - 17, x1: cx + 17, z0: cz - 20, z1: cz + 36 }, { x0: cx - 17, x1: cx + 17, z0: cz - 36, z1: cz - 20 }];
  const A = {};   // chỗ bày từ vựng
  const mkRoom = (id, x0, x1, z0, z1, side, doorZ, tint, title) => {
    const west = side === "w", dx0 = west ? x1 : x0, inw = west ? -1 : 1, zc = (z0 + z1) / 2, dep = x1 - x0, lat = z1 - z0;
    const r = { dx0, inw, zc, dep, lat, id };
    r.X = u => dx0 + inw * u; r.Z = v => zc + v; r.vd = doorZ - zc;
    r.b = (du, h, dv, c, u, y, v) => bx(du, h, dv, c, r.X(u), y, r.Z(v));
    r.s = (u, v, hu, hv) => sol(r.X(u), r.Z(v), hu, hv);
    r.ball = (rad, c, u, y, v, a, b2, c2) => ball(rad, c, r.X(u), y, r.Z(v), a, b2, c2);
    r.cy = (rt, rb, h, c, u, y, v, s) => cy(rt, rb, h, c, r.X(u), y, r.Z(v), s);
    r.plane = (mesh, u, y, v, f) => { mesh.position.set(cx + r.X(u), y, cz + r.Z(v)); mesh.rotation.y = f === "d" ? -inw * PI / 2 : f === "b" ? inw * PI / 2 : f === "s" ? 0 : PI; g.add(mesh); return mesh; };   // d: quay về cửa, b: quay vào trong, s: quay +z, n: quay −z
    r.sign = (t, w, h, bg, fg, u, y, v, f) => r.plane(textPlate(t, w, h, bg, fg), u, y, v, f);
    r.tex = (tx, w, h, u, y, v, f, basic) => r.plane(flat(new THREE.Mesh(new THREE.PlaneGeometry(w, h), basic ? new THREE.MeshBasicMaterial({ map: tx, transparent: true }) : new THREE.MeshLambertMaterial({ map: tx }))), u, y, v, f);
    r.anc = (u, y, v, su, sv) => [r.X(u), y, r.Z(v), r.X(su), r.Z(sv)];
    // sàn, trần, 4 tường (cửa ở tường dọc sân), khung cửa, biển
    hplane(dep, lat, new THREE.MeshLambertMaterial({ map: T.tile, color: tint }), (x0 + x1) / 2, 0.012, zc, true, 2);
    hplane(dep, lat, M.ceil, (x0 + x1) / 2, 4.2, zc, true);
    const o = { y1: 5.2, th: 5.2, O: ORG, solid: true };
    if (west) run(M.rwWin, x1, z0, x1, z1, Object.assign({ gaps: [doorZ] }, o)); else run(M.rwWin, x0, z1, x0, z0, Object.assign({ gaps: [doorZ] }, o));
    run(M.rwPlain, x0, z0, x1, z0, { y1: 5.2, th: 5.2 }); run(M.rwPlain, x1, z1, x0, z1, { y1: 5.2, th: 5.2 });
    if (west) run(M.rwWin, x0, z1, x0, z0, Object.assign({}, o)); else run(M.rwWin, x1, z0, x1, z1, Object.assign({}, o));
    const jx = dx0 + inw * 0.05;
    [-1.3, 1.3].forEach(d => bx(0.2, 2.9, 0.14, 0xf7f1e0, jx, 1.45, doorZ + d)); bx(0.2, 0.2, 2.9, 0xf7f1e0, jx, 2.9, doorZ);   // khung cửa trắng
    sign(title, 2.9, 0.5, "#1f6b4a", "#ffffff", dx0 + (west ? 0.1 : -0.1) * 0 + (west ? 0.06 : -0.06) * -1 + (west ? 0 : 0), 3.55, doorZ, west ? PI / 2 : -PI / 2);   // biển trên cửa (nhìn từ hành lang)
    [-1.2, 1.2].forEach(d => { const t = bx(0.1, 0.06, 1.4, 0xffffff, r.X(dep * 0.5), 4.15, r.Z(d * 2.2)); t.material = new THREE.MeshBasicMaterial({ color: 0xffffff }); });   // đèn tuýp
    zones.push({ x0: cx + x0, x1: cx + x1, z0: cz + z0, z1: cz + z1 });
    return r;
  };
  const WOOD = 0x9c6b3e, DWOOD = 0x6b4a2b, STEEL = 0xb8c0c8;
  /* --- 1. LỚP HỌC (trái, z −20…−8) --- */
  { const r = mkRoom("class", -30, -17, -20, -8, "w", -12, 0xfff3d6, "LỚP 6A · CLASSROOM");
    const bd = skin(6.4, 1.9, 48, (x, Wd, Hh) => { ST(x, "#7a4b25"); x.fillRect(0, 0, Wd, Hh); ST(x, "#2d4d3e"); x.fillRect(0.1, 0.1, Wd - 0.2, Hh - 0.2); ST(x, "#eef3ee"); x.font = "0.3px 'Comic Sans MS', system-ui"; x.textAlign = "left"; x.textBaseline = "middle";
      x.fillText("Monday, 15th November", 0.4, 0.45); x.fillText("Today: Our School", 0.4, 0.9); x.font = "0.24px 'Comic Sans MS', system-ui"; x.fillText("How do you spell “pencil”?  P – E – N – C – I – L", 0.4, 1.35); x.strokeStyle = "#ffe066"; x.lineWidth = 0.03; x.beginPath(); x.moveTo(0.4, 1.55); x.lineTo(3.4, 1.55); x.stroke(); ST(x, "#ffe066"); x.fillText("★", 5.7, 0.5); });
    r.tex(bd, 6.4, 1.9, 12.92, 2.3, -1, "d"); r.b(0.12, 0.08, 6.2, 0xc8985a, 12.88, 1.3, -1);
    r.b(1, 0.8, 1.8, WOOD, 11.4, 0.4, -1); r.b(1.1, 0.06, 1.9, DWOOD, 11.4, 0.8, -1); r.b(0.5, 0.5, 0.5, DWOOD, 12.3, 0.25, -1); r.s(11.6, -1, 0.7, 1); r.cy(0.07, 0.07, 0.2, 0xc9a227, 11.3, 0.92, -1.5); r.ball(0.22, 0x2f7ed8, 11.3, 1.15, -1.5);   // bàn giáo viên + quả địa cầu
    r.cy(0.1, 0.2, 1.0, 0x6b4a2b, 12.2, 0.5, 4.9); r.ball(0.36, 0x3b8ed8, 12.2, 1.25, 4.9); r.s(12.2, 4.9, 0.4, 0.4);
    for (let row = 0; row < 3; row++) [-4, 0, 4].forEach(v => { const u = 4 + row * 2; r.b(0.6, 0.06, 1.5, 0xd9b27c, u, 0.75, v); r.b(0.5, 0.7, 1.3, WOOD, u, 0.38, v); [-0.35, 0.35].forEach(d => r.b(0.4, 0.45, 0.4, 0x3b7dd8, u - 0.62, 0.45, v + d)); r.s(u - 0.25, v, 0.65, 0.78); });
    r.cy(0.0, 0.0, 0.0, 0, 0, 0, 0);
    r.tex(T.clock, 0.8, 0.8, 12.9, 3.8, -1, "d", true); { const tt = skin(2.4, 1.7, 56, (x, Wd, Hh) => { ST(x, "#ffffff"); x.fillRect(0, 0, Wd, Hh); ST(x, "#1c4e80"); x.fillRect(0, 0, Wd, 0.32); ST(x, "#fff"); x.font = "bold 0.2px system-ui"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("TIMETABLE", Wd / 2, 0.17);
        const d = ["Mon", "Tue", "Wed", "Thu", "Fri"], sbj = [["Maths", "English", "Science", "English", "Art"], ["English", "Maths", "PE", "Music", "IT"], ["Science", "IT", "English", "Maths", "English"]]; x.font = "0.14px system-ui"; ST(x, "#212529"); d.forEach((s, i) => x.fillText(s, 0.5 + i * 0.45, 0.5)); sbj.forEach((row, j) => row.forEach((s, i) => { ST(x, ["#ffe3a3", "#c5f6fa", "#d8f5a2", "#ffd8e0", "#e5dbff"][(i + j) % 5]); x.fillRect(0.28 + i * 0.45, 0.62 + j * 0.34, 0.43, 0.32); ST(x, "#212529"); x.fillText(s, 0.5 + i * 0.45, 0.8 + j * 0.34); })); });
      r.tex(tt, 2.4, 1.7, 12.92, 2.2, 4.6, "d"); }
    r.sign("ABC · Let’s learn English!", 2.6, 0.4, "#e8590c", "#fff", 9, 3.6, -5.95, "s");
    r.b(0.5, 1.3, 2.6, WOOD, 8.2, 0.65, 5.65); r.b(0.52, 0.05, 2.7, DWOOD, 8.2, 1.32, 5.65); [0xe03131, 0x1c7ed6, 0x2f9e44, 0xfab005, 0x7048e8].forEach((c, i) => r.b(0.2, 0.3, 0.12, c, 8.2, 1.5, 4.7 + i * 0.4)); r.s(8.2, 5.65, 0.3, 1.4);
    A.class = [r.anc(12.8, 2.5, -3.6, 10.2, -3.6), r.anc(12.8, 1.4, -2.7, 10.2, -2.9), r.anc(12.8, 1.4, 0.6, 10.2, 0.6), r.anc(4, 0.9, -4.4, 4.5, -2.4), r.anc(12.8, 2.4, 4.6, 10.4, 4.6), r.anc(4, 0.9, -3.8, 4.2, -2.3), r.anc(6, 0.9, -3.8, 6, -2.2), r.anc(6, 0.9, 0.5, 6, -1.6)]; }
  /* --- 2. PHÒNG KHOA HỌC (trái, z −8…4) --- */
  { const r = mkRoom("lab", -30, -17, -8, 4, "w", -4, 0xe6edf2, "KHOA HỌC · SCIENCE LAB");
    [5, 8.5].forEach(u => { r.b(1, 0.9, 6.4, 0x4a4f55, u, 0.45, 0); r.b(1.1, 0.06, 6.5, 0x23272b, u, 0.93, 0); r.s(u, 0, 0.55, 3.25); });
    [-2.4, -0.4, 1.6].forEach((v, i) => { r.cy(0.11, 0.11, 0.3, 0xd0ebff, 5.2, 1.1, v, 10).material = M.glass; r.cy(0.095, 0.095, 0.16, [0x4dabf7, 0x69db7c, 0xff8787][i], 5.2, 1.03, v, 10); });
    r.ball(0.14, 0xd0ebff, 5.3, 1.1, 2.6).material = M.glass; r.cy(0.04, 0.04, 0.25, 0xd0ebff, 5.3, 1.35, 2.6, 6);
    [-2.2, 0.2].forEach(v => { r.cy(0.1, 0.12, 0.2, 0x868e96, 8.2, 1.04, v, 8); r.cy(0.0, 0.05, 0.12, 0xff922b, 8.2, 1.2, v, 6); }); r.b(0.2, 0.2, 0.2, 0x343a40, 8.4, 1.05, 2.4); r.cy(0.03, 0.03, 0.35, 0x343a40, 8.4, 1.25, 2.4, 6);
    [-1.2, 1.2].forEach(v => r.cy(0.18, 0.18, 0.03, 0xe8f5e9, 5.2, 0.97, v + 0.3, 12).material = M.glass);
    r.b(0.6, 2.2, 10.4, 0x8a6a45, 12.6, 1.1, 0); r.s(12.6, 0, 0.35, 5.2); [0.8, 1.5, 2.1].forEach(y => r.b(0.64, 0.04, 10.2, 0xc4a070, 12.58, y, 0)); for (let i = 0; i < 18; i++) r.cy(0.1, 0.1, 0.3, [0x4dabf7, 0xff8787, 0x69db7c, 0xffd43b][i % 4], 12.25, 1.65 + (i % 2) * 0.6, -4.6 + i * 0.52, 8);
    r.b(0.1, 0.9, 1.4, 0xf8f9fa, 12.9, 1.55, 4.5); r.b(0.25, 0.25, 0.4, 0xf8f9fa, 12.8, 1.9, 4.5);   // áo blouse treo
    const pt = skin(3, 1.8, 56, (x, Wd, Hh) => { ST(x, "#fff"); x.fillRect(0, 0, Wd, Hh); for (let j = 0; j < 7; j++) for (let i = 0; i < 18; i++) { if ((j < 2 && i > 0 && i < 17 && !(i < 2)) || (j === 0 && i === 1) || (j < 3 && i > 1 && i < 12 && j > 0)) continue; ST(x, ["#ffa8a8", "#ffe066", "#a5d8ff", "#b2f2bb", "#d0bfff", "#ffd8a8"][(i * 3 + j) % 6]); x.fillRect(0.1 + i * 0.16, 0.45 + j * 0.2, 0.15, 0.19); } ST(x, "#212529"); x.font = "bold 0.22px system-ui"; x.fillText("PERIODIC TABLE", 0.8, 0.28); });
    r.tex(pt, 3, 1.8, 12.9, 3.0, -2, "d"); r.sign("SAFETY FIRST", 2, 0.4, "#e03131", "#fff", 9, 3.2, 5.95, "n");
    r.b(0.7, 0.9, 2.0, 0xe9ecef, 2, 0.45, -5.4); r.b(0.75, 0.05, 2.1, 0x868e96, 2, 0.92, -5.4); r.s(2, -5.4, 0.45, 1.05);   // bồn rửa
    A.lab = [r.anc(5.3, 1.25, -1.5, 6.7, -1.5), r.anc(8.2, 1.25, -1.0, 6.7, -1.0), r.anc(5.3, 1.1, 1.7, 6.7, 1.7), r.anc(12.8, 1.5, 4.5, 11.3, 4.5)]; }
  /* --- 3. PHÒNG TIN HỌC (trái, z 4…16) --- */
  { const r = mkRoom("comp", -30, -17, 4, 16, "w", 8, 0xe9e6f2, "TIN HỌC · COMPUTER ROOM");
    [-1, 1].forEach(sd => { const dz = sd * 5.4; r.b(10.5, 0.8, 0.9, 0x5b6068, 7.4, 0.4, dz); r.b(10.6, 0.05, 1.0, 0x23272b, 7.4, 0.82, dz); r.s(7.4, dz, 5.3, 0.55);
      [2.6, 5.2, 7.8, 10.4].forEach(u => { r.b(0.06, 0.4, 0.55, 0x1a1a1e, u, 1.15, dz + sd * -0.05); r.b(0.14, 0.2, 0.14, 0x343a40, u, 0.95, dz); r.b(0.3, 0.03, 0.55, 0xdee2e6, u - 0.2 * 0, 0.86, dz - sd * 0.1 + 0); r.b(0.4, 0.5, 0.45, 0x3b5bdb, u, 0.45, dz - sd * 1.1); });
      [2.6, 5.2, 7.8, 10.4].forEach(u => { const sc = r.b(0.02, 0.32, 0.5, 0x3a86d4, u - 0.04, 1.15, dz + sd * -0.04); sc.material = new THREE.MeshBasicMaterial({ color: 0x3a86d4 }); }); });
    r.b(0.1, 2.2, 4.6, 0xf8f9fa, 12.85, 2.6, 0); r.sign("COMPUTER ROOM – NO FOOD OR DRINKS", 4, 0.4, "#e03131", "#fff", 12.8, 4.0, 0, "d");
    r.b(0.7, 0.8, 1.6, 0x5b6068, 11.4, 0.4, -1.2); r.b(0.3, 0.35, 0.5, 0xdee2e6, 11.4, 1.0, -1.2); r.s(11.4, -1.2, 0.5, 0.9);   // máy in
    r.b(0.9, 0.9, 0.9, 0xdee2e6, 12.2, 0.45, -4.6); r.s(12.2, -4.6, 0.55, 0.55);
    A.computer = [r.anc(2.6, 1.0, 5.4, 2.6, 3.6), r.anc(4.9, 0.9, 5.4, 4.9, 3.6), r.anc(7.8, 1.45, 5.7, 7.8, 3.7), r.anc(11.4, 1.3, -1.2, 10.2, -1.2)]; }
  /* --- 4. PHÒNG ÂM NHẠC (trái, z 16…26) --- */
  { const r = mkRoom("music", -30, -17, 16, 26, "w", 20, 0xf3e3d3, "ÂM NHẠC · MUSIC ROOM");
    r.b(0.8, 1.35, 2.2, 0x1e1e24, 12.4, 0.68, 1); r.b(0.55, 0.05, 2.2, 0xffffff, 12.0, 1.02, 1); [-0.8, -0.3, 0.2, 0.7, 1.2].forEach(d => r.b(0.04, 0.03, 0.05, 0x111111, 11.95, 1.05, 1 + d)); r.b(0.45, 0.45, 0.8, 0x4a2c1a, 11.2, 0.45, 1); r.s(12.2, 1, 0.5, 1.1); r.s(11.2, 1, 0.3, 0.45);   // piano + ghế
    [[-4.2, 0xc98a4b], [-3.4, 0x8e4b24]].forEach(([v, c]) => { r.b(0.08, 0.5, 0.4, c, 12.9, 2.2, v); r.b(0.04, 0.5, 0.06, 0x3b2a1a, 12.9, 2.85, v); });   // guitar treo tường
    r.cy(0.38, 0.38, 0.5, 0xc92a2a, 8.2, 0.4, 4, 14).rotation.x = 0; r.cy(0.28, 0.28, 0.25, 0xf1f3f5, 7.4, 0.75, 3.2, 14); r.cy(0.2, 0.2, 0.2, 0xf1f3f5, 7.4, 1.05, 4.6, 12); r.cy(0.3, 0.3, 0.02, 0xd9a441, 7.4, 1.55, 3.2, 14); r.s(7.8, 4, 0.8, 1.1);   // bộ trống
    [[2.8, -4], [2.8, -2.8], [3.8, 4], [3.8, -4]].forEach(([u, v]) => { r.b(0.35, 0.45, 0.35, 0x3b7dd8, u, 0.22, v); r.s(u, v, 0.25, 0.25); });
    r.cy(0.03, 0.03, 1.3, 0x343a40, 5.2, 0.65, -2.2, 6); r.b(0.35, 0.3, 0.05, 0xffffff, 5.2, 1.4, -2.2); r.cy(0.18, 0.18, 0.04, 0x343a40, 5.2, 0.02, -2.2, 10);   // giá nhạc
    r.b(0.6, 1.4, 0.9, 0x8a6a45, 8, 0.7, -4.6); r.s(8, -4.6, 0.4, 0.55); for (let i = 0; i < 5; i++) r.cy(0.025, 0.025, 0.5, [0xf8f9fa, 0xffd43b][i % 2], 8.0, 1.62, -4.4 - i * 0.12, 6);
    [[12.9, 2, 3.6, 0x2b8a3e], [12.9, 2.6, 3.1, 0xe8590c]].forEach(([u, y, v, c]) => r.b(0.1, 0.9, 0.9, c, u, y, v));
    r.sign("♪ ♫ MUSIC ROOM ♪", 2.6, 0.5, "#7048e8", "#fff", 11, 3.6, -4.95, "s");
    A.music = [r.anc(12.2, 1.55, 1.8, 10.8, 2.0), r.anc(12.9, 2.2, -4.2, 11.2, -4.2), r.anc(8, 1.3, -4.6, 6.8, -4.6), r.anc(8.0, 1.8, -4.3, 6.8, -3.4), r.anc(12.9, 2.6, 3.1, 11.2, 3.1)]; }
  /* --- 5. PHÒNG MỸ THUẬT (trái, z 26…36) --- */
  { const r = mkRoom("art", -30, -17, 26, 36, "w", 32, 0xf4e6d0, "MỸ THUẬT · ART ROOM");
    [-3.2, -1.2].forEach((v, i) => { [-0.25, 0.25].forEach(d => r.b(0.05, 1.5, 0.05, 0x8a6a45, 6.2 + d * 0.6, 0.75, v + d * 1.2)); r.b(0.05, 0.9, 0.7, [0xffe066, 0xa5d8ff][i], 6.0, 1.15, v); });
    r.b(1.4, 0.06, 3.6, DWOOD, 8.8, 0.82, 1); [-1.6, 1.6].forEach(d => [-0.5, 0.5].forEach(e => r.b(0.07, 0.8, 0.07, 0x4a3526, 8.8 + e, 0.4, 1 + d))); r.s(8.8, 1, 0.8, 1.9);
    for (let i = 0; i < 8; i++) r.cy(0.06, 0.06, 0.04, [0xe03131, 0xfab005, 0x2f9e44, 0x1c7ed6, 0x7048e8, 0xf06595][i % 6], 8.7, 0.88, -0.2 + i * 0.28, 8); r.b(0.5, 0.04, 0.8, 0xf8f9fa, 8.9, 0.86, 1.2);
    [[10.2, -3.8], [10.2, 0.6], [10.2, 4.0]].forEach(([u, v]) => r.b(0.35, 0.45, 0.35, 0xe8590c, u - 1, 0.22, v));
    r.b(0.6, 1.5, 4.6, 0x8a6a45, 12.6, 0.75, -2.4); r.s(12.6, -2.4, 0.35, 2.4); [0.5, 1.0, 1.45].forEach(y => r.b(0.64, 0.04, 4.5, 0xc4a070, 12.58, y, -2.4)); for (let i = 0; i < 6; i++) r.cy(0.1, 0.13, 0.22, [0xb5651d, 0xc2703d][i % 2], 12.3, 1.12, -4 + i * 0.7, 8);
    [[12.9, 2.6, 1.0, 0xff6b6b], [12.9, 2.5, 2.2, 0x4dabf7], [12.9, 2.7, 3.4, 0xffd43b], [12.9, 2.4, 4.4, 0x69db7c]].forEach(([u, y, v, c]) => { r.b(0.08, 0.9, 0.7, 0xf7f1e0, u, y, v); r.b(0.09, 0.75, 0.55, c, u - 0.01, y, v); });
    r.b(0.1, 0.8, 0.5, 0xf1f3f5, 12.9, 1.5, 4.7); r.b(0.5, 0.6, 0.4, 0xf1f3f5, 12.85, 1.0, 4.7);
    r.sign("MỸ THUẬT · LET’S DRAW!", 2.6, 0.45, "#e8590c", "#fff", 11, 3.5, -4.95, "s");
    A.art = [r.anc(8.7, 0.95, 0.4, 7.2, 0.4), r.anc(8.9, 0.92, 1.4, 7.2, 1.6), r.anc(12.8, 1.6, 4.7, 11.3, 4.7), r.anc(12.4, 1.55, -3.4, 11.0, -3.4)]; }
  /* --- 6. THƯ VIỆN TRƯỜNG (phải, z −20…−4) --- */
  { const r = mkRoom("lib", 17, 30, -20, -4, "e", -12, 0xe9d9bd, "THƯ VIỆN · LIBRARY");
    const bk = skin(3, 2.2, 36, (x, Wd, Hh) => { ST(x, "#5a3c22"); x.fillRect(0, 0, Wd, Hh); for (let j = 0; j < 4; j++) { ST(x, "#4a2f1a"); x.fillRect(0, j * 0.55 + 0.5, Wd, 0.05); let X = 0.05; while (X < Wd - 0.1) { const w = 0.07 + ((X * 37) % 0.1), h = 0.34 + ((X * 53) % 0.14); ST(x, ["#e03131", "#1c7ed6", "#2f9e44", "#fab005", "#7048e8", "#f06595", "#868e96", "#e8590c"][Math.floor(X * 29) % 8]); x.fillRect(X, j * 0.55 + 0.5 - h, w, h); X += w + 0.01; } } });
    const shelf = (u, v, len, f) => { r.b(0.6, 2.2, len, 0x8a6a45, u, 1.1, v); r.tex(bk, len, 2.2, u + (f === "d" ? -0.31 : 0.31), 1.1, v, f); if (f === "b") r.tex(bk, len, 2.2, u + 0.31 * 0, 1.1, v, "b"); r.s(u, v, 0.35, len / 2); };
    r.b(0.5, 2.2, 15.4, 0x8a6a45, 12.7, 1.1, 0); r.tex(bk, 15.4, 2.2, 12.44, 1.1, 0, "d"); r.s(12.7, 0, 0.3, 7.7);
    [[6, -5.2], [6, 5.2], [9.4, -5.2], [9.4, 5.2]].forEach(([u, v]) => { r.b(0.7, 2.0, 4.4, 0x8a6a45, u, 1.0, v); r.tex(bk, 4.4, 2.0, u - 0.36, 1.0, v, "d"); r.tex(bk, 4.4, 2.0, u + 0.36, 1.0, v, "b"); r.s(u, v, 0.4, 2.2); });
    r.b(1.0, 1.0, 3.0, 0x5c3b1e, 2.2, 0.5, 5.2); r.b(1.1, 0.06, 3.1, 0xc8985a, 2.2, 1.02, 5.2); r.s(2.2, 5.2, 0.6, 1.6); r.b(0.35, 0.18, 0.5, 0x2f7ed8, 2.2, 1.14, 5.5);   // quầy thủ thư
    [[3, -6.5, 0xe8590c], [3.9, -5.6, 0x2f9e44], [2.7, -5.4, 0xf06595]].forEach(([u, v, c]) => { r.ball(0.5, c, u, 0.3, v, 1, 0.6, 1); r.s(u, v, 0.5, 0.5); });   // bean bag
    r.b(1.2, 0.4, 1.2, 0x9c6b3e, 4.2, 0.2, -6.4); r.s(4.2, -6.4, 0.7, 0.7); r.cy(0.03, 0.03, 0.5, 0x343a40, 2.2, 1.3, 4.2, 6); r.cy(0.2, 0.1, 0.22, 0xffd43b, 2.2, 1.6, 4.2, 10);
    r.b(0.04, 0.3, 0.2, 0xf1f3f5, 4.2, 0.45, -6.2);
    r.sign("SILENCE, PLEASE · Giữ trật tự", 3.4, 0.45, "#2b4c8c", "#fff", 6, 3.6, -7.95, "s");
    A.library = [r.anc(3, 0.65, -6.5, 3.9, -4.6), r.anc(2.2, 1.85, 4.2, 3.4, 2.4), r.anc(4.2, 0.5, -6.3, 5.2, -5.0)]; }
  /* --- 7. CĂN TIN (phải, z −4…16) --- */
  { const r = mkRoom("canteen", 17, 30, -4, 16, "e", 8, 0xf2e8d5, "CĂN TIN · CANTEEN");
    [-8, -5.5, -3].forEach(v => { r.b(7, 0.06, 0.9, 0xd9b27c, 6.5, 0.76, v); r.b(6.8, 0.7, 0.5, 0x8a6a45, 6.5, 0.38, v); [-0.7, 0.7].forEach(d => r.b(6.8, 0.06, 0.28, 0x3b7dd8, 6.5, 0.46, v + d * 0.82)); r.s(6.5, v, 3.6, 0.95); });
    [6.2, 8.5].forEach(v => { r.b(7, 0.06, 0.9, 0xd9b27c, 6.5, 0.76, v); r.b(6.8, 0.7, 0.5, 0x8a6a45, 6.5, 0.38, v); [-0.7, 0.7].forEach(d => r.b(6.8, 0.06, 0.28, 0xe8590c, 6.5, 0.46, v + d * 0.82)); r.s(6.5, v, 3.6, 0.95); });
    r.b(1.0, 1.0, 14, 0x9aa5ad, 10.8, 0.5, 0); r.b(1.1, 0.06, 14.1, 0xdee2e6, 10.8, 1.02, 0); r.s(10.8, 0, 0.6, 7.1);
    [[-5.5, 0xf08c00], [-3.5, 0xe03131], [-1.5, 0x2f9e44], [0.5, 0x1c7ed6], [2.5, 0xf06595]].forEach(([v, c]) => { r.cy(0.38, 0.34, 0.2, 0xced4da, 10.8, 1.14, v, 12); r.cy(0.34, 0.34, 0.04, c, 10.8, 1.26, v, 12); });
    r.cy(0.22, 0.22, 0.4, 0xf1f3f5, 10.8, 1.25, 4.5, 12); r.cy(0.22, 0.22, 0.4, 0xe9ecef, 10.8, 1.25, 5.5, 12);
    const mn = skin(4, 1.8, 52, (x, Wd, Hh) => { ST(x, "#2d4d3e"); x.fillRect(0, 0, Wd, Hh); ST(x, "#c8985a"); x.fillRect(0, 0, Wd, 0.1); x.fillRect(0, Hh - 0.1, Wd, 0.1); ST(x, "#ffe9a8"); x.font = "bold 0.3px system-ui"; x.textAlign = "center"; x.fillText("🍽️ SCHOOL CANTEEN MENU", Wd / 2, 0.4); x.textAlign = "left"; x.font = "0.2px system-ui"; ST(x, "#fff");
      [["Cơm gà – Chicken rice", "25k"], ["Phở bò – Beef noodle soup", "25k"], ["Bánh mì – Bread roll", "12k"], ["Chuối – Banana", "5k"], ["Sữa – Milk", "8k"]].forEach(([n, p], i) => { x.fillText(n, 0.3, 0.8 + i * 0.22); x.fillText(p, Wd - 0.7, 0.8 + i * 0.22); }); });
    r.tex(mn, 4, 1.8, 12.9, 2.9, 3.5, "d"); r.sign("Wash your hands! Rửa tay trước khi ăn", 3.6, 0.4, "#1c7ed6", "#fff", 6, 3.5, -9.95, "s");
    r.b(0.5, 0.9, 0.5, 0x4c6ef5, 12.5, 0.45, -8.4); r.cy(0.25, 0.25, 0.5, 0xa5d8ff, 12.5, 1.15, -8.4, 10).material = M.glass; r.s(12.5, -8.4, 0.35, 0.35);
    A.canteen = [r.anc(5.0, 0.84, -2.9, 5.0, -1.3), r.anc(7.4, 0.9, -3.1, 7.4, -1.3), r.anc(6.2, 0.84, 6.2, 6.2, 4.6), r.anc(10.8, 1.5, 4.5, 9.4, 4.5), r.anc(10.8, 1.2, -0.5, 9.4, -0.5)]; }
  /* --- 8. PHÒNG HIỆU TRƯỞNG (phải, z 16…26) --- */
  { const r = mkRoom("office", 17, 30, 16, 26, "e", 20, 0xe7dcc6, "HIỆU TRƯỞNG · PRINCIPAL");
    r.b(1.2, 0.8, 2.6, 0x5c3b1e, 10.4, 0.4, 0); r.b(1.3, 0.06, 2.7, 0x7a4b25, 10.4, 0.83, 0); r.s(10.4, 0, 0.75, 1.4); r.b(0.5, 0.9, 0.6, 0x7a1f1f, 11.6, 0.55, 0); r.b(0.35, 0.18, 0.5, 0xf8f9fa, 10.3, 0.95, 0.3); r.cy(0.04, 0.04, 0.15, 0xc9a227, 10.3, 0.98, -0.6, 6);
    r.b(0.6, 2.2, 5, 0x5c3b1e, 12.6, 1.1, 3); r.s(12.6, 3, 0.35, 2.55); r.b(0.64, 1.6, 4.8, 0xd0ebff, 12.3, 1.3, 3).material = M.glass; [0.5, 1.2, 1.8].forEach(y => r.b(0.6, 0.04, 4.8, 0xc4a070, 12.3, y, 3));
    [[-1.8, 0xf2c94c], [-0.6, 0xd9a441], [0.6, 0xc9a227], [1.8, 0xf2c94c]].forEach(([d, c], i) => { r.cy(0.1, 0.07, 0.16, c, 12.3, 1.35, 3 + d - 0.4 + i * 0.5 - 0.0, 8); r.cy(0.05, 0.05, 0.05, 0xd9a441, 12.3, 0.62, 3 + d, 10); r.ball(0.07, 0xe03131, 12.3, 1.45, 3 + d + 0.6); });
    r.tex(skin(1.6, 1.1, 50, (x, Wd, Hh) => { ST(x, "#7a4b25"); x.fillRect(0, 0, Wd, Hh); ST(x, "#fffaf0"); x.fillRect(0.08, 0.08, Wd - 0.16, Hh - 0.16); ST(x, "#1c4e80"); x.font = "bold 0.16px system-ui"; x.textAlign = "center"; x.fillText("CERTIFICATE", Wd / 2, 0.38); x.font = "0.12px system-ui"; x.fillText("of Excellence", Wd / 2, 0.58); ST(x, "#d9a441"); x.beginPath(); x.arc(Wd / 2, 0.82, 0.12, 0, 7); x.fill(); }), 1.6, 1.1, 12.9, 2.5, -3.8, "d");
    r.tex(skin(1.6, 1.1, 50, (x, Wd, Hh) => { ST(x, "#7a4b25"); x.fillRect(0, 0, Wd, Hh); ST(x, "#e9ecef"); x.fillRect(0.08, 0.08, Wd - 0.16, Hh - 0.16); ST(x, "#e03131"); x.font = "bold 0.18px system-ui"; x.textAlign = "center"; x.fillText("A+", Wd / 2, 0.5); x.font = "0.12px system-ui"; ST(x, "#1c4e80"); x.fillText("Best Class 2026", Wd / 2, 0.8); }), 1.6, 1.1, 12.9, 2.5, -1.6, "d");
    fur("couch_pillows", r.X(2.6), r.Z(-3.2), inwRot(r.inw, -1), 1, 1.4, 0.6); r.b(0.7, 0.35, 1.2, 0x9c6b3e, 4.0, 0.18, -3.2); r.s(4.0, -3.2, 0.45, 0.65); r.cy(0.5, 0.5, 0.02, 0x9c2f2f, 3.5, 0.02, -3.2, 20);
    r.sign("VERSE SCHOOL · Study hard, play fair", 4.4, 0.5, "#1c4e80", "#ffe9a8", 12.9, 3.6, 0, "d");
    A.office = [r.anc(12.3, 1.35, 1.6, 11.0, 1.8), r.anc(12.9, 2.5, -3.8, 11.0, -3.6), r.anc(12.3, 1.45, 4.4, 11.0, 4.4)]; }
  /* --- 9. PHÒNG Y TẾ (phải, z 26…36) --- */
  { const r = mkRoom("nurse", 17, 30, 26, 36, "e", 32, 0xe6f3f0, "Y TẾ · SCHOOL NURSE");
    fur("bed_single_A", r.X(10.6), r.Z(-3.2), inwRot(r.inw, 1), 1.2, 1.0, 1.0);
    r.b(0.6, 1.8, 2.4, 0xf8f9fa, 12.6, 0.9, 1.6); r.s(12.6, 1.6, 0.35, 1.25); r.b(0.04, 0.5, 0.3, 0xe03131, 12.25, 1.5, 1.6); r.b(0.04, 0.3, 0.5, 0xe03131, 12.25, 1.5, 1.6);
    r.b(0.6, 0.12, 1.2, 0xdee2e6, 6, 0.8, -4.3); [[-0.25, -0.5], [0.25, -0.5], [-0.25, 0.5], [0.25, 0.5]].forEach(([a, b]) => { r.cy(0.05, 0.05, 0.1, 0x343a40, 6 + a, 0.35, -4.3 + b, 6); r.b(0.04, 0.4, 0.04, 0x868e96, 6 + a, 0.55, -4.3 + b); }); r.s(6, -4.3, 0.4, 0.7);   // cáng
    r.b(0.5, 0.55, 0.5, 0xdee2e6, 5, 0.28, 3.4); r.b(0.35, 0.05, 0.3, 0x343a40, 5, 0.58, 3.4); r.s(5, 3.4, 0.35, 0.35);   // cân
    r.b(0.6, 0.9, 0.9, 0xf8f9fa, 12.2, 0.45, -4.2); r.b(0.5, 0.35, 0.4, 0xf8f9fa, 12.2, 1.1, -4.2); r.b(0.52, 0.1, 0.12, 0xe03131, 12.2, 1.1, -4.2); r.b(0.12, 0.3, 0.52, 0xe03131, 12.2, 1.1, -4.2); r.s(12.2, -4.2, 0.4, 0.55);   // hộp sơ cứu
    const ey = skin(0.9, 1.4, 60, (x, Wd, Hh) => { ST(x, "#fff"); x.fillRect(0, 0, Wd, Hh); ST(x, "#212529"); x.textAlign = "center"; x.textBaseline = "middle"; [["E", 0.4], ["F P", 0.26], ["T O Z", 0.2], ["L P E D", 0.15], ["P E C F D", 0.11]].forEach(([t, s], i) => { x.font = "bold " + s + "px system-ui"; x.fillText(t, Wd / 2, 0.3 + i * 0.27); }); });
    r.tex(ey, 0.9, 1.4, 12.9, 2.0, -1.5, "d"); r.sign("Wash hands · Drink water", 2.2, 0.4, "#2f9e44", "#fff", 8, 3.3, -4.95, "s");
    r.b(0.5, 0.5, 0.5, 0x4c6ef5, 4.2, 0.25, -4.7); r.s(4.2, -4.7, 0.3, 0.3);
    A.nurse = [r.anc(12.2, 1.4, -3.9, 11.0, -3.6), r.anc(12.2, 1.5, 1.2, 11.0, 1.4), r.anc(12.2, 1.45, -4.5, 11.0, -4.8), r.anc(6, 0.95, -4.3, 5.0, -3.2)]; }
  /* ---------- NHÀ THI ĐẤU (z −36…−20): sân gỗ, bóng rổ, bóng đá ---------- */
  { const gx0 = -17, gx1 = 17, gz0 = -36, gz1 = -20;
    run(M.gym, gx0, gz0, gx1, gz0, { y1: 7.5, th: 7.5, solid: true }); run(M.gym, gx1, gz0, gx1, gz1, { y1: 7.5, th: 7.5, solid: true }); run(M.gym, gx0, gz1, gx0, gz0, { y1: 7.5, th: 7.5, solid: true });
    run(M.gym, gx1, gz1, gx0, gz1, { y1: 7.5, th: 7.5, gaps: [0], gw: 7, dh: 4.6, solid: true });
    hplane(34, 16, M.wood, 0, 0.012, -28, true, 2); hplane(34, 16, M.ceil, 0, 7.5, -28, true);
    hplane(28, 12, LM(skin(28, 12, 16, (x, Wd, Hh) => { x.strokeStyle = "#ffffff"; x.lineWidth = 0.08; x.strokeRect(0.1, 0.1, Wd - 0.2, Hh - 0.2); x.beginPath(); x.moveTo(Wd / 2, 0.1); x.lineTo(Wd / 2, Hh - 0.1); x.stroke(); x.beginPath(); x.arc(Wd / 2, Hh / 2, 1.8, 0, 7); x.stroke(); [0, 1].forEach(s => { const X = s ? Wd - 0.1 : 0.1, d = s ? -1 : 1; x.strokeRect(s ? Wd - 5.9 : 0.1, Hh / 2 - 2.45, 5.8, 4.9); x.beginPath(); x.arc(X + d * 5.8, Hh / 2, 1.8, s ? PI / 2 : -PI / 2, s ? PI * 1.5 : PI / 2); x.stroke(); }); }), { transparent: true }), 0, 0.02, -28, true);
    [-1, 1].forEach(s => { bx(0.12, 1.1, 1.8, 0xf8f9fa, s * 16.5, 3.4, -28); bx(0.14, 0.5, 0.7, 0xe03131, s * 16.45, 3.2, -28); const rg = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.025, 6, 14), mat(0xff6b1a)); rg.rotation.x = PI / 2; rg.position.set(cx + s * 16.0, 3.05, cz - 28); g.add(rg); const nt = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.12, 0.4, 8, 1, true), mat(0xffffff, { wireframe: true })); nt.position.set(cx + s * 16.0, 2.85, cz - 28); g.add(nt); });
    bx(6, 0.08, 0.08, 0xf8f9fa, 0, 2.2, -35.5); [-3, 3].forEach(s => bx(0.08, 2.2, 0.08, 0xf8f9fa, s, 1.1, -35.5)); { const gn = new THREE.Mesh(new THREE.PlaneGeometry(6, 2.2), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.6 })); gn.position.set(cx, 1.1, cz - 35.8); flat(gn); g.add(gn); } sol(0, -35.4, 3.2, 0.3);   // khung thành
    sign("VERSE TIGERS 12 : 10 GUESTS", 5, 0.8, "#212529", "#ffd43b", 0, 5.6, -35.9, 0);
    [[-14.8, -34], [-13.6, -34]].forEach(([x, z]) => { bx(1.0, 0.5, 1.6, 0x1c7ed6, x, 0.25, z); }); sol(-14.2, -34, 1.2, 1.0);   // thảm tập
    bx(1.4, 0.9, 0.6, 0x6b4a2b, 14, 0.45, -34.6); for (let i = 0; i < 3; i++) ball(0.19, [0xff8a2a, 0xf8f9fa, 0xffd43b][i], 13.5 + i * 0.5, 1.1, -34.6); sol(14, -34.6, 0.8, 0.4);   // giá bóng
    bx(0.14, 0.3, 2.6, 0x6b4a2b, 16.6, 0.8, -23.4); bx(0.5, 0.06, 2.6, 0x9c6b3e, 16.4, 0.5, -23.4); sol(16.4, -23.4, 0.35, 1.3);   // ghế dài
    bx(0.08, 0.5, 0.08, 0x343a40, -16.6, 1.5, -23.4);
    A.gym = [[14.1, 1.4, -34.6, 14.1, -32.8], [15.8, 3.3, -28, 14.4, -28], [0, 1.4, -35.4, 0, -33.6], [16.4, 0.95, -23.4, 14.9, -23.4], [-16.6, 1.4, -23.4, -15.0, -23.4], [-14.2, 0.9, -34, -14.2, -32.2]]; }
  /* ---------- CHỖ BÀY TỪ VỰNG KHU SÂN ---------- */
  A.yard = [[0, 5.5, -2, 0, 1.5], [12.7, 1.7, 4, 11.2, 4], [-12.4, 2.6, 2, -11, 2], [3.5, 2.2, 36, 2.6, 34.2], [-8, 3.2, 21, -6, 21], [-3.5, 0.85, 17, -2.0, 17], [-6.2, 0.85, 33.6, -6.2, 32], [7.5, 0.4, 8, 5.2, 8], [10.9, 1.1, 28.8, 9.4, 28.8]];
  const bike = [[10.9, 1.1, 28.8, 9.4, 28.8]];
  P.zones = zones.slice(2).concat(zones.slice(0, 2));
  Object.keys(A).forEach(k => A[k] = A[k].map(([a, b, c, d, e]) => [cx + a, b, cz + c, cx + d, cz + e]));
  P.anchors = A;
  g.traverse(o => { if (o.isMesh && o.position.y > 5.5 && !o.userData.flat) o.userData.flat = true; });
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
  function inwRot(inw, k) { return k * inw * PI / 2 * -1; }
}
INTERIORS["campus"] = {
  furnish: furnishCampus,
  customWalls: true,
  bright: true
};

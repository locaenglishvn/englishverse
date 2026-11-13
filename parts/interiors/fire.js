/* EnglishVerse – nội thất "fire" (layout: "firehall"). Mỗi nơi 1 file (xem docs/TEAM.md).
   FIRE STATION – nhà xe trạm cứu hoả thân thiện (24 × 32 m, trần cao 8 m): tường gạch đỏ phía dưới + kem phía trên có cửa sổ vòm,
   sàn bê tông xám có vạch vàng đỗ xe, xà thép trên trần. Không có dụng cụ đáng sợ (không rìu); mọi thứ đứng im. Toạ độ (x, z) từ giữa phòng, cửa ở z = +16.
   Khu:  garage   – xe cứu hoả đỏ lớn (dựng bằng khối) đỗ bên trái x -8..-5,2; cuộn vòi, trụ nước, thang dựng tường
         gear     – giá đồ bảo hộ dọc tường phải (x +9..+12, z -10..0): áo, mũ, ủng, bình dưỡng khí, bình chữa cháy
         alarm    – góc báo động sau-phải: chuông lớn, bảng điều khiển, cột trượt (fire pole), bản đồ, nút kéo báo cháy
         rest     – khu nghỉ / bếp trước-phải: sofa, bàn ăn, tủ lạnh, ấm nước, đồng hồ
         training – góc tập huấn trước-trái: poster "STOP, DROP AND ROLL", bình chữa cháy mẫu, ghế cho học sinh
   Chừa trống: lối vào x -1.5..+1.5, z +9..+16; hành lang giữa; chỗ NPC (3,6) (-1,-4) (8,-6) (8,8) (-6,10) (bán kính 0,8 m). */
const FR_ = { red: 0xc92a2a, dred: 0x9c1f1f, steel: 0xaeb7c0, yel: 0xf2c94c, dk: 0x2b3138, wh: 0xf4f6f8, gl: 0x9ed4f0, wood: 0xb98b54 };
const FRW = {};
function fireWall(len, h, kind) {   // gạch đỏ phía dưới, kem + cửa sổ vòm phía trên; tường trước có cửa cuốn nhà xe
  const k = len + kind; if (FRW[k]) return FRW[k];
  const t = skin(len, h, 16, (x, Wd, Hh) => {
    const by = Hh - 3.6;   // mép trên phần gạch (cao 3,6 m)
    x.fillStyle = "#f0e2c8"; x.fillRect(0, 0, Wd, Hh);
    x.fillStyle = "#e3d1ad"; for (let X = 0; X < Wd; X += 3) x.fillRect(X, 0, 0.04, by);
    x.fillStyle = "#a93f2c"; x.fillRect(0, by, Wd, 3.6);   // gạch
    x.fillStyle = "#c85a40"; for (let r = 0; r < 26; r++) for (let X = (r % 2) * 0.19; X < Wd; X += 0.38) if ((X * 7 + r * 3) % 5 < 2) x.fillRect(X + 0.02, by + r * 0.14 + 0.02, 0.34, 0.1);
    x.fillStyle = "#e2c9a6"; for (let r = 0; r < 26; r++) x.fillRect(0, by + r * 0.14 + 0.12, Wd, 0.02);   // vữa
    x.fillStyle = "#7d7f84"; x.fillRect(0, Hh - 0.3, Wd, 0.3);   // chân đá
    x.fillStyle = "#f6ecd6"; x.fillRect(0, by - 0.12, Wd, 0.22); x.fillStyle = "#c9a227"; x.fillRect(0, by + 0.1, Wd, 0.05);   // gờ giữa
    x.fillStyle = "#c92a2a"; x.fillRect(0, 0, Wd, 0.28); x.fillStyle = "#f6ecd6"; x.fillRect(0, 0.28, Wd, 0.1);   // diềm mái đỏ
    const arch = (c) => { const w = 1.8, X = c - w / 2; x.fillStyle = "#f6ecd6"; archPath(x, X - 0.16, 1.5, w + 0.32, 3.1); x.fill(); x.fillStyle = "#bfdcec"; archPath(x, X, 1.66, w, 2.9); x.fill();
      x.fillStyle = "#f6ecd6"; x.fillRect(c - 0.04, 2.5, 0.08, 2.1); x.fillRect(X, 3.3, w, 0.08); x.fillStyle = "#e8f6fc"; x.fillRect(X + 0.1, 2.6, 0.5, 0.9); };
    if (kind === "left") [-12, -8, -4, 0, 4, 8, 12].forEach(z => arch(Wd / 2 - z));
    if (kind === "right") [-12, -8, -4, 0, 4, 8, 12].forEach(z => arch(Wd / 2 + z));
    if (kind === "back") [-9.5, -4.5, 4.5].forEach(dx => arch(Wd / 2 + dx));
    if (kind === "front") {
      [3.5, 7.5, 10.8].forEach(dx => arch(Wd / 2 - dx));
      const c = Wd / 2 + 6.6, w = 5.2, X = c - w / 2, Y = Hh - 4.7;   // cửa cuốn nhà xe (x = -6,6)
      x.fillStyle = "#8c1d1d"; x.fillRect(X - 0.25, Y - 0.25, w + 0.5, 4.95); x.fillStyle = "#aeb7c0"; x.fillRect(X, Y, w, 4.45);
      x.fillStyle = "#8e98a3"; for (let j = 0; j < 20; j++) x.fillRect(X, Y + j * 0.22, w, 0.03);
      x.fillStyle = "#dfe6ec"; for (let i = 0; i < 4; i++) x.fillRect(X + 0.4 + i * 1.2, Y + 0.5, 0.9, 0.25);   // ô kính nhỏ
      x.fillStyle = "#f2c94c"; x.fillRect(X - 0.25, Y + 4.45, w + 0.5, 0.25);
    }
  });
  return FRW[k] = new THREE.MeshLambertMaterial({ map: t });
}
function fireFloor(W, D) {   // bê tông xám + vạch vàng đỗ xe + thảm khu nghỉ / tập huấn
  return skin(W, D, 16, (x) => {
    const cX = W / 2, cY = D / 2;
    x.fillStyle = "#a3a8ae"; x.fillRect(0, 0, W, D);
    x.fillStyle = "#92979e"; for (let i = 0; i < W / 2.4; i++) for (let j = 0; j < D / 2.4; j++) if ((i + j) % 2) x.fillRect(i * 2.4, j * 2.4, 2.4, 2.4);
    x.fillStyle = "#8d9299"; for (let X = 0; X < W; X += 2.4) x.fillRect(X, 0, 0.03, D); for (let Y = 0; Y < D; Y += 2.4) x.fillRect(0, Y, W, 0.03);
    // vạch vàng ô đỗ xe cứu hoả (x -9,1 .. -4,1; z -13 .. 3)
    x.fillStyle = "#f2c94c"; x.fillRect(cX - 9.1, cY - 13, 0.14, 16); x.fillRect(cX - 4.1, cY - 13, 0.14, 16); x.fillRect(cX - 9.1, cY + 2.9, 5.14, 0.14);
    for (let z = -13; z < 3; z += 1.6) { x.fillRect(cX - 6.7, cY + z, 0.14, 0.8); }   // vạch giữa đứt đoạn
    x.fillStyle = "#d6c19b"; x.fillRect(cX + 3.6, cY + 2.4, 8.4, 9.2); x.fillStyle = "#c7b189"; for (let i = 0; i < 8; i++) for (let j = 0; j < 9; j++) if ((i + j) % 2) x.fillRect(cX + 3.6 + i * 1.05, cY + 2.4 + j * 1.02, 1.05, 1.02);   // gạch nhà bếp
    x.fillStyle = "#8fb7e0"; x.fillRect(cX - 12, cY + 5.6, 6.4, 7); x.strokeStyle = "#2f5f9a"; x.lineWidth = 0.1; x.strokeRect(cX - 11.9, cY + 5.7, 6.2, 6.8);   // thảm tập huấn
    x.fillStyle = "#4b5057"; x.fillRect(cX + 9.2, cY - 10.5, 2.8, 11); x.fillRect(cX + 3, cY - 16, 9, 4.6);   // thảm cao su khu đồ + báo động
    for (let i = 0; i < 12; i++) { x.fillStyle = i % 2 ? "#2b3138" : "#f2c94c"; x.fillRect(cX - 1.5 + i * 0.25, cY + D / 2 - 0.5, 0.25, 0.5); }   // vạch chéo cửa
    x.fillStyle = "#c92a2a"; x.fillRect(cX - 1.2, cY + D / 2 - 1.3, 2.4, 0.8);
  });
}
function fireEmblem(s) {   // phù hiệu tự vẽ: khiên đỏ + ngọn lửa + chữ
  return skin(s, s, 80, (x) => {
    const c = s / 2; x.fillStyle = "#c9a227"; x.beginPath(); x.arc(c, c, c * 0.98, 0, 7); x.fill(); x.fillStyle = "#9c1f1f"; x.beginPath(); x.arc(c, c, c * 0.88, 0, 7); x.fill();
    x.fillStyle = "#ff922b"; x.beginPath(); x.moveTo(c, c * 0.3); x.bezierCurveTo(c * 1.5, c * 0.75, c * 1.45, c * 1.25, c, c * 1.35); x.bezierCurveTo(c * 0.55, c * 1.25, c * 0.5, c * 0.75, c, c * 0.3); x.fill();
    x.fillStyle = "#ffd43b"; x.beginPath(); x.moveTo(c, c * 0.7); x.bezierCurveTo(c * 1.25, c * 0.95, c * 1.2, c * 1.25, c, c * 1.3); x.bezierCurveTo(c * 0.8, c * 1.25, c * 0.75, c * 0.95, c, c * 0.7); x.fill();
    signText(x, "VERSE FIRE", c, c * 1.62, s * 0.7, s * 0.11, "#ffffff");
  });
}
function furnishFire(P, g, cx, cz, W, D, fur) {
  const H = (P.size || {}).h || 8, S = P.room.solids, BK = -D / 2, FRN = D / 2, LW = -W / 2, RW = W / 2;
  const sol = (x, z, hw, hd) => S.push({ x: cx + x, z: cz + z, hw, hd });
  const B = (w, h, d, c, x, y, z) => lb(g, w, h, d, c, cx + x, y, cz + z);
  const C = (r, h, c, x, y, z, seg) => lc(g, r, r, h, c, cx + x, y, cz + z, seg || 12);
  const flat = (m) => { m.userData.flat = true; return m; };
  const plane = (tex, w, h, x, y, z, ry, basic) => flat((() => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), basic ? new THREE.MeshBasicMaterial({ map: tex, transparent: true }) : new THREE.MeshLambertMaterial({ map: tex })); m.position.set(cx + x, y, cz + z); m.rotation.y = ry || 0; g.add(m); return m; })());
  const plate = (t, w, h, bg, fg, x, y, z, ry) => { const p = textPlate(t, w, h, bg, fg); p.position.set(cx + x, y, cz + z); p.rotation.y = ry || 0; g.add(p); return p; };
  const loc = (x, z, ry) => { const c = Math.round(Math.cos(ry)), s = Math.round(Math.sin(ry)); return (w, h, d, col, lx, y, lz) => B(s ? d : w, h, s ? w : d, col, x + lx * c + lz * s, y, z - lx * s + lz * c); };
  const ball = (r, c, x, y, z) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), mat(c)); m.position.set(cx + x, y, cz + z); g.add(m); return m; };
  // ---- sàn + trần có xà thép ----
  g.children[0].material = new THREE.MeshLambertMaterial({ map: fireFloor(W, D) });
  { const ct = skin(W, D, 6, (x) => { x.fillStyle = "#e9e3d3"; x.fillRect(0, 0, W, D); x.fillStyle = "#cfc8b4"; for (let X = 0; X < W; X += 2) x.fillRect(X, 0, 0.04, D); });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshBasicMaterial({ map: ct, side: THREE.DoubleSide })); m.rotation.x = Math.PI / 2; m.position.set(cx, H - 0.02, cz); flat(m); g.add(m); }
  for (let z = -14; z <= 14; z += 4) { flat(B(W, 0.32, 0.3, 0x59626b, 0, H - 0.2, z)); flat(B(W, 0.1, 0.5, 0x59626b, 0, H - 0.38, z)); }
  for (let z = -12; z <= 12; z += 8) [-8, 0, 8].forEach(x => { flat(C(0.04, 1.2, 0x4b5057, x, H - 1.0, z, 5)); flat(lc(g, 0.15, 0.55, 0.35, mat(0xeef0f2), cx + x, H - 1.78, cz + z, 12)); });   // đèn thả
  // ---- hàm dùng chung ----
  const chair = (x, z, ry, c) => { const b = loc(x, z, ry); b(0.5, 0.07, 0.5, c || FR_.red, 0, 0.48, 0); b(0.5, 0.5, 0.07, c || FR_.red, 0, 0.8, -0.24); b(0.07, 0.46, 0.07, FR_.dk, 0, 0.23, 0); b(0.4, 0.04, 0.4, FR_.dk, 0, 0.04, 0); sol(x, z, 0.3, 0.3); };
  const ext = (x, y, z, s) => { C(0.09 * s, 0.45 * s, FR_.red, x, y, z, 10); C(0.04 * s, 0.1 * s, FR_.dk, x, y + 0.27 * s, z, 8); B(0.12 * s, 0.03, 0.03, FR_.dk, x + 0.05 * s, y + 0.33 * s, z); B(0.1 * s, 0.1 * s, 0.01, FR_.wh, x, y + 0.02, z + 0.09 * s); };
  const hang = (t, w, h, x, y, z, bg) => { B(w + 0.1, h + 0.1, 0.05, 0x59171a, x, y, z); plate(t, w, h, bg || "#c92a2a", "#ffffff", x, y, z + 0.03); [-1, 1].forEach(s => flat(B(0.04, H - y - h / 2, 0.04, 0x6b7780, x + s * (w / 2 - 0.3), (H + y + h / 2) / 2, z))); };
  const fhelmet = (x, y, z, c) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(c)); m.position.set(cx + x, y, cz + z); g.add(m); C(0.27, 0.03, c, x, y, z, 14); B(0.1, 0.12, 0.02, 0xf2c94c, x - 0.19, y + 0.1, z).rotation.y = Math.PI / 2; };
  plane(fireEmblem(2.0), 2.0, 2.0, 0, 5.4, BK + 0.03, 0, true);
  plane(fireEmblem(1.4), 1.4, 1.4, 0, 5.0, FRN - 0.03, Math.PI, true);

  // ==== GARAGE: xe cứu hoả đỏ lớn tại (-6.6, -7), mũi xe quay về cửa (+z), dài 10 m ====
  { const T = loc(-6.6, -7, 0), tx = -6.6, tz = -7;
    T(2.5, 0.45, 9.8, FR_.dk, 0, 0.78, 0);
    [[3.3], [-2.2], [-3.8]].forEach(([lz]) => [-1.3, 1.3].forEach(lx => { const w = C(0.55, 0.45, 0x16181b, tx + lx, 0.55, tz + lz, 16); w.rotation.z = Math.PI / 2; const h = C(0.26, 0.47, FR_.steel, tx + lx, 0.55, tz + lz, 10); h.rotation.z = Math.PI / 2; }));
    T(2.6, 1.9, 2.9, FR_.red, 0, 1.95, 3.4);   // cabin
    T(2.0, 0.85, 0.04, FR_.gl, 0, 2.38, 4.87); T(0.04, 0.8, 1.0, FR_.gl, -1.32, 2.4, 3.7); T(0.04, 0.8, 1.0, FR_.gl, 1.32, 2.4, 3.7);
    T(1.6, 0.55, 0.05, 0x6c757d, 0, 1.4, 4.87); T(0.38, 0.26, 0.06, 0xfff3b0, -1.0, 1.4, 4.88); T(0.38, 0.26, 0.06, 0xfff3b0, 1.0, 1.4, 4.88); T(2.7, 0.3, 0.45, 0xdde3ea, 0, 0.95, 4.95);
    T(2.7, 2.0, 6.2, FR_.red, 0, 2.05, -1.55);   // thân xe
    T(2.75, 0.12, 6.0, FR_.dred, 0, 3.07, -1.55);
    [-1, 1].forEach(s => { T(0.04, 0.2, 9.4, FR_.wh, s * 1.37, 1.35, 0); T(0.04, 0.08, 9.4, FR_.yel, s * 1.37, 1.15, 0); [-0.4, -2.3, -4.2].forEach(lz => { T(0.04, 1.3, 1.5, FR_.steel, s * 1.37, 2.1, lz); T(0.05, 0.05, 1.5, 0x8e98a3, s * 1.375, 2.1, lz); T(0.06, 0.08, 0.3, FR_.dk, s * 1.38, 2.1, lz + 0.5); }); });
    T(2.2, 0.1, 0.5, FR_.steel, 0, 0.72, -5.15); T(0.4, 0.2, 0.06, FR_.red, -1.0, 1.5, -4.92); T(0.4, 0.2, 0.06, 0xff922b, 1.0, 1.5, -4.92);
    flat(T(1.7, 0.16, 0.3, FR_.dk, 0, 3.0, 4.0)); flat(T(0.55, 0.15, 0.26, 0xe03131, -0.5, 3.15, 4.0)); flat(T(0.55, 0.15, 0.26, 0x1971c2, 0.5, 3.15, 4.0));
    [-1, 1].forEach(s => flat(T(0.07, 0.1, 6.0, 0xdde3ea, s * 0.45, 3.28, -1.55)));   // thang trên nóc
    for (let i = 0; i < 13; i++) flat(T(0.97, 0.05, 0.06, 0xdde3ea, 0, 3.28, -4.4 + i * 0.47));
    [-4, -1.5, 1.2].forEach(lz => [-0.45, 0.45].forEach(s => flat(T(0.1, 0.18, 0.1, FR_.dk, s, 3.18, lz))));
    flat(T(0.4, 0.4, 5.4, 0x2f5f9a, 0, 3.35 + 0.15, -1.9)); flat(T(0.4, 0.05, 5.4, 0x1971c2, 0, 3.7, -1.9)); // ống hút nước (xanh) dọc nóc
    plate("VERSE FIRE", 2.4, 0.38, "#c92a2a", "#ffffff", tx + 1.4, 2.6, tz - 2.3, Math.PI / 2); plate("VERSE FIRE", 2.4, 0.38, "#c92a2a", "#ffffff", tx - 1.4, 2.6, tz - 2.3, -Math.PI / 2);
    sol(tx, tz, 1.4, 5.0); }
  // cuộn vòi nước x 2 gắn tường trái
  const reel = (z) => { const d = C(0.5, 0.4, 0x7a1d1d, -11.4, 0.85, z, 20); d.rotation.z = Math.PI / 2; const r = C(0.42, 0.42, 0xe8590c, -11.4, 0.85, z, 20); r.rotation.z = Math.PI / 2;
    B(0.5, 0.1, 0.8, FR_.dk, -11.4, 0.05, z); B(0.1, 1.6, 0.1, FR_.dk, -11.4, 0.85, z - 0.45); B(0.1, 1.6, 0.1, FR_.dk, -11.4, 0.85, z + 0.45); const n = C(0.05, 0.3, FR_.yel, -10.9, 0.5, z + 0.3, 8); n.rotation.x = Math.PI / 2; sol(-11.4, z, 0.45, 0.6); };
  reel(-3.0); reel(0.4);
  // trụ nước
  C(0.17, 0.6, FR_.red, -3.4, 0.4, 1.0, 12); C(0.2, 0.1, FR_.dred, -3.4, 0.7, 1.0, 12); ball(0.17, FR_.red, -3.4, 0.76, 1.0); C(0.2, 0.08, FR_.dk, -3.4, 0.04, 1.0, 12);
  [-1, 1].forEach(s => { const n = C(0.06, 0.2, FR_.yel, -3.4 + s * 0.2, 0.5, 1.0, 8); n.rotation.z = Math.PI / 2; }); { const n = C(0.07, 0.18, FR_.yel, -3.4, 0.5, 1.2, 8); n.rotation.x = Math.PI / 2; } sol(-3.4, 1.0, 0.25, 0.25);
  // thang dựng sát tường trái
  [-9.8, -9.2].forEach(z => B(0.06, 4.6, 0.06, 0xdde3ea, -11.8, 2.4, z)); for (let i = 0; i < 12; i++) B(0.05, 0.05, 0.66, 0xdde3ea, -11.8, 0.45 + i * 0.38, -9.5);
  [0.8, 2.6, 4.2].forEach(y => B(0.16, 0.1, 0.8, FR_.dk, -11.88, y, -9.5)); sol(-11.8, -9.5, 0.14, 0.45);
  hang("TRUCK BAY", 2.4, 0.5, -6.6, 5.6, 4.6);

  // ==== GEAR: giá đồ bảo hộ dọc tường phải (x +9..+12, z −10..0) ====
  B(0.1, 2.4, 10.4, 0x8d6e50, 11.92, 1.2, -5); B(0.5, 0.05, 10.4, FR_.wood, 11.7, 2.05, -5); B(0.05, 0.1, 10.4, FR_.dk, 11.8, 1.85, -5); sol(11.7, -5, 0.3, 5.2);
  [-9.2, -7.8].forEach(z => { B(0.14, 1.0, 0.5, 0xe8a317, 11.62, 1.35, z); B(0.1, 0.6, 0.14, 0xe8a317, 11.62, 1.35, z - 0.33); B(0.1, 0.6, 0.14, 0xe8a317, 11.62, 1.35, z + 0.33); B(0.15, 0.09, 0.51, 0xe8e8e8, 11.62, 1.25, z); B(0.15, 0.09, 0.51, 0xe8e8e8, 11.62, 1.55, z); });   // áo bảo hộ
  fhelmet(11.5, 2.07, -6.4, 0xf2c94c); fhelmet(11.5, 2.07, -5.4, FR_.red); fhelmet(11.5, 2.07, -4.5, 0xf2f2f2);
  [-4.3, -3.7].forEach(z => { B(0.24, 0.45, 0.14, FR_.dk, 11.4, 0.23, z - 0.0); B(0.26, 0.07, 0.34, FR_.yel, 11.4, 0.04, z); B(0.2, 0.2, 0.14, FR_.dk, 11.4, 0.5, z + 0.22 * 0); });   // ủng
  [-2.7, -2.0].forEach(z => { C(0.12, 0.75, 0x8e98a3, 11.45, 0.45, z, 12); ball(0.12, 0x8e98a3, 11.45, 0.83, z); C(0.04, 0.08, FR_.yel, 11.45, 0.9, z, 8); B(0.1, 0.18, 0.04, 0x1971c2, 11.45, 0.35, z + 0.12); });   // bình dưỡng khí
  B(0.05, 0.4, 0.3, FR_.wh, 11.87, 1.45, -0.9); ext(11.7, 1.35, -0.9, 1.0); plate("EXTINGUISHER", 0.7, 0.18, "#c92a2a", "#ffffff", 11.9, 1.95, -0.9, -Math.PI / 2);
  plate("GEAR UP!", 1.6, 0.4, "#c92a2a", "#ffffff", 11.9, 2.9, -5.0, -Math.PI / 2).userData.flat = true;
  hang("GEAR", 1.4, 0.4, 8.6, 5.4, 0.0);

  // ==== ALARM: góc sau-phải x +3..+12, z −16..−11 ====
  B(3.0, 0.95, 0.9, FR_.wood, 7.5, 0.48, -15.1); B(3.2, 0.06, 1.0, FR_.dk, 7.5, 0.97, -15.1); B(2.6, 0.12, 0.55, 0x3b434b, 7.5, 1.05, -14.95); sol(7.5, -15.1, 1.6, 0.5);
  [[6.6, 0xe03131], [6.95, 0xf2c94c], [7.3, 0x2f9e44], [7.65, 0x1971c2], [8.0, 0xe03131]].forEach(([x, c]) => C(0.07, 0.06, c, x, 1.14, -14.85, 10));
  [6.6, 6.8, 7.0, 7.2, 7.4, 7.6, 7.8, 8.0].forEach((x, i) => B(0.1, 0.03, 0.1, i % 3 ? 0x69db7c : 0xff6b6b, x, 1.13, -15.15));
  B(0.28, 0.08, 0.2, FR_.red, 8.8, 1.04, -14.9); B(0.3, 0.05, 0.06, FR_.red, 8.8, 1.12, -14.9);   // điện thoại đỏ
  B(0.7, 0.45, 0.05, 0x111418, 6.2, 1.55, -15.35); plane(skin(0.62, 0.38, 100, (x, w, h) => { x.fillStyle = "#0b2a1c"; x.fillRect(0, 0, w, h); signText(x, "ALL CLEAR", w / 2, h / 2 - 0.03, w - 0.1, 0.11, "#69db7c"); signText(x, "Station 1", w / 2, h / 2 + 0.12, w - 0.1, 0.07, "#adb5bd"); }), 0.62, 0.38, 6.2, 1.55, -15.31, 0, true);
  B(0.12, 0.2, 0.12, FR_.dk, 6.2, 1.25, -15.3);
  plane(skin(3.0, 1.8, 50, (x, w, h) => { x.fillStyle = "#efe9d2"; x.fillRect(0, 0, w, h); x.fillStyle = "#b9dfa4"; x.fillRect(0.2, 0.5, 0.9, 0.6); x.fillStyle = "#7fc3e8"; x.fillRect(0, 1.3, w, 0.2); x.strokeStyle = "#fff"; x.lineWidth = 0.1; for (let X = 0.5; X < w; X += 0.7) { x.beginPath(); x.moveTo(X, 0.3); x.lineTo(X, h); x.stroke(); } for (let Y = 0.7; Y < h; Y += 0.5) { x.beginPath(); x.moveTo(0, Y); x.lineTo(w, Y); x.stroke(); }
    x.fillStyle = "#c92a2a"; x.fillRect(0, 0, w, 0.3); signText(x, "CITY MAP – FIRE ZONES", w / 2, 0.16, 2.6, 0.2, "#fff"); [[0.9, 0.9], [1.7, 0.8], [2.4, 1.1]].forEach(([X, Y]) => { x.fillStyle = "#e03131"; x.beginPath(); x.arc(X, Y, 0.1, 0, 7); x.fill(); x.fillStyle = "#fff"; x.beginPath(); x.arc(X, Y, 0.04, 0, 7); x.fill(); }); }), 3.0, 1.8, 7.5, 3.0, BK + 0.04, 0, true);
  B(3.2, 2.0, 0.05, 0x59171a, 7.5, 3.0, BK + 0.015).userData.flat = true;
  // chuông báo cháy lớn trên tường sau (x = 11)
  B(0.9, 0.7, 0.12, FR_.dred, 11, 3.0, BK + 0.07).userData.flat = true; [-0.26, 0.26].forEach(s => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xe6b422)); m.rotation.x = Math.PI / 2; m.position.set(cx + 11 + s, 3.0, cz + BK + 0.28); m.userData.flat = true; g.add(m); });
  { const st = flat(C(0.03, 0.3, FR_.dk, 11, 3.0, BK + 0.24, 6)); st.rotation.z = Math.PI / 2; }
  // nút kéo báo cháy trên tường phải
  B(0.1, 0.3, 0.22, FR_.red, RW - 0.06, 1.4, -12.6); B(0.11, 0.1, 0.12, FR_.wh, RW - 0.07, 1.45, -12.6); plate("PULL", 0.3, 0.12, "#ffffff", "#c92a2a", RW - 0.12, 1.6, -12.6, -Math.PI / 2);
  // cột trượt: từ trần xuống sàn, có thảm vàng + khung hố trên trần
  C(0.06, H, 0xdde3ea, 4.0, H / 2, -13.0, 10); C(0.7, 0.04, FR_.yel, 4.0, 0.02, -13.0, 20); C(0.55, 0.06, FR_.dk, 4.0, 0.05, -13.0, 20).scale.set(1, 0.6, 1);
  [[0, 0.7, 1.4, 0.1], [0, -0.7, 1.4, 0.1], [0.7, 0, 0.1, 1.4], [-0.7, 0, 0.1, 1.4]].forEach(([dx, dz, w, d]) => flat(B(w, 0.12, d, FR_.yel, 4.0 + dx, H - 0.1, -13.0 + dz))); sol(4.0, -13.0, 0.2, 0.2);
  hang("FIRE ALARM", 2.0, 0.45, 8.5, 5.4, -12.0);

  // ==== REST: khu nghỉ / bếp (x +4..+12, z +3..+11) ====
  { const b = loc(6.0, 4.0, 0); b(2.4, 0.45, 0.9, 0x5b6f8a, 0, 0.23, 0); b(2.4, 0.65, 0.2, 0x4a5d77, 0, 0.7, -0.35); b(0.2, 0.3, 0.8, 0x4a5d77, -1.1, 0.55, 0.05); b(0.2, 0.3, 0.8, 0x4a5d77, 1.1, 0.55, 0.05); b(0.6, 0.45, 0.2, 0xf2c94c, -0.5, 0.6, 0.1); b(0.6, 0.45, 0.2, 0xe8590c, 0.5, 0.6, 0.1); sol(6.0, 4.0, 1.25, 0.5); }
  B(0.9, 1.9, 0.9, 0xeef1f4, 11.55, 0.95, 3.9); B(0.04, 1.6, 0.02, 0xaab4be, 11.09, 0.95, 3.9); B(0.03, 0.5, 0.06, 0x6c757d, 11.08, 1.2, 3.55); B(0.03, 0.3, 0.06, 0x6c757d, 11.08, 0.55, 3.55); sol(11.55, 3.9, 0.45, 0.45);   // tủ lạnh
  B(0.7, 0.9, 3.4, 0xe9e2d0, 11.55, 0.45, 6.3); B(0.8, 0.06, 3.5, 0x4b5057, 11.55, 0.93, 6.3); sol(11.55, 6.3, 0.4, 1.75);
  C(0.1, 0.18, FR_.steel, 11.6, 1.05, 5.4, 12); B(0.05, 0.1, 0.12, FR_.dk, 11.6, 1.12, 5.22); C(0.06, 0.04, FR_.red, 11.6, 1.16, 5.4, 8);   // ấm nước
  B(0.4, 0.26, 0.34, 0x343a40, 11.55, 1.09, 7.0); B(0.26, 0.18, 0.02, 0x7fb4d6, 11.34, 1.09, 7.0); // lò vi sóng
  B(0.4, 0.04, 0.5, 0x7fc4d6, 11.5, 0.97, 6.2); C(0.14, 0.03, 0xeaeaea, 11.55, 0.97, 7.8, 12);
  plane(skin(0.7, 0.7, 80, (x, w, h) => { x.fillStyle = "#f6ecd6"; x.beginPath(); x.arc(0.35, 0.35, 0.34, 0, 7); x.fill(); x.strokeStyle = "#343a40"; x.lineWidth = 0.04; x.stroke(); x.fillStyle = "#343a40"; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; x.fillRect(0.35 + Math.sin(a) * 0.27 - 0.01, 0.35 - Math.cos(a) * 0.27 - 0.01, 0.02, 0.02); } x.fillRect(0.34, 0.12, 0.03, 0.23); x.fillRect(0.35, 0.34, 0.18, 0.03); }), 0.7, 0.7, RW - 0.04, 2.6, 6.3, -Math.PI / 2);   // đồng hồ
  B(2.4, 0.07, 1.0, FR_.wood, 8.0, 0.76, 10.6); [[-1.05, -0.4], [1.05, -0.4], [-1.05, 0.4], [1.05, 0.4]].forEach(([dx, dz]) => B(0.07, 0.72, 0.07, 0x6b4a2b, 8.0 + dx, 0.36, 10.6 + dz)); sol(8.0, 10.6, 1.2, 0.5);
  [7.2, 8.8].forEach(x => chair(x, 11.6, Math.PI));
  C(0.15, 0.06, 0xffffff, 8.7, 0.8, 10.6, 14); C(0.15, 0.06, 0xffffff, 8.0, 0.8, 10.35, 14); { const bw = lc(g, 0.12, 0.2, 0.12, mat(0xe8590c), cx + 7.2, 0.84, cz + 10.6, 12); ball(0.07, 0xe03131, 7.18, 0.94, 10.6); ball(0.07, 0xf2c94c, 7.26, 0.95, 10.65); }
  hang("REST AREA", 1.8, 0.45, 8.5, 5.4, 3.2);

  // ==== TRAINING: góc tập huấn (x −12..−6, z +6..+12) ====
  plane(skin(2.8, 2.0, 60, (x, w, h) => { x.fillStyle = "#fff3c4"; x.fillRect(0, 0, w, h); x.fillStyle = "#c92a2a"; x.fillRect(0, 0, w, 0.45); signText(x, "STOP, DROP AND ROLL", w / 2, 0.24, 2.6, 0.3, "#ffffff");
    [["STOP", 0.5, "#c92a2a"], ["DROP", 1.4, "#e8590c"], ["ROLL", 2.3, "#2f9e44"]].forEach(([t, X, c]) => { x.fillStyle = c; x.beginPath(); x.arc(X, 1.05, 0.38, 0, 7); x.fill(); signText(x, t, X, 1.05, 0.62, 0.2, "#fff");
      x.fillStyle = "#ffcc99"; x.beginPath(); x.arc(X, 1.65, 0.12, 0, 7); x.fill(); x.fillStyle = "#1971c2"; if (t === "ROLL") x.fillRect(X - 0.35, 1.72, 0.7, 0.14); else x.fillRect(X - 0.1, 1.75, 0.2, 0.22); }); }), 2.8, 2.0, LW + 0.04, 2.3, 9.0, Math.PI / 2);
  plane(skin(2.0, 2.0, 60, (x, w, h) => { x.fillStyle = "#e7f5ff"; x.fillRect(0, 0, w, h); x.fillStyle = "#1971c2"; x.fillRect(0, 0, w, 0.45); signText(x, "FIRE SAFETY", w / 2, 0.24, 1.8, 0.28, "#fff");
    [["1  Smoke alarm: check it!", "#c92a2a"], ["2  Never play with matches", "#e8590c"], ["3  Crawl low under smoke", "#2f9e44"], ["4  Call for help: 114", "#1971c2"]].forEach(([t, c], i) => { x.fillStyle = c; x.fillRect(0.12, 0.65 + i * 0.32, 0.12, 0.12); signText(x, t, 1.1, 0.71 + i * 0.32, 1.6, 0.13, "#343a40"); }); }), 2.0, 2.0, LW + 0.04, 2.3, 11.6, Math.PI / 2);
  B(0.7, 0.75, 0.7, FR_.wood, -11.2, 0.38, 6.6); sol(-11.2, 6.6, 0.4, 0.4);
  ext(-11.3, 0.97, 6.45, 1.0); B(0.22, 0.05, 0.22, 0xffffff, -11.0, 0.78, 6.85); C(0.09, 0.04, 0xf2f2f2, -11.0, 0.82, 6.85, 14); B(0.1, 0.01, 0.1, FR_.red, -11.0, 0.845, 6.85);   // bình mẫu + chuông khói
  [7.6, 8.6, 9.6, 10.6].forEach((z, i) => chair(-8.2, z, -Math.PI / 2, [FR_.red, 0x1971c2, 0xf2c94c, 0x2f9e44][i]));
  hang("TRAINING", 1.8, 0.45, -9, 5.4, 12.6, "#1971c2");
  [[-11.2, 14.5], [11.2, 14.5]].forEach(([x, z]) => { pot(g, cx + x, cz + z, 1.4); sol(x, z, 0.4, 0.4); });

  // ==== chỗ bày từ vựng: [x, y, z, đứngX, đứngZ] (toạ độ tuyệt đối) ====
  const A = (list) => list.map(([x, y, z, sx, sz]) => [cx + x, y, cz + z, cx + sx, cz + sz]);
  P.anchors = {
    garage: A([[-6.6, 3.7, -3.5, -3.9, -3.5], [-6.6, 3.55, -8.0, -3.9, -8.0], [-5.3, 0.9, -10.6, -3.9, -10.6], [-11.4, 1.5, -3.0, -9.5, -3.0], [-11.4, 1.5, 0.4, -9.5, 0.4], [-3.4, 1.1, 1.0, -2.2, 1.0], [-11.8, 2.3, -9.5, -9.8, -9.5], [-6.6, 1.2, -1.8, -6.6, -0.5]]),
    gear: A([[11.62, 1.9, -9.2, 10.3, -9.2], [11.62, 1.9, -7.8, 10.3, -7.8], [11.5, 2.4, -6.4, 10.3, -6.4], [11.5, 2.4, -4.5, 10.3, -4.5], [11.4, 0.8, -4.0, 10.3, -4.0], [11.45, 1.3, -2.4, 10.3, -2.4], [11.7, 1.9, -0.9, 10.3, -0.9]]),
    alarm: A([[11, 3.6, -15.7, 11, -13.4], [6.6, 1.5, -14.85, 6.6, -13.4], [8.8, 1.4, -14.9, 8.8, -13.4], [7.5, 3.9, -15.9, 7.5, -13.4], [4.0, 1.5, -13.0, 5.2, -13.0], [11.92, 1.8, -12.6, 10.6, -12.6]]),
    rest: A([[6.0, 1.1, 4.0, 6.0, 5.5], [11.55, 2.2, 3.9, 10.2, 3.9], [11.6, 1.5, 5.4, 10.2, 5.4], [11.55, 1.5, 7.0, 10.2, 7.0], [11.9, 3.2, 6.3, 10.2, 6.3], [8.7, 1.15, 10.6, 10.5, 10.6], [7.2, 1.2, 10.6, 5.6, 10.6]]),
    training: A([[LW + 0.4, 2.6, 9.0, -10.5, 9.0], [LW + 0.4, 2.6, 11.6, -10.5, 11.6], [-11.3, 1.5, 6.45, -9.6, 6.45], [-8.2, 0.95, 8.6, -9.8, 8.6], [-11.0, 1.1, 6.85, -9.6, 7.3]])
  };
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["firehall"] = {
  furnish: furnishFire,
  wall: (len, h, w) => fireWall(len, h, w.x === 0 ? (w.z < 0 ? "back" : "front") : (w.x < 0 ? "left" : "right"))
};

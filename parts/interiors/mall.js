/* EnglishVerse – nội thất "mall" (layout: "mallhall"). Mỗi nơi 1 file (xem docs/TEAM.md).
   Dùng các hàm chung của index.html (lb, lc, mat, skin, textPlate, signText, pot…).
   VERSE PLAZA – trung tâm thương mại hiện đại kiểu Gigamall / Vincom (36 × 44 m, trần 12 m; tên cửa hàng tự đặt, KHÔNG dùng thương hiệu thật):
   sàn đá bóng sáng có hoa văn + sàn màu từng cửa hàng, giếng trời kính ở giữa (trần có lỗ, nhìn thấy trời), tầng lửng có lan can kính chạy quanh
   tường trái / phải / sau (chỉ trang trí, không đi lên được), thang cuốn trang trí ở sau, cột trắng quanh giếng trời, cây xanh trong chậu lớn,
   đài phun nước + vườn hoa giữa sảnh, quầy thông tin gần cửa, bản đồ trung tâm.
   Toạ độ (x, z) tính từ giữa phòng, cửa ở z = +22, tường sau z = −22.
   Khu:  atrium – sảnh giữa (quầy thông tin, đài phun nước, thang cuốn, ghế dài, bản đồ, cây)
         toys – TOY ISLAND (trái, x −18..−9, z −6..8; mặt tiền kính, cửa rộng 5 m)
         electronics – TECH ZONE (phải, x 9..18, z −6..8)
         sports – SPORT STAR (sau trái, x −18..−6, z −22..−10)
         foodcourt – FOOD COURT (sau phải, x 4..18, z −22..−10; 3 quầy ăn + bàn ghế)
         ceiling – 2 biển treo trần ở sảnh (chỗ đứng hỏi ở sàn bên dưới)
   Chừa trống: lối vào x −1.5..1.5, z 12..22; hành lang giữa tới tường sau; điểm đứng NPC: (−6,14) (6,16) (−12,1) (12,1) (−11,−15) (10,−15). */
const ML = { pink: 0xff6b9d, yellow: 0xffd43b, blue: 0x4dabf7, green: 0x51cf66, orange: 0xff922b, purple: 0x9775fa, teal: 0x20c997, white: 0xffffff, red: 0xfa5252 };
const MLW = {}, MLT = {};
function mallWall(len, h, kind) {   // tường: chân tường kem (tô màu theo cửa hàng), tầng lửng giả có biển cửa hàng, kính trời phía trên; tường trước có cổng kính
  const k = len + kind; if (MLW[k]) return MLW[k];
  const t = skin(len, h, 13, (x, w, hh) => {
    const Y = (m) => hh - m;   // m = độ cao so với sàn
    x.fillStyle = "#faf6ee"; x.fillRect(0, 0, w, hh);
    x.fillStyle = "#f4ecdc"; x.fillRect(0, Y(5.0), w, 5.0);   // thân tường tầng trệt
    x.fillStyle = "#d9cdb4"; x.fillRect(0, Y(0.9), w, 0.9); x.fillStyle = "#b9a98a"; x.fillRect(0, Y(0.15), w, 0.15);
    const tint = (u0, u1, c) => { x.fillStyle = c; x.fillRect(u0, Y(5.0), u1 - u0, 5.0); x.fillStyle = "rgba(255,255,255,0.35)"; x.fillRect(u0, Y(0.9), u1 - u0, 0.9); };
    const u = kind === "left" ? (z) => w / 2 - z : kind === "right" ? (z) => w / 2 + z : (xx) => w / 2 + xx;
    const rng = (a, b) => kind === "left" ? [u(b), u(a)] : [u(a), u(b)];
    if (kind === "left") { tint(...rng(-6, 8), "#ffd6e5"); tint(...rng(-22, -10), "#d3f0da"); }
    if (kind === "right") { tint(...rng(-6, 8), "#d6e4ff"); tint(...rng(-22, -10), "#ffe3cc"); }
    if (kind === "back") { tint(...rng(-18, -6), "#d3f0da"); tint(...rng(4, 18), "#ffe3cc"); }
    for (let X = 3; X < w - 1; X += 6) { x.fillStyle = "#fffdf6"; x.fillRect(X - 0.25, Y(5.0), 0.5, 5.0); x.fillStyle = "#e5c35a"; x.fillRect(X - 0.3, Y(5.0), 0.6, 0.16); x.fillRect(X - 0.3, Y(0.9), 0.6, 0.1); }   // cột ốp
    x.fillStyle = "#ffffff"; x.fillRect(0, Y(5.5), w, 0.5); x.fillStyle = "#20c997"; x.fillRect(0, Y(5.5), w, 0.07);   // mép sàn lửng
    // tầng lửng giả: cửa hàng tầng 2
    const names = { left: ["BOOK WORLD", "KIDS CLUB", "CINEMA 8", "STYLE HUB", "CAFE LUNA", "GAME ZONE"], right: ["FASHION", "BEAUTY", "PET CLUB", "MUSIC BOX", "HOME & GIFT", "SMART KIDS"], back: ["SPA", "CINEMA 8", "LEARN LAB", "BOOK NOOK", "FUN PARK"] };
    const cols = ["#ff6b9d", "#4dabf7", "#ffa94d", "#9775fa", "#38d9a9", "#ffd43b"];
    if (kind !== "front") { const nm = names[kind], n = nm.length, sw = w / n;
      for (let i = 0; i < n; i++) { const X = i * sw;
        x.fillStyle = "#ffe9a8"; x.fillRect(X + 0.5, Y(8.3), sw - 1, 2.3); x.fillStyle = "#cfeaf7"; x.fillRect(X + sw * 0.55, Y(8.3), sw * 0.4 - 0.5, 2.3);
        x.fillStyle = "#d9a441"; x.fillRect(X + 0.9, Y(7.1), 0.12, 1.1); x.fillRect(X + 1.3, Y(7.5), 0.12, 1.5); x.fillRect(X + 1.7, Y(6.9), 0.12, 0.9);
        x.fillStyle = cols[i % cols.length]; x.fillRect(X + 0.35, Y(8.9), sw - 0.7, 0.8); signText(x, nm[i], X + sw / 2, Y(8.5), sw - 1.2, 0.55, "#ffffff");
        x.fillStyle = "#ffffff"; x.fillRect(X + 0.3, Y(8.3), 0.1, 2.8); } }
    // kính trời phía trên (tầng cao)
    const g = x.createLinearGradient(0, 0, 0, Y(9.2)); g.addColorStop(0, "#8fcff5"); g.addColorStop(1, "#dff2fd"); x.fillStyle = g; x.fillRect(0, 0, w, Y(9.2));
    x.fillStyle = "rgba(255,255,255,0.4)"; for (let X = 2; X < w; X += 5) { x.beginPath(); x.moveTo(X, 0); x.lineTo(X + 1.3, 0); x.lineTo(X - 1.2, Y(9.2)); x.lineTo(X - 2.5, Y(9.2)); x.fill(); }   // vệt nắng
    x.fillStyle = "#ffffff"; for (let X = 0; X < w; X += 2.4) x.fillRect(X, 0, 0.1, Y(9.2)); x.fillRect(0, 1.5, w, 0.1); x.fillRect(0, Y(9.2) - 0.1, w, 0.3); x.fillRect(0, 0, w, 0.18);
    if (kind === "front") {   // cổng kính lớn + bảng tên
      const cw = 8, X0 = w / 2 - cw / 2;
      x.fillStyle = "#ffffff"; x.fillRect(X0 - 0.3, Y(4.6), cw + 0.6, 4.6); x.fillStyle = "#bfe6f7"; x.fillRect(X0, Y(4.3), cw, 4.3);
      x.fillStyle = "rgba(255,255,255,0.45)"; x.beginPath(); x.moveTo(X0 + 0.6, Y(4.3)); x.lineTo(X0 + 1.8, Y(4.3)); x.lineTo(X0 + 0.2, Y(0)); x.lineTo(X0 - 0.4, Y(0)); x.fill();
      x.fillStyle = "#8fa4b0"; for (let i = 0; i <= 4; i++) x.fillRect(X0 + i * cw / 4 - 0.05, Y(4.3), 0.1, 4.3); x.fillRect(X0, Y(2.3), cw, 0.08);
      x.fillStyle = "#20c997"; x.fillRect(X0 - 0.3, Y(5.5), cw + 0.6, 0.9); signText(x, "WELCOME TO VERSE PLAZA", w / 2, Y(5.05), cw - 0.6, 0.62, "#ffffff");
      [[2, 7.5], [w - 9.5, 7.5]].forEach(([X, ww]) => { x.fillStyle = "#cfeaf7"; x.fillRect(X, Y(3.8), ww, 2.6); x.fillStyle = "#ffffff"; x.fillRect(X + ww / 2 - 0.05, Y(3.8), 0.1, 2.6); x.fillRect(X, Y(3.8), ww, 0.1); });   // cửa kính hai bên
    }
  });
  return MLW[k] = new THREE.MeshLambertMaterial({ map: t });
}
function mallFloor(W, D) {   // sàn đá bóng: ô 2 m, hoa văn la bàn giữa sảnh, lối vàng từ cửa, sàn màu từng cửa hàng
  return skin(W, D, 16, (x, w, h) => {
    const cX = w / 2, cY = h / 2;
    x.fillStyle = "#efe8d8"; x.fillRect(0, 0, w, h);
    for (let i = 0; i < w / 2; i++) for (let j = 0; j < h / 2; j++) { x.fillStyle = (i + j) % 2 ? "#f7f2e6" : "#ece4d2"; x.fillRect(i * 2, j * 2, 2, 2); }
    const zone = (x0, x1, z0, z1, c1, c2, s) => { for (let X = x0; X < x1 - 0.01; X += s) for (let Z = z0; Z < z1 - 0.01; Z += s) { x.fillStyle = ((Math.round((X - x0) / s) + Math.round((Z - z0) / s)) % 2) ? c1 : c2; x.fillRect(cX + X, cY + Z, Math.min(s, x1 - X), Math.min(s, z1 - Z)); } };
    zone(-18, -9, -6, 8, "#ffc9dd", "#fff0a8", 1); zone(9, 18, -6, 8, "#b7c8ee", "#9fb4e3", 1);
    zone(-18, -6, -22, -10, "#9fdcae", "#86cf9a", 1.2); zone(4, 18, -22, -10, "#f6c7a1", "#eeb184", 1.2);
    x.fillStyle = "#e5c35a"; [[-9, -6, 0.12, 14], [9, -6, 0.12, 14], [-18, -10, 12, 0.12], [4, -10, 14, 0.12], [-6, -22, 0.12, 12]].forEach(([X, Z, a, b]) => x.fillRect(cX + X - 0.06, cY + Z - 0.06, a, b));   // ngưỡng cửa hàng
    x.fillStyle = "#fff4cf"; x.fillRect(cX - 2, cY + 6, 4, 16); x.fillStyle = "#e5c35a"; x.fillRect(cX - 2.08, cY + 6, 0.08, 16); x.fillRect(cX + 2, cY + 6, 0.08, 16);   // lối từ cửa tới đài phun
    const ring = (r, c) => { x.fillStyle = c; x.beginPath(); x.arc(cX, cY + 2, r, 0, Math.PI * 2); x.fill(); };
    ring(6.2, "#e5c35a"); ring(6.0, "#cfe8f5"); ring(5.2, "#ffffff"); ring(5.0, "#9fd3ee");
    x.fillStyle = "#ffffff"; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, r = i % 2 ? 4.4 : 6.0; x.beginPath(); x.moveTo(cX + Math.cos(a - 0.18) * 3.4, cY + 2 + Math.sin(a - 0.18) * 3.4); x.lineTo(cX + Math.cos(a) * r, cY + 2 + Math.sin(a) * r); x.lineTo(cX + Math.cos(a + 0.18) * 3.4, cY + 2 + Math.sin(a + 0.18) * 3.4); x.fill(); }
    x.strokeStyle = "#20c997"; x.lineWidth = 0.25; x.strokeRect(1.2, 1.2, w - 2.4, h - 2.4);   // viền chạy quanh sảnh
  });
}
function mallTex(key, w, h, ppm, draw) { return MLT[key] || (MLT[key] = new THREE.MeshLambertMaterial({ map: skin(w, h, ppm, draw), transparent: true })); }
function mallShelfTex(kind) {   // kệ vẽ sẵn: đồ chơi / giày (dùng chung 1 chất liệu)
  return mallTex("shelf" + kind, 2.6, 2.4, 44, (x, w, h) => {
    x.fillStyle = kind === "toy" ? "#fff0f5" : "#f1f8f3"; x.fillRect(0, 0, w, h);
    const cl = ["#ff6b9d", "#4dabf7", "#ffd43b", "#51cf66", "#ff922b", "#9775fa", "#fa5252", "#20c997"];
    for (let r = 0; r < 4; r++) { const y0 = 0.1 + r * 0.58;
      for (let i = 0; i < 7; i++) { const X = 0.1 + i * 0.36, c = cl[(i * 3 + r * 2) % 8];
        if (kind === "toy") {
          if ((i + r) % 3 === 0) { x.fillStyle = "#b8793c"; x.beginPath(); x.arc(X + 0.15, y0 + 0.28, 0.17, 0, 7); x.fill(); x.beginPath(); x.arc(X + 0.04, y0 + 0.12, 0.06, 0, 7); x.arc(X + 0.26, y0 + 0.12, 0.06, 0, 7); x.fill(); x.fillStyle = "#e7c49a"; x.beginPath(); x.arc(X + 0.15, y0 + 0.33, 0.08, 0, 7); x.fill(); }
          else if ((i + r) % 3 === 1) { x.fillStyle = c; x.fillRect(X, y0 + 0.1, 0.3, 0.3); x.fillStyle = "#ffffff"; x.fillRect(X + 0.05, y0 + 0.16, 0.2, 0.08); }
          else { x.fillStyle = c; x.beginPath(); x.arc(X + 0.15, y0 + 0.3, 0.14, 0, 7); x.fill(); x.fillStyle = "#ffffff"; x.fillRect(X + 0.1, y0 + 0.27, 0.1, 0.05); }
        } else { x.fillStyle = c; x.fillRect(X, y0 + 0.22, 0.32, 0.16); x.fillRect(X + 0.18, y0 + 0.1, 0.14, 0.14); x.fillStyle = "#ffffff"; x.fillRect(X, y0 + 0.36, 0.32, 0.05); x.fillStyle = "#212529"; x.fillRect(X + 0.04, y0 + 0.26, 0.1, 0.03); }
      }
      x.fillStyle = "#c9a37a"; x.fillRect(0, y0 + 0.46, w, 0.06); }
  });
}
function furnishMall(P, g, cx, cz, W, D, fur) {
  const H = (P.size || {}).h || 12, S = P.room.solids;
  const sol = (x, z, hw, hd) => S.push({ x: cx + x, z: cz + z, hw, hd });
  const B = (w, h, d, c, x, y, z, ry) => { const m = lb(g, w, h, d, c, cx + x, y, cz + z); if (ry) m.rotation.y = ry; return m; };
  const C = (r, h, c, x, y, z, seg) => lc(g, r, r, h, c, cx + x, y, cz + z, seg || 12);
  const SG = {}, Sp = (r, c, x, y, z, sy) => { const m = new THREE.Mesh(SG[r] || (SG[r] = new THREE.SphereGeometry(r, 10, 8)), mat(c)); m.position.set(cx + x, y, cz + z); if (sy) m.scale.y = sy; g.add(m); return m; };
  const flat = (m) => { m.userData.flat = true; return m; };
  const plane = (tex, w, h, x, y, z, ry, basic) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), basic ? new THREE.MeshBasicMaterial({ map: tex }) : (tex.isMaterial ? tex : new THREE.MeshLambertMaterial({ map: tex }))); m.position.set(cx + x, y, cz + z); m.rotation.y = ry || 0; m.userData.flat = true; g.add(m); return m; };
  const sign = (text, w, h, bg, fg, x, y, z, ry) => { const p = textPlate(text, w, h, bg, fg); p.position.set(cx + x, y, cz + z); p.rotation.y = ry || 0; g.add(p); return p; };
  const GLASS = mat(0xbfe6ff, { transparent: true, opacity: 0.3, depthWrite: false });
  const pane = (w, h, d, x, y, z) => { const m = lb(g, w, h, d, GLASS, cx + x, y, cz + z); m.userData.flat = true; return m; };
  // ---- bỏ cửa gỗ mặc định (cổng kính đã vẽ trên tường trước) ----
  g.children.slice().forEach(m => { const p = m.geometry && m.geometry.parameters; if (p && p.width === 1.8 && p.height === 2.6) g.remove(m); });
  // ---- sàn + trần có lỗ giếng trời ----
  g.children[0].material = new THREE.MeshLambertMaterial({ map: mallFloor(W, D) });
  const ceilM = new THREE.MeshBasicMaterial({ color: 0xf4f7fb, side: THREE.DoubleSide });
  [[-18, 18, -22, -9], [-18, 18, 9, 22], [-18, -6, -9, 9], [6, 18, -9, 9]].forEach(([x0, x1, z0, z1]) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), ceilM); m.rotation.x = Math.PI / 2; m.position.set(cx + (x0 + x1) / 2, H - 0.02, cz + (z0 + z1) / 2); m.userData.flat = true; g.add(m); });
  const lamp = new THREE.MeshBasicMaterial({ color: 0xffffff }), lampG = new THREE.BoxGeometry(2, 0.05, 0.6);
  for (let x = -15; x <= 15; x += 6) for (let z = -19; z <= 19; z += 5.5) if (!(Math.abs(x) < 8 && Math.abs(z) < 10)) { const m = new THREE.Mesh(lampG, lamp); m.position.set(cx + x, H - 0.06, cz + z); m.userData.flat = true; g.add(m); }
  // giếng trời: khung thép + kính mờ
  for (let x = -6; x <= 6; x += 3) flat(B(0.14, 0.2, 18, 0xffffff, x, H - 0.1, 0));
  for (let z = -9; z <= 9; z += 3) flat(B(12, 0.2, 0.14, 0xffffff, 0, H - 0.1, z));
  flat(pane(12, 0.04, 18, 0, H - 0.05, 0));
  // ---- tầng lửng giả: sàn nhô + lan can kính (trái / phải / sau) ----
  const stripe = [ML.pink, ML.yellow, ML.blue, ML.green, ML.orange, ML.purple];
  const mezz = (x, z, w, d, alongZ, len, inX, inZ) => {   // sàn nhô: tâm (x,z) rộng w × sâu d; lan can nằm ở mép trong
    flat(B(w, 0.5, d, 0xffffff, x, 5.25, z));
    const ex = alongZ ? inX : x, ez = alongZ ? z : inZ;
    flat(pane(alongZ ? 0.05 : len, 1.05, alongZ ? len : 0.05, ex, 6.03, ez));
    flat(B(alongZ ? 0.1 : len, 0.07, alongZ ? len : 0.1, 0x868e96, ex, 6.58, ez));
    for (let i = 0, n = Math.round(len / 2.5); i <= n; i++) { const t = -len / 2 + i * len / n; flat(B(0.07, 1.1, 0.07, 0x868e96, alongZ ? ex : x + t, 6.05, alongZ ? z + t : ez)); }
    for (let i = 0, n = Math.round(len / 3); i < n; i++) { const t = -len / 2 + (i + 0.5) * len / n, c = stripe[i % 6]; flat(B(alongZ ? 0.06 : len / n - 0.1, 0.22, alongZ ? len / n - 0.1 : 0.06, c, alongZ ? ex : x + t, 5.12, alongZ ? z + t : ez)); }   // dải màu mép sàn
  };
  mezz(-16.6, -1.5, 2.8, 41, true, 41, -15.2, 0); mezz(16.6, -1.5, 2.8, 41, true, 41, 15.2, 0); mezz(0, -20.6, 30.4, 2.8, false, 30.4, 0, -19.2);
  // ---- cột trắng quanh giếng trời ----
  [[-7.4, -10], [7.4, -10], [-7.4, 0], [7.4, 0], [-7.4, 10], [7.4, 10]].forEach(([x, z]) => { C(0.45, H, 0xffffff, x, H / 2, z, 14); C(0.5, 0.12, 0x20c997, x, 1.0, z, 14); C(0.5, 0.12, 0x20c997, x, 4.4, z, 14); C(0.58, 0.25, 0xe5c35a, x, 0.12, z, 14); sol(x, z, 0.5, 0.5); });
  // ---- cây trong chậu lớn ----
  const tree = (x, z, s) => { C(0.62 * s, 0.7 * s, 0xffffff, x, 0.35 * s, z, 14); C(0.64 * s, 0.1 * s, 0x20c997, x, 0.7 * s, z, 14); C(0.5 * s, 0.05, 0x5c3d2e, x, 0.72 * s, z, 12); C(0.07 * s, 1.6 * s, 0x7a4b25, x, 1.4 * s, z, 6);
    [[0, 2.35, 0, 0.9, 0x37b24d], [0.5, 1.95, 0.2, 0.62, 0x40c057], [-0.45, 2.0, -0.2, 0.65, 0x51cf66], [0.1, 1.9, -0.5, 0.55, 0x40c057]].forEach(([dx, y, dz, r, c]) => Sp(r * s, c, x + dx * s, y * s, z + dz * s)); sol(x, z, 0.6 * s, 0.6 * s); };
  [[-16.6, 20.4, 1.1], [16.6, 20.4, 1.1], [-9, 20.4, 1], [9, 20.4, 1], [-9.8, 11.4, 1], [9.8, 11.4, 1], [-17, -8, 1], [17, -8, 1], [-4.6, -5.5, 1.2], [4.6, -5.5, 1.2], [-9.6, 15.5, 1], [17, 11, 1], [-17, 11, 1]].forEach(([x, z, s]) => tree(x, z, s));
  // ---- ghế dài ----
  const bench = (x, z, alongZ, len, c) => { const w = alongZ ? 0.5 : len, d = alongZ ? len : 0.5; B(w, 0.1, d, 0xd9a566, x, 0.45, z); B(alongZ ? 0.08 : len, 0.4, alongZ ? len : 0.08, 0xd9a566, alongZ ? x + (x > 0 ? 0.25 : -0.25) : x, 0.75, alongZ ? z : z - 0.25);
    [-1, 1].forEach(s => B(alongZ ? 0.5 : 0.08, 0.45, alongZ ? 0.08 : 0.5, c, alongZ ? x : x + s * (len / 2 - 0.2), 0.225, alongZ ? z + s * (len / 2 - 0.2) : z)); sol(x, z, w / 2, d / 2); };
  bench(-4.9, 2, true, 2.4, ML.teal); bench(4.9, 2, true, 2.4, ML.teal); bench(-12, 10.4, false, 2.4, ML.blue); bench(12, 10.4, false, 2.4, ML.blue);

  // ==== ATRIUM: đài phun nước + vườn hoa giữa sảnh (tâm (0,2), bán kính 3) ====
  C(3.0, 0.5, 0xf4efe3, 0, 0.25, 2, 28); C(2.75, 0.06, 0x3a9e5c, 0, 0.52, 2, 28);
  for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; Sp(0.2, [0xff6b9d, 0xffd43b, 0xffffff, 0xff922b, 0x9775fa][i % 5], Math.cos(a) * 2.35, 0.7, 2 + Math.sin(a) * 2.35, 0.8); Sp(0.17, [0xffd43b, 0xff6b9d, 0xffffff][i % 3], Math.cos(a + 0.17) * 1.95, 0.68, 2 + Math.sin(a + 0.17) * 1.95, 0.8); }
  C(1.55, 0.4, 0xf4efe3, 0, 0.7, 2, 24); C(1.4, 0.06, 0x63c5ea, 0, 0.92, 2, 24); C(0.28, 1.2, 0xf4efe3, 0, 1.5, 2, 12); C(0.9, 0.2, 0xf4efe3, 0, 1.95, 2, 18); C(0.8, 0.05, 0x63c5ea, 0, 2.06, 2, 18); C(0.12, 0.7, 0xf4efe3, 0, 2.3, 2, 8);
  { const jet = lc(g, 0.02, 0.12, 1.0, mat(0xbfe9ff, { transparent: true, opacity: 0.6 }), cx, 3.0, cz + 2, 8); jet.userData.flat = true; }
  Sp(0.2, 0xffd43b, 0, 2.85, 2);
  sol(0, 2, 3.0, 1.3); sol(0, 2, 1.3, 3.0); sol(0, 2, 2.2, 2.2);
  // ---- quầy thông tin: tâm (−6, 15.5), mặt quầy hướng cửa (+z); nhân viên đứng sau tại (−6, 14) ----
  B(4.6, 1.05, 0.8, 0xffffff, -6, 0.525, 15.5); B(4.9, 0.08, 1.05, 0x4dabf7, -6, 1.09, 15.5); B(4.62, 0.72, 0.04, 0x20c997, -6, 0.5, 15.92); B(4.62, 0.1, 0.05, 0xffd43b, -6, 0.9, 15.93); sol(-6, 15.5, 2.45, 0.5);
  sign("INFORMATION", 2.6, 0.34, "#0b7285", "#ffffff", -6, 0.52, 15.955);
  [-7.3, -4.7].forEach(x => { B(0.5, 0.32, 0.04, 0x1b1f23, x, 1.4, 15.3); B(0.44, 0.26, 0.02, 0x3b8fd6, x, 1.4, 15.275); B(0.08, 0.16, 0.08, 0x333a40, x, 1.26, 15.3); });
  B(0.45, 0.03, 0.3, 0xff6b9d, -5.9, 1.14, 15.7); B(0.45, 0.03, 0.3, 0xffd43b, -5.95, 1.17, 15.7); C(0.1, 0.03, 0xc9a227, -4.3, 1.14, 15.7); Sp(0.06, 0xc9a227, -4.3, 1.2, 15.7);   // tờ rơi + chuông
  B(0.5, 2.4, 0.5, 0x20c997, -8.9, 1.2, 15.5); sol(-8.9, 15.5, 0.28, 0.28); { const t = textPlate("i", 0.42, 0.42, "#ffffff", "#0b7285"); t.position.set(cx - 8.9, 1.9, cz + 15.755); g.add(t); }   // cột "i"
  // ---- bản đồ trung tâm (mall directory) ----
  B(0.08, 2.2, 0.08, 0x495057, 2.8, 1.1, 11.4); B(0.08, 2.2, 0.08, 0x495057, 4.4, 1.1, 11.4); B(1.9, 2.0, 0.1, 0x1c7ed6, 3.6, 1.4, 11.4); sol(3.6, 11.4, 1.0, 0.2);
  plane(mallTex("dir", 1.7, 1.8, 60, (x, w, h) => { x.fillStyle = "#e7f5ff"; x.fillRect(0, 0, w, h); signText(x, "MALL DIRECTORY", w / 2, 0.2, w - 0.2, 0.22, "#1864ab");
    x.fillStyle = "#ffffff"; x.fillRect(0.1, 0.4, w - 0.2, h - 0.5);
    [[0.15, 0.55, 0.45, 0.45, "#ffc9dd", "TOYS"], [1.1, 0.55, 0.45, 0.45, "#b7c8ee", "TECH"], [0.15, 1.4, 0.55, 0.3, "#9fdcae", "SPORT"], [0.95, 1.4, 0.6, 0.3, "#f6c7a1", "FOOD"]].forEach(([X, Y, ww, hh, c, t]) => { x.fillStyle = c; x.fillRect(X, Y, ww, hh); signText(x, t, X + ww / 2, Y + hh / 2, ww - 0.06, 0.12, "#343a40"); });
    x.fillStyle = "#9fd3ee"; x.beginPath(); x.arc(w / 2, 1.1, 0.22, 0, 7); x.fill(); x.fillStyle = "#e03131"; x.beginPath(); x.arc(w / 2, 1.6, 0.06, 0, 7); x.fill(); signText(x, "YOU ARE HERE", w / 2, 1.75, 0.9, 0.09, "#e03131"); }), 1.7, 1.8, 3.6, 1.4, 11.465, 0);
  // ---- thang cuốn trang trí (2 chiếc cạnh nhau ở sau, x −4.4 / −2.9, từ z −12.3 lên tầng lửng z −19.2) ----
  const escTex = mallTex("esc", 1.0, 8.4, 24, (x, w, h) => { x.fillStyle = "#9aa4ad"; x.fillRect(0, 0, w, h); for (let Y = 0; Y < h; Y += 0.32) { x.fillStyle = "#c5ccd2"; x.fillRect(0.04, Y, w - 0.08, 0.2); x.fillStyle = "#6c757d"; x.fillRect(0.04, Y + 0.2, w - 0.08, 0.08); } x.fillStyle = "#ffd43b"; x.fillRect(0, 0, 0.05, h); x.fillRect(w - 0.05, 0, 0.05, h); });
  const escLen = Math.hypot(5.0, 6.8), escAng = Math.atan2(5.0, 6.8);
  [-4.4, -2.9].forEach(x => { const e = new THREE.Group(); e.position.set(cx + x, 2.55, cz - 15.75); e.rotation.x = escAng; g.add(e);
    lb(e, 1.18, 0.3, escLen, 0x6c757d, 0, -0.15, 0);
    const st = new THREE.Mesh(new THREE.PlaneGeometry(1.0, escLen), escTex); st.rotation.x = -Math.PI / 2; st.position.y = 0.02; st.userData.flat = true; e.add(st);
    [-1, 1].forEach(s => { const gl = lb(e, 0.05, 0.85, escLen, GLASS, s * 0.58, 0.45, 0); gl.userData.flat = true; lb(e, 0.1, 0.07, escLen, 0x212529, s * 0.58, 0.9, 0); lb(e, 0.12, 0.2, escLen, 0xced4da, s * 0.58, 0.05, 0); });
  });
  B(2.9, 0.12, 0.8, 0xadb5bd, -3.65, 0.06, -11.9); B(2.9, 0.12, 0.9, 0xadb5bd, -3.65, 5.2, -19.55);
  sol(-3.65, -15.7, 1.5, 3.5);
  { const t = textPlate("LEVEL 2", 1.3, 0.3, "#20c997", "#ffffff"); t.position.set(cx - 3.65, 3.2, cz - 12.3); g.add(t); B(0.06, 3.0, 0.06, 0x868e96, -4.3, 1.5, -12.3); B(0.06, 3.0, 0.06, 0x868e96, -3.0, 1.5, -12.3); }
  // ---- khối xếp hình khổng lồ (chụp ảnh) + bóng bay ở sảnh ----
  B(1.1, 1.1, 1.1, ML.pink, 11.7, 0.55, 12.3, 0.2); B(1.1, 1.1, 1.1, ML.blue, 12.9, 0.55, 12.3, -0.1); B(1.1, 1.1, 1.1, ML.yellow, 12.3, 1.65, 12.3, 0.4);
  sol(12.3, 12.3, 1.3, 0.6);
  const balloons = (x, z, cl) => { B(0.4, 0.3, 0.4, 0x495057, x, 0.15, z); cl.forEach(([dx, dy, c], i) => { Sp(0.3, c, x + dx, 2.3 + dy, z + i * 0.1 - 0.2, 1.2); B(0.012, 2.0 + dy, 0.012, 0xffffff, x + dx * 0.5, (2.0 + dy) / 2 + 0.3, z + i * 0.05 - 0.1); }); sol(x, z, 0.25, 0.25); };
  balloons(5.5, 20.2, [[0, 0.2, ML.red], [0.35, 0.5, ML.yellow], [-0.3, 0.4, ML.blue], [0.1, 0.8, ML.green]]); balloons(-5.5, 20.2, [[0, 0.3, ML.pink], [0.35, 0.1, ML.orange], [-0.3, 0.6, ML.purple], [0.1, 0.9, ML.teal]]);
  // ---- biển treo trần (ceiling): 2 biểu ngữ ----
  const banner = (text, x, z, ry, c1, c2) => { [-1.6, 1.6].forEach(d => flat(B(0.03, 4, 0.03, 0x6b7780, x + Math.cos(ry) * d, H - 2, z - Math.sin(ry) * d)));
    flat(B(4.0, 1.6, 0.05, 0xffffff, x, 7.9, z, ry)); const nx = Math.sin(ry), nz = Math.cos(ry);
    [1, -1].forEach(s => { const p = textPlate(text, 3.8, 1.4, c1, c2); p.position.set(cx + x + nx * 0.04 * s, 7.9, cz + z + nz * 0.04 * s); p.rotation.y = ry + (s < 0 ? Math.PI : 0); p.userData.flat = true; g.add(p); }); };
  banner("SUPER SALE!", -8.5, 10.5, 0.15, "#e03131", "#ffd43b"); banner("NEW ARRIVALS", 8.0, 6.5, -0.15, "#7048e8", "#ffffff");

  // ==== TOYS: TOY ISLAND (x −18..−9, z −6..8) – mặt tiền kính, cửa rộng 5 m ở x = −9, z −1.5..3.5 ====
  pane(0.1, 3.2, 4.5, -9, 1.6, -3.75); pane(0.1, 3.2, 4.5, -9, 1.6, 5.75); sol(-9, -3.75, 0.1, 2.25); sol(-9, 5.75, 0.1, 2.25);
  pane(9, 3.2, 0.1, -13.5, 1.6, -6); pane(9, 3.2, 0.1, -13.5, 1.6, 8); sol(-13.5, -6, 4.5, 0.1); sol(-13.5, 8, 4.5, 0.1);
  B(0.5, 0.9, 14, 0xff6b9d, -9, 3.05, 1); B(0.4, 3.0, 0.4, 0xffd43b, -9, 1.5, -6); B(0.4, 3.0, 0.4, 0xffd43b, -9, 1.5, 8); [-1.5, 3.5].forEach(z => B(0.3, 3.0, 0.3, 0xffd43b, -9, 1.5, z));
  sign("TOY ISLAND", 6.2, 0.7, "#ffd43b", "#e03131", -8.73, 3.05, 1, Math.PI / 2);
  for (let i = 0; i < 7; i++) B(0.2, 0.2, 0.2, stripe[i % 6], -8.78, 3.6, -5 + i * 2);   // đèn viền biển
  [-4.3, 5.2].forEach(z => { B(0.5, 2.4, 2.8, 0xffffff, -17.7, 1.2, z); plane(mallShelfTex("toy"), 2.6, 2.4, -17.44, 1.2, z, Math.PI / 2); B(0.56, 0.12, 2.8, 0xff6b9d, -17.7, 2.46, z); sol(-17.7, z, 0.3, 1.4); });
  C(1.0, 0.8, 0xff6b9d, -14.5, 0.4, -2.4, 20); C(1.04, 0.06, 0xffffff, -14.5, 0.83, -2.4, 20); sol(-14.5, -2.4, 1.0, 1.0);
  const teddy = (x, y, z, c, s) => { Sp(0.24 * s, c, x, y + 0.24 * s, z, 1); Sp(0.17 * s, c, x, y + 0.6 * s, z + 0.02 * s); Sp(0.06 * s, c, x - 0.13 * s, y + 0.74 * s, z); Sp(0.06 * s, c, x + 0.13 * s, y + 0.74 * s, z); Sp(0.07 * s, 0xf3d9b1, x, y + 0.57 * s, z + 0.16 * s); Sp(0.025 * s, 0x212529, x, y + 0.6 * s, z + 0.22 * s); Sp(0.1 * s, c, x - 0.24 * s, y + 0.3 * s, z + 0.04 * s); Sp(0.1 * s, c, x + 0.24 * s, y + 0.3 * s, z + 0.04 * s); };
  [[-15.1, -2.9, 0xb8793c], [-14.0, -2.9, 0xffa8c8], [-14.9, -1.9, 0xf1d9a3], [-14.0, -1.9, 0x91c8f5]].forEach(([x, z, c]) => teddy(x, 0.86, z, c, 0.9));
  teddy(-16.6, 0, -0.4, 0xb8793c, 3.0); sol(-16.6, -0.4, 0.5, 0.5);
  B(2.6, 0.8, 1.2, 0xffffff, -13.2, 0.4, 4.6); B(2.64, 0.06, 1.24, 0x4dabf7, -13.2, 0.83, 4.6); sol(-13.2, 4.6, 1.3, 0.6);
  const car = (x, z, c, ry) => { B(0.5, 0.14, 0.26, c, x, 0.99, z, ry); B(0.26, 0.12, 0.22, 0xe7f5ff, x, 1.12, z, ry); const ca = Math.cos(ry || 0), sa = Math.sin(ry || 0);
    [[-0.17, -1], [0.17, -1], [-0.17, 1], [0.17, 1]].forEach(([dx, s]) => { const w = C(0.06, 0.05, 0x212529, x + dx * ca - s * 0.13 * sa, 0.93, z - dx * sa - s * 0.13 * ca, 8); w.rotation.x = Math.PI / 2; }); };
  [[-14.3, 4.4, ML.red, 0], [-13.5, 4.8, ML.yellow, 0.3], [-12.7, 4.3, ML.blue, -0.2], [-13.9, 4.9, ML.green, 0.5], [-12.3, 4.8, ML.orange, 0.1]].forEach(([x, z, c, r]) => car(x, z, c, r));
  B(1.8, 0.7, 1.2, 0xffffff, -11.4, 0.35, -3.8); B(1.84, 0.06, 1.24, 0xffd43b, -11.4, 0.73, -3.8); sol(-11.4, -3.8, 0.95, 0.65);
  [[-12.0, -3.8, 4], [-11.3, -3.5, 3], [-10.8, -4.0, 5], [-11.4, -4.2, 2]].forEach(([x, z, n], j) => { for (let i = 0; i < n; i++) B(0.28, 0.28, 0.28, stripe[(i + j) % 6], x, 0.89 + i * 0.28, z, i * 0.2); });
  B(1.4, 1.0, 1.0, 0xffe066, -15.8, 0.5, 6.9); B(1.5, 0.1, 1.1, 0xff6b9d, -15.8, 1.05, 6.9); B(0.7, 0.2, 0.7, 0xe03131, -15.8, 1.2, 6.9); B(0.25, 0.4, 0.04, 0x74c0fc, -15.8, 0.35, 6.4); B(0.3, 0.3, 0.04, 0xffffff, -15.3, 0.65, 6.4); B(0.3, 0.3, 0.04, 0xffffff, -16.3, 0.65, 6.4); sol(-15.8, 6.9, 0.78, 0.55);
  B(2.2, 1.0, 0.8, 0xffffff, -10.6, 0.5, 6.7); B(2.3, 0.07, 0.9, 0xffd43b, -10.6, 1.03, 6.7); B(2.22, 0.6, 0.04, 0xff6b9d, -10.6, 0.5, 6.31); sol(-10.6, 6.7, 1.15, 0.45);
  B(0.4, 0.3, 0.04, 0x1b1f23, -11.0, 1.25, 6.7); B(0.34, 0.24, 0.02, 0x3b8fd6, -11.0, 1.25, 6.67); C(0.14, 0.26, 0xdee2e6, -10.0, 1.2, 6.7, 10); Sp(0.14, 0xff6b9d, -10.0, 1.38, 6.7);
  balloons(-9.6, 7.3, [[0, 0.1, ML.yellow], [0.3, 0.5, ML.pink], [-0.3, 0.3, ML.blue]]);

  // ==== ELECTRONICS: TECH ZONE (x 9..18, z −6..8) – cửa rộng 5 m ở x = 9, z −1.5..3.5 ====
  pane(0.1, 3.2, 4.5, 9, 1.6, -3.75); pane(0.1, 3.2, 4.5, 9, 1.6, 5.75); sol(9, -3.75, 0.1, 2.25); sol(9, 5.75, 0.1, 2.25);
  pane(9, 3.2, 0.1, 13.5, 1.6, -6); pane(9, 3.2, 0.1, 13.5, 1.6, 8); sol(13.5, -6, 4.5, 0.1); sol(13.5, 8, 4.5, 0.1);
  B(0.5, 0.9, 14, 0x1b2a5e, 9, 3.05, 1); B(0.4, 3.0, 0.4, 0x22b8cf, 9, 1.5, -6); B(0.4, 3.0, 0.4, 0x22b8cf, 9, 1.5, 8); [-1.5, 3.5].forEach(z => B(0.3, 3.0, 0.3, 0x22b8cf, 9, 1.5, z));
  sign("TECH ZONE", 6.2, 0.7, "#1b2a5e", "#3bc9db", 8.73, 3.05, 1, -Math.PI / 2); B(0.08, 0.08, 13.6, 0x22b8cf, 8.72, 2.55, 1);
  [-3.4, 0, 3.4].forEach(z => { B(0.14, 1.7, 2.9, 0x111418, 17.88, 2.2, z); }); sol(17.55, 0, 0.45, 5.3); B(0.9, 0.7, 10.4, 0x343a40, 17.5, 0.35, 0); B(0.92, 0.04, 10.4, 0x22b8cf, 17.5, 0.72, 0);
  plane(mallTex("tv", 9.6, 1.5, 50, (x, w, h) => { [[0, ["#1c7ed6", "#74c0fc", "#fcc419"]], [1, ["#7048e8", "#e599f7", "#ff6b9d"]], [2, ["#2b8a3e", "#8ce99a", "#ffd43b"]]].forEach(([i, cs]) => { const X = 0.2 + i * 3.2, gr = x.createLinearGradient(X, 0, X + 2.7, 1.4); gr.addColorStop(0, cs[0]); gr.addColorStop(1, cs[1]); x.fillStyle = gr; x.fillRect(X, 0.05, 2.7, 1.4); x.fillStyle = cs[2]; x.beginPath(); x.arc(X + 1.9, 0.5, 0.3, 0, 7); x.fill(); x.fillStyle = "rgba(255,255,255,0.8)"; x.beginPath(); x.moveTo(X, 1.45); x.lineTo(X + 0.9, 0.8); x.lineTo(X + 1.6, 1.2); x.lineTo(X + 2.2, 0.9); x.lineTo(X + 2.7, 1.45); x.fill(); }); }), 9.6, 1.5, 17.8, 2.2, 0, -Math.PI / 2);
  const dev = (x, z, w, h, c, tilt, y0) => { const m = B(w, h, 0.02, 0x111418, x, y0 + h / 2, z); m.rotation.x = -tilt; const s = B(w - 0.03, h - 0.03, 0.02, c, x, y0 + h / 2 + 0.006, z + 0.011); s.rotation.x = -tilt; };
  const table = (x, z, hw, hd, c) => { B(hw * 2, 0.1, hd * 2, 0xffffff, x, 0.8, z); B(hw * 2 - 0.1, 0.7, hd * 2 - 0.1, c, x, 0.4, z); B(hw * 2 + 0.04, 0.04, hd * 2 + 0.04, 0x22b8cf, x, 0.86, z); sol(x, z, hw, hd); };
  table(11.9, -3.8, 1.3, 0.6, 0x1b2a5e); [0, 1, 2, 3, 4, 5, 6].forEach(i => dev(10.9 + i * 0.33, -3.8, 0.24, 0.42, [0x74c0fc, 0xff8787, 0x8ce99a, 0xffd43b, 0xe599f7, 0x66d9e8, 0xffa94d][i], 0.3, 0.9));
  table(15.5, -3.8, 1.25, 0.6, 0x1b2a5e); [0, 1, 2].forEach(i => { B(0.55, 0.03, 0.4, 0xced4da, 14.7 + i * 0.8, 0.93, -3.8); B(0.5, 0.34, 0.02, 0x111418, 14.7 + i * 0.8, 1.12, -4.0).rotation.x = -0.15; B(0.46, 0.3, 0.02, [0x4dabf7, 0xffd43b, 0xff6b9d][i], 14.7 + i * 0.8, 1.12, -3.985).rotation.x = -0.15; });
  table(14.4, 4.0, 1.2, 0.6, 0x1b2a5e); [0, 1, 2, 3].forEach(i => dev(13.5 + i * 0.6, 4.0, 0.45, 0.3, [0x4dabf7, 0x51cf66, 0xff922b, 0xe599f7][i], 0.55, 0.9));
  C(0.06, 1.7, 0x495057, 10.4, 0.85, 6.8, 8); C(0.3, 0.05, 0x495057, 10.4, 0.03, 6.8, 12); sol(10.4, 6.8, 0.35, 0.35);
  [[0.5, 1.5, ML.red], [-0.5, 1.5, ML.blue], [0.4, 1.0, ML.yellow], [-0.4, 1.0, ML.green]].forEach(([dx, y, c]) => { const t = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.025, 6, 14, Math.PI), mat(0x212529)); t.position.set(cx + 10.4 + dx, y + 0.05, cz + 6.8); g.add(t); Sp(0.07, c, 10.4 + dx - 0.16, y, 6.8, 1.2); Sp(0.07, c, 10.4 + dx + 0.16, y, 6.8, 1.2); B(0.5, 0.03, 0.03, 0x495057, 10.4 + dx / 2, y + 0.02, 6.8); });
  B(2.8, 1.0, 0.9, 0x1b2a5e, 14.8, 0.5, 6.9); B(2.9, 0.07, 1.0, 0x22b8cf, 14.8, 1.03, 6.9); sol(14.8, 6.9, 1.45, 0.5); B(0.5, 0.32, 0.04, 0x1b1f23, 14.2, 1.3, 6.9); B(0.44, 0.26, 0.02, 0x3b8fd6, 14.2, 1.3, 6.87); B(0.3, 0.03, 0.2, 0xffffff, 15.3, 1.09, 6.8);
  B(1.0, 0.8, 0.9, 0x1b2a5e, 15.8, 0.4, 0.6); B(1.04, 0.04, 0.94, 0x22b8cf, 15.8, 0.82, 0.6); B(0.62, 0.4, 0.04, 0x111418, 15.8, 1.25, 0.4); B(0.56, 0.34, 0.02, 0x7048e8, 15.8, 1.25, 0.385); B(0.16, 0.05, 0.1, 0xf03e3e, 15.5, 0.86, 0.85); B(0.16, 0.05, 0.1, 0x4dabf7, 15.95, 0.86, 0.85); sol(15.8, 0.6, 0.55, 0.5);

  // ==== SPORTS: SPORT STAR (x −18..−6, z −22..−10) – mở ra sảnh ở z = −10 (cửa rộng 6 m: x −14.5..−8.5) ====
  pane(3.5, 3.2, 0.1, -16.25, 1.6, -10); pane(2.5, 3.2, 0.1, -7.25, 1.6, -10); sol(-16.25, -10, 1.75, 0.1); sol(-7.25, -10, 1.25, 0.1); pane(0.1, 3.2, 4.5, -6, 1.6, -19.75); sol(-6, -19.75, 0.1, 2.25);
  B(12, 0.9, 0.5, 0x2b8a3e, -12, 3.05, -10); [-18, -6, -14.5, -8.5].forEach(x => B(0.4, 3.0, 0.4, 0xff922b, x, 1.5, -10));
  sign("SPORT STAR", 6.2, 0.7, "#2b8a3e", "#ffffff", -12, 3.05, -9.73, 0); B(12, 0.08, 0.08, 0xff922b, -12, 2.55, -9.7);
  [-13.8, -18.4].forEach(z => { B(0.5, 2.4, 3.4, 0xffffff, -17.7, 1.2, z); plane(mallShelfTex("shoe"), 3.4, 2.4, -17.44, 1.2, z, Math.PI / 2); B(0.56, 0.12, 3.4, 0xff922b, -17.7, 2.46, z); sol(-17.7, z, 0.3, 1.7); });
  B(1.7, 0.1, 1.0, 0xced4da, -13.5, 0.3, -12.3); [-0.8, 0.8].forEach(dx => [-1, 1].forEach(s => B(0.04, 0.8, 0.04, 0x868e96, -13.5 + dx, 0.5, -12.3 + s * 0.45))); B(1.7, 0.04, 0.04, 0x868e96, -13.5, 0.9, -12.75); B(1.7, 0.04, 0.04, 0x868e96, -13.5, 0.9, -11.85); B(0.04, 0.04, 0.9, 0x868e96, -14.3, 0.9, -12.3); B(0.04, 0.04, 0.9, 0x868e96, -12.7, 0.9, -12.3); sol(-13.5, -12.3, 0.9, 0.55);
  for (let i = 0; i < 16; i++) { const c = [0xff922b, 0xffffff, 0xffd43b, 0x74c0fc, 0xf03e3e][i % 5]; Sp(0.17, c, -14.1 + (i % 4) * 0.4, 0.5 + Math.floor(i / 8) * 0.17, -12.6 + ((i >> 2) % 2) * 0.5 + (i % 2) * 0.12); }
  const bike = (x, z, c) => { [-0.6, 0.6].forEach(dx => { const w = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.03, 6, 20), mat(0x212529)); w.position.set(cx + x + dx, 0.45, cz + z); g.add(w); });
    B(0.9, 0.04, 0.04, c, x, 0.7, z).rotation.z = 0.1; B(0.6, 0.04, 0.04, c, x - 0.15, 0.62, z).rotation.z = -0.9; B(0.6, 0.04, 0.04, c, x + 0.3, 0.62, z).rotation.z = 0.9; B(0.2, 0.05, 0.12, 0x212529, x - 0.35, 0.95, z); B(0.04, 0.4, 0.04, 0x495057, x + 0.52, 0.85, z); B(0.04, 0.04, 0.5, 0x495057, x + 0.52, 1.05, z); sol(x, z, 1.0, 0.4); };
  bike(-15.2, -21.1, 0xe03131); bike(-12.2, -21.1, 0x1c7ed6);
  B(0.06, 1.9, 0.06, 0x495057, -9.9, 0.95, -18.4); B(0.06, 1.9, 0.06, 0x495057, -7.7, 0.95, -18.4); B(2.3, 0.05, 0.05, 0x495057, -8.8, 1.9, -18.4); B(2.3, 0.1, 0.1, 0x495057, -8.8, 0.08, -18.4); sol(-8.8, -18.4, 1.15, 0.2);
  [-1, 1].forEach(s => plane(mallTex("jersey", 2.1, 1.0, 60, (x, w, h) => { [["#e03131", "10"], ["#1c7ed6", "7"], ["#ffd43b", "9"], ["#2b8a3e", "5"], ["#7048e8", "11"]].forEach(([c, n], i) => { const X = 0.04 + i * 0.41; x.fillStyle = c; x.beginPath(); x.moveTo(X, 0.1); x.lineTo(X + 0.12, 0.05); x.lineTo(X + 0.2, 0.2); x.lineTo(X + 0.28, 0.05); x.lineTo(X + 0.4, 0.1); x.lineTo(X + 0.4, 0.4); x.lineTo(X + 0.3, 0.4); x.lineTo(X + 0.3, 0.85); x.lineTo(X + 0.1, 0.85); x.lineTo(X + 0.1, 0.4); x.lineTo(X, 0.4); x.fill(); signText(x, n, X + 0.2, 0.55, 0.15, 0.2, "#ffffff"); }); }), 2.1, 1.0, -8.8, 1.38, -18.4 + s * 0.04, s > 0 ? 0 : Math.PI));
  [-9.2, -8.5, -7.8].forEach((x, i) => { const r = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 6, 16), mat([0xf03e3e, 0x1c7ed6, 0x2b8a3e][i])); r.scale.y = 1.25; r.position.set(cx + x, 1.75, cz - 21.9); g.add(r); B(0.04, 0.3, 0.03, 0x212529, x, 1.35, -21.9); });
  B(1.9, 0.08, 0.5, 0x495057, -8.5, 1.1, -21.8);
  B(1.8, 0.1, 0.5, 0x343a40, -16.4, 0.45, -11.6); B(1.7, 0.05, 0.45, 0x495057, -16.4, 0.15, -11.6);
  [0, 1, 2, 3, 4].forEach(i => { const c = [0xf03e3e, 0x1c7ed6, 0xff922b, 0x2b8a3e, 0x7048e8][i], x = -17.1 + i * 0.5; const d = C(0.04, 0.34, 0x212529, x, 0.55, -11.6, 6); d.rotation.x = Math.PI / 2; C(0.12, 0.08, c, x, 0.55, -11.78, 10); C(0.12, 0.08, c, x, 0.55, -11.42, 10); }); sol(-16.4, -11.6, 0.95, 0.3);

  // ==== FOODCOURT: x 4..18, z −22..−10 ====
  B(0.4, 3.0, 0.4, 0xf76707, 4.3, 1.5, -10.2); B(0.4, 3.0, 0.4, 0xf76707, 17.7, 1.5, -10.2); B(14, 0.8, 0.4, 0xf76707, 11, 3.1, -10.2); sol(4.3, -10.2, 0.25, 0.25); sol(17.7, -10.2, 0.25, 0.25);
  sign("FOOD COURT", 6.2, 0.62, "#f76707", "#ffffff", 11, 3.1, -9.98, 0); B(14, 0.08, 0.08, 0xffd43b, 11, 2.64, -10.0);
  for (let i = 0; i < 14; i++) Sp(0.1, [0xfa5252, 0xffd43b, 0x51cf66, 0x4dabf7][i % 4], 4.5 + i, 2.5 + (i % 2) * 0.05, -10.0, 1);
  const stall = (x, z, wid, alongX, c, items) => {   // quầy: alongX=true → dọc tường sau (mặt quầy hướng +z); false → dọc tường phải (mặt hướng −x)
    const bw = alongX ? wid : 0.9, bd = alongX ? 0.9 : wid;
    B(bw, 1.0, bd, 0xffffff, x, 0.5, z); B(bw + 0.1, 0.08, bd + 0.1, c, x, 1.04, z);
    B(alongX ? wid - 0.02 : 0.04, 0.7, alongX ? 0.04 : wid - 0.02, c, alongX ? x : x - 0.47, 0.5, alongX ? z + 0.47 : z); sol(x, z, bw / 2, bd / 2);
    for (let i = 0; i < 8; i++) { const t = -wid / 2 + (i + 0.5) * wid / 8, aw = wid / 8 - 0.02; const m = B(alongX ? aw : 1.2, 0.06, alongX ? 1.2 : aw, i % 2 ? 0xffffff : c, alongX ? x + t : x - 0.35, 3.2, alongX ? z + 0.5 : z + t); if (alongX) m.rotation.x = 0.22; else m.rotation.z = -0.22; }   // mái che sọc
    [-1, 1].forEach(s => B(0.05, 2.1, 0.05, 0x868e96, alongX ? x + s * (wid / 2 - 0.1) : x - 0.9, 2.1, alongX ? z + 0.9 : z + s * (wid / 2 - 0.1)));
    items(); };
  const menu = (title, rows, c, x, z, ry, w) => plane(mallTex("menu" + title, w, 1.4, 50, (g2, ww, hh) => { g2.fillStyle = "#2b2b2b"; g2.fillRect(0, 0, ww, hh); g2.fillStyle = c; g2.fillRect(0, 0, ww, 0.42); signText(g2, title, ww / 2, 0.22, ww - 0.4, 0.3, "#ffffff");
    rows.forEach((r, i) => { signText(g2, r[0], ww * 0.3, 0.68 + i * 0.22, ww * 0.5, 0.15, "#ffffff"); signText(g2, r[1], ww * 0.82, 0.68 + i * 0.22, ww * 0.25, 0.15, "#ffd43b"); }); }), w, 1.4, x, 2.6, z, ry);
  stall(7.75, -20.45, 4.2, true, 0xe03131, () => {   // BURGER BAR
    for (let i = 0; i < 3; i++) { const x = 6.6 + i * 0.8; Sp(0.17, 0xd9902f, x, 1.2, -20.4, 0.6); C(0.17, 0.05, 0x6b3a1e, x, 1.14, -20.4, 12); C(0.18, 0.025, 0x51cf66, x, 1.18, -20.4, 12); Sp(0.17, 0xd9902f, x, 1.1, -20.4, 0.45); }
    B(3.8, 1.0, 0.7, 0x868e96, 7.75, 0.5, -21.5); B(0.8, 0.12, 0.6, 0x212529, 6.6, 1.06, -21.5); B(0.8, 0.5, 0.5, 0xced4da, 8.9, 1.25, -21.6); });
  menu("BURGER BAR", [["Burger", "$3"], ["Fries", "$2"], ["Cola", "$1"], ["Salad", "$2"]], "#e03131", 7.75, -21.96, 0, 4.0);
  stall(13.25, -20.45, 4.2, true, 0x2b8a3e, () => {   // NOODLE HOUSE
    for (let i = 0; i < 3; i++) { const x = 12.1 + i * 1.1; C(0.2, 0.12, 0xffffff, x, 1.14, -20.4, 14); C(0.17, 0.02, 0xf2c94c, x, 1.2, -20.4, 14); Sp(0.05, 0xe03131, x + 0.05, 1.22, -20.4, 0.6); B(0.01, 0.01, 0.34, 0x8d5a2b, x + 0.12, 1.28, -20.4).rotation.x = 0.5; }
    B(3.8, 1.0, 0.7, 0x868e96, 13.25, 0.5, -21.5); C(0.3, 0.3, 0xadb5bd, 12.2, 1.15, -21.5, 12); C(0.31, 0.04, 0x495057, 12.2, 1.32, -21.5, 12); });
  menu("NOODLE HOUSE", [["Chicken noodles", "$3"], ["Egg rice", "$3"], ["Soup", "$2"], ["Tea", "$1"]], "#2b8a3e", 13.25, -21.96, 0, 4.0);
  stall(17.35, -14.5, 5.0, false, 0xf06595, () => {   // ICE CREAM
    for (let i = 0; i < 4; i++) { const z = -16.2 + i * 0.85; lc(g, 0.11, 0.015, 0.3, mat(0xe6b86a), cx + 17.3, 1.25, cz + z, 8); Sp(0.12, [0xffa8c8, 0xffffff, 0x6b3a1e, 0x8ce99a][i], 17.3, 1.45, z); }
    B(0.7, 1.0, 4.6, 0x868e96, 17.9, 0.5, -14.5); });
  menu("ICE CREAM", [["Strawberry", "$2"], ["Vanilla", "$2"], ["Chocolate", "$2"], ["Mango", "$2"]], "#f06595", 17.96, -14.5, -Math.PI / 2, 4.0);
  const ftable = (x, z, c) => { C(0.8, 0.07, 0xffffff, x, 0.78, z, 18); C(0.08, 0.7, 0x868e96, x, 0.38, z, 8); C(0.35, 0.04, 0x868e96, x, 0.03, z, 10); C(0.82, 0.03, c, x, 0.76, z, 18);
    [[1.1, 0], [-1.1, 0], [0, 1.1], [0, -1.1]].forEach(([dx, dz], i) => C(0.25, 0.45, [ML.yellow, ML.blue, ML.pink, ML.green][i], x + dx, 0.225, z + dz, 10));
    C(0.09, 0.14, 0xffffff, x + 0.3, 0.87, z + 0.1, 8); C(0.05, 0.12, 0xe03131, x - 0.2, 0.87, z - 0.2, 8); sol(x, z, 1.25, 1.25); };
  ftable(6.8, -12.8, 0xf76707); ftable(13.2, -12.8, 0x4dabf7); ftable(6.4, -16.6, 0x51cf66); ftable(13.6, -16.6, 0xf06595);
  { const x0 = 10, z0 = -16.7; B(2.0, 0.9, 1.0, 0xffd43b, x0, 0.45, z0); B(2.1, 0.07, 1.1, 0xffffff, x0, 0.93, z0); B(2.0, 0.5, 0.04, 0xf76707, x0, 0.5, z0 + 0.52); C(0.05, 2.3, 0x868e96, x0, 1.55, z0, 6);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; B(0.5, 0.04, 0.9, i % 2 ? 0xffffff : 0xf76707, x0 + Math.cos(a) * 0.55, 2.45, z0 + Math.sin(a) * 0.55, -a); }
    C(0.15, 0.3, 0xff922b, x0 - 0.5, 1.12, z0, 10); C(0.15, 0.3, 0xfcc419, x0, 1.12, z0, 10); C(0.15, 0.3, 0x51cf66, x0 + 0.5, 1.12, z0, 10); sol(x0, z0, 1.0, 0.55); }
  tree(17, -20.8, 1.0); tree(4.8, -20.6, 0.9);

  // ---- chỗ bày từ vựng ----
  const A = (list) => list.map(([x, y, z, sx, sz]) => [cx + x, y, cz + z, cx + sx, cz + sz]);
  P.anchors = {
    atrium: A([[-7, 1.35, 15.5, -7, 16.9], [-5, 1.35, 15.5, -5, 16.9], [3.6, 1.9, 11.5, 3.6, 12.9], [0, 2.2, 2, 0, 5.8], [-3.65, 1.4, -12.2, -3.65, -11.2], [4.9, 0.9, 2, 6.2, 2], [-4.9, 0.9, 2, -6.2, 2], [16.6, 1.8, 20.4, 15.2, 19.4], [12.3, 1.8, 12.3, 12.3, 13.6]]),
    toys: A([[-17.4, 1.4, -4.3, -15.9, -4.3], [-17.4, 1.4, 5.2, -15.9, 5.2], [-14.5, 1.15, -2.4, -14.5, -0.8], [-13.2, 1.15, 4.6, -13.2, 3.3], [-11.4, 1.2, -3.8, -11.4, -2.5], [-10.6, 1.3, 6.7, -10.6, 5.4], [-15.8, 1.7, 6.9, -15.8, 5.7], [-16.6, 1.5, -0.4, -15.3, -0.4]]),
    electronics: A([[11.9, 1.3, -3.8, 11.9, -2.5], [15.5, 1.35, -3.8, 15.5, -2.5], [14.4, 1.3, 4.0, 14.4, 2.7], [17.4, 2.2, -1.8, 16.4, -1.8], [17.4, 2.2, 2.0, 16.4, 2.0], [10.4, 1.7, 6.8, 10.4, 5.6], [14.8, 1.3, 6.9, 14.8, 5.7], [15.8, 1.45, 0.6, 14.5, 0.6]]),
    sports: A([[-17.3, 1.4, -13.8, -15.9, -13.8], [-17.3, 1.4, -18.4, -15.9, -18.4], [-13.5, 1.15, -12.3, -13.5, -11.0], [-15.2, 1.3, -21.1, -15.2, -19.7], [-12.2, 1.3, -21.1, -12.2, -19.7], [-8.8, 1.6, -18.4, -8.8, -17.2], [-8.5, 1.8, -21.7, -8.5, -20.4], [-16.4, 0.9, -11.6, -16.4, -12.5]]),
    foodcourt: A([[6.6, 1.35, -20.4, 6.6, -19.0], [8.9, 1.35, -20.4, 8.9, -19.0], [12.1, 1.35, -20.4, 12.1, -19.0], [14.4, 1.35, -20.4, 14.4, -19.0], [17.3, 1.35, -15.4, 15.9, -15.4], [17.3, 1.35, -13.1, 15.9, -13.1], [6.8, 1.1, -12.8, 4.6, -12.8], [13.2, 1.1, -12.8, 13.2, -11.0], [6.4, 1.1, -16.6, 4.6, -16.6], [13.6, 1.1, -16.6, 13.6, -18.5], [10, 1.4, -16.7, 11.7, -16.7]]),
    ceiling: A([[-8.5, 7.0, 10.5, -8.5, 10.5], [8.0, 7.0, 6.5, 8.0, 6.5]])
  };
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["mallhall"] = { furnish: furnishMall, wall: (len, h, w) => mallWall(len, h, w.x === 0 ? (w.z < 0 ? "back" : "front") : (w.x < 0 ? "left" : "right")), bright: true };

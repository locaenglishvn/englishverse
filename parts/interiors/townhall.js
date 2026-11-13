/* EnglishVerse – nội thất "townhall" (layout: "cityhall"). Mỗi nơi 1 file (xem docs/TEAM.md).
   Dùng các hàm chung của index.html (lb, lc, mat, skin, textPlate, signText, archPath, pot…).
   TOWN HALL – sảnh lớn kiểu toà thị chính thời Pháp (theo UBND TP.HCM): tường kem viền vàng, cửa sổ vòm cao, trần ô cờ, đèn chùm,
   thảm đỏ từ cửa tới chỗ Thị trưởng, cột đá sáng. Phòng 32 × 40 m, trần 10 m. Toạ độ (dx, dz) tính từ giữa phòng, cửa ở dz = +20.
   Khu:  lobby  – sảnh (quầy thông tin, cờ thành phố, bản đồ, mô hình thành phố)
         counter – quầy dịch vụ công dọc tường trái (ô số, máy lấy số, bàn viết)
         board  – bảng nhiệm vụ / thông báo dọc tường phải (Quest Board)
         meeting – phòng họp hội đồng (sau, bên trái; vách kính thấp)
         office – văn phòng phó thị trưởng (sau, bên phải; vách kính thấp)
   Chừa trống: lối vào giữa dz +12..+20, thảm đỏ giữa, chỗ Thị trưởng (0, -17.6) và chỗ NPC: (-6,12) (-10,0) (11,2) (-8,-12) (8,-12). */
const TH = { cream: "#f3e3c3", gold: "#c9a227", wood: "#5c3a24" };
const THW = {};
function townWall(len, h, kind) {   // tường kem: chân gỗ, cột ốp vàng, cửa sổ vòm cao (tường bên), hốc vòm (tường sau)
  const k = len + kind; if (THW[k]) return THW[k];
  const t = skin(len, h, 16, (x, W, H) => {
    x.fillStyle = TH.cream; x.fillRect(0, 0, W, H);
    x.fillStyle = TH.wood; x.fillRect(0, H - 1.2, W, 1.2); x.fillStyle = "#7a5034"; for (let X = 0.5; X < W; X += 1.6) x.fillRect(X, H - 1.05, 1.2, 0.8);   // chân tường gỗ ô
    x.fillStyle = TH.gold; x.fillRect(0, H - 1.3, W, 0.1); x.fillRect(0, 0.4, W, 0.14); x.fillStyle = "#e6d2a8"; x.fillRect(0, 0, W, 0.4);   // phào trên
    if (kind === "side") for (let X = 2; X < W - 1; X += 4) {
      x.fillStyle = "#ead6ad"; x.fillRect(X - 0.35, 0.55, 0.7, H - 1.85); x.fillStyle = TH.gold; x.fillRect(X - 0.35, 0.55, 0.7, 0.3);   // cột ốp
      x.fillStyle = "#fff8ea"; archPath(x, X + 0.75, 1.6, 2.5, 5.6); x.fill(); x.fillStyle = "#bfd9e8"; archPath(x, X + 0.95, 1.8, 2.1, 5.3); x.fill();   // cửa sổ vòm
      x.strokeStyle = "#fff8ea"; x.lineWidth = 0.07; x.beginPath(); x.moveTo(X + 2, 2.4); x.lineTo(X + 2, 7.1); x.moveTo(X + 0.95, 4.6); x.lineTo(X + 3.05, 4.6); x.stroke();
    }
    if (kind === "back") { x.fillStyle = "#ead6ad"; archPath(x, W / 2 - 4, 1, 8, H - 2.3); x.fill(); x.strokeStyle = TH.gold; x.lineWidth = 0.15; archPath(x, W / 2 - 4, 1, 8, H - 2.3); x.stroke(); }
    if (kind === "front") { x.fillStyle = "#ead6ad"; archPath(x, W / 2 - 2.2, H - 5.2, 4.4, 4); x.fill(); x.fillStyle = "#bfd9e8"; x.beginPath(); x.arc(W / 2, H - 3.4, 1.6, Math.PI, 0); x.fill();
      for (let X = 2; X < W - 1; X += 4) if (Math.abs(X + 2 - W / 2) > 4) { x.fillStyle = "#bfd9e8"; archPath(x, X + 0.95, 1.8, 2.1, 5.3); x.fill(); } }
  });
  return THW[k] = new THREE.MeshLambertMaterial({ map: t });
}
function furnishTownHall(P, g, cx, cz, W, D, fur) {
  const back = cz - D / 2, front = cz + D / 2, H = (P.size || {}).h || 10, S = P.room.solids;
  const sol = (x, z, hw, hd) => S.push({ x, z, hw, hd });
  const B = (w, h, d, c, x, y, z) => lb(g, w, h, d, c, x, y, z);   // khối dùng chất liệu chung (gộp được)
  const plate = (t, w, h, bg, fg, x, y, z, ry) => { const p = textPlate(t, w, h, bg, fg); p.position.set(x, y, z); p.rotation.y = ry || 0; g.add(p); return p; };
  const pic = (tex, w, h, x, y, z, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshLambertMaterial({ map: tex })); m.position.set(x, y, z); m.rotation.y = ry || 0; g.add(m); return m; };
  // sàn đá cẩm thạch ô cờ + tường + trần ô vuông
  const fl = skin(2, 2, 48, x => { x.fillStyle = "#efe4cf"; x.fillRect(0, 0, 2, 2); x.fillStyle = "#c9b08a"; x.fillRect(0, 0, 1, 1); x.fillRect(1, 1, 1, 1); x.fillStyle = "#b89a6e"; x.fillRect(0.9, 0.9, 0.2, 0.2); });
  fl.wrapS = fl.wrapT = THREE.RepeatWrapping; fl.repeat.set(W / 2, D / 2); g.children[0].material = new THREE.MeshLambertMaterial({ map: fl });
  ["back", "front", "side", "side"].forEach((k, i) => g.children[1 + i].material = townWall(i < 2 ? W : D, H, k));
  const ce = skin(4, 4, 24, x => { x.fillStyle = "#f6ecd6"; x.fillRect(0, 0, 4, 4); x.fillStyle = "#e3cfa3"; x.fillRect(0.3, 0.3, 3.4, 3.4); x.fillStyle = "#f8f0de"; x.fillRect(0.6, 0.6, 2.8, 2.8); x.strokeStyle = TH.gold; x.lineWidth = 0.06; x.strokeRect(0.3, 0.3, 3.4, 3.4); x.fillStyle = TH.gold; x.beginPath(); x.arc(2, 2, 0.3, 0, 7); x.fill(); });
  ce.wrapS = ce.wrapT = THREE.RepeatWrapping; ce.repeat.set(W / 4, D / 4);
  { const m = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshLambertMaterial({ map: ce, side: THREE.DoubleSide })); m.rotation.x = Math.PI / 2; m.position.set(cx, H, cz); g.add(m); }
  // THẢM ĐỎ viền vàng từ cửa tới chỗ Thị trưởng
  const cz0 = back + 3.4, cz1 = front - 0.3;
  B(2.8, 0.02, cz1 - cz0, 0xc9a227, cx, 0.01, (cz0 + cz1) / 2); B(2.4, 0.03, cz1 - cz0, 0xa61e2e, cx, 0.015, (cz0 + cz1) / 2);
  // CỘT ĐÁ dọc thảm + ĐÈN CHÙM
  [-4, 3, 10].forEach(dz => [-1, 1].forEach(s => { const x = cx + s * 3.6, z = cz + dz;
    lc(g, 0.38, 0.42, H - 0.6, 0xf3ead8, x, (H - 0.6) / 2, z, 16); B(1, 0.4, 1, 0xc9a227, x, H - 0.5, z); B(1.1, 0.5, 1.1, 0xe6d2a8, x, 0.25, z); sol(x, z, 0.5, 0.5); }));
  const bulb = new THREE.MeshBasicMaterial({ color: 0xfff3bf });
  [-12, -2, 8].forEach(dz => { const z = cz + dz;
    lc(g, 0.03, 0.03, 1.6, 0xc9a227, cx, H - 0.8, z, 6); const r = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.06, 6, 24), mat(0xc9a227)); r.rotation.x = Math.PI / 2; r.position.set(cx, H - 1.7, z); g.add(r);
    const r2 = r.clone(); r2.scale.setScalar(0.55); r2.position.y = H - 2.2; g.add(r2);
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, b = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 6), bulb); b.position.set(cx + Math.cos(a) * 1.1, H - 1.5, z + Math.sin(a) * 1.1); g.add(b); }
    const c = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 8), bulb); c.position.set(cx, H - 2.4, z); g.add(c); });
  // TƯỜNG SAU: ban công + biểu tượng thành phố + cờ (chỗ Thị trưởng đứng phía trước)
  B(10, 0.4, 1.8, 0xf3ead8, cx, 5.2, back + 0.9); B(10, 0.12, 0.12, 0xc9a227, cx, 6.25, back + 1.75);
  for (let x = -4.8; x <= 4.81; x += 0.4) lc(g, 0.05, 0.07, 0.85, 0xf3ead8, cx + x, 5.82, back + 1.7, 6);
  [-1, 1].forEach(s => { lc(g, 0.3, 0.33, 5, 0xf3ead8, cx + s * 4.6, 2.5, back + 1.6, 12); sol(cx + s * 4.6, back + 1.6, 0.35, 0.35); });
  const emb = skin(3, 3, 64, x => { x.fillStyle = TH.gold; x.beginPath(); x.arc(1.5, 1.5, 1.45, 0, 7); x.fill(); x.fillStyle = "#1c4f8a"; x.beginPath(); x.arc(1.5, 1.5, 1.2, 0, 7); x.fill();
    x.fillStyle = "#ffd43b"; x.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 0.25 : 0.6; x.lineTo(1.5 + Math.cos(a) * r, 1.3 + Math.sin(a) * r); } x.fill();
    signText(x, "VERSE CITY", 1.5, 2.25, 2, 0.28, "#ffffff"); });
  { const m = pic(emb, 3, 3, cx, 7.8, back + 0.04); m.material.transparent = true; }
  const flag = skin(1.6, 1, 40, x => { x.fillStyle = "#1c4f8a"; x.fillRect(0, 0, 1.6, 1); x.fillStyle = "#ffffff"; x.fillRect(0, 0.42, 1.6, 0.16); x.fillStyle = "#ffd43b"; x.beginPath(); x.arc(0.8, 0.5, 0.2, 0, 7); x.fill(); });
  const flagAt = (x, z) => { lc(g, 0.04, 0.04, 3, 0xc9a227, x, 1.5, z, 6); const s = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), mat(0xc9a227)); s.position.set(x, 3.05, z); g.add(s);
    const f = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.8), new THREE.MeshLambertMaterial({ map: flag, side: THREE.DoubleSide })); f.position.set(x + 0.62, 2.45, z); g.add(f); lc(g, 0.25, 0.3, 0.15, 0xc9a227, x, 0.08, z, 10); sol(x, z, 0.3, 0.3); };
  flagAt(cx - 3, back + 0.8); flagAt(cx + 2, back + 0.8);
  // VÁCH KÍNH THẤP cho phòng họp (trái) và văn phòng (phải): chân gỗ, kính, nẹp gỗ; cửa rộng 2,4 m ở dz -10.7
  const glass = mat(0xcfe8f5, { transparent: true, opacity: 0.3 });
  const wallSeg = (x0, z0, x1, z1) => { const L = Math.hypot(x1 - x0, z1 - z0), mx = (x0 + x1) / 2, mz = (z0 + z1) / 2, alongX = Math.abs(x1 - x0) > Math.abs(z1 - z0);
    const bw = alongX ? L : 0.16, bd = alongX ? 0.16 : L;
    B(bw, 1, bd, 0x5c3a24, mx, 0.5, mz); B(bw, 0.12, bd, 0x5c3a24, mx, 3, mz); const gm = new THREE.Mesh(new THREE.BoxGeometry(alongX ? L : 0.05, 1.9, alongX ? 0.05 : L), glass); gm.position.set(mx, 2, mz); g.add(gm);
    for (let t = 0; t <= L + 0.01; t += 2) B(0.12, 2, 0.12, 0x5c3a24, alongX ? Math.min(x0, x1) + t : mx, 2, alongX ? mz : Math.min(z0, z1) + t);
    sol(mx, mz, bw / 2 + 0.05, bd / 2 + 0.05); };
  [-1, 1].forEach(s => { const xi = cx + s * 5, xo = cx + s * W / 2;
    wallSeg(xo, cz - 7, xi, cz - 7); wallSeg(xi, back, xi, cz - 11.9); wallSeg(xi, cz - 9.5, xi, cz - 7);
    plate(s < 0 ? "MEETING ROOM" : "OFFICE", 2.2, 0.4, "#5c3a24", "#ffe8a3", xi + s * 0.1, 3.4, cz - 10.7, s < 0 ? -Math.PI / 2 : Math.PI / 2); });
  // ===== SẢNH (lobby) =====
  B(4, 1.05, 0.8, 0x5c3a24, cx - 6, 0.53, cz + 13.4); B(4.2, 0.1, 1, 0xefe4cf, cx - 6, 1.1, cz + 13.4); sol(cx - 6, cz + 13.4, 2.1, 0.5);
  plate("INFORMATION", 1.8, 0.35, "#1c4f8a", "#ffffff", cx - 6, 0.7, cz + 13.82, 0);
  flagAt(cx - 13.5, cz + 17.6); flagAt(cx - 12.3, cz + 18.4);
  const map = skin(5, 3, 50, x => { x.fillStyle = "#f8f1df"; x.fillRect(0, 0, 5, 3); x.strokeStyle = TH.wood; x.lineWidth = 0.12; x.strokeRect(0.06, 0.06, 4.88, 2.88);
    x.fillStyle = "#b2f2bb"; x.fillRect(0.3, 0.5, 4.4, 2.2); x.fillStyle = "#74c0fc"; x.beginPath(); x.ellipse(2.5, 2.4, 0.6, 0.25, 0, 0, 7); x.fill();
    x.strokeStyle = "#ffffff"; x.lineWidth = 0.12; [0.9, 1.6, 2.2].forEach(y => { x.beginPath(); x.moveTo(0.3, y); x.lineTo(4.7, y); x.stroke(); }); [1.2, 2.5, 3.8].forEach(X => { x.beginPath(); x.moveTo(X, 0.5); x.lineTo(X, 2.7); x.stroke(); });
    ["#ffa8a8", "#ffd43b", "#a5d8ff", "#d0bfff", "#ffc078"].forEach((c, i) => { x.fillStyle = c; x.fillRect(0.5 + i * 0.85, 1.0 + (i % 2) * 0.7, 0.45, 0.4); });
    signText(x, "MAP OF VERSE CITY", 2.5, 0.28, 4.5, 0.26, TH.wood); });
  pic(map, 5, 3, cx - W / 2 + 0.04, 2.6, cz + 12.5, Math.PI / 2);
  // mô hình thành phố trên bàn
  B(4, 0.9, 2.6, 0x5c3a24, cx + 7.5, 0.45, cz + 13); B(3.8, 0.06, 2.4, 0x8ce99a, cx + 7.5, 0.93, cz + 13); sol(cx + 7.5, cz + 13, 2.1, 1.4);
  [[-1.4, -0.8, 0.5, 0xffa8a8], [-0.7, -0.8, 0.8, 0xa5d8ff], [0.2, -0.7, 0.4, 0xffd43b], [1.1, -0.8, 0.9, 0xd0bfff], [-1.3, 0.6, 0.6, 0xffc078], [-0.4, 0.7, 0.35, 0xffa8a8], [0.6, 0.6, 1.1, 0xa5d8ff], [1.4, 0.7, 0.5, 0xffd43b]]
    .forEach(([dx, dz, h, c]) => B(0.5, h, 0.5, c, cx + 7.5 + dx, 0.96 + h / 2, cz + 13 + dz));
  B(1.2, 0.5, 0.6, 0xf8ebd0, cx + 7.5, 1.21, cz + 13.05); B(3.8, 0.02, 0.18, 0xffffff, cx + 7.5, 0.97, cz + 12.95);
  plate("CITY MODEL", 1.6, 0.3, "#5c3a24", "#ffe8a3", cx + 7.5, 0.6, cz + 14.32, 0);
  [[-4.5, 18.6], [4.5, 18.6], [-14.5, 8.5], [14.5, 10.5]].forEach(([dx, dz]) => { pot(g, cx + dx, cz + dz, 1.6); sol(cx + dx, cz + dz, 0.55, 0.55); });
  // ===== QUẦY DỊCH VỤ CÔNG (counter) – tường trái =====
  const qx = cx - 14.2, qz0 = cz - 4.5, qz1 = cz + 6.5, qL = qz1 - qz0, qzc = (qz0 + qz1) / 2;
  B(0.9, 1.1, qL, 0x5c3a24, qx, 0.55, qzc); B(1.05, 0.08, qL, 0xefe4cf, qx, 1.14, qzc); sol(qx, qzc, 0.5, qL / 2);
  { const gm = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1, qL), glass); gm.position.set(qx - 0.2, 1.7, qzc); g.add(gm); } B(0.12, 0.12, qL, 0x5c3a24, qx - 0.2, 2.25, qzc);
  for (let i = 0; i < 4; i++) { const z = qz0 + 1.4 + i * 2.75; B(0.1, 1.1, 0.1, 0x5c3a24, qx - 0.2, 1.7, z + 1.37); plate(String(i + 1), 0.5, 0.35, "#1c4f8a", "#ffd43b", qx - 0.15, 2.5, z, Math.PI / 2); }
  plate("PUBLIC SERVICES", 4, 0.6, "#1c4f8a", "#ffffff", cx - W / 2 + 0.05, 3.4, qzc, Math.PI / 2);
  plate("NOW SERVING ▶ 012", 2.6, 0.6, "#111111", "#69db7c", cx - W / 2 + 0.05, 4.3, qzc, Math.PI / 2);
  B(0.6, 1.4, 0.45, 0x1c4f8a, cx - 11, 0.7, cz + 8); plate("TAKE A NUMBER", 0.55, 0.25, "#1c4f8a", "#ffffff", cx - 11, 1.2, cz + 8.24, 0); sol(cx - 11, cz + 8, 0.35, 0.3);
  B(2, 1.05, 0.6, 0x5c3a24, cx - 10, 0.53, cz - 5.2); B(2.1, 0.06, 0.7, 0xefe4cf, cx - 10, 1.08, cz - 5.2); sol(cx - 10, cz - 5.2, 1.05, 0.38);   // bàn viết đứng
  [cz + 3, cz - 2.5].forEach(z => { B(0.6, 0.12, 3, 0xa61e2e, cx - 7, 0.48, z); B(0.12, 0.6, 3, 0x5c3a24, cx - 6.75, 0.8, z); [-1.3, 1.3].forEach(d => B(0.5, 0.45, 0.1, 0x3b2a1a, cx - 7, 0.22, z + d)); sol(cx - 7, z, 0.35, 1.5); });
  // ===== BẢNG NHIỆM VỤ (board) – tường phải =====
  const cork = skin(10, 2.6, 40, x => { x.fillStyle = "#c08a55"; x.fillRect(0, 0, 10, 2.6); x.fillStyle = "#5c3a24"; x.fillRect(0, 0, 10, 0.12); x.fillRect(0, 2.48, 10, 0.12);
    const cs = ["#fff3bf", "#d3f9d8", "#d0ebff", "#ffe3e3", "#f3d9fa", "#ffffff"];
    for (let i = 0; i < 18; i++) { const X = 0.3 + (i % 9) * 1.08, Y = 0.35 + Math.floor(i / 9) * 1.1 + (i % 3) * 0.05; x.fillStyle = cs[i % 6]; x.fillRect(X, Y, 0.85, 0.9); x.fillStyle = "#adb5bd"; for (let l = 0; l < 4; l++) x.fillRect(X + 0.1, Y + 0.3 + l * 0.14, 0.65 - (l % 2) * 0.2, 0.04); x.fillStyle = ["#e03131", "#1c7ed6", "#2f9e44"][i % 3]; x.beginPath(); x.arc(X + 0.42, Y + 0.12, 0.06, 0, 7); x.fill(); } });
  pic(cork, 10, 2.6, cx + W / 2 - 0.05, 2.1, cz + 1, -Math.PI / 2);
  plate("CITY QUESTS · HELP YOUR CITY", 5, 0.6, "#2f9e44", "#ffffff", cx + W / 2 - 0.05, 3.85, cz + 1, -Math.PI / 2);
  B(0.7, 1.1, 0.7, 0x2f9e44, cx + 13.5, 0.55, cz + 7.5); B(0.5, 0.04, 0.08, 0x111111, cx + 13.5, 1.12, cz + 7.5); sol(cx + 13.5, cz + 7.5, 0.4, 0.4);   // hộp góp ý
  plate("IDEAS BOX", 0.65, 0.22, "#2f9e44", "#ffffff", cx + 13.14, 0.8, cz + 7.5, -Math.PI / 2);
  B(0.8, 1.2, 1.2, 0x5c3a24, cx + 13.5, 0.6, cz - 5.5); [-0.3, 0, 0.3].forEach((d, i) => B(0.4, 0.3, 0.05, [0xfff3bf, 0xd0ebff, 0xd3f9d8][i], cx + 13.3, 1.35, cz - 5.5 + d)); sol(cx + 13.5, cz - 5.5, 0.45, 0.65);   // giá tờ rơi
  // ===== PHÒNG HỌP (meeting) =====
  const mz = cz - 15;
  B(6, 0.1, 2.2, 0x6b4428, cx - 11.5, 0.78, mz); [-2.6, 2.6].forEach(d => B(0.6, 0.72, 1.6, 0x5c3a24, cx - 11.5 + d, 0.37, mz)); sol(cx - 11.5, mz, 3.05, 1.15);
  [-13.6, -11.5, -9.4].forEach(dx => [-1, 1].forEach(s => { const x = cx + dx, z = mz + s * 1.6;
    B(0.55, 0.1, 0.55, 0x8b1e2b, x, 0.5, z); B(0.55, 0.7, 0.1, 0x8b1e2b, x, 0.9, z + s * 0.25); B(0.08, 0.45, 0.08, 0x3b2a1a, x, 0.22, z); sol(x, z, 0.3, 0.3);
    lc(g, 0.015, 0.015, 0.35, 0x343a40, x, 1.0, mz + s * 0.75, 4); }));
  B(0.9, 1.15, 0.6, 0x5c3a24, cx - 14.5, 0.58, cz - 9); lc(g, 0.015, 0.015, 0.4, 0x343a40, cx - 14.5, 1.35, cz - 8.85, 4); sol(cx - 14.5, cz - 9, 0.5, 0.35);   // bục phát biểu
  plate("CITY COUNCIL", 3.6, 0.7, "#1c4f8a", "#ffd43b", cx - 10.5, 3.2, back + 0.05, 0);
  B(3.4, 1.9, 0.08, 0x111111, cx - 10.5, 1.9, back + 0.1); B(3.2, 1.7, 0.02, 0x4dabf7, cx - 10.5, 1.9, back + 0.15);
  flagAt(cx - 15.3, back + 1.2);
  B(1.8, 0.9, 0.6, 0x5c3a24, cx - 6.2, 0.45, back + 1.5); lc(g, 0.12, 0.12, 0.35, 0xcfe8f5, cx - 6.6, 1.08, back + 1.5, 8); sol(cx - 6.2, back + 1.5, 0.95, 0.35);   // tủ thấp + bình nước
  // ===== VĂN PHÒNG (office) =====
  const oz = cz - 15.5;
  B(3.2, 0.12, 1.4, 0x6b4428, cx + 11, 0.8, oz); B(3.2, 0.74, 0.1, 0x5c3a24, cx + 11, 0.37, oz + 0.65); [-1.5, 1.5].forEach(d => B(0.1, 0.74, 1.3, 0x5c3a24, cx + 11 + d, 0.37, oz)); sol(cx + 11, oz, 1.65, 0.75);
  B(0.7, 0.12, 0.7, 0x3b2a1a, cx + 11, 0.55, oz - 1.3); B(0.7, 1, 0.12, 0x3b2a1a, cx + 11, 1.1, oz - 1.65); sol(cx + 11, oz - 1.4, 0.4, 0.4);
  [10.2, 11.8].forEach(dx => { B(0.6, 0.1, 0.6, 0x8b1e2b, cx + dx, 0.5, oz + 1.9); B(0.6, 0.6, 0.1, 0x8b1e2b, cx + dx, 0.85, oz + 2.18); sol(cx + dx, oz + 1.9, 0.32, 0.32); });
  lc(g, 0.04, 0.08, 0.4, 0x2f9e44, cx + 10.1, 1.06, oz - 0.3, 8); lc(g, 0.18, 0.12, 0.16, 0x2f9e44, cx + 10.1, 1.32, oz - 0.3, 10);   // đèn bàn
  B(0.3, 0.08, 0.2, 0x343a40, cx + 11.6, 0.9, oz - 0.2); plate("DEPUTY MAYOR", 0.8, 0.16, "#5c3a24", "#ffe8a3", cx + 11, 0.95, oz + 0.71, 0);
  const books = skin(2.4, 2.6, 30, x => { x.fillStyle = "#5c3a24"; x.fillRect(0, 0, 2.4, 2.6); const cs = ["#c92a2a", "#1c7ed6", "#2f9e44", "#f08c00", "#7048e8", "#e9ecef"];
    for (let r = 0; r < 4; r++) { let X = 0.1; let i = r; while (X < 2.2) { const w = 0.08 + ((i * 7) % 5) * 0.02; x.fillStyle = cs[i % 6]; x.fillRect(X, 0.12 + r * 0.62, w, 0.5); X += w + 0.02; i++; } x.fillStyle = "#3b2a1a"; x.fillRect(0, 0.62 + r * 0.62, 2.4, 0.06); } });
  [8.6, 13.4].forEach(dx => { B(2.4, 2.6, 0.5, 0x3b2a1a, cx + dx, 1.3, back + 0.3); pic(books, 2.4, 2.6, cx + dx, 1.3, back + 0.56); sol(cx + dx, back + 0.3, 1.25, 0.3); });
  lc(g, 0.06, 0.25, 0.9, 0x5c3a24, cx + 14.5, 0.45, cz - 11, 8); { const gl = new THREE.Mesh(new THREE.SphereGeometry(0.38, 14, 10), mat(0x4dabf7)); gl.position.set(cx + 14.5, 1.3, cz - 11); g.add(gl); } sol(cx + 14.5, cz - 11, 0.35, 0.35);   // quả địa cầu
  B(0.9, 1.5, 0.7, 0x868e96, cx + 15.4, 0.75, cz - 8.6); [0.35, 0.75, 1.15].forEach(y => B(0.3, 0.05, 0.02, 0xdee2e6, cx + 15.4, y, cz - 8.24)); sol(cx + 15.4, cz - 8.6, 0.45, 0.4);   // tủ hồ sơ
  pot(g, cx + 6.2, back + 1.2, 1.4); sol(cx + 6.2, back + 1.2, 0.45, 0.45);
  g.traverse(o => { if (o.isMesh && o.position.y > 4) o.userData.flat = true; });
  // ===== CHỖ BÀY ĐỒ TỪ VỰNG: [x, y, z, chỗ đứng x, chỗ đứng z] =====
  const A = (dx, y, dz, sx, sz) => [cx + dx, y, cz + dz, cx + sx, cz + sz];
  P.anchors = {
    lobby: [A(-7, 1.4, 13.4, -7, 14.8), A(-5, 1.4, 13.4, -5, 14.8), A(-13, 2.2, 18, -11.5, 16.5), A(-15.7, 2.6, 12.5, -14, 12.5), A(6.3, 1.5, 13, 6.3, 15.3), A(8.7, 1.5, 13, 8.7, 15.3), A(4.5, 1.9, 18.6, 4.5, 16.9)],
    counter: [-3.4, -0.65, 2.1, 4.85].map(dz => A(-14.2, 1.4, dz, -12.4, dz)).concat([A(-11, 1.7, 8, -11, 9.4), A(-15.7, 4.9, 1, -12.4, 1), A(-10, 1.35, -5.2, -10, -3.9)]),
    board: [-3, -1, 1, 3, 5].map(dz => A(15.6, (dz + 3) % 4 ? 2.6 : 1.6, dz, 14, dz)).concat([A(13.5, 1.45, 7.5, 12.1, 7.5), A(13.5, 1.7, -5.5, 12.1, -5.5)]),
    meeting: [-13.6, -11.5, -9.4].map(dx => A(dx, 1.15, -15, dx, -12.4)).concat([A(-14.5, 1.6, -9, -13.2, -9.6), A(-10.5, 1.9, -19.75, -10.5, -18.3), A(-15.3, 2.2, -18.4, -14, -18.2), A(-6.2, 1.25, -18.5, -7.5, -17.8)]),
    office: [A(10.2, 1.2, -15.5, 10, -12.5), A(11.4, 1.15, -15.6, 11, -12.5), A(12.3, 1.15, -15.3, 12.4, -12.5), A(14.5, 1.9, -11, 13.2, -11.6), A(15.3, 1.75, -8.6, 14, -9.2), A(13.4, 2.9, -19.5, 13.4, -18), A(8.6, 2.9, -19.5, 8.3, -18)]
  };
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["cityhall"] = { furnish: furnishTownHall };

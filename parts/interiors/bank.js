/* EnglishVerse – nội thất "bank" (layout: "bankhall"). Tách khỏi index.html để mỗi nơi 1 file (xem docs/TEAM.md).
   Dùng các hàm chung của index.html (lb, lc, mat, skin, face, textPlate, addBox…) – chúng có sẵn khi nội thất được dựng. */
/* VERSE BANK – sảnh giao dịch (theo ảnh Ngân hàng Nhà nước TP.HCM) + điểm nhấn thương hiệu xanh lá đậm:
   cột đá granite to, dầm đá quanh giếng trời, giếng trời kính cam – vàng nhiều tầng, tầng lửng lan can sắt đen, quầy giao dịch chữ U có kính + hoa sắt,
   tủ trưng bày tiền xưa dọc 2 bên, cửa chính hoa sắt có hình tròn, cổng an ninh, ATM, khu chờ, phòng két (cửa két tròn) ở cuối sảnh. */
const BANK_GREEN = "#0b6b3a";
function bankLogo(x, cx, cy, r) {   // logo tự chế: tròn xanh lá, chữ V trắng, đồng xu vàng
  x.fillStyle = BANK_GREEN; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
  x.strokeStyle = "#ffffff"; x.lineWidth = r * 0.22; x.lineCap = "round"; x.beginPath(); x.moveTo(cx - r * 0.5, cy - r * 0.35); x.lineTo(cx, cy + r * 0.5); x.lineTo(cx + r * 0.5, cy - r * 0.35); x.stroke(); x.lineCap = "butt";
  x.fillStyle = "#f2c94c"; x.beginPath(); x.arc(cx, cy - r * 0.42, r * 0.17, 0, 7); x.fill();
}
const BKW = {};
function bankWall(len, h, kind) {   // tường: chân đá granite, tầng lửng trắng có cửa + băng rôn xanh, hàng cửa sổ trên cao
  const k = len + kind; if (BKW[k]) return BKW[k];
  const t = skin(len, h, 20, (x, W, H) => {
    x.fillStyle = "#f2f0ea"; x.fillRect(0, 0, W, H);
    x.fillStyle = "#4b4f4c"; x.fillRect(0, H - 1.3, W, 1.3); x.fillStyle = "#5d625e"; for (let X = 0; X < W; X += 1.2) x.fillRect(X, H - 1.3, 0.04, 1.3);   // chân tường đá
    x.fillStyle = "#d8d4c8"; x.fillRect(0, H - 9.6, W, 0.25); x.fillRect(0, 0, W, 0.35);
    for (let X = 0.6; X < W - 1.5; X += 1.6) { x.fillStyle = "#cfe0ea"; x.fillRect(X, 1.4, 1.3, 1.2); x.fillStyle = "#9aa9b0"; x.fillRect(X + 0.62, 1.4, 0.06, 1.2); }   // cửa sổ cao
    if (kind === "front") {   // cửa chính: hoa sắt có hình tròn ở giữa, sáng ngoài trời
      const X0 = W / 2 - 3, Y0 = H - 9;
      x.fillStyle = "#fff6dc"; x.fillRect(X0, Y0, 6, 9); x.strokeStyle = "#1e1e1e"; x.lineWidth = 0.09;
      for (let i = 0; i <= 6; i += 0.75) { x.beginPath(); x.moveTo(X0 + i, Y0); x.lineTo(X0 + i, Y0 + 6); x.stroke(); } for (let j = 0; j <= 6; j += 0.75) { x.beginPath(); x.moveTo(X0, Y0 + j); x.lineTo(X0 + 6, Y0 + j); x.stroke(); }
      for (let i = 0.375; i < 6; i += 0.75) for (let j = 0.375; j < 6; j += 0.75) { x.beginPath(); x.moveTo(X0 + i, Y0 + j - 0.2); x.lineTo(X0 + i + 0.2, Y0 + j); x.lineTo(X0 + i, Y0 + j + 0.2); x.lineTo(X0 + i - 0.2, Y0 + j); x.closePath(); x.stroke(); }
      x.lineWidth = 0.18; x.beginPath(); x.arc(W / 2, Y0 + 2.6, 1.1, 0, 7); x.stroke(); x.beginPath(); x.arc(W / 2, Y0 + 2.6, 0.5, 0, 7); x.stroke();
      x.fillStyle = "#2b2b2b"; x.fillRect(X0, Y0 + 6, 6, 0.3); x.fillStyle = "#ffffff"; x.fillRect(X0 + 0.6, Y0 + 6.3, 4.8, 2.7); x.fillStyle = "#1e1e1e"; x.fillRect(W / 2 - 0.04, Y0 + 6.3, 0.08, 2.7);
    } else {
      for (let X = 2; X < W - 2; X += 5) { x.fillStyle = "#4a3526"; x.fillRect(X, H - 8.6, 1.4, 2.6); x.fillStyle = "#d8d4c8"; x.fillRect(X - 0.1, H - 8.7, 1.6, 0.12); }   // cửa phòng tầng lửng
      for (let X = 4.3; X < W - 2; X += 5) { x.fillStyle = BANK_GREEN; x.fillRect(X, H - 9.3, 0.9, 2.9); x.fillStyle = "#f2c94c"; x.fillRect(X, H - 6.5, 0.9, 0.08); bankLogo(x, X + 0.45, H - 8.6, 0.32); }   // băng rôn thương hiệu
      if (kind === "back") { x.fillStyle = "#ffffff"; x.fillRect(W / 2 - 4.5, 2.9, 9, 3.3); bankLogo(x, W / 2 - 3, 4.55, 1.3); signText(x, "VERSE BANK", W / 2 + 1.3, 4.1, 5, 0.9, BANK_GREEN); signText(x, "NGÂN HÀNG · SINCE 1891", W / 2 + 1.3, 5.2, 5, 0.45, "#6b6b6b"); }
    }
  });
  return BKW[k] = new THREE.MeshLambertMaterial({ map: t });
}
function furnishBankHall(P, g, cx, cz, W, D, fur) {
  const back = cz - D / 2, front = cz + D / 2, H = (P.size || {}).h || 13, S = P.room.solids, GR = 0x0b6b3a;
  const sol = (x, z, hw, hd) => S.push({ x, z, hw, hd });
  // sàn đá bóng + tường
  const fl = skin(2, 2, 48, x => { x.fillStyle = "#ddd0b4"; x.fillRect(0, 0, 2, 2); x.fillStyle = "#d2c3a4"; x.fillRect(0, 0, 1, 1); x.fillRect(1, 1, 1, 1); x.fillStyle = "#cdbfa3"; x.fillRect(0, 0, 2, 0.02); x.fillRect(0, 0, 0.02, 2); x.fillRect(0, 1, 2, 0.02); x.fillRect(1, 0, 0.02, 2); });
  fl.wrapS = fl.wrapT = THREE.RepeatWrapping; fl.repeat.set(W / 2, D / 2); g.children[0].material = new THREE.MeshLambertMaterial({ map: fl });
  ["back", "front", "side", "side"].forEach((k, i) => g.children[1 + i].material = bankWall(i < 2 ? W : D, H, k));
  const gran = skin(2, 4, 32, x => { x.fillStyle = "#555a58"; x.fillRect(0, 0, 2, 4); for (let i = 0; i < 260; i++) { x.fillStyle = i % 3 ? "#6a706d" : "#3f4442"; x.fillRect((i * 0.137) % 2, (i * 0.311) % 4, 0.04, 0.04); } x.fillStyle = "#3f4442"; x.fillRect(0, 1.2, 2, 0.05); x.fillRect(0, 3.1, 2, 0.05); });
  const GM = new THREE.MeshLambertMaterial({ map: gran });
  const column = (x, z, r, h) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.04, h, 20), GM); c.position.set(x, h / 2, z); g.add(c);
    addBox(g, r * 2.5, 0.5, r * 2.5, 0x3f4442, x, h + 0.25, z); addBox(g, r * 2.4, 0.4, r * 2.4, 0x3f4442, x, 0.2, z); sol(x, z, r, r); };
  // GIẾNG TRỜI: 6 cột đá + dầm đá + giếng kính cam – vàng nhiều tầng
  const AX = 8, Z0 = cz - 12, Z1 = cz + 8, ZC = (Z0 + Z1) / 2, HX = AX + 0.6, HZ = (Z1 - Z0) / 2 + 0.6;
  [Z0, cz - 2, Z1].forEach(z => [-1, 1].forEach(s => column(cx + s * AX, z, 0.85, 9.2)));
  const beam = (w, d, x, z) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, 1.4, d), GM); b.position.set(x, 10.1, z); g.add(b); };
  [-1, 1].forEach(s => { beam(1.2, 2 * HZ, cx + s * AX, ZC); beam(2 * HX, 1.2, cx, ZC + s * (HZ - 0.6)); });
  const glass = skin(1, 1, 64, x => { x.fillStyle = "#ffffff"; x.fillRect(0, 0, 1, 1); [["#f4a63a", 0.06, 0.06], ["#f7d774", 0.52, 0.06], ["#fff1cf", 0.06, 0.52], ["#f4a63a", 0.52, 0.52]].forEach(([c, a, b]) => { x.fillStyle = c; x.fillRect(a, b, 0.42, 0.42); }); });
  const tier = (rb, rt, h, y) => { const gl = glass.clone(); gl.needsUpdate = true; gl.wrapS = gl.wrapT = THREE.RepeatWrapping; gl.repeat.set(24, 2);
    const geo = new THREE.CylinderGeometry(Math.SQRT2 * rt, Math.SQRT2 * rb, h, 4, 1, true); geo.rotateY(Math.PI / 4);
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: gl, side: THREE.DoubleSide })); m.scale.set(HX, 1, HZ); m.position.set(cx, y + h / 2, ZC); g.add(m); };
  tier(1, 0.72, 1.8, H); tier(0.72, 0.48, 1.6, H + 1.8);
  const capT = glass.clone(); capT.needsUpdate = true; capT.wrapS = capT.wrapT = THREE.RepeatWrapping; capT.repeat.set(8, 10);
  const cap = new THREE.Mesh(new THREE.PlaneGeometry(2 * HX * 0.48, 2 * HZ * 0.48), new THREE.MeshBasicMaterial({ map: capT, side: THREE.DoubleSide })); cap.rotation.x = Math.PI / 2; cap.position.set(cx, H + 3.4, ZC); g.add(cap);
  // TRẦN TRẮNG có ô kính cam nhỏ (chừa lỗ giếng trời) + vách cổ giếng
  const ceil = skin(4, 4, 24, x => { x.fillStyle = "#f4f2ec"; x.fillRect(0, 0, 4, 4); x.fillStyle = "#c9c3b4"; x.fillRect(1.1, 1.1, 1.8, 1.8); x.fillStyle = "#f4a63a"; x.fillRect(1.25, 1.25, 1.5, 1.5); x.fillStyle = "#fff1cf"; x.fillRect(1.25, 1.95, 1.5, 0.1); x.fillRect(1.95, 1.25, 0.1, 1.5); });
  const ceilPiece = (x0, x1, z0, z1) => { const t = ceil.clone(); t.needsUpdate = true; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set((x1 - x0) / 4, (z1 - z0) / 4);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), new THREE.MeshLambertMaterial({ map: t, side: THREE.DoubleSide })); m.rotation.x = Math.PI / 2; m.position.set((x0 + x1) / 2, H, (z0 + z1) / 2); g.add(m); };
  ceilPiece(cx - W / 2, cx + W / 2, back, ZC - HZ); ceilPiece(cx - W / 2, cx + W / 2, ZC + HZ, front); ceilPiece(cx - W / 2, cx - HX, ZC - HZ, ZC + HZ); ceilPiece(cx + HX, cx + W / 2, ZC - HZ, ZC + HZ);
  [[2 * HX, 0, ZC - HZ, 0], [2 * HX, 0, ZC + HZ, 0], [2 * HZ, -HX, ZC, Math.PI / 2], [2 * HZ, HX, ZC, Math.PI / 2]].forEach(([w, dx, z, ry]) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, H - 10.8), mat(0xf4f2ec, { side: THREE.DoubleSide })); m.position.set(cx + dx, (H + 10.8) / 2, z); m.rotation.y = ry; g.add(m); });
  // TẦNG LỬNG 2 bên + phía trước (lan can sắt đen)
  const rail = skin(1, 1, 64, x => { x.fillStyle = "#1e1e1e"; x.fillRect(0, 0, 1, 0.08); x.fillRect(0, 0.92, 1, 0.08); for (let X = 0.05; X < 1; X += 0.25) x.fillRect(X, 0.08, 0.04, 0.84); x.strokeStyle = "#1e1e1e"; x.lineWidth = 0.03; x.beginPath(); x.arc(0.19, 0.5, 0.09, 0, 7); x.arc(0.69, 0.5, 0.09, 0, 7); x.stroke(); });
  const railM = (len) => { const t = rail.clone(); t.needsUpdate = true; t.wrapS = THREE.RepeatWrapping; t.repeat.set(len, 1); return new THREE.MeshLambertMaterial({ map: t, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide }); };
  const slab = (w, d, x, z, rx, rz, rl, ry) => { addBox(g, w, 0.5, d, 0xf4f2ec, x, 5.25, z); addBox(g, ry ? 0.3 : w, 0.4, ry ? d : 0.3, 0xd8d4c8, rx, 5.3, rz);
    const r = new THREE.Mesh(new THREE.PlaneGeometry(rl, 1), railM(rl)); r.position.set(rx, 6, rz); r.rotation.y = ry || 0; g.add(r); addBox(g, ry ? 0.08 : rl, 0.08, ry ? rl : 0.08, 0x1e1e1e, rx, 6.5, rz); };
  [-1, 1].forEach(s => { slab(3, D, cx + s * (W / 2 - 1.5), cz, cx + s * (W / 2 - 3), cz, D, Math.PI / 2);
    slab(W / 2 - 7, 3, cx + s * (W / 2 + 4) / 2, front - 1.5, cx + s * (W / 2 + 4) / 2, front - 3, W / 2 - 7); });
  // CỬA CHÍNH: 2 cột đá lớn + dầm, cổng an ninh, thảm xanh
  [-1, 1].forEach(s => column(cx + s * 3.6, front - 1.2, 0.9, 10)); { const b = new THREE.Mesh(new THREE.BoxGeometry(9.4, 1.2, 1.4), GM); b.position.set(cx, 10.8, front - 1.2); g.add(b); }
  [-3.75, -2.25, -0.75, 0.75, 2.25, 3.75].forEach(dx => { lc(g, 0.13, 0.13, 1.05, 0xadb5bd, cx + dx, 0.52, front - 3.5, 12); addBox(g, 0.05, 0.6, 0.5, 0x9ad0f5, cx + dx + 0.3 * Math.sign(dx), 0.7, front - 3.5).material = mat(0x9ad0f5, { transparent: true, opacity: 0.5 }); sol(cx + dx, front - 3.5, 0.15, 0.15); });
  addBox(g, 2.2, 0.02, front - 4 - (Z1 + 1), GR, cx, 0.012, (front - 4 + Z1 + 1) / 2);
  // QUẦY GIAO DỊCH CHỮ U: thân đá, mặt đá sáng, vách kính, hoa sắt đen, biển số xanh
  const grille = skin(1, 0.5, 64, x => { x.strokeStyle = "#1e1e1e"; x.lineWidth = 0.04; x.strokeRect(0.02, 0.02, 0.96, 0.46); x.beginPath(); x.arc(0.5, 0.25, 0.16, 0, 7); x.moveTo(0, 0.25); x.lineTo(0.34, 0.25); x.moveTo(0.66, 0.25); x.lineTo(1, 0.25); x.stroke(); x.beginPath(); x.moveTo(0.5, 0.02); x.lineTo(0.5, 0.48); x.stroke(); });
  const counter = (x, z, len, ry, nums) => { const gp = new THREE.Group(); gp.position.set(x, 0, z); gp.rotation.y = ry; g.add(gp);
    const body = new THREE.Mesh(new THREE.BoxGeometry(len, 1.1, 0.8), GM); body.position.y = 0.55; gp.add(body); addBox(gp, len + 0.1, 0.08, 0.95, 0xe9e4d6, 0, 1.14, 0); addBox(gp, len, 0.12, 0.02, GR, 0, 0.85, 0.41);
    addBox(gp, len, 0.9, 0.04, 0x9ad0f5, 0, 1.63, -0.15).material = mat(0x9ad0f5, { transparent: true, opacity: 0.25 });
    const gt = grille.clone(); gt.needsUpdate = true; gt.wrapS = THREE.RepeatWrapping; gt.repeat.set(len, 1);
    const gm = new THREE.Mesh(new THREE.PlaneGeometry(len, 0.5), new THREE.MeshLambertMaterial({ map: gt, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide })); gm.position.set(0, 2.33, -0.15); gp.add(gm);
    for (let i = 0; i <= len; i += len / Math.max(1, nums.length)) addBox(gp, 0.06, 1.4, 0.06, 0x1e1e1e, -len / 2 + i, 1.85, -0.15);
    nums.forEach((n, i) => { const pl = textPlate(String(n), 0.5, 0.35, BANK_GREEN, "#f2c94c"); pl.position.set(-len / 2 + (i + 0.5) * len / nums.length, 2.85, -0.12); gp.add(pl); }); };
  counter(cx, cz - 9, 12.6, 0, [1, 2, 3, 4]); sol(cx, cz - 9, 6.3, 0.4);
  [-1, 1].forEach(s => { counter(cx + s * 6, cz - 4, 10, -s * Math.PI / 2, s < 0 ? [5, 6, 7] : [8, 9, 10]); sol(cx + s * 6, cz - 4, 0.4, 5); });
  // dây xếp hàng xanh
  [-1, 1].forEach(s => { for (let z = cz + 1.5; z <= cz + 5.1; z += 1.8) { lc(g, 0.05, 0.05, 1, 0xc9a227, cx + s * 3, 0.5, z, 8); lc(g, 0.2, 0.2, 0.05, 0xc9a227, cx + s * 3, 0.03, z, 12); sol(cx + s * 3, z, 0.12, 0.12); }
    addBox(g, 0.05, 0.06, 3.6, GR, cx + s * 3, 0.85, cz + 3.3); });
  // TỦ TRƯNG BÀY TIỀN XƯA dọc 2 tường (dưới tầng lửng)
  const notes = skin(1.4, 1.2, 50, x => { x.fillStyle = "#fff5d6"; x.fillRect(0, 0, 1.4, 1.2); ["#7fb685", "#c98d5a", "#8aa1c9", "#d9a3b8", "#a3c9a8", "#d8c37a"].forEach((c, i) => { x.fillStyle = c; x.fillRect(0.12 + (i % 2) * 0.62, 0.1 + Math.floor(i / 2) * 0.37, 0.52, 0.26); }); });
  const cabZ = []; for (let z = cz - 14; z <= cz + 6.1; z += 2.6) cabZ.push(z);
  [-1, 1].forEach(s => { const x = cx + s * (W / 2 - 0.45);
    cabZ.forEach(z => { addBox(g, 0.7, 2.2, 1.7, 0x5a3a22, x, 1.1, z); const gm = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.2), new THREE.MeshBasicMaterial({ map: notes })); gm.position.set(x - s * 0.36, 1.35, z); gm.rotation.y = -s * Math.PI / 2; g.add(gm); });
    sol(x, (cabZ[0] + cabZ[cabZ.length - 1]) / 2, 0.35, (cabZ[cabZ.length - 1] - cabZ[0]) / 2 + 0.85); });
  // KHU CHỜ: ghế đệm xanh, màn hình số, máy lấy số, cây nước, chậu cây
  [cz + 11, cz + 13.5].forEach(z => [-1, 1].forEach(s => { const x = cx + s * 4.5; addBox(g, 3.2, 0.12, 0.7, GR, x, 0.48, z); addBox(g, 3.2, 0.6, 0.12, 0x0a5530, x, 0.82, z + 0.32); [-1.4, 1.4].forEach(d => addBox(g, 0.1, 0.45, 0.6, 0x3f4442, x + d, 0.22, z)); sol(x, z, 1.6, 0.4); }));
  const scr = textPlate("NOW SERVING  ▶ 025", 3.2, 0.9, "#111111", "#69db7c"); scr.position.set(cx, 8.2, Z1 + 0.62); g.add(scr);
  addBox(g, 0.7, 1.5, 0.5, GR, cx - 5.5, 0.75, front - 6); { const t = textPlate("TAKE A NUMBER", 0.65, 0.3, BANK_GREEN, "#ffffff"); t.position.set(cx - 5.5, 1.25, front - 5.74); g.add(t); } sol(cx - 5.5, front - 6, 0.35, 0.25);
  addBox(g, 0.5, 1.1, 0.5, 0xf8f9fa, cx - 8.5, 0.55, front - 5); lc(g, 0.2, 0.2, 0.5, 0x9ad0f5, cx - 8.5, 1.35, front - 5, 10); sol(cx - 8.5, front - 5, 0.25, 0.25);
  [[-6, front - 2], [6, front - 2], [8.5, front - 6]].forEach(([dx, z]) => { pot(g, cx + dx, z, 1.4); sol(cx + dx, z, 0.4, 0.4); });
  // ATM (tường phải, gần cửa)
  [cz + 12, cz + 15, cz + 18].forEach(z => { const x = cx + W / 2 - 0.5; addBox(g, 0.9, 2, 1, 0x495057, x, 1, z); addBox(g, 0.05, 0.5, 0.7, 0x7fd0ff, x - 0.46, 1.5, z); addBox(g, 0.06, 0.3, 1, GR, x - 0.46, 1.9, z);
    const t = textPlate("ATM", 0.6, 0.25, BANK_GREEN, "#ffffff"); t.position.set(x - 0.5, 2.25, z); t.rotation.y = -Math.PI / 2; g.add(t); sol(x, z, 0.45, 0.5); });
  // bảng tiền Verse City (tường trái) + bảng tỷ giá sau quầy đổi tiền
  const money = skin(4, 3, 50, x => { x.fillStyle = BANK_GREEN; x.fillRect(0, 0, 4, 3); signText(x, "VERSE CITY MONEY", 2, 0.35, 3.6, 0.3, "#f2c94c"); x.fillStyle = "#f2c94c"; for (let i = 0; i < 6; i++) { x.beginPath(); x.arc(0.5 + i * 0.6, 1.1, 0.2, 0, 7); x.fill(); }
    ["#7fb685", "#c98d5a", "#8aa1c9", "#d9a3b8"].forEach((c, i) => { x.fillStyle = c; x.fillRect(0.3 + i * 0.9, 1.7, 0.8, 0.45); x.fillStyle = "#ffffff"; x.fillRect(0.3 + i * 0.9, 2.35, 0.8, 0.3); }); });
  { const m = new THREE.Mesh(new THREE.PlaneGeometry(4, 3), new THREE.MeshLambertMaterial({ map: money })); m.position.set(cx - W / 2 + 0.03, 2.4, cz + 15); m.rotation.y = Math.PI / 2; g.add(m); }
  const rate = skin(2.4, 1.6, 60, x => { x.fillStyle = "#111"; x.fillRect(0, 0, 2.4, 1.6); x.fillStyle = BANK_GREEN; x.fillRect(0, 0, 2.4, 0.32); signText(x, "EXCHANGE RATE", 1.2, 0.17, 2.2, 0.2, "#fff");
    [["USD", "25,400"], ["EUR", "27,600"], ["JPY", "168"], ["KRW", "18"]].forEach(([a, b], i) => { x.textAlign = "left"; signText(x, a, 0.45, 0.5 + i * 0.28, 0.6, 0.18, "#ffd43b"); signText(x, b, 1.7, 0.5 + i * 0.28, 1, 0.18, "#69db7c"); }); });
  { const m = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.6), new THREE.MeshBasicMaterial({ map: rate })); m.position.set(cx + 9.5, 2.6, cz - 5); m.rotation.y = -Math.PI / 2; g.add(m); addBox(g, 0.1, 1.8, 0.1, 0x1e1e1e, cx + 9.55, 0.9, cz - 4); addBox(g, 0.1, 1.8, 0.1, 0x1e1e1e, cx + 9.55, 0.9, cz - 6); sol(cx + 9.55, cz - 5, 0.1, 1.2); }
  // PHÒNG KÉT: cửa két tròn, tủ két sắt 2 bên, bàn giám đốc
  const vd = new THREE.Group(); vd.position.set(cx, 2.3, back + 0.35); g.add(vd);
  { const d = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.5, 32), mat(0xadb5bd)); d.rotation.x = Math.PI / 2; vd.add(d);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.15, 8, 32), mat(0x868e96)); vd.add(ring);
    const wh = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.07, 8, 24), mat(0xc9a227)); wh.position.z = 0.4; vd.add(wh);
    [0, 1, 2].forEach(i => { const b = addBox(vd, 1.3, 0.1, 0.1, 0xc9a227, 0, 0, 0.4); b.rotation.z = i * Math.PI / 3; });
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6, bo = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), mat(0x495057)); bo.position.set(Math.cos(a) * 1.7, Math.sin(a) * 1.7, 0.27); vd.add(bo); } }
  sol(cx, back + 0.4, 2.2, 0.45);
  const lock = skin(4, 3, 40, x => { x.fillStyle = "#868e96"; x.fillRect(0, 0, 4, 3); for (let i = 0; i < 8; i++) for (let j = 0; j < 6; j++) { x.fillStyle = "#adb5bd"; x.fillRect(0.06 + i * 0.49, 0.06 + j * 0.49, 0.43, 0.43); x.fillStyle = "#495057"; x.beginPath(); x.arc(0.27 + i * 0.49, 0.27 + j * 0.49, 0.04, 0, 7); x.fill(); } });
  [-1, 1].forEach(s => { const m = new THREE.Mesh(new THREE.PlaneGeometry(4, 3), new THREE.MeshLambertMaterial({ map: lock })); m.position.set(cx + s * 5.5, 1.8, back + 0.05); g.add(m); });
  fur("table_medium", cx - 4, back + 3.4, 0, 1, 0.9, 0.6); fur("chair_B_wood", cx - 4, back + 2.4, 0, 1);
  addBox(g, 0.5, 0.05, 0.35, GR, cx - 4.3, 0.92, back + 3.4); fur("lamp_standing", cx + 4, back + 1.2, 0, 1, 0.35, 0.35);
  g.traverse(o => { if (o.isMesh && o.position.y > 4) o.userData.flat = true; });
  // CHỖ BÀY ĐỒ TỪ VỰNG
  P.anchors = {
    counter: [-4.5, -2.5, 2.5, 4.5].map(dx => [cx + dx, 1.35, cz - 9, cx + dx, cz - 7.6])
      .concat([-1, 1].flatMap(s => [-6.5, -3.5, -1].map(dz => [cx + s * 6, 1.35, cz + dz, cx + s * 4.6, cz + dz]))),
    display: [-1, 1].flatMap(s => cabZ.slice(0, 4).map(z => [cx + s * (W / 2 - 1.05), 1.5, z, cx + s * (W / 2 - 2.4), z])),
    waiting: [[cx - 4.5, 1.05, cz + 11, cx - 4.5, cz + 12.25], [cx + 4.5, 1.05, cz + 13.5, cx + 4.5, cz + 12.25], [cx - 8.5, 1.9, front - 5, cx - 8.5, front - 6.3], [cx + 8.5, 1.9, front - 6, cx + 7.2, front - 6]],
    atm: [cz + 12, cz + 15, cz + 18].map(z => [cx + W / 2 - 1.1, 1.6, z, cx + W / 2 - 2.5, z]),
    vault: [[cx, 2.3, back + 0.9, cx, back + 3], [cx - 5.5, 2.2, back + 0.3, cx - 6.8, back + 2.5], [cx + 5.5, 2.2, back + 0.3, cx + 5.5, back + 2.5]],
    ceiling: [[cx + 7.5, 8.4, Z1 + 0.9, cx + 7.5, cz + 10.2], [cx, 11.5, ZC, cx, cz - 4]],
    wall: [[cx - AX, 2.2, Z1 + 0.95, cx - AX, cz + 9.6], [cx, 7.6, back + 0.3, cx, cz - 7.6], [cx + 9.35, 3.6, cz - 5, cx + 4.6, cz - 5]],
    door: [[cx + 2.25, 1.3, front - 3.5, cx + 3, front - 5], [cx - 3, 1.2, cz + 3.3, cx - 1.8, cz + 3.3]]
  };
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["bankhall"] = {
  furnish: furnishBankHall,
  bright: true
};

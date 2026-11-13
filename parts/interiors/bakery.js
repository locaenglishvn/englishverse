/* EnglishVerse – nội thất "bakery" (layout: "bakery"). Tách khỏi index.html để mỗi nơi 1 file (xem docs/TEAM.md).
   Dùng các hàm chung của index.html (lb, lc, mat, skin, face, textPlate, addBox…) – chúng có sẵn khi nội thất được dựng. */
/* BANH MI BAKERY – tiệm bánh mì Sài Gòn: nhà ống hẹp bên ngoài nhưng bên trong sâu 48 m như quán cà phê.
   3 khu: TRƯỚC (quầy bánh mì + tủ kính nhân bánh, giỏ baguette, bảng giá "đ"), GIỮA (kệ bánh mì, tủ kính bánh ngọt, bàn bánh sinh nhật,
   tủ lạnh nước, góc ngồi), SAU (bếp sau nửa vách: 2 lò lớn, máy nhào bột, xe đẩy khay bánh, bao bột, bồn rửa, đồng hồ hẹn giờ).
   Người bán Anna đứng sau quầy: P.keeperPos = [dx, dz] so với tâm phòng. */
const BAKW = {};
function bakeryWall(len, h, kind) {   // tường vàng ấm: ốp gỗ chân tường, tranh treo; sau = gạch men trắng của bếp; trước = cửa kính + biển
  const k = len + kind; if (BAKW[k]) return BAKW[k];
  const t = skin(len, h, 16, (x, W, H) => {
    x.fillStyle = "#f6d06b"; x.fillRect(0, 0, W, H);
    if (kind === "back") { x.fillStyle = "#f8f8f4"; x.fillRect(0, H - 4.2, W, 4.2); x.strokeStyle = "#c9ccc6"; x.lineWidth = 0.03; for (let i = 0; i < W; i += 0.6) { x.beginPath(); x.moveTo(i, H - 4.2); x.lineTo(i, H); x.stroke(); } for (let j = H - 4.2; j < H; j += 0.3) { x.beginPath(); x.moveTo(0, j); x.lineTo(W, j); x.stroke(); }
      x.fillStyle = "#c0392b"; x.fillRect(0, H - 4.35, W, 0.15); return; }
    x.fillStyle = "#8a5a33"; x.fillRect(0, H - 1.2, W, 1.2); x.fillStyle = "#6f4421"; for (let i = 0; i < W; i += 0.5) x.fillRect(i, H - 1.2, 0.03, 1.2); x.fillStyle = "#c0392b"; x.fillRect(0, H - 1.35, W, 0.15);
    x.fillStyle = "#fff4e0"; x.fillRect(0, H - 1.5, W, 0.15);
    if (kind === "front") {   // cửa kính 2 bên + biển trên cửa
      [W / 2 - 6.6, W / 2 + 2.6].forEach(X => { x.fillStyle = "#5a3a1e"; x.fillRect(X - 0.1, H - 5.1, 4.2, 3.7); x.fillStyle = "#cfe9f5"; x.fillRect(X, H - 5, 4, 3.5); x.fillStyle = "rgba(255,255,255,.5)"; x.beginPath(); x.moveTo(X + 0.4, H - 5); x.lineTo(X + 1.4, H - 5); x.lineTo(X + 0.4, H - 3); x.fill(); x.fillStyle = "#5a3a1e"; x.fillRect(X + 1.95, H - 5, 0.1, 3.5); });
      x.fillStyle = "#c0392b"; x.fillRect(W / 2 - 4, 1.9, 8, 1.2); x.fillStyle = "#ffd43b"; x.fillRect(W / 2 - 3.9, 2.0, 7.8, 0.06); x.fillRect(W / 2 - 3.9, 2.94, 7.8, 0.06); signText(x, "BÁNH MÌ · BÁNH NGỌT", W / 2, 2.5, 7.4, 0.7, "#fff4e0");
    } else {   // tường bên: tranh Sài Gòn xưa + chữ
      for (let X = 3; X < W - 3; X += 7) { x.fillStyle = "#5a3a1e"; x.fillRect(X, 1.4, 2.6, 1.9); x.fillStyle = ["#9ec9e2", "#f2a65a", "#a8d5a2"][Math.floor(X / 7) % 3]; x.fillRect(X + 0.12, 1.52, 2.36, 1.66); x.fillStyle = "#c0392b"; x.fillRect(X + 0.4, 2.2, 0.9, 0.8); x.fillStyle = "#fff4e0"; x.fillRect(X + 1.4, 2.0, 0.8, 1.0); }
      for (let X = 6.5; X < W - 3; X += 14) signText(x, "FRESH EVERY MORNING", X, 4.1, 5, 0.5, "#c0392b");
    }
  });
  return BAKW[k] = new THREE.MeshLambertMaterial({ map: t });
}
function furnishBakery(P, g, cx, cz, W, D, fur) {
  const back = cz - D / 2, front = cz + D / 2, H = (P.size || {}).h || 7, S = P.room.solids;
  const sol = (dx, dz, hw, hd) => S.push({ x: cx + dx, z: cz + dz, hw, hd });
  const X = dx => cx + dx, Z = dz => cz + dz;
  const WOOD = 0x9c6b3e, DARK = 0x6f4e37, RED = 0xc0392b, CREAM = 0xfff1d6, STEEL = 0xced4da, DSTEEL = 0x868e96, BLACK = 0x2f2f2f;
  const glassM = mat(0xd0ebff, { transparent: true, opacity: 0.3, depthWrite: false });
  const box = (w, h, d, c, dx, y, dz) => lb(g, w, h, d, c, X(dx), y, Z(dz));
  const cyl = (rt, rb, h, c, dx, y, dz, seg) => lc(g, rt, rb, h, c, X(dx), y, Z(dz), seg || 12);
  g.children[0].material = (() => {   // sàn gạch bông kem – hoa văn nhỏ
    const t = skin(1, 1, 64, x => { x.fillStyle = "#f1dfb8"; x.fillRect(0, 0, 1, 1); x.strokeStyle = "#d9c08a"; x.lineWidth = 0.03; x.strokeRect(0.015, 0.015, 0.97, 0.97);
      x.fillStyle = "#e3b98c"; x.beginPath(); x.moveTo(0.5, 0.3); x.lineTo(0.7, 0.5); x.lineTo(0.5, 0.7); x.lineTo(0.3, 0.5); x.fill(); x.fillStyle = "#a3bfa5"; x.beginPath(); x.arc(0.5, 0.5, 0.09, 0, 7); x.fill();
      x.fillStyle = "#e8cf98"; [[0.08, 0.08], [0.92, 0.08], [0.08, 0.92], [0.92, 0.92]].forEach(([a, b]) => { x.beginPath(); x.arc(a, b, 0.05, 0, 7); x.fill(); }); });
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(W, D); return new THREE.MeshLambertMaterial({ map: t }); })();
  { const kt = skin(W, 14, 10, (x, Wd, Hh) => { x.fillStyle = "#e9ecef"; x.fillRect(0, 0, Wd, Hh); x.strokeStyle = "#ced4da"; x.lineWidth = 0.04; for (let i = 0; i <= Wd; i += 1) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, Hh); x.stroke(); } for (let j = 0; j <= Hh; j += 1) { x.beginPath(); x.moveTo(0, j); x.lineTo(Wd, j); x.stroke(); } });
    const kf = new THREE.Mesh(new THREE.PlaneGeometry(W, 13), new THREE.MeshLambertMaterial({ map: kt })); kf.rotation.x = -Math.PI / 2; kf.position.set(cx, 0.02, Z(-17.5)); kf.userData.flat = true; g.add(kf); }   // sàn bếp gạch trắng

  // ---------- InstancedMesh cho đồ ăn (3 lần vẽ cho cả tiệm) ----------
  const IB = [], IC = [], IS = [];
  const ib = (dx, y, dz, sx, sy, sz, c, ry) => IB.push([X(dx), y, Z(dz), sx, sy, sz, c, 0, ry || 0, 0]);
  const ic = (dx, y, dz, sx, sy, sz, c, rx, ry, rz) => IC.push([X(dx), y, Z(dz), sx, sy, sz, c, rx || 0, ry || 0, rz || 0]);
  const is = (dx, y, dz, sx, sy, sz, c, ry) => IS.push([X(dx), y, Z(dz), sx, sy, sz, c, 0, ry || 0, 0]);
  const baguette = (dx, y, dz, ry, len) => ic(dx, y, dz, 0.05, len || 0.85, 0.05, 0xd9993d, 0, ry || 0, Math.PI / 2);   // nằm ngang theo hướng ry
  const baguetteUp = (dx, y, dz, tilt) => ic(dx, y, dz, 0.05, 0.9, 0.05, 0xd9993d, tilt || 0, 0, 0);
  const loaf = (dx, y, dz, c) => is(dx, y, dz, 0.2, 0.11, 0.12, c || 0xe0a553);
  const bun = (dx, y, dz) => is(dx, y, dz, 0.11, 0.1, 0.11, 0xfff6e6);
  const croissant = (dx, y, dz, ry) => { is(dx, y, dz, 0.13, 0.06, 0.07, 0xe0a050, ry); is(dx + 0.05, y, dz, 0.08, 0.05, 0.05, 0xc98532, ry); };
  const cake = (dx, y, dz, r, c, top) => { ic(dx, y + 0.07, dz, r, 0.07, r, c); ic(dx, y + 0.16, dz, r * 0.96, 0.025, r * 0.96, top || 0xfff0f5); ic(dx, y + 0.3, dz, r * 0.7, 0.06, r * 0.7, c); is(dx, y + 0.4, dz, 0.04, 0.04, 0.04, 0xd6336c); };
  const cupcake = (dx, y, dz, c) => { ic(dx, y + 0.04, dz, 0.055, 0.04, 0.055, 0xc89b5a); is(dx, y + 0.1, dz, 0.07, 0.05, 0.07, c); };
  const donut = (dx, y, dz, c) => ic(dx, y, dz, 0.1, 0.03, 0.1, c);
  const cookie = (dx, y, dz) => ic(dx, y, dz, 0.07, 0.012, 0.07, 0xb5651d);
  const mooncake = (dx, y, dz) => { ic(dx, y, dz, 0.09, 0.03, 0.09, 0x9a5b22); ic(dx, y + 0.03, dz, 0.05, 0.005, 0.05, 0xf2c94c); };
  const can = (dx, y, dz, c) => ic(dx, y, dz, 0.05, 0.09, 0.05, c);

  // ---------- Tường / lối vào ----------
  const rug = (n, dx, dz, sc) => fur(n, X(dx), Z(dz), 0, sc);

  box(2.4, 0.04, 1.4, RED, 0, 0.025, 23.2);
  [-9, 9].forEach(dx => { cyl(0.4, 0.3, 0.6, 0xb5651d, dx, 0.3, 22.6); sol(dx, 22.6, 0.4, 0.4);   // chậu cây hai bên cửa
    for (let k = 0; k < 6; k++) { const lf = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 1.2), mat(k % 2 ? 0x2b8a3e : 0x37b24d)); lf.position.set(X(dx), 1.1 + k * 0.1, Z(22.6)); lf.rotation.set(0.7, k * 1.05, 0); g.add(lf); } });
  [-7, 7].forEach(dx => { const y = 4.3; lb(g, 0.02, H - y, 0.02, BLACK, X(dx), (H + y) / 2, Z(22)); const lt = new THREE.Mesh(new THREE.SphereGeometry(0.4, 10, 8), mat(RED)); lt.position.set(X(dx), y, Z(22)); lt.scale.y = 1.25; g.add(lt);   // lồng đèn đỏ
    lb(g, 0.3, 0.06, 0.3, 0xf2c94c, X(dx), y + 0.5, Z(22)); });

  // ---------- KHU TRƯỚC: quầy bánh mì ----------
  const CX0 = -4, CZ = 11;   // tâm quầy
  box(11.2, 1.0, 1.3, WOOD, CX0, 0.5, CZ); box(11.4, 0.1, 1.5, CREAM, CX0, 1.05, CZ); sol(CX0, CZ, 5.7, 0.75);
  box(11, 0.7, 0.04, RED, CX0, 0.55, CZ + 0.66); box(11, 0.06, 0.05, 0xf2c94c, CX0, 0.92, CZ + 0.67);
  const sg = textPlate("BÁNH MÌ NÓNG GIÒN", 4.2, 0.55, "#c0392b", "#fff4e0"); sg.position.set(X(-6.9), 0.55, Z(CZ + 0.7)); g.add(sg);
  // xe kính bánh mì: 6 khay nhân
  box(4.6, 0.35, 0.95, STEEL, -6.8, 1.28, CZ - 0.1); box(4.7, 0.05, 1.05, DSTEEL, -6.8, 1.1, CZ - 0.1);
  [0xb5651d, 0xf3c6c6, 0x74b816, 0xff922b, 0x2b8a3e, 0xe03131].forEach((c, i) => { const px = -8.65 + i * 0.7; box(0.62, 0.1, 0.62, DSTEEL, px, 1.5, CZ - 0.1); box(0.52, 0.1, 0.52, c, px, 1.54, CZ - 0.1); });
  box(4.6, 0.55, 0.03, 0xd0ebff, -6.8, 1.9, CZ + 0.38).material = glassM; box(4.6, 0.03, 0.9, 0xd0ebff, -6.8, 2.17, CZ - 0.1).material = glassM;
  box(4.6, 0.55, 0.03, 0xd0ebff, -6.8, 1.9, CZ - 0.55).material = glassM;
  [-9.1, -4.5].forEach(dx => box(0.05, 0.6, 0.95, 0xd0ebff, dx, 1.9, CZ - 0.1).material = glassM);
  // trên quầy: máy tính tiền, giỏ baguette, bánh mì gói giấy, đèn sưởi
  box(0.6, 0.3, 0.45, 0x495057, 0.8, 1.25, CZ); box(0.5, 0.2, 0.05, 0x74c0fc, 0.8, 1.45, CZ - 0.12);
  cyl(0.4, 0.3, 0.45, 0xc08a4a, -2.5, 1.33, CZ - 0.1); for (let i = 0; i < 6; i++) baguetteUp(-2.7 + (i % 3) * 0.2, 1.8, CZ - 0.1 + (i < 3 ? 0.08 : -0.1), (i - 2.5) * 0.08);
  for (let i = 0; i < 4; i++) { ib(-1.4 + i * 0.01, 1.14 + i * 0.07, CZ + 0.05, 0.5, 0.06, 0.18, i % 2 ? 0xf5deb3 : 0xe8c690); }
  // bảng giá treo tường phải
  { const mn = skin(5.6, 2.8, 56, (x, Wd, Hh) => { x.fillStyle = "#3b2a1a"; x.fillRect(0, 0, Wd, Hh); x.strokeStyle = "#e6a23c"; x.lineWidth = 0.1; x.strokeRect(0.08, 0.08, Wd - 0.16, Hh - 0.16);
      x.fillStyle = "#ffd43b"; x.textAlign = "center"; x.font = "bold 0.4px system-ui"; x.fillText("BÁNH MÌ MENU", Wd / 2, 0.55); x.textAlign = "left"; x.font = "0.25px system-ui"; x.fillStyle = "#fff4e0";
      [["Bánh mì thịt – Pork banh mi", "25.000đ"], ["Bánh mì pâté – Pâté banh mi", "20.000đ"], ["Bánh mì chả lụa – Pork roll", "22.000đ"], ["Bánh mì trứng – Egg banh mi", "18.000đ"], ["Bánh mì đặc biệt – Special", "35.000đ"], ["Nước cam – Orange juice", "15.000đ"]].forEach(([n, pr], i) => { x.textAlign = "left"; x.fillText(n, 0.3, 1.05 + i * 0.28); x.textAlign = "right"; x.fillText(pr, Wd - 0.3, 1.05 + i * 0.28); }); });
    face(g, mn, 5.6, 2.8, cx + W / 2 - 0.05, 3.6, Z(15.5), -Math.PI / 2); }
  { const cks = skin(4.4, 2.4, 56, (x, Wd, Hh) => { x.fillStyle = "#fff4e0"; x.fillRect(0, 0, Wd, Hh); x.strokeStyle = "#c0392b"; x.lineWidth = 0.08; x.strokeRect(0.08, 0.08, Wd - 0.16, Hh - 0.16);
      x.textAlign = "center"; x.fillStyle = "#c0392b"; x.font = "bold 0.4px system-ui"; x.fillText("CÁCH GỌI BÁNH MÌ", Wd / 2, 0.55); x.font = "0.27px system-ui"; x.fillStyle = "#3b2a1a";
      ["1. Pick your filling", "2. No chilli? Say it!", "3. Pay and enjoy!"].forEach((s, i) => x.fillText(s, Wd / 2, 1.1 + i * 0.4)); });
    face(g, cks, 4.4, 2.4, cx - W / 2 + 0.05, 3.7, Z(17.5), Math.PI / 2); }
  // giỏ baguette dọc tường trái (cạnh cửa)
  for (let i = 0; i < 4; i++) { const dz = 14.5 + i * 2.2; cyl(0.4, 0.32, 0.9, 0xc08a4a, -9.3, 0.45, dz); sol(-9.3, dz, 0.42, 0.42); for (let k = 0; k < 7; k++) baguetteUp(-9.3 + ((k % 3) - 1) * 0.14, 1.25, dz + (Math.floor(k / 3) - 0.8) * 0.16, ((k % 3) - 1) * 0.1); }
  cyl(0.45, 0.35, 1.0, 0xc08a4a, 3.4, 0.5, CZ); sol(3.4, CZ, 0.45, 0.45); for (let k = 0; k < 8; k++) baguetteUp(3.4 + ((k % 3) - 1) * 0.15, 1.35, CZ + (Math.floor(k / 3) - 0.8) * 0.17, ((k % 3) - 1) * 0.1);
  box(0.7, 0.5, 3.2, WOOD, 9.4, 0.25, 20); box(0.12, 0.55, 3.2, DARK, 9.75, 0.8, 20); sol(9.4, 20, 0.4, 1.6); [19.2, 20.8].forEach(dz => { cyl(0.2, 0.2, 0.1, RED, 9.3, 0.55, dz); });   // ghế dài chờ

  // ---------- KHU GIỮA ----------
  // kệ bánh mì dọc tường trái: 4 tầng
  { const sx = -9.65; box(0.7, 0.08, 13.6, DARK, sx, 0.08, 0.6); [0.65, 1.25, 1.85, 2.45].forEach(y => box(0.65, 0.07, 13.4, WOOD, sx, y, 0.6)); [-6, -2, 2, 6, 7.3].forEach(dz => box(0.1, 2.55, 0.65, DARK, -9.4, 1.3, dz)); box(0.08, 2.6, 13.6, DARK, -9.95, 1.3, 0.6); sol(-9.6, 0.6, 0.45, 6.8);
    for (let i = 0; i < 17; i++) { const dz = -5.8 + i * 0.78; baguette(-9.55, 0.76, dz, 0, 0.55); loaf(-9.55, 1.37, dz, i % 2 ? 0xe0a553 : 0xc98532); if (i % 3 !== 2) bun(-9.55, 1.98, dz); croissant(-9.55, 2.55, dz + 0.1, 1.57); }
    for (let i = 0; i < 6; i++) box(0.3, 0.22, 0.4, 0xf2c94c, -9.5, 1.38, -5.5 + i * 2.4 + 0.5).material = mat(0xffe8a3);
    const sh = textPlate("🥖 FRESH BREAD", 3.6, 0.55, "#c0392b", "#fff4e0"); sh.rotation.y = Math.PI / 2; sh.position.set(X(-9.55), 3.25, Z(0.6)); g.add(sh); }
  // 2 tủ kính trưng bày bánh ngọt (đảo)
  [[-4.5, 3.8, 5.6], [-4.5, -4.8, 5.6]].forEach(([dx, dz, len], n) => {
    box(1.4, 0.8, len, WOOD, dx, 0.4, dz); box(1.5, 0.06, len + 0.1, CREAM, dx, 0.83, dz); sol(dx, dz, 0.75, len / 2 + 0.05);
    box(1.4, 0.7, len, 0xd0ebff, dx, 1.2, dz).material = glassM;
    [-0.7, 0.7].forEach(s => box(0.05, 0.75, len, STEEL, dx + s, 1.2, dz)); [-1, 1].forEach(s => box(1.45, 0.75, 0.05, STEEL, dx, 1.2, dz + s * len / 2));
    box(1.25, 0.04, len - 0.2, 0xfff1d6, dx, 0.88, dz); box(1.2, 0.04, len - 0.3, 0xffe8a3, dx, 1.2, dz);   // đáy và khay giữa
    for (let i = 0; i < 6; i++) { const z = dz - len / 2 + 0.45 + i * (len - 0.9) / 5;
      if (n === 0) { cake(dx - 0.28, 0.9, z, 0.2, [0xffc9de, 0xfff0b3, 0xc3a6ff, 0xffd6a5, 0xb2f2bb, 0xffc9de][i]); cupcake(dx + 0.3, 1.22, z, i % 2 ? 0xff8fab : 0xfff0b3); donut(dx + 0.3, 0.92, z, [0xff8fab, 0x8d6e4e, 0xffd43b][i % 3]); donut(dx + 0.3, 0.96, z, 0xffffff); is(dx + 0.3, 0.95, z, 0.02, 0.02, 0.02, 0xd6336c); cupcake(dx - 0.28, 1.22, z + 0.1, 0xffe066); }
      else { cookie(dx - 0.3, 0.9, z); cookie(dx - 0.3, 0.92, z + 0.12); mooncake(dx + 0.3, 0.92, z); mooncake(dx + 0.3, 1.24, z + 0.1); croissant(dx - 0.28, 1.25, z, 0); donut(dx, 0.92, z, i % 2 ? 0xffd43b : 0xff8fab); loaf(dx - 0.2, 0.96, z + 0.15, 0xd9993d); } }
  });
  { const sg2 = textPlate("🎂 BÁNH NGỌT – CAKES", 3.4, 0.5, "#e64980", "#ffffff"); sg2.position.set(X(-4.5), 2.2, Z(0.5)); g.add(sg2); lb(g, 0.03, 2.2, 0.03, BLACK, X(-5.9), 1.1, Z(0.5)); lb(g, 0.03, 2.2, 0.03, BLACK, X(-3.1), 1.1, Z(0.5)); }
  // bàn trưng bày bánh sinh nhật + mâm bánh có nắp thủy tinh
  { const tx = 2.6, tz = 5.8;
    cyl(0.95, 0.95, 0.06, CREAM, tx, 0.9, tz, 20); cyl(0.12, 0.2, 0.9, WOOD, tx, 0.45, tz); cyl(0.5, 0.5, 0.05, WOOD, tx, 0.03, tz, 16); sol(tx, tz, 0.95, 0.95);
    cyl(0.4, 0.3, 0.5, WOOD, tx, 0.65, tz, 14); cake(tx, 0.92, tz, 0.4, 0xffc9de, 0xffffff); cake(tx + 0.9 - 0.9, 0.92, tz, 0.4, 0xffc9de);
    cake(tx - 0.62, 0.92, tz + 0.1, 0.25, 0xfff0b3); cake(tx + 0.62, 0.92, tz - 0.1, 0.25, 0xc3a6ff);
    cyl(0.22, 0.22, 0.02, DSTEEL, tx, 1.35, tz, 10);
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ic(tx + Math.cos(a) * 0.8, 1.0, tz + Math.sin(a) * 0.1 * 0, 0.01, 0.01, 0.01, 0xfff0f5); }
    const dm = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 8, 0, 7, 0, Math.PI / 2), glassM); dm.position.set(X(tx), 1.0, Z(tz)); dm.userData.flat = false; g.add(dm);
    for (let i = 0; i < 5; i++) { const lc2 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.14, 4), mat(i % 2 ? 0xff6b6b : 0x4dabf7)); lc2.position.set(X(tx - 0.08 + i * 0.04), 1.62, Z(tz)); g.add(lc2); } }
  // tủ lạnh nước dọc tường phải
  { const fx = 9.55, fz = 6.5; box(0.9, 2.3, 4, 0xf1f3f5, fx, 1.15, fz); sol(fx, fz, 0.5, 2.0);
    box(0.06, 2.0, 3.8, 0x74c0fc, fx - 0.47, 1.15, fz).material = mat(0x91d5ff, { transparent: true, opacity: 0.45, depthWrite: false });
    [0.45, 1.05, 1.65].forEach(y => { box(0.7, 0.04, 3.8, STEEL, fx - 0.1, y, fz); for (let i = 0; i < 12; i++) { can(fx - 0.1, y + 0.08, fz - 1.75 + i * 0.32, [0xff922b, 0xffffff, 0xe03131, 0x4dabf7][i % 4]); can(fx - 0.3, y + 0.08, fz - 1.75 + i * 0.32, [0xffffff, 0x4dabf7, 0xff922b][i % 3]); } });
    box(0.05, 2.0, 0.06, STEEL, fx - 0.49, 1.15, fz); box(0.8, 0.12, 4, RED, fx, 2.36, fz);
    const ft = textPlate("🥤 DRINKS · NƯỚC", 2.6, 0.4, "#c0392b", "#fff4e0"); ft.rotation.y = -Math.PI / 2; ft.position.set(X(fx - 0.5), 2.4, Z(fz)); g.add(ft); }
  // góc ngồi: 3 bàn tròn + ghế đẩu đỏ
  [1.8, -2, -5.8].forEach((dz, n) => { const tx = 7.2; cyl(0.55, 0.55, 0.05, n % 2 ? 0xfff1d6 : 0xe9c99a, tx, 0.78, dz, 16); cyl(0.07, 0.12, 0.78, DARK, tx, 0.39, dz); cyl(0.3, 0.3, 0.04, DARK, tx, 0.02, dz); sol(tx, dz, 0.55, 0.55);
    [-1, 1].forEach(s => { cyl(0.22, 0.22, 0.06, RED, tx, 0.5, dz + s * 0.85); cyl(0.04, 0.12, 0.5, BLACK, tx, 0.25, dz + s * 0.85); sol(tx, dz + s * 0.85, 0.24, 0.24); });
    cyl(0.12, 0.12, 0.18, 0xe9ecef, tx + 0.15, 0.9, dz + 0.1); cyl(0.07, 0.07, 0.14, 0xffffff, tx - 0.2, 0.86, dz - 0.15);   // lọ tăm / ly
    cyl(0.4, 0.4, 0.01, 0xfff4e0, tx, 0.81, dz); });
  { const bs = textPlate("☕ CHỖ NGỒI · SEATS", 3, 0.45, "#6f4e37", "#ffe8a3"); bs.rotation.y = -Math.PI / 2; bs.position.set(X(W / 2 - 0.06), 3.0, Z(-2)); g.add(bs); }
  // ---------- KHU SAU: BẾP (nửa vách) ----------
  [0, 1].forEach(i => { const x0 = (i ? 1.8 : -10), x1 = (i ? 10 : -1.8); box(x1 - x0, 1.1, 0.3, WOOD, (x0 + x1) / 2, 0.55, -11); box(x1 - x0 + 0.1, 0.06, 0.4, CREAM, (x0 + x1) / 2, 1.13, -11); sol((x0 + x1) / 2, -11, (x1 - x0) / 2, 0.2); });
  [-1.8, 1.8].forEach(dx => box(0.14, 3.3, 0.14, DARK, dx, 1.65, -11));
  const kp = textPlate("🍞 LÒ BÁNH · KITCHEN", 3.2, 0.5, "#6f4e37", "#ffe8a3"); kp.position.set(X(0), 3.15, Z(-10.9)); g.add(kp);
  [-7.8, -5.4, -3.2, 3.2, 5.4, 7.8].forEach(dx => box(0.08, 0.7, 0.08, DARK, dx, 1.5, -11));   // song cửa sổ (khung)
    // 2 lò lớn sát tường sau + mũ hút
  [-6.5, 6.5].forEach(dx => { const oz = -23.1; box(3.4, 2.2, 1.5, STEEL, dx, 1.1, oz); sol(dx, oz, 1.7, 0.75); box(3.5, 0.1, 1.6, DSTEEL, dx, 2.25, oz);
    [0.45, 1.1, 1.75].forEach(y => { box(2.9, 0.5, 0.04, BLACK, dx, y, oz + 0.76); box(2.5, 0.38, 0.04, 0xff922b, dx, y, oz + 0.78).material = new THREE.MeshBasicMaterial({ color: 0xffa94d }); box(2.9, 0.05, 0.06, DSTEEL, dx, y + 0.3, oz + 0.8); });
    [-1.3, -0.9, 0.9, 1.3].forEach(k => cyl(0.06, 0.06, 0.06, RED, dx + k, 2.0, oz + 0.78, 8).rotation.x = Math.PI / 2);
    box(3.6, 0.5, 1.6, DSTEEL, dx, 4.1, oz); box(1.2, H - 4.35, 1.0, DSTEEL, dx, 4.35 + (H - 4.35) / 2, oz); });
  fur("shelf_B_large_decorated", X(0), Z(-23.35), 0, 1.2, 1.4, 0.5);
  { const clk = new THREE.Mesh(new THREE.CircleGeometry(0.55, 24), new THREE.MeshBasicMaterial({ color: 0xffffff })); clk.position.set(X(0), 4.8, Z(-23.9)); g.add(clk);
    cyl(0.6, 0.6, 0.04, RED, 0, 4.8, -23.92, 24).rotation.x = Math.PI / 2; lb(g, 0.04, 0.38, 0.02, BLACK, X(0), 4.92, Z(-23.88)); lb(g, 0.28, 0.04, 0.02, BLACK, X(0.1), 4.8, Z(-23.88)); }
  // máy nhào bột
  { const mx = -3.3, mz = -15.5; box(1.0, 0.9, 0.9, DSTEEL, mx, 0.45, mz); cyl(0.5, 0.42, 0.55, STEEL, mx, 1.15, mz, 16); box(0.2, 0.9, 0.3, DSTEEL, mx, 1.45, mz - 0.5); box(0.15, 0.15, 0.8, DSTEEL, mx, 1.95, mz - 0.1); cyl(0.04, 0.04, 0.6, DSTEEL, mx, 1.6, mz, 6); sol(mx, mz, 0.55, 0.5); is(mx, 1.3, mz, 0.3, 0.12, 0.3, 0xfff1d6); }
  // bàn thép làm bánh: cán bột, nắm bột, đồng hồ hẹn giờ
  { const tx = 3, tz = -15.5; box(3.2, 0.9, 1.4, DSTEEL, tx, 0.45, tz); box(3.3, 0.06, 1.5, STEEL, tx, 0.93, tz); box(3.0, 0.08, 1.2, STEEL, tx, 0.3, tz); sol(tx, tz, 1.65, 0.75);
    ic(tx - 1.0, 1.0, tz + 0.2, 0.03, 0.5, 0.03, 0xe0b479, 0, 0, Math.PI / 2); ic(tx - 0.8, 1.0, tz - 0.3, 0.03, 0.5, 0.03, 0xe0b479, 0, 0.4, Math.PI / 2);
    for (let i = 0; i < 5; i++) is(tx - 0.2 + i * 0.25, 1.05, tz - 0.1 + (i % 2) * 0.25, 0.12, 0.08, 0.12, 0xfff3dc);
    cyl(0.1, 0.1, 0.1, RED, tx + 1.2, 1.01, tz + 0.1, 12); box(0.2, 0.02, 0.2, 0xffffff, tx + 1.2, 1.07, tz + 0.1); }
  // xe đẩy khay bánh 2 chiếc (cạnh tường trái và phải)
  [[-8.4, -14.8], [8.6, -13.8]].forEach(([rx, rz]) => { [[-0.4, -0.35], [0.4, -0.35], [-0.4, 0.35], [0.4, 0.35]].forEach(([a, b]) => box(0.05, 2.3, 0.05, DSTEEL, rx + a, 1.15, rz + b));
    for (let y = 0.4, k = 0; y < 2.2; y += 0.38, k++) { box(0.95, 0.03, 0.75, STEEL, rx, y, rz); for (let i = 0; i < 4; i++) { baguette(rx - 0.25 + i * 0.17, y + 0.06, rz, Math.PI / 2, 0.6); } if (k % 2) for (let i = 0; i < 3; i++) loaf(rx - 0.3 + i * 0.3, y + 0.08, rz + 0.18); }
    [[-0.4, 0.35], [0.4, 0.35], [-0.4, -0.35], [0.4, -0.35]].forEach(([a, b]) => cyl(0.05, 0.05, 0.06, BLACK, rx + a, 0.04, rz + b, 8)); sol(rx, rz, 0.55, 0.45); });
  // bao bột
  [[-9.2, -19.6], [-9.2, -20.8], [-8.4, -20.2]].forEach(([a, b], i) => { ib(a, 0.22, b, 0.7, 0.45, 0.45, 0xf3ead2); ib(a, 0.62, b + 0.02, 0.65, 0.4, 0.42, 0xfaf3e0, 0.2); if (i < 2) ib(a, 1.0, b, 0.6, 0.36, 0.4, 0xf3ead2, -0.15); });
  sol(-8.9, -20.3, 1.1, 1.3);
  // bồn rửa inox bên phải + vòi
  { const sx = 9.2, sz = -18.5; box(1.2, 0.9, 2.6, DSTEEL, sx, 0.45, sz); box(1.3, 0.06, 2.7, STEEL, sx, 0.93, sz); box(0.8, 0.02, 1.0, 0x495057, sx, 0.97, sz - 0.6); box(0.8, 0.02, 1.0, 0x495057, sx, 0.97, sz + 0.65); cyl(0.04, 0.04, 0.5, STEEL, sx + 0.3, 1.2, sz, 6); box(0.25, 0.04, 0.04, STEEL, sx + 0.18, 1.45, sz); sol(sx, sz, 0.65, 1.35);
    box(0.06, 0.6, 2.6, 0xf8f9fa, 9.95, 1.7, sz).material = mat(0xe9ecef); [0, 1].forEach(i => lc(g, 0.05, 0.05, 0.3, 0x495057, X(9.8), 2.2, Z(-21 + i * 0.35), 6)); }
  // tạp dề treo tường
  box(0.04, 0.8, 0.5, 0xffffff, 9.95, 1.9, -21.2); box(0.05, 0.2, 0.5, RED, 9.94, 2.2, -21.2);
  [-6, -2, 2, 6].forEach(dx => box(2.0, 0.08, 0.08, 0xfffbe6, dx, H - 0.25, -17).material = new THREE.MeshBasicMaterial({ color: 0xfffbe6 }));   // đèn tuýp bếp

  // ---------- đèn thả ----------
  const bulbM = new THREE.MeshBasicMaterial({ color: 0xffe8a3 });
  for (let dz = 21; dz >= -7; dz -= 4.7) [-6, 0, 6].forEach((dx, i) => { const y = 4.4 - ((i + Math.round(dz)) % 2) * 0.35; lb(g, 0.015, H - y, 0.015, BLACK, X(dx), (H + y) / 2, Z(dz));
    const sh = lc(g, 0.07, 0.38, 0.32, (i + Math.round(dz)) % 2 ? RED : 0xf2c94c, X(dx), y - 0.1, Z(dz), 14); sh.material = mat((i + Math.round(dz)) % 2 ? RED : 0xf2c94c, { side: THREE.DoubleSide });
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), bulbM); b.position.set(X(dx), y - 0.28, Z(dz)); g.add(b); });
  // ---------- tên khu ----------
  const pl = textPlate("🥖 BÁNH MÌ – BREAD & CAKES", 5, 0.6, "#c0392b", "#fff4e0"); pl.position.set(X(0), H - 1.6, Z(-10.7)); pl.userData.flat = true; g.add(pl);
  [["🥖 BAGUETTE BASKETS", -9.9, 18.3, Math.PI / 2, 3.2]].forEach(([t, dx, dz, ry, w]) => { const p = textPlate(t, w, 0.45, "#8a5a33", "#ffe8a3"); p.rotation.y = ry; p.position.set(X(dx + 0.05), 2.4, Z(dz)); g.add(p); });
  g.traverse(o => { if (o.isMesh && o.position.y > 2.6) o.userData.flat = true; });   // mái, đèn thả, bảng trên cao: không đổ bóng

  // ---------- gộp đồ ăn thành InstancedMesh ----------
  const dum = new THREE.Object3D(), col = new THREE.Color(), im = (geo, list) => { if (!list.length) return; const m = new THREE.InstancedMesh(geo, new THREE.MeshLambertMaterial({ color: 0xffffff }), list.length);
    list.forEach((p, i) => { dum.position.set(p[0], p[1], p[2]); dum.scale.set(p[3], p[4], p[5]); dum.rotation.set(p[7], p[8], p[9], "YXZ"); dum.updateMatrix(); m.setMatrixAt(i, dum.matrix); m.setColorAt(i, col.set(p[6])); });
    m.frustumCulled = false; m.userData.flat = true; g.add(m); };
  im(new THREE.BoxGeometry(1, 1, 1), IB); im(new THREE.CylinderGeometry(1, 1, 1, 10), IC); im(new THREE.SphereGeometry(1, 8, 6), IS);

  // ---------- người bán + chỗ bày từ vựng ----------
  P.keeperPos = [-2.6, 9.6];   // sau quầy bánh mì
  P.zones = null;
  const row = (n, x0, x1, y, z, sz) => Array.from({ length: n }, (_, i) => { const x = n > 1 ? x0 + (x1 - x0) * i / (n - 1) : (x0 + x1) / 2; return [X(x), y, Z(z), X(x), Z(sz)]; });
  const col2 = (n, x, y, z0, z1, sx) => Array.from({ length: n }, (_, i) => { const z = n > 1 ? z0 + (z1 - z0) * i / (n - 1) : (z0 + z1) / 2; return [X(x), y, Z(z), X(sx), Z(z)]; });
  P.anchors = {
    counter: row(6, -8.65, -5.15, 1.62, CZ - 0.1, CZ + 1.5).concat(row(5, -3.7, 0.2, 1.17, CZ, CZ + 1.5)),
    shelf: [[-4, 1.34], [-1.4, 1.95], [1.2, 1.34], [3.8, 1.95], [6.2, 1.34], [-5.6, 1.95]].map(([dz, y]) => [X(-9.2), y, Z(dz), X(-8), Z(dz)]),
    cases: col2(3, -4.5, 1.62, 2, 5.6, -3.1).concat(col2(3, -4.5, 1.62, -6.4, -3.2, -3.1)).concat([[X(2.6), 1.45, Z(5.8), X(1.3), Z(5.8)]]),
    fridge: col2(4, 9.1, 2.1, 5, 8, 7.8),
    seats: [1.8, -2, -5.8].map(dz => [X(7.2), 0.88, Z(dz), X(5.6), Z(dz)]),
    kitchen: [[-6.5, 2.45, -22.3, -6.5, -20.8], [6.5, 2.45, -22.3, 6.5, -20.8], [-3.3, 1.95, -15.5, -3.3, -13.6], [2.2, 1.12, -15.5, 2.2, -13.6], [3.2, 1.12, -15.8, 3.2, -13.6], [4.2, 1.12, -15.5, 4.2, -13.6],
      [-9.2, 1.0, -19.8, -7.9, -19.8], [-8.4, 2.4, -14.8, -7.0, -14.8], [-8.4, 1.6, -14.8, -7.0, -14.2], [9.2, 1.4, -18.5, 7.8, -18.5], [9.6, 2.5, -21.2, 8, -21.2], [-9.2, 1.9, -20.8, -7.9, -21.2]].map(a => [X(a[0]), a[1], Z(a[2]), X(a[3]), Z(a[4])])
  };
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["bakery"] = {
  furnish: furnishBakery,
  wall: (len, h, w) => bakeryWall(len, h, w.z < 0 ? "back" : w.z > 0 ? "front" : "side")
};

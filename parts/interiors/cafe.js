/* EnglishVerse – nội thất "cafe" (layout: "greenhouse"). Tách khỏi index.html để mỗi nơi 1 file (xem docs/TEAM.md).
   Dùng các hàm chung của index.html (lb, lc, mat, skin, face, textPlate, addBox…) – chúng có sẵn khi nội thất được dựng. */
/* CAFE SUA DA – nội thất kiểu nhà kính (theo ảnh): tường + mái kính khung thép đen, sàn xi măng, cây treo, bóng đèn dây,
   quầy bar gỗ dọc cửa kính với ghế cao, góc sofa, góc cây cảnh + bình thủy sinh, quầy pha chế ở cuối quán.
   3 khu: trước (góc cây – The Green Corner), giữa (chỗ ngồi), sau (quầy pha chế). */
const GW = {};
function glassWall(len, h, back) {   // tường kính khung đen; tường sau là tường gạch tối có kệ
  const k = len + "x" + h + back; if (GW[k]) return GW[k];
  const t = skin(len, h, 24, (x, W, H) => {
    if (back) { x.fillStyle = "#3b3b3b"; x.fillRect(0, 0, W, H); x.fillStyle = "#454545"; for (let j = 0; j < H; j += 0.3) for (let i = (j / 0.3) % 2 * 0.4; i < W; i += 0.8) x.fillRect(i, j, 0.75, 0.26); return; }
    x.fillStyle = "#cfe6d3"; x.fillRect(0, 0, W, H); x.fillStyle = "#a9d39a"; for (let i = 0; i < W; i += 2.3) { x.beginPath(); x.arc(i + 1, H * 0.55, 1.2, 0, 7); x.fill(); }   // cây xanh ngoài kính
    x.fillStyle = "#2f2f2f"; x.fillRect(0, H - 0.7, W, 0.7); for (let i = 0; i <= W; i += 1.2) x.fillRect(i - 0.05, 0, 0.1, H - 0.7); for (let j = 0; j < H - 0.7; j += 1) x.fillRect(0, j, W, 0.07); });
  return GW[k] = new THREE.MeshLambertMaterial({ map: t });
}
function furnishGreenhouse(P, g, cx, cz, W, D, fur) {
  const back = cz - D / 2, front = cz + D / 2, H = (P.size || {}).h || 5.5, S = P.room.solids;
  const wood = 0x9c6b3e, black = 0x2f2f2f, sol = (x, z, hw, hd) => S.push({ x, z, hw, hd });
  const fl = g.children[0]; fl.material = new THREE.MeshLambertMaterial({ color: 0xb5b3ad });   // sàn xi măng
  // mái kính: kèo thép đen
  for (let z = back; z <= front + 0.01; z += 3) addBox(g, W, 0.15, 0.15, black, cx, H, z);
  for (let x = -W / 2; x <= W / 2 + 0.01; x += 4) addBox(g, 0.12, 0.12, D, black, cx + x, H + 0.05, cz);
  // ===== Khu sau: QUẦY PHA CHẾ =====
  const cz0 = back + 9;
  addBox(g, 13, 1.05, 1.2, wood, cx, 0.52, cz0); addBox(g, 13.2, 0.08, 1.4, 0xdee2e6, cx, 1.08, cz0); sol(cx, cz0, 6.5, 0.6);
  addBox(g, 1, 0.75, 0.7, 0x868e96, cx - 2.2, 1.5, cz0 - 0.2); addBox(g, 0.9, 0.2, 0.2, 0x343a40, cx - 2.2, 1.35, cz0 + 0.2);   // máy pha espresso
  const gr = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.22, 0.6, 12), new THREE.MeshLambertMaterial({ color: 0x343a40 })); gr.position.set(cx - 0.9, 1.42, cz0 - 0.2); g.add(gr);   // máy xay
  const case_ = new THREE.Mesh(new THREE.BoxGeometry(2, 0.7, 0.9), new THREE.MeshLambertMaterial({ color: 0xd0ebff, transparent: true, opacity: 0.45 })); case_.position.set(cx + 3.4, 1.47, cz0); g.add(case_);   // tủ bánh kính
  addBox(g, 0.6, 0.3, 0.4, 0x495057, cx + 5.4, 1.27, cz0);   // máy tính tiền
  for (let i = 0; i < 4; i++) addBox(g, 0.22, 0.24, 0.22, 0xffffff, cx - 4.8 + i * 0.3, 1.24 + (i % 2) * 0.0, cz0 - 0.25);   // chồng ly
  [-4.5, 4.5].forEach(dx => fur("shelf_B_large_decorated", cx + dx, back + 0.5, 0, 1.2, 1.4, 0.5));   // kệ tường sau
  const menu = skin(4, 2.4, 60, (x, Wd, Hh) => { x.fillStyle = "#1e2b23"; x.fillRect(0, 0, Wd, Hh); x.strokeStyle = "#8d5a2b"; x.lineWidth = 0.1; x.strokeRect(0.05, 0.05, Wd - 0.1, Hh - 0.1);
    x.fillStyle = "#ffe8a3"; x.font = "bold 0.3px system-ui"; x.textAlign = "center"; x.fillText("MENU", Wd / 2, 0.4); x.textAlign = "left"; x.font = "0.2px system-ui"; x.fillStyle = "#f1f3f5";
    [["Ca phe sua da – Iced milk coffee", "25k"], ["Ca phe den – Black coffee", "20k"], ["Bac xiu – White coffee", "28k"], ["Tra sua – Milk tea", "30k"], ["Tra xanh – Green tea", "22k"], ["Banh – Cakes", "35k"]].forEach(([n, pr], i) => { x.fillText(n, 0.25, 0.75 + i * 0.27); x.fillText(pr, Wd - 0.6, 0.75 + i * 0.27); }); });
  [-1.2, 2.8].forEach((dx, i) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(i ? 3 : 4, 2.4), new THREE.MeshLambertMaterial({ map: menu })); m.position.set(cx + dx - (i ? 0 : 0), 3.2, back + 0.06); g.add(m); });
  [-8, -7.2].forEach((dx, i) => { addBox(g, 0.7, 0.8, 0.6, 0x8d6e4e, cx + dx, 0.4, back + 1 + i * 0.8); }); sol(cx - 7.6, back + 1.4, 0.8, 0.8);   // bao cà phê
  // ===== Khu giữa: CHỖ NGỒI =====
  [-1, 1].forEach(s => {   // quầy bar gỗ dọc cửa kính + ghế cao
    const bx = cx + s * (W / 2 - 0.45);
    addBox(g, 0.7, 0.08, 20, wood, bx, 1.05, cz + 1); for (let z = -8; z <= 10; z += 3) addBox(g, 0.06, 1.05, 0.06, black, bx, 0.52, cz + 1 + z);
    sol(bx, cz + 1, 0.35, 10);
    for (let z = -8; z <= 10.1; z += 1.8) { const sx = cx + s * (W / 2 - 1.5), sz = cz + 1 + z;
      const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.08, 12), new THREE.MeshLambertMaterial({ color: wood })); seat.position.set(sx, 0.75, sz); g.add(seat);
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.12, 0.72, 6), new THREE.MeshLambertMaterial({ color: black })); leg.position.set(sx, 0.36, sz); g.add(leg); }
  });
  [[-3.5, -7, 0], [3.5, -1.5, 0], [-3.5, 4.5, 0]].forEach(([dx, dz]) => {   // 3 góc sofa
    fur("couch_pillows", cx + dx, cz + dz - 1.6, 0, 1, 1.4, 0.6); fur("table_medium", cx + dx, cz + dz, 0, 0.9, 0.8, 0.6); fur("armchair_pillows", cx + dx, cz + dz + 1.6, Math.PI, 1, 0.7, 0.6);
    fur("rug_oval_A", cx + dx, cz + dz, 0, 1.2); });
  // cây treo + bóng đèn dây
  for (let z = back + 12; z <= front - 2; z += 3.2) [-6, -2, 2, 6].forEach((dx, i) => {
    const y = Math.min(H - 1, 5.2) - ((i + z) % 3) * 0.3;   // cây treo thả xuống tầm nhìn dù trần cao
    addBox(g, 0.02, H - y, 0.02, black, cx + dx, (H + y) / 2, z);
    const pl = new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 8), new THREE.MeshLambertMaterial({ color: (i + Math.round(z)) % 2 ? 0x5c940d : 0x74b816 })); pl.position.set(cx + dx, y - 0.3, z); pl.scale.y = 1.3; g.add(pl);
    const drip = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1, 8), new THREE.MeshLambertMaterial({ color: 0x82c91e })); drip.rotation.x = Math.PI; drip.position.set(cx + dx, y - 1, z); g.add(drip);
  });
  for (let z = back + 10.5; z <= front - 3; z += 2.4) [-4, 0, 4].forEach(dx => { const y = Math.min(H - 1.4, 4.6) - Math.abs(dx) * 0.1; addBox(g, 0.015, H - y, 0.015, black, cx + dx, (H + y) / 2, z);
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffe8a3 })); b.position.set(cx + dx, y - 0.1, z); g.add(b); });
  addBox(g, 0.6, 1.8, 0.5, 0xf8f9fa, cx - W / 2 + 0.5, 0.9, front - 6); sol(cx - W / 2 + 0.5, front - 6, 0.3, 0.25);   // máy lạnh đứng
  addBox(g, 1.6, 0.5, 0.3, 0xf8f9fa, cx + W / 2 - 0.2, H - 1, cz - 4);   // máy lạnh treo tường
  // ===== Khu trước: GÓC CÂY (The Green Corner) =====
  [[-4.5, front - 9], [4.5, front - 9]].forEach(([dx, z]) => {
    addBox(g, 2, 0.1, 6, 0x8d6e4e, cx + dx, 0.95, z); [[-0.9, -2.8], [0.9, -2.8], [-0.9, 2.8], [0.9, 2.8]].forEach(([a, b]) => addBox(g, 0.06, 0.95, 0.06, black, cx + dx + a, 0.47, z + b));
    addBox(g, 1.8, 0.06, 5.6, 0x6f4e37, cx + dx, 0.4, z); sol(cx + dx, z, 1, 3);
    for (let k = -2; k <= 2; k++) {   // bình thủy sinh + khay sen đá
      const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.5, 12), new THREE.MeshLambertMaterial({ color: 0xd0ebff, transparent: true, opacity: 0.45 })); jar.position.set(cx + dx - 0.45, 1.25, z + k * 1.1); g.add(jar);
      const moss = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 6), new THREE.MeshLambertMaterial({ color: 0x40c057 })); moss.position.set(cx + dx - 0.45, 1.12, z + k * 1.1); g.add(moss);
      for (let q = 0; q < 3; q++) { const sc = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 5), new THREE.MeshLambertMaterial({ color: q % 2 ? 0x94d82d : 0x63e6be })); sc.position.set(cx + dx + 0.3 + q * 0.2, 1.06, z + k * 1.1); g.add(sc); }
    }
  });
  [[-7.6, front - 2.5], [7.6, front - 2.5], [-8, front - 14], [8, cz - 10]].forEach(([dx, z]) => {   // cây lá to trong chậu
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.35, 0.7, 12), new THREE.MeshLambertMaterial({ color: 0xb5651d })); pot.position.set(cx + dx, 0.35, z); g.add(pot); sol(cx + dx, z, 0.45, 0.45);
    for (let k = 0; k < 6; k++) { const lf = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 1.6), new THREE.MeshLambertMaterial({ color: k % 2 ? 0x2b8a3e : 0x37b24d })); lf.position.set(cx + dx, 1.3 + k * 0.12, z); lf.rotation.set(0.7, k * 1.05, 0); g.add(lf); }
  });
  const gc = textPlate("🌿 THE GREEN CORNER", 4, 0.6, "#2b8a3e", "#ffffff"); gc.position.set(cx, 3.2, front - 13.5); g.add(gc);
  const bc = textPlate("☕ COFFEE BAR", 3.4, 0.6, "#3b2a1a", "#ffd43b"); bc.position.set(cx, 4.4, back + 0.06); g.add(bc);
  // mái kính (nhìn từ trong lên thấy trời)
  const roofG = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshBasicMaterial({ color: 0xe7f5ff, transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false })); roofG.rotation.x = Math.PI / 2; roofG.position.set(cx, H + 0.1, cz); roofG.userData.flat = true; g.add(roofG);
  // CHỖ BÀY ĐỒ TỪ VỰNG theo đúng khu (at trong VOCAB): [x, y, z, chỗ đứng hỏi x, z]
  const row = (n, x0, x1, y, z, sz) => Array.from({ length: n }, (_, i) => { const x = n > 1 ? x0 + (x1 - x0) * i / (n - 1) : (x0 + x1) / 2; return [x, y, z, x, sz]; });
  const A = P.anchors = {
    bar: row(7, cx - 6, cx + 0.6, 1.32, cz0 + 0.3, cz0 + 1.6).concat(row(7, cx - 5.6, cx + 1, 1.62, cz0 - 0.3, cz0 + 1.6)),
    cake: row(5, cx + 2.6, cx + 4.2, 1.5, cz0, cz0 + 1.6),
    cashier: [[cx + 5, 1.35, cz0 + 0.35, cx + 5, cz0 + 1.6], [cx + 5.4, 1.75, cz0, cx + 5.4, cz0 + 1.6], [cx + 5.9, 1.35, cz0 + 0.35, cx + 5.9, cz0 + 1.6], [cx + 6.3, 1.35, cz0 - 0.2, cx + 6.3, cz0 + 1.6], [cx + 4.7, 1.75, cz0 - 0.3, cx + 4.7, cz0 + 1.6]],
    shelf: row(4, cx - 5.7, cx - 3.3, 1.25, back + 0.7, back + 2.3).concat(row(3, cx + 3.5, cx + 5.5, 1.25, back + 0.7, back + 2.3)),
    window: [[cx - W / 2 + 0.45, 1.3, cz - 5, cx - W / 2 + 2.2, cz - 5], [cx - W / 2 + 0.45, 1.3, cz + 1, cx - W / 2 + 2.2, cz + 1], [cx - W / 2 + 0.45, 1.3, cz + 7, cx - W / 2 + 2.2, cz + 7],
      [cx + W / 2 - 0.45, 1.3, cz - 5, cx + W / 2 - 2.2, cz - 5], [cx + W / 2 - 0.45, 1.3, cz + 1, cx + W / 2 - 2.2, cz + 1], [cx + W / 2 - 0.45, 1.3, cz + 7, cx + W / 2 - 2.2, cz + 7]],
    sofa: [[-3.5, -7], [3.5, -1.5], [-3.5, 4.5]].flatMap(([dx, dz]) => [[cx + dx - 0.35, 1, cz + dz, cx + dx - 1.9, cz + dz], [cx + dx + 0.35, 1, cz + dz, cx + dx + 1.9, cz + dz]]),
    plants: row(4, front - 11.4, front - 6.6, 1.3, 0, 0).map(r => [cx - 4.2, r[1], r[0], cx - 2.4, r[0]]).concat(row(3, front - 11, front - 7, 1.3, 0, 0).map(r => [cx + 4.2, r[1], r[0], cx + 2.4, r[0]])),
    ceiling: [[cx - 2, 4.3, cz + 8, cx - 2, cz + 8], [cx + 2, 4.6, cz - 2, cx + 2, cz - 2], [cx, H - 0.6, cz + 14, cx, cz + 14]],
    door: [[cx - W / 2 + 0.5, 2.1, front - 6, cx - W / 2 + 2, front - 6], [cx + 8.4, 0.9, front - 3.2, cx + 7, front - 3.2], [cx + 1.6, 0.2, front - 1.4, cx + 2.4, front - 2.6], [cx - 8.4, 0.6, front - 3.4, cx - 7, front - 3.4], [cx - 2.4, 2.4, front - 0.15, cx - 2.4, front - 2.4]]
  };
  g.traverse(o => { if (o.isMesh && o.position.y > 2.6) o.userData.flat = true; });   // mái, cây treo, bóng đèn: không đổ bóng (đỡ rối mắt)
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["greenhouse"] = {
  furnish: furnishGreenhouse,
  wall: (len, h, w) => glassWall(len, h, w.x === 0 && w.z < 0),   // tường kính; tường sau là gạch có kệ
  bright: true
};

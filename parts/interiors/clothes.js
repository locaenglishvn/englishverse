/* EnglishVerse – nội thất "clothes" Clothes Shop (layout: "clothesshop"), phòng 32 × 36 m, trần 6 m. Dùng khung chung shopKit (shopkit.js).
   CLOTHES SHOP – shop thời trang lớn, sàn gỗ nâu (không chói): sào treo đồ dọc 2 tường, 4 bàn đồ gấp + 2 giá tròn ở giữa, bục tròn 3 ma-nơ-canh giữa lối vào,
   tường giày + ghế thử giày (phải), góc phụ kiện (trái, gần cửa: mũ, khăn, túi, thắt lưng, tủ kính), góc vải "textile" (sau phải: cuộn vải, bàn cắt, máy may),
   3 phòng thử đồ + gương lớn (sau trái), quầy thu ngân cuối tiệm. Khu: rack, table, shoes, accessories, fabric, mirror, counter.
   Chừa trống: lối vào x -1.5..1.5, z 9..18; NPC (-6,-10) (6,-10) (10,4) (-10,6); người bán (0,-15.6) sau quầy z -14.2. */
function furnishClothes(P, g, cx, cz, W, D, fur) {
  const K = shopKit(P, g, cx, cz, W, D, { floor: ["#b08d6e", "#a3815f"], wall: ["#f3e6e8", "#7a3a5c"], trim: "#9c36b5", counter: 0x7a3a5c, counterTop: 0xf3e6e8, sign: "PAY HERE · THANK YOU", signBg: "#9c36b5", signFg: "#ffffff" });
  const { back, front, B, sol, plate, A } = K;
  const COL = [0xe64980, 0x4dabf7, 0xfab005, 0x40c057, 0x7048e8, 0xf8f9fa, 0xf76707, 0x343a40, 0x1864ab, 0xc92a2a];
  const shirt = (x, y, z, c, ry, h) => { const s = B(0.5, h || 0.65, 0.06, c, x, y, z); s.rotation.y = ry || 0; };
  const rail = (x, z0, z1, side) => { const L = z1 - z0, zc = cz + (z0 + z1) / 2; B(0.06, 0.06, L, 0xadb5bd, x, 1.95, zc); [z0, z1].forEach(z => B(0.06, 1.95, 0.06, 0xadb5bd, x, 0.98, cz + z));
    for (let z = z0 + 0.2; z < z1; z += 0.36) shirt(x, 1.5, cz + z, COL[Math.round((z + 40) * 2.7) % 10], Math.PI / 2, ((Math.round(z * 3) % 3) ? 0.65 : 1.0)); sol(x, zc, 0.45, L / 2); };
  // SÀO TREO ĐỒ dọc 2 tường (rack)
  rail(cx - 15.4, -12.5, 4.5); rail(cx + 15.4, -12.5, -2);
  plate("DRESSES · COATS · SHIRTS", 4.2, 0.5, "#7a3a5c", "#ffffff", cx - W / 2 + 0.03, 3, cz - 4, Math.PI / 2);
  // BÀN ĐỒ GẤP + GIÁ TRÒN ở giữa (table)
  [[-3.5, -6], [3.5, -6], [-3.5, 0], [3.5, 0]].forEach(([dx, dz], k) => { const x = cx + dx, z = cz + dz;
    B(2.6, 0.85, 1.6, 0x6f4e37, x, 0.43, z); B(2.7, 0.06, 1.7, 0xd9b38c, x, 0.88, z); sol(x, z, 1.35, 0.85);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) for (let h = 0; h < 3; h++) B(0.5, 0.08, 0.45, COL[(i + j * 2 + k * 3) % 10], x - 0.9 + i * 0.6, 0.95 + h * 0.09, z - 0.4 + j * 0.8); });
  [[-9.5, -4], [9.5, -4]].forEach(([dx, dz], k) => { const x = cx + dx, z = cz + dz; lc(g, 0.05, 0.05, 1.6, 0xadb5bd, x, 0.8, z, 6);
    const r = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.03, 6, 24), mat(0xadb5bd)); r.rotation.x = Math.PI / 2; r.position.set(x, 1.6, z); g.add(r);
    for (let i = 0; i < 14; i++) { const a = i * Math.PI / 7; shirt(x + Math.cos(a) * 0.85, 1.25, z + Math.sin(a) * 0.85, COL[(i + k * 4) % 10], -a); } lc(g, 0.4, 0.4, 0.05, 0x868e96, x, 0.03, z, 14); sol(x, z, 1.05, 1.05); });
  plate("T-SHIRTS · JEANS · SWEATERS", 4, 0.45, "#9c36b5", "#ffffff", cx, 3.4, cz - 3, 0); lc(g, 0.02, 0.02, 2.4, 0x868e96, cx, 4.8, cz - 3, 4);
  // BỤC MA-NƠ-CANH giữa lối vào + 2 ma-nơ-canh cạnh cửa kính (mirror)
  const dummy = (x, z, c, c2) => { lc(g, 0.25, 0.3, 0.05, 0x343a40, x, 0.03, z, 12); lc(g, 0.03, 0.03, 0.9, 0x343a40, x, 0.5, z, 6); lc(g, 0.2, 0.26, 0.7, c, x, 1.25, z, 12); lc(g, 0.27, 0.32, 0.45, c2 || c, x, 0.82, z, 12); const h = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), mat(0xf1f3f5)); h.position.set(x, 1.75, z); g.add(h); };
  lc(g, 1.7, 1.8, 0.3, 0xf3e6e8, cx, 0.15, cz + 6.5, 24); [[-0.8, 0xe64980, 0x343a40], [0, 0x4dabf7, 0x1864ab], [0.8, 0xfab005, 0xf8f9fa]].forEach(([d, c, c2]) => dummy(cx + d, cz + 6.5 - Math.abs(d) * 0.4, c, c2)); sol(cx, cz + 6.5, 1.8, 1.8);
  plate("NEW COLLECTION", 2.4, 0.45, "#7a3a5c", "#ffffff", cx, 2.6, cz + 6.5 - 1.75, Math.PI);
  [-10, 10].forEach((dx, k) => { dummy(cx + dx, front - 1.4, [0xc92a2a, 0x40c057][k], 0x343a40); sol(cx + dx, front - 1.4, 0.35, 0.35); });
  // PHÒNG THỬ ĐỒ + GƯƠNG (sau trái)
  [-14, -11.8, -9.6].forEach((dx, k) => { const x = cx + dx; B(0.08, 2.4, 2, 0xf3e6e8, x - 1.05, 1.2, back + 1); B(2.1, 0.1, 2, 0xf3e6e8, x, 2.4, back + 1); B(1.9, 2.1, 0.04, 0x7048e8, x, 1.25, back + 2); });
  B(0.08, 2.4, 2, 0xf3e6e8, cx - 8.55, 1.2, back + 1); sol(cx - 11.8, back + 1, 3.3, 1.05);
  plate("FITTING ROOMS", 3, 0.4, "#7048e8", "#ffffff", cx - 11.8, 2.8, back + 2.03, 0);
  B(1.4, 2.4, 0.08, 0xd9b38c, cx - 6.5, 1.2, back + 0.05); B(1.2, 2.2, 0.02, 0xe7f5ff, cx - 6.5, 1.2, back + 0.1);
  // TƯỜNG GIÀY + ghế thử giày (shoes) – tường phải phía trước
  B(0.5, 2.4, 12, 0xf3e6e8, cx + 15.75, 1.2, cz + 6); sol(cx + 15.75, cz + 6, 0.3, 6);
  [0.35, 0.8, 1.25, 1.7, 2.15].forEach((y, r) => { B(0.55, 0.04, 12, 0xd9b38c, cx + 15.6, y, cz + 6); for (let z = 0.4; z <= 11.6; z += 0.55) B(0.32, 0.14, 0.22, COL[(Math.round(z * 2) + r) % 10], cx + 15.5, y + 0.09, cz + z); });
  B(0.7, 0.45, 2.4, 0x7a3a5c, cx + 12.6, 0.23, cz + 8); B(0.7, 0.1, 2.4, 0xf3e6e8, cx + 12.6, 0.5, cz + 8); sol(cx + 12.6, cz + 8, 0.37, 1.22);
  plate("SHOES · SNEAKERS · BOOTS", 3.8, 0.45, "#9c36b5", "#ffffff", cx + W / 2 - 0.03, 3, cz + 6, -Math.PI / 2);
  // GÓC PHỤ KIỆN (accessories) – tường trái gần cửa + tủ kính
  B(0.5, 2.4, 8, 0xf3e6e8, cx - 15.75, 1.2, cz + 12); sol(cx - 15.75, cz + 12, 0.3, 4);
  for (let z = 8.6; z <= 15.6; z += 0.9) { lc(g, 0.22, 0.25, 0.12, COL[Math.round(z * 3) % 10], cx - 15.35, 2.05, cz + z, 12); lc(g, 0.12, 0.14, 0.14, COL[Math.round(z * 3) % 10], cx - 15.35, 2.16, cz + z, 10);   // mũ
    B(0.1, 0.8, 0.25, COL[(Math.round(z * 3) + 3) % 10], cx - 15.45, 1.25, cz + z); B(0.25, 0.3, 0.35, COL[(Math.round(z * 3) + 6) % 10], cx - 15.35, 0.55, cz + z); }   // khăn, túi
  B(2.2, 0.9, 1, 0xf3e6e8, cx - 10.5, 0.45, cz + 12.5); { const gl = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.5, 0.9), mat(0xd0ebff, { transparent: true, opacity: 0.3 })); gl.position.set(cx - 10.5, 1.15, cz + 12.5); g.add(gl); } sol(cx - 10.5, cz + 12.5, 1.15, 0.55);
  for (let i = 0; i < 5; i++) B(0.3, 0.06, 0.2, [0x343a40, 0x8d5a2b, 0xfab005, 0xe64980, 0x4dabf7][i], cx - 11.3 + i * 0.4, 0.95, cz + 12.5);
  plate("HATS · SCARVES · BAGS", 3.4, 0.45, "#7a3a5c", "#ffffff", cx - W / 2 + 0.03, 3, cz + 12, Math.PI / 2);
  // GÓC VẢI "textile" (fabric) – sau phải: cuộn vải trên kệ tường sau, bàn cắt, máy may
  B(9, 2.4, 0.8, 0x6f4e37, cx + 10.5, 1.2, back + 0.4); sol(cx + 10.5, back + 0.4, 4.5, 0.45);
  [0.5, 1.2, 1.9].forEach((y, r) => { for (let i = 0; i < 12; i++) { const roll = lc(g, 0.15, 0.15, 0.7, COL[(i + r * 4) % 10], cx + 6.4 + i * 0.72, y, back + 0.5, 12); roll.rotation.x = Math.PI / 2; } });
  B(2.6, 0.9, 1.3, 0x6f4e37, cx + 11, 0.45, cz - 13.5); B(2.7, 0.05, 1.4, 0xd9b38c, cx + 11, 0.92, cz - 13.5); B(1.8, 0.02, 0.9, 0x4dabf7, cx + 10.8, 0.95, cz - 13.5); sol(cx + 11, cz - 13.5, 1.35, 0.7);
  B(0.5, 0.35, 0.25, 0xf8f9fa, cx + 12, 1.12, cz - 13.4); B(0.1, 0.25, 0.25, 0xf8f9fa, cx + 12.2, 1.3, cz - 13.4);
  plate("FABRIC · TEXTILES · SEWING", 4, 0.45, "#9c36b5", "#ffffff", cx + 10.5, 3, back + 0.03, 0);
  B(4, 2, 0.5, 0x6f4e37, cx, 1, back + 0.25); [0.6, 1.3].forEach((y, r) => { for (let i = 0; i < 7; i++) B(0.4, 0.45, 0.15, COL[(i + r * 3) % 10], cx - 1.5 + i * 0.5, y + 0.25, back + 0.55); }); sol(cx, back + 0.25, 2, 0.3);   // kệ túi mua sắm sau quầy
  pot(g, cx + 5, front - 0.8, 1.3); sol(cx + 5, front - 0.8, 0.45, 0.45); pot(g, cx - 5, front - 0.8, 1.3); sol(cx - 5, front - 0.8, 0.45, 0.45);
  g.traverse(o => { if (o.isMesh && o.position.y > 3.4) o.userData.flat = true; });
  P.anchors = {
    rack: [-11, -8, -5, -2, 1, 4].map(dz => A(-15.2, 2.2, dz, -13.8, dz)).concat([-11, -7.5, -4].map(dz => A(15.2, 2.2, dz, 13.8, dz))),
    table: [[-3.5, -6], [3.5, -6], [-3.5, 0], [3.5, 0]].flatMap(([dx, dz]) => [A(dx - 0.6, 1.3, dz, dx < 0 ? -1.6 : 1.6, dz), A(dx + 0.6, 1.3, dz, dx < 0 ? -5.6 : 5.6, dz + 0.5)]).concat([A(-9.5, 1.9, -4, -9.5, -6.2)]),
    shoes: [1, 3, 5, 7, 9, 11].map((dz, i) => A(15.3, i % 2 ? 1.8 : 1.0, dz, 14, dz)).concat([A(12.6, 0.9, 8, 11.4, 8.6)]),
    accessories: [8.8, 10.6, 12.4, 14.2, 15.6].map((dz, i) => A(-15.3, [2.4, 1.6, 0.9][i % 3], dz, -14, dz)).concat([A(-11, 1.5, 12.5, -11, 13.8), A(-10, 1.5, 12.5, -10, 11.2), A(9.5, 1.9, -4, 9.5, -1.8)]),
    fabric: [7, 9, 11, 13, 14.8].map(dx => A(dx, 1.6, -17.4, dx, -16)).concat([A(10.3, 1.3, -13.5, 10.3, -12.2), A(12, 1.6, -13.4, 13.4, -12.4)]),
    mirror: [A(-14, 1.6, -15.9, -14, -14.8), A(-11.8, 1.6, -15.9, -11.8, -14.8), A(-9.6, 1.6, -15.9, -9.6, -14.8), A(-6.5, 2.4, -17.8, -6.5, -16.4), A(0, 2.2, 5.6, 0, 4), A(-10, 2.1, 16.6, -10, 15.2)],
    counter: [A(-1.8, 1.4, -14.2, -1.8, -13.1), A(0.6, 1.4, -14.2, 0.6, -13.1), A(1.9, 1.4, -14.2, 2.2, -13.1), A(-1.5, 1.8, -17.4, -3.2, -16.6), A(1.5, 1.8, -17.4, 3.2, -16.6), A(1.5, 1.1, -17.4, 3.6, -15.6)]
  };
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["clothesshop"] = { furnish: furnishClothes };

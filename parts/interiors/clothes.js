/* EnglishVerse – nội thất "clothes" Clothes Shop (layout: "clothesshop"), dùng khung chung shopKit (shopkit.js).
   CLOTHES SHOP – shop thời trang hồng tím: thanh treo quần áo dọc tường trái + giá tròn giữa tiệm, kệ giày + ghế thử giày tường phải,
   2 phòng thử đồ rèm tím + gương lớn ở phía sau, 2 ma-nơ-canh cạnh cửa kính, quầy thu ngân + kệ áo gấp sau lưng người bán. Khu: rack, shoes, mirror, counter. */
function furnishClothes(P, g, cx, cz, W, D, fur) {
  const K = shopKit(P, g, cx, cz, W, D, { floor: ["#f8f0e3", "#efe0cc"], wall: ["#fff5f9", "#c2255c"], trim: "#9c36b5", counter: 0xc2255c, counterTop: 0xfff0f6, sign: "NEW COLLECTION", signBg: "#9c36b5", signFg: "#ffffff" });
  const { back, front, B, sol, plate, A } = K;
  const cols = [0xe64980, 0x4dabf7, 0xfab005, 0x40c057, 0x7048e8, 0xffffff, 0xf76707, 0x343a40];
  const shirt = (x, y, z, c, ry) => { const s = B(0.5, 0.65, 0.06, c, x, y, z); s.rotation.y = ry || 0; return s; };
  // THANH TREO tường trái (rack) + giá tròn giữa tiệm
  B(0.06, 0.06, 10, 0xadb5bd, cx - 7.4, 1.9, cz - 0.5); [-5.4, 4.4].forEach(dz => B(0.06, 1.9, 0.06, 0xadb5bd, cx - 7.4, 0.95, cz + dz));
  for (let i = 0; i < 26; i++) shirt(cx - 7.4, 1.5, cz - 5.2 + i * 0.37, cols[i % 8], Math.PI / 2);
  sol(cx - 7.4, cz - 0.5, 0.45, 5);
  lc(g, 0.05, 0.05, 1.6, 0xadb5bd, cx, 0.8, cz - 1, 6); { const r = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.03, 6, 24), mat(0xadb5bd)); r.rotation.x = Math.PI / 2; r.position.set(cx, 1.6, cz - 1); g.add(r); }
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; shirt(cx + Math.cos(a) * 0.75, 1.25, cz - 1 + Math.sin(a) * 0.75, cols[(i + 3) % 8], -a); }
  lc(g, 0.4, 0.4, 0.05, 0x868e96, cx, 0.03, cz - 1, 14); sol(cx, cz - 1, 0.95, 0.95);
  plate("T-SHIRTS · JEANS · JACKETS", 4, 0.4, "#9c36b5", "#ffffff", cx - W / 2 + 0.03, 2.6, cz - 0.5, Math.PI / 2);
  // KỆ GIÀY tường phải + ghế thử giày (shoes)
  B(0.5, 2.2, 6, 0xf8f0e3, cx + 7.75, 1.1, cz - 3); sol(cx + 7.75, cz - 3, 0.3, 3);
  [0.35, 0.8, 1.25, 1.7].forEach((y, r) => { B(0.55, 0.04, 6, 0xd9b38c, cx + 7.6, y, cz - 3); for (let z = -5.6; z <= -0.4; z += 0.55) { B(0.32, 0.14, 0.2, cols[(Math.round(z * 2) + r + 20) % 8], cx + 7.5, y + 0.09, cz + z); } });
  B(0.6, 0.45, 1.6, 0x9c36b5, cx + 6.7, 0.23, cz + 2.4); B(0.6, 0.1, 1.6, 0xfff0f6, cx + 6.7, 0.5, cz + 2.4); sol(cx + 6.7, cz + 2.4, 0.32, 0.82);
  B(0.5, 0.02, 0.6, 0xd0ebff, cx + 6.7, 0.02, cz + 1.2);   // thảm đo cỡ chân
  plate("SHOES", 1.6, 0.4, "#c2255c", "#ffffff", cx + W / 2 - 0.03, 2.6, cz - 3, -Math.PI / 2);
  // PHÒNG THỬ ĐỒ + GƯƠNG + MA-NƠ-CANH (mirror)
  [-6.6, -4.6].forEach(dx => { const x = cx + dx; B(0.08, 2.4, 2, 0xf8f0e3, x - 0.95, 1.2, back + 1); B(1.9, 0.1, 2, 0xf8f0e3, x, 2.4, back + 1);
    const cur = B(1.8, 2.1, 0.04, 0x7048e8, x, 1.25, back + 2); cur.material = mat(0x7048e8); });
  B(0.08, 2.4, 2, 0xf8f0e3, cx - 3.65, 1.2, back + 1); sol(cx - 5.6, back + 1, 2.05, 1.05);
  plate("FITTING ROOMS", 2.2, 0.35, "#7048e8", "#ffffff", cx - 5.6, 2.75, back + 2.02, 0);
  B(1.3, 2.3, 0.08, 0xd9b38c, cx + 5, 1.2, back + 0.05); B(1.1, 2.1, 0.02, 0xe7f5ff, cx + 5, 1.2, back + 0.1);
  const dummy = (x, z, c) => { lc(g, 0.25, 0.3, 0.05, 0x343a40, x, 0.03, z, 12); lc(g, 0.03, 0.03, 0.9, 0x343a40, x, 0.5, z, 6); lc(g, 0.2, 0.26, 0.7, c, x, 1.25, z, 12); const h = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), mat(0xf1f3f5)); h.position.set(x, 1.75, z); g.add(h); sol(x, z, 0.32, 0.32); };
  dummy(cx - 5.5, front - 1.2, 0xe64980); dummy(cx + 5.5, front - 1.2, 0x4dabf7);
  // QUẦY + kệ áo gấp sau lưng người bán (counter)
  B(0.6, 0.35, 0.45, 0x343a40, cx - 1.6, 1.3, cz - 5.3); [1.2, 1.9].forEach((dx, i) => { B(0.4, 0.45, 0.12, [0xffffff, 0xfab005][i], cx + dx, 1.35, cz - 5.1); });
  B(4.4, 2.2, 0.5, 0xd9b38c, cx, 1.1, back + 0.25); [0.6, 1.15, 1.7].forEach((y, r) => { B(4.4, 0.04, 0.5, 0xb07a4a, cx, y, back + 0.3); for (let i = 0; i < 8; i++) B(0.42, 0.14 + (i % 2) * 0.06, 0.35, cols[(i + r * 3) % 8], cx - 1.9 + i * 0.54, y + 0.1, back + 0.3); }); sol(cx, back + 0.25, 2.2, 0.3);
  pot(g, cx + 3.2, front - 0.6, 1.1); sol(cx + 3.2, front - 0.6, 0.4, 0.4);
  g.traverse(o => { if (o.isMesh && o.position.y > 3.4) o.userData.flat = true; });
  P.anchors = {
    rack: [-4.6, -3, 0.5, 2.2, 3.8].map(dz => A(-7.2, 2.15, dz, -6.2, dz)).concat([A(0, 1.95, -0.2, 0, 0.6), A(0, 1.95, -1.8, 1.4, -2.6)]),
    shoes: [-5.3, -4, -2.5, -1, 0.2].map((dz, i) => A(7.4, i % 2 ? 1.5 : 1.05, dz, 6.3, dz)).concat([A(6.7, 0.9, 2.4, 5.8, 2.4)]),
    mirror: [A(-6.6, 1.6, -6.9, -6.6, -6.2), A(-4.6, 1.6, -6.9, -4.4, -6.2), A(5, 2.5, -8.8, 5, -7.3), A(-5.5, 2.15, 7.8, -5.5, 6.6), A(5.5, 2.15, 7.8, 5.5, 6.6)],
    counter: [A(-1.6, 1.75, -5.3, -1.6, -4.1), A(1.2, 1.8, -5.1, 1, -4.1), A(1.9, 1.85, -5.1, 2.2, -4.0), A(1.6, 2.1, -8.6, 3, -7.4), A(1.9, 1.5, -8.6, 3.2, -6.6), A(-2.2, 1.3, -5.2, -2.4, -4.1)]
  };
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["clothesshop"] = { furnish: furnishClothes };

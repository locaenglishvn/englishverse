/* EnglishVerse – nội thất "supermarket" Shop 24h (layout: "martshop"), phòng 20 × 48 m, trần 8 m. Dùng khung chung shopKit (shopkit.js, không quầy giữa).
   SHOP 24H – cửa hàng tiện lợi lớn: quầy thu ngân ở góc phải gần cửa (người bán Nam đứng sau quầy, quay mặt vào tiệm), tủ lạnh cửa kính dọc tường trái,
   10 dãy kệ hàng ở giữa (trái: snack, phải: đồ gia dụng) chia 2 bên lối đi chính, tủ đông kem dọc tường sau, sạp trái cây + thùng rau gần cửa bên trái.
   Khu: fridge, snacks, household, fruit, frozen, counter. Chừa trống: lối vào x -1.5..1.5, z 15..24; NPC (3.5,-9.5) (-3.5,-4.5) (-7.5,7) (7,10). */
function furnishMart(P, g, cx, cz, W, D, fur) {
  const K = shopKit(P, g, cx, cz, W, D, { floor: ["#c4cbcf", "#b8c0c5"], wall: ["#eef1ee", "#2f9e44"], trim: "#40c057", noCounter: true });
  const { back, front, B, sol, plate, A } = K;
  const goods = [0xe03131, 0xfab005, 0x1c7ed6, 0x40c057, 0xf08c00, 0x7048e8, 0xe64980, 0x15aabf];
  const row = (x, y, z, len, alongZ, seed, w, d) => { const n = Math.floor(len / 0.32); for (let i = 0; i < n; i++) { const t = -len / 2 + 0.16 + i * 0.32, h = 0.2 + ((i * 7 + seed) % 3) * 0.06;
    B(w || 0.24, h, d || 0.2, goods[(i + seed) % 8], alongZ ? x : x + t, y + h / 2, alongZ ? z + t : z); } };
  // DÃY KỆ GIỮA (snacks bên trái, household bên phải): 5 hàng × 2 bên, cao 1,4 m
  const ROWS = [-16.5, -12, -7, -2.5, 2];
  ROWS.forEach((dz, r) => [-1, 1].forEach(s => { const x = cx + s * 4.6, z = cz + dz;
    B(5, 1.4, 1, 0xdee2e6, x, 0.7, z); B(5.1, 0.06, 1.05, 0xadb5bd, x, 1.43, z); sol(x, z, 2.55, 0.55);
    [0.35, 0.8].forEach((y, k) => [-1, 1].forEach(f => row(x, y, z + f * 0.4, 4.8, false, r * 3 + k + (s > 0 ? 4 : 0) + (f > 0 ? 1 : 0)))); }));
  [[-4.6, "SNACKS · CANDY", "#e03131"], [4.6, "HOME · SOAP · PAPER", "#1c7ed6"]].forEach(([dx, t, c]) => { plate(t, 3.6, 0.5, c, "#ffffff", cx + dx, 3.6, cz - 7, 0); lc(g, 0.02, 0.02, 4.2, 0x868e96, cx + dx, 5.9, cz - 7, 4); });
  // TỦ LẠNH CỬA KÍNH (fridge) – tường trái
  B(1, 2.4, 24, 0xe9ecef, cx - 9.5, 1.2, cz - 8); sol(cx - 9.5, cz - 8, 0.55, 12);
  [0.45, 1.05, 1.65].forEach((y, r) => { B(0.8, 0.04, 24, 0xced4da, cx - 9.4, y, cz - 8); for (let z = -19.8; z <= 3.8; z += 0.32) lc(g, 0.07, 0.07, 0.36, goods[(Math.round(z * 3.1) + r * 3 + 80) % 8], cx - 9.3, y + 0.2, cz + z, 8); });
  { const gl = new THREE.Mesh(new THREE.PlaneGeometry(24, 2.2), mat(0xc5f6fa, { transparent: true, opacity: 0.32 })); gl.position.set(cx - 8.99, 1.2, cz - 8); gl.rotation.y = Math.PI / 2; g.add(gl); }
  for (let z = -20; z <= 4.01; z += 1.5) B(0.06, 2.2, 0.06, 0xadb5bd, cx - 8.97, 1.2, cz + z);
  plate("COLD DRINKS · MILK · JUICE", 5, 0.5, "#1c7ed6", "#ffffff", cx - W / 2 + 0.03, 2.9, cz - 8, Math.PI / 2);
  // TỦ ĐÔNG KEM (frozen) – tường sau
  [-4.5, 4.5].forEach((dx, k) => { const x = cx + dx; B(4, 0.9, 1.1, 0xf8f9fa, x, 0.45, back + 1.2); { const gl = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.05, 1), mat(0xc5f6fa, { transparent: true, opacity: 0.5 })); gl.position.set(x, 0.92, back + 1.2); g.add(gl); }
    for (let i = 0; i < 10; i++) B(0.3, 0.12, 0.4, goods[(i + k * 3) % 8], x - 1.6 + i * 0.36, 0.84, back + 1.2); sol(x, back + 1.2, 2.05, 0.6); });
  plate("ICE CREAM · FROZEN FOOD", 4.4, 0.5, "#15aabf", "#ffffff", cx, 3, back + 0.04, 0);
  // SẠP TRÁI CÂY + THÙNG RAU (fruit) – gần cửa bên trái
  const fruit = (x, y, z, c) => { const f = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), mat(c)); f.position.set(x, y, z); g.add(f); };
  B(4, 0.8, 1.6, 0x8d5a2b, cx - 6, 0.4, cz + 11.5); B(3, 0.35, 0.8, 0x8d5a2b, cx - 6, 0.98, cz + 11.5); sol(cx - 6, cz + 11.5, 2.05, 0.85);
  [0xe03131, 0xfab005, 0x40c057, 0xf08c00, 0x7048e8].forEach((c, k) => { for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) fruit(cx - 7.7 + k * 0.8 + i * 0.18 - 0.27, 0.9, cz + 11 + j * 0.9, c); });
  [0xe64980, 0xffd43b, 0x2f9e44].forEach((c, k) => { for (let i = 0; i < 4; i++) fruit(cx - 7 + k * 1 + i * 0.2 - 0.3, 1.25, cz + 11.5, c); });
  [15.5, 17.5, 19.5].forEach((dz, k) => { B(0.9, 0.6, 1.6, 0xb07a4a, cx - 9.3, 0.3, cz + dz); for (let i = 0; i < 6; i++) fruit(cx - 9.3 + (i % 2) * 0.3 - 0.15, 0.68, cz + dz - 0.6 + Math.floor(i / 2) * 0.55, [0x2f9e44, 0xf08c00, 0xe03131][k]); sol(cx - 9.3, cz + dz, 0.47, 0.82); });
  plate("FRESH FRUIT & VEGETABLES", 4, 0.45, "#f08c00", "#ffffff", cx - 6, 2.2, cz + 11.5, 0); B(0.05, 0.9, 0.05, 0x8d5a2b, cx - 6, 1.6, cz + 11.5);
  // QUẦY THU NGÂN (counter) – góc phải gần cửa: người bán đứng sau quầy, quay mặt vào tiệm
  B(0.9, 1.05, 5, 0x2f9e44, cx + 6.4, 0.53, cz + 17); B(1.05, 0.08, 5.1, 0xf1f3f5, cx + 6.4, 1.09, cz + 17); sol(cx + 6.4, cz + 17, 0.5, 2.55);
  B(0.45, 0.35, 0.6, 0x343a40, cx + 6.4, 1.3, cz + 16); B(0.04, 0.25, 0.5, 0x69db7c, cx + 6.15, 1.42, cz + 16); B(0.3, 0.12, 0.25, 0x212529, cx + 6.3, 1.19, cz + 17.2);
  B(0.6, 0.6, 0.6, 0xdee2e6, cx + 6.4, 1.43, cz + 18.6); { const gl = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.45), mat(0xfff3bf, { transparent: true, opacity: 0.6 })); gl.position.set(cx + 6.09, 1.43, cz + 18.6); gl.rotation.y = -Math.PI / 2; g.add(gl); }
  B(0.3, 0.5, 0.8, 0xfab005, cx + 6.2, 0.6, cz + 14.3);
  B(0.5, 2.2, 6, 0xdee2e6, cx + 9.7, 1.1, cz + 17); [0.6, 1.2, 1.8].forEach((y, r) => { B(0.5, 0.04, 6, 0xadb5bd, cx + 9.6, y, cz + 17); row(cx + 9.5, y + 0.02, cz + 17, 5.8, true, r * 2 + 5); }); sol(cx + 9.7, cz + 17, 0.3, 3);
  plate("OPEN 24 HOURS · PAY HERE", 3.6, 0.5, "#2f9e44", "#ffffff", cx + W / 2 - 0.03, 3.1, cz + 17, -Math.PI / 2);
  P.keeperAt = { x: cx + 8.1, z: cz + 17, ry: -Math.PI / 2 };
  // TƯỜNG PHẢI: kệ đồ gia dụng (household thêm)
  B(0.6, 2.2, 20, 0xdee2e6, cx + 9.7, 1.1, cz - 8); [0.45, 1.0, 1.55].forEach((y, r) => { B(0.6, 0.04, 20, 0xadb5bd, cx + 9.6, y, cz - 8); row(cx + 9.5, y + 0.02, cz - 8, 19.6, true, r * 2 + 1); }); sol(cx + 9.7, cz - 8, 0.35, 10);
  g.traverse(o => { if (o.isMesh && o.position.y > 4.5) o.userData.flat = true; });
  P.anchors = {
    fridge: [-18, -15, -12, -9, -6, -3, 0, 3].map((dz, i) => A(-9.1, i % 2 ? 1.9 : 1.2, dz, -8, dz)),
    snacks: [-16.5, -12, -7, -2.5, 2].map(dz => A(-4.6, 1.75, dz, -2.6, dz + (dz > 1 ? 1.4 : -2.1))).concat([A(-6.2, 1.75, -12, -6.2, -14.3), A(-6.2, 1.75, -2.5, -6.2, -0.4), A(-3, 1.75, -16.5, -3, -18.8), A(-6.2, 1.75, 2, -6.2, 4)]),
    household: [-16.5, -12, -7, -2.5, 2].map(dz => A(4.6, 1.75, dz, 2.6, dz + (dz > 1 ? 1.4 : -2.1))).concat([A(9.4, 1.4, -14, 8.2, -14), A(9.4, 1.4, -4, 8.2, -4)]),
    fruit: [-7.5, -6, -4.5].map(dx => A(dx, 1.5, 11.5, dx, 13.1)).concat([A(-6, 1.6, 11.2, -3.4, 11.5)], [15.5, 17.5, 19.5].map(dz => A(-9.3, 1.2, dz, -8.1, dz))),
    frozen: [-6, -4.5, -3, 3, 4.5, 6].map(dx => A(dx, 1.35, -22.8, dx, -21.4)),
    counter: [15.1, 16.3, 17.6, 18.8].map(dz => A(6.4, 1.6, dz, 5.2, dz)).concat([A(6.2, 1.2, 14.3, 5.2, 13.8), A(9.5, 1.5, 15, 8.6, 13), A(9.5, 2.1, 19, 8.6, 20.7)])
  };
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["martshop"] = { furnish: furnishMart };

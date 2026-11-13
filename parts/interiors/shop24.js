/* EnglishVerse – nội thất "supermarket" Shop 24h (layout: "martshop"), dùng khung chung shopKit (shopkit.js).
   SHOP 24H – cửa hàng tiện lợi sáng đèn: sàn trắng, tường trắng sọc xanh lá, quầy tính tiền (máy tính tiền, máy quét), tủ hấp bánh bao + kệ sau quầy,
   dãy tủ lạnh cửa kính tường trái, kệ snack giữa + tường phải, sạp trái cây 2 góc trước. Khu: fridge, snacks, fruit, counter. */
function furnishMart(P, g, cx, cz, W, D, fur) {
  const K = shopKit(P, g, cx, cz, W, D, { floor: ["#f8f9fa", "#e9ecef"], wall: ["#ffffff", "#2f9e44"], trim: "#40c057", counter: 0x2f9e44, counterTop: 0xf1f3f5, sign: "OPEN 24 HOURS", signBg: "#2f9e44", signFg: "#ffffff" });
  const { back, B, sol, plate, A } = K;
  const goods = [0xe03131, 0xfab005, 0x1c7ed6, 0x40c057, 0xf08c00, 0x7048e8, 0xe64980];
  const shelfRow = (x, y, z, len, alongZ, seed) => { const n = Math.floor(len / 0.32); for (let i = 0; i < n; i++) { const t = -len / 2 + 0.16 + i * 0.32, c = goods[(i + seed) % goods.length], h = 0.22 + ((i * 7 + seed) % 3) * 0.06;
    B(0.24, h, 0.2, c, alongZ ? x : x + t, y + h / 2, alongZ ? z + t : z); } };
  // QUẦY TÍNH TIỀN (counter): máy tính tiền, máy quét, hộp kẹo; sau quầy: tủ hấp bánh bao + kệ
  B(0.7, 0.35, 0.5, 0x343a40, cx - 1.6, 1.3, cz - 5.3); B(0.5, 0.25, 0.04, 0x69db7c, cx - 1.6, 1.42, cz - 5.04); B(0.25, 0.12, 0.3, 0x212529, cx + 1.2, 1.19, cz - 5.1);
  B(0.6, 0.3, 0.3, 0xfab005, cx + 2, 1.28, cz - 4.95);
  B(1.6, 1.1, 0.7, 0xdee2e6, cx - 3.4, 1.4, back + 0.4); { const gl = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.9), mat(0xfff3bf, { transparent: true, opacity: 0.6 })); gl.position.set(cx - 3.4, 1.4, back + 0.76); g.add(gl); }
  for (let i = 0; i < 4; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), mat(0xfff8e1)); b.position.set(cx - 3.9 + i * 0.33, 1.2, back + 0.4); g.add(b); }
  B(1.6, 0.85, 0.7, 0x2f9e44, cx - 3.4, 0.43, back + 0.4); sol(cx - 3.4, back + 0.4, 0.85, 0.4);
  B(3.2, 2.2, 0.5, 0xdee2e6, cx + 3.6, 1.1, back + 0.3); [0.5, 1.1, 1.7].forEach((y, r) => { B(3.2, 0.04, 0.5, 0xadb5bd, cx + 3.6, y, back + 0.35); shelfRow(cx + 3.6, y + 0.02, back + 0.4, 3, false, r * 2); }); sol(cx + 3.6, back + 0.3, 1.65, 0.3);
  // TỦ LẠNH CỬA KÍNH (fridge) – tường trái
  B(1, 2.3, 9, 0xe9ecef, cx - 7.5, 1.15, cz - 1.5); sol(cx - 7.5, cz - 1.5, 0.55, 4.5);
  [0.45, 1.05, 1.65].forEach((y, r) => { B(0.8, 0.04, 9, 0xced4da, cx - 7.4, y, cz - 1.5); for (let z = -5.8; z <= 2.8; z += 0.3) lc(g, 0.07, 0.07, 0.36, goods[(Math.round(z * 3.3) + r * 3 + 70) % goods.length], cx - 7.3, y + 0.2, cz + z, 8); });
  { const gl = new THREE.Mesh(new THREE.PlaneGeometry(9, 2.1), mat(0xc5f6fa, { transparent: true, opacity: 0.35 })); gl.position.set(cx - 6.99, 1.15, cz - 1.5); gl.rotation.y = Math.PI / 2; g.add(gl); }
  for (let z = -6; z <= 3.01; z += 1.5) B(0.06, 2.1, 0.06, 0xadb5bd, cx - 6.97, 1.15, cz + z);
  plate("COLD DRINKS · MILK", 3, 0.4, "#1c7ed6", "#ffffff", cx - 6.97, 2.55, cz - 1.5, Math.PI / 2);
  // KỆ SNACK (snacks): kệ đôi giữa tiệm + kệ tường phải
  B(4.2, 1.05, 0.9, 0xdee2e6, cx, 0.53, cz - 1.3); [0.3, 0.75].forEach((y, r) => { [-1, 1].forEach(s => shelfRow(cx, y, cz - 1.3 + s * 0.3, 4, false, r + (s > 0 ? 3 : 0))); }); sol(cx, cz - 1.3, 2.15, 0.5);
  plate("SNACKS", 1.4, 0.3, "#e03131", "#ffffff", cx, 1.25, cz - 1.3, 0);
  B(0.6, 2.2, 8, 0xdee2e6, cx + 7.7, 1.1, cz - 2); [0.45, 1.0, 1.55].forEach((y, r) => { B(0.6, 0.04, 8, 0xadb5bd, cx + 7.6, y, cz - 2); shelfRow(cx + 7.5, y + 0.02, cz - 2, 7.8, true, r * 2 + 1); }); sol(cx + 7.7, cz - 2, 0.35, 4);
  // SẠP TRÁI CÂY (fruit) 2 góc trước: thùng gỗ nghiêng, trái cây tròn
  const fruit = (x, z, c) => { for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) { const f = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 6), mat(c)); f.position.set(x - 0.4 + i * 0.2, 0.95 + j * 0.05, z - 0.1 + j * 0.2); g.add(f); } };
  [[5, [0xe03131, 0xfab005, 0x40c057, 0xf08c00]], [-5, [0x7048e8, 0xffd43b, 0x2f9e44]]].forEach(([dx, cs]) => { const n = cs.length, w = n * 1.1;
    B(w, 0.85, 1.1, 0x8d5a2b, cx + dx, 0.43, cz + 7.7); sol(cx + dx, cz + 7.7, w / 2 + 0.05, 0.6); cs.forEach((c, i) => fruit(cx + dx - w / 2 + 0.55 + i * 1.1, cz + 7.7, c)); });
  plate("FRESH FRUIT", 2, 0.4, "#f08c00", "#ffffff", cx + 5, 1.6, cz + 7.15, 0); B(0.05, 0.6, 0.05, 0x8d5a2b, cx + 5, 1.15, cz + 7.2);
  g.traverse(o => { if (o.isMesh && o.position.y > 3.4) o.userData.flat = true; });
  P.anchors = {
    counter: [A(-1.6, 1.75, -5.3, -1.6, -4.1), A(1.2, 1.5, -5.1, 0.9, -4.1), A(2, 1.65, -4.95, 2.2, -4.0), A(-3.4, 2.2, -8.6, -3.4, -7.4), A(3, 2.3, -8.7, 3, -7.4), A(4.5, 1.4, -8.6, 4.5, -7.4)],
    fridge: [-5.5, -3.8, -2.2, -0.6, 1, 2.6].map((dz, i) => A(-6.8, i % 2 ? 1.85 : 1.1, dz, -6, dz)).concat([A(-6.8, 2.2, -1.5, -6, -1.5)]),
    snacks: [A(-1.3, 1.35, -0.75, -1.3, 0.3), A(1.3, 1.35, -0.75, 1.3, 0.3), A(-1, 1.35, -1.85, -1, -3), A(1, 1.35, -1.85, 1, -3), A(7.3, 1.3, -5, 6.2, -5), A(7.3, 1.8, -3.4, 6.2, -3.4), A(7.3, 1.3, -0.5, 6.2, -0.5), A(7.3, 1.8, 1.2, 6.2, 1.2)],
    fruit: [3.35, 4.45, 5.55, 6.65].map(dx => A(dx, 1.3, 7.6, dx, 6.4)).concat([-6.1, -5, -3.9].map(dx => A(dx, 1.3, 7.6, dx, 6.4)))
  };
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["martshop"] = { furnish: furnishMart };

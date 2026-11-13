/* EnglishVerse – nội thất "bakery" (layout: "bakeryshop"), phòng 20 × 48 m, trần 8 m (to bằng Cafe Sua Da). Dùng khung chung shopKit (shopkit.js).
   BANH MI BAKERY – tiệm bánh ấm, sàn gạch nung (không chói): cuối tiệm là lò gạch + tủ ủ bột + giá khay + máy trộn; quầy kính đặt bánh + bàn gói;
   giữa tiệm 2 dãy đảo bánh mì (trái) và bục bánh ngọt (phải); kệ bánh mì dọc tường trái; tủ kính bánh kem dọc tường phải; tủ mát tráng miệng + tháp macaron;
   bàn ngồi gần cửa kính. Khu: oven, counter, bread, cakes, desserts, seating. Toạ độ (dx, dz) từ giữa phòng, cửa ở dz = +24.
   Chừa trống: lối vào x -1.5..1.5, z 15..24; chỗ NPC (-6.5,-16) (6.5,-2) (-6.5,1) (5,10); người bán (0,-21.6) sau quầy z -20.2. */
const BREADGEO = new THREE.SphereGeometry(0.1, 8, 6);
function furnishBakery(P, g, cx, cz, W, D, fur) {
  const K = shopKit(P, g, cx, cz, W, D, { floor: ["#a88a70", "#977a62"], wall: ["#fbeedd", "#8d5a2b"], trim: "#c0392b", counter: 0x8d5a2b, counterTop: 0xfff4e0, glassCounter: true, sign: "ORDER CAKES HERE", signBg: "#c0392b", signFg: "#fff4e0" });
  const { back, front, B, sol, plate, pic, A } = K;
  const bread = (x, y, z, s, c) => { const m = new THREE.Mesh(BREADGEO, mat(c || 0xd9a05b)); m.scale.set(2.6 * (s || 1), 0.75 * (s || 1), 1 * (s || 1)); m.position.set(x, y, z); g.add(m); };
  const bun = (x, y, z, r, c) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), mat(c)); m.scale.y = 0.6; m.position.set(x, y, z); g.add(m); };
  const cake = (x, y, z, r, h, c, top) => { lc(g, r, r, h, c, x, y + h / 2, z, 16); lc(g, r * 1.02, r * 1.02, 0.04, top || 0xffffff, x, y + h + 0.02, z, 16); };
  const glassBox = (w, h, d, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(0xd0ebff, { transparent: true, opacity: 0.28 })); m.position.set(x, y, z); g.add(m); };
  const CK = [0xffc9de, 0xfff3bf, 0x8d5a2b, 0xd3f9d8, 0xffd8a8, 0xe599f7, 0xffffff, 0xff8787];
  // LÒ GẠCH + tủ ủ bột + giá khay + máy trộn + bao bột (oven)
  const brick = skin(5, 3, 30, x => { x.fillStyle = "#b5523b"; x.fillRect(0, 0, 5, 3); x.fillStyle = "#9c4130"; for (let r = 0; r < 15; r++) for (let c = 0; c < 13; c++) x.fillRect(c * 0.4 + (r % 2) * 0.2, r * 0.2, 0.36, 0.17);
    [1.25, 3.75].forEach(X => { x.fillStyle = "#2b2b2b"; archPath(x, X - 0.8, 1.1, 1.6, 1.2); x.fill(); x.fillStyle = "#ff922b"; x.fillRect(X - 0.65, 1.9, 1.3, 0.3); x.fillStyle = "#ffd43b"; x.fillRect(X - 0.5, 2.05, 1, 0.12); }); });
  B(5, 3, 1.2, 0x9c4130, cx - 5.5, 1.5, back + 0.6); pic(brick, 5, 3, cx - 5.5, 1.5, back + 1.21); sol(cx - 5.5, back + 0.6, 2.55, 0.65);
  B(1.6, 0.08, 0.6, 0x495057, cx - 6.7, 1.05, back + 1.5); B(0.07, 0.07, 1.6, 0x8d5a2b, cx - 4.4, 1.05, back + 2);
  B(2.4, 2.4, 0.9, 0xced4da, cx + 4.2, 1.2, back + 0.45); B(2.3, 2.2, 0.02, 0xe9ecef, cx + 4.2, 1.2, back + 0.91); for (let y = 0.5; y < 2.3; y += 0.45) for (let i = 0; i < 5; i++) bun(cx + 3.3 + i * 0.45, y, back + 0.6, 0.13, 0xf1e3c6); sol(cx + 4.2, back + 0.45, 1.25, 0.5);
  B(2, 2.3, 0.7, 0xadb5bd, cx + 7.6, 1.15, back + 0.4); for (let y = 0.4; y < 2.3; y += 0.42) { B(1.9, 0.04, 0.6, 0x868e96, cx + 7.6, y, back + 0.45); for (let i = 0; i < 4; i++) bread(cx + 6.95 + i * 0.43, y + 0.08, back + 0.45); } sol(cx + 7.6, back + 0.4, 1.05, 0.4);
  B(1, 0.9, 0.9, 0x868e96, cx - 8.8, 0.45, cz - 20.5); B(0.6, 0.6, 0.5, 0xf8f9fa, cx - 8.8, 1.2, cz - 20.5); lc(g, 0.25, 0.18, 0.35, 0xdee2e6, cx - 8.8, 1.7, cz - 20.5, 12); sol(cx - 8.8, cz - 20.5, 0.55, 0.5);
  [0, 1, 2].forEach(i => { const s = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.75, 10), mat(0xf1e3c6)); s.position.set(cx + 9.1, 0.38, cz - 20.6 + i * 0.75); g.add(s); }); sol(cx + 9.1, cz - 19.85, 0.45, 1.2);
  // QUẦY KÍNH đặt bánh kem + bàn gói (counter)
  [-1.9, -0.95, 0.95, 1.9].forEach((dx, i) => cake(cx + dx, 0.5, back + 3.8, 0.24, 0.2, CK[i], CK[i + 3]));
  B(0.55, 0.3, 0.4, 0x343a40, cx - 2, 1.3, back + 3.7); B(2.4, 0.95, 0.8, 0x8d5a2b, cx + 5, 0.48, cz - 18); B(2.5, 0.06, 0.9, 0xfff4e0, cx + 5, 0.98, cz - 18); sol(cx + 5, cz - 18, 1.25, 0.45);
  [[4.3, 0xffffff], [5, 0xffc9de], [5.7, 0xfff3bf]].forEach(([dx, c]) => B(0.45, 0.35, 0.45, c, cx + dx, 1.18, cz - 18));
  plate("CAKE BOXES · GIFT WRAP", 2.4, 0.3, "#c0392b", "#fff4e0", cx + 5, 0.6, cz - 17.58, 0);
  // ĐẢO BÁNH MÌ (giữa trái) + KỆ BÁNH MÌ (tường trái) (bread)
  const island = (x, z, top) => { B(2.4, 0.8, 1.6, 0x8d5a2b, x, 0.4, z); B(2.5, 0.06, 1.7, top, x, 0.83, z); B(1.6, 0.4, 1, 0x8d5a2b, x, 1.06, z); B(1.7, 0.05, 1.1, top, x, 1.28, z); sol(x, z, 1.25, 0.85); };
  [-12, -5, 2].forEach((dz, k) => { const x = cx - 3.5, z = cz + dz; island(x, z, 0xf3d9b1);
    for (let i = 0; i < 5; i++) { bread(x - 0.95 + i * 0.47, 0.92, z - 0.5, 1.1, k === 1 ? 0xc98f4f : 0xd9a05b); bread(x - 0.95 + i * 0.47, 0.92, z + 0.5, 0.8, 0xe8b071); }
    for (let i = 0; i < 4; i++) bun(x - 0.6 + i * 0.4, 1.36, z, 0.14, [0xe8b071, 0xd9a05b, 0xf1e3c6][k]); });
  B(0.9, 2.6, 26, 0x8d5a2b, cx - 9.55, 1.3, cz - 3); sol(cx - 9.55, cz - 3, 0.47, 13);
  [0.55, 1.15, 1.75, 2.3].forEach((y, r) => { B(0.95, 0.05, 26, 0xb07a4a, cx - 9.4, y, cz - 3); for (let z = -15.6; z <= 9.6; z += 0.6) bread(cx - 9.3, y + 0.1, cz + z, r > 2 ? 0.7 : 1, [0xd9a05b, 0xc98f4f, 0xe8b071, 0xb07a4a][(Math.round(z * 2) + r + 40) % 4]); });
  plate("BREAD · BANH MI", 3.4, 0.5, "#8d5a2b", "#fff4e0", cx - W / 2 + 0.03, 3.4, cz - 3, Math.PI / 2);
  // BỤC BÁNH NGỌT (giữa phải) + TỦ KÍNH BÁNH KEM (tường phải) (cakes)
  [-12, -5, 2].forEach((dz, k) => { const x = cx + 3.5, z = cz + dz; B(2.4, 0.8, 1.6, 0xfff4e0, x, 0.4, z); B(2.5, 0.06, 1.7, 0xc0392b, x, 0.83, z); glassBox(2.3, 0.6, 1.5, x, 1.16, z); sol(x, z, 1.25, 0.85);
    for (let i = 0; i < 4; i++) cake(x - 0.8 + i * 0.53, 0.86, z, 0.2, 0.2 + (i % 2) * 0.08, CK[(i + k * 2) % 8], CK[(i + k * 2 + 3) % 8]); });
  B(1.1, 0.9, 20, 0xfff4e0, cx + 9.45, 0.45, cz - 4); glassBox(1, 1.1, 20, cx + 9.45, 1.45, cz - 4); B(1.15, 0.06, 20, 0xc0392b, cx + 9.45, 2.02, cz - 4); sol(cx + 9.45, cz - 4, 0.57, 10);
  for (let z = -13.4; z <= 5.4; z += 0.7) cake(cx + 9.4, 0.92, cz + z, 0.22, 0.18 + (Math.round(z * 10) % 3) * 0.05, CK[(Math.round(z * 1.4) + 40) % 8], CK[(Math.round(z * 1.4) + 43) % 8]);
  plate("CAKES & PASTRIES", 3.4, 0.5, "#c0392b", "#fff4e0", cx + W / 2 - 0.03, 3.4, cz - 4, -Math.PI / 2);
  // TỦ MÁT TRÁNG MIỆNG (tường phải gần cửa) + THÁP MACARON (desserts)
  B(1.1, 2.4, 4.5, 0xe9ecef, cx + 9.45, 1.2, cz + 11); { const gl = new THREE.Mesh(new THREE.PlaneGeometry(4.3, 2.1), mat(0xc5f6fa, { transparent: true, opacity: 0.45 })); gl.position.set(cx + 8.88, 1.2, cz + 11); gl.rotation.y = -Math.PI / 2; g.add(gl); } sol(cx + 9.45, cz + 11, 0.57, 2.25);
  [0.5, 1.15, 1.8].forEach((y, r) => { B(0.95, 0.04, 4.3, 0xced4da, cx + 9.4, y, cz + 11); for (let z = -1.8; z <= 1.81; z += 0.6) lc(g, 0.12, 0.1, 0.18, [0xffffff, 0xffe066, 0xe599f7][r], cx + 9.3, y + 0.11, cz + 11 + z, 10); });
  plate("DESSERTS", 1.8, 0.4, "#7048e8", "#ffffff", cx + 8.86, 2.7, cz + 11, -Math.PI / 2);
  lc(g, 0.6, 0.6, 0.9, 0xfff4e0, cx - 4.5, 0.45, cz + 9, 16); for (let i = 0; i < 6; i++) { const r = 0.45 - i * 0.07; for (let a = 0; a < 6.28; a += 0.9 - i * 0.05) bun(cx - 4.5 + Math.cos(a) * r, 1.0 + i * 0.12, cz + 9 + Math.sin(a) * r, 0.07, CK[(i + Math.round(a * 2)) % 8]); } sol(cx - 4.5, cz + 9, 0.65, 0.65);
  // BÀN NGỒI gần cửa kính (seating)
  [[-6.5, 14], [-6.5, 19.5], [6, 17.5]].forEach(([dx, dz]) => { const x = cx + dx, z = cz + dz; lc(g, 0.65, 0.65, 0.05, 0xfff4e0, x, 0.76, z, 16); lc(g, 0.06, 0.06, 0.74, 0x495057, x, 0.37, z, 6); sol(x, z, 0.65, 0.65);
    [-1, 1].forEach(s => { lc(g, 0.24, 0.24, 0.45, 0xc0392b, x + s, 0.23, z, 10); sol(x + s, z, 0.24, 0.24); }); lc(g, 0.07, 0.07, 0.14, 0xffffff, x, 0.85, z, 8); });
  const menu = skin(3.4, 2, 50, x => { x.fillStyle = "#3b2a1a"; x.fillRect(0, 0, 3.4, 2); x.fillStyle = "#ffd43b"; x.font = "bold 0.26px system-ui"; x.textAlign = "center"; x.fillText("MENU", 1.7, 0.32);
    x.fillStyle = "#fff4e0"; x.font = "0.17px system-ui"; x.textAlign = "left"; [["Banh mi", "20k"], ["Croissant", "25k"], ["Baguette", "15k"], ["Cupcake", "18k"], ["Cheesecake", "35k"], ["Flan", "12k"]].forEach(([a, b], i) => { x.fillText(a, 0.3, 0.65 + i * 0.22); x.fillText(b, 2.6, 0.65 + i * 0.22); }); });
  pic(menu, 3.4, 2, cx, 3.6, back + 0.04);
  [[-3, 23], [3, 23]].forEach(([dx, dz]) => { pot(g, cx + dx, cz + dz, 1.2); sol(cx + dx, cz + dz, 0.45, 0.45); });
  g.traverse(o => { if (o.isMesh && o.position.y > 4.5) o.userData.flat = true; });
  P.anchors = {
    oven: [A(-6.5, 1.9, -23.2, -6.5, -21.4), A(-4.2, 1.9, -23.2, -4.2, -21.4), A(4.2, 1.7, -23.3, 4.2, -21.4), A(7.6, 1.5, -23.4, 7.6, -21.6), A(7.2, 2.5, -23.4, 6.8, -21.4), A(-8.8, 2.2, -20.5, -7.3, -20.2), A(9.1, 1.1, -19.8, 7.7, -19.5)],
    counter: [-1.9, -0.7, 0.7, 1.9].map(dx => A(dx, 1.45, -20.2, dx, -19.1)).concat([A(4.3, 1.7, -18, 4.3, -16.9), A(5.7, 1.7, -18, 5.7, -16.9)]),
    bread: [-12, -8, -4, 0, 4, 7.5].map(dz => A(-9.2, 1.95, dz, -7.9, dz)).concat([-12, -5, 2].map(dz => A(-3.5, 1.75, dz, -1.6, dz))),
    cakes: [-13, -9, -5, -1, 3, 5.5].map(dz => A(9.3, 2.35, dz, 7.6, dz)).concat([-12, -5, 2].map(dz => A(3.5, 1.85, dz, 1.6, dz))),
    desserts: [9.6, 11, 12.4].flatMap(dz => [A(9.2, 1.0, dz, 7.6, dz), A(9.2, 1.65, dz, 7.6, dz + 0.3)]).concat([A(-4.5, 2.0, 9, -3.1, 10)]),
    seating: [A(-6.5, 1.1, 14, -5, 15), A(-6.5, 1.1, 19.5, -5, 20.5), A(6, 1.1, 17.5, 4.5, 18.5), A(0, 4.2, -23.9, 0, -18.9), A(-8.3, 1.2, 13.2, -8.3, 12), A(7.5, 1.1, 16.7, 7.5, 15.4)]
  };
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["bakeryshop"] = { furnish: furnishBakery };

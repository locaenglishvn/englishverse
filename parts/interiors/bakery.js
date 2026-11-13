/* EnglishVerse – nội thất "bakery" (layout: "bakeryshop"), dùng khung chung shopKit (shopkit.js).
   BANH MI BAKERY – tiệm bánh mì ấm áp: tường kem, chân tường cam, lò gạch + giá khay bánh phía sau người bán, tủ kính bánh ngọt (quầy + đảo giữa),
   kệ gỗ bánh mì tường trái, quầy bar ngồi ăn tường phải + bàn nhỏ góc trước. Khu: oven, display, shelf, table. */
const BREADGEO = new THREE.SphereGeometry(0.1, 8, 6);
function furnishBakery(P, g, cx, cz, W, D, fur) {
  const K = shopKit(P, g, cx, cz, W, D, { floor: ["#f3e2c7", "#e9cfa7"], wall: ["#fff4e0", "#e8873a"], trim: "#c0392b", counter: 0x8d5a2b, counterTop: 0xfff4e0, glassCounter: true, sign: "FRESH EVERY DAY", signBg: "#c0392b", signFg: "#fff4e0" });
  const { back, B, sol, plate, pic, A } = K;
  const bread = (x, y, z, s) => { const m = new THREE.Mesh(BREADGEO, mat(0xd9a05b)); m.scale.set(2.6 * (s || 1), 0.75 * (s || 1), 1 * (s || 1)); m.position.set(x, y, z); g.add(m); };
  // LÒ GẠCH + giá khay phía sau (oven)
  const brick = skin(3.4, 2.6, 30, x => { x.fillStyle = "#b5523b"; x.fillRect(0, 0, 3.4, 2.6); x.fillStyle = "#9c4130"; for (let r = 0; r < 13; r++) for (let c = 0; c < 9; c++) x.fillRect(c * 0.4 + (r % 2) * 0.2, r * 0.2, 0.36, 0.17);
    x.fillStyle = "#2b2b2b"; archPath(x, 0.9, 0.9, 1.6, 1.2); x.fill(); x.fillStyle = "#ff922b"; x.fillRect(1.05, 1.7, 1.3, 0.3); x.fillStyle = "#ffd43b"; x.fillRect(1.2, 1.85, 1, 0.12); });
  B(3.4, 2.6, 1.1, 0x9c4130, cx - 4.3, 1.3, back + 0.55); pic(brick, 3.4, 2.6, cx - 4.3, 1.3, back + 1.11); sol(cx - 4.3, back + 0.55, 1.75, 0.6);
  B(1.2, 0.08, 0.6, 0x495057, cx - 4.3, 0.95, back + 1.4); B(0.06, 0.06, 1.4, 0x343a40, cx - 3.5, 0.95, back + 1.9);   // xẻng gỗ
  B(2, 2.2, 0.7, 0xadb5bd, cx + 4.2, 1.1, back + 0.4); for (let y = 0.4; y < 2.2; y += 0.42) { B(1.9, 0.04, 0.6, 0x868e96, cx + 4.2, y, back + 0.45); for (let i = 0; i < 4; i++) bread(cx + 3.55 + i * 0.43, y + 0.08, back + 0.45); } sol(cx + 4.2, back + 0.4, 1.05, 0.4);
  [0, 1].forEach(i => { const s = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.75, 10), mat(0xf1e3c6)); s.position.set(cx + 6.8, 0.38, back + 1 + i * 0.75); g.add(s); }); sol(cx + 6.8, back + 1.4, 0.4, 0.8);   // bao bột
  B(0.6, 0.5, 0.45, 0xf8f9fa, cx + 2.1, 1.38, cz - 5.2); lc(g, 0.18, 0.12, 0.3, 0xdee2e6, cx + 2.1, 1.78, cz - 5.2, 10);   // máy trộn bột
  // TỦ KÍNH BÁNH: trên quầy + đảo giữa (display)
  const cakes = [0xffc9de, 0xfff3bf, 0x8d5a2b, 0xd3f9d8, 0xffd8a8, 0xe599f7];
  [-1.9, -0.95, 0.95, 1.9].forEach((dx, i) => { lc(g, 0.25, 0.25, 0.18, cakes[i], cx + dx, 0.62, cz - 5.2, 14); lc(g, 0.2, 0.2, 0.15, cakes[i + 2], cx + dx, 0.62 + 0.0, cz - 5.0, 12); });
  B(3.4, 0.6, 1, 0x8d5a2b, cx, 0.3, cz - 1.2); { const gl = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.6, 0.9), mat(0xd0ebff, { transparent: true, opacity: 0.35 })); gl.position.set(cx, 0.9, cz - 1.2); g.add(gl); } B(3.45, 0.06, 1.05, 0xfff4e0, cx, 1.23, cz - 1.2); sol(cx, cz - 1.2, 1.75, 0.55);
  [-1.2, -0.4, 0.4, 1.2].forEach((dx, i) => lc(g, 0.22, 0.22, 0.2, cakes[(i + 3) % 6], cx + dx, 0.72, cz - 1.2, 14));
  // KỆ BÁNH MÌ gỗ – tường trái (shelf), mỗi ngăn 1 loại bánh, giỏ mây
  B(0.8, 2.4, 9, 0x8d5a2b, cx - 7.6, 1.2, cz + 0.5); sol(cx - 7.6, cz + 0.5, 0.42, 4.5);
  [0.55, 1.15, 1.75].forEach(y => { B(0.85, 0.05, 9, 0xb07a4a, cx - 7.45, y, cz + 0.5); for (let z = -3.6; z <= 4.6; z += 0.55) bread(cx - 7.35, y + 0.1, cz + z, y > 1.5 ? 0.7 : 1); });
  [[-3, 0xd9a05b], [1.5, 0xc98f4f]].forEach(([dz, c]) => { lc(g, 0.35, 0.28, 0.35, 0xc8a165, cx - 7.1, 2.55, cz + dz, 12); });
  plate("BREAD · BANH MI", 3, 0.45, "#8d5a2b", "#fff4e0", cx - W / 2 + 0.03, 3.2, cz + 0.5, Math.PI / 2);
  // QUẦY BAR ngồi ăn – tường phải + bàn nhỏ góc trước trái (table)
  B(0.7, 0.08, 8, 0xfff4e0, cx + 7.6, 1.1, cz + 0.5); B(0.15, 1.05, 8, 0xe8873a, cx + 7.3, 0.53, cz + 0.5); sol(cx + 7.6, cz + 0.5, 0.42, 4);
  [-2.6, 0.6, 3.6].forEach(dz => { lc(g, 0.22, 0.22, 0.06, 0xc0392b, cx + 6.7, 0.75, cz + dz, 12); lc(g, 0.04, 0.04, 0.72, 0x495057, cx + 6.7, 0.37, cz + dz, 6); sol(cx + 6.7, cz + dz, 0.22, 0.22); });
  lc(g, 0.6, 0.6, 0.05, 0xfff4e0, cx - 5.2, 0.76, cz + 7.2, 16); lc(g, 0.06, 0.06, 0.74, 0x495057, cx - 5.2, 0.37, cz + 7.2, 6); sol(cx - 5.2, cz + 7.2, 0.6, 0.6);
  [-1, 1].forEach(s => { lc(g, 0.22, 0.22, 0.45, 0xe8873a, cx - 5.2 + s * 0.95, 0.23, cz + 7.2, 10); sol(cx - 5.2 + s * 0.95, cz + 7.2, 0.22, 0.22); });
  const menu = skin(3, 1.6, 50, x => { x.fillStyle = "#3b2a1a"; x.fillRect(0, 0, 3, 1.6); x.fillStyle = "#ffd43b"; x.font = "bold 0.24px system-ui"; x.textAlign = "center"; x.fillText("MENU", 1.5, 0.3);
    x.fillStyle = "#fff4e0"; x.font = "0.17px system-ui"; x.textAlign = "left"; [["Banh mi", "20k"], ["Croissant", "25k"], ["Donut", "15k"], ["Cupcake", "18k"]].forEach(([a, b], i) => { x.fillText(a, 0.3, 0.62 + i * 0.25); x.fillText(b, 2.3, 0.62 + i * 0.25); }); });
  pic(menu, 3, 1.6, cx, 2.9, back + 0.04); pot(g, cx + 5.3, cz + 7.6, 1.2); sol(cx + 5.3, cz + 7.6, 0.45, 0.45);
  g.traverse(o => { if (o.isMesh && o.position.y > 3.4) o.userData.flat = true; });
  P.anchors = {
    oven: [A(-5.2, 1.6, -7.8, -5.2, -6.3), A(-3.4, 1.6, -7.8, -3.4, -6.3), A(3.6, 1.5, -8.1, 3.6, -6.5), A(4.8, 2.3, -8.1, 4.8, -6.5), A(6.8, 1.1, -7.3, 6.6, -5.9), A(2.1, 1.9, -5.2, 2.1, -4.1)],
    display: [-1.9, -0.7, 0.7, 1.9].map(dx => A(dx, 1.45, -5.2, dx, -4.1)).concat([A(-1, 1.5, -1.2, -1, 0.1), A(1, 1.5, -1.2, 1, 0.1), A(0, 1.5, -1.5, 2.4, -1.2)]),
    shelf: [-3.5, -1.5, 0.5, 2.5, 4.4].map(dz => A(-7.2, 1.45, dz, -6.2, dz)).concat([A(-7.2, 2.7, -3, -6.2, -3)]),
    table: [-1, 2.1, 4.6].map(dz => A(7.6, 1.4, dz, 6.3, dz + 0.6)).concat([A(-5.2, 1.1, 7.2, -5.2, 6), A(0, 3, -8.9, 0, -4.1)])
  };
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["bakeryshop"] = { furnish: furnishBakery };

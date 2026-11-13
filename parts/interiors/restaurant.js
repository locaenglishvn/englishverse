/* EnglishVerse – nội thất "restaurant" (layout: "phoshop"), dùng khung chung shopKit (shopkit.js).
   PHO CORNER – quán phở Việt: tường vàng nhạt, chân tường gỗ, bếp mở sau người bán (nồi nước dùng lớn, rổ bánh phở, kệ gia vị),
   4 bàn gỗ thấp + ghế đẩu nhựa đỏ, tủ mát đồ uống tường trái, đèn lồng đỏ + thực đơn + lịch trên tường. Khu: kitchen, table, drinks, wall. */
function furnishPho(P, g, cx, cz, W, D, fur) {
  const K = shopKit(P, g, cx, cz, W, D, { floor: ["#9c6b4e", "#8a5c42"], wall: ["#fff3c4", "#8d5a2b"], trim: "#c92a2a", counter: 0xc92a2a, counterTop: 0xe9ecef, sign: "PHO BO · PHO GA", signBg: "#c92a2a", signFg: "#ffe066" });
  const { back, B, sol, plate, pic, A } = K;
  // BẾP MỞ (kitchen): kệ bếp inox 2 bên người bán, nồi nước dùng, rổ bánh phở, thớt, kệ gia vị trên tường
  [-1, 1].forEach(s => { B(5, 0.95, 0.8, 0xadb5bd, cx + s * 4.1, 0.48, back + 0.4); B(5.05, 0.05, 0.85, 0xdee2e6, cx + s * 4.1, 0.97, back + 0.4); sol(cx + s * 4.1, back + 0.4, 2.55, 0.45); });
  [[-5.5, 0.55], [-3.6, 0.45]].forEach(([dx, r]) => { lc(g, r, r, 0.7, 0x868e96, cx + dx, 1.35, back + 0.45, 16); lc(g, r * 0.95, r * 0.95, 0.02, 0xd9a05b, cx + dx, 1.69, back + 0.45, 16); lc(g, r + 0.05, r + 0.05, 0.06, 0x495057, cx + dx, 1.72, back + 0.45, 16); });
  B(0.9, 0.06, 0.5, 0xd9a46a, cx + 3.2, 1.02, back + 0.45); [[4.6, 0xfff8e1], [5.8, 0x8ce99a]].forEach(([dx, c]) => { lc(g, 0.35, 0.3, 0.3, 0xc8a165, cx + dx, 1.15, back + 0.45, 12); lc(g, 0.3, 0.3, 0.05, c, cx + dx, 1.3, back + 0.45, 12); });
  B(4, 0.06, 0.35, 0x8d5a2b, cx - 4.5, 2.4, back + 0.2); [-6, -5.2, -4.4, -3.6, -2.8].forEach((dx, i) => lc(g, 0.1, 0.1, 0.28, [0xc92a2a, 0xf08c00, 0x2f9e44, 0x5c3a24, 0xfab005][i], cx + dx, 2.57, back + 0.2, 8));
  [-1.8, -0.9, 0.9, 1.8].forEach(dx => { lc(g, 0.2, 0.12, 0.12, 0xffffff, cx + dx, 1.19, cz - 5.2, 12); });   // tô trên quầy
  // BÀN ĂN (table): 4 bàn gỗ thấp, ghế đẩu nhựa đỏ, ống đũa + chai tương ớt trên bàn
  const T = [[-2.6, 0.5], [2.6, 0.5], [-2.6, -2.5], [2.6, -2.5]];
  T.forEach(([dx, dz]) => { const x = cx + dx, z = cz + dz;
    B(1.3, 0.06, 0.8, 0xb07a4a, x, 0.72, z); [[-0.55, -0.32], [0.55, -0.32], [-0.55, 0.32], [0.55, 0.32]].forEach(([a, b]) => B(0.06, 0.7, 0.06, 0x6f4e37, x + a, 0.35, z + b)); sol(x, z, 0.68, 0.42);
    [-1, 1].forEach(s => { lc(g, 0.2, 0.17, 0.45, 0xe03131, x - 0.3, 0.23, z + s * 0.78, 10); lc(g, 0.2, 0.17, 0.45, 0xe03131, x + 0.3, 0.23, z + s * 0.78, 10); sol(x, z + s * 0.78, 0.55, 0.2); });
    lc(g, 0.06, 0.06, 0.2, 0x8d5a2b, x - 0.35, 0.85, z, 8); lc(g, 0.05, 0.05, 0.2, 0xc92a2a, x + 0.3, 0.85, z - 0.1, 8); lc(g, 0.05, 0.05, 0.18, 0x5c3a24, x + 0.42, 0.84, z + 0.08, 8); });
  // TỦ MÁT ĐỒ UỐNG (drinks) – tường trái
  B(1, 2.1, 3, 0xdee2e6, cx - 7.45, 1.05, cz - 5); { const gl = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.8), mat(0xc5f6fa, { transparent: true, opacity: 0.5 })); gl.position.set(cx - 6.94, 1.1, cz - 5); gl.rotation.y = Math.PI / 2; g.add(gl); }
  [0.5, 1.1, 1.7].forEach((y, r) => { for (let i = 0; i < 6; i++) lc(g, 0.07, 0.07, 0.35, [0x40c057, 0xfab005, 0xe03131][r], cx - 7.3, y + 0.18, cz - 6.2 + i * 0.48, 8); });
  plate("COLD DRINKS", 1.8, 0.35, "#1c7ed6", "#ffffff", cx - 6.93, 2.3, cz - 5, Math.PI / 2); sol(cx - 7.45, cz - 5, 0.55, 1.5);
  // TƯỜNG (wall): đèn lồng đỏ treo trần, bảng thực đơn, lịch, quạt treo tường, tranh phố cổ
  const lantern = (x, y, z) => { const l = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 10), mat(0xe03131)); l.scale.y = 1.25; l.position.set(x, y, z); g.add(l); B(0.25, 0.08, 0.25, 0xfab005, x, y + 0.32, z); B(0.2, 0.06, 0.2, 0xfab005, x, y - 0.32, z); lc(g, 0.01, 0.01, 4.5 - y - 0.3, 0x343a40, x, (4.5 + y + 0.3) / 2, z, 4); };
  [[-2.6, -1], [2.6, -1], [-5, 6.5], [5, 6.5]].forEach(([dx, dz]) => lantern(cx + dx, 3.75, cz + dz));
  const menu = skin(3.2, 2, 50, x => { x.fillStyle = "#3b2a1a"; x.fillRect(0, 0, 3.2, 2); x.fillStyle = "#ffe066"; x.font = "bold 0.26px system-ui"; x.textAlign = "center"; x.fillText("MENU · THUC DON", 1.6, 0.32);
    x.fillStyle = "#ffffff"; x.font = "0.18px system-ui"; x.textAlign = "left"; [["Beef pho", "45k"], ["Chicken pho", "40k"], ["Spring rolls", "30k"], ["Lemon tea", "10k"], ["Iced coffee", "20k"]].forEach(([a, b], i) => { x.fillText(a, 0.3, 0.7 + i * 0.27); x.fillText(b, 2.5, 0.7 + i * 0.27); }); });
  pic(menu, 3.2, 2, cx + W / 2 - 0.04, 2.6, cz - 3, -Math.PI / 2);
  const cal = skin(0.8, 1.1, 60, x => { x.fillStyle = "#ffffff"; x.fillRect(0, 0, 0.8, 1.1); x.fillStyle = "#e03131"; x.fillRect(0, 0, 0.8, 0.3); x.fillStyle = "#ffffff"; x.font = "bold 0.16px system-ui"; x.textAlign = "center"; x.fillText("NOV", 0.4, 0.2); x.fillStyle = "#e03131"; x.font = "bold 0.45px system-ui"; x.fillText("14", 0.4, 0.8); });
  pic(cal, 0.8, 1.1, cx + W / 2 - 0.04, 2.4, cz + 1, -Math.PI / 2);
  const old = skin(2.4, 1.6, 40, x => { x.fillStyle = "#f8f1df"; x.fillRect(0, 0, 2.4, 1.6); x.fillStyle = "#ffd43b"; x.fillRect(0.2, 0.5, 0.6, 0.8); x.fillStyle = "#ffa94d"; x.fillRect(0.9, 0.4, 0.6, 0.9); x.fillStyle = "#74c0fc"; x.fillRect(1.6, 0.55, 0.6, 0.75); x.fillStyle = "#5c3a24"; [0.2, 0.9, 1.6].forEach(X => x.fillRect(X - 0.05, 0.35, 0.7, 0.1)); x.strokeStyle = "#8d5a2b"; x.lineWidth = 0.1; x.strokeRect(0.05, 0.05, 2.3, 1.5); });
  pic(old, 2.4, 1.6, cx + W / 2 - 0.04, 2.5, cz + 4.5, -Math.PI / 2); pic(old, 2.4, 1.6, cx - W / 2 + 0.04, 2.5, cz + 3, Math.PI / 2);
  lc(g, 0.08, 0.08, 0.1, 0x343a40, cx - 7.9, 3.2, cz + 0, 8).rotation.z = Math.PI / 2; { const f = new THREE.Mesh(new THREE.CircleGeometry(0.45, 16), mat(0x74c0fc, { side: THREE.DoubleSide })); f.position.set(cx - 7.8, 3.2, cz); f.rotation.y = Math.PI / 2; g.add(f); }   // quạt treo tường
  pot(g, cx + 6.8, cz + 7.8, 1.3); sol(cx + 6.8, cz + 7.8, 0.45, 0.45); pot(g, cx - 6.8, cz + 7.8, 1.3); sol(cx - 6.8, cz + 7.8, 0.45, 0.45);
  g.traverse(o => { if (o.isMesh && o.position.y > 3.4) o.userData.flat = true; });
  P.anchors = {
    kitchen: [A(-5.5, 2.05, -8.55, -5.5, -7.3), A(-3.6, 2, -8.55, -3.6, -7.3), A(3.2, 1.3, -8.55, 3.2, -7.3), A(4.6, 1.55, -8.55, 4.6, -7.3), A(5.8, 1.55, -8.55, 5.8, -7.3), A(-1.8, 1.5, -5.2, -1.8, -4.1), A(1.8, 1.5, -5.2, 1.8, -4.1), A(-4.4, 2.9, -8.8, -4.4, -7.3)],
    table: T.flatMap(([dx, dz]) => [A(dx - 0.35, 1.15, dz, dx < 0 ? -0.9 : 0.9, dz), A(dx + 0.35, 1.15, dz, dx < 0 ? -4.3 : 4.3, dz + (dz < 0 ? -1 : 0.6))]),
    drinks: [-6.1, -5, -3.9].flatMap(dz => [A(-6.8, 0.8, dz, -6, dz), A(-6.8, 1.9, dz, -6, dz)]),
    wall: [A(7.85, 2.6, -3, 6.4, -3), A(7.85, 2.5, 1, 6.4, 1), A(7.85, 2.5, 4.5, 6.4, 4.5), A(-2.6, 3.1, -1, -1.3, -1), A(-5, 3.1, 6.5, -5, 5.6), A(-7.75, 3.1, 0, -6.4, 0), A(-7.85, 2.5, 3, -6.4, 3)]
  };
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["phoshop"] = { furnish: furnishPho };

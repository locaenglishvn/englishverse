/* EnglishVerse – nội thất "furniture" (layout: "homecozy"). Tách khỏi index.html để mỗi nơi 1 file (xem docs/TEAM.md).
   Dùng các hàm chung của index.html (lb, lc, mat, skin, face, textPlate, addBox, pot, bigTree…) – chúng có sẵn khi nội thất được dựng. */
/* HOME & COZY – showroom nội thất 60 × 72 m (kiểu cửa hàng nội thất lớn, thương hiệu riêng): lối đi giữa (mũi tên sàn) dẫn vào 8 phòng mẫu, mỗi phòng 26 × 14 m có tường + cửa:
   bên trái (từ cửa vào đi lên): Dining · Living · Study · Balcony & Garden;  bên phải: Kids' Bedroom · Bedroom · Bathroom · Kitchen.
   Hàng trước: Market Hall (đồ nhỏ: ly, đĩa, khăn, gối, khung ảnh, chậu cây, đồng hồ, giỏ) – Thanh toán (quầy thu ngân + quầy bán hàng của Omar, cạnh cửa ra) – Laundry & Storage.
   Camera bị giữ trong khu đang đứng (P.zones). Đồ KayKit (fur) dùng cho món lớn; còn lại dựng bằng khối đơn giản dùng chung chất liệu (được gộp khi tải → ít lần vẽ). */
function furnishHomeCozy(P, g, cx, cz, W, D, fur) {
  const H = (P.size || {}).h || 10, S = P.room.solids, up = new THREE.Vector3(0, 1, 0);
  const WOOD = 0xdcc08f, WOOD2 = 0xb88a55, WOOD3 = 0x8d6a45, WHITE = 0xfaf7f0, CREAM = 0xf3ead8, GREY = 0xcfd4d9, DARK = 0x3b3a38, STEEL = 0xaeb6bd;
  const B = (w, h, d, c, x, y, z) => lb(g, w, h, d, c, cx + x, y, cz + z);
  const C = (rt, rb, h, c, x, y, z, seg) => lc(g, rt, rb, h, c, cx + x, y, cz + z, seg || 12);
  const sol = (x, z, hw, hd) => S.push({ x: cx + x, z: cz + z, hw, hd });
  const SPH = (r, c, x, y, z, sx, sy, sz) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), mat(c)); m.position.set(cx + x, y, cz + z); m.scale.set(sx || 1, sy || 1, sz || 1); g.add(m); return m; };
  const F = (n, x, z, ry, sc, hw, hd, y) => fur(n, cx + x, cz + z, ry, sc, hw, hd, y);
  const MD = { armchair_pillows: [0.9, 0.8], couch_pillows: [1.5, 0.75], bed_single_A: [0.8, 1.5], cabinet_medium: [1, 0.5], cabinet_medium_decorated: [1, 0.5], cabinet_small_decorated: [0.54, 0.5], chair_A_wood: [0.38, 0.45], chair_B_wood: [0.37, 0.45], lamp_standing: [0.3, 0.3], table_medium: [1, 1], table_medium_long: [1.5, 1], table_small: [0.5, 0.5], shelf_B_large_decorated: [1, 0.25], cactus_medium_A: [0.44, 0.42], cactus_small_B: [0.25, 0.25] };
  /* ---------- ảnh dán (ít loại, dùng chung) ---------- */
  const flatM = (t, basic) => basic ? new THREE.MeshBasicMaterial({ map: t, transparent: true }) : new THREE.MeshLambertMaterial({ map: t, transparent: true });
  const rep = (t) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };
  const FLOORS = {
    hall: [() => skin(2, 2, 32, x => { x.fillStyle = "#efe9dc"; x.fillRect(0, 0, 2, 2); x.fillStyle = "#e6dfcf"; x.fillRect(0, 0, 1, 1); x.fillRect(1, 1, 1, 1); x.fillStyle = "#d4ccb8"; x.fillRect(0, 0, 2, 0.03); x.fillRect(0, 0, 0.03, 2); x.fillRect(0, 1, 2, 0.02); x.fillRect(1, 0, 0.02, 2); })],
    oak: [() => skin(2, 2, 32, x => { x.fillStyle = "#e4c696"; x.fillRect(0, 0, 2, 2); for (let i = 0; i < 4; i++) { x.fillStyle = i % 2 ? "#dbbb88" : "#e9cfa2"; x.fillRect(0, i * 0.5, 2, 0.5); x.fillStyle = "#c9a770"; x.fillRect(0, i * 0.5, 2, 0.025); x.fillRect(((i * 0.7) % 2), i * 0.5, 0.025, 0.5); } })],
    tile: [() => skin(2, 2, 32, x => { x.fillStyle = "#f4f6f8"; x.fillRect(0, 0, 2, 2); x.fillStyle = "#dfe8ee"; x.fillRect(0, 0, 1, 1); x.fillRect(1, 1, 1, 1); x.fillStyle = "#c9d4dc"; x.fillRect(0, 0, 2, 0.03); x.fillRect(0, 0, 0.03, 2); x.fillRect(0, 1, 2, 0.03); x.fillRect(1, 0, 0.03, 2); })],
    carpet: [() => skin(2, 2, 24, x => { x.fillStyle = "#e3dccf"; x.fillRect(0, 0, 2, 2); x.fillStyle = "#d9d1c1"; for (let i = 0; i < 60; i++) x.fillRect((i * 0.37) % 2, (i * 0.61) % 2, 0.05, 0.05); })],
    kids: [() => skin(2, 2, 24, x => { const c = ["#ffe08a", "#bfe3ff", "#ffc9d6", "#c8f0c0"]; for (let i = 0; i < 4; i++) { x.fillStyle = c[i]; x.fillRect((i % 2), Math.floor(i / 2), 1, 1); } })],
    deck: [() => skin(2, 2, 32, x => { x.fillStyle = "#b98a58"; x.fillRect(0, 0, 2, 2); for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? "#c4955f" : "#ad7f4e"; x.fillRect(0, i * 0.25, 2, 0.25); x.fillStyle = "#8f6538"; x.fillRect(0, i * 0.25, 2, 0.02); } })],
    grass: [() => skin(2, 2, 16, x => { x.fillStyle = "#7cc468"; x.fillRect(0, 0, 2, 2); x.fillStyle = "#6bb458"; for (let i = 0; i < 80; i++) x.fillRect((i * 0.43) % 2, (i * 0.29) % 2, 0.06, 0.1); })]
  };
  const FM = {};
  const floorM = (k) => FM[k] || (FM[k] = new THREE.MeshLambertMaterial({ map: rep(FLOORS[k][0]()) }));
  const uvScale = (geo, a, b) => { const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * a, uv.getY(i) * b); };
  const floor = (k, x0, x1, z0, z1, y) => { const geo = new THREE.PlaneGeometry(x1 - x0, z1 - z0); uvScale(geo, (x1 - x0) / 2, (z1 - z0) / 2); const m = new THREE.Mesh(geo, floorM(k)); m.rotation.x = -Math.PI / 2; m.position.set(cx + (x0 + x1) / 2, y || 0.01, cz + (z0 + z1) / 2); m.userData.flat = true; g.add(m); return m; };
  const plane = (mt, w, h, x, y, z, ry, rx) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mt); m.position.set(cx + x, y, cz + z); m.rotation.y = ry || 0; if (rx) m.rotation.x = rx; m.userData.flat = true; g.add(m); return m; };
  const sign = (t, w, x, y, z, ry, bg, fg) => { const p = textPlate(t, w, w * 0.13, bg || "#fffaf0", fg || "#5a3e24"); p.position.set(cx + x, y, cz + z); p.rotation.y = ry || 0; p.userData.flat = true; g.add(p); return p; };
  const tagM = {}, tagTex = (txt) => tagM[txt] || (tagM[txt] = new THREE.MeshBasicMaterial({ map: skin(0.7, 0.4, 150, (x, w, h) => { x.fillStyle = "#fff7d6"; x.fillRect(0, 0, w, h); x.strokeStyle = "#e8590c"; x.lineWidth = 0.04; x.strokeRect(0.03, 0.03, w - 0.06, h - 0.06); signText(x, txt, w / 2, h / 2, w * 0.86, 0.26, "#c92a2a"); }) }));
  const windowM = flatM(skin(3, 2.2, 36, (x, w, h) => { const gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#9fd3ff"); gr.addColorStop(1, "#e6f5ff"); x.fillStyle = gr; x.fillRect(0, 0, w, h); x.fillStyle = "#ffffff"; x.beginPath(); x.ellipse(0.8, 0.7, 0.4, 0.15, 0, 0, 7); x.ellipse(2.1, 0.5, 0.5, 0.17, 0, 0, 7); x.fill(); x.fillStyle = "#8ed081"; x.fillRect(0, h - 0.5, w, 0.5); x.strokeStyle = "#ffffff"; x.lineWidth = 0.12; x.strokeRect(0.06, 0.06, w - 0.12, h - 0.12); x.beginPath(); x.moveTo(w / 2, 0); x.lineTo(w / 2, h); x.moveTo(0, h * 0.55); x.lineTo(w, h * 0.55); x.stroke(); }), true);
  const arrowM = new THREE.MeshBasicMaterial({ map: skin(1, 1.4, 64, (x, w, h) => { x.fillStyle = "#f08c00"; x.beginPath(); x.moveTo(w / 2, 0.05); x.lineTo(w - 0.05, 0.65); x.lineTo(0.68, 0.65); x.lineTo(0.68, h - 0.05); x.lineTo(0.32, h - 0.05); x.lineTo(0.32, 0.65); x.lineTo(0.05, 0.65); x.closePath(); x.fill(); x.strokeStyle = "#ffffff"; x.lineWidth = 0.05; x.stroke(); }), transparent: true });
  const arrow = (x, z, ry) => { const m = plane(arrowM, 1, 1.4, x, 0.025, z, 0); m.rotation.order = "YXZ"; m.rotation.set(-Math.PI / 2, ry || 0, 0); return m; };   // mũi tên nằm sàn; ry: 0 = chỉ về -z (đi sâu vào trong), π/2 = chỉ về -x, -π/2 = chỉ về +x
  /* ---------- 12 khu ---------- */
  const ROWS = [[-36, -22], [-22, -8], [-8, 6], [6, 21]], LX = [-30, -4], RX = [4, 30];
  const zr = (x0, x1, z0, z1) => ({ x0: cx + x0, x1: cx + x1, z0: cz + z0, z1: cz + z1 });
  P.zones = [zr(-4, 4, -36, 21)];
  ROWS.forEach(([a, b]) => { P.zones.push(zr(LX[0], LX[1], a, b), zr(RX[0], RX[1], a, b)); });
  P.zones.push(zr(-30, -9, 21, 36), zr(-9, 9, 21, 36), zr(9, 30, 21, 36));
  /* ---------- NỀN + TƯỜNG NGOÀI + TRẦN ---------- */
  const base = g.children[0]; base.material = floorM("hall"); uvScale(base.geometry, W / 2, D / 2);
  const wallM = mat(CREAM), wallM2 = mat(WHITE), trim = mat(WOOD2);
  [[0, -D / 2, 0, W], [0, D / 2, Math.PI, W], [-W / 2, 0, Math.PI / 2, D], [W / 2, 0, -Math.PI / 2, D]].forEach(([x, z, ry, len]) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(len, H), wallM); m.position.set(cx + x, H / 2, cz + z); m.rotation.y = ry; m.userData.flat = true; g.add(m); });
  B(W, 0.25, 0.1, WOOD2, 0, 0.12, -D / 2 + 0.05); B(0.1, 0.25, D, WOOD2, -W / 2 + 0.05, 0.12, 0); B(0.1, 0.25, D, WOOD2, W / 2 - 0.05, 0.12, 0);   // len chân tường
  { const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), wallM2); ceil.rotation.x = Math.PI / 2; ceil.position.set(cx, H, cz); ceil.userData.flat = true; g.add(ceil);
    for (let z = -33; z <= 33; z += 6) [-24, -12, 0, 12, 24].forEach(x => { const l = B(2.4, 0.08, 0.5, 0xfff3c4, x, H - 0.05, z); l.material = new THREE.MeshBasicMaterial({ color: 0xfff3c4 }); l.userData.flat = true; }); }   // đèn ốp trần
  // cửa ra vào ở tường trước (z = +D/2): ô cửa kính 4 m + khung gỗ + biển tên
  { const zf = D / 2; [[-W / 2 + 13, 26], [W / 2 - 13, 26]].forEach(([x, w]) => { B(w, H, 0.3, WHITE, x, H / 2, zf - 0.15); });
    B(4.6, H - 3.2, 0.3, WHITE, 0, 3.2 + (H - 3.2) / 2, zf - 0.15);
    [-2.2, 2.2].forEach(x => B(0.2, 3.2, 0.35, WOOD3, x, 1.6, zf - 0.15)); B(4.6, 0.2, 0.35, WOOD3, 0, 3.2, zf - 0.15);
    const glass = new THREE.MeshLambertMaterial({ color: 0xcfe9ff, transparent: true, opacity: 0.3 }); [-1.1, 1.1].forEach(x => { lb(g, 2, 3, 0.04, glass, cx + x, 1.6, cz + zf - 0.1); });
    sign("HOME & COZY · Nội thất cho mái ấm", 6, 0, 5.2, zf - 0.32, Math.PI, "#8d5a2b", "#fff3d6"); sign("EXIT · LỐI RA", 2.6, 0, 3.7, zf - 0.34, Math.PI, "#2f9e44", "#ffffff"); }
  /* ---------- VÁCH NGĂN (hộp mỏng, chừa cửa 6 m) ---------- */
  const WH = 4.4, DH = 3.2;
  const wallAt = (axis, fixed, a, b, gaps, col) => {   // axis "x": tường đứng yên ở x = fixed chạy theo z từ a tới b; "z": ngược lại
    const cuts = [[a]]; (gaps || []).slice().sort((p, q) => p[0] - q[0]).forEach(([c, w]) => { cuts[cuts.length - 1].push(c - w / 2); cuts.push([c + w / 2]); }); cuts[cuts.length - 1].push(b);
    cuts.forEach(([p, q]) => { if (q - p < 0.1) return; const L = q - p, m = (p + q) / 2; if (axis === "x") { B(0.3, WH, L, col || WHITE, fixed, WH / 2, m); sol(fixed, m, 0.15, L / 2); } else { B(L, WH, 0.3, col || WHITE, m, WH / 2, fixed); sol(m, fixed, L / 2, 0.15); } });
    (gaps || []).forEach(([c, w]) => { if (axis === "x") B(0.3, WH - DH, w, col || WHITE, fixed, DH + (WH - DH) / 2, c); else B(w, WH - DH, 0.3, col || WHITE, c, DH + (WH - DH) / 2, fixed); });
  };
  const rowC = ROWS.map(([a, b]) => (a + b) / 2);
  wallAt("x", -4, -36, 21, rowC.map(c => [c, 6])); wallAt("x", 4, -36, 21, rowC.map(c => [c, 6]));
  [-22, -8, 6].forEach(z => { wallAt("z", z, -30, -4); wallAt("z", z, 4, 30); });
  wallAt("z", 21, -30, -4); wallAt("z", 21, 4, 30);
  wallAt("x", -9, 21, 36, [[29, 6]]); wallAt("x", 9, 21, 36, [[29, 6]]);
  // biển tên phòng (phía lối đi + phía sảnh thanh toán)
  const NAMES = { dining: "DINING ROOM · PHÒNG ĂN", living: "LIVING ROOM · PHÒNG KHÁCH", study: "HOME OFFICE · PHÒNG LÀM VIỆC", garden: "BALCONY & GARDEN · BAN CÔNG & SÂN VƯỜN", kids: "KIDS' BEDROOM · PHÒNG TRẺ EM", bedroom: "BEDROOM · PHÒNG NGỦ", bathroom: "BATHROOM · PHÒNG TẮM", kitchen: "KITCHEN · NHÀ BẾP" };
  [["garden", 0, -1], ["study", 1, -1], ["living", 2, -1], ["dining", 3, -1], ["kitchen", 0, 1], ["bathroom", 1, 1], ["bedroom", 2, 1], ["kids", 3, 1]].forEach(([k, r, s]) => sign(NAMES[k], 5.6, s * 3.7, 3.85, rowC[r], -s * Math.PI / 2, "#fffaf0", "#7a4a22"));
  sign("MARKET HALL · KHU ĐỒ NHỎ", 5.4, -8.7, 3.85, 29, Math.PI / 2, "#fffaf0", "#7a4a22"); sign("LAUNDRY & STORAGE · GIẶT ỦI & LƯU TRỮ", 5.6, 8.7, 3.85, 29, -Math.PI / 2, "#fffaf0", "#7a4a22");
  sign("CHECKOUT · THANH TOÁN", 5, 0, 7.6, 22.2, 0, "#2b6cb0", "#ffffff");
  // sàn từng khu
  const FZ = { dining: "oak", living: "oak", study: "oak", garden: "deck", kids: "kids", bedroom: "carpet", bathroom: "tile", kitchen: "tile" };
  [["garden", 0, -1], ["study", 1, -1], ["living", 2, -1], ["dining", 3, -1], ["kitchen", 0, 1], ["bathroom", 1, 1], ["bedroom", 2, 1], ["kids", 3, 1]].forEach(([k, r, s]) => { const [a, b] = ROWS[r]; floor(FZ[k], s < 0 ? -30 : 4, s < 0 ? -4 : 30, a, b); });
  floor("oak", -30, -9, 21, 36); floor("tile", 9, 30, 21, 36);
  // mũi tên lối đi: từ cửa chính lên giữa lối đi, rẽ vào từng phòng
  for (let z = 33; z >= -32; z -= 5.5) arrow(0, z, 0);
  rowC.forEach(c => { arrow(-3.4, c, Math.PI / 2); arrow(3.4, c, -Math.PI / 2); arrow(-6, c, Math.PI / 2); arrow(6, c, -Math.PI / 2); });
  arrow(-6.4, 29, Math.PI / 2); arrow(6.4, 29, -Math.PI / 2);
  /* ---------- chung ---------- */
  const pend = (x, z, y, col, r) => { C(0.015, 0.015, H - y, DARK, x, (H + y) / 2, z, 4); const m = new THREE.Mesh(new THREE.ConeGeometry(r || 0.45, 0.5, 12), mat(col || 0xf6c667)); m.position.set(cx + x, y, cz + z); m.userData.flat = true; g.add(m); };
  const price = (txt, x, y, z, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.4), tagTex(txt)); m.position.set(cx + x, y, cz + z); m.rotation.y = ry || 0; g.add(m); };
  const pic = (x, y, z, ry, w, h, c1, c2) => {   // tranh treo tường (khối đơn giản)
    const d = 0.04, nx = Math.sin(ry || 0) * 0.04, nz = Math.cos(ry || 0) * 0.04; const sw = Math.abs(Math.sin(ry || 0)) > 0.7;
    lb(g, sw ? d : w + 0.1, h + 0.1, sw ? w + 0.1 : d, WOOD3, cx + x, y, cz + z); lb(g, sw ? d : w, h, sw ? w : d, c1, cx + x + nx, y, cz + z + nz); lb(g, sw ? d : w * 0.6, h * 0.5, sw ? w * 0.6 : d, c2, cx + x + nx * 2, y - h * 0.1, cz + z + nz * 2); };
  const winDeco = (x, y, z, ry) => { plane(windowM, 3, 2.2, x, y, z, ry); };
  const anch = {};
  const A = (key, list, map) => { anch[key] = (anch[key] || []).concat(list.map(a => map(...a))); };
  /* ---------- tạo "người trợ lý" cho khu bên trái (s = -1) / phải (s = +1): u = khoảng cách từ vách lối đi (0..26), v = lệch theo z so với giữa khu ---------- */
  const zone = (s, r) => {
    const c = rowC[r], X = u => s * (4 + u), Zv = v => c + v;
    const z = {
      s, c, X, Zv,
      box: (wu, h, wv, col, u, v, y0) => B(wu, h, wv, col, X(u), (y0 || 0) + h / 2, Zv(v)),
      cyl: (rad, h, col, u, v, y0, seg) => C(rad, rad, h, col, X(u), (y0 || 0) + h / 2, Zv(v), seg),
      sph: (rad, col, u, y, v, sx, sy, sz) => SPH(rad, col, X(u), y, Zv(v), sx, sy, sz),
      sol: (u, v, wu, wv) => sol(X(u), Zv(v), wu / 2, wv / 2),
      pic: (u, y, v, w, h, c1, c2) => pic(X(u) - s * 0.05, y, Zv(v), -s * Math.PI / 2, w, h, c1, c2),
      f: (n, u, v, fu, fv, sc, solid, y) => { const m = MD[n] || [0, 0]; F(n, X(u), Zv(v), Math.atan2(s * fu, fv), sc, solid === false ? 0 : m[0] * sc, solid === false ? 0 : m[1] * sc, y); },
      price: (txt, u, v, y, fu, fv) => price(txt, X(u), y, Zv(v), Math.atan2(s * fu, fv)),
      a: (key, list) => A(key, list, (u, y, v, su, sv) => [cx + X(u), y, cz + Zv(v), cx + X(su), cz + Zv(sv)]),
      accent: (col) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(14, 4.4), mat(col)); p.position.set(cx + s * 29.9, 2.2, cz + c); p.rotation.y = -s * Math.PI / 2; p.userData.flat = true; g.add(p); B(0.05, 0.1, 14, WOOD2, s * 29.88, 4.4, c); },
      win: (u, v) => winDeco(s * 29.9, 2.6, Zv(v), -s * Math.PI / 2),
      pend: (u, v, y, col, rr) => pend(X(u), Zv(v), y, col, rr)
    };
    z.obj = (wu, h, wv, col, u, v, y0) => { z.box(wu, h, wv, col, u, v, y0); z.sol(u, v, wu, wv); };
    return z;
  };
  /* =============== LIVING ROOM (trái, hàng 3) =============== */
  { const z = zone(-1, 2); z.accent(0xe8d5b5); z.win(26, 4.8);
    z.f("rug_rectangle_B", 14, 0, 1, 0, 2.4, false);
    z.f("couch_pillows", 24.6, -0.5, -1, 0, 1.3); z.f("table_medium", 19, -0.5, 0, 1, 0.55); z.f("armchair_pillows", 18.5, 4.4, 0, -1, 1.1); z.f("armchair_pillows", 18.5, -5.2, 0, 1, 1.1);
    z.f("cabinet_medium", 7, 0, 1, 0, 1.2); z.box(0.1, 0.95, 1.8, 0x1d1f23, 7, 0, 1.2); z.box(0.04, 0.8, 1.64, 0x3b5b7a, 7.07, 0, 1.28);
    z.f("lamp_standing", 25, 3.4, 0, 0, 1, true); z.f("cabinet_medium_decorated", 22, -6.4, 0, 1, 1.1); z.f("cabinet_small_decorated", 12, 6.4, 0, -1, 1.1);
    z.f("cactus_medium_A", 3, -5.8, 0, 0, 1.4); z.f("cactus_small_B", 3, 5.8, 0, 0, 1.6);
    z.f("pictureframe_large_B", 25.9, -0.5, -1, 0, 1.4, false, 2.5); z.pic(25.9, 2.4, -5, 1.1, 0.8, 0xf2a65a, 0x4f7cac); z.pic(25.9, 2.4, 3.6, 0.8, 1, 0x6aa84f, 0xf6e7b4);
    z.box(0.2, 0.3, 0.12, 0x2b2b2b, 18.8, 0.5, 0.9);
    [-1, 1].forEach(k => z.box(0.15, 2.8, 0.7, 0xe9a98b, 25.8, 4.8 + k * 1.9, 0));
    z.pend(19, 0, 6, 0xf6c667); z.pend(8, 0, 6.2, 0xf6c667, 0.3);
    z.price("890k", 22.2, -2.7, 0.4, -1, 0); z.price("490k", 19.2, 3.1, 0.4, 0, -1); z.price("290k", 17, -3.7, 0.4, 0, 1);
    z.a("living", [[24.5, 1.9, -1.4, 22, -2.4], [18.5, 1.7, 4.4, 16.2, 3.4], [19, 0.95, -0.5, 16.6, -1.6], [7, 2.0, 0, 10, 2.6], [19, 0.7, 0.1, 16.8, 1.6], [25, 2.9, 3.4, 22.7, 4], [22, 2.2, -6.4, 22, -4.6], [25.8, 2.7, 4.8, 23.4, 5.4]]); }
  /* =============== DINING ROOM (trái, hàng 4) =============== */
  { const z = zone(-1, 3); z.accent(0xf3dcb3); z.win(26, 4.6);
    z.f("rug_rectangle_stripes_A", 15, 0, 0, 1, 2.8, false); z.f("table_medium_long", 15, 0, 0, 1, 1.2);
    [13.6, 15, 16.4].forEach(u => { z.f("chair_A_wood", u, 2.1, 0, -1, 1.1); z.f("chair_B_wood", u, -2.1, 0, 1, 1.1); });
    [[13.6, 0.9], [15, 0.9], [16.4, 0.9], [13.6, -0.9], [15, -0.9], [16.4, -0.9]].forEach(([u, v]) => { z.cyl(0.24, 0.04, 0xffffff, u, v, 1.2, 14); z.cyl(0.15, 0.05, 0x74c0fc, u, v, 1.24, 10); });   // đĩa + bát
    z.cyl(0.34, 0.2, 0xf1e0c0, 15, 0, 1.2, 14); [[0xe03131, -0.12], [0xfab005, 0.1], [0x69db7c, 0.0]].forEach(([c, d]) => z.sph(0.13, c, 15 + d, 1.55, d * 1.2));   // bát trái cây
    z.cyl(0.1, 0.35, 0x4dabf7, 14.2, -0.2, 1.2, 8); z.sph(0.16, 0xf783ac, 14.2, 1.65, -0.2); z.box(0.12, 0.02, 0.5, 0xe03131, 13.9, 0.9, 1.2);
    z.f("cabinet_medium", 25.2, 0, -1, 0, 1.4); z.f("cabinet_small_decorated", 25.2, -4.6, -1, 0, 1.1); z.pic(25.9, 3, 0, 2.4, 0.9, 0xf0e0c0, 0x7aa874);
    z.f("lamp_standing", 4, -6.3, 0, 0, 1); z.f("cactus_medium_A", 4, 6.2, 0, 0, 1.3);
    z.pend(15, -1, 6.2, 0xf6c667, 0.5); z.pend(15, 1, 6.2, 0xf6c667, 0.5); z.price("1,290k", 10.5, 2.6, 0.4, 1, 0); z.price("390k", 23, 3.1, 0.4, -1, 0);
    z.a("dining", [[15, 1.55, 0, 11.4, 0], [14.2, 1.45, 2.1, 12, 3.6], [15, 1.45, 0.9, 18.8, 0.2], [13.6, 1.55, -0.9, 18.8, -0.6], [16.4, 1.45, -0.9, 13, -3.8], [14.2, 1.7, -0.2, 11.4, 1.3], [25.2, 1.9, 0, 22.8, 0], [16, 1.7, 0.5, 18.8, 1.6], [15, 1.3, 1.9, 17.6, 3.6]]); }
  /* =============== HOME OFFICE (trái, hàng 2) =============== */
  { const z = zone(-1, 1); z.accent(0xd7e6f0); z.win(26, 0);
    [-3.6, 3.6].forEach(v => { z.f("table_medium_long", 24, v, 1, 0, 0.85); z.box(0.1, 0.1, 0.25, 0x2b2b2b, 24.4, v, 0.85); z.box(0.06, 0.5, 0.8, 0x2b2b2b, 24.4, v, 0.95); z.box(0.04, 0.42, 0.7, 0x4c8cc5, 24.35, v, 0.99); z.box(0.3, 0.03, 0.7, 0x343a40, 23.3, v, 0.85);
      z.cyl(0.28, 0.12, 0x495057, 21.6, v, 0.5); z.cyl(0.04, 0.5, 0x495057, 21.6, v, 0, 6); z.box(0.09, 0.55, 0.5, 0x495057, 21.2, v, 0.6); z.sol(21.6, v, 0.6, 0.6); z.cyl(0.14, 0.2, 0xe8590c, 23.9, v + 1.0, 0.85, 8); });
    z.obj(1.0, 1.3, 1.8, STEEL, 12, 6.0, 0); z.box(1.0, 0.04, 1.8, 0x495057, 12, 6.0, 1.3); z.box(0.7, 0.35, 0.6, 0xf1f3f5, 12, 6.0, 1.34); z.box(0.5, 0.04, 0.4, 0xffffff, 12, 6.0, 1.69);   // máy in
    z.obj(0.8, 1.5, 0.9, STEEL, 8, 6.2, 0); [0.4, 0.8, 1.2].forEach(y => z.box(0.02, 0.04, 0.5, 0x495057, 7.6, 6.2, y));   // tủ hồ sơ
    z.obj(4.4, 3.0, 0.5, WOOD2, 16.5, -6.55, 0); [0.5, 1.2, 1.9, 2.6].forEach(y => z.box(4.4, 0.06, 0.6, WOOD3, 16.5, -6.55, y));   // tủ sách cao
    { const bk = [0xe03131, 0x1c7ed6, 0xfab005, 0x40c057, 0x7048e8, 0xf783ac, 0x15aabf]; [0.56, 1.26, 1.96].forEach((y, r) => { for (let i = 0; i < 9; i++) z.box(0.32, 0.45 + (i % 3) * 0.08, 0.32, bk[(i + r * 2) % 7], 14.6 + i * 0.4, -6.55, y); }); }
    z.f("armchair_pillows", 8, -4.4, 1, 1, 1.1); z.f("lamp_standing", 4.8, -6.1, 0, 0, 1); z.f("rug_oval_A", 19, 0, 1, 0, 1.8, false);
    z.pic(25.9, 2.8, 0, 2, 1, 0xf4f1e8, 0xd9480f); z.pend(24, -3.6, 6.4, 0x74c0fc, 0.4); z.pend(24, 3.6, 6.4, 0x74c0fc, 0.4);
    z.price("990k", 20.6, -1.1, 0.4, 1, 0); z.price("690k", 12, 4.4, 0.4, 0, -1);
    z.a("study", [[21.6, 1.35, -3.6, 18.6, -3.6], [24.4, 1.6, -3.6, 21.6, -1.8], [23.3, 1.0, 3.6, 20.6, 2.4], [12, 1.85, 6.0, 12, 4.2], [8, 1.9, 6.2, 8, 4.4], [25.8, 3.3, 0, 22, 0], [23.9, 1.3, 4.6, 21, 5.2], [16.5, 3.2, -6.55, 16.5, -4.6]]); }
  /* =============== BALCONY & GARDEN (trái, hàng 1 – sau cùng) =============== */
  { const z = zone(-1, 0), gl = new THREE.MeshLambertMaterial({ color: 0xcfe9ff, transparent: true, opacity: 0.3 }); z.accent(0xcfe6c8); z.win(26, 4.8);
    floor("grass", -24, -10, -33, -25, 0.02);
    for (let v = -6.6; v <= 6.7; v += 1.1) z.box(0.08, 0.9, 0.08, WOOD3, 25.6, v, 0); z.box(0.12, 0.08, 13.6, WOOD3, 25.6, 0, 0.9); z.box(0.06, 0.04, 13.6, WOOD3, 25.6, 0, 0.45);   // lan can gỗ ban công
    z.f("table_medium", 15, 0, 0, 1, 0.9); [[13.7, 0, 1, 0], [16.3, 0, -1, 0], [15, 1.4, 0, -1], [15, -1.4, 0, 1]].forEach(([u, v, fu, fv]) => z.f("chair_B_wood", u, v, fu, fv, 1));
    z.cyl(0.06, 3.0, 0xf1f3f5, 15, 0, 0, 8); { const um = new THREE.Mesh(new THREE.ConeGeometry(2.3, 0.7, 10), mat(0xe8590c)); um.position.set(cx + z.X(15), 3.2, cz + z.Zv(0)); um.userData.flat = true; g.add(um); }   // dù che nắng
    z.f("rug_rectangle_B", 15, 0, 1, 0, 2.2, false);
    [[24.6, -5.6], [24.6, 5.6], [8, -6.3], [8, 6.3]].forEach(([u, v]) => { z.obj(1.8, 0.5, 0.8, WOOD2, u, v, 0); pot(g, cx + z.X(u) - 0.5, cz + z.Zv(v), 1.2); pot(g, cx + z.X(u) + 0.5, cz + z.Zv(v), 1); });   // chậu hoa
    bigTree(g, cx + z.X(23), cz + z.Zv(-3.6), 0.8); z.sol(23, -3.6, 0.8, 0.8); bigTree(g, cx + z.X(6), cz + z.Zv(-3.5), 0.55); z.sol(6, -3.5, 0.6, 0.6);
    z.f("cactus_medium_A", 5, 5.6, 0, 0, 1.2);
    // bếp nướng, ghế xếp, ống nước, đèn lồng, cào, thần giữ vườn
    z.cyl(0.55, 0.3, 0x2b2b2b, 21, 5.3, 0.85, 14); z.cyl(0.58, 0.1, 0x495057, 21, 5.3, 1.15, 14); [[-0.4, -0.3], [0.4, -0.3], [0, 0.4]].forEach(([a, b]) => z.cyl(0.03, 0.85, 0x2b2b2b, 21 + a, 5.3 + b, 0, 5)); z.sol(21, 5.3, 1.2, 1.2);
    { const ch = lb(g, 0.8, 0.08, 1.2, 0xf59f00, cx + z.X(10.5), 0.55, cz + z.Zv(5.2)); ch.rotation.z = 0.0; const bk = lb(g, 0.08, 1.1, 0.8, 0xf59f00, cx + z.X(9.8), 1.0, cz + z.Zv(5.2)); bk.rotation.z = -0.4 * -1;   // ghế xếp
      [-0.5, 0.5].forEach(d => z.box(0.06, 0.55, 0.06, 0x8d6a45, 10.5, 5.2 + d, 0)); z.sol(10.5, 5.2, 1, 1.2); }
    { const hs = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.07, 6, 14), mat(0x2f9e44)); hs.rotation.x = Math.PI / 2; hs.position.set(cx + z.X(18), 0.1, cz + z.Zv(-6)); g.add(hs); }   // ống nước tưới
    z.box(0.3, 0.45, 0.3, 0x343a40, 12.5, 0.3, 0); { const ln = lb(g, 0.3, 0.5, 0.3, 0xfab005, cx + z.X(12.5), 0.5, cz + z.Zv(0)); }   // đèn lồng
    z.cyl(0.04, 1.6, 0x8d6a45, 4.2, -6.5, 0, 5); z.box(0.7, 0.05, 0.12, 0x868e96, 4.2, -6.5, 1.6);   // cái cào
    z.cyl(0.28, 0.5, 0xf1f3f5, 19, -5.2, 0, 10); z.sph(0.2, 0xffdbac, 19, 0.7, -5.2); { const hat = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.45, 8), mat(0xe03131)); hat.position.set(cx + z.X(19), 1.05, cz + z.Zv(-5.2)); g.add(hat); }   // thần giữ vườn
    z.pend(15, 0, 7.5, 0xfff3bf, 0.3); z.price("1,590k", 9.4, 3.5, 0.4, 1, 0);
    z.a("garden", [[15, 3.0, 0, 11.5, 0], [10.4, 1.35, 5.2, 8.4, 4.4], [21, 1.5, 5.3, 19.2, 4], [18, 0.6, -6, 18, -4.2], [12.5, 0.9, 0, 12.5, 2.0], [4.2, 1.9, -6.5, 6.2, -5], [19, 1.2, -5.2, 19, -3.4]]); }
  /* =============== KITCHEN (phải, hàng 1 – sau cùng) =============== */
  { const z = zone(1, 0); z.accent(0xfde8c8); z.win(26, 3.2);
    const wm = mat(WHITE), co = 0xf4efe6;
    z.obj(1.0, 2.4, 1.3, 0xf1f3f5, 25.3, -6.1, 0); z.box(0.02, 1.0, 0.05, STEEL, 24.78, -5.7, 1.1); z.box(0.02, 0.05, 1.28, 0x868e96, 24.78, -6.1, 1.35);   // tủ lạnh
    z.obj(0.9, 0.95, 2.1, co, 25.35, -3.7, 0); z.box(1.0, 0.06, 2.2, 0x868e96, 25.35, -3.7, 0.95);
    z.obj(0.9, 0.95, 2.3, co, 25.35, -1.1, 0); z.box(1.0, 0.06, 2.4, 0xdee2e6, 25.35, -1.1, 0.95); z.box(0.7, 0.04, 1.2, 0x495057, 25.2, -1.1, 0.98); z.cyl(0.03, 0.3, STEEL, 25.7, -1.1, 1.0, 6); z.box(0.2, 0.05, 0.05, STEEL, 25.5, -1.1, 1.3);   // bồn rửa + vòi
    z.obj(0.9, 0.95, 1.4, 0xe9ecef, 25.35, 1.4, 0); z.box(0.04, 0.5, 1.2, 0x2b2b2b, 24.88, 1.4, 0.2); [[-0.3, -0.3], [-0.3, 0.3], [0.3, -0.3], [0.3, 0.3]].forEach(([a, b]) => z.cyl(0.17, 0.03, 0x2b2b2b, 25.35 + a, 1.4 + b, 0.95, 10));   // bếp + lò
    z.box(0.7, 0.4, 1.0, STEEL, 25.7, 1.4, 2.4); z.box(0.15, 0.04, 0.4, 0x2b2b2b, 25.0, 1.4, 2.4);   // máy hút mùi
    z.obj(0.9, 0.95, 2.4, co, 25.35, 4.0, 0); z.box(1.0, 0.06, 2.5, 0xdee2e6, 25.35, 4.0, 0.95); z.obj(0.9, 0.95, 1.2, co, 25.35, 6.2, 0); z.box(1.0, 0.06, 1.3, 0xdee2e6, 25.35, 6.2, 0.95);
    [[-3.7, 2.1], [-1.1, 2.3], [4.0, 2.4], [6.2, 1.2]].forEach(([v, w]) => { z.box(0.5, 0.9, w, 0xf8f0e0, 25.7, v, 2.1); z.box(0.02, 0.06, w * 0.6, WOOD3, 25.43, v, 2.45); });   // tủ treo
    z.box(0.45, 0.28, 0.6, 0x495057, 25.1, 4.0, 0.98); z.box(0.04, 0.2, 0.4, 0x74c0fc, 24.86, 4.0, 1.02);   // lò vi sóng
    z.box(0.3, 0.2, 0.4, 0xff8787, 25.2, 5.9, 0.98); z.box(0.04, 0.02, 0.3, 0x212529, 25.04, 5.9, 1.18);   // máy nướng bánh mì
    z.cyl(0.22, 0.3, 0xf1f3f5, 25.2, 6.5, 0.98, 12);   // nồi cơm điện
    // đảo bếp + ghế cao
    z.obj(1.3, 1.0, 3.6, 0xf4efe6, 13, 0, 0); z.box(1.5, 0.08, 3.8, WOOD, 13, 0, 1.0); z.box(0.52, 0.03, 0.9, WOOD3, 13, 1.0, 1.08);   // thớt
    z.cyl(0.2, 0.04, 0x868e96, 13, -0.9, 1.08, 14); z.cyl(0.04, 0.08, 0x2b2b2b, 13.3, -0.9, 1.08, 6);   // chảo
    z.cyl(0.17, 0.2, 0xadb5bd, 12.8, -1.3, 1.08, 12);   // nồi nhỏ
    [-1.2, 0, 1.2].forEach(v => { z.cyl(0.24, 0.07, 0x2f9e44, 11.4, v, 0.8, 12); z.cyl(0.04, 0.8, 0x343a40, 11.4, v, 0, 6); });
    z.f("rug_oval_A", 17, 0, 1, 0, 1.4, false); z.f("cactus_small_B", 4, -6, 0, 0, 1.4);
    z.pend(13, -1, 6.4, 0xf783ac, 0.35); z.pend(13, 1, 6.4, 0xf783ac, 0.35); z.price("2,490k", 9.7, 3.3, 0.4, 1, 0);
    z.a("kitchen", [[25.2, 2.7, -6.1, 22.2, -6.1], [25.35, 1.3, 1.4, 22.6, 1.4], [24.9, 1.1, 1.4, 22.6, 2.8], [25.35, 1.45, -1.1, 22.6, -1.6], [25.2, 1.5, 4.0, 22.8, 4.0], [25.2, 1.35, 5.9, 22.8, 5.5], [25.2, 1.6, 6.5, 22.8, 6.0], [13, 1.35, -0.9, 10.2, -0.9], [12.8, 1.5, -1.3, 10.2, -2.4], [13, 1.4, 1.0, 10.2, 1.8]]); }
  /* =============== BATHROOM (phải, hàng 2) =============== */
  { const z = zone(1, 1), glass = new THREE.MeshLambertMaterial({ color: 0xcfe9ff, transparent: true, opacity: 0.3 }); z.accent(0xcfe8f5); z.win(26, 4.6);
    z.obj(1.7, 0.7, 3.4, WHITE, 24.6, -4.5, 0); z.box(1.3, 0.04, 3.0, 0xbfe6f5, 24.6, -4.5, 0.7); z.cyl(0.04, 0.5, STEEL, 25.8, -4.5, 0.7, 6); z.box(0.3, 0.04, 0.05, STEEL, 25.55, -4.5, 1.15);   // bồn tắm + vòi
    z.obj(0.7, 0.45, 0.8, WHITE, 25.2, 3.4, 0); z.cyl(0.3, 0.1, WHITE, 24.6, 3.4, 0.45, 14); z.box(0.3, 0.9, 0.8, WHITE, 25.8, 3.4, 0.45);   // bồn cầu
    z.obj(2.6, 0.95, 0.8, WOOD, 14, 6.4, 0); z.box(2.7, 0.06, 0.9, WHITE, 14, 6.4, 0.95); z.cyl(0.3, 0.08, 0xdbeafe, 14, 6.4, 1.0, 14); z.cyl(0.03, 0.3, STEEL, 14, 6.75, 1.0, 6);   // chậu rửa
    z.box(1.6, 1.6, 0.05, 0xdff1fa, 14, 6.8, 1.7); z.box(1.7, 1.7, 0.03, WOOD3, 14, 6.84, 1.65);   // gương
    z.box(1.5, 0.06, 1.5, 0xe9ecef, 14, -6.0, 0); z.sol(14, -6.0, 1.5, 1.5); [[-0.75, 0], [0.75, 0]].forEach(([d]) => 0); lb(g, 1.5, 2.4, 0.03, glass, cx + z.X(14), 1.25, cz + z.Zv(-5.25)); lb(g, 0.03, 2.4, 1.5, glass, cx + z.X(13.25), 1.25, cz + z.Zv(-6.0));   // buồng tắm vòi sen
    z.cyl(0.03, 1.2, STEEL, 14, -6.75, 1.4, 6); z.cyl(0.18, 0.05, STEEL, 14, -6.5, 2.55, 10); z.box(0.4, 0.05, 0.05, STEEL, 14, -6.65, 2.55);   // vòi sen
    z.box(0.05, 0.08, 1.4, STEEL, 6, 6.82, 1.6); [0xff8787, 0x74c0fc, 0xffe066].forEach((c, i) => z.box(0.06, 0.5, 0.3, c, 6, 6.2 + (i - 1) * 0.45, 1.1));   // giá khăn tắm
    z.box(1.4, 0.04, 0.8, 0x38d9a9, 20, 0, 0.0); z.box(0.2, 0.2, 0.5, 0xf1f3f5, 25.3, -2.2, 0.7); z.cyl(0.08, 0.3, 0xff6b6b, 25.2, -5.5, 0.7, 8);
    z.cyl(0.08, 0.28, 0x4dabf7, 14.9, 6.5, 1.0, 8); z.box(0.1, 0.18, 0.1, 0xff922b, 13.4, 6.5, 1.0); z.box(0.12, 0.28, 0.12, 0xe9ecef, 25.4, 4.6, 0.0);
    z.pend(14, 0, 6.6, 0xdbeafe, 0.4); z.price("1,990k", 21.2, -1.5, 0.4, 1, 0); z.price("2,390k", 11.8, 4.2, 0.4, 0, -1);
    z.a("bathroom", [[24.6, 0.95, -4.5, 21.8, -4.5], [25.2, 1.2, 3.4, 22.8, 3.4], [14, 1.45, 6.4, 14, 4.6], [14, 2.9, -6.5, 14, -3.8], [14.9, 1.35, 6.5, 16.6, 4.8], [13.4, 1.25, 6.5, 12.0, 4.8], [14, 1.35, 6.2, 14, 4.2], [20, 0.35, 0, 20, 1.6], [25.4, 0.5, 4.6, 22.8, 5.0], [25.2, 1.1, -5.5, 22.8, -5.8]]); }
  /* =============== BEDROOM (phải, hàng 3) =============== */
  { const z = zone(1, 2); z.accent(0xdfe6f2); z.win(26, 5.2);
    z.f("rug_rectangle_stripes_A", 18.5, 0, 0, 1, 1.9, false);
    z.obj(2.4, 0.45, 3.2, WOOD2, 23.8, 0, 0); z.box(2.3, 0.3, 3.0, WHITE, 23.8, 0, 0.45); z.box(1.5, 0.14, 3.02, 0x9bb7d4, 23.0, 0, 0.75); z.box(0.15, 1.5, 3.4, WOOD3, 25.15, 0, 0.2);   // giường đôi
    [-0.9, 0.9].forEach(v => z.box(0.5, 0.18, 1.1, 0xffffff, 24.5, v, 0.75)); z.box(0.7, 0.1, 3.0, 0xf6c667, 21.9, 0, 0.45);   // gối + chăn gấp cuối giường
    [-2.5, 2.5].forEach(v => { z.f("table_small", 24.8, v, -1, 0, 0.6); z.cyl(0.1, 0.18, 0xffffff, 24.8, v, 0.6, 8); { const lm = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.3, 10), mat(0xfff3bf)); lm.position.set(cx + z.X(24.8), 0.95, cz + z.Zv(v)); g.add(lm); } });
    z.obj(4, 3.4, 1.2, 0xf4efe6, 14, -6.2, 0); [-1, 0, 1].forEach(k => { z.box(1.3, 3.0, 0.04, 0xe9e0cf, 14 + k * 1.33, -5.58, 0.2); z.box(0.05, 0.3, 0.06, 0x868e96, 14 + k * 1.33 + 0.5, -5.55, 1.6); });   // tủ quần áo
    z.f("cabinet_medium_decorated", 14, 6.3, 0, -1, 1.1); z.box(1.5, 1.7, 0.05, 0xdff1fa, 14, 6.8, 2.2); z.box(1.6, 1.8, 0.03, WOOD3, 14, 6.84, 2.15);   // tủ ngăn kéo + gương
    z.f("armchair_pillows", 7, 4.2, 1, -1, 1.0); z.f("lamp_standing", 4.6, 6.2, 0, 0, 1);
    z.pic(25.9, 3.2, 0, 2.2, 1, 0xdfe6f2, 0x4f7cac); [-1, 1].forEach(k => z.box(0.15, 2.8, 0.7, 0xb8c4d9, 25.8, 5.2 + k * 1.9, 0));
    z.cyl(0.12, 0.06, 0xf59f00, 24.8, -2.5, 0.6, 12); z.box(0.2, 0.1, 0.12, 0xff6b6b, 19.4, 1.8, 0.02); z.box(0.14, 0.05, 0.3, 0xffffff, 19.4, 2.2, 0.02);   // đồng hồ báo thức (trên bàn) + dép
    z.pend(20, -3, 6.4, 0xf6c667, 0.4); z.pend(20, 3, 6.4, 0xf6c667, 0.4);
    z.price("3,990k", 21, -2.8, 0.4, 1, 0); z.price("1,290k", 11, 3.7, 0.4, 0, 1); z.price("590k", 11, -4.4, 0.4, 0, 1);
    z.a("bedroom", [[23.8, 1.1, 0, 21, -0.4], [24.5, 1.15, 0.9, 21, 1.5], [22.3, 0.95, 0, 20.0, -0.9], [14, 3.6, -6.2, 14, -4.2], [24.8, 0.9, 2.5, 22.0, 3.2], [24.8, 1.35, -2.5, 22.0, -3.0], [14, 1.95, 6.3, 14, 4.5], [14, 2.9, 6.6, 12, 5.0], [19.4, 0.4, 1.8, 17.6, 2.6]]); }
  /* =============== KIDS' BEDROOM (phải, hàng 4) =============== */
  { const z = zone(1, 3); z.accent(0xfff0b3); z.win(26, -4.5);
    z.f("rug_oval_A", 14, 0, 1, 0, 1.6, false);
    z.obj(1.6, 0.2, 3.0, WOOD3, 23.5, -4.8, 0); [[-0.7, -1.4], [0.7, -1.4], [-0.7, 1.4], [0.7, 1.4]].forEach(([a, b]) => z.box(0.1, 2.7, 0.1, WOOD2, 23.5 + a, -4.8 + b, 0)); z.box(1.5, 0.25, 2.9, 0x74c0fc, 23.5, -4.8, 0.2); z.box(1.5, 0.25, 2.9, 0xffd43b, 23.5, -4.8, 1.5); z.box(0.06, 0.6, 3.0, WOOD2, 22.75, -4.8, 1.75); z.box(0.06, 0.6, 3.0, WOOD2, 24.25, -4.8, 1.75); [0.3, 0.8, 1.3, 1.8, 2.3].forEach(y => z.box(0.5, 0.06, 0.06, WOOD3, 22.6, -3.0, y));   // giường tầng + thang
    z.f("bed_single_A", 23.5, 3.4, 0, 1, 0.9);
    z.f("table_small", 13, -6.2, 0, 0, 0.8); z.f("chair_A_wood", 13, -5.0, 0, -1, 0.7); [[0xe03131, 0.2], [0x2f9e44, 0.0], [0x1c7ed6, -0.2]].forEach(([c, d]) => z.cyl(0.03, 0.18, c, 13.2 + d, -6.2, 0.8, 6));   // bàn + bút màu
    z.obj(1.2, 0.7, 1.0, 0xff8787, 5.2, 6.2, 0); z.box(1.3, 0.12, 1.1, 0xffd43b, 5.2, 6.2, 0.7); z.box(0.04, 0.3, 0.6, 0xffffff, 4.58, 6.2, 0.3);   // hộp đồ chơi
    z.sph(0.35, 0xc68642, 15, 0.5, 2.0); z.sph(0.25, 0xc68642, 15, 1.0, 2.0); z.sph(0.09, 0xc68642, 14.8, 1.18, 2.0); z.sph(0.09, 0xc68642, 15.2, 1.18, 2.0); z.sph(0.14, 0xf1d1a5, 15, 0.95, 2.2, 1, 0.8, 0.5);   // gấu bông
    [[12, 0, 0xe03131], [12.35, 0, 0x1c7ed6], [12.18, 0, 0xfab005], [12.18, 0.12, 0x2f9e44]].forEach(([u, v, c], i) => z.box(0.3, 0.3, 0.3, c, u, -1 + v + (i > 2 ? 0 : 0), i > 2 ? 0.3 : 0));   // khối xếp hình
    { const dh = z.obj(1.6, 1.0, 1.4, 0xffc9c9, 20, 6.0, 0); const rf = new THREE.Mesh(new THREE.ConeGeometry(1.2, 0.8, 4), mat(0xe03131)); rf.rotation.y = Math.PI / 4; rf.position.set(cx + z.X(20), 1.4, cz + z.Zv(6.0)); g.add(rf); z.box(0.04, 0.5, 0.4, 0x8d5a2b, 19.28, 6.0, 0); }   // nhà búp bê
    { const tp = new THREE.Mesh(new THREE.ConeGeometry(1.0, 1.9, 8), mat(0xfff3bf)); tp.position.set(cx + z.X(8), 0.95, cz + z.Zv(-4.6)); g.add(tp); z.sol(8, -4.6, 1.0, 1.0); const fl = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.5, 6), mat(0xe03131)); fl.position.set(cx + z.X(8), 0.4, cz + z.Zv(-3.9)); g.add(fl); }   // lều chơi
    z.cyl(0.12, 0.06, 0xffd43b, 25.2, 1.2, 1.0, 10); z.box(0.14, 0.3, 0.14, 0xfff3bf, 25.9, 1.2, 1.1);   // đèn ngủ + kệ
    z.box(0.08, 0.5, 0.5, 0xffd43b, 25.95, -1.5, 2.8); z.box(0.08, 0.4, 0.4, 0xff8787, 25.95, 0.8, 3.2); z.box(0.08, 0.5, 0.5, 0x74c0fc, 25.95, 2.2, 2.5);   // sticker sao dán tường
    z.f("shelf_B_large_decorated", 25.6, 1.2, -1, 0, 1.0, false, 1.3);
    z.pend(14, -3, 6.4, 0xff8787, 0.4); z.pend(14, 3, 6.4, 0x74c0fc, 0.4); z.price("2,290k", 20.8, -4.2, 0.4, 1, 0); z.price("990k", 10.7, -3.3, 0.4, 0, 1);
    z.a("kids", [[23.5, 2.9, -4.8, 21.3, -4.8], [5.2, 1.4, 6.2, 5.2, 4.4], [15, 1.35, 2.0, 15, 4.0], [12.2, 0.85, -1, 10.2, -1], [20, 2.3, 6.0, 20, 4.2], [25.2, 1.55, 1.2, 22.6, 1.2], [8, 2.2, -4.6, 8, -2.4], [13.2, 1.15, -6.2, 15, -5.2]]); }
  /* =============== MARKET HALL (hàng trước-trái): đồ nhỏ trong nhà =============== */
  { const tbl = (x, z) => { B(4.6, 0.12, 1.8, WOOD, x, 0.95, z); [[-2.1, -0.7], [2.1, -0.7], [-2.1, 0.7], [2.1, 0.7]].forEach(([a, b]) => B(0.12, 0.9, 0.12, WOOD3, x + a, 0.45, z + b)); B(4.4, 0.06, 1.6, WOOD2, x, 0.3, z); sol(x, z, 2.3, 0.9); }, Y = 1.01;
    const stack = (x, z, n, c, r, h) => { for (let i = 0; i < n; i++) C(r, r, h, i % 2 ? c : 0xffffff, x, Y + h / 2 + i * h, z, 14); };
    [[-25, 26], [-17, 26], [-25, 32], [-17, 32]].forEach(([x, z]) => tbl(x, z));
    stack(-27, 25.6, 5, 0x74c0fc, 0.28, 0.06); stack(-26.2, 26.3, 4, 0xffa8a8, 0.22, 0.07); C(0.3, 0.3, 0.4, 0xe03131, -25.2, Y + 0.2, 25.6, 14); SPH(0.28, 0xe03131, -25.2, Y + 0.55, 25.6, 1, 0.8, 1); B(0.4, 0.07, 0.07, 0xe03131, -24.85, Y + 0.45, 25.6); C(0.05, 0.05, 0.15, 0xe03131, -25.2, Y + 0.9, 25.6, 6);   // đĩa, ấm trà
    [[-24, 0x74c0fc], [-23.4, 0xffe066], [-22.8, 0x69db7c]].forEach(([x, c]) => { C(0.22, 0.22, 0.45, 0xe9f5ff, x, Y + 0.22, 26.2, 12); C(0.23, 0.23, 0.1, c, x, Y + 0.5, 26.2, 12); });   // hũ thủy tinh
    [[-18.4, 0x38d9a9], [-17.5, 0xff8787], [-16.6, 0x74c0fc]].forEach(([x, c]) => { for (let i = 0; i < 4; i++) B(0.8, 0.12, 0.6, i % 2 ? 0xffffff : c, x, Y + 0.06 + i * 0.12, 25.6); });   // khăn tắm gấp
    [[-17.8, 0xffd43b], [-16.9, 0xff922b], [-16.0, 0x9775fa]].forEach(([x, c]) => SPH(0.4, c, x, Y + 0.2, 26.5, 1, 0.5, 1));   // gối
    B(1.0, 0.1, 0.9, 0xe9ecef, -19.2, Y + 0.05, 26.2); B(1.0, 0.04, 0.9, 0x4dabf7, -19.2, Y + 0.12, 26.2); B(1.0, 0.04, 0.9, 0xffffff, -19.2, Y + 0.16, 26.2);   // khăn trải bàn gấp
    [[-26.6, 0xe9d8a6], [-25.6, 0x6aa84f]].forEach(([x, c], i) => { const fr = B(0.7, 0.9, 0.06, WOOD3, x, Y + 0.45, 32); fr.rotation.x = -0.25; const pc = B(0.55, 0.72, 0.07, c, x, Y + 0.47, 32.02); pc.rotation.x = -0.25; });   // khung ảnh
    pot(g, cx - 24.2, cz + 32.2, 1.1); pot(g, cx - 23.5, cz + 31.8, 0.8);   // chậu cây
    [-23.2, -22.9].forEach((x, i) => { C(0.17, 0.17, 0.25, i ? 0xffd8a8 : 0xd0bfff, x, Y + 0.12, 31.4, 12); SPH(0.05, 0xffa94d, x, Y + 0.3, 31.4, 0.7, 1.3, 0.7); });   // chân nến
    [-18.4, -17.4].forEach((x, i) => { C(0.4, 0.3, 0.4, 0xc99a5b, x, Y + 0.2, 32, 14); C(0.38, 0.38, 0.03, 0x8a6a3a, x, Y + 0.38, 32, 14); });   // giỏ đan
    { const cl = C(0.4, 0.4, 0.08, 0xffffff, -15.9, Y + 0.6, 32, 20); cl.rotation.x = Math.PI / 2; C(0.43, 0.43, 0.06, 0x343a40, -15.9, Y + 0.6, 31.97, 20).rotation.x = Math.PI / 2; B(0.04, 0.3, 0.02, 0x212529, -15.9, Y + 0.66, 32.06); B(0.2, 0.04, 0.02, 0x212529, -15.85, Y + 0.6, 32.06); B(0.12, 0.5, 0.12, WOOD3, -15.9, Y + 0.25, 31.9); }   // đồng hồ để bàn
    // kệ sát tường (tường bắc + tường tây) với hàng hóa nhiều màu
    const shelf = (x, z, len, ax) => { const o = ax === "x"; B(o ? len : 0.5, 2.8, o ? 0.5 : len, WOOD2, x, 1.4, z); sol(x, z, o ? len / 2 : 0.25, o ? 0.25 : len / 2);
      for (let r = 0; r < 4; r++) { B(o ? len : 0.6, 0.06, o ? 0.6 : len, WOOD3, x, 0.35 + r * 0.7, z); for (let i = 0; i < Math.floor(len / 0.6); i++) { const c = [0xff8787, 0x74c0fc, 0xffe066, 0x69db7c, 0xd0bfff, 0xffffff][(i + r * 2) % 6], a = -len / 2 + 0.4 + i * 0.6; if ((i + r) % 3) B(0.3, 0.3, 0.3, c, o ? x + a : x, 0.53 + r * 0.7, o ? z : z + a); else C(0.15, 0.15, 0.4, c, o ? x + a : x, 0.56 + r * 0.7, o ? z : z + a, 10); } } };
    shelf(-19, 21.5, 18, "x"); shelf(-29.4, 28.8, 14, "z");
    [-27, -22, -17, -12].forEach(x => { const cl = C(0.45, 0.45, 0.08, 0xffffff, x, 3.9, 21.35, 20); cl.rotation.x = Math.PI / 2; C(0.5, 0.5, 0.06, 0xb88a55, x, 3.9, 21.32, 20).rotation.x = Math.PI / 2; B(0.04, 0.3, 0.02, 0x212529, x, 3.95, 21.4); B(0.2, 0.04, 0.02, 0x212529, x + 0.05, 3.9, 21.4); });   // đồng hồ treo
    pic(-29.5, 4.0, 25, Math.PI / 2, 1.2, 0.9, 0xf2a65a, 0x4f7cac); pic(-29.5, 4.0, 31, Math.PI / 2, 1.2, 0.9, 0x6aa84f, 0xf6e7b4);
    pend(-21, 29, 6.5, 0xf6c667, 0.5); pend(-15, 29, 6.5, 0xf6c667, 0.5); price("49k", -26, 0, 25.0, 0); price("79k", -17.5, 0, 25.0, 0); price("129k", -25, 0, 31.0, 0); price("59k", -17, 0, 31.0, 0);
    A("market", [[-26.2, Y + 0.9, 26.0, -26.0, 28.4], [-24, Y + 0.7, 26.2, -24, 28.4], [-17.6, Y + 0.65, 25.6, -17.6, 28.4], [-16.4, Y + 0.7, 26.5, -16.4, 28.4], [-19.2, Y + 0.5, 26.2, -20.6, 28.4], [-26.1, Y + 1.0, 32, -26.1, 29.8], [-24, Y + 0.9, 32, -24.2, 29.8], [-23, Y + 0.65, 31.4, -22.6, 29.8], [-18, Y + 0.7, 32, -18, 29.8], [-15.9, Y + 1.15, 32, -15.9, 29.8]].map(([x, y, z, sx, sz]) => [cx + x, y, cz + z, cx + sx, cz + sz])); }
  /* =============== CHECKOUT: quầy thu ngân + quầy tư vấn (Omar) cạnh cửa ra =============== */
  { B(3.4, 1.0, 1.0, WOOD, -6.9, 0.5, 25.8); B(3.6, 0.08, 1.2, WHITE, -6.9, 1.04, 25.8); sol(-6.9, 25.8, 1.8, 0.6);
    B(0.55, 0.35, 0.45, DARK, -7.6, 1.25, 25.4); B(0.5, 0.3, 0.04, 0x4c8cc5, -7.6, 1.5, 25.6); B(0.3, 0.1, 0.25, 0x495057, -6.5, 1.12, 25.9); B(0.5, 0.35, 0.3, 0x8d5a2b, -5.6, 1.22, 25.8); B(0.3, 0.3, 0.2, 0xf6e7b4, -8.2, 1.2, 25.9);   // máy tính tiền, máy quẹt thẻ, túi giấy, thẻ quà
    B(3.4, 1.0, 1.0, WOOD2, 6.9, 0.5, 25.8); B(3.6, 0.08, 1.2, WHITE, 6.9, 1.04, 25.8); sol(6.9, 25.8, 1.8, 0.6); sol(6.6, 24.8, 0.4, 0.4);
    F("cactus_small_B", 5.8, 25.8, 0, 0.9, 0, 0, 1.08); F("book_set", 7.6, 25.7, 0, 1.0, 0, 0, 1.25); B(0.5, 0.35, 0.45, DARK, 8.2, 1.25, 25.4);
    sign("CASH · THU NGÂN", 2.4, -6.9, 0.7, 26.34, 0, "#2b6cb0", "#ffffff"); sign("SELLER · BÁN HÀNG", 2.4, 6.9, 0.7, 26.34, 0, "#8d5a2b", "#fff3d6");
    [-1, 1].forEach(s => { C(0.015, 0.015, H - 7.6, DARK, s * 2.4, (H + 7.6) / 2, 22.2, 4); });
    for (let i = 0; i < 3; i++) { B(0.8, 0.12, 1.1, STEEL, -8.1, 0.7, 33 + i * 0.9 - 0.9 + 0.0); B(0.04, 0.6, 1.1, STEEL, -8.1, 1.0, 33 + i * 0.9 - 0.9); B(0.7, 0.04, 0.04, 0x343a40, -7.7, 1.3, 33 + i * 0.9 - 0.9); }   // xe đẩy
    sol(-8.1, 33.0, 0.4, 1.4); for (let i = 0; i < 4; i++) C(0.3, 0.26, 0.28, 0xe03131, 8.0, 0.16 + i * 0.28, 34.5, 12); sol(8.0, 34.5, 0.35, 0.35); for (let i = 0; i < 3; i++) C(0.3, 0.26, 0.28, 0x2b8a3e, 8.0, 0.16 + i * 0.28, 33.6, 12);
    A("checkout", [[8.0, 1.5, 34.5, 6.4, 34.5], [-8.1, 1.2, 33.0, -6.4, 33.0], [-5.6, 1.6, 25.8, -5.0, 27.5], [-8.2, 1.55, 25.9, -8.0, 27.6]].map(([x, y, z, sx, sz]) => [cx + x, y, cz + z, cx + sx, cz + sz])); }
  /* =============== LAUNDRY & STORAGE (hàng trước-phải) =============== */
  { [23, 25.2, 27.4, 29.6].forEach((z, i) => { B(1.1, 1.5, 1.2, i === 3 ? 0xced4da : WHITE, 29.4, 0.75, z); C(0.4, 0.4, 0.06, 0x495057, 28.82, 0.85, z, 20).rotation.z = Math.PI / 2; C(0.3, 0.3, 0.04, 0x74c0fc, 28.78, 0.85, z, 20).rotation.z = Math.PI / 2; B(0.6, 0.12, 0.04, 0xadb5bd, 28.85, 1.35, z); });
    sol(29.4, 26.3, 0.6, 4.0);
    [[26.4, 31.8], [27.3, 33.0]].forEach(([x, z]) => { C(0.5, 0.42, 0.9, 0xd9b38c, x, 0.45, z, 14); C(0.46, 0.46, 0.04, 0x8a6a3a, x, 0.92, z, 14); sol(x, z, 0.5, 0.5); }); B(0.6, 0.3, 0.5, 0x74c0fc, 26.4, 1.05, 31.8);   // giỏ đồ giặt
    B(1.9, 0.07, 0.55, 0xf1f3f5, 17.4, 0.95, 28.4); [[-0.7, -0.2], [0.7, -0.2], [-0.7, 0.2], [0.7, 0.2]].forEach(([a, b]) => B(0.05, 0.92, 0.05, 0x495057, 17.4 + a, 0.46, 28.4 + b)); sol(17.4, 28.4, 1.0, 0.35); B(0.34, 0.14, 0.2, 0xe03131, 18.2, 1.05, 28.4); B(0.1, 0.1, 0.2, 0x212529, 18.2, 1.2, 28.4);   // bàn ủi + bàn là
    [-0.7, 0, 0.7].forEach(d => B(0.03, 1.5, 1.4, 0xadb5bd, 21.8 + d, 0.8, 23.8)); B(2.2, 0.03, 0.03, 0xadb5bd, 21.8, 1.5, 23.2); B(2.2, 0.03, 0.03, 0xadb5bd, 21.8, 1.5, 24.4); [[-0.7, 0xff8787], [0, 0x74c0fc], [0.7, 0xffe066]].forEach(([d, c]) => B(0.04, 0.6, 0.5, c, 21.8 + d, 1.2, 23.8)); sol(21.8, 23.8, 1.2, 0.8);   // giá phơi đồ
    [[13.5, 0], [18.5, 0], [23.5, 0]].forEach(([x, a], k) => { B(4.4, 3.0, 0.7, 0xdee2e6, x, 1.5, 21.85); for (let r = 0; r < 4; r++) { B(4.4, 0.06, 0.8, STEEL, x, 0.2 + r * 0.85, 21.85); for (let i = 0; i < 3; i++) B(1.1, 0.5, 0.6, [0x74c0fc, 0xffa8a8, 0xffe066, 0xb2f2bb][(i + r + k) % 4], x - 1.4 + i * 1.4, 0.5 + r * 0.85, 21.85); } sol(x, 21.85, 2.2, 0.4); });   // kệ + hộp lưu trữ
    B(2.0, 1.0, 0.6, WOOD, 11.6, 0.5, 22.6); [0.3, 0.8].forEach(y => B(2.0, 0.04, 0.6, WOOD3, 11.6, y, 22.6)); [[-0.6], [0], [0.6]].forEach(([d], i) => { B(0.4, 0.15, 0.2, [0xff6b6b, 0x4dabf7, 0xffd43b][i], 11.6 + d, 1.05, 22.6); B(0.4, 0.15, 0.2, [0x69db7c, 0xf783ac, 0x9775fa][i], 11.6 + d, 0.55, 22.6); }); sol(11.6, 22.6, 1.0, 0.3);   // kệ giày
    C(0.35, 0.35, 0.5, 0xe03131, 12.4, 0.3, 34.2, 14); C(0.35, 0.35, 0.1, 0x343a40, 12.4, 0.55, 34.2, 14); C(0.04, 0.04, 1.3, 0x343a40, 12.6, 1.2, 34.2, 6); B(0.3, 0.06, 0.12, 0x343a40, 12.6, 1.85, 34.2); sol(12.4, 34.2, 0.5, 0.5);   // máy hút bụi
    pend(18, 28.5, 6.5, 0xdbeafe, 0.4); price("5,990k", 27.2, 1.9, 24.4, 0); price("190k", 20, 1.55, 25.6, 0);
    A("laundry", [[28.0, 1.95, 25.2, 26.0, 25.2], [26.4, 1.5, 31.8, 24.8, 31.8], [18.2, 1.45, 28.4, 18.2, 30.0], [17.0, 1.15, 28.4, 17.0, 30.0], [18.5, 2.9, 21.85, 18.5, 23.6], [11.6, 1.5, 22.6, 11.6, 24.4], [12.5, 1.7, 34.2, 14.4, 34.2], [21.8, 1.9, 23.8, 21.8, 26.2]].map(([x, y, z, sx, sz]) => [cx + x, y, cz + z, cx + sx, cz + sz])); }
  /* =============== kết thúc =============== */
  P.anchors = anch;
  g.traverse(o => { if (o.isMesh && o.position.y > 6) o.userData.flat = true; });
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
  P.keeperPos = [6.6, 24.8];
}
INTERIORS["homecozy"] = {
  furnish: furnishHomeCozy,
  customWalls: true,
  bright: true
};

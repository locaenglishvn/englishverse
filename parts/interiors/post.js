/* EnglishVerse – nội thất "post" (layout: "posthall"). Tách khỏi index.html để mỗi nơi 1 file (xem docs/TEAM.md).
   Dùng các hàm chung của index.html (lb, lc, mat, skin, face, textPlate, addBox…) – chúng có sẵn khi nội thất được dựng. */
/* POST OFFICE – sảnh lớn theo Bưu điện Trung tâm Sài Gòn: mái vòm cong có giếng trời, sườn sắt xanh, tường kem cửa vòm,
   cột sắt xanh, quầy giao dịch 2 bên, quầy lưu niệm đỏ giữa sảnh, ghế gỗ, bản đồ cổ + đồng hồ ở tường cuối, buồng điện thoại, bàn viết thư. */
const HW = {};
function hallWall(len, h, end) {   // tường kem: hàng cửa sổ vòm phía trên, quầy/ô cửa xanh phía dưới
  const k = len + "x" + h + end; if (HW[k]) return HW[k];
  const t = skin(len, h, 20, (x, W, H) => {
    x.fillStyle = "#f3dfb8"; x.fillRect(0, 0, W, H); x.fillStyle = "#e6cc9a"; x.fillRect(0, H - 3.2, W, 0.25); x.fillRect(0, 2.4, W, 0.3);
    if (end) { x.fillStyle = "#e9d3a5"; archPath(x, W / 2 - 5, 0.8, 10, H - 0.8); x.fill(); return; }
    for (let X = 1; X < W - 2; X += 4) { x.fillStyle = "#ffffff"; archPath(x, X - 0.15, 0.25, 2.3, 2.1); x.fill(); x.fillStyle = "#cfe3ee"; archPath(x, X, 0.4, 2, 1.95); x.fill(); x.strokeStyle = "#1f5c3a"; x.lineWidth = 0.06; for (let i = 0.5; i < 2; i += 0.5) { x.beginPath(); x.moveTo(X + i, 0.6); x.lineTo(X + i, 2.35); x.stroke(); } }
    for (let X = 0.4; X < W; X += 4) { x.fillStyle = "#1f5c3a"; x.fillRect(X, H - 3, 3.2, 2.4); x.fillStyle = "#3d6b55"; for (let i = 0; i < 4; i++) x.fillRect(X + 0.2 + i * 0.75, H - 2.8, 0.6, 1.6); }   // ô cửa sắt xanh tầng dưới
  });
  return HW[k] = new THREE.MeshLambertMaterial({ map: t });
}
const fans = [];
function furnishPostHall(P, g, cx, cz, W, D, fur) {
  const back = cz - D / 2, front = cz + D / 2, H = (P.size || {}).h || 9, S = P.room.solids, R = W / 2, GREEN = 0x1f5c3a;
  const sol = (x, z, hw, hd) => S.push({ x, z, hw, hd });
  const tile = skin(2, 2, 64, (x) => { x.fillStyle = "#efe6d2"; x.fillRect(0, 0, 2, 2); x.fillStyle = "#2f4f3f"; x.beginPath(); x.moveTo(1, 0.4); x.lineTo(1.6, 1); x.lineTo(1, 1.6); x.lineTo(0.4, 1); x.fill(); x.fillStyle = "#c7b28a"; x.fillRect(0, 0, 0.25, 0.25); x.fillRect(1.75, 1.75, 0.25, 0.25); x.fillRect(1.75, 0, 0.25, 0.25); x.fillRect(0, 1.75, 0.25, 0.25); });
  tile.wrapS = tile.wrapT = THREE.RepeatWrapping; tile.repeat.set(W / 2, D / 2); g.children[0].material = new THREE.MeshLambertMaterial({ map: tile });
  // MÁI VÒM: nửa ống trụ + sườn sắt xanh + dải giếng trời
  const vt = skin(8, 4, 40, (x, Wd, Hh) => { x.fillStyle = "#f6e7c4"; x.fillRect(0, 0, Wd, Hh); x.strokeStyle = "#e3cc9b"; x.lineWidth = 0.05; for (let i = 0; i < Wd; i += 0.5) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, Hh); x.stroke(); }
    x.fillStyle = "#e7f5ff"; x.fillRect(Wd * 0.36, 0, Wd * 0.28, Hh); x.strokeStyle = "#1f5c3a"; x.lineWidth = 0.08; for (let i = Wd * 0.36; i <= Wd * 0.64; i += 0.45) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, Hh); x.stroke(); } for (let j = 0; j < Hh; j += 0.6) { x.beginPath(); x.moveTo(Wd * 0.36, j); x.lineTo(Wd * 0.64, j); x.stroke(); } });
  vt.wrapT = THREE.RepeatWrapping; vt.repeat.set(1, D / 4);
  const vault = new THREE.Mesh(new THREE.CylinderGeometry(R, R, D, 36, 1, true, Math.PI / 2, Math.PI), new THREE.MeshLambertMaterial({ map: vt, side: THREE.DoubleSide }));
  vault.rotation.x = Math.PI / 2; vault.position.set(cx, H, cz); vault.userData.flat = true; g.add(vault);
  for (let z = back + 2; z <= front - 1.9; z += 4) { const rib = new THREE.Mesh(new THREE.TorusGeometry(R - 0.15, 0.16, 6, 28, Math.PI), new THREE.MeshLambertMaterial({ color: GREEN })); rib.position.set(cx, H, z); rib.userData.flat = true; g.add(rib); }
  [[back + 0.02, 0], [front - 0.02, Math.PI]].forEach(([z, ry], i) => {   // 2 đầu vòm: tường sau (đồng hồ), tường trước (cửa sổ quạt)
    const cap = skin(2 * R, R, 20, (x, Wd, Hh) => { x.fillStyle = "#f3dfb8"; x.fillRect(0, 0, Wd, Hh);
      if (i) { x.fillStyle = "#cfe3ee"; x.beginPath(); x.arc(Wd / 2, Hh, Hh * 0.7, Math.PI, 0); x.fill(); x.strokeStyle = "#1f5c3a"; x.lineWidth = 0.12; for (let a = 0; a <= Math.PI; a += Math.PI / 10) { x.beginPath(); x.moveTo(Wd / 2, Hh); x.lineTo(Wd / 2 + Math.cos(a + Math.PI) * Hh * 0.7, Hh + Math.sin(a + Math.PI) * Hh * 0.7); x.stroke(); } }
      else { x.fillStyle = "#e9d3a5"; x.beginPath(); x.arc(Wd / 2, Hh, Hh * 0.75, Math.PI, 0); x.fill(); } });
    const m = new THREE.Mesh(new THREE.CircleGeometry(R, 32, 0, Math.PI), new THREE.MeshLambertMaterial({ map: cap, side: THREE.DoubleSide })); m.position.set(cx, H, z); m.rotation.y = ry; m.userData.flat = true; g.add(m); });
  // CỘT SẮT XANH
  for (let z = back + 6; z <= front - 5.9; z += 6) [-1, 1].forEach(s => { const x = cx + s * (R - 3.2);
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, H, 10), new THREE.MeshLambertMaterial({ color: GREEN })); c.position.set(x, H / 2, z); g.add(c);
    addBox(g, 0.8, 0.5, 0.8, 0xc9a227, x, H - 0.25, z); addBox(g, 0.7, 0.4, 0.7, GREEN, x, 0.2, z); sol(x, z, 0.3, 0.3); });
  // QUẦY GIAO DỊCH 2 BÊN (ô cửa có số)
  [-1, 1].forEach(s => { const x = cx + s * (R - 2), z0 = back + 4, z1 = front - 12, L = z1 - z0, zc = (z0 + z1) / 2;
    addBox(g, 1, 1.15, L, 0x5c3d2e, x, 0.57, zc); addBox(g, 1.2, 0.08, L, 0xd8d2c4, x, 1.18, zc); sol(x, zc, 0.5, L / 2);
    for (let z = z0; z <= z1 + 0.01; z += 3) { addBox(g, 0.08, 1.3, 0.08, GREEN, x - s * 0.3, 1.85, z); }
    addBox(g, 0.05, 1.1, L, 0xd0ebff, x - s * 0.3, 1.8, zc).material = new THREE.MeshLambertMaterial({ color: 0xd0ebff, transparent: true, opacity: 0.25 });
    addBox(g, 0.1, 0.12, L, GREEN, x - s * 0.3, 2.5, zc);
    for (let n = 0; n < Math.floor(L / 3); n++) { const pl = textPlate(String(n + 1 + (s > 0 ? 10 : 0)), 0.6, 0.35, "#1f5c3a", "#ffd43b"); pl.position.set(x - s * 0.36, 2.75, z0 + 1.5 + n * 3); pl.rotation.y = -s * Math.PI / 2; g.add(pl); }
  });
  // QUẦY LƯU NIỆM ĐỎ GIỮA SẢNH
  addBox(g, 4, 1.1, 2, 0xa61e2e, cx, 0.55, cz - 2); const gl = addBox(g, 3.8, 0.5, 1.8, 0xd0ebff, cx, 1.35, cz - 2); gl.material = new THREE.MeshLambertMaterial({ color: 0xd0ebff, transparent: true, opacity: 0.35 });
  addBox(g, 4.1, 0.08, 2.1, 0x7a1414, cx, 1.62, cz - 2); sol(cx, cz - 2, 2, 1);
  const ks = textPlate("SOUVENIRS · QUA LUU NIEM", 3.6, 0.5, "#a61e2e", "#ffe066"); ks.position.set(cx, 2.5, cz - 2); g.add(ks); addBox(g, 0.08, 0.9, 0.08, 0x7a1414, cx, 2, cz - 2);
  // GHẾ CHỜ: gỗ, mặt ghế đỏ
  [5, 9, 13].forEach(dz => [-1, 1].forEach(s => { const x = cx + s * 4, z = cz + dz;
    addBox(g, 3, 0.12, 0.6, 0xa61e2e, x, 0.48, z); addBox(g, 3, 0.6, 0.1, 0x8d5a2b, x, 0.8, z + 0.3); [-1.3, 1.3].forEach(d => addBox(g, 0.1, 0.45, 0.5, 0x5c3d2e, x + d, 0.22, z)); sol(x, z, 1.5, 0.35); }));
  [[-6.8, 9], [6.8, 9], [-6.8, -6], [6.8, -6]].forEach(([dx, dz]) => { const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.38, 0.8, 12), new THREE.MeshLambertMaterial({ color: 0xffffff })); pot.position.set(cx + dx, 0.4, cz + dz); g.add(pot); sol(cx + dx, cz + dz, 0.5, 0.5);
    for (let k = 0; k < 7; k++) { const lf = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 1.4), new THREE.MeshLambertMaterial({ color: k % 2 ? 0x2b8a3e : 0x40c057 })); lf.position.set(cx + dx, 1.2 + k * 0.15, cz + dz); lf.rotation.set(0.8, k * 0.9, 0); g.add(lf); } });
  // TƯỜNG CUỐI: bản đồ cổ + đồng hồ + bảng tên
  const map = skin(8, 5, 60, (x, Wd, Hh) => { x.fillStyle = "#e9d8a6"; x.fillRect(0, 0, Wd, Hh); x.strokeStyle = "#8d5a2b"; x.lineWidth = 0.15; x.strokeRect(0.1, 0.1, Wd - 0.2, Hh - 0.2);
    x.fillStyle = "#a9c7a0"; x.beginPath(); x.ellipse(2.6, 2.6, 1.8, 1.4, 0.3, 0, 7); x.fill(); x.beginPath(); x.ellipse(5.6, 2.2, 1.5, 1.7, -0.2, 0, 7); x.fill();
    x.fillStyle = "#4dabf7"; x.beginPath(); x.moveTo(4, 0.3); x.bezierCurveTo(3.6, 2, 4.6, 3, 4.1, 4.7); x.lineTo(4.3, 4.7); x.bezierCurveTo(4.8, 3, 3.8, 2, 4.2, 0.3); x.fill();
    x.strokeStyle = "#c92a2a"; x.lineWidth = 0.03; x.setLineDash([0.1, 0.08]); x.beginPath(); x.moveTo(1.5, 3.5); x.lineTo(3, 2); x.lineTo(5.5, 2.5); x.lineTo(6.8, 1); x.stroke(); x.setLineDash([]);
    x.fillStyle = "#3b2a1a"; x.font = "bold 0.35px serif"; x.textAlign = "center"; x.fillText("VERSE CITY · 1891", Wd / 2, 0.6); x.font = "0.22px serif"; x.fillText("Map of telegraph lines", Wd / 2, Hh - 0.35); });
  const mp = new THREE.Mesh(new THREE.PlaneGeometry(8, 5), new THREE.MeshLambertMaterial({ map })); mp.position.set(cx, 4.6, back + 0.1); g.add(mp); addBox(g, 8.4, 5.4, 0.04, 0x8d5a2b, cx, 4.6, back + 0.04);
  const wm = textPlate("🌏 WORLD MAP", 3, 0.4, "#1f5c3a", "#ffffff"); wm.position.set(cx + 7.5, 3.6, back + 0.08); g.add(wm);
  const wmap = skin(3, 2, 60, (x) => { x.fillStyle = "#cfe3ee"; x.fillRect(0, 0, 3, 2); x.fillStyle = "#94d82d"; [[0.6, 0.7, 0.5, 0.35], [0.8, 1.4, 0.25, 0.4], [1.6, 0.7, 0.35, 0.4], [1.7, 1.3, 0.25, 0.35], [2.3, 0.8, 0.45, 0.35], [2.5, 1.5, 0.25, 0.15]].forEach(([a, b, c, d]) => { x.beginPath(); x.ellipse(a, b, c, d, 0, 0, 7); x.fill(); }); x.fillStyle = "#e03131"; x.beginPath(); x.arc(2.35, 1.05, 0.06, 0, 7); x.fill(); });
  const wmm = new THREE.Mesh(new THREE.PlaneGeometry(3, 2), new THREE.MeshLambertMaterial({ map: wmap })); wmm.position.set(cx + 7.5, 2.3, back + 0.08); g.add(wmm);
  const clk = skin(1.6, 1.6, 80, (x) => { x.fillStyle = "#fff"; x.beginPath(); x.arc(0.8, 0.8, 0.76, 0, 7); x.fill(); x.strokeStyle = "#1f5c3a"; x.lineWidth = 0.08; x.stroke(); x.strokeStyle = "#343a40"; x.lineWidth = 0.05; x.beginPath(); x.moveTo(0.8, 0.8); x.lineTo(0.8, 0.3); x.moveTo(0.8, 0.8); x.lineTo(1.15, 0.8); x.stroke(); });
  const ck = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8), new THREE.MeshLambertMaterial({ map: clk, transparent: true })); ck.position.set(cx, 10.6, back + 0.12); g.add(ck);
  const nb = textPlate("VERSE CITY POST OFFICE · BUU DIEN", 7, 0.5, "#1f5c3a", "#ffd43b"); nb.position.set(cx, 1.6, back + 0.08); g.add(nb);
  // BÀN VIẾT THƯ (Uncle Bay) + BUỒNG ĐIỆN THOẠI + LỐI VÀO
  addBox(g, 2, 0.08, 0.9, 0x6f4e37, cx - 6, 0.8, back + 6.7); [-0.9, 0.9].forEach(d => addBox(g, 0.08, 0.8, 0.8, 0x5c3d2e, cx - 6 + d, 0.4, back + 6.7)); sol(cx - 6, back + 6.7, 1, 0.45);
  fur("chair_B_wood", cx - 6, back + 5.6, 0, 1); fur("chair_B_wood", cx - 6, back + 7.8, Math.PI, 1);
  [-1, 1].forEach(s => [front - 8, front - 5].forEach(z => { const x = cx + s * (R - 1);
    addBox(g, 1.3, 2.5, 1.3, 0x6f4e37, x, 1.25, z); addBox(g, 0.05, 1.4, 0.9, 0xd0ebff, x - s * 0.66, 1.5, z); sol(x, z, 0.65, 0.65); }));
  [-1, 1].forEach(s => { addBox(g, 0.7, 1.3, 0.6, 0xf2a516, cx + s * 6, 0.65, front - 2); sol(cx + s * 6, front - 2, 0.35, 0.3); });
  addBox(g, 1, 1.9, 0.7, 0x495057, cx + 8.5, 0.95, front - 1.2); sol(cx + 8.5, front - 1.2, 0.5, 0.35);   // ATM
  // ĐÈN TREO + QUẠT TRẦN
  for (let z = back + 8; z <= front - 6; z += 8) [-4, 4].forEach(dx => { addBox(g, 0.03, H + 3 - 6.2, 0.03, 0x343a40, cx + dx, (H + 3 + 6.2) / 2, z);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 10), new THREE.MeshBasicMaterial({ color: 0xfff3bf })); lamp.position.set(cx + dx, 6, z); g.add(lamp); });
  for (let z = back + 12; z <= front - 10; z += 12) { const f = new THREE.Group(); f.position.set(cx, 7.5, z); g.add(f); fans.push(f); addBox(g, 0.05, H + 4 - 7.5, 0.05, 0x343a40, cx, (H + 4 + 7.5) / 2, z);
    [0, Math.PI / 2].forEach(r => { const b = addBox(f, 2.6, 0.04, 0.3, 0x5c3d2e, 0, 0, 0); b.rotation.y = r; }); }
  g.traverse(o => { if (o.isMesh && o.position.y > 5) o.userData.flat = true; });
  // CHỖ BÀY ĐỒ TỪ VỰNG
  const along = (n, x, y, z0, z1, sx) => Array.from({ length: n }, (_, i) => { const z = z0 + (z1 - z0) * i / (n - 1); return [x, y, z, sx, z]; });
  P.anchors = {
    counter: along(7, cx - R + 2, 1.35, back + 6, front - 14, cx - R + 3.9).concat(along(7, cx + R - 2, 1.35, back + 6, front - 14, cx + R - 3.9)),
    kiosk: [[-1.5, -2.5], [-0.5, -2.5], [0.5, -2.5], [1.5, -2.5], [-1, -1.5], [1, -1.5]].map(([dx, dz]) => [cx + dx, 1.9, cz + dz, cx + dx, cz + 0.4]),
    bench: [[-4, 5], [4, 9], [-4, 13], [6.8, 9]].map(([dx, dz]) => [cx + dx, dx === 6.8 ? 2.4 : 0.85, cz + dz, cx + (dx > 0 ? dx - 1.9 : dx + 1.9), cz + dz + (dx === 6.8 ? 0 : 0.9)]),
    wall: [[cx, 10.6, back + 0.3, cx, back + 3], [cx - 2, 4.6, back + 0.3, cx - 2, back + 3], [cx + 7.5, 2.3, back + 0.3, cx + 7.5, back + 3]],
    booth: [[cx - R + 1, 2.8, front - 8, cx - R + 2.7, front - 8], [cx + R - 1, 1.5, front - 5, cx + R - 2.7, front - 5], [cx + R - 1, 2.8, front - 8, cx + R - 2.7, front - 8]],
    desk: [[-6.7, 0.95], [-6.2, 0.95], [-5.7, 0.95], [-5.2, 0.95], [-6.9, 1.4]].map(([dx, y]) => [cx + dx, y, back + 6.7, cx + dx, back + 8.6]),
    door: [[cx - 6, 1.6, front - 2, cx - 6, front - 3.4], [cx + 8.5, 2.2, front - 1.2, cx + 7.2, front - 2.6]],
    ceiling: [[cx, 7.4, cz, cx, cz + 1.5], [cx + 4, 6, back + 16, cx + 4, back + 16], [cx - 6, 8.6, cz + 6, cx - 6, cz + 6]]
  };
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["posthall"] = {
  furnish: furnishPostHall,
  wall: (len, h, w) => hallWall(len, h, w.x === 0),   // 2 đầu sảnh vẽ khác 2 bên
  bright: true
};

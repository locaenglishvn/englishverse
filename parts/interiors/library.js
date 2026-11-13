/* EnglishVerse – nội thất "library" (layout: "oval"). Tách khỏi index.html để mỗi nơi 1 file (xem docs/TEAM.md).
   Dùng các hàm chung của index.html (lb, lc, mat, skin, face, textPlate, addBox…) – chúng có sẵn khi nội thất được dựng. */
/* VERSE LIBRARY – phòng đọc hình bầu dục (theo ảnh phòng đọc Salle Ovale): tường cong 3 tầng kệ sách dưới các vòm, 2 tầng ban công lan can,
   mái vòm có cửa sổ tròn + giếng trời kính lớn ở giữa, quầy thủ thư tròn ở tâm, bàn đọc dài tỏa ra như nan quạt, đèn bàn chụp xanh, thảm xanh ngọc. */
function furnishReadingRoom(P, g, cx, cz, W, D, fur) {
  const H = (P.size || {}).h || 12, A = W / 2, B = D / 2, S = P.room.solids, WOOD = 0x5a3a22;
  const er = t => A * B / Math.hypot(B * Math.cos(t), A * Math.sin(t));   // bán kính elip theo góc t (x = cos t, z = sin t)
  const at = (t, r) => [cx + Math.cos(t) * r, cz + Math.sin(t) * r];
  // sàn gỗ ghép
  const fl = skin(2, 2, 48, x => { x.fillStyle = "#8a5a35"; x.fillRect(0, 0, 2, 2); x.fillStyle = "#7a4d2c"; for (let i = 0; i < 4; i++) x.fillRect(i * 0.5, (i % 2), 0.5, 1); x.strokeStyle = "#5e3a20"; x.lineWidth = 0.02; for (let i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(i * 0.5, 0); x.lineTo(i * 0.5, 2); x.stroke(); } });
  fl.wrapS = fl.wrapT = THREE.RepeatWrapping; fl.repeat.set(W / 2, D / 2); g.children[0].material = new THREE.MeshLambertMaterial({ map: fl });
  // TƯỜNG CONG: mỗi ô 4 m = trụ đá + kệ sách tầng dưới + vòm kệ sách tầng giữa + vòm có cửa sổ tròn trên cùng
  const books = (x, X, Y, w, h, rows) => {
    const cols = ["#8b2e2e", "#2f5d3a", "#a0782c", "#3b4f7a", "#6b3f2a", "#c2a878", "#7a2f4f"], rh = h / rows;
    x.fillStyle = "#3a2212"; x.fillRect(X, Y, w, h);
    for (let r = 0; r < rows; r++) for (let bx = X + 0.04, k = r * 3; bx < X + w - 0.1; k++) { const bw = 0.05 + (k * 7 % 5) * 0.012, bh = rh * (0.7 + (k * 3 % 4) * 0.06);
      x.fillStyle = cols[(k * 5 + r) % cols.length]; x.fillRect(bx, Y + (r + 1) * rh - 0.04 - bh, bw, bh); bx += bw + 0.012; }
    x.fillStyle = "#4a2c18"; for (let r = 0; r <= rows; r++) x.fillRect(X, Y + r * rh - 0.03, w, 0.05);
  };
  const wt = skin(4, H, 40, (x, Wd, Hh) => {
    x.fillStyle = "#e8dcc0"; x.fillRect(0, 0, Wd, Hh);
    books(x, 0.3, Hh - 4, 3.4, 3.7, 6);   // tầng 1: kệ sách cao
    x.fillStyle = "#3a2212"; x.fillRect(0, Hh - 0.3, Wd, 0.3); x.fillStyle = "#6b4a2b"; x.fillRect(0, Hh - 4.4, Wd, 0.4);   // chân tường, ban công 1
    x.fillStyle = "#d9c9a3"; archPath(x, 0.32, Hh - 8, 3.36, 3.6); x.fill();   // tầng 2: vòm kệ sách
    x.save(); archPath(x, 0.45, Hh - 7.85, 3.1, 3.45); x.clip(); books(x, 0.45, Hh - 7.85, 3.1, 3.45, 5); x.restore();
    x.fillStyle = "#6b4a2b"; x.fillRect(0, Hh - 8.3, Wd, 0.3);   // ban công 2
    x.fillStyle = "#d9c9a3"; archPath(x, 0.4, Hh - 11.6, 3.2, 3.2); x.fill(); x.fillStyle = "#efe6cf"; archPath(x, 0.6, Hh - 11.4, 2.8, 3); x.fill();   // tầng 3: vòm có cửa sổ tròn
    x.fillStyle = "#ffffff"; x.beginPath(); x.arc(2, Hh - 9.9, 0.85, 0, 7); x.fill(); x.fillStyle = "#cfe6f2"; x.beginPath(); x.arc(2, Hh - 9.9, 0.7, 0, 7); x.fill();
    x.strokeStyle = "#7a8a80"; x.lineWidth = 0.05; for (let a = 0; a < Math.PI; a += Math.PI / 4) { x.beginPath(); x.moveTo(2 + Math.cos(a) * 0.7, Hh - 9.9 + Math.sin(a) * 0.7); x.lineTo(2 - Math.cos(a) * 0.7, Hh - 9.9 - Math.sin(a) * 0.7); x.stroke(); }
    x.fillStyle = "#d9c9a3"; x.fillRect(0, 0, 0.3, Hh - 0.3); x.fillRect(Wd - 0.3, 0, 0.3, Hh - 0.3);   // trụ đá
    x.fillStyle = "#c9a227"; x.fillRect(0, 0, Wd, 0.25); x.fillRect(0, Hh - 8.45, Wd, 0.08);   // gờ vàng
  });
  const per = Math.PI * (3 * (A + B) - Math.sqrt((3 * A + B) * (A + 3 * B))), bays = Math.round(per / 4);
  wt.wrapS = THREE.RepeatWrapping; wt.repeat.set(bays, 1);
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, H, 96, 1, true), new THREE.MeshLambertMaterial({ map: wt, side: THREE.DoubleSide }));
  wall.scale.set(A, 1, B); wall.position.set(cx, H / 2, cz); g.add(wall);
  // 2 tầng ban công: sàn gỗ hình vành elip + lan can
  const rail = skin(1, 1, 64, (x) => { x.fillStyle = "#3a2a1a"; x.fillRect(0, 0, 1, 0.1); x.fillRect(0, 0.9, 1, 0.1); for (let X = 0.05; X < 1; X += 0.2) x.fillRect(X, 0.1, 0.05, 0.8); });
  rail.wrapS = THREE.RepeatWrapping; rail.repeat.set(Math.round(per), 1);
  [4.2, 8.15].forEach(y => {
    const sh = new THREE.Shape(); sh.absellipse(0, 0, A, B, 0, Math.PI * 2, false, 0); const ho = new THREE.Path(); ho.absellipse(0, 0, A - 0.9, B - 0.9, 0, Math.PI * 2, true, 0); sh.holes.push(ho);
    const ledge = new THREE.Mesh(new THREE.ShapeGeometry(sh, 48), mat(0x6b4a2b, { side: THREE.DoubleSide })); ledge.rotation.x = Math.PI / 2; ledge.position.set(cx, y, cz); g.add(ledge);
    const r = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 96, 1, true), new THREE.MeshLambertMaterial({ map: rail, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide }));
    r.scale.set(A - 0.9, 0.9, B - 0.9); r.position.set(cx, y + 0.45, cz); g.add(r);
  });
  // MÁI VÒM: giếng trời kính lớn ở giữa, vành vàng, ô trần + cửa sổ tròn
  const dt = skin(4, 6, 40, (x, Wd, Hh) => {
    x.fillStyle = "#e4f2fa"; x.fillRect(0, 0, Wd, 2.6); x.strokeStyle = "#5c6b63"; x.lineWidth = 0.06;
    for (let X = 0; X <= Wd; X += 0.5) { x.beginPath(); x.moveTo(X, 0); x.lineTo(X, 2.6); x.stroke(); } for (let Y = 0.3; Y < 2.6; Y += 0.35) { x.beginPath(); x.moveTo(0, Y); x.lineTo(Wd, Y); x.stroke(); }
    x.fillStyle = "#c9a227"; x.fillRect(0, 2.6, Wd, 0.25); x.fillStyle = "#efe6cf"; x.fillRect(0, 2.85, Wd, Hh - 2.85);
    x.fillStyle = "#d9c9a3"; x.fillRect(0, 2.85, 0.25, Hh); x.fillRect(Wd - 0.25, 2.85, 0.25, Hh);   // sườn vòm
    x.fillStyle = "#ffffff"; x.beginPath(); x.arc(2, 4.4, 0.85, 0, 7); x.fill(); x.fillStyle = "#cfe6f2"; x.beginPath(); x.arc(2, 4.4, 0.7, 0, 7); x.fill();
    x.strokeStyle = "#7a8a80"; x.lineWidth = 0.05; x.beginPath(); x.moveTo(1.3, 4.4); x.lineTo(2.7, 4.4); x.moveTo(2, 3.7); x.lineTo(2, 5.1); x.stroke();
    x.fillStyle = "#c9a227"; x.fillRect(0, Hh - 0.25, Wd, 0.25);
  });
  dt.wrapS = THREE.RepeatWrapping; dt.repeat.set(bays, 1);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshLambertMaterial({ map: dt, side: THREE.DoubleSide, emissive: 0x222018 }));
  dome.scale.set(A, 5, B); dome.position.set(cx, H, cz); g.add(dome);
  // QUẦY THỦ THƯ TRÒN Ở TÂM (thủ thư đứng bên trong)
  const ringM = mat(WOOD, { side: THREE.DoubleSide });
  [1.9, 1.3].forEach(r => { const c = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1.05, 32, 1, true), ringM); c.position.set(cx, 0.525, cz); g.add(c); });
  const top = new THREE.Mesh(new THREE.RingGeometry(1.2, 2.05, 32), mat(0x3e2a1a, { side: THREE.DoubleSide })); top.rotation.x = -Math.PI / 2; top.position.set(cx, 1.06, cz); g.add(top);
  S.push({ x: cx, z: cz, hw: 1.75, hd: 1.75 });
  lc(g, 0.05, 0.05, 3, 0xc9a227, cx, 2.5, cz - 1.6, 8);
  const ask = textPlate("ASK HERE · HOI THU THU", 2.4, 0.4, "#2f5d3a", "#ffe9a8"); ask.position.set(cx, 3.8, cz - 1.55); g.add(ask);
  // BÀN ĐỌC DÀI TỎA RA TỪ TÂM + ĐÈN BÀN CHỤP XANH + GHẾ (InstancedMesh cho nhẹ máy)
  const N = 12, spokes = [];
  for (let k = 0; k < N; k++) { const t = k * Math.PI * 2 / N; if (Math.abs(t - Math.PI / 2) < 0.1) continue; spokes.push(t); }   // chừa lối đi từ cửa vào
  const dum = new THREE.Object3D(), lamps = [], chairs = [];
  spokes.forEach(t => {
    const r0 = 5, r1 = er(t) - 2.8, len = r1 - r0, [mx, mz] = at(t, (r0 + r1) / 2);
    const tb = lb(g, len, 0.08, 1.1, 0x6b4226, mx, 0.78, mz); tb.rotation.y = -t;
    const pd = lb(g, len - 0.6, 0.74, 0.3, 0x4a2c18, mx, 0.37, mz); pd.rotation.y = -t;
    for (let r = r0 + 0.5; r < r1; r += 0.9) { const [x, z] = at(t, r); S.push({ x, z, hw: 0.75, hd: 0.75 }); }
    for (let r = r0 + 0.9; r < r1 - 0.4; r += 1.8) { lamps.push(at(t, r)); [-1, 1].forEach(s => { const [x, z] = at(t, r); chairs.push([x - Math.sin(t) * s * 0.85, z + Math.cos(t) * s * 0.85, s > 0 ? Math.PI - t : -t]); }); }
    const bt = t + Math.PI / N, b1 = er(bt) - 2.6;   // thảm xanh ngọc giữa 2 dãy bàn
    if (Math.abs(bt - Math.PI / 2) > 0.1) { const [ax, az] = at(bt, (4 + b1) / 2), cp = lb(g, b1 - 4, 0.02, 1.2, 0x1f6f68, ax, 0.012, az); cp.rotation.y = -bt; }
  });
  lb(g, 1.6, 0.02, B - 3.5, 0x1f6f68, cx, 0.012, cz + 2 + (B - 3.5) / 2);   // thảm lối vào
  const inst = (geo, m, list, f) => { const im = new THREE.InstancedMesh(geo, m, list.length); list.forEach((p, i) => { f(p); dum.updateMatrix(); im.setMatrixAt(i, dum.matrix); }); g.add(im); return im; };
  inst(new THREE.CylinderGeometry(0.03, 0.05, 0.45, 6), mat(0xc9a227), lamps, ([x, z]) => { dum.position.set(x, 1.04, z); dum.rotation.set(0, 0, 0); });
  inst(new THREE.SphereGeometry(0.2, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), mat(0x2b8a3e, { side: THREE.DoubleSide, emissive: 0x0c2a12 }), lamps, ([x, z]) => dum.position.set(x, 1.22, z));
  inst(new THREE.SphereGeometry(0.08, 8, 6), new THREE.MeshBasicMaterial({ color: 0xfff3bf }), lamps, ([x, z]) => dum.position.set(x, 1.2, z));
  inst(new THREE.BoxGeometry(0.46, 0.08, 0.46), mat(0x6b4226), chairs, ([x, z, ry]) => { dum.position.set(x, 0.46, z); dum.rotation.set(0, ry, 0); });
  inst(new THREE.BoxGeometry(0.46, 0.5, 0.06), mat(0x2f5d3a), chairs, ([x, z, ry]) => { dum.position.set(x, 0.0, z); dum.rotation.set(0, ry, 0); dum.translateZ(-0.22); dum.position.y = 0.72; });
  // CỬA VÀO + BẢNG TÊN
  const dr = skin(2.6, 3.4, 40, (x, Wd, Hh) => { x.fillStyle = "#d9c9a3"; archPath(x, 0, 0, Wd, Hh); x.fill(); x.fillStyle = "#4a2c18"; archPath(x, 0.2, 0.2, Wd - 0.4, Hh - 0.2); x.fill(); x.fillStyle = "#c9a227"; x.fillRect(Wd / 2 - 0.03, 1.4, 0.06, Hh - 1.4); });
  const dm = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 3.4), new THREE.MeshLambertMaterial({ map: dr, transparent: true })); dm.position.set(cx, 1.7, cz + B - 0.06); dm.rotation.y = Math.PI; g.add(dm);
  const nm = textPlate("VERSE LIBRARY · READING ROOM", 6, 0.6, "#2f5d3a", "#ffe9a8"); nm.position.set(cx, 3.5, cz - B + 0.08); g.add(nm);
  // vật cản ở 4 góc ngoài tường cong (không cho đi xuyên tường)
  for (let x = -A; x < A; x += 0.8) { const ze = B * Math.sqrt(Math.max(0, 1 - (Math.min(Math.abs(x), Math.abs(x + 0.8)) / A) ** 2)) + 0.3; if (ze < B) [-1, 1].forEach(s => S.push({ x: cx + x + 0.4, z: cz + s * (ze + B) / 2, hw: 0.4, hd: (B - ze) / 2 + 0.3 })); }
  g.traverse(o => { if (o.isMesh && (o.position.y > 3 || o === wall)) o.userData.flat = true; });
  // CHỖ BÀY ĐỒ TỪ VỰNG (để sẵn cho VOCAB.library)
  const mids = spokes.map(t => t + Math.PI / N).filter(t => Math.abs(t - Math.PI / 2) > 0.1);
  P.anchors = {
    desk: [0, 1, 2, 3, 4, 5].map(i => { const t = Math.PI / 2 + (i - 2.5) * 0.35, [x, z] = at(t, 1.65), [sx, sz] = at(t, 3.1); return [x, 1.3, z, sx, sz]; }),
    table: spokes.map(t => { const [x, z] = at(t, 6.4), [sx, sz] = at(t + 0.28, 6.4); return [x, 1.1, z, sx, sz]; }),
    shelf: mids.map(t => { const [x, z] = at(t, er(t) - 0.35), [sx, sz] = at(t, er(t) - 1.6); return [x, 1.6, z, sx, sz]; }),
    gallery: mids.slice(0, 6).map(t => { const [x, z] = at(t, er(t) - 0.6), [sx, sz] = at(t, er(t) - 1.6); return [x, 4.9, z, sx, sz]; }),
    ceiling: [[cx, 9, cz, cx, cz + 2.8], [cx, 10, cz - 6, cx, cz - 3]],
    door: [[cx - 1.8, 1.5, cz + B - 0.4, cx - 1.8, cz + B - 2], [cx + 1.8, 1.5, cz + B - 0.4, cx + 1.8, cz + B - 2]]
  };
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["oval"] = {
  furnish: furnishReadingRoom,
  customWalls: true,   // tường cong + cửa vẽ riêng
  bright: true
};

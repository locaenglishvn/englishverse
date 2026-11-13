/* EnglishVerse – bộ khung chung cho cửa hàng nhỏ ở Market Street (phòng 16 × 18 m, trần 4,5 m). Nạp TRƯỚC các file cửa hàng.
   shopKit(P, g, cx, cz, W, D, o) dựng: sàn gạch, 4 tường (2 màu + cửa sổ kính mặt tiền), trần + đèn, quầy trước chỗ người bán (0, -6.6).
   o = { floor:[màu1, màu2], wall:[trên, dưới], trim, counter, counterTop, glassCounter, sign:"…", signBg, signFg }
   Trả về các hàm tiện dùng: B (khối, chất liệu dùng chung), sol (vật cản), plate (bảng chữ), pic (tranh/ảnh phẳng), A (chỗ bày từ vựng, toạ độ tương đối).
   Quy ước chung 4 tiệm: chừa trống lối vào x -1.5..1.5, z 3..9; chỗ NPC (-5,-2) (5,-2) (-5,4) (5,4); người bán (0,-6.6) sau quầy z -5.2. */
const SHOPW = {};
function shopKit(P, g, cx, cz, W, D, o) {
  const back = cz - D / 2, front = cz + D / 2, H = (P.size || {}).h || 4.5, S = P.room.solids;
  const sol = (x, z, hw, hd) => S.push({ x, z, hw, hd });
  const B = (w, h, d, c, x, y, z) => lb(g, w, h, d, c, x, y, z);
  const plate = (t, w, h, bg, fg, x, y, z, ry) => { const p = textPlate(t, w, h, bg, fg); p.position.set(x, y, z); p.rotation.y = ry || 0; g.add(p); return p; };
  const pic = (tex, w, h, x, y, z, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshLambertMaterial({ map: tex, transparent: true })); m.position.set(x, y, z); m.rotation.y = ry || 0; g.add(m); return m; };
  const A = (dx, y, dz, sx, sz) => [cx + dx, y, cz + dz, cx + sx, cz + sz];
  // sàn ô cờ 2 màu
  const fl = skin(1, 1, 32, x => { x.fillStyle = o.floor[0]; x.fillRect(0, 0, 1, 1); x.fillStyle = o.floor[1]; x.fillRect(0, 0, 0.5, 0.5); x.fillRect(0.5, 0.5, 0.5, 0.5); });
  fl.wrapS = fl.wrapT = THREE.RepeatWrapping; fl.repeat.set(W / 1.2, D / 1.2); g.children[0].material = new THREE.MeshLambertMaterial({ map: fl });
  // tường: trên 1 màu, dưới 1 màu + nẹp; tường trước có 2 ô kính lớn 2 bên cửa
  ["back", "front", "side", "side"].forEach((k, i) => { const len = i < 2 ? W : D, key = o.wall.join() + o.trim + len + k;
    g.children[1 + i].material = SHOPW[key] || (SHOPW[key] = new THREE.MeshLambertMaterial({ map: skin(len, H, 24, (x, Wd, Hh) => {
      x.fillStyle = o.wall[0]; x.fillRect(0, 0, Wd, Hh); x.fillStyle = o.wall[1]; x.fillRect(0, Hh - 1.1, Wd, 1.1); x.fillStyle = o.trim; x.fillRect(0, Hh - 1.15, Wd, 0.08); x.fillRect(0, 0, Wd, 0.15);
      if (k === "front") [[0.8, Wd / 2 - 1.6], [Wd / 2 + 1.6, Wd - 0.8]].forEach(([a, b]) => { x.fillStyle = "#ffffff"; x.fillRect(a - 0.1, 0.7, b - a + 0.2, Hh - 1.6); x.fillStyle = "#cfe8f5"; x.fillRect(a, 0.8, b - a, Hh - 1.8); x.fillStyle = "#ffffff"; for (let X = a + 1.6; X < b - 0.2; X += 1.6) x.fillRect(X, 0.8, 0.06, Hh - 1.8); });
    }) })); });
  // trần + đèn
  { const m = new THREE.Mesh(new THREE.PlaneGeometry(W, D), mat(0xfaf8f2, { side: THREE.DoubleSide })); m.rotation.x = Math.PI / 2; m.position.set(cx, H, cz); g.add(m); }
  const lamp = new THREE.MeshBasicMaterial({ color: 0xfff9db });
  [-5, 0, 5].forEach(dz => [-4, 4].forEach(dx => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.06, 14), lamp); m.position.set(cx + dx, H - 0.04, cz + dz); g.add(m); }));
  // quầy trước người bán
  if (o.glassCounter) { B(5, 0.5, 0.9, o.counter, cx, 0.25, cz - 5.2); const gl = new THREE.Mesh(new THREE.BoxGeometry(4.9, 0.6, 0.8), mat(0xd0ebff, { transparent: true, opacity: 0.35 })); gl.position.set(cx, 0.8, cz - 5.2); g.add(gl); B(5.05, 0.06, 0.95, o.counterTop, cx, 1.13, cz - 5.2); }
  else { B(5, 1.05, 0.9, o.counter, cx, 0.53, cz - 5.2); B(5.2, 0.08, 1.05, o.counterTop, cx, 1.09, cz - 5.2); }
  sol(cx, cz - 5.2, 2.55, 0.5);
  if (o.sign) plate(o.sign, 4.6, o.glassCounter ? 0.4 : 0.55, o.signBg, o.signFg, cx, o.glassCounter ? 0.25 : 0.75, cz - 4.73, 0);
  return { back, front, H, B, sol, plate, pic, A };
}

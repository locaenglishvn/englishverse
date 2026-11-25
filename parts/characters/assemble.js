/* EnglishVerse – LẮP GHÉP NHÂN VẬT TRIPO (25/11). Thử nghiệm gốc: tools/tripo/swap-demo.html, cách làm: tools/tripo/README.md.
   Mô hình Tripo đã gắn xương tự chia vùng theo xương chi phối mỗi đỉnh:
     head = Head + NeckTwist (gồm tóc, tai nghe) · hand = L_Hand / R_Hand · foot = L_Foot, L_ToeBase, R_… (gồm giày) · body = còn lại.
   API (dùng trên mô hình MẪU – các bản sao bằng SkeletonUtils.clone dùng chung hình học + bản sao con của xương):
     ASSEMBLE.regions(sk)                → { reg[], dom[] } vùng + xương chi phối từng đỉnh (nhớ sẵn theo geometry)
     ASSEMBLE.hide(sk, ["head", …])      → bỏ tam giác của các vùng đó
     ASSEMBLE.rigid(srcSk, "head", "Head") → Mesh cứng (tọa độ không gian xương) để gắn vào xương cùng tên của mô hình khác
     ASSEMBLE.fists(root, fistScene, { left: true }) → thay bàn tay mở bằng bàn tay nắm (assets/parts/fist.glb), màu da lấy từ ảnh mô hình
   Tripo không có xương ngón (đã thử chuẩn tripo + mixamo), uốn đỉnh ngón tay trông như vuốt → dùng mô hình nắm tay riêng. */
const ASSEMBLE = (function () {
  const REG = { Head: "head", NeckTwist01: "head", NeckTwist02: "head", L_Hand: "hand", R_Hand: "hand", L_Foot: "foot", R_Foot: "foot", L_ToeBase: "foot", R_ToeBase: "foot" };
  const cache = new WeakMap();
  function skinOf(m) { let k = null; m.traverse(o => { if (!k && o.isSkinnedMesh) k = o; }); return k; }
  function regions(sk) {
    const G = sk.geometry; if (cache.has(G)) return cache.get(G);
    const si = G.attributes.skinIndex.array, sw = G.attributes.skinWeight.array, n = G.attributes.position.count, bones = sk.skeleton.bones, reg = new Array(n), dom = new Int16Array(n);
    for (let i = 0; i < n; i++) { let best = 0, bi = 0; for (let k = 0; k < 4; k++) { const w = sw[i * 4 + k]; if (w > best) { best = w; bi = si[i * 4 + k]; } } dom[i] = bi; reg[i] = REG[bones[bi].name] || "body"; }
    const R = { reg, dom }; cache.set(G, R); return R;
  }
  function tris(G, keep) {   // giữ tam giác mà đa số đỉnh thỏa keep(i)
    const idx = G.index ? G.index.array : null, n = idx ? idx.length : G.attributes.position.count, out = [];
    for (let t = 0; t < n; t += 3) { const a = idx ? idx[t] : t, b = idx ? idx[t + 1] : t + 1, c = idx ? idx[t + 2] : t + 2; if ((keep(a) + keep(b) + keep(c)) >= 2) out.push(a, b, c); }
    return out;
  }
  function hide(sk, names, extra) {   // extra(i) = true thì cũng bỏ
    const R = regions(sk), G = sk.geometry.clone(); cache.set(G, R);
    G.setIndex(tris(sk.geometry, i => names.indexOf(R.reg[i]) < 0 && !(extra && extra(i)))); sk.geometry = G; return sk;
  }
  function boneMeshMatrix(sk, bi) { return new THREE.Matrix4().multiplyMatrices(sk.skeleton.boneInverses[bi], sk.bindMatrix); }   // mesh (tư thế gốc) → không gian xương
  function rigid(srcSk, name, boneName) {
    const R = regions(srcSk), G = srcSk.geometry, pos = G.attributes.position, bones = srcSk.skeleton.bones, bi = bones.findIndex(b => b.name === boneName); if (bi < 0) return null;
    const side = boneName[0], keepBones = new Set(bones.map((b, j) => REG[b.name] === name && (name !== "foot" && name !== "hand" || b.name[0] === side) ? j : -1).filter(j => j >= 0));
    const M = boneMeshMatrix(srcSk, bi), P = new Float32Array(pos.count * 3), v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i).applyMatrix4(M); P[i * 3] = v.x; P[i * 3 + 1] = v.y; P[i * 3 + 2] = v.z; }
    const g2 = new THREE.BufferGeometry(); g2.setAttribute("position", new THREE.BufferAttribute(P, 3)); if (G.attributes.uv) g2.setAttribute("uv", G.attributes.uv);
    g2.setIndex(tris(G, i => keepBones.has(R.dom[i]))); g2.computeVertexNormals();
    const mt = srcSk.material; return new THREE.Mesh(g2, new THREE.MeshLambertMaterial({ map: mt.map || null, color: mt.color ? mt.color.clone() : 0xffffff }));
  }
  function skinColor(sk, ids) {   // màu da trung bình của vùng bàn tay (đọc ảnh màu theo UV)
    const map = sk.material && sk.material.map, img = map && map.image, uv = sk.geometry.attributes.uv; if (!img || !uv) return new THREE.Color(0xf2c9a8);
    try {
      const W = 64, H = 64, cv = document.createElement("canvas"); cv.width = W; cv.height = H; const cx = cv.getContext("2d"); cx.drawImage(img, 0, 0, W, H); const d = cx.getImageData(0, 0, W, H).data;
      let r = 0, g = 0, b = 0, n = 0; ids.forEach(i => { const u = uv.getX(i), vv = map.flipY === false ? uv.getY(i) : 1 - uv.getY(i); const x = Math.min(W - 1, Math.max(0, Math.floor(u * W))), y = Math.min(H - 1, Math.max(0, Math.floor(vv * H))), k = (y * W + x) * 4; r += d[k]; g += d[k + 1]; b += d[k + 2]; n++; });
      return n ? new THREE.Color(r / n / 255, g / n / 255, b / n / 255) : new THREE.Color(0xf2c9a8);
    } catch (e) { return new THREE.Color(0xf2c9a8); }
  }
  let FIST = null;   // { geo, mat, h } chuẩn hóa: cổ tay ở y = 0, đốt ngón hướng +y, lòng bàn tay +x, lỗ cầm theo trục z
  function fistTemplate(fistScene) {
    if (FIST) return FIST; let src = null; fistScene.updateMatrixWorld(true); fistScene.traverse(o => { if (!src && o.isMesh) src = o; }); if (!src) return null;
    const geo = src.geometry.clone().applyMatrix4(src.matrixWorld); geo.computeBoundingBox(); const bb = geo.boundingBox, c = bb.getCenter(new THREE.Vector3());
    geo.translate(-c.x, -bb.min.y, -c.z); const h = bb.max.y - bb.min.y;
    FIST = { geo, map: src.material.map, h }; return FIST;
  }
  function fists(root, fistScene, opt) {   // opt.left = false: chỉ tay phải nắm (tay trái để mở)
    const sk = skinOf(root), F = fistScene && fistTemplate(fistScene); if (!sk || !F) return false;
    const R = regions(sk), bones = sk.skeleton.bones, pos = sk.geometry.attributes.position, v = new THREE.Vector3(), done = [];
    ["R_Hand", "L_Hand"].forEach(hn => {
      if (hn === "L_Hand" && opt && opt.left === false) return;
      const bi = bones.findIndex(b => b.name === hn); if (bi < 0) return;
      const ids = []; for (let i = 0; i < pos.count; i++) if (R.dom[i] === bi) ids.push(i); if (!ids.length) return;
      const toMesh = new THREE.Matrix4().copy(boneMeshMatrix(sk, bi)).invert(), wrist = new THREE.Vector3().setFromMatrixPosition(toMesh);   // vị trí khớp cổ tay (không gian mesh, tư thế gốc)
      let far = 0, tip = new THREE.Vector3(); ids.forEach(i => { v.fromBufferAttribute(pos, i); const d = v.distanceTo(wrist); if (d > far) { far = d; tip.copy(v); } });
      const up = tip.clone().sub(wrist).normalize();
      const palm = new THREE.Vector3(0, 0, -Math.sign(wrist.z) || -1); palm.sub(up.clone().multiplyScalar(palm.dot(up))).normalize();   // lòng bàn tay hướng vào thân (mô hình Tripo: mặt trước +x, hai bên ±z)
      const zAx = new THREE.Vector3().crossVectors(palm, up).normalize();
      const basis = new THREE.Matrix4().makeBasis(palm, up, zAx), s = (far * 1.05) / F.h;
      const T = new THREE.Matrix4().compose(wrist.clone().add(up.clone().multiplyScalar(-far * 0.08)), new THREE.Quaternion().setFromRotationMatrix(basis), new THREE.Vector3(s, s, s * (hn === "L_Hand" ? -1 : 1)));
      const L = new THREE.Matrix4().multiplyMatrices(boneMeshMatrix(sk, bi), T);
      const mat = new THREE.MeshLambertMaterial({ color: skinColor(sk, ids).offsetHSL(0, 0.12, 0.04), side: hn === "L_Hand" ? THREE.BackSide : THREE.FrontSide });
      const fm = new THREE.Mesh(F.geo, mat); fm.matrixAutoUpdate = false; fm.matrix.copy(L); fm.name = "fist_" + hn; fm.castShadow = true; fm.frustumCulled = false;
      bones[bi].add(fm); done.push(bi);
      // chỗ cầm vũ khí: giữa lỗ nắm tay, trục lỗ (zAx) quay về phía trước người (+x); vũ khí dựng theo trục y của nó → y = trục lỗ, nghiêng lên 0,45 rad
      const fwdAx = zAx.x >= 0 ? zAx.clone() : zAx.clone().negate(), gy = fwdAx.clone().applyAxisAngle(palm, 0), gx = up.clone().negate(), gz = new THREE.Vector3().crossVectors(gx, gy).normalize();
      const gq = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(gx, gy, gz)), tilt = new THREE.Quaternion().setFromAxisAngle(gz, 0.45);
      const GM = new THREE.Matrix4().compose(wrist.clone().add(up.clone().multiplyScalar(far * 0.5)).add(palm.clone().multiplyScalar(far * 0.12)), tilt.multiply(gq), new THREE.Vector3(1, 1, 1));
      const GL = new THREE.Matrix4().multiplyMatrices(boneMeshMatrix(sk, bi), GM), gp = new THREE.Vector3(), gr = new THREE.Quaternion(), gs = new THREE.Vector3(); GL.decompose(gp, gr, gs);
      bones[bi].userData.grip = { pos: gp.toArray(), quat: gr.toArray() };   // mảng số: userData bị sao chép kiểu JSON khi nhân bản nhân vật

    });
    if (done.length) hide(sk, [], i => done.indexOf(R.dom[i]) >= 0);
    return true;
  }
  return { regions, hide, rigid, fists, skinOf };
})();

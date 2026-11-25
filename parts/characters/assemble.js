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
  function tris(G, keep, all) {   // giữ tam giác mà đa số đỉnh (all: cả 3 đỉnh) thỏa keep(i)
    const idx = G.index ? G.index.array : null, n = idx ? idx.length : G.attributes.position.count, out = [], need = all ? 3 : 2;
    for (let t = 0; t < n; t += 3) { const a = idx ? idx[t] : t, b = idx ? idx[t + 1] : t + 1, c = idx ? idx[t + 2] : t + 2; if ((keep(a) + keep(b) + keep(c)) >= need) out.push(a, b, c); }
    return out;
  }
  function hide(sk, names, extra, strict) {   // extra(i) = true thì cũng bỏ · strict: bỏ cả tam giác chạm vùng (không để mảnh vụn kéo dài ở mép)
    const R = regions(sk), G = sk.geometry.clone(); cache.set(G, R);
    G.setIndex(tris(sk.geometry, i => names.indexOf(R.reg[i]) < 0 && !(extra && extra(i)), strict)); sk.geometry = G; return sk;
  }
  function boneMeshMatrix(sk, bi) { return new THREE.Matrix4().multiplyMatrices(sk.skeleton.boneInverses[bi], sk.bindMatrix); }   // mesh (tư thế gốc) → không gian xương
  function rigid(srcSk, name, boneName) {
    const R = regions(srcSk), G = srcSk.geometry, pos = G.attributes.position, bones = srcSk.skeleton.bones, bi = bones.findIndex(b => b.name === boneName); if (bi < 0) return null;
    const side = boneName[0], keepBones = new Set(bones.map((b, j) => REG[b.name] === name && (name !== "foot" && name !== "hand" || b.name[0] === side) ? j : -1).filter(j => j >= 0));
    const M = boneMeshMatrix(srcSk, bi), P = new Float32Array(pos.count * 3), v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i).applyMatrix4(M); P[i * 3] = v.x; P[i * 3 + 1] = v.y; P[i * 3 + 2] = v.z; }
    const g2 = new THREE.BufferGeometry(); g2.setAttribute("position", new THREE.BufferAttribute(P, 3)); if (G.attributes.uv) g2.setAttribute("uv", G.attributes.uv);
    if (G.attributes.normal) { const N = G.attributes.normal, NM = new THREE.Matrix3().getNormalMatrix(M), Q = new Float32Array(N.count * 3); for (let i = 0; i < N.count; i++) { v.fromBufferAttribute(N, i).applyMatrix3(NM).normalize(); Q[i * 3] = v.x; Q[i * 3 + 1] = v.y; Q[i * 3 + 2] = v.z; } g2.setAttribute("normal", new THREE.BufferAttribute(Q, 3)); }
    g2.setIndex(tris(G, i => keepBones.has(R.dom[i]))); if (!G.attributes.normal) g2.computeVertexNormals();   // giữ pháp tuyến gốc (mượt như mô hình), tính lại làm mặt gợn mảng
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
  let FIST = null; const OPEN = new WeakMap(), FISTG = new WeakMap();   // hình học tay mở ↔ tay nắm (dùng chung cho mọi bản sao)
  function setFist(sk, root, on) {   // bật / tắt nắm tay cho 1 nhân vật (chỉ khi mô hình làm bằng fists(..., { toggle: true }))
    const g = on ? FISTG.get(sk.geometry) : OPEN.get(sk.geometry); if (!g) return; sk.geometry = g;
    root.traverse(o => { if (/^fist_/.test(o.name)) o.visible = on; });
  }
  const warmCache = new WeakMap();
  /* Da hồng hào (26/11, chủ dự án: da nhợt nhạt): tăng độ bão hoà + ngả hồng cho điểm ảnh màu da trong ảnh màu (giữ nguyên tóc, áo). */
  function warmSkin(map) {
    const img = map && map.image; if (!img || !img.width) return map; if (warmCache.has(map)) return warmCache.get(map);
    try {
      const W = img.width, H = img.height, cv = document.createElement("canvas"); cv.width = W; cv.height = H; const cx = cv.getContext("2d"); cx.drawImage(img, 0, 0);
      const D = cx.getImageData(0, 0, W, H), d = D.data, c = new THREE.Color(), o = {};
      for (let k = 0; k < d.length; k += 4) {
        c.setRGB(d[k] / 255, d[k + 1] / 255, d[k + 2] / 255); c.getHSL(o);
        if (o.h < 0.015 || o.h > 0.12 || o.s < 0.12 || o.s > 0.75 || o.l < 0.4 || o.l > 0.93) continue;   // chỉ vùng màu da
        c.setHSL(o.h - 0.012, Math.min(1, o.s * 1.45 + 0.06), Math.min(0.92, o.l * 1.02));
        d[k] = c.r * 255; d[k + 1] = c.g * 255; d[k + 2] = c.b * 255;
      }
      cx.putImageData(D, 0, 0);
      const t = new THREE.CanvasTexture(cv); t.flipY = map.flipY; t.encoding = THREE.LinearEncoding; t.wrapS = map.wrapS; t.wrapT = map.wrapT; warmCache.set(map, t); return t;
    } catch (e) { return map; }
  }   // { geo, mat, h } chuẩn hóa: cổ tay ở y = 0, đốt ngón hướng +y, lòng bàn tay +x, lỗ cầm theo trục z
  function fistTemplate(fistScene) {
    if (FIST) return FIST; let src = null; fistScene.updateMatrixWorld(true); fistScene.traverse(o => { if (!src && o.isMesh) src = o; }); if (!src) return null;
    let geo = src.geometry.clone().applyMatrix4(src.matrixWorld); geo.computeBoundingBox(); let bb = geo.boundingBox; const c = bb.getCenter(new THREE.Vector3());
    { const Q = geo.attributes.position, x0 = bb.min.x + (bb.max.x - bb.min.x) * 0.78, y0 = bb.min.y + (bb.max.y - bb.min.y) * 0.4;   // ép ngón cái (thò ra phía +x ở nửa trên) sát vào nắm tay
      for (let i = 0; i < Q.count; i++) { const x = Q.getX(i); if (x > x0 && Q.getY(i) > y0) Q.setX(i, x0 + (x - x0) * 0.4); } Q.needsUpdate = true; }
    // khúc cổ tay của mô hình nắm tay (30% dưới) phải nằm trong ống tay áo, không lòi ra ngoài
    const cut = bb.min.y + (bb.max.y - bb.min.y) * 0.3;   // gốc toạ độ ở 30% chiều cao: khúc cổ tay (y < 0) thụt vào trong ống tay áo, giữ nguyên mặt kín
    geo.translate(-c.x, -cut, -c.z); geo.computeBoundingBox(); bb = geo.boundingBox; const h = bb.max.y;
    { const Q = geo.attributes.position, H = bb.max.y, lo = bb.min.y, top = H * 0.18;   // vuốt nhỏ cổ tay để lọt trong ống tay áo (mô hình nắm tay có cổ tay to bằng bàn tay)
      for (let i = 0; i < Q.count; i++) { const y = Q.getY(i); if (y >= top) continue; const k = Math.max(0, Math.min(1, (y - lo) / (top - lo))), f = 0.68 + 0.32 * k * k * (3 - 2 * k); Q.setX(i, Q.getX(i) * f); Q.setZ(i, Q.getZ(i) * f); }
      Q.needsUpdate = true; }   // giữ pháp tuyến gốc (tính lại làm da loang lổ)
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
      const spin = (window.__FIST_SPIN || [0, 0])[hn === "L_Hand" ? 1 : 0],   // không xoay; tay phải dùng bản soi gương, tay trái bản gốc (chủ dự án 26/11 chốt; trước bị ngược)
      basis = new THREE.Matrix4().makeBasis(palm, up, zAx).multiply(new THREE.Matrix4().makeRotationY(spin)), s = (far * 0.8) / F.h;
      const T = new THREE.Matrix4().compose(wrist.clone().add(up.clone().multiplyScalar(-far * ((opt && opt.sink) || 0.05))), new THREE.Quaternion().setFromRotationMatrix(basis), new THREE.Vector3(s, s, s * (hn === "R_Hand" ? -1 : 1)));
      const L = new THREE.Matrix4().multiplyMatrices(boneMeshMatrix(sk, bi), T);
      const mat = new THREE.MeshLambertMaterial({ color: skinColor(sk, ids).offsetHSL(0, 0.12, 0.04), side: THREE.FrontSide });
      const fm = new THREE.Mesh(F.geo, mat); fm.matrixAutoUpdate = false; fm.matrix.copy(L); fm.name = "fist_" + hn; fm.castShadow = true; fm.frustumCulled = false;
      bones[bi].add(fm); done.push(bi);
      // chỗ cầm vũ khí: giữa lỗ nắm tay, trục lỗ (zAx) quay về phía trước người (+x); vũ khí dựng theo trục y của nó → y = trục lỗ, nghiêng lên 0,45 rad
      const fwdAx = zAx.x >= 0 ? zAx.clone() : zAx.clone().negate(), gy = fwdAx.clone().applyAxisAngle(palm, 0), gx = up.clone().negate(), gz = new THREE.Vector3().crossVectors(gx, gy).normalize();
      const gq = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(gx, gy, gz)), tilt = new THREE.Quaternion().setFromAxisAngle(gz, 0.45);
      const GM = new THREE.Matrix4().compose(wrist.clone().add(up.clone().multiplyScalar(far * 0.5)).add(palm.clone().multiplyScalar(far * 0.12)), tilt.multiply(gq), new THREE.Vector3(1, 1, 1));
      const GL = new THREE.Matrix4().multiplyMatrices(boneMeshMatrix(sk, bi), GM), gp = new THREE.Vector3(), gr = new THREE.Quaternion(), gs = new THREE.Vector3(); GL.decompose(gp, gr, gs);
      bones[bi].userData.grip = { pos: gp.toArray(), quat: gr.toArray() };   // mảng số: userData bị sao chép kiểu JSON khi nhân bản nhân vật

    });
    if (done.length) {
      const open = sk.geometry; hide(sk, [], i => done.indexOf(R.dom[i]) >= 0, true);
      if (opt && opt.toggle) { OPEN.set(sk.geometry, open); FISTG.set(open, sk.geometry); sk.geometry = open; done.forEach(bi => bones[bi].children.forEach(c => { if (/^fist_/.test(c.name)) c.visible = false; })); }   // mặc định tay mở
    }
    return true;
  }
  /* Bỏ tai nghe dính liền trong mô hình nhân vật chính (25/11, chủ dự án: để mũ / tai nghe sau này không bị trùng):
     nhận diện bằng màu ảnh (xanh ngọc / xám) + vị trí trên đầu; cần mic (thò ra trước mặt) → xoá; vòng đầu + chụp tai → tô màu tóc (xoá sẽ thủng đầu). */
  function stripHeadset(sk) {
    const R = regions(sk), G = sk.geometry, pos = G.attributes.position, uv = G.attributes.uv, map = sk.material && sk.material.map, img = map && map.image; if (!uv || !img) return false;
    const W = img.width, H = img.height, cv = document.createElement("canvas"); cv.width = W; cv.height = H; const cx = cv.getContext("2d"); cx.drawImage(img, 0, 0); const D = cx.getImageData(0, 0, W, H).data;
    const px = i => { const u = uv.getX(i), v = map.flipY === false ? uv.getY(i) : 1 - uv.getY(i); return [Math.min(W - 1, Math.max(0, Math.floor(u * W))), Math.min(H - 1, Math.max(0, Math.floor(v * H)))]; };
    const col = i => { const [x, y] = px(i), k = (y * W + x) * 4; return new THREE.Color(D[k] / 255, D[k + 1] / 255, D[k + 2] / 255); };
    const head = []; for (let i = 0; i < pos.count; i++) if (R.reg[i] === "head") head.push(i); if (!head.length) return false;
    const bb = new THREE.Box3(), v = new THREE.Vector3(); head.forEach(i => bb.expandByPoint(v.fromBufferAttribute(pos, i)));
    const c = bb.getCenter(new THREE.Vector3()), sz = bb.getSize(new THREE.Vector3()), hsl = {};
    const kind = new Int8Array(pos.count);   // 0 giữ · 1 tô màu tóc · 2 xoá (mic)
    head.forEach(i => { v.fromBufferAttribute(pos, i); const yn = (v.y - bb.min.y) / sz.y, side = Math.abs(v.z - c.z) / (sz.z / 2), fwd = (v.x - c.x) / (sz.x / 2); if (yn < 0.16) return;   // dưới mức này là cổ áo
      col(i).getHSL(hsl); const teal = hsl.h > 0.36 && hsl.h < 0.58 && hsl.s > 0.12 && hsl.l > 0.18 && (yn > 0.3 || fwd > 0.3), grey = hsl.s < 0.12 && hsl.l > 0.25 && hsl.l < 0.75;
      const tip = fwd > 0.8 && yn < 0.5 && !(hsl.h < 0.12 && hsl.s > 0.2);   // đầu mic trước miệng (không phải màu da)
      if (!(teal || tip || (grey && (side > 0.55 || yn > 0.82)))) return;
      kind[i] = yn < 0.74 && (side > 0.62 || fwd > 0.15) ? 2 : 1; });   // dưới đỉnh đầu (chụp tai, cần mic) → xoá; vòng đầu → tô màu tóc
    // màu tóc: trung bình các đỉnh đỉnh đầu không thuộc tai nghe
    let r = 0, g = 0, b = 0, n = 0; head.forEach(i => { v.fromBufferAttribute(pos, i); if ((v.y - bb.min.y) / sz.y > 0.85 && !kind[i]) { const q = col(i); r += q.r; g += q.g; b += q.b; n++; } });
    const hair = n ? `rgb(${Math.round(r / n * 255)},${Math.round(g / n * 255)},${Math.round(b / n * 255)})` : "#222";
    const idx = G.index.array, keep = []; cx.fillStyle = hair; cx.strokeStyle = hair; cx.lineWidth = 3;
    for (let t = 0; t < idx.length; t += 3) { const a = idx[t], b2 = idx[t + 1], c2 = idx[t + 2], k = Math.max(kind[a], kind[b2], kind[c2]);
      if (k === 2) continue;   // chạm phần xoá là bỏ (không để mảnh vụn)
      if (kind[a] && kind[b2] && kind[c2]) { const A = px(a), B = px(b2), C = px(c2); cx.beginPath(); cx.moveTo(A[0], A[1]); cx.lineTo(B[0], B[1]); cx.lineTo(C[0], C[1]); cx.closePath(); cx.fill(); cx.stroke(); }
      keep.push(a, b2, c2); }
    const G2 = G.clone(); cache.set(G2, R); G2.setIndex(keep); sk.geometry = G2;
    const tex = new THREE.CanvasTexture(cv); tex.flipY = map.flipY; tex.encoding = map.encoding; tex.wrapS = map.wrapS; tex.wrapT = map.wrapT; sk.material.map = tex; sk.material.needsUpdate = true;
    return true;
  }
  /* Nhuộm tóc (26/11): mặt nạ texel tóc = tam giác vùng đầu có màu tối (tóc), trừ vùng mắt; đổi màu giữ sáng tối. Kết quả cache theo (ảnh, màu). */
  const tintCache = {};
  function hairTexture(sk, hex) {
    const map = sk.material && sk.material.map, img = map && map.image; if (!img || hex == null) return map;
    const key = (map.uuid || "") + "|" + hex; if (tintCache[key]) return tintCache[key];
    const R = regions(sk), G = sk.geometry, pos = G.attributes.position, uv = G.attributes.uv, W = img.width, H = img.height;
    const cv = document.createElement("canvas"); cv.width = W; cv.height = H; const cx = cv.getContext("2d"); cx.drawImage(img, 0, 0); const D = cx.getImageData(0, 0, W, H), d = D.data;
    const px = i => [uv.getX(i) * W, (map.flipY === false ? uv.getY(i) : 1 - uv.getY(i)) * H];
    const head = []; for (let i = 0; i < pos.count; i++) if (R.reg[i] === "head") head.push(i);
    const bb = new THREE.Box3(), v = new THREE.Vector3(); head.forEach(i => bb.expandByPoint(v.fromBufferAttribute(pos, i))); const c = bb.getCenter(new THREE.Vector3()), sz = bb.getSize(new THREE.Vector3());
    const lumAt = i => { const [x, y] = px(i), k = (Math.min(H - 1, y | 0) * W + Math.min(W - 1, x | 0)) * 4; return (0.3 * d[k] + 0.59 * d[k + 1] + 0.11 * d[k + 2]) / 255; };
    const isHair = new Uint8Array(pos.count);
    head.forEach(i => { v.fromBufferAttribute(pos, i); const yn = (v.y - bb.min.y) / sz.y, fwd = (v.x - c.x) / (sz.x / 2), side = Math.abs(v.z - c.z) / (sz.z / 2);
      if (fwd > 0.4 && side < 0.62 && yn > 0.28 && yn < 0.6) return;   // mắt, lông mày giữ nguyên
      if (lumAt(i) < 0.42) isHair[i] = 1; });
    const mk = document.createElement("canvas"); mk.width = W; mk.height = H; const mx = mk.getContext("2d"); mx.fillStyle = "#fff"; mx.strokeStyle = "#fff"; mx.lineWidth = 2;
    const idx = G.index.array; for (let t = 0; t < idx.length; t += 3) { const a = idx[t], b = idx[t + 1], e = idx[t + 2]; if (isHair[a] + isHair[b] + isHair[e] < 2) continue;
      const A = px(a), B = px(b), C = px(e); mx.beginPath(); mx.moveTo(A[0], A[1]); mx.lineTo(B[0], B[1]); mx.lineTo(C[0], C[1]); mx.closePath(); mx.fill(); mx.stroke(); }
    const M = mx.getImageData(0, 0, W, H).data, tc = new THREE.Color(hex); let sum = 0, n = 0;
    for (let k = 0; k < d.length; k += 4) if (M[k] > 128) { sum += 0.3 * d[k] + 0.59 * d[k + 1] + 0.11 * d[k + 2]; n++; }
    const mean = n ? sum / n : 60, tl = 0.3 * tc.r + 0.59 * tc.g + 0.11 * tc.b;
    for (let k = 0; k < d.length; k += 4) { if (M[k] <= 128) continue; const f = Math.max(0.45, Math.min(1.7, (0.3 * d[k] + 0.59 * d[k + 1] + 0.11 * d[k + 2] + 4) / (mean + 4)));
      d[k] = Math.min(255, tc.r * 255 * f); d[k + 1] = Math.min(255, tc.g * 255 * f); d[k + 2] = Math.min(255, tc.b * 255 * f); }
    cx.putImageData(D, 0, 0);
    const tex = new THREE.CanvasTexture(cv); tex.flipY = map.flipY; tex.encoding = THREE.LinearEncoding; tex.wrapS = map.wrapS; tex.wrapT = map.wrapT; tintCache[key] = tex; return tex;
  }
  return { regions, hide, rigid, fists, skinOf, stripHeadset, hairTexture, setFist, warmSkin };
})();

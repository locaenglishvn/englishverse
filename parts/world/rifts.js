/* ===== VẾT RÁCH (RIFTS) – cổng sang 8 khu văn hoá, mỗi khu là một bản đồ riêng =====
   Mỗi khu đặt ở toạ độ rất xa thành phố (≈ 2 km) nên camera (tầm 220 m) không bao giờ vẽ hai nơi cùng lúc.
   Khu được dựng một lần lúc tải (trước bakeWorld → các khối tĩnh được gộp theo ô 40 m, rất nhẹ).
   Logic hướng: đi qua cổng ở hướng D của thành phố → xuất hiện ở mép đối diện của khu, thành chính nằm cuối bản đồ (theo hướng D).
   API cho lõi game: RIFTS.blocked(x, z) (undefined nếu không ở khu nào) · RIFTS.nearSpot() · RIFTS.drawMap(ctx) · RIFTS.build() (wilds.js gọi). */
const RIFTS = (function () {
  const DEFS = [];   // { id, name, vi, ox, oz, half, gate: {x, z, rot, back: {x, z, ang}}, arrive: {x, z, ang}, portal: {x, z}, build(K), blocked(lx, lz), drawMap(x, K) }
  const portals = [], tickers = [];
  let cur = null, busy = false;

  /* ---------- công cụ dựng hình (dùng chung cho mọi khu) ---------- */
  const MC = {};
  function mat(c, o) { const k = c + (o ? JSON.stringify(o) : ""); return MC[k] || (MC[k] = new THREE.MeshLambertMaterial(Object.assign({ color: c }, o || {}))); }
  function frustum(wb, db, wt, dt, h) {   // khối vuông vát: đáy wb × db, đỉnh wt × dt, cao h (đáy ở y = 0) – dùng cho chân tường đá dốc, mái ngói
    const g = new THREE.BoxGeometry(1, 1, 1), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const top = p.getY(i) > 0; p.setX(i, p.getX(i) * (top ? wt : wb)); p.setZ(i, p.getZ(i) * (top ? dt : db)); p.setY(i, (p.getY(i) + 0.5) * h); }
    g.computeVertexNormals(); return g;
  }
  function prism(w, h, len) {   // lăng trụ tam giác (mái hai dốc): đáy rộng w, cao h, dài len theo trục z, đáy ở y = 0
    const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.lineTo(-w / 2, 0);
    const g = new THREE.ExtrudeGeometry(s, { depth: len, bevelEnabled: false }); g.translate(0, 0, -len / 2); g.computeVertexNormals(); return g;
  }
  function kit(ox, oz) {   // bộ dựng hình theo toạ độ cục bộ của một khu (lx, lz → thế giới ox + lx, oz + lz)
    const K = { ox, oz, solids: [], mat, frustum, prism };
    K.add = (geo, color, lx, y, lz, ry, opt) => { const m = new THREE.Mesh(geo, typeof color === "number" ? mat(color, opt) : color); m.position.set(ox + lx, y, oz + lz); if (ry) m.rotation.y = ry; scene.add(m); return m; };
    K.box = (w, h, d, color, lx, y, lz, ry) => K.add(new THREE.BoxGeometry(w, h, d), color, lx, y + h / 2, lz, ry);
    K.cyl = (rt, rb, h, color, lx, y, lz, seg) => K.add(new THREE.CylinderGeometry(rt, rb, h, seg || 8), color, lx, y + h / 2, lz);
    K.fr = (wb, db, wt, dt, h, color, lx, y, lz, ry) => K.add(frustum(wb, db, wt, dt, h), color, lx, y, lz, ry);
    K.pr = (w, h, len, color, lx, y, lz, ry) => K.add(prism(w, h, len), color, lx, y, lz, ry);
    K.flat = (w, d, color, lx, lz, y, m) => { const g = new THREE.PlaneGeometry(w, d), M = m || mat(color); const me = new THREE.Mesh(g, M); me.rotation.x = -Math.PI / 2; me.position.set(ox + lx, y || 0.02, oz + lz); me.userData.flat = true; scene.add(me); return me; };
    K.solid = (lx, lz, hw, hd) => K.solids.push({ x: lx, z: lz, hw, hd });
    K.block = m => { if (typeof camBlockers !== "undefined") camBlockers.push(m); return m; };   // camera không chui qua
    return K;
  }

  /* ---------- cổng xoáy tím (vết rách) ---------- */
  let swirlTex = null;
  function swirl() {
    if (swirlTex) return swirlTex;
    const N = 256, c = document.createElement("canvas"); c.width = c.height = N; const g = c.getContext("2d");
    const gr = g.createRadialGradient(N / 2, N / 2, 4, N / 2, N / 2, N / 2); gr.addColorStop(0, "rgba(255,240,255,1)"); gr.addColorStop(0.25, "rgba(190,140,255,.95)"); gr.addColorStop(0.7, "rgba(110,60,210,.85)"); gr.addColorStop(1, "rgba(60,20,120,0)");
    g.fillStyle = gr; g.fillRect(0, 0, N, N); g.lineWidth = 5; g.lineCap = "round";
    for (let a = 0; a < 6; a++) { g.strokeStyle = a % 2 ? "rgba(255,255,255,.55)" : "rgba(80,230,255,.45)"; g.beginPath();
      for (let t = 0; t < 1; t += 0.02) { const r = t * N * 0.46, th = a * Math.PI / 3 + t * 5.5; const x = N / 2 + Math.cos(th) * r, y = N / 2 + Math.sin(th) * r; t ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
    return swirlTex = new THREE.CanvasTexture(c);
  }
  function portal(x, y, z, r, sx, ry) {   // đĩa xoáy đứng, chỉ thấy từ mặt trước (ry = 0: mặt quay về +z / nam; Math.PI: quay về bắc) – camera lùi ra sau cổng không bị loá; sx: kéo giãn ngang
    const m = new THREE.Mesh(new THREE.CircleGeometry(r, 40), new THREE.MeshBasicMaterial({ map: swirl(), transparent: true, depthWrite: false, side: THREE.FrontSide, blending: THREE.AdditiveBlending }));
    m.position.set(x, y, z); m.rotation.y = ry || 0; m.scale.x = sx || 1; m.userData.flag = true; m.renderOrder = 2; scene.add(m); portals.push(m); return m;
  }

  /* ---------- đi qua lại ---------- */
  function fade(on) {
    let f = document.getElementById("riftFade");
    if (!f) { f = document.createElement("div"); f.id = "riftFade"; f.style.cssText = "position:fixed;inset:0;background:#1a1030;opacity:0;pointer-events:none;transition:opacity .35s;z-index:60"; document.body.appendChild(f); }
    f.style.opacity = on ? "1" : "0";
  }
  function banner(t, s) { try { const el = $("zoneTag"); el.innerHTML = t + "<div style='font-size:12px;font-weight:600'>" + s + "</div>"; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 3800); } catch (e) {} }
  function jump(x, z, ang) { player.position.set(x, 0, z); camAngle = ang; camPitch = 0.6; camSnap = true; }
  function go(D, into) {
    if (busy) return; busy = true; fade(true);
    setTimeout(() => {
      if (into) { jump(D.ox + D.arrive.x, D.oz + D.arrive.z, D.arrive.ang); cur = D; banner("🌀 " + D.name, D.vi); }
      else { jump(D.gate.back.x, D.gate.back.z, D.gate.back.ang); cur = null; if (typeof outdoorFog === "function") scene.fog = outdoorFog(); banner("📍 Verse City", "Về lại thành phố"); }
      setTimeout(() => { fade(false); busy = false; }, 120);
    }, 380);
  }
  function inside(D, x, z) { return Math.abs(x - D.ox) < D.half + 120 && Math.abs(z - D.oz) < D.half + 120; }
  function zoneAt(x, z) { return DEFS.find(D => inside(D, x, z)) || null; }

  /* ---------- API cho lõi game ---------- */
  function blocked(x, z) {
    const D = zoneAt(x, z); if (!D) return undefined;
    const lx = x - D.ox, lz = z - D.oz;
    if (D.blocked(lx, lz)) return true;
    return D.K.solids.some(o => Math.abs(lx - o.x) < o.hw + 0.45 && Math.abs(lz - o.z) < o.hd + 0.45);
  }
  function nearSpot() {
    if (typeof player === "undefined" || busy) return null; const p = player.position;
    const D = zoneAt(p.x, p.z);
    if (D) { if (Math.hypot(p.x - D.ox - D.portal.x, p.z - D.oz - D.portal.z) < 5.5) return { label: "🌀 Verse City", fn: () => go(D, false) }; return null; }
    for (const E of DEFS) if (Math.hypot(p.x - E.gate.x, p.z - E.gate.z) < 6) return { label: "🌀 " + E.name, fn: () => go(E, true) };
    return null;
  }
  function drawMap(x) {
    DEFS.forEach(D => { try { x.save(); x.translate(D.ox, D.oz); D.drawMap(x, D.K); x.restore(); } catch (e) { x.restore(); }
      x.fillStyle = "#ff4fa3"; x.strokeStyle = "#fff"; x.lineWidth = 2; x.beginPath(); x.arc(D.gate.x, D.gate.z, 7, 0, 7); x.fill(); x.stroke(); x.fillStyle = "#fff"; x.beginPath(); x.arc(D.gate.x, D.gate.z, 2.6, 0, 7); x.fill(); });   // dấu cổng vết rách: vòng hồng tâm trắng (khác chấm tím của quái mạnh)
  }
  function camTarget() {   // vùng hoang dã (camera cố định hướng Bắc): trong 30 m quanh cổng thì quay mặt về cổng để thấy được cổng
    if (typeof player === "undefined") return null; const p = player.position;
    for (const D of DEFS) if (D.gate.view !== undefined && Math.hypot(p.x - D.gate.x, p.z - D.gate.z) < 30) return D.gate.view;
    return null;
  }

  /* ---------- nhịp riêng: xoay cổng, sương & hiệu ứng của khu ---------- */
  let last = 0;
  function tick(t) {
    const dt = Math.min(0.05, (t - last) / 1000 || 0); last = t;
    portals.forEach(m => m.rotation.z -= dt * 0.9);
    try {
      const p = player.position, D = zoneAt(p.x, p.z), inRoom = typeof room !== "undefined" && room;
      if (D && !inRoom && D.fog) { const want = D.fog(typeof camWide !== "undefined" && camWide); if (scene.fog !== want) scene.fog = want; }
      else if (!D && cur) { cur = null; }
      tickers.forEach(f => f(dt, D, p));
    } catch (e) {}
    requestAnimationFrame(tick);
  }

  function define(D) { DEFS.push(D); }
  let built = false;
  function build() {
    if (built || typeof THREE === "undefined") return; built = true;
    DEFS.forEach(D => {
      try {
        D.K = kit(D.ox, D.oz); D.build(D.K, { portal, tickers });
        // cổng ở bản đồ chính (kiến trúc của khu) – dọn chỗ: bỏ cây / vật cản của vùng hoang dã quanh cổng
        if (typeof NATURE !== "undefined" && NATURE.clearArea) NATURE.clearArea(D.gate.x, D.gate.z, 11);
        if (typeof obstacles !== "undefined") for (let i = obstacles.length - 1; i >= 0; i--) if (Math.hypot(obstacles[i].x - D.gate.x, obstacles[i].z - D.gate.z) < 11) obstacles.splice(i, 1);
        D.buildGate(kit(0, 0), { portal });
      } catch (e) { console.error("RIFTS build", D.id, e); }
    });
    requestAnimationFrame(tick);
  }
  return { define, build, blocked, nearSpot, drawMap, zoneAt, camTarget, _defs: DEFS };
})();

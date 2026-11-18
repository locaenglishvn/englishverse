/* EnglishVerse – GAME FEEL ("cảm giác đánh đã tay") cho chiến đấu vùng hoang dã.
   Toàn mẹo rẻ, không thêm mô hình: khựng hình khi trúng đòn (hit-stop), quái văng lùi (knockback), vệt chém sáng khi vung đòn thường,
   viền đỏ màn hình khi bị đánh, nổ hạt + nảy xoay khi quái chết, rung màn hình giảm dần.
   Lõi gọi vào: engine.js (dealDamage → onHit, normalAttack → slash, hurtPlayer → hurt, monTick → kbTick / death, updateCombat → scaleDt).
   Động tác của từng quái (nảy, bẹp, lấy đà) nằm trong parts/combat/models.js. */
const FEEL = (function () {
  let stop = 0;   // giây còn "khựng hình": quái gần như đứng im (người chơi vẫn đi được)
  function hitStop(s) { stop = Math.max(stop, s); }
  function scaleDt(dt) { if (stop > 0) { stop -= dt; return dt * 0.05; } return dt; }
  function shake(s) { window.CAM_SHAKE = Math.max(window.CAM_SHAKE || 0, s); }

  /* quái văng lùi theo hướng từ người chơi ra, chậm dần (chỉ quái mình điều khiển; quái của "chủ phòng" lấy vị trí qua mạng) */
  function knock(M, v) {
    if (M.remote || M.dead || M.T.boss) return;
    const p = M.g.position, P = player.position, dx = p.x - P.x, dz = p.z - P.z, d = Math.hypot(dx, dz) || 1;
    M.kb = { vx: dx / d * v, vz: dz / d * v };
  }
  function kbTick(M, dt) {
    const k = M.kb; if (!k) return;
    movMon(M, k.vx * dt, k.vz * dt); const f = Math.exp(-dt * 10); k.vx *= f; k.vz *= f;
    if (Math.abs(k.vx) + Math.abs(k.vz) < 0.1) M.kb = null;
  }
  function onHit(M, dmg, bySkill, mine) {
    knock(M, bySkill ? 11 : 8);   // ≈ 1,1 m / 0,8 m
    if (mine) { hitStop(bySkill ? 0.09 : 0.06); shake(bySkill ? 0.12 : 0.06); }
  }

  /* vệt chém hình lưỡi liềm trước mặt người chơi (dùng lại 3 mảnh, không tạo mới mỗi lần) */
  const SL = []; let slI = 0, slGeo = null;
  function slash() {
    if (typeof scene === "undefined") return;
    if (!slGeo) slGeo = new THREE.RingGeometry(0.6, 1.75, 24, 1, -Math.PI / 2 - Math.PI * 0.45, Math.PI * 0.9);
    const i = slI; slI = (slI + 1) % 3; let s = SL[i];
    if (!s) {
      const m = new THREE.Mesh(slGeo, new THREE.MeshBasicMaterial({ color: 0xfff3c4, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
      m.rotation.x = -Math.PI / 2 + 0.2; m.position.set(0, 0, 0.3); m.renderOrder = 5;
      const g = new THREE.Group(); g.add(m); s = SL[i] = { g, m, t: 9 };
    }
    s.g.position.copy(player.position).setY(1.0); s.dir = (Math.random() < 0.5 ? 1 : -1); s.base = player.rotation.y; s.t = 0;
    if (!s.g.parent) scene.add(s.g);
  }
  function slTick(dt) {
    SL.forEach(s => {
      if (s.t > 0.24) { if (s.g.parent) scene.remove(s.g); return; }
      s.t += dt; const p = Math.min(1, s.t / 0.24), e = 1 - (1 - p) * (1 - p);
      s.g.rotation.y = s.base + s.dir * (0.75 - 1.5 * e);   // quét ngang
      s.m.scale.setScalar(0.85 + 0.35 * e); s.m.material.opacity = p < 0.35 ? 0.95 : 0.95 * (1 - (p - 0.35) / 0.65);
      s.g.position.x += (player.position.x - s.g.position.x) * 0.5; s.g.position.z += (player.position.z - s.g.position.z) * 0.5;
    });
  }

  /* bị đánh: viền đỏ quanh màn hình + rung nhẹ */
  let hurtEl = null;
  function hurt(big) {
    if (!hurtEl) { hurtEl = document.createElement("div"); hurtEl.id = "evHurt";
      hurtEl.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:4;opacity:0;transition:opacity .35s ease-out;box-shadow:inset 0 0 90px 20px rgba(229,72,77,.85)";
      document.body.appendChild(hurtEl); }
    hurtEl.style.transition = "none"; hurtEl.style.opacity = big ? "1" : "0.75";
    requestAnimationFrame(() => requestAnimationFrame(() => { hurtEl.style.transition = "opacity .45s ease-out"; hurtEl.style.opacity = "0"; }));
    shake(big ? 0.25 : 0.14);
  }

  /* quái chết: chớp sáng + hạt vàng bắn ra (dùng hiệu ứng có sẵn trong vfx.js) */
  function death(M) {
    try { if (typeof SKILL_VFX !== "undefined" && SKILL_VFX) { const P = M.g.position.clone(); P.y = 1; SKILL_VFX.hit(P, "#ffd43b"); setTimeout(() => SKILL_VFX.hit(P, "#ffffff"), 90); } } catch (e) {}
    if (M.g.position.distanceTo(player.position) < 14) shake(0.1);
  }

  return { hitStop, scaleDt, kbTick, onHit, slash, slTick, hurt, death };
})();

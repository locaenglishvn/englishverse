/* EnglishVerse – TÚI ĐỒ MỚI (docs/design/playtest-1611.html mục 7 và 10).
   Bảng .ev-panel: 8 ô trang bị hai bên KHUNG 3D NHÂN VẬT (kéo ngang để xoay) · Lực chiến · bảng chỉ số · tab + lưới túi.
   Chạm món mặc được = MẶC THỬ (khung 3D đổi đồ, chỉ số hiện ▲ xanh / ▼ đỏ); nút "Mặc" mới áp dụng, "Huỷ" quay lại.
   Hàm toàn cục: openBag() · closeBag() · drawBag() (vẽ lại nếu đang mở) · gearWith(equip) · calcStats(equip) · mpMax() · powerScore() · powerScoreWith(equip)
                 slotOf(item) (đổi tên ô cũ top→armor, legs→pants) · addGearExtras(root, look) (găng / giày / thắt lưng gắn vào xương, index.html gọi)
   Renderer 3D riêng chỉ chạy khi bảng mở; đóng bảng là dọn sạch (dispose). */
const SLOT_ORDER_L = ["hat", "armor", "pants", "shoes"], SLOT_ORDER_R = ["gloves", "belt", "cape", "weapon"];
const SLOT_INFO = { hat: ["🧢", "Hat"], armor: ["🛡️", "Armor"], pants: ["👖", "Pants"], shoes: ["👟", "Shoes"], gloves: ["🧤", "Gloves"], belt: ["🎗️", "Belt"], cape: ["🧣", "Cape"], weapon: ["📢", "Weapon"] };
const SLOT_ALIAS = { top: "armor", legs: "pants" };   // tên cũ → tên mới
const LOOK_KEY = { hat: "hat", armor: "top", pants: "legs", shoes: "shoes", gloves: "gloves", belt: "belt", cape: "cape" };   // ô trang bị → khoá trong "look" (đưa cho buildComposite)
function slotOf(it) { return it && it.slot ? (SLOT_ALIAS[it.slot] || it.slot) : null; }

/* ---------- chỉ số ---------- */
function gearWith(ov) {   // tổng chỉ số của 7 ô trang bị (vũ khí không tính ở đây); ov = { ô: id } để thử đồ
  const g = { hp: 0, mana: 0, hpRegen: 0, mpRegen: 0, speed: 0, voice: 0, ears: 0, stamina: 0, resist: 0, luck: 0 };
  const E = Object.assign({}, save.equip, ov || {});
  Object.keys(LOOK_KEY).forEach(sl => { const it = ITEMS[E[sl]]; if (it && it.stats) for (const k in it.stats) g[k] = (g[k] || 0) + (it.stats[k] || 0); });
  return g;
}
function gear() { return gearWith(null); }
function mpMax() { return 100 + gear().mana; }
function calcStats(ov) {   // các chỉ số hiển thị (có tính đồ thử)
  const g = gearWith(ov), g0 = gear();
  return { hp: hpMax() - g0.hp - g0.stamina * 2 + g.hp + g.stamina * 2, mp: 100 + g.mana, voice: g.voice, ears: g.ears, resist: g.resist, hpRegen: g.hpRegen, mpRegen: g.mpRegen, speed: g.speed, luck: g.luck };
}
function powerScoreWith(ov) {   // LỰC CHIẾN: số nguyên, không ngẫu nhiên. Gợi ý của thiết kế: chiêu gắn × bậc × cấp × vũ khí × voice, cộng máu / kháng / mana
  const C = save.combat || {}, st = calcStats(ov), lv = save.level || 1;
  const ids = (C.slots || []).filter(id => typeof SKILLS !== "undefined" && SKILLS[id] && SKILLS[id].base);
  let avg = 0;
  ids.forEach(id => { avg += SKILLS[id].base * (1 + 0.25 * Math.max(0, (C.skills && C.skills[id] || 1) - 1)); });
  avg = ids.length ? avg / ids.length : 0;
  let wid = ov && "weapon" in ov ? ov.weapon : (C.weapons && C.weapons[C.wIdx || 0]);
  const wp = ITEMS[wid] && ITEMS[wid].weapon ? ITEMS[wid].weapon.pct || 0 : 0;
  return Math.round(avg * (1 + 0.04 * lv) * (1 + wp / 100) * (1 + st.voice / 100) * 8 + st.hp * 1.5 + st.resist * 5 + st.mp);
}
function powerScore() { return powerScoreWith(null); }

/* ---------- găng tay / giày / thắt lưng: vật nhỏ gắn vào xương, tô màu tint ---------- */
const _extraMat = {};
function extraMat(c) { return _extraMat[c] || (_extraMat[c] = new THREE.MeshLambertMaterial({ color: c })); }
function addGearExtras(root, look) {
  if (!root || !look) return;
  const it = id => (id && ITEMS[id] && ITEMS[id].slot) ? ITEMS[id] : null, col = I => I.tint != null ? I.tint : 0xc9cfe0;
  const bone = n => { let f = null; root.traverse(o => { if (!f && o.isBone && o.name.replace(/[^a-zA-Z]/g, "").toLowerCase() === n.replace(/[^a-zA-Z]/g, "")) f = o; }); return f; };   // GLTFLoader bỏ dấu chấm trong tên xương
  const put = (b, geo, c, x, y, z, rx) => { if (!b) return; const m = new THREE.Mesh(geo, extraMat(c)); m.position.set(x, y, z); if (rx) m.rotation.x = rx; m.userData.gearExtra = true; b.add(m); };
  const gl = it(look.gloves), sh = it(look.shoes), bt = it(look.belt);
  if (gl) ["hand.l", "hand.r"].forEach(n => put(bone(n), new THREE.SphereGeometry(0.1, 10, 8), col(gl), 0, 0.02, 0));
  if (sh) ["foot.l", "foot.r"].forEach(n => put(bone(n), new THREE.BoxGeometry(0.17, 0.26, 0.12), col(sh), 0, 0.12, 0.03));
  if (bt) put(bone("hips"), new THREE.CylinderGeometry(0.27, 0.27, 0.09, 16, 1, true), col(bt), 0, 0.1, 0);
}

/* ---------- khung 3D nhân vật ---------- */
const BG = { open: false, tab: "gear", r: null, sc: null, cam: null, char: null, mixer: null, raf: 0, last: 0, rot: 0.35, key: "", wait: 0, fake: null, w: 0, h: 0 };
const _q = id => document.getElementById(id);
function bgDisposeChar() {
  if (BG.fake && typeof WEAPON_MODELS !== "undefined") try { WEAPON_MODELS.detach(BG.fake); } catch (e) {}
  if (BG.char) {
    BG.char.traverse(o => { if (o.userData && o.userData.gearExtra && o.geometry) o.geometry.dispose(); });   // chỉ dọn phần mình tạo; hình học / chất liệu của nhân vật dùng chung với game
    BG.sc.remove(BG.char);
  }
  BG.char = BG.mixer = BG.fake = null;
}
function bgBuild(look, weaponItem) {   // dựng bản sao nhân vật (đợi mô hình tải xong nếu cần)
  const files = lookFiles(look).filter((f, i, a) => a.indexOf(f) === i);
  for (const f of files) if (!modelTpl[f]) { loadModel(f); clearTimeout(BG.wait); BG.wait = setTimeout(() => { BG.key = ""; if (BG.open) drawBag(); }, 300); return; }
  bgDisposeChar();
  const hero = typeof isHero === "function" && isHero(look), root = hero ? buildHero(look) : buildComposite(look), grp = new THREE.Group(); grp.add(root); grp.rotation.y = BG.rot;
  root.traverse(o => { if (o.isMesh) o.frustumCulled = false; });
  BG.sc.add(grp); BG.char = grp;
  BG.mixer = new THREE.AnimationMixer(root);
  const idle = hero ? modelTpl[lookFiles(look)[0]].clips.find(c => c.name === "idle") : modelTpl.Rogue.clips.find(c => c.name === "Idle"); if (idle) BG.mixer.clipAction(idle).play();
  BG.heroU = hero ? { heroBones: heroBonesOf(root), heroKind: look.head, cur: "Idle", fx: null } : null;   // dáng đứng riêng nam / nữ giống ngoài game
  BG.mixer.update(0.01); if (BG.heroU) heroPose(BG.heroU, 0);
  if (weaponItem && typeof WEAPON_MODELS !== "undefined") try { BG.fake = { userData: { mesh: root } }; if (!WEAPON_MODELS.attach(BG.fake, WEAPON_MODELS.make(weaponItem))) BG.fake = null; } catch (e) { BG.fake = null; }
}
function bgStart() {
  const cv = _q("bgCv");
  try { BG.r = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true }); } catch (e) { BG.r = null; return; }
  BG.r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  BG.sc = new THREE.Scene();
  BG.sc.add(new THREE.AmbientLight(0xffffff, 0.8));
  const d = new THREE.DirectionalLight(0xffffff, 0.75); d.position.set(2, 4, 3); BG.sc.add(d);
  const d2 = new THREE.DirectionalLight(0x9db4ff, 0.35); d2.position.set(-3, 2, -2); BG.sc.add(d2);
  BG.cam = new THREE.PerspectiveCamera(28, 1, 0.1, 30); BG.cam.position.set(0, 1.0, 5.9); BG.cam.lookAt(0, 0.9, 0);
  BG.last = performance.now();
  const loop = now => {
    if (!BG.open) return;
    BG.raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - BG.last) / 1000); BG.last = now;
    const w = cv.clientWidth, h = cv.clientHeight;
    if (w && h && (w !== BG.w || h !== BG.h)) { BG.w = w; BG.h = h; BG.r.setSize(w, h, false); BG.cam.aspect = w / h; BG.cam.updateProjectionMatrix(); }
    if (BG.char) { BG.char.rotation.y = BG.rot; if (BG.mixer) { BG.mixer.update(dt); if (BG.heroU) heroPose(BG.heroU, dt); } }
    BG.r.render(BG.sc, BG.cam);
  };
  BG.raf = requestAnimationFrame(loop);
  let drag = null;   // kéo ngang để xoay
  cv.onpointerdown = e => { drag = e.clientX; try { cv.setPointerCapture(e.pointerId); } catch (x) {} };
  cv.onpointermove = e => { if (drag == null) return; BG.rot += (e.clientX - drag) * 0.012; drag = e.clientX; };
  cv.onpointerup = cv.onpointercancel = () => { drag = null; };
}
function bgStop() {
  BG.open = false; cancelAnimationFrame(BG.raf); clearTimeout(BG.wait);
  if (BG.sc) bgDisposeChar();
  if (BG.r) { BG.r.dispose(); try { BG.r.forceContextLoss(); } catch (e) {} }
  BG.r = BG.sc = BG.cam = null; BG.key = ""; BG.w = BG.h = 0;
}

/* ---------- bảng ---------- */
let bagSel = null;   // món đang chọn: id món trong túi, hoặc "eq:<ô>" khi chạm ô đang mặc
const BG_STATS = [["hp", "❤️", "Max HP", ""], ["mp", "💧", "Max Mana", ""], ["voice", "🗣️", "Skill damage", "%"], ["ears", "👂", "Answer time", "s"], ["resist", "🛡️", "Poison resist", "%"],
  ["hpRegen", "❤️", "HP regen /s", ""], ["mpRegen", "💧", "Mana regen", "%"], ["speed", "🏃", "Run speed", "%"], ["luck", "🍀", "Luck", "%"]];
function bgCss() {
  if (_q("bgCss")) return;
  const s = document.createElement("style"); s.id = "bgCss";
  s.textContent = `#bag .ev-panel{max-width:520px;margin:0 auto}#bag .ev-in{padding:10px 12px 14px}
.bg-head{display:flex;align-items:center;gap:8px}.bg-head .ev-title{flex:1}.bg-head .ev-btn{padding:4px 12px}
.bg-stage{display:grid;grid-template-columns:58px 1fr 58px;gap:6px;margin-top:8px;align-items:stretch}
.bg-col{display:flex;flex-direction:column;gap:6px}
.bg-col .ev-slot{width:58px;height:58px;font-size:26px;padding:0;cursor:pointer}
.bg-col .ev-slot.empty{font-size:22px}.bg-col .ev-slot.empty>span.ic{opacity:.3}.bg-col .ev-slot.sel,.bg-grid .ev-slot.sel{outline:2px solid var(--ev-gold);outline-offset:-3px}
.bg-col .ev-slot small{position:absolute;left:0;right:0;bottom:2px;text-align:center;font:600 8px var(--ev-font);color:var(--ev-mut)}
.bg-view{position:relative;min-height:250px;background:radial-gradient(ellipse at 50% 85%,#3a4677 0,#1b2340 55%,#0e1328 100%);clip-path:var(--ev-chamf);box-shadow:inset 0 0 0 2px #3a4677}
.bg-view canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:pan-y;cursor:grab}
.bg-view .hint{position:absolute;left:0;right:0;bottom:4px;text-align:center;font:600 10px var(--ev-font);color:var(--ev-mut);pointer-events:none}
.bg-view .try{position:absolute;left:6px;top:6px;font:700 11px var(--ev-font);color:#2a1a00;background:var(--ev-gold);padding:1px 8px;clip-path:polygon(5px 0,100% 0,calc(100% - 5px) 100%,0 100%)}
.bg-pow{margin-top:10px;text-align:center;font:700 22px var(--ev-font);color:var(--ev-gold);text-shadow:0 2px 0 #7a5212}.bg-pow small{font-size:14px;margin-left:6px}
.bg-stats{display:grid;grid-template-columns:1fr 1fr;gap:3px 10px;margin-top:6px;font:600 11px var(--ev-font)}
.bg-stats div{min-width:0;display:flex;justify-content:space-between;gap:4px;padding:3px 6px;background:rgba(255,255,255,.05);border-left:2px solid var(--ev-line);white-space:nowrap}
.bg-stats div span{overflow:hidden;text-overflow:ellipsis;color:var(--ev-mut)}.bg-stats div b{flex:none;color:var(--ev-fg)}
.up{color:var(--ev-ok)!important}.dn{color:var(--ev-bad)!important}
.bg-tabs{display:flex;gap:6px;margin-top:10px}.bg-tabs .ev-btn{flex:1;padding:6px 4px;font-size:12px}
.bg-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-top:8px}
.bg-grid .ev-slot{aspect-ratio:1/1;font-size:26px;padding:0;cursor:pointer;min-width:0}.bg-grid .ev-slot.empty{opacity:.45}
.bg-grid .ev-slot .c{position:absolute;right:5px;bottom:2px;font:700 11px var(--ev-font)}.bg-grid .ev-slot .lk{position:absolute;left:4px;top:2px;font:700 9px var(--ev-font);color:var(--ev-gold)}
.bg-det{margin-top:10px;padding:10px;background:rgba(255,255,255,.06);border-left:3px solid var(--ev-gold);font-size:13px}.bg-det .nm{font:700 16px var(--ev-font)}
.bg-det .acts{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}`;
  document.head.appendChild(s);
}
function bgShell() {
  const b = _q("bag");
  b.innerHTML = '<div class="ev-panel"><div class="ev-in"><div class="bg-head"><span class="ev-title">🎒 Bag</span><span id="bgCoins" style="font:600 13px var(--ev-font)"></span><button class="ev-btn alt" id="bagClose">✕</button></div>' +
    '<div class="bg-stage"><div class="bg-col" id="bgL"></div><div class="bg-view"><canvas id="bgCv"></canvas><span class="try" id="bgTry" style="display:none">Try on</span><div class="hint">↔ drag to rotate</div></div><div class="bg-col" id="bgR"></div></div>' +
    '<div class="bg-pow" id="bgPow"></div><div class="bg-stats" id="bgStats"></div><div class="bg-tabs" id="bgTabs"></div><div class="bg-grid" id="bgGrid"></div><div id="bgDet"></div></div></div>';
  _q("bagClose").onclick = closeBag;
}
function openBag() {
  bgCss(); if (BG.open) return;
  bgShell(); _q("bag").style.display = "block"; BG.open = true; BG.key = "";
  bgStart(); drawBag();
}
function closeBag() { _q("bag").style.display = "none"; bgStop(); _q("bag").innerHTML = ""; bagSel = null; }
function bgDiff(a, b, unit, dec) {   // ▲ +N / ▼ −N
  const d = Math.round((b - a) * 100) / 100; if (!d) return "";
  return '<small class="' + (d > 0 ? "up" : "dn") + '"> ' + (d > 0 ? "▲ +" : "▼ ") + (dec ? d : Math.round(d)) + unit + "</small>";
}
function drawBag() {
  if (!BG.open) return;
  _q("bgCoins").textContent = "🪙 " + save.coins + " · ❤️ " + Math.round(hpNow()) + "/" + hpMax() + (isPoisoned() ? " · ☠️" : "") + (isProtected() ? " · 🛡️" : "");
  const sel = bagSel, worn = sel && sel.indexOf("eq:") === 0 ? sel.slice(3) : null, curW = curWeapon();
  const selId = worn ? (worn === "weapon" ? (curW && Object.keys(ITEMS).find(k => ITEMS[k] === curW)) : save.equip[worn]) : sel, it = selId && ITEMS[selId];
  const inBag = !worn && it && save.items[selId];
  // đồ thử: món mặc được trong túi
  let ov = null;
  if (inBag) { if (slotOf(it)) ov = { [slotOf(it)]: selId }; else if (it.weapon) ov = { weapon: selId }; }
  const trying = !!ov;
  // 8 ô trang bị
  const fill = (el, list) => {
    el.innerHTML = "";
    list.forEach(sl => {
      const id = sl === "weapon" ? (curW && Object.keys(ITEMS).find(k => ITEMS[k] === curW)) : save.equip[sl], o = id && ITEMS[id], shown = ov && ov[sl] ? ITEMS[ov[sl]] : o;
      const b = document.createElement("button"); b.className = "ev-slot" + (shown && shown.rarity ? " r-" + shown.rarity : "") + (shown ? "" : " empty") + (worn === sl ? " sel" : "");
      b.innerHTML = (shown ? shown.icon : '<span class="ic">' + SLOT_INFO[sl][0] + "</span>") + "<small>" + SLOT_INFO[sl][1] + "</small>";
      b.onclick = () => { bagSel = "eq:" + sl; drawBag(); }; el.appendChild(b);
    });
  };
  fill(_q("bgL"), SLOT_ORDER_L); fill(_q("bgR"), SLOT_ORDER_R);
  // khung 3D
  const look = Object.assign(myLook(), ov ? (slotOf(it) ? { [LOOK_KEY[slotOf(it)]]: selId } : {}) : {});
  const wpn = ov && ov.weapon ? ITEMS[ov.weapon] : curW, key = JSON.stringify(look) + (wpn ? wpn.name : "");
  if (BG.r && key !== BG.key) { BG.key = key; bgBuild(look, wpn); }
  _q("bgTry").style.display = trying ? "block" : "none";
  // Lực chiến + chỉ số
  const p0 = powerScore(), p1 = trying ? powerScoreWith(ov) : p0, s0 = calcStats(null), s1 = trying ? calcStats(ov) : s0;
  _q("bgPow").innerHTML = "⚔️ Power " + p1 + (trying && p1 !== p0 ? '<small class="' + (p1 > p0 ? "up" : "dn") + '">' + (p1 > p0 ? "▲ " : "▼ ") + Math.abs(p1 - p0) + "</small>" : "");
  _q("bgStats").innerHTML = BG_STATS.map(([k, ic, nm, u]) => {
    const v = s1[k], dec = k === "hpRegen";
    return "<div><span>" + ic + " " + nm + "</span><b>" + (u === "%" && v ? "+" : "") + (dec ? Math.round(v * 10) / 10 : Math.round(v)) + u + bgDiff(s0[k], s1[k], u, dec) + "</b></div>";
  }).join("");
  // tab + lưới túi
  if (BG.tab !== "gear" && BG.tab !== "use") BG.tab = "gear";
  const tabs = [["gear", "Gear"], ["use", "Items"]];
  _q("bgTabs").innerHTML = ""; tabs.forEach(([t, nm]) => { const b = document.createElement("button"); b.className = "ev-btn" + (BG.tab === t ? "" : " alt"); b.textContent = nm; b.onclick = () => { BG.tab = t; drawBag(); }; _q("bgTabs").appendChild(b); });
  const isGear = id => ITEMS[id] && (slotOf(ITEMS[id]) || ITEMS[id].weapon);
  const ids = Object.keys(save.items).filter(id => ITEMS[id] && (BG.tab === "gear") === !!isGear(id));
  const cells = BAG_KIND_SIZE, grid = _q("bgGrid"); grid.innerHTML = "";
  for (let i = 0; i < cells; i++) {
    const id = ids[i], x = id && ITEMS[id], b = document.createElement("button");
    b.className = "ev-slot" + (x && x.rarity ? " r-" + x.rarity : "") + (x ? "" : " empty") + (id && id === sel ? " sel" : "");
    if (x) { b.innerHTML = x.icon + (save.items[id] > 1 ? '<span class="c">×' + save.items[id] + "</span>" : "") + (x.lv > playerLevel() ? '<span class="lk">🔒' + x.lv + "</span>" : ""); b.onclick = () => { bagSel = bagSel === id ? null : id; drawBag(); }; }
    grid.appendChild(b);
  }
  // chi tiết + nút
  const d = _q("bgDet"); d.innerHTML = "";
  if (!it || (!worn && !inBag)) return;
  const sl = slotOf(it);
  d.innerHTML = '<div class="bg-det"><div class="nm">' + it.icon + " " + it.name + "</div>" + (it.rarity ? rarityTag(it) : "") +
    "<div>" + (sl ? SLOT_INFO[sl][0] + " " + SLOT_INFO[sl][1] + " · " : it.weapon ? "📢 Weapon · " : "") + (it.stats && it.rarity ? statsText(it.stats) : "") + "</div>" +
    '<div style="opacity:.85;margin-top:4px">' + (it.desc || "") + '</div><div class="acts"></div></div>';
  const act = (t, f, cls) => { const b = document.createElement("button"); b.className = "ev-btn " + (cls || ""); b.textContent = t; b.onclick = f; d.querySelector(".acts").appendChild(b); };
  if (worn) {
    if (worn === "weapon") act("Take off", () => { if (!addItem(save.items, BAG_SIZE, selId)) { flash(bagFullMsg(selId)); return; } save.combat.weapons = [null, null]; save.combat.wIdx = 0; saveNow(); if (typeof drawCombatHud === "function") drawCombatHud(); bagSel = null; drawBag(); }, "alt");
    else act("Take off", () => { takeOff(worn); bagSel = null; drawBag(); }, "alt");
  } else if (sl) {
    act("Equip" + (playerLevel() < it.lv ? " 🔒 Lv." + it.lv : ""), () => wear(selId), "ok"); act("Cancel", () => { bagSel = null; drawBag(); }, "alt");
  } else if (it.weapon) {
    act("Equip" + (playerLevel() < it.lv ? " 🔒 Lv." + it.lv : ""), () => { equipWeapon(selId); bagSel = null; drawBag(); }, "ok"); act("Cancel", () => { bagSel = null; drawBag(); }, "alt");
  } else { act("Use", () => useItem(selId)); act("Cancel", () => { bagSel = null; drawBag(); }, "alt"); }
}
_q("bagBtn").onclick = () => { bagSel = null; openBag(); };

/* EnglishVerse – CHIẾN ĐẤU THỜI GIAN THỰC ở vùng hoang dã (giai đoạn A). Thiết kế: docs/design/voice-combat.html.
   Mô hình 3 lớp: KỸ NĂNG quyết định hiệu ứng · VOICE DECK quyết định bài nói · VŨ KHÍ quyết định sức mạnh (+ cộng hưởng loại bài).
   - Đánh thường (⚔️, không nói) yếu; chiêu (nói) mạnh: Perfect 100% · Good 70% · Weak 30% · Miss = hoàn ½ mana.
   - Đang nói: khiên −70% sát thương. Mana đầy lại sau ~8 giây. Hết máu: xám màn hình 2 giây, về cổng vùng.
   - Quái đi tuần, thấy người thì đuổi, đánh có vòng đỏ báo trước. Chết thì rơi xu + đồ xuống đất, tự đi tới nhặt.
   - Lên cấp tới Lv.100 ≈ 360 giờ (levelForXp). Quá 2 giờ chơi trong ngày: đánh quái không còn kinh nghiệm.
   Dùng hàm chung của index.html: $, save, saveNow, score, checkLevel, renderHud, flash, speak, match, norm, SR, practice, spokeOk,
   allCards, hasCard, stars, gear, isPoisoned, addCoins, addItem, BAG_SIZE, ITEMS, charAct, nameTag, popText, setWide, camWide, player, scene.
   Dữ liệu đề: VOICE_DECK (deck.js), VOCAB (places.js), ECHO_LINES (index.html). Vùng: WILDS (parts/world/wilds.js). Mô hình quái: MONSTER_MODELS. */

/* ---------- 1. NHỊP LÊN CẤP (tới Lv.100) ---------- */
const XP_PER_HOUR = 3000;   // ước tính khi chơi đều: ~5 lần nói đúng / phút + hạ quái
function hoursForLevel(L) {   // số giờ để đi từ cấp L lên L+1
  if (L < 20) return 0.15 + (L - 1) * 0.7 / 18;   // Lv.1–20: ~10 giờ (lúc đầu nhanh để có hứng)
  if (L < 40) return 2; if (L < 60) return 3.5; if (L < 80) return 5; return 7;   // tổng ~360 giờ
}
const XP_CUM = [0, 0]; for (let L = 1; L < 100; L++) XP_CUM[L + 1] = XP_CUM[L] + Math.round(hoursForLevel(L) * XP_PER_HOUR / 10) * 10;
function levelForXp(xp) { let L = 1; while (L < 100 && xp >= XP_CUM[L + 1]) L++; return L; }
function xpToNext() { const L = save.level || 1; return L >= 100 ? 0 : XP_CUM[L + 1] - score; }
const DAY_LIMIT = 7200;   // giây chơi mỗi ngày còn nhận kinh nghiệm từ quái

/* ---------- 2. QUÁI ---------- */
const MON = {
  ghost: { name: "Echo Ghost", icon: "👻", weak: "repeat", hp: 1.0, dmg: 1.0, speed: 1.0, range: 2.0 },
  bug:   { name: "Riddle Bug", icon: "🐞", weak: "answer", hp: 0.9, dmg: 0.9, speed: 1.1, range: 2.0 },
  worm:  { name: "Scramble Worm", icon: "🪱", weak: "build", hp: 1.2, dmg: 1.1, speed: 0.8, range: 2.4 },
  crab:  { name: "Question Crab", icon: "🦀", weak: "answer", hp: 1.3, dmg: 1.0, speed: 0.9, range: 2.2 },
  bat:   { name: "Blank Bat", icon: "🦇", weak: "name", hp: 0.8, dmg: 1.2, speed: 1.3, range: 2.0 }
};
const SEASON_MON = { spring: ["ghost", "bug", "bug"], tropic: ["crab", "worm", "bug"], desert: ["bat", "worm", "crab"], autumn: ["bug", "bat", "ghost"], winter: ["ghost", "bat", "crab"] };
const TASK_ICON = { repeat: "📢", answer: "🎺", build: "🎸", name: "🥁", ask: "💬" };
const TASK_NAME = { repeat: "REPEAT · nói lại", answer: "ANSWER · trả lời", build: "BUILD · xếp câu", name: "NAME · gọi tên", ask: "ASK · đặt câu hỏi" };

/* ---------- 3. KỸ NĂNG (giai đoạn A: Power + Rhythm, mỗi nhánh 3 chiêu; Control, Harmony mở ở giai đoạn B) ---------- */
const SKILLS = {
  echo_blast:   { branch: "power",  name: "Echo Blast",   icon: "💥", lv: 1,  mana: 25, cd: 3, base: 40, kind: "single", desc: "Nổ âm thanh vào 1 quái." },
  sonic_spear:  { branch: "power",  name: "Sonic Spear",  icon: "🔱", lv: 6,  mana: 35, cd: 6, base: 75, kind: "single", desc: "Giáo âm thanh, sát thương rất cao 1 mục tiêu." },
  thunder_clap: { branch: "power",  name: "Thunder Clap", icon: "⚡", lv: 12, mana: 30, cd: 5, base: 55, kind: "single", stun: 0.8, desc: "Sét đánh 1 quái, choáng ngắn." },
  drum_roll:    { branch: "rhythm", name: "Drum Roll",    icon: "🥁", lv: 1,  mana: 25, cd: 3, base: 18, kind: "multi", hits: 3, desc: "3 đòn liền, nảy sang quái gần đó." },
  shock_wave:   { branch: "rhythm", name: "Shock Wave",   icon: "🌀", lv: 6,  mana: 35, cd: 6, base: 38, kind: "aoe", radius: 5, desc: "Sóng tròn quanh mình, trúng cả cụm." },
  beat_dash:    { branch: "rhythm", name: "Beat Dash",    icon: "🔥", lv: 12, mana: 30, cd: 5, base: 45, kind: "dash", radius: 3, desc: "Lướt tới quái, nổ vùng khi chạm." }
};
const BRANCH = { power: { name: "Power", color: "#e5484d", icon: "⚡" }, control: { name: "Control", color: "#3b82f6", icon: "🌀" }, harmony: { name: "Harmony", color: "#2f9e44", icon: "💚" }, rhythm: { name: "Rhythm", color: "#e8590c", icon: "🔥" } };
function skillRank(id) { return (save.combat.skills[id] || 0); }
function spTotal() { const L = save.level || 1; return L + Math.floor(L / 10); }   // 1 điểm mỗi cấp + 1 mỗi 10 cấp
function spLeft() { return spTotal() - Object.values(save.combat.skills).reduce((a, b) => a + b, 0); }

/* ---------- 4. VŨ KHÍ: 4 dòng × 8 bậc + dòng hiếm Maestro (đăng ký vào ITEMS lúc chạy) ---------- */
const W_TIER = [{ lv: 1, pct: 8, r: "common" }, { lv: 8, pct: 15, r: "common" }, { lv: 16, pct: 22, r: "uncommon" }, { lv: 28, pct: 30, r: "uncommon" }, { lv: 42, pct: 40, r: "rare" }, { lv: 58, pct: 52, r: "epic" }, { lv: 75, pct: 65, r: "epic" }, { lv: 90, pct: 80, r: "legendary" }];
const W_LINES = {
  power:   { icon: "📢", names: ["Wooden Megaphone", "Brass Horn", "Lightning Rod", "Thunder Hammer", "Storm Horn", "Sky Breaker", "Titan Horn", "Dragon Roar Horn"] },
  control: { icon: "🪄", names: ["Chalk Wand", "Crystal Wand", "Frost Scepter", "Moon Staff", "Star Scepter", "Ice Crown Staff", "Night Scepter", "Time Scepter"] },
  harmony: { icon: "🪈", names: ["Bamboo Flute", "Little Lyre", "Bell Staff", "Leaf Harp", "Sun Harp", "Rainbow Lyre", "Spirit Bell", "World Tree Harp"] },
  rhythm:  { icon: "🥢", names: ["Bamboo Sticks", "Twin Batons", "Fire Tambourine", "Storm Gloves", "Thunder Drums", "Lava Sticks", "Comet Drums", "Phoenix Drums"] }
};
const RESO = ["repeat", "answer", "build", "name"];
function registerWeapons() {
  Object.keys(W_LINES).forEach((line, li) => W_LINES[line].names.forEach((nm, t) => {
    const T = W_TIER[t], id = "w_" + line + (t + 1), reso = RESO[(li + t) % 4];
    ITEMS[id] = { name: nm, icon: W_LINES[line].icon, price: Math.round(20 * Math.pow(1.9, t)), rarity: T.r, lv: T.lv, weapon: { line, tier: t + 1, pct: T.pct, reso },
      desc: "Bậc " + (t + 1) + " · +" + T.pct + "% " + BRANCH[line].name + " · 🎵 " + TASK_ICON[reso] + " " + reso + " +30%" };
  }));
  [["Starlight Baton", 40, 25], ["Aurora Baton", 70, 45], ["Baton of the First Voice", 90, 65]].forEach(([nm, lv, pct], i) =>
    ITEMS["w_maestro" + (i + 1)] = { name: nm, icon: "🪄", price: 0, rarity: "legendary", lv, weapon: { line: "all", tier: i + 1, pct, reso: null, maestro: true }, desc: "✨ Maestro · +" + pct + "% cả 4 nhánh · chỉ có từ trùm, nhiệm vụ, đấu trường" });
}
function curWeapon() { const id = save.combat.weapons[save.combat.wIdx]; return id && ITEMS[id] ? ITEMS[id] : null; }
function equipWeapon(id) {
  const it = ITEMS[id]; if (!it || !it.weapon) return;
  if (playerLevel() < it.lv) { flash("🔒 Need Lv." + it.lv + " / Cần cấp " + it.lv); return; }
  const W = save.combat.weapons, slot = W[0] && W[1] ? save.combat.wIdx : (W[0] ? 1 : 0);
  W[slot] = id; save.combat.wIdx = slot; saveNow(); drawCombatHud(); flash(it.icon + " " + it.name + " equipped!<div style='font-size:13px;font-weight:400'>" + it.desc + "</div>");
}

/* ---------- 5. TRẠNG THÁI ---------- */
const CB = { on: false, sec: null, mons: [], drops: [], cast: null, cd: {}, atkCd: 0, mp: 100, harmony: 0, harmonyUntil: 0, lastType: "", lastHurt: 0, ko: false, wideBefore: false, rerollAt: 0, dayWarned: false, rings: [] };
function hpMax() { return 100 + ((save.level || 1) - 1) * 5; }
function hpNow() { return save.energy / 100 * hpMax(); }
function setHp(v) { save.energy = Math.max(0, Math.min(100, v / hpMax() * 100)); }

function initCombat() {
  const C = save.combat = save.combat || {};
  C.skills = C.skills || { echo_blast: 1, drum_roll: 1 };   // 2 chiêu khởi đầu (miễn phí)
  C.slots = C.slots || ["echo_blast", "drum_roll", null, null];
  C.weapons = C.weapons || [null, null]; C.wIdx = C.wIdx || 0;
  C.deck = C.deck || {}; RESO.forEach(t => C.deck[t] = C.deck[t] || { n: 0, good: 0 });
  registerWeapons();
  if (!C.starter) { C.starter = true; addItem(save.items, BAG_SIZE, "w_power1"); addItem(save.items, BAG_SIZE, "w_rhythm1"); C.weapons = ["w_power1", "w_rhythm1"]; }   // quà tân thủ
  buildCombatUi();
}
function buildCombatUi() {
  const css = document.createElement("style"); css.textContent = `
#cbHud{position:fixed;left:12px;top:calc(92px + env(safe-area-inset-top,0px));display:none;flex-direction:column;gap:4px;z-index:5;pointer-events:none}
.cbBar{width:170px;height:12px;border-radius:6px;background:rgba(0,0,0,.35);overflow:hidden;position:relative}.cbBar div{height:100%}.cbBar span{position:absolute;left:6px;top:-2px;font:700 10px system-ui;color:#fff}
#cbBtns{position:fixed;right:14px;bottom:calc(18px + env(safe-area-inset-bottom,0px));width:190px;height:190px;display:none;z-index:6}
#cbBtns button{position:absolute;border:0;border-radius:50%;color:#fff;font-size:22px;box-shadow:0 3px 10px rgba(0,0,0,.35);touch-action:none;-webkit-user-select:none;user-select:none}
#cbAtk{right:8px;bottom:8px;width:76px;height:76px;background:#f8f9fa!important;color:#1b2340!important;font-size:30px!important}
.cbSk{width:54px;height:54px}.cbSk .cd{position:absolute;inset:0;border-radius:50%;background:rgba(0,0,0,.55);font:700 13px system-ui;display:flex;align-items:center;justify-content:center}
.cbSk.rec{transform:scale(1.15);box-shadow:0 0 0 5px #35c9c4}
#cbCard{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(214px + env(safe-area-inset-bottom,0px));width:min(92vw,420px);background:#fff;color:#1b2340;border-radius:16px;padding:10px 14px;display:none;z-index:7;box-shadow:0 6px 20px rgba(0,0,0,.3)}
#cbCard .t{font:600 11px ui-monospace,monospace;color:#5b6482;display:flex;justify-content:space-between;gap:6px}#cbCard .q{font:700 18px system-ui;margin:4px 0}#cbCard .h{font-size:12px;color:#0f9a9a}
#cbCard .bar{height:4px;background:#e9ecef;border-radius:2px;margin-top:6px}#cbCard .bar div{height:100%;background:#0f9a9a;border-radius:2px}
#cbCard button{border:0;background:#e9ecef;border-radius:99px;padding:2px 10px;font-size:12px}
#cbKo{position:fixed;inset:0;background:rgba(80,80,80,.7);display:none;align-items:center;justify-content:center;color:#fff;font:800 24px system-ui;z-index:20;text-align:center}
#cbFood{position:fixed;right:12px;top:calc(140px + env(safe-area-inset-top,0px));display:none;flex-direction:column;gap:6px;z-index:5}
#cbFood button,#cbWpn{width:46px;height:46px;border-radius:12px;border:0;background:rgba(255,255,255,.85);font-size:22px;position:relative}
#cbFood b,#cbWpn b{position:absolute;right:2px;bottom:0;font:700 10px system-ui;color:#1b2340}
#skBtn{position:fixed;left:12px;top:calc(132px + env(safe-area-inset-top,0px));border:0;border-radius:99px;padding:6px 12px;font-weight:700;background:var(--panel);color:var(--ink);box-shadow:0 2px 8px rgba(0,0,0,.2);z-index:5}
#skPanel .brh{display:flex;align-items:center;gap:6px;font-weight:800;margin-top:12px}#skPanel .sk{display:flex;gap:8px;align-items:center;border:1px solid rgba(128,128,128,.3);border-radius:12px;padding:8px;margin-top:6px}
#skPanel .sk .ic{font-size:26px;width:36px;text-align:center}#skPanel .sk .tx{flex:1;font-size:13px}#skPanel .sk button{border:0;border-radius:10px;padding:6px 10px;font-weight:700}`;
  document.head.appendChild(css);
  const d = document.createElement("div"); d.innerHTML = `
<div id="cbHud"><div class="cbBar"><div id="cbHp" style="background:#e5484d"></div><span id="cbHpT"></span></div><div class="cbBar"><div id="cbMp" style="background:#3b82f6"></div><span id="cbMpT"></span></div><div class="cbBar" style="height:8px;width:120px"><div id="cbHm" style="background:#9b5de5"></div></div><div id="cbZone" style="font:700 12px system-ui;color:#fff;text-shadow:0 1px 3px #000"></div></div>
<div id="cbBtns"><button id="cbAtk">⚔️</button></div>
<div id="cbFood"><button id="cbWpn" title="Swap weapon"></button><button id="cbF0"></button><button id="cbF1"></button></div>
<div id="cbCard"><div class="t"><span id="cbCt"></span><span><button id="cbReroll">🔄 đổi đề</button></span></div><div class="q" id="cbCq"></div><div class="h" id="cbCh"></div><div class="bar"><div id="cbCbar"></div></div></div>
<div id="cbKo"><div>🤐 You lost your voice…<div style="font:500 14px system-ui;margin-top:8px">Mất giọng! Về cổng vùng sau 2 giây</div></div></div>
<button id="skBtn">🌟 Skills</button>
<div id="skPanel" class="over"><div class="box" style="padding:12px;max-height:80vh;overflow:auto"><div style="display:flex;justify-content:space-between;align-items:center"><b>🌟 Skills · <span id="skSp"></span></b><button class="x" id="skClose">✕</button></div><div id="skBody"></div></div></div>`;
  document.body.appendChild(d);
  const B = $("cbBtns");
  [[0, 98, 4], [1, 66, 68], [2, 8, 100], [3, 120, 128]].forEach(([i, r, b]) => { const e = document.createElement("button"); e.className = "cbSk"; e.id = "cbS" + i; e.style.right = r + "px"; e.style.bottom = b + "px"; B.appendChild(e); skillButton(e, i); });
  $("cbAtk").addEventListener("pointerdown", e => { e.preventDefault(); normalAttack(); });
  $("cbWpn").onclick = () => { const W = save.combat.weapons; if (W[0] && W[1]) { save.combat.wIdx = 1 - save.combat.wIdx; saveNow(); drawCombatHud(); const w = curWeapon(); popText(w.icon, player.position, "#9b5de5"); } };
  [0, 1].forEach(i => $("cbF" + i).onclick = () => { const id = $("cbF" + i).dataset.id; if (id) { useItem(id); drawCombatHud(); } });
  $("cbReroll").onclick = reroll;
  $("skBtn").onclick = () => { drawSkills(); $("skPanel").style.display = "block"; };
  $("skClose").onclick = () => $("skPanel").style.display = "none";
  drawCombatHud();
}
function drawCombatHud() {
  if (!$("cbHud")) return;
  for (let i = 0; i < 4; i++) { const id = save.combat.slots[i], S = SKILLS[id], b = $("cbS" + i); b.style.display = S ? "block" : "none"; if (S) { b.style.background = BRANCH[S.branch].color; b.innerHTML = S.icon + "<div class='cd' style='display:none'></div>"; } }
  const w = curWeapon(); $("cbWpn").innerHTML = (w ? w.icon : "✋") + "<b>" + (w ? "T" + w.weapon.tier : "") + "</b>";
  const foods = Object.keys(save.items).filter(k => ITEMS[k] && ITEMS[k].energy).sort((a, b) => ITEMS[b].energy - ITEMS[a].energy).slice(0, 2);
  [0, 1].forEach(i => { const f = foods[i], b = $("cbF" + i); b.dataset.id = f || ""; b.innerHTML = f ? ITEMS[f].icon + "<b>×" + save.items[f] + "</b>" : ""; b.style.visibility = f ? "visible" : "hidden"; });
}

/* ---------- 6. VÀO / RA VÙNG HOANG DÃ ---------- */
function setCombatOn(on, sec) {
  CB.on = on; CB.sec = sec;
  ["cbHud", "cbFood"].forEach(id => $(id).style.display = on ? "flex" : "none"); $("cbBtns").style.display = on ? "block" : "none";
  if (on) { CB.wideBefore = camWide; if (!camWide) setWide(true); $("cbZone").textContent = "📍 " + sec.name + " · Ring " + sec.ring; drawCombatHud();
    flash("🌿 " + sec.name + "<div style='font-size:13px;font-weight:400'>Monster zone! Tap ⚔️ to hit, tap a skill and SPEAK to cast. / Vùng quái: bấm ⚔️ đánh thường, bấm chiêu rồi NÓI để tung chiêu.</div>"); }
  else { if (!CB.wideBefore && camWide) setWide(false); endCast(true); }
}

/* ---------- 7. VÒNG LẶP ---------- */
function updateCombat(dt, t) {
  if (!save || !save.combat || typeof WILDS === "undefined") return;
  dayTick(dt);
  const sec = (!room && !maze) ? WILDS.sectorAt(player.position.x, player.position.z) : null;
  if (!!sec !== CB.on || (sec && CB.sec && sec.dir !== CB.sec.dir)) setCombatOn(!!sec, sec);
  CB.mp = Math.min(100, CB.mp + dt * 12.5);
  for (const k in CB.cd) CB.cd[k] = Math.max(0, CB.cd[k] - dt);
  CB.atkCd = Math.max(0, CB.atkCd - dt);
  if (CB.on && !CB.ko && performance.now() - CB.lastHurt > 6000 && save.energy < 100) save.energy = Math.min(100, save.energy + dt * 1.2);   // ngoài trận: hồi máu chậm
  if (CB.on) { spawnTick(); }
  CB.mons.forEach(M => monTick(M, dt, t));
  CB.mons = CB.mons.filter(M => !M.gone);
  dropTick(dt, t);
  if (CB.cast) { CB.cast.left -= dt; $("cbCbar").style.width = Math.max(0, CB.cast.left / CB.cast.limit * 100) + "%"; if (CB.cast.left <= 0 && !CB.cast.rec) resolveCast([], "timeout"); }
  if (CB.on) hudTick();
}
let cbHudT = 0;
function hudTick() {
  if ((cbHudT += 1) % 6) return;   // cập nhật thanh ~10 lần/giây
  const hp = hpNow(), H = hpMax();
  $("cbHp").style.width = hp / H * 100 + "%"; $("cbHpT").textContent = "❤️ " + Math.round(hp) + "/" + H;
  $("cbMp").style.width = CB.mp + "%"; $("cbMpT").textContent = "💧 " + Math.round(CB.mp);
  $("cbHm").style.width = (performance.now() < CB.harmonyUntil ? 100 : CB.harmony) + "%";
  for (let i = 0; i < 4; i++) { const id = save.combat.slots[i], S = SKILLS[id], b = $("cbS" + i); if (!S) continue; const c = b.querySelector(".cd"), cd = CB.cd[id] || 0, low = CB.mp < S.mana;
    c.style.display = cd > 0 || low ? "flex" : "none"; c.textContent = cd > 0 ? Math.ceil(cd) + "s" : "💧"; }
}
function dayTick(dt) {
  const key = new Date().toDateString(); if (save.combat.day !== key) { save.combat.day = key; save.combat.daySec = 0; CB.dayWarned = false; }
  if (!document.hidden) save.combat.daySec = (save.combat.daySec || 0) + dt;
  if (save.combat.daySec > DAY_LIMIT && !CB.dayWarned && CB.on) { CB.dayWarned = true; flash("😴 Time to rest your voice!<div style='font-size:13px;font-weight:400'>Hôm nay đã chơi hơn 2 giờ: đánh quái không còn kinh nghiệm. Mai quay lại nhé!</div>"); }
}

/* ---------- 8. SINH QUÁI + HÀNH VI ---------- */
function ringLevel(x, z) { const d = Math.max(Math.abs(x), Math.abs(z)); return Math.max(1, Math.min(100, Math.round(1 + (d - 150) / 90 * 24))); }
function spawnTick() {
  const s = CB.sec, here = CB.mons.filter(M => M.dir === s.dir && !M.dead).length;
  if (here >= 9 || Math.random() > 0.05) return;
  const pts = WILDS.spawnPoints(s.dir, s.ring) || []; if (!pts.length) return;
  const far = pts.filter(p => Math.hypot(p.x - player.position.x, p.z - player.position.z) > 14 && Math.hypot(p.x - player.position.x, p.z - player.position.z) < 70);
  const p = (far.length ? far : pts)[Math.floor(Math.random() * (far.length ? far.length : pts.length))];
  const list = SEASON_MON[s.season] || SEASON_MON.spring; makeMon(list[Math.floor(Math.random() * list.length)], s, p.x, p.z);
}
function makeMon(type, sec, x, z) {
  const T = MON[type], lv = ringLevel(x, z);
  let model = null; try { if (MONSTER_MODELS.make) model = MONSTER_MODELS.make(type, sec.season, lv); } catch (e) {}
  if (!model) { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.SphereGeometry(0.6, 12, 10), mat(0xffd43b)); b.position.y = 0.7; g.add(b); model = { g, update() {} }; }
  const g = model.g; g.position.set(x, 0, z); scene.add(g);
  const tag = nameTag(T.icon + " " + T.name + " Lv." + lv, "sợ " + TASK_ICON[T.weak]); tag.position.y = 2.3; g.add(tag);
  const hpm = Math.round((40 + lv * 15) * T.hp);
  const M = { type, T, lv, dir: sec.dir, g, model, tag, hp: hpm, hpMax: hpm, home: { x, z }, tx: x, tz: z, state: "idle", atkT: 0, tele: null, stun: 0, dmgSkill: 0, dmgAll: 0, dead: false, gone: false, hurtT: 0 };
  CB.mons.push(M); return M;
}
function monTick(M, dt, t) {
  const p = M.g.position, P = player.position, dist = Math.hypot(P.x - p.x, P.z - p.z);
  if (M.dead) { M.deadT += dt; M.model.update(dt, t, "die"); M.g.scale.setScalar(Math.max(0.01, 1 - M.deadT)); if (M.deadT > 1) { scene.remove(M.g); M.gone = true; } return; }
  if (!CB.on || CB.sec.dir !== M.dir) { if (dist > 120) { scene.remove(M.g); M.gone = true; } return; }
  if (M.stun > 0) { M.stun -= dt; M.model.update(dt, t, "hit"); return; }
  const fromHome = Math.hypot(p.x - M.home.x, p.z - M.home.z), aggro = !CB.ko && dist < 9 && fromHome < 25;
  let state = "idle";
  if (M.tele) {   // đang ra đòn: vòng đỏ báo trước, hết 0,8 s thì trúng nếu người chơi còn trong vòng
    M.tele.t += dt; M.tele.ring.scale.setScalar(0.4 + M.tele.t / 0.8 * 0.6); state = "attack";
    if (M.tele.t >= 0.8) { if (Math.hypot(P.x - M.tele.x, P.z - M.tele.z) < M.T.range + 0.3) hurtPlayer(M); scene.remove(M.tele.ring); M.tele = null; M.atkT = 2.2; }
  } else if (aggro) {
    M.g.rotation.y = Math.atan2(P.x - p.x, P.z - p.z);
    if (dist > M.T.range * 0.8) { const s = 2.3 * M.T.speed * dt; movMon(M, (P.x - p.x) / dist * s, (P.z - p.z) / dist * s); state = "walk"; }
    M.atkT -= dt;
    if (dist < M.T.range + 0.6 && M.atkT <= 0) { const ring = new THREE.Mesh(new THREE.RingGeometry(M.T.range * 0.85, M.T.range, 28), new THREE.MeshBasicMaterial({ color: 0xe5484d, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }));
      ring.rotation.x = -Math.PI / 2; ring.position.set(P.x, 0.06, P.z); scene.add(ring); M.tele = { t: 0, ring, x: P.x, z: P.z }; }
  } else {   // đi tuần quanh nhà
    if (Math.hypot(M.tx - p.x, M.tz - p.z) < 0.5 || fromHome > 25) { M.tx = M.home.x + (Math.random() - 0.5) * 16; M.tz = M.home.z + (Math.random() - 0.5) * 16; }
    const dx = M.tx - p.x, dz = M.tz - p.z, d = Math.hypot(dx, dz) || 1; movMon(M, dx / d * 0.9 * dt, dz / d * 0.9 * dt); M.g.rotation.y = Math.atan2(dx, dz); state = "walk";
    if (M.hp < M.hpMax && dist > 20) M.hp = Math.min(M.hpMax, M.hp + dt * M.hpMax * 0.05);
  }
  if (M.hurtT > 0) { M.hurtT -= dt; state = "hit"; }
  M.model.update(dt, t, state);
}
function movMon(M, dx, dz) { const p = M.g.position; if (!blocked(p.x + dx, p.z)) p.x += dx; if (!blocked(p.x, p.z + dz)) p.z += dz; }
function hurtPlayer(M) {
  if (CB.ko) return;
  let dmg = (5 + M.lv * 1.3) * M.T.dmg * (1 - Math.min(60, gear().resist || 0) / 100);
  if (CB.cast) dmg *= 0.3;   // 🛡️ khiên giọng nói khi đang nói
  setHp(hpNow() - dmg); CB.lastHurt = performance.now(); charAct(player, "Hit_A");
  popText("-" + Math.round(dmg), player.position, CB.cast ? "#35c9c4" : "#e5484d");
  if (hpNow() <= 0) knockOut();
  saveSoon();
}
function knockOut() {   // hết máu: xám 2 giây rồi về cổng vùng
  CB.ko = true; endCast(true); $("cbKo").style.display = "flex"; talking = true;
  setTimeout(() => {
    const g = (WILDS.gates || []).find(G => CB.sec && G.dir === CB.sec.dir) || WILDS.gates[0];
    if (g) { player.position.set(g.x, 0, g.z); camSnap = true; }
    setHp(hpMax() * 0.5); CB.ko = false; talking = false; $("cbKo").style.display = "none"; saveNow(); renderHud();
  }, 2000);
}
let saveT = null; function saveSoon() { if (!saveT) saveT = setTimeout(() => { saveT = null; saveNow(); renderHud(); }, 1500); }

/* ---------- 9. ĐÁNH THƯỜNG + CHIÊU ---------- */
function nearestMon(r) { let best = null, bd = r; CB.mons.forEach(M => { if (M.dead || M.dir !== (CB.sec && CB.sec.dir)) return; const d = M.g.position.distanceTo(player.position); if (d < bd) { bd = d; best = M; } }); return best; }
function normalAttack() {
  if (!CB.on || CB.ko || CB.atkCd > 0) return;
  const M = nearestMon(3.2); CB.atkCd = 0.7; charAct(player, "1H_Melee_Attack_Chop");
  if (!M) return; player.rotation.y = Math.atan2(M.g.position.x - player.position.x, M.g.position.z - player.position.z);
  CB.mp = Math.min(100, CB.mp + 3);
  dealDamage(M, Math.round(4 + (save.level || 1) * 0.6), false);
}
function skillButton(btn, i) {   // bấm 1 lần: hiện đề; GIỮ nút để nói, thả tay là chấm
  let rec = null;
  btn.addEventListener("pointerdown", e => {
    e.preventDefault(); const id = save.combat.slots[i], S = SKILLS[id]; if (!S || !CB.on || CB.ko) return;
    if (!CB.cast) { startCast(id, btn); return; }
    if (CB.cast.id !== id || rec) return;
    if (!SR) { flash("🎤 Cần micro + Chrome/Safari để tung chiêu"); return; }
    try { speechSynthesis.cancel(); } catch (x) {}
    const r = new SR(); r.lang = "en-US"; r.interimResults = true; r.continuous = true; r.maxAlternatives = 3; let alts = [], err = "";
    r.onresult = ev => { alts = [""]; for (const res of ev.results) alts[0] += res[0].transcript; const last = ev.results[ev.results.length - 1]; for (let k = 1; k < last.length; k++) alts.push(last[k].transcript); $("cbCh").textContent = "🎙️ " + alts[0]; };
    r.onerror = ev => { err = ev.error; };
    r.onend = () => { rec = null; btn.classList.remove("rec"); if (CB.cast) { CB.cast.rec = false; resolveCast(alts.filter(Boolean), err); } };
    rec = r; CB.cast.rec = true; btn.classList.add("rec"); try { r.start(); } catch (x) { rec = null; CB.cast.rec = false; btn.classList.remove("rec"); }
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach(ev => btn.addEventListener(ev, () => { if (rec) try { rec.stop(); } catch (x) {} }));
  btn.addEventListener("contextmenu", e => e.preventDefault());
}
function startCast(id, btn) {
  const S = SKILLS[id];
  if ((CB.cd[id] || 0) > 0) return;
  if (CB.mp < S.mana) { popText("💧", player.position, "#3b82f6"); return; }
  const target = nearestMon(S.kind === "aoe" ? 6 : 11);
  if (!target && S.kind !== "aoe") { flash("🎯 No monster nearby / Không có quái gần đây"); return; }
  CB.mp -= S.mana;
  const task = drawTask(Math.min(5, skillRank(id)));
  CB.cast = { id, S, task, target, limit: 10, left: 10, rec: false };
  showCard(); speak(task.speak);
}
function showCard() {
  const c = CB.cast, k = c.task;
  $("cbCt").textContent = TASK_ICON[k.type] + " " + TASK_NAME[k.type] + " · " + c.S.name + (resoOn(k.type) ? " · 🎵 Resonance!" : "");
  $("cbCq").textContent = k.show; $("cbCh").textContent = "🎤 Giữ nút " + c.S.icon + " và nói" + (k.hint ? " · " + k.hint : "");
  $("cbReroll").style.visibility = performance.now() > CB.rerollAt ? "visible" : "hidden";
  $("cbCard").style.display = "block";
}
function reroll() { if (!CB.cast || performance.now() < CB.rerollAt || CB.mp < 10) return; CB.mp -= 10; CB.rerollAt = performance.now() + 20000; CB.cast.task = drawTask(Math.min(5, skillRank(CB.cast.id)), CB.cast.task.type); CB.cast.left = CB.cast.limit; showCard(); speak(CB.cast.task.speak); }
function endCast(silent) { CB.cast = null; $("cbCard") && ($("cbCard").style.display = "none"); }
function resoOn(type) { const w = curWeapon(); return !!(w && w.weapon.reso === type); }

/* Voice Deck: chọn loại bài (sàn 15%, loại yếu tới 35%) rồi lấy nội dung (ưu tiên thẻ của người chơi) */
function drawTask(band, avoid) {
  const st = save.combat.deck, rate = t => (st[t].good + 1) / (st[t].n + 2), avg = RESO.reduce((a, t) => a + rate(t), 0) / 4;
  let w = RESO.map(t => Math.max(0.15, Math.min(0.35, 0.25 + (avg - rate(t)) * 0.6)) * (t === avoid ? 0.3 : 1)), sum = w.reduce((a, b) => a + b, 0), r = Math.random() * sum, type = RESO[0];
  for (let i = 0; i < 4; i++) { r -= w[i]; if (r <= 0) { type = RESO[i]; break; } }
  return makeTask(type, band) || makeTask("repeat", band);
}
function cbPick(a) { return a[Math.floor(Math.random() * a.length)]; }
function wc(s) { return s.split(/\s+/).filter(Boolean).length; }
const BAND_WORDS = [0, [2, 4], [5, 6], [7, 8], [9, 10], [11, 12]];
function bandOk(s, band) { const n = wc(s), [a, b] = BAND_WORDS[band]; return n >= a - 1 && n <= b + 1; }
function makeTask(type, band) {
  const season = CB.sec ? CB.sec.season : "city";
  if (type === "repeat") {
    const mine = allCards().filter(c => hasCard(c.id) && c.ex && bandOk(c.ex, band)).sort((a, b) => stars(a.id) - stars(b.id));
    let line = mine.length && Math.random() < 0.7 ? mine[Math.floor(Math.random() * Math.min(5, mine.length))] : null;
    const text = line ? line.ex : (cbPick((VOICE_DECK.build || []).filter(b => b.band === band)) || { say: cbPick(ECHO_LINES)[1] }).say;
    return { type, show: "“" + text + "”", speak: text, target: text, card: line && line.id, hint: "nói lại câu này" };
  }
  if (type === "build") {
    const pool = (VOICE_DECK.build || []).filter(b => b.band === band && (b.topic === season || b.topic === "city" || Math.random() < 0.3)); const b = cbPick(pool.length ? pool : (VOICE_DECK.build || [])); if (!b) return null;
    const words = b.say.replace(/[.!?]$/, "").split(" "); let sh = words.slice(); for (let k = 0; k < 6 && sh.join(" ") === words.join(" "); k++) sh.sort(() => Math.random() - 0.5);
    return { type, show: (b.pic || "") + " " + sh.join(" / "), speak: "", target: b.say, hint: "nói cả câu đúng thứ tự" };
  }
  if (type === "answer") {
    const pool = (VOICE_DECK.answer || []).filter(a => a.band <= band && a.band >= band - 1 && (a.topic === season || a.topic === "city" || Math.random() < 0.3)); const a = cbPick(pool.length ? pool : (VOICE_DECK.answer || [])); if (!a) return null;
    return { type, show: (a.pic || "") + " " + a.q, speak: a.q, keys: a.keys, target: a.full, hint: "trả lời đủ câu được thưởng" };
  }
  if (type === "name") {
    const all = Object.values(VOCAB).flat(), mine = all.filter(v => hasCard("v:" + v.w)), v = cbPick(mine.length && Math.random() < 0.7 ? mine : all); if (!v) return null;
    return { type, show: v.pic + "  What is this?", speak: "What is this?", keys: [v.w.toLowerCase()], target: v.say, card: hasCard("v:" + v.w) ? "v:" + v.w : null, hint: band >= 3 ? "nói đủ: " + v.say.replace(v.w, "…") : "gọi tên" };
  }
  return null;
}
function grade(task, alts) {   // → 1 (Perfect) · 0.7 (Good) · 0.3 (Weak) · 0 (Miss)
  if (!alts.length) return 0;
  if (task.keys) {
    const ok = alts.some(h => { const W = " " + norm(h).join(" ") + " "; return task.keys.every(k => k.split("|").some(o => W.indexOf(" " + norm(o).join(" ") + " ") >= 0)); });
    const full = alts.some(h => match(task.target, h) >= 0.6);
    if (ok && (full || task.type === "name" && (skillRank(CB.cast.id) < 3))) return 1;
    if (ok) return 0.7; return full ? 0.3 : (alts.some(h => match(task.target, h) >= 0.3) ? 0.3 : 0);
  }
  const m = Math.max(...alts.map(h => match(task.target, h)));
  return m >= 0.85 ? 1 : m >= 0.6 ? 0.7 : m >= 0.3 ? 0.3 : 0;
}
function resolveCast(alts, err) {
  const c = CB.cast; if (!c) return;
  endCast();
  if (err === "not-allowed" || err === "service-not-allowed") { CB.mp += c.S.mana; flash("🎤 Hãy cho phép micro để tung chiêu"); return; }
  if (!alts.length && err !== "timeout") { CB.mp += c.S.mana; popText("🔇", player.position, "#868e96"); return; }   // không nghe thấy gì: không phạt
  const acc = grade(c.task, alts), st = save.combat.deck[c.task.type]; st.n++; if (acc >= 0.7) st.good++;
  if (acc === 0) { CB.mp += c.S.mana / 2; popText("Miss", player.position, "#868e96"); CB.cd[c.id] = 1; return; }
  popText(acc === 1 ? "Perfect!" : acc >= 0.7 ? "Good!" : "Weak", player.position, acc === 1 ? "#f08c00" : acc >= 0.7 ? "#2f9e44" : "#868e96");
  if (acc >= 0.7) { spokeOk(); if (c.task.card) practice(c.task.card); gainXp(4); harmonyStep(c.task.type); }
  CB.cd[c.id] = c.S.cd; castSkill(c, acc); saveSoon();
}
function harmonyStep(type) { if (performance.now() < CB.harmonyUntil) return; if (type !== CB.lastType) CB.harmony += 25; CB.lastType = type; if (CB.harmony >= 100) { CB.harmony = 0; CB.harmonyUntil = performance.now() + 5000; flash("🎼 HARMONY! ×2 damage · 5s"); } }
function skillDamage(c, acc, M) {
  const w = curWeapon(), S = c.S, rank = skillRank(c.id);
  let d = S.base * (1 + 0.25 * (rank - 1)) * (1 + (save.level || 1) * 0.04) * acc * (1 + (gear().voice || 0) / 100);
  if (w && (w.weapon.line === S.branch || w.weapon.line === "all")) d *= 1 + w.weapon.pct / 100;
  if (resoOn(c.task.type)) d *= 1.3;
  if (M && M.T.weak === c.task.type) d *= 1.5;
  if (performance.now() < CB.harmonyUntil) d *= 2;
  if (isPoisoned()) d *= 0.5;
  if (M && M.lv > (save.level || 1) + 8) d *= 0.3;   // quái mạnh hơn nhiều: nên lên cấp trước
  return Math.round(d);
}
function castSkill(c, acc) {
  const S = c.S, P = player.position; charAct(player, "Spellcast_Shoot");
  const alive = c.target && !c.target.dead ? c.target : nearestMon(11);
  if (alive) player.rotation.y = Math.atan2(alive.g.position.x - P.x, alive.g.position.z - P.z);
  const fx = (pos, color, size) => vfx(pos, color, size, skillRank(c.id));
  if (S.kind === "single" && alive) { fx(alive.g.position, BRANCH[S.branch].color, 1.2); dealDamage(alive, skillDamage(c, acc, alive), true); if (S.stun) alive.stun = S.stun; }
  if (S.kind === "multi" && alive) { let tgt = alive; for (let h = 0; h < S.hits; h++) { const M = tgt; setTimeout(() => { if (!M.dead) { fx(M.g.position, "#e8590c", 0.8); dealDamage(M, skillDamage(c, acc, M), true); } }, h * 220);
      const nx = CB.mons.filter(m => !m.dead && m !== tgt && m.g.position.distanceTo(tgt.g.position) < 4)[0]; if (nx) tgt = nx; } }
  if (S.kind === "aoe") { fx(P, "#e8590c", S.radius); CB.mons.forEach(M => { if (!M.dead && M.g.position.distanceTo(P) < S.radius) dealDamage(M, skillDamage(c, acc, M), true); }); }
  if (S.kind === "dash" && alive) { const a = alive.g.position, dx = a.x - P.x, dz = a.z - P.z, d = Math.hypot(dx, dz), step = Math.max(0, d - 1.2);
    for (let s = 0; s < 10; s++) { const nx = P.x + dx / d * step / 10, nz = P.z + dz / d * step / 10; if (!blocked(nx, nz)) { P.x = nx; P.z = nz; } }
    fx(a, "#e8590c", S.radius); CB.mons.forEach(M => { if (!M.dead && M.g.position.distanceTo(a) < S.radius) dealDamage(M, skillDamage(c, acc, M), true); }); }
}
const VFX = [];
function vfx(pos, color, size, rank) {   // hiệu ứng chiêu: bậc càng cao càng to, nhiều vòng, có hạt sáng
  const n = rank >= 5 ? 3 : rank >= 3 ? 2 : 1;
  for (let i = 0; i < n; i++) { const m = new THREE.Mesh(new THREE.TorusGeometry(0.5 + i * 0.3, 0.08 + 0.03 * rank, 8, 28), new THREE.MeshBasicMaterial({ color: i === 2 ? 0xffd43b : color, transparent: true, depthWrite: false }));
    m.rotation.x = Math.PI / 2; m.position.copy(pos).setY(0.4 + i * 0.4); scene.add(m); VFX.push({ m, t: -i * 0.08, size: size * (1 + rank * 0.15) }); }
  if (rank >= 3) for (let i = 0; i < 4 + rank * 2; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffd43b, transparent: true })); s.position.copy(pos).setY(1); s.userData.v = new THREE.Vector3((Math.random() - 0.5) * 6, 2 + Math.random() * 3, (Math.random() - 0.5) * 6); scene.add(s); VFX.push({ m: s, t: 0, spark: true }); }
}
function vfxTick(dt) { VFX.forEach(f => { f.t += dt; if (f.t < 0) return; const k = f.t / 0.5; if (f.spark) { f.m.position.addScaledVector(f.m.userData.v, dt); f.m.userData.v.y -= 9 * dt; } else f.m.scale.setScalar(1 + k * f.size); f.m.material.opacity = Math.max(0, 1 - k); if (k >= 1) { scene.remove(f.m); f.m.geometry.dispose(); f.m.material.dispose(); f.done = true; } }); for (let i = VFX.length - 1; i >= 0; i--) if (VFX[i].done) VFX.splice(i, 1); }
function dealDamage(M, dmg, bySkill) {
  if (M.dead) return; M.hp -= dmg; M.dmgAll += dmg; if (bySkill) M.dmgSkill += dmg; M.hurtT = 0.25;
  popText("-" + dmg, M.g.position, bySkill ? "#7048e8" : "#495057");
  if (M.hp <= 0) killMon(M);
}

/* ---------- 10. HẠ QUÁI: kinh nghiệm theo phần sát thương do CHIÊU NÓI + rơi đồ ---------- */
function gainXp(n) { if (save.combat.daySec > DAY_LIMIT) return 0; score += n; $("score").textContent = score; checkLevel(); return n; }
function killMon(M) {
  M.dead = true; M.deadT = 0; if (M.tele) { scene.remove(M.tele.ring); M.tele = null; }
  const share = M.dmgAll ? M.dmgSkill / M.dmgAll : 0, xp = gainXp(Math.round((6 + M.lv * 1.5) * share));
  if (xp) setTimeout(() => popText("+" + xp + " ⭐", M.g.position.clone(), "#f08c00"), 200);
  if (Math.random() < 0.5) { spiritCount++; try { localStorage.setItem("ev_spirits", spiritCount); } catch (e) {} }   // giải thoát thành Word Spirit
  const coins = Math.round((2 + M.lv * 0.6 + Math.random() * 3) * (1 + (gear().luck || 0) / 100)), p = M.g.position;
  dropAt(p.x, p.z, "coins", coins);
  const foods = Object.keys(ITEMS).filter(k => ITEMS[k].energy && ITEMS[k].price <= 15);
  if (Math.random() < 0.4) dropAt(p.x + 0.8, p.z, cbPick(foods));
  const w = Object.keys(ITEMS).filter(k => ITEMS[k].weapon && !ITEMS[k].weapon.maestro && ITEMS[k].lv <= M.lv + 3);
  const r = Math.random();
  if (r < 0.03) { const u = w.filter(k => ITEMS[k].rarity === "uncommon"); if (u.length) dropAt(p.x, p.z + 0.8, cbPick(u)); }
  else if (r < 0.11) { const c = w.filter(k => ITEMS[k].rarity === "common"); if (c.length) dropAt(p.x, p.z + 0.8, cbPick(c)); }
  checkLegends();
}
const RCOL = { common: 0xdee2e6, uncommon: 0x40c057, rare: 0x339af0, epic: 0x9775fa, legendary: 0xfab005 };
function dropAt(x, z, id, n) {
  const it = id === "coins" ? { icon: "🪙", rarity: "common" } : ITEMS[id]; if (!it) return;
  const g = new THREE.Group(), s = emojiSprite(it.icon, 0.7); s.position.y = 0.6; g.add(s);
  if (id !== "coins" && it.rarity !== "common") { const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3, 8, 1, true), new THREE.MeshBasicMaterial({ color: RCOL[it.rarity], transparent: true, opacity: 0.45, depthWrite: false })); beam.position.y = 1.5; g.add(beam); }
  g.position.set(x + (Math.random() - 0.5), 0, z + (Math.random() - 0.5)); scene.add(g);
  CB.drops.push({ g, id, n: n || 1, owner: cbOwnerId(), t: 0 });
}
function cbOwnerId() { return myId; }
function dropTick(dt, t) {
  vfxTick(dt);
  CB.drops.forEach(D => { D.t += dt; D.g.children[0].position.y = 0.6 + Math.sin(t * 3 + D.t) * 0.1;
    const mine = D.owner === cbOwnerId() || D.t > 20;   // 20 giây đầu chỉ người hạ quái nhặt được
    if (mine && !CB.ko && D.g.position.distanceTo(player.position) < 1.4) {
      if (D.id === "coins") { addCoins(D.n); popText("+" + D.n + " 🪙", D.g.position, "#e67700"); D.done = true; }
      else if (addItem(save.items, BAG_SIZE, D.id)) { const it = ITEMS[D.id]; popText(it.icon + " " + it.name, D.g.position, "#" + RCOL[it.rarity].toString(16).padStart(6, "0")); D.done = true; saveNow(); drawCombatHud(); }
      else if (!D.full) { D.full = true; flash("🎒 Bag full! / Túi đầy rồi"); }
    }
    if (D.t > 90) D.done = true;
    if (D.done) scene.remove(D.g); });
  CB.drops = CB.drops.filter(D => !D.done);
}

/* ---------- 11. BẢNG KỸ NĂNG ---------- */
function drawSkills() {
  $("skSp").textContent = spLeft() + " điểm · Lv." + (save.level || 1) + " · còn " + xpToNext() + " ⭐ lên cấp";
  let h = "<div style='font-size:12px;opacity:.8;margin-top:6px'>Bậc càng cao: chiêu mạnh hơn, đẹp hơn, và câu phải nói dài hơn (bậc 1 ≈ 3–4 từ · bậc 5 ≈ 11–12 từ). Bấm ⭐ để gắn chiêu vào ô.</div>";
  ["power", "rhythm", "control", "harmony"].forEach(br => {
    const B = BRANCH[br], list = Object.keys(SKILLS).filter(k => SKILLS[k].branch === br);
    h += "<div class='brh' style='color:" + B.color + "'>" + B.icon + " " + B.name + "</div>";
    if (!list.length) { h += "<div style='font-size:13px;opacity:.7'>Coming soon (giai đoạn B)</div>"; return; }
    list.forEach(id => { const S = SKILLS[id], r = skillRank(id), lock = (save.level || 1) < S.lv, eq = save.combat.slots.indexOf(id) >= 0;
      h += "<div class='sk'><div class='ic'>" + S.icon + "</div><div class='tx'><b>" + S.name + "</b> · bậc " + r + "/5<br>" + S.desc + "<br><span style='opacity:.7'>💧" + S.mana + " · ⏱" + S.cd + "s" + (lock ? " · 🔒 Lv." + S.lv : "") + "</span></div>" +
        (!lock && r < 5 && spLeft() > 0 ? "<button data-up='" + id + "' style='background:" + B.color + ";color:#fff'>+" + (r ? "" : " Learn") + "</button>" : "") +
        (r ? "<button data-eq='" + id + "' style='background:" + (eq ? "#ffd43b" : "#e9ecef") + "'>" + (eq ? "⭐" : "☆") + "</button>" : "") + "</div>"; });
  });
  $("skBody").innerHTML = h;
  $("skBody").querySelectorAll("[data-up]").forEach(b => b.onclick = () => { const id = b.dataset.up; if (spLeft() <= 0) return; save.combat.skills[id] = skillRank(id) + 1;
    if (save.combat.slots.indexOf(id) < 0) { const k = save.combat.slots.indexOf(null); if (k >= 0) save.combat.slots[k] = id; } saveNow(); drawSkills(); drawCombatHud(); });
  $("skBody").querySelectorAll("[data-eq]").forEach(b => b.onclick = () => { const id = b.dataset.eq, S = save.combat.slots, k = S.indexOf(id);
    if (k >= 0) S[k] = null; else { const e = S.indexOf(null); if (e >= 0) S[e] = id; else S[3] = id; } saveNow(); drawSkills(); drawCombatHud(); });
}

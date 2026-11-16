/* EnglishVerse – BẢNG KỸ NĂNG (giao diện). Dữ liệu chiêu (SKILLS, BRANCH, skillRank, spLeft, spTotal, isActive) nằm ở parts/combat/engine.js.
   Dùng bộ khung parts/ui/theme.js. Nút "Xem" chạy SÂN TẬP riêng: WebGLRenderer + scene riêng trong bảng, KHÔNG bắn hiệu ứng ra thế giới thật. */
(function () {
  const $ = id => document.getElementById(id);
  const ORDER = ["power", "control", "harmony", "rhythm"];
  const COL = { power: "var(--ev-power)", control: "var(--ev-control)", harmony: "var(--ev-harmony)", rhythm: "var(--ev-rhythm)" };
  const DESC = { power: "One huge hit on one monster", control: "Stun and slow monsters", harmony: "Heal, shield and power up", rhythm: "Hit many monsters at once" };
  const SKILL_DESC_EN = {
    echo_blast: "A sound blast hits 1 monster.", sonic_spear: "A sound spear flies straight. Very high damage.", thunder_clap: "Lightning hits 1 monster and stuns it for a moment.",
    big_voice: "Take a deep breath. One super strong hit.", piercing_note: "Pierces armor: ignores weak points, always x1.5 damage.", last_word: "Finisher: x3 damage if the monster has under 30% HP.",
    loud_clear: "Perfect hits deal +10% damage per rank.", critical_tone: "Power skills have a 5% chance per rank to crit for x2.", steady_voice: "Your shield gets 4% thicker per rank when you speak.",
    dragon_roar: "ULTIMATE: a sound dragon. Huge damage and a stun.",
    question_arrow: "Stuns a monster for 2 seconds.", riddle_trap: "Roots monsters around the target for 3 seconds.", freeze_note: "Freezes 1 monster for 3 seconds.",
    silence_bubble: "A monster cannot attack for 5 seconds.", slow_song: "Slows every monster near you by 50%.", mirror_ask: "Pulls monsters together and stuns them.",
    sharp_ears: "Control effects last 10% longer per rank.", echo_chain: "Stun jumps to 1 nearby monster (2 at rank 4).", calm_mind: "Each time you control a monster: gain 3 mana per rank.",
    silence_zone: "ULTIMATE: a silent zone. The whole group is stunned and cannot attack.",
    harmony_heal: "Heal 25% of your HP.", chord_shield: "A shield cuts damage by 50% for 6 seconds.", courage_chant: "+35% damage for 8 seconds.",
    tempo_up: "Skills recharge twice as fast for 8 seconds.", mana_song: "Gain 60 mana right now.", cleanse_note: "Removes silence and heals 15% HP.",
    kind_words: "Each Perfect heals 2% HP per rank.", team_spirit: "All skills +3% damage per rank.", warm_heart: "Max HP +6% per rank.",
    grand_chorus: "ULTIMATE: full heal, 60% shield and +50% damage for 8 seconds.",
    drum_roll: "3 quick hits that bounce to nearby monsters.", shock_wave: "A ring wave around you hits the whole group.", beat_dash: "Dash to a monster and explode on arrival.",
    echo_rain: "Sound rain falls around the target.", spin_beat: "Spin 3 times and hit every monster near you.", chain_beat: "Bounces through 5 monsters.",
    quick_tongue: "Skills recharge 4% faster per rank.", encore: "3% chance per rank: a Rhythm skill is cast again for free.", groove: "Each monster hit by Rhythm: +1 mana per rank.",
    festival_frenzy: "ULTIMATE: fireworks! 4 blasts over a wide area."
  };
  const descOf = id => SKILL_DESC_EN[id] || SKILLS[id].desc;
  const TITLE = { power: "Thunder Voice", control: "Sharp Ears", harmony: "Kind Heart", rhythm: "Beat Master" };
  const ICON = { power: "⚡", control: "🌀", harmony: "💚", rhythm: "🔥" };
  let tab = "power", pick = null, sel = null, built = false, arena = null, timers = [];
  try { const t = localStorage.getItem("ev_skTab"); if (ORDER.indexOf(t) >= 0) tab = t; } catch (e) {}

  const css = `
#skBtn{position:fixed;left:156px;top:calc(92px + env(safe-area-inset-top,0px));z-index:5;border:0;border-radius:999px;padding:6px 12px;font-weight:700;font-size:15px;background:linear-gradient(180deg,#3a4677,#1b2340);color:var(--ev-fg,#eef1fb);box-shadow:inset 0 0 0 2px var(--ev-gold,#ffc94a),0 3px 0 #7a5212,0 5px 10px rgba(0,0,0,.35)}
#skBtn:active{transform:translateY(2px)}
#skBtn .dot{position:absolute;right:-5px;top:-6px;min-width:18px;height:18px;line-height:18px;border-radius:9px;background:#e5484d;color:#fff;font:700 11px var(--ev-font);text-align:center;box-shadow:0 0 0 2px #fff}
@keyframes skBlink{0%,100%{box-shadow:0 0 0 3px #1b2340,0 0 0 5px var(--ev-gold),0 0 0 6px #7a5212,0 5px 0 6px rgba(0,0,0,.35),inset 0 -4px 6px rgba(0,0,0,.35)}50%{box-shadow:0 0 0 3px #1b2340,0 0 0 6px #fff,0 0 14px 6px var(--ev-gold),0 5px 0 6px rgba(0,0,0,.35),inset 0 -4px 6px rgba(0,0,0,.35)}}
@keyframes skRow{0%,100%{outline-color:var(--ev-gold)}50%{outline-color:#fff}}
#skOver .hint{min-height:16px;text-align:center;font-size:12px;color:var(--ev-gold);margin-top:6px}
#skOver{position:fixed;inset:0;z-index:31;display:none;align-items:center;justify-content:center;background:rgba(5,8,20,.6)}
#skOver .ev-panel{width:min(calc(100vw - 24px),440px)}
#skOver .ev-in{max-height:85vh;overflow-y:auto;overscroll-behavior:contain;padding:12px}
#skOver .hd{display:flex;justify-content:space-between;align-items:center;gap:8px}
#skOver .sub{font-size:12px;color:var(--ev-mut);margin-top:2px}
#skOver .gate{margin-top:6px;padding:6px 8px;font-size:12px;background:rgba(255,201,74,.12);border:1px solid rgba(255,201,74,.4);border-radius:6px}
#skOver .lab{font:700 11px var(--ev-font);letter-spacing:.06em;color:var(--ev-mut);margin:10px 0 6px;text-transform:uppercase}
#skOver .slots{display:flex;gap:12px;justify-content:center;padding:4px 0 2px}
#skOver .slots .ev-round{width:50px;height:50px;font-size:24px}
#skOver .slots .ev-round.empty{--c:#2c365f;color:var(--ev-mut);font-size:20px}
#skOver .slots .tgt{animation:skBlink .9s infinite}
#skOver .slots .up{transform:translateY(-5px) scale(1.12);box-shadow:0 0 0 3px #1b2340,0 0 0 6px #fff,0 0 14px 6px var(--ev-gold),0 5px 0 6px rgba(0,0,0,.35)}
#skOver .tabs{display:flex;gap:4px;margin-top:10px}
#skOver .tabs button{flex:1;border:0;padding:6px 0;font:700 11px var(--ev-font);color:var(--ev-mut);background:#1b2340;clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%);line-height:1.25}
#skOver .tabs button small{display:block;font-weight:600;font-size:10px;opacity:.85}
#skOver .tabs button.on{color:#fff;background:linear-gradient(180deg,rgba(255,255,255,.28),rgba(0,0,0,.15)),var(--c)}
#skOver .bd{font-size:12px;margin:6px 0 8px;color:var(--ev-fg)}
#skOver .skr{display:flex;gap:10px;position:relative;padding-bottom:12px}
#skOver .skr::before{content:"";position:absolute;left:25px;width:3px;top:0;bottom:0;background:#3a4677}
#skOver .skr.first::before{top:26px}#skOver .skr.last::before{display:none}#skOver .skr.lit::before{background:var(--c)}
#skOver .hex{position:relative;z-index:1;flex:none;width:52px;height:52px;background:var(--c);clip-path:polygon(50% 0,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%);display:grid;place-items:center}
#skOver .hex i{width:46px;height:46px;clip-path:inherit;display:grid;place-items:center;font-style:normal;font-size:24px;background:linear-gradient(180deg,rgba(255,255,255,.3),rgba(0,0,0,.25)),var(--c)}
#skOver .skr.nx .hex{background:var(--ev-gold)}#skOver .skr.nx .hex i{background:#1b2340}
#skOver .skr.far .hex{background:#3a4677}#skOver .skr.far .hex i{background:#141a2e;filter:grayscale(1);opacity:.45}
#skOver .skc{flex:1;min-width:0;font-size:12px;padding:2px 0}
#skOver .skc b{font-size:13px}
#skOver .skc .dots{letter-spacing:2px;color:var(--c);font-size:12px;margin-left:4px}
#skOver .skc .m{color:var(--ev-mut);margin-top:2px}
#skOver .skc .acts{display:flex;gap:8px;margin-top:6px;flex-wrap:wrap}
#skOver .skc .acts .ev-btn{font-size:12px;padding:5px 12px}
#skOver .skr.nx .skc b{color:var(--ev-gold)}
#skOver .skr.sel .skc{outline:2px solid var(--ev-gold);outline-offset:2px;border-radius:4px;animation:skRow .9s infinite}
#skOver .skr.far .skc b{color:var(--ev-mut);letter-spacing:.2em}
#skOver .ult{color:var(--ev-gold);font:700 12px var(--ev-font);letter-spacing:.08em}
#skOver .note{font-size:11px;color:var(--ev-mut);margin-top:6px;line-height:1.4}
#skOver .arena{display:none;margin-top:10px;position:relative;border:2px solid var(--ev-line);background:#0c1226}
#skOver .arena canvas{display:block;width:100%;height:150px}
#skOver .arena .tg{position:absolute;left:6px;top:4px;font:700 10px var(--ev-font);color:var(--ev-mut);letter-spacing:.06em}
#skOver .arena .nm{position:absolute;left:0;right:0;bottom:4px;text-align:center;font:700 12px var(--ev-font);color:#fff;text-shadow:0 1px 3px #000}
#skOver .arena button{position:absolute;right:4px;top:4px;border:0;border-radius:50%;width:22px;height:22px;background:#2c365f;color:#fff;font-size:11px}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  function build() {
    if (built) return; built = true;
    const b = document.createElement("button"); b.id = "skBtn"; b.title = "Skills"; document.body.appendChild(b);
    const o = document.createElement("div"); o.id = "skOver";
    o.innerHTML = `<div class="ev-panel"><div class="ev-in"><div id="skTop"></div>
<div class="arena" id="skArena"><canvas></canvas><span class="tg">TRAINING GROUND · only you can see this</span><span class="nm" id="skArNm"></span><button id="skArX">✕</button></div>
<div id="skBody"></div></div></div>`;
    document.body.appendChild(o);
    b.onclick = openSkills;
    o.addEventListener("click", e => {
      if (e.target === o) return closeSkills();
      const t = e.target.closest("[data-a]"); if (t) return act(t.dataset.a, t.dataset.id, e);
    });
    $("skArX").onclick = closeArena;
    refreshBtn(); setInterval(refreshBtn, 1000);
  }
  function refreshBtn() {
    const b = $("skBtn"); if (!b || typeof spLeft !== "function") return;
    let n = 0; try { n = spLeft(); } catch (e) {}
    const h = "🌟" + (n > 0 ? "<span class='dot'>" + n + "</span>" : "");
    if (b._h !== h) { b._h = h; b.innerHTML = h; }
  }
  function openSkills() { render(); $("skOver").style.display = "flex"; }
  function closeSkills() { closeArena(); $("skOver").style.display = "none"; pick = null; sel = null; refreshBtn(); }

  function act(a, id, e) {
    e.stopPropagation();
    const S = SKILLS[id], sl = save.combat.slots;
    if (a === "up" || a === "learn") {
      if (spLeft() <= 0 || (save.level || 1) < S.lv || skillRank(id) >= 5) return;
      save.combat.skills[id] = skillRank(id) + 1;
      if (isActive(id) && sl.indexOf(id) < 0) { const k = sl.indexOf(null); if (k >= 0) sl[k] = id; }
      saveNow(); drawCombatHud(); render(); refreshBtn();
    } else if (a === "pv") preview(id);
    else if (a === "use") { if (sel != null) place(id, sel); else { pick = pick === id ? null : id; render(); } }
    else if (a === "slot") {
      const k = +id;
      if (pick) place(pick, k);
      else { sel = sel === k ? null : k; render(); }   // chỉ làm ô nổi lên, KHÔNG gỡ chiêu
    }
  }
  function place(id, k) {   // gắn chiêu vào ô k; chiêu đang ở ô khác thì đổi chỗ 2 ô; không có thao tác nào làm ô trống
    const sl = save.combat.slots, cur = sl[k], j = sl.indexOf(id);
    if (j >= 0 && j !== k) sl[j] = cur || null;
    sl[k] = id; pick = null; sel = null;
    saveNow(); drawCombatHud(); render();
  }

  function nodeHtml(id, state, first, last) {
    const S = SKILLS[id], r = skillRank(id), pas = S.type === "passive", L = save.level || 1, c = COL[S.branch];
    const can = L >= S.lv && spLeft() > 0;
    let card = "";
    const sl = save.combat.slots, meta = pas ? "" : "💧" + S.mana + " · ⏱" + S.cd + "s";
    if (state === "far") {
      card = (S.type === "ult" ? "<b class='ult'>ULTIMATE</b>" : "<b>? ? ? ? ?</b>") + "<div class='m'>🔒 Unlocks at Lv." + S.lv + "</div>";
    } else if (state === "nx") {
      card = "<b>" + S.name + "</b>" + (S.type === "ult" ? " <span class='ult'>★ ULTIMATE</span>" : "") + (pas ? " <span class='ev-tag' style='--c:#3a4677'>passive</span>" : "") +
        "<div>" + descOf(id) + "</div><div class='m'>" + meta + "</div><div class='acts'>" +
        (L >= S.lv ? (spLeft() > 0 ? "<button class='ev-btn ok' data-a='learn' data-id='" + id + "'>Learn</button>" : "<span class='m'>Needs 1 skill point</span>") : "<span class='m'>🔒 Unlocks at Lv." + S.lv + "</span>") +
        (pas ? "" : "<button class='ev-btn alt' data-a='pv' data-id='" + id + "'>👁️ Preview</button>") + "</div>";
    } else {
      card = "<b>" + S.name + "</b>" + (S.type === "ult" ? " <span class='ult'>★</span>" : "") + (pas ? " <span class='ev-tag' style='--c:#3a4677'>passive</span>" : "") +
        "<span class='dots'>" + "◆".repeat(r) + "◇".repeat(5 - r) + "</span><div>" + descOf(id) + "</div>" + (meta ? "<div class='m'>" + meta + "</div>" : "") + "<div class='acts'>" +
        (r < 5 && can ? "<button class='ev-btn' data-a='up' data-id='" + id + "'>＋ Upgrade</button>" : "") +
        (pas ? "" : (sl.indexOf(id) >= 0 ? "<button class='ev-btn ok' data-a='use' data-id='" + id + "'>In slot ✓</button>" : "<button class='ev-btn ok' data-a='use' data-id='" + id + "'>Use ▸</button>")) +
        (pas ? "" : "<button class='ev-btn alt' data-a='pv' data-id='" + id + "'>👁️ Preview</button>") + "</div>";
    }
    const learned = state === "ln";
    return "<div class='skr " + state + (learned ? " lit" : "") + (first ? " first" : "") + (last ? " last" : "") + (pick === id ? " sel" : "") + "' data-id='" + id + "' style='--c:" + c + "'>" +
      "<div class='hex'><i>" + S.icon + "</i></div><div class='skc'>" + card + "</div></div>";
  }
  function pathHtml(list) {
    let nxt = true;
    return list.map((id, i) => {
      let state;
      if (skillRank(id) > 0) state = "ln"; else if (nxt) { state = "nx"; nxt = false; } else state = "far";
      return nodeHtml(id, state, i === 0, i === list.length - 1);
    }).join("");
  }

  function render() {
    if (!built || typeof SKILLS === "undefined") return;
    const L = save.level || 1, sl = save.combat.slots;
    let gate = ""; try { if (typeof levelGateText === "function") gate = levelGateText() || ""; } catch (e) {}
    let top = "<div class='hd'><span class='ev-title'>🌟 Skills</span><button class='ev-btn alt' style='padding:4px 12px' id='skX'>✕</button></div>" +
      "<div class='sub'><b style='color:var(--ev-gold)'>" + spLeft() + "</b> points left · +1 point per level (+1 more every 10 levels)</div>" +
      (gate ? "<div class='gate' " + (typeof openLevelPanel === "function" ? "id='skGate' style='cursor:pointer'" : "") + ">" + gate + "</div>" : "") +
      "<div class='lab'>In use</div><div class='slots'>";
    for (let k = 0; k < 4; k++) {
      const id = sl[k], S = id && SKILLS[id];
      top += "<button class='ev-round" + (S ? "" : " empty") + (pick ? " tgt" : "") + (sel === k ? " up" : "") + "' data-a='slot' data-id='" + k + "'" + (S ? " style='--c:" + COL[S.branch] + "'" : "") + ">" + (S ? S.icon : "＋") + "</button>";
    }
    top += "</div><div class='hint'>" + (pick ? "Tap a slot to put " + SKILLS[pick].icon + " " + SKILLS[pick].name + " there" : sel != null ? "Pick a skill below to put here" : "") + "</div>";
    $("skTop").innerHTML = top;
    $("skX").onclick = closeSkills;
    if ($("skGate")) $("skGate").onclick = () => { closeSkills(); openLevelPanel(); };
    const pts = {}, all = Object.keys(SKILLS);
    ORDER.forEach(br => pts[br] = all.filter(k => SKILLS[k].branch === br).reduce((a, k) => a + skillRank(k), 0));
    const byLv = (a, b) => SKILLS[a].lv - SKILLS[b].lv;
    const act_ = all.filter(k => SKILLS[k].branch === tab && SKILLS[k].type !== "passive").sort(byLv);
    const pas = all.filter(k => SKILLS[k].branch === tab && SKILLS[k].type === "passive").sort(byLv);
    let h = "<div class='tabs'>" + ORDER.map(br => "<button data-tab='" + br + "' class='" + (br === tab ? "on" : "") + "' style='--c:" + COL[br] + "'>" + ICON[br] + " " + BRANCH[br].name + "<small>" + pts[br] + " pts</small></button>").join("") + "</div>" +
      "<div class='bd' style='color:" + COL[tab] + "'><b>" + DESC[tab] + "</b>" + (pts[tab] >= 10 ? " · 🏅 " + TITLE[tab] : "") + "</div>" +
      pathHtml(act_) + (pas.length ? "<div class='lab'>Passive</div>" + pathHtml(pas) : "") +
      "<div class='note'>Higher rank = stronger skill. The look changes at rank 3 and 5. You must say longer sentences (rank 1 is about 3-4 words ... rank 5 is about 11-12 words).</div>";
    const body = $("skBody"), sc = $("skOver").querySelector(".ev-in").scrollTop;
    body.innerHTML = h;
    body.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => { tab = b.dataset.tab; try { localStorage.setItem("ev_skTab", tab); } catch (e) {} render(); });
    $("skOver").querySelector(".ev-in").scrollTop = sc;
  }

  /* ---------- SÂN TẬP ---------- */
  function mkEmoji(txt, size) {
    const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d"); x.font = "100px sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(txt, 64, 70);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true })); sp.scale.set(size, size, 1); return sp;
  }
  /* Sân tập dựng GIỐNG vùng hoang dã: người chơi ở gốc (0,0,0) quay mặt về -z, camera nhìn từ sau-trên (độ nghiêng 0,96 rad, cách 11 m, FOV 55 như camera thật),
     hình nộm đứng như quái (cách ~7 m). Hiệu ứng gọi đúng như castSkill trong engine.js: cùng SKILL_VFX.play, cùng from/to/radius/rank/perfect theo kind. */
  const AR_H = 250, DUMMY_N = 6;
  function mkEmoji(txt, size) {
    const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d"); x.font = "100px sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(txt, 64, 70);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true })); sp.scale.set(size, size, 1); return sp;
  }
  function openArena() {
    if (arena) return arena;
    const box = $("skArena"); box.style.display = "block";
    const cv = box.querySelector("canvas"), w = Math.max(200, box.clientWidth - 4);
    let rd; try { rd = new THREE.WebGLRenderer({ canvas: cv, antialias: true }); } catch (e) { box.style.display = "none"; return null; }
    rd.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); rd.setSize(w, AR_H, false);
    const sc = new THREE.Scene(); sc.background = new THREE.Color(0x0c1226);
    const cam = new THREE.PerspectiveCamera(55, w / AR_H, 0.1, 80);
    sc.add(new THREE.AmbientLight(0xffffff, 0.8)); const dl = new THREE.DirectionalLight(0xffffff, 0.7); dl.position.set(3, 8, 5); sc.add(dl);
    const fl = new THREE.Mesh(new THREE.CircleGeometry(16, 48), new THREE.MeshLambertMaterial({ color: 0x1f2a52 })); fl.rotation.x = -Math.PI / 2; sc.add(fl);
    const ring = new THREE.Mesh(new THREE.RingGeometry(15.6, 16, 48), new THREE.MeshBasicMaterial({ color: 0xc9842a, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.01; sc.add(ring);
    const me = new THREE.Group();   // nhân vật chibi đơn giản
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 0.9, 12), new THREE.MeshLambertMaterial({ color: 0x3b82f6 })); body.position.y = 0.55;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 12), new THREE.MeshLambertMaterial({ color: 0xffd9b3 })); head.position.y = 1.4;
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.44, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0x3a2a1a })); hair.position.y = 1.45;
    me.add(body, head, hair); sc.add(me);
    const dummies = [];   // hình nộm 🎯 đóng vai quái
    for (let i = 0; i < DUMMY_N; i++) {
      const du = new THREE.Group(), post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 1.3, 8), new THREE.MeshLambertMaterial({ color: 0x8a5a2a })); post.position.y = 0.65;
      const tg = mkEmoji("🎯", 1.5); tg.position.y = 1.55; du.add(post, tg); du.visible = false; sc.add(du); dummies.push(du);
    }
    arena = { rd, sc, cam, me, dummies, raf: 0, D: 11 };
    setCam(11);
    const loop = () => { if (!arena) return; arena.raf = requestAnimationFrame(loop); rd.render(sc, cam); };
    loop();
    return arena;
  }
  function setCam(D) {   // y như camera vùng hoang dã: sau lưng, nhìn xuống 0,96 rad
    const A = arena, pitch = 0.96, ch = Math.cos(pitch) * D;
    A.cam.position.set(0, 1 + Math.sin(pitch) * D, ch); A.cam.lookAt(0, 1, -3.5); A.D = D;
  }
  function closeArena() {
    timers.forEach(clearTimeout); timers = [];
    if (!arena) return;
    cancelAnimationFrame(arena.raf);
    try { arena.sc.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } }); arena.rd.dispose(); if (arena.rd.forceContextLoss) arena.rd.forceContextLoss(); } catch (e) {}
    arena = null; $("skArena").style.display = "none";
  }
  function layout(S) {   // vị trí hình nộm tuỳ kiểu chiêu (như quái đứng quanh)
    const r = S.radius || 4, main = [0, -7];
    if (S.kind === "single") return [main];
    if (S.kind === "multi") { const n = Math.min(S.hits || 3, 5); return [main, [-2.6, -8.6], [2.6, -9.2], [-3.4, -5.4], [3.4, -6]].slice(0, n); }
    if (S.kind === "zone") return [main, [-r * 0.5, -7 - r * 0.3], [r * 0.55, -7 + r * 0.2], [r * 0.2, -7 - r * 0.6]];
    if (S.kind === "dash") return [[0, -8], [-r * 0.5, -8.6], [r * 0.5, -7.4]];
    if (S.kind === "aoe") { const n = 5, rr = Math.min(r * 0.6, 5.5), a = []; for (let i = 0; i < n; i++) { const t = i / n * Math.PI * 2 + 0.5; a.push([Math.sin(t) * rr, -Math.cos(t) * rr]); } return a; }
    return [];   // self: không cần quái
  }
  function preview(id) {
    const S = SKILLS[id]; if (!S || typeof SKILL_VFX === "undefined") return;
    timers.forEach(clearTimeout); timers = [];
    const A = openArena(); if (!A) return;
    $("skArena").scrollIntoView({ block: "nearest", behavior: "smooth" });
    const V = (x, z) => new THREE.Vector3(x, 0, z), at = (fn, ms) => timers.push(setTimeout(() => { if (arena) fn(); }, ms));
    const run = (rank, delay) => at(() => {
      const lay = layout(S), P = A.me.position.set(0, 0, 0);
      A.dummies.forEach((d, i) => { d.visible = i < lay.length; if (lay[i]) d.position.set(lay[i][0], 0, lay[i][1]); });
      const tgt = lay.length ? V(lay[0][0], lay[0][1]) : null, rk = S.type === "ult" ? 5 : rank;
      setCam(S.radius >= 8 ? 14 : 11);   // chiêu vùng rất rộng: lùi camera để thấy hết (ngoài trận camera cũng đổi theo cỡ vùng nhìn)
      if (tgt) A.me.rotation.y = Math.atan2(tgt.x - P.x, tgt.z - P.z); else A.me.rotation.y = Math.PI;
      $("skArNm").textContent = S.icon + " " + S.name + " · rank " + rk;
      const look = (to, radius) => SKILL_VFX.play(id, { rank: rk, from: P.clone(), to: to ? to.clone() : null, radius, perfect: true, scene: A.sc });
      if (S.kind === "single" && tgt) look(tgt);
      else if (S.kind === "multi" && tgt) lay.forEach((p, h) => { if (h < (S.hits || 1)) at(() => look(V(p[0], p[1]), 0.8), h * 220); });
      else if (S.kind === "aoe") look(null, S.radius);
      else if (S.kind === "zone" && tgt) look(tgt, S.radius);
      else if (S.kind === "dash" && tgt) { const d = Math.hypot(tgt.x, tgt.z), step = Math.max(0, d - 1.2); P.set(tgt.x / d * step, 0, tgt.z / d * step); look(tgt, S.radius); }
      else if (S.kind === "self") look(null, 2);
    }, delay);
    const r = Math.max(1, skillRank(id));
    run(r, 150); if (r < 5 && S.type !== "ult") run(5, 2400);
  }

  function init() { build(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();

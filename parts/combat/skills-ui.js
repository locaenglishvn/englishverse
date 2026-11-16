/* EnglishVerse – BẢNG KỸ NĂNG (giao diện). Dữ liệu chiêu (SKILLS, BRANCH, skillRank, spLeft, spTotal, isActive) nằm ở parts/combat/engine.js.
   Dùng bộ khung parts/ui/theme.js. Nút "Xem" chạy SÂN TẬP riêng: WebGLRenderer + scene riêng trong bảng, KHÔNG bắn hiệu ứng ra thế giới thật. */
(function () {
  const $ = id => document.getElementById(id);
  const ORDER = ["power", "control", "harmony", "rhythm"];
  const COL = { power: "var(--ev-power)", control: "var(--ev-control)", harmony: "var(--ev-harmony)", rhythm: "var(--ev-rhythm)" };
  const DESC = { power: "Một đòn rất mạnh vào 1 quái", control: "Khống chế, làm choáng", harmony: "Hồi máu, khiên, tăng sức", rhythm: "Đánh nhiều quái cùng lúc" };
  const TITLE = { power: "Thunder Voice", control: "Sharp Ears", harmony: "Kind Heart", rhythm: "Beat Master" };
  const ICON = { power: "⚡", control: "🌀", harmony: "💚", rhythm: "🔥" };
  let tab = "power", pick = null, built = false, arena = null, timers = [];
  try { const t = localStorage.getItem("ev_skTab"); if (ORDER.indexOf(t) >= 0) tab = t; } catch (e) {}

  const css = `
#skBtn{position:fixed;left:12px;top:calc(196px + env(safe-area-inset-top,0px));z-index:5;padding:6px 12px;font-size:13px}
#skBtn .dot{display:inline-block;min-width:18px;height:18px;line-height:18px;border-radius:9px;background:#e5484d;color:#fff;font:700 11px var(--ev-font);text-align:center;box-shadow:0 0 0 2px #fff}
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
#skOver .slots .tgt{outline:2px dashed var(--ev-gold);outline-offset:6px}
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
#skOver .skr.sel .skc{outline:2px solid var(--ev-gold);outline-offset:2px;border-radius:4px}
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
    const b = document.createElement("button"); b.id = "skBtn"; b.className = "ev-btn"; document.body.appendChild(b);
    const o = document.createElement("div"); o.id = "skOver";
    o.innerHTML = `<div class="ev-panel"><div class="ev-in"><div id="skTop"></div>
<div class="arena" id="skArena"><canvas></canvas><span class="tg">SÂN TẬP · chỉ mình bạn thấy</span><span class="nm" id="skArNm"></span><button id="skArX">✕</button></div>
<div id="skBody"></div></div></div>`;
    document.body.appendChild(o);
    b.onclick = openSkills;
    o.addEventListener("click", e => {
      if (e.target === o) return closeSkills();
      const t = e.target.closest("[data-a]"); if (t) return act(t.dataset.a, t.dataset.id, e);
      const r = e.target.closest(".skr.pk"); if (r) { pick = pick === r.dataset.id ? null : r.dataset.id; render(); }
    });
    $("skArX").onclick = closeArena;
    refreshBtn(); setInterval(refreshBtn, 1000);
  }
  function refreshBtn() {
    const b = $("skBtn"); if (!b || typeof spLeft !== "function") return;
    let n = 0; try { n = spLeft(); } catch (e) {}
    const h = "🌟 Kỹ năng" + (n > 0 ? " <span class='dot'>" + n + "</span>" : "");
    if (b._h !== h) { b._h = h; b.innerHTML = h; }
  }
  function openSkills() { render(); $("skOver").style.display = "flex"; }
  function closeSkills() { closeArena(); $("skOver").style.display = "none"; pick = null; refreshBtn(); }

  function act(a, id, e) {
    e.stopPropagation();
    const S = SKILLS[id], sl = save.combat.slots;
    if (a === "up" || a === "learn") {
      if (spLeft() <= 0 || (save.level || 1) < S.lv || skillRank(id) >= 5) return;
      save.combat.skills[id] = skillRank(id) + 1;
      if (isActive(id) && sl.indexOf(id) < 0) { const k = sl.indexOf(null); if (k >= 0) sl[k] = id; }
      saveNow(); drawCombatHud(); render(); refreshBtn();
    } else if (a === "pv") preview(id);
    else if (a === "slot") {
      const k = +id, cur = sl[k];
      if (pick) { const j = sl.indexOf(pick); if (j >= 0) sl[j] = cur || null; sl[k] = pick; pick = null; }
      else if (cur) sl[k] = null;
      else return;
      saveNow(); drawCombatHud(); render();
    }
  }

  function nodeHtml(id, state, first, last) {
    const S = SKILLS[id], r = skillRank(id), pas = S.type === "passive", L = save.level || 1, c = COL[S.branch];
    const can = L >= S.lv && spLeft() > 0;
    let card = "";
    const meta = pas ? "" : "💧" + S.mana + " · ⏱" + S.cd + "s";
    if (state === "far") {
      card = (S.type === "ult" ? "<b class='ult'>TUYỆT CHIÊU</b>" : "<b>? ? ? ? ?</b>") + "<div class='m'>🔒 Mở ở Lv." + S.lv + "</div>";
    } else if (state === "nx") {
      card = "<b>" + S.name + "</b>" + (S.type === "ult" ? " <span class='ult'>★ TUYỆT CHIÊU</span>" : "") + (pas ? " <span class='ev-tag' style='--c:#3a4677'>nội tại</span>" : "") +
        "<div>" + S.desc + "</div><div class='m'>" + meta + "</div><div class='acts'>" +
        (L >= S.lv ? (spLeft() > 0 ? "<button class='ev-btn ok' data-a='learn' data-id='" + id + "'>Học</button>" : "<span class='m'>Cần 1 điểm kỹ năng</span>") : "<span class='m'>🔒 Mở ở Lv." + S.lv + "</span>") +
        (pas ? "" : "<button class='ev-btn alt' data-a='pv' data-id='" + id + "'>👁️ Xem</button>") + "</div>";
    } else {
      card = "<b>" + S.name + "</b>" + (S.type === "ult" ? " <span class='ult'>★</span>" : "") + (pas ? " <span class='ev-tag' style='--c:#3a4677'>nội tại</span>" : "") +
        "<span class='dots'>" + "◆".repeat(r) + "◇".repeat(5 - r) + "</span><div>" + S.desc + "</div>" + (meta ? "<div class='m'>" + meta + "</div>" : "") + "<div class='acts'>" +
        (r < 5 && can ? "<button class='ev-btn' data-a='up' data-id='" + id + "'>＋ Nâng bậc</button>" : "") +
        (pas ? "" : "<button class='ev-btn alt' data-a='pv' data-id='" + id + "'>👁️ Xem</button>") + "</div>";
    }
    const learned = state === "ln";
    return "<div class='skr " + state + (learned ? " lit" : "") + (first ? " first" : "") + (last ? " last" : "") + (learned && !pas ? " pk" : "") + (pick === id ? " sel" : "") + "' data-id='" + id + "' style='--c:" + c + "'>" +
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
    let top = "<div class='hd'><span class='ev-title'>🌟 Kỹ năng</span><button class='ev-btn alt' style='padding:4px 12px' id='skX'>✕</button></div>" +
      "<div class='sub'>Còn <b style='color:var(--ev-gold)'>" + spLeft() + "</b> điểm · +1 điểm mỗi cấp (+1 mỗi 10 cấp)" + "</div>" +
      (gate ? "<div class='gate' " + (typeof openLevelPanel === "function" ? "id='skGate' style='cursor:pointer'" : "") + ">" + gate + "</div>" : "") +
      "<div class='lab'>Đang dùng" + (pick ? " · chạm ô để gắn " + SKILLS[pick].icon : " · chạm một chiêu đã học rồi chạm ô để gắn") + "</div><div class='slots'>";
    for (let k = 0; k < 4; k++) {
      const id = sl[k], S = id && SKILLS[id];
      top += "<button class='ev-round" + (S ? "" : " empty") + (pick ? " tgt" : "") + "' data-a='slot' data-id='" + k + "'" + (S ? " style='--c:" + COL[S.branch] + "'" : "") + ">" + (S ? S.icon : "＋") + "</button>";
    }
    top += "</div>";
    $("skTop").innerHTML = top;
    $("skX").onclick = closeSkills;
    if ($("skGate")) $("skGate").onclick = () => { closeSkills(); openLevelPanel(); };
    const pts = {}, all = Object.keys(SKILLS);
    ORDER.forEach(br => pts[br] = all.filter(k => SKILLS[k].branch === br).reduce((a, k) => a + skillRank(k), 0));
    const byLv = (a, b) => SKILLS[a].lv - SKILLS[b].lv;
    const act_ = all.filter(k => SKILLS[k].branch === tab && SKILLS[k].type !== "passive").sort(byLv);
    const pas = all.filter(k => SKILLS[k].branch === tab && SKILLS[k].type === "passive").sort(byLv);
    let h = "<div class='tabs'>" + ORDER.map(br => "<button data-tab='" + br + "' class='" + (br === tab ? "on" : "") + "' style='--c:" + COL[br] + "'>" + ICON[br] + " " + BRANCH[br].name + "<small>" + pts[br] + " điểm</small></button>").join("") + "</div>" +
      "<div class='bd' style='color:" + COL[tab] + "'><b>" + DESC[tab] + "</b>" + (pts[tab] >= 10 ? " · 🏅 " + TITLE[tab] : "") + "</div>" +
      pathHtml(act_) + (pas.length ? "<div class='lab'>Nội tại</div>" + pathHtml(pas) : "") +
      "<div class='note'>Bậc càng cao chiêu càng mạnh, đổi hình ở bậc 3 và 5; câu phải nói dài hơn (bậc 1 ≈ 3–4 từ … bậc 5 ≈ 11–12 từ).</div>";
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
  function openArena() {
    if (arena) return arena;
    const box = $("skArena"); box.style.display = "block";
    const cv = box.querySelector("canvas"), w = Math.max(200, box.clientWidth - 4);
    let rd; try { rd = new THREE.WebGLRenderer({ canvas: cv, antialias: true }); } catch (e) { box.style.display = "none"; return null; }
    rd.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); rd.setSize(w, 150, false);
    const sc = new THREE.Scene(); sc.background = new THREE.Color(0x0c1226);
    const cam = new THREE.PerspectiveCamera(40, w / 150, 0.1, 60); cam.position.set(0, 2.3, 8); cam.lookAt(0, 1, 0);
    sc.add(new THREE.AmbientLight(0xffffff, 0.8)); const dl = new THREE.DirectionalLight(0xffffff, 0.7); dl.position.set(3, 6, 5); sc.add(dl);
    const fl = new THREE.Mesh(new THREE.CircleGeometry(7, 40), new THREE.MeshLambertMaterial({ color: 0x1f2a52 })); fl.rotation.x = -Math.PI / 2; sc.add(fl);
    const ring = new THREE.Mesh(new THREE.RingGeometry(6.6, 7, 40), new THREE.MeshBasicMaterial({ color: 0xc9842a, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.01; sc.add(ring);
    // nhân vật chibi đơn giản (màu giống người chơi)
    const me = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 0.9, 12), new THREE.MeshLambertMaterial({ color: 0x3b82f6 })); body.position.y = 0.55;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 12), new THREE.MeshLambertMaterial({ color: 0xffd9b3 })); head.position.y = 1.4;
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.44, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0x3a2a1a })); hair.position.y = 1.45;
    me.add(body, head, hair); me.position.set(-2.4, 0, 0); sc.add(me);
    // hình nộm 🎯
    const du = new THREE.Group();
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 1.3, 8), new THREE.MeshLambertMaterial({ color: 0x8a5a2a })); post.position.y = 0.65;
    const tg = mkEmoji("🎯", 1.5); tg.position.y = 1.55; du.add(post, tg); du.position.set(2.4, 0, 0); sc.add(du);
    arena = { rd, sc, cam, me, du, on: true, raf: 0 };
    const loop = () => { if (!arena) return; arena.raf = requestAnimationFrame(loop); rd.render(sc, cam); };
    loop();
    return arena;
  }
  function closeArena() {
    timers.forEach(clearTimeout); timers = [];
    if (!arena) return;
    cancelAnimationFrame(arena.raf);
    try { arena.sc.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material && !o.userData.fxItem) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } }); arena.rd.dispose(); if (arena.rd.forceContextLoss) arena.rd.forceContextLoss(); } catch (e) {}
    arena = null; $("skArena").style.display = "none";
  }
  function preview(id) {
    const S = SKILLS[id]; if (!S || typeof SKILL_VFX === "undefined") return;
    timers.forEach(clearTimeout); timers = [];
    const A = openArena(); if (!A) return;
    $("skArena").scrollIntoView({ block: "nearest", behavior: "smooth" });
    const from = A.me.position.clone(), to = A.du.position.clone();
    const show = (rank, delay) => timers.push(setTimeout(() => { if (!arena) return;
      $("skArNm").textContent = S.icon + " " + S.name + " · bậc " + rank;
      SKILL_VFX.play(id, { rank, from, to: S.kind === "self" || S.kind === "aoe" ? null : to, radius: S.radius, perfect: true, scene: A.sc }); }, delay));
    const r = Math.max(1, skillRank(id));
    show(r, 150); if (r < 5) show(5, 2200);
  }

  function init() { build(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();

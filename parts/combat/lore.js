/* EnglishVerse – BẢNG KỂ CHUYỆN (27/11, chủ dự án yêu cầu)
   1. LORE.learn(id): học được chiêu mới → bảng có chân dung danh nhân, nhiệm vụ đã hoàn thành, chiêu học được, chiêu này từ kiến thức nào mà ra.
      Tạm thời (chưa có chuỗi nhiệm vụ danh nhân trong game): chiêu danh nhân tự mở khi người chơi đạt cấp của danh nhân đó (LORE.checkLearn).
   2. Gặp loại quái mới lần đầu: trận đấu tạm dừng (quái đứng im, không ai đánh được ai), hiện truyện về con quái + 1 câu hỏi đọc hiểu (đúng: +20 xu).
      Dữ liệu lưu: save.combat.learned (chiêu đã học), save.combat.seenMon (quái đã đọc truyện).
   Dùng khung giao diện parts/ui/theme.js (.ev-panel, .ev-btn). */
const LORE = (function () {
  const $ = id => document.getElementById(id);
  const css = `
#loreOver{position:fixed;inset:0;z-index:35;display:none;align-items:center;justify-content:center;background:rgba(5,8,20,.72);padding:max(12px,env(safe-area-inset-top,0px)) 12px max(12px,env(safe-area-inset-bottom,0px))}
#loreOver .ev-panel{width:min(100%,430px)}
#loreOver .ev-in{max-height:86vh;overflow-y:auto;padding:14px;color:var(--ev-fg)}
#loreOver .kick{font:700 11px var(--ev-font);letter-spacing:.12em;text-transform:uppercase;color:var(--ev-gold)}
#loreOver h2{margin:2px 0 8px;font:800 22px var(--ev-font);line-height:1.15}
#loreOver .row{display:flex;gap:12px;align-items:flex-start}
#loreOver .pic{flex:none;width:96px;height:120px;border-radius:10px;overflow:hidden;background:#1b2340;display:grid;place-items:center;font-size:44px;border:2px solid var(--ev-gold)}
#loreOver .pic img{width:100%;height:100%;object-fit:cover;object-position:center 30%}
#loreOver .sk{margin:10px 0;padding:10px 12px;border-radius:10px;background:linear-gradient(135deg,rgba(255,201,74,.18),rgba(255,201,74,.04));border:1px solid rgba(255,201,74,.5)}
#loreOver .sk b{font:800 18px var(--ev-font);color:var(--ev-gold)}
#loreOver .sk .ic{font-size:30px;margin-right:8px;vertical-align:middle}
#loreOver p{margin:6px 0;font-size:14px;line-height:1.5}
#loreOver .m{color:var(--ev-mut);font-size:12.5px}
#loreOver .en{font-size:15px;line-height:1.55}
#loreOver .vi{color:var(--ev-mut);font-size:12.5px;font-style:italic}
#loreOver .q{margin-top:10px;padding:10px;border-radius:10px;background:#141a2e;border:1px solid #2c365f}
#loreOver .ch{display:flex;flex-direction:column;gap:6px;margin-top:8px}
#loreOver .ch button{text-align:left;font:600 14px var(--ev-font);color:var(--ev-fg);background:#1b2340;border:2px solid #2c365f;border-radius:10px;padding:8px 10px}
#loreOver .ch button.ok{border-color:#2f9e44;background:#173a24}#loreOver .ch button.no{border-color:#e5484d;background:#3a1b1f}
#loreOver .acts{display:flex;gap:8px;justify-content:flex-end;margin-top:12px;flex-wrap:wrap}
#loreOver .glow{animation:loreGlow 1.6s ease-in-out infinite}
@keyframes loreGlow{0%,100%{box-shadow:0 0 0 0 rgba(255,201,74,.0)}50%{box-shadow:0 0 18px 4px rgba(255,201,74,.55)}}
@media (prefers-reduced-motion:reduce){#loreOver .glow{animation:none}}`;
  let built = false, queue = [], open = false, onClose = null;
  function build() {
    if (built) return; built = true;
    const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    const o = document.createElement("div"); o.id = "loreOver"; o.innerHTML = `<div class="ev-panel"><div class="ev-in" id="loreIn"></div></div>`; document.body.appendChild(o);
  }
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const SLUG = { "Anh em nhà Wright": "wilbur-wright", "Karl & Bertha Benz": "karl-benz", "Nicéphore Niépce": "nicephore-niepce" };
  const slug = n => SLUG[n] || n.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  function show(html, after) {
    build(); $("loreIn").innerHTML = html; $("loreOver").style.display = "flex"; open = true; onClose = after || null;
    try { talking = true; } catch (e) {}
  }
  function close() {
    $("loreOver").style.display = "none"; open = false; try { talking = false; } catch (e) {}
    const f = onClose; onClose = null; if (f) f(); next();
  }
  function next() { if (open || !queue.length) return; const job = queue.shift(); job(); }

  /* ---------- 1. HỌC ĐƯỢC CHIÊU MỚI ---------- */
  function learn(id, quiet) {
    const S = SKILLS[id], C = save.combat; if (!S || C.learned[id]) return;
    C.learned[id] = true; C.skills[id] = Math.max(1, C.skills[id] || 0);
    const k = C.slots.indexOf(null); if (k >= 0 && S.type !== "passive") C.slots[k] = id;
    try { saveNow(); drawCombatHud(); } catch (e) {}
    if (quiet) return;
    queue.push(() => {
      const src = S.src || {}, god = !!S.rift, img = god ? "" : "assets/concept/scholars/" + slug(src.who || "") + ".webp", BR = BRANCH[S.branch] || {};
      show(`<div class="kick">${god ? "✨ Thần ban phép" : "📗 Nhiệm vụ kiến thức hoàn thành"}</div>
        <div class="row"><div class="pic glow">${img ? `<img src="${img}" alt="${esc(src.who)}" onerror="this.replaceWith(document.createTextNode('🧑‍🔬'))">` : S.icon}</div>
        <div><h2>${esc(src.who)}</h2><p>Bạn đã hoàn thành nhiệm vụ <b>${esc(src.q)}</b>.</p><p class="m">You finished the quest. Now you know a new skill!</p></div></div>
        <div class="sk"><span class="ic">${S.icon}</span><b>${esc(S.name)}</b> <span class="m">· ${BR.icon || ""} ${esc(BR.name || "")} · Lv.${S.lv}</span>
        <p class="en">${esc(S.en || "")}</p></div>
        ${S.seed ? `<p><b>Chiêu này từ đâu ra?</b> ${esc(S.seed)} Linh hồn ${esc(src.who)} gửi lại tri thức ấy, giọng nói tiếng Anh của bạn biến nó thành phép.</p>` : ""}
        <p class="m">✨ ${esc(S.fx || "")}</p>
        <p class="m">Nâng bậc bằng điểm kỹ năng: chiêu đổi hình ở bậc 4, 7 và 10.</p>
        <div class="acts"><button class="ev-btn alt" id="loreSk">🌟 Skills</button><button class="ev-btn ok" id="loreOk">OK!</button></div>`);
      $("loreOk").onclick = close; $("loreSk").onclick = () => { close(); try { document.getElementById("skBtn").click(); } catch (e) {} };
    });
    next();
  }
  function checkLearn() {   // TẠM: chưa có nhiệm vụ danh nhân → mở chiêu danh nhân khi đạt cấp của danh nhân
    try { const L = save.level || 1, C = save.combat; if (!C) return; C.learned = C.learned || {};
      const ids = Object.keys(SKILLS).filter(id => { const S = SKILLS[id]; return !S.start && S.type !== "passive" && !S.rift && !C.learned[id] && L >= S.lv; }).sort((a, b) => SKILLS[a].lv - SKILLS[b].lv);
      const many = ids.length > 3;   // người chơi cũ lên cấp cao: không hiện cả chục bảng, chỉ hiện 2 chiêu mới nhất
      ids.forEach((id, i) => learn(id, many && i < ids.length - 2)); } catch (e) {}
  }

  /* ---------- 2. GẶP QUÁI MỚI ---------- */
  const MON_STORY = {
    "To He": { pic: "assets/concept/to-he.webp", en: "To he are toy figures made of colored rice dough: a rooster, a dragon, a little buffalo. The Mute melted the dough. Now it is a slow slime snail. On its back there are toys nobody finished.", vi: "Tò he là tượng bột nặn đủ màu. The Mute làm bột chảy nhão thành con sên bò lê, trên lưng còn những hình nặn dở dang.", fear: "Nó là những câu nói bị trộn lộn xộn, sai trật tự từ.", q: "What is the To He monster made of?", a: ["Rice dough", "Stone", "Ice"], ok: 0 },
    "Tacke Gecko": { pic: "assets/concept/tacke-gecko.webp", en: "A gecko can only say its own name: \"Tac-ke! Tac-ke!\" The Mute locked that sound in a loop. It made the gecko into a clay bird that says one sound again and again.", vi: "Tắc kè chỉ biết gọi tên mình. The Mute khoá tiếng kêu thành vòng lặp, nặn nó thành con chim gốm kêu mãi một âm.", fear: "Nó là nỗi sợ thử câu mới, chỉ dám nói đi nói lại một câu quen.", q: "What does the Tacke Gecko say?", a: ["Many new words", "One sound again and again", "Nothing at all"], ok: 1 },
    "Echo Ghost": { en: "Echo Ghost lives in empty halls. It can only copy the last word you say. It is a voice that never had its own words.", vi: "Hồn Vọng sống ở hành lang trống, chỉ nhại lại chữ cuối bạn nói.", fear: "Nói lại thật rõ cả câu (REPEAT) làm nó yếu đi.", q: "What can Echo Ghost do?", a: ["Copy your last word", "Fly to the Moon", "Sing a long song"], ok: 0 },
    "Riddle Bug": { en: "Riddle Bug carries a question on its back. It runs away when nobody answers. Answer it with a full sentence and it cannot hide.", vi: "Bọ Đố cõng một câu hỏi trên lưng, bỏ chạy khi không ai trả lời.", fear: "Trả lời bằng câu đầy đủ (ANSWER).", q: "How can you beat Riddle Bug?", a: ["Run away", "Answer its question", "Stay quiet"], ok: 1 },
    "Scramble Worm": { en: "Scramble Worm eats sentences and spits out the words in the wrong order. \"Apple I an eat.\" Put the words back in order and it falls apart.", vi: "Giun Trộn ăn câu rồi nhả chữ ra sai thứ tự.", fear: "Xếp lại câu cho đúng (BUILD).", q: "What does Scramble Worm do to words?", a: ["Puts them in the wrong order", "Paints them red", "Makes them bigger"], ok: 0 },
    "Question Crab": { en: "Question Crab holds two claws: \"Who?\" and \"Where?\". It snaps at anyone who stays silent. A clear answer makes it open its claws.", vi: "Cua Hỏi có hai càng \"Who?\" và \"Where?\", kẹp ai im lặng.", fear: "Trả lời rõ ràng (ANSWER).", q: "What are the names of its claws?", a: ["Red and Blue", "Who and Where", "Big and Small"], ok: 1 },
    "Blank Bat": { en: "Blank Bat steals the names of things. After it flies by, you forget the word for \"cup\" or \"chair\". Say the name out loud and the word comes back.", vi: "Dơi Trống trộm tên đồ vật; nói to tên đồ vật thì chữ quay lại.", fear: "Gọi đúng tên đồ vật (NAME).", q: "What does Blank Bat steal?", a: ["Food", "Shoes", "The names of things"], ok: 2 },
    "Tense Turtle": { en: "Tense Turtle is stuck in yesterday. It mixes \"go\" and \"went\" and walks very slowly. Build the sentence in the right time and it moves again.", vi: "Rùa Thì kẹt ở hôm qua, lẫn lộn \"go\" và \"went\".", fear: "Xếp câu đúng thì (BUILD).", q: "Which words does Tense Turtle mix up?", a: ["go and went", "cat and dog", "up and down"], ok: 0 },
    "Shy Slime": { en: "Shy Slime wants to talk but is too shy to ask. It hides behind rocks. Ask it a kind question and it smiles.", vi: "Nhớt Nhút Nhát muốn nói mà ngại hỏi, trốn sau đá.", fear: "Đặt câu hỏi (ASK).", q: "Why does Shy Slime hide?", a: ["It is hungry", "It is too shy to ask", "It is sleeping"], ok: 1 },
    "Mimic Parrot": { en: "Mimic Parrot repeats sounds very fast, but the words come out wrong. Say the sentence slowly and clearly and it gets confused.", vi: "Vẹt Nhại lặp âm rất nhanh nhưng sai chữ.", fear: "Nói lại chậm và rõ (REPEAT).", q: "How should you speak to beat Mimic Parrot?", a: ["Very fast", "Slowly and clearly", "Only in Vietnamese"], ok: 1 },
    "Story Owl": { en: "Story Owl keeps old stories in its feathers. The Mute made it forget the endings. Answer its questions and the stories come back.", vi: "Cú Kể Chuyện giữ truyện cổ trong lông; The Mute làm nó quên đoạn kết.", fear: "Trả lời câu hỏi (ANSWER).", q: "What did Story Owl forget?", a: ["The endings of stories", "Its home", "How to fly"], ok: 0 }
  };
  function meetCheck() {   // gọi mỗi khung từ updateCombat: quái loại mới trong 13 m → dừng trận, kể chuyện
    if (open || typeof CB === "undefined" || !CB.on || !save.combat) return false;
    const seen = save.combat.seenMon = save.combat.seenMon || {};
    const M = CB.mons.find(m => !m.dead && !m.remote && m.T && MON_STORY[m.T.name] && !seen[m.T.name] && m.g.position.distanceTo(player.position) < 13);
    if (!M) return false;
    const nm = M.T.name, D = MON_STORY[nm]; seen[nm] = 1; try { saveSoon(); } catch (e) {}
    try { endCast(true); } catch (e) {}
    show(`<div class="kick">👁️ Quái mới · New monster</div>
      <div class="row"><div class="pic">${D.pic ? `<img src="${D.pic}" alt="${esc(nm)}">` : (M.T.icon || "👾")}</div><div><h2>${esc(nm)}</h2><p class="m">Lv.${M.lv} · Trận đấu tạm dừng để bạn đọc.</p></div></div>
      <p class="en">${esc(D.en)}</p><p class="vi">${esc(D.vi)}</p><p><b>Điểm yếu:</b> ${esc(D.fear)}</p>
      <div class="q"><b>📖 ${esc(D.q)}</b><div class="ch">${D.a.map((t, i) => `<button data-i="${i}">${esc(t)}</button>`).join("")}</div><p class="m" id="loreFb"></p></div>
      <div class="acts"><button class="ev-btn ok" id="loreGo" style="display:none">⚔️ Fight!</button></div>`);
    let done = false;
    $("loreIn").querySelectorAll(".ch button").forEach(b => b.onclick = () => { if (done) return; done = true; const i = +b.dataset.i, ok = i === D.ok;
      b.classList.add(ok ? "ok" : "no"); if (!ok) $("loreIn").querySelector('.ch button[data-i="' + D.ok + '"]').classList.add("ok");
      $("loreFb").textContent = ok ? "✅ Correct! +20 🪙" : "Đáp án đúng đã được tô xanh. Đọc lại câu chuyện nhé!";
      if (ok) try { addCoins(20); } catch (e) {}
      $("loreGo").style.display = "inline-block"; });
    $("loreGo").onclick = close;
    return true;
  }
  return { learn, checkLearn, meetCheck, isOpen: () => open, MON_STORY };
})();

/* EnglishVerse – 📻 BỘ ĐÀM ĐỘI (chủ dự án chốt 18/11). Miễn phí: chỉ dùng micro + nhận dạng giọng của trình duyệt và kênh Supabase có sẵn.
   - Chỉ dùng khi đang trong đội (TEAM.mates, parts/social/team.js). GIỮ nút 📻 để nói (tối đa 10 giây), thả tay là gửi.
   - Mỗi lúc 1 người nói (giữ sóng như bộ đàm): người khác bấm khi đang bận thì XẾP HÀNG, tới lượt tự bắt đầu thu.
   - KIỂM DUYỆT trước khi gửi (trên máy người nói): phải là TIẾNG ANH (≥ 60% từ là từ tiếng Anh có trong game / từ thông dụng,
     máy nhận dạng đủ chắc), KHÔNG từ tục (BAD trong index.html), KHÔNG dãy số (số điện thoại). Không đạt → không gửi gì,
     đồng đội nghe "beep" + thấy "📻 ***", người nói thấy "English only, please".
   - Đạt → gửi GIỌNG THẬT (đoạn ghi âm ~24 kbps) + phụ đề chữ. Máy không thu âm song song được (thường gặp trên iPhone)
     → TỰ ĐỘNG chuyển BỘ ĐÀM CHỮ: chỉ gửi câu chữ đã kiểm duyệt, máy bên kia đọc to.
   - LƯU GHI ÂM: mỗi máy giữ 20 đoạn gần nhất (gửi + nhận) trong bộ nhớ. Nút ⚠️ Report trên từng tin → gửi đoạn ghi âm + chữ
     + tên người nói lên bảng `reports` (Supabase, cài bằng docs/setup/reports.sql) để người lớn xem. Không tự tải lên khi không có báo cáo.
   Dùng: chan, online, myId, myName, others, TEAM, SR, BAD, cleanChat, speak, flash, popText, player, SUPABASE_URL, SUPABASE_KEY, safeWords, VOICE_DECK, LESSONS. */
const RADIO = { floor: null, queue: false, rec: null, log: [], textOnly: false, holding: false, maxSec: 10 };
try { RADIO.textOnly = localStorage.getItem("ev_radio_text") === "1"; } catch (e) {}
let RADIO_WORDS = null;
function radioWords() {   // từ tiếng Anh "hợp lệ": mọi từ xuất hiện trong nội dung game + từ thông dụng
  if (RADIO_WORDS) return RADIO_WORDS;
  const W = new Set(typeof safeWords === "function" ? safeWords() : []);
  const add = s => String(s || "").toLowerCase().replace(/[’']/g, " ").replace(/[^a-z ]/g, " ").split(/\s+/).forEach(w => w.length && W.add(w));
  ("i you he she it we they me him her us them my your his its our their this that these those a an the is am are was were be been do does did have has had " +
   "can could will would shall should may might must not no yes ok okay oh hey hi hello bye please thanks thank sorry what where when who why how which " +
   "and or but so if then now here there up down in on at to from with for of off out over under near left right go come get give take make let s t m re ll ve d " +
   "one two three four five six seven eight nine ten all some any more most very too also just only again stop wait look see hear say tell ask help need want like " +
   "use cast heal shield stun hit attack run hide follow back front behind boss monster low hp mana quick fast slow ready done nice good great well job team mate").split(" ").forEach(w => W.add(w));
  try { LESSONS.forEach(L => L.steps.forEach(s => { add(s.say); (s.choices || []).forEach(c => add(c.t)); if (s.card) add(s.card.ex); })); } catch (e) {}
  try { Object.values(VOICE_DECK).flat().forEach(x => { add(x.q); add(x.full); add(x.say); }); } catch (e) {}
  try { Object.values(VOCAB).flat().forEach(v => { add(v.say); add(v.ex); }); } catch (e) {}
  return RADIO_WORDS = W;
}
function radioCheck(text, conf) {   // → { ok, why }
  const t = String(text || "").trim(); if (!t) return { ok: false, why: "silent" };
  if (/\d{3,}/.test(t.replace(/\s/g, ""))) return { ok: false, why: "numbers" };
  BAD.lastIndex = 0; if (BAD.test(t)) { BAD.lastIndex = 0; return { ok: false, why: "bad" }; }
  const toks = t.toLowerCase().replace(/[’']/g, " ").replace(/[^a-z ]/g, " ").split(/\s+/).filter(Boolean), W = radioWords();
  if (!toks.length) return { ok: false, why: "notEnglish" };
  const known = toks.filter(w => W.has(w) || (w.length > 3 && W.has(w.replace(/(s|es|ed|ing)$/, "")))).length / toks.length;
  if (known < 0.6) return { ok: false, why: "notEnglish" };
  if (conf && conf < 0.45) return { ok: false, why: "unsure" };
  return { ok: true };
}

/* ---------- giao diện ---------- */
function radioUi() {
  if (document.getElementById("radioBtn")) return;
  const css = document.createElement("style"); css.textContent = `
#radioBtn{position:fixed;left:30px;bottom:calc(166px + env(safe-area-inset-bottom,0px));width:62px;height:62px;font-size:26px;z-index:6;display:none;touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
#radioBtn.rec{box-shadow:0 0 0 4px #ff4f5e,0 0 18px #ff4f5e}#radioBtn.busy{filter:grayscale(.7) brightness(.8)}
#radioBtn small{position:absolute;bottom:-18px;left:-14px;font:700 10px var(--ev-font);color:#fff;text-shadow:0 1px 2px #000;white-space:nowrap}
#radioLog{position:fixed;left:12px;bottom:calc(250px + env(safe-area-inset-bottom,0px));width:min(260px,70vw);z-index:6;display:flex;flex-direction:column;gap:4px;pointer-events:none}
#radioLog .m{pointer-events:auto;background:rgba(11,16,36,.82);color:#fff;font:600 12.5px system-ui;padding:5px 9px;border-left:3px solid var(--ev-gold);clip-path:polygon(0 0,100% 0,calc(100% - 6px) 100%,0 100%);transition:opacity .4s}
#radioLog .m b{color:var(--ev-gold)}#radioLog .m.blk{border-color:var(--ev-bad);color:var(--ev-mut)}#radioLog .m button{border:0;background:none;color:var(--ev-mut);font-size:11px;padding:0 0 0 6px}`;
  document.head.appendChild(css);
  const b = document.createElement("button"); b.id = "radioBtn"; b.className = "ev-round"; b.style.setProperty("--c", "#2b8a3e"); b.innerHTML = "📻<small>Team Talk</small>";
  const lg = document.createElement("div"); lg.id = "radioLog";
  document.body.appendChild(b); document.body.appendChild(lg);
  b.addEventListener("pointerdown", e => { e.preventDefault(); e.stopPropagation(); try { b.setPointerCapture(e.pointerId); } catch (x) {} RADIO.holding = true; radioTry(); });
  ["pointerup", "pointercancel"].forEach(ev => b.addEventListener(ev, e => { e.stopPropagation(); RADIO.holding = false; if (RADIO.queue) { RADIO.queue = false; radioLabel(); } if (RADIO.rec) radioStop(); }));
  b.addEventListener("contextmenu", e => e.preventDefault());
  setInterval(radioTick, 400);
}
function radioLabel(t) { const s = document.querySelector("#radioBtn small"); if (s) s.textContent = t || (RADIO.textOnly ? "Team Talk (text)" : "Team Talk"); }
function radioTick() {
  const b = document.getElementById("radioBtn"); if (!b) return;
  const inTeam = typeof TEAM !== "undefined" && TEAM.mates.size > 0 && online;
  b.style.display = inTeam ? "block" : "none";
  if (RADIO.floor && performance.now() - RADIO.floor.at > (RADIO.maxSec + 3) * 1000) RADIO.floor = null;   // người kia mất mạng giữa chừng
  const busy = RADIO.floor && RADIO.floor.id !== myId;
  b.classList.toggle("busy", !!busy);
  if (busy && !RADIO.rec) radioLabel((RADIO.queue ? "⏳ next · " : "📻 ") + (RADIO.floor.name || nameOf(RADIO.floor.id)) + " is talking…");
  else if (!RADIO.rec) radioLabel();
  if (!busy && RADIO.queue && RADIO.holding) { RADIO.queue = false; radioTry(); }   // tới lượt mình (đang giữ nút)
}
function radioAddLog(o) {   // o: { from, name, text, blocked, audio(Blob)|null, at }
  RADIO.log.unshift(o); RADIO.log = RADIO.log.slice(0, 20);   // giữ 20 đoạn gần nhất trên máy (để báo cáo)
  const lg = document.getElementById("radioLog"); if (!lg) return;
  const d = document.createElement("div"); d.className = "m" + (o.blocked ? " blk" : "");
  d.innerHTML = "<b>📻 " + String(o.name).slice(0, 12) + ":</b> " + (o.blocked ? "*** (beep)" : String(o.text).replace(/</g, "")) + (o.from !== myId ? "<button title='Report'>⚠️ Report</button>" : "");
  const rb = d.querySelector("button"); if (rb) rb.onclick = e => { e.stopPropagation(); radioReport(o, rb); };
  lg.prepend(d); while (lg.children.length > 4) lg.lastChild.remove();
  setTimeout(() => { d.style.opacity = 0; setTimeout(() => d.remove(), 450); }, 15000);
}

/* ---------- thu + kiểm duyệt + gửi ---------- */
function radioSend(ev, payload) { try { chan.send({ type: "broadcast", event: ev, payload: Object.assign({ id: myId, to: Array.from(TEAM.mates) }, payload) }); } catch (e) {} }
async function radioTry() {
  if (RADIO.rec || !online || !TEAM.mates.size) return;
  if (RADIO.floor && RADIO.floor.id !== myId) { RADIO.queue = true; radioLabel("⏳ next · " + (RADIO.floor.name || nameOf(RADIO.floor.id)) + " is talking…"); return; }
  if (!SR) { flash("🎤 Team Talk needs Chrome or Safari"); return; }
  if (typeof CB !== "undefined" && CB.cast && CB.cast.rec) return;   // đang nói chiêu
  try { if (speechSynthesis.speaking) speechSynthesis.cancel(); } catch (e) {}
  const R = RADIO.rec = { alts: [], conf: 0, chunks: [], stream: null, mr: null, sr: null, start: performance.now(), done: 0, peak: -1 };
  try { const A = window.AudioContext || window.webkitAudioContext; R.ac = new A(); R.ac.resume(); } catch (e) { R.ac = null; }   // tạo ngay trong lúc bấm (trình duyệt mới cho chạy)
  RADIO.floor = { id: myId, at: performance.now() }; radioSend("rfloor", { on: 1, name: myName });
  document.getElementById("radioBtn").classList.add("rec"); radioLabel("🔴 Talking… let go to send"); window.EV_AUDIO_BUSY = true;
  // 1) nhận dạng giọng (để kiểm duyệt + phụ đề)
  const r = R.sr = new SR(); r.lang = "en-US"; r.interimResults = true; r.continuous = true; r.maxAlternatives = 1;
  r.onresult = ev => { let t = "", c = 0, n = 0; for (const x of ev.results) { t += x[0].transcript; if (x.isFinal && x[0].confidence) { c += x[0].confidence; n++; } } R.alts = [t.trim()]; if (n) R.conf = c / n; radioLabel("🔴 " + t.trim().slice(-26)); };
  r.onerror = () => {}; r.onend = () => { R.srEnded = true; radioMaybeFinish(R); };
  try { r.start(); } catch (e) { R.srEnded = true; }
  // 2) thu giọng thật (nếu máy cho thu song song)
  if (!RADIO.textOnly && window.MediaRecorder && navigator.mediaDevices) {
    try {
      if (!(RADIO.stream && RADIO.stream.getTracks().some(t => t.readyState === "live"))) RADIO.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      R.stream = RADIO.stream; clearTimeout(RADIO.streamOff);   // micro giữ sẵn 30 giây sau lần nói gần nhất (lần sau không mất đầu câu)
      const mime = ["audio/webm;codecs=opus", "audio/mp4", "audio/webm"].find(m => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) || "";
      R.mr = new MediaRecorder(R.stream, mime ? { mimeType: mime, audioBitsPerSecond: 24000 } : { audioBitsPerSecond: 24000 });
      R.mr.ondataavailable = e => e.data && e.data.size && R.chunks.push(e.data);
      R.mr.onstop = () => { R.mrEnded = true; clearTimeout(RADIO.streamOff); RADIO.streamOff = setTimeout(() => { if (RADIO.stream && !RADIO.rec) { RADIO.stream.getTracks().forEach(t => t.stop()); RADIO.stream = null; } }, 30000); radioMaybeFinish(R); };
      R.mr.start(); R.mrAt = performance.now();
      try {   // đo âm lượng: điện thoại nào nhường micro cho nhận dạng giọng thì file ghi âm toàn im lặng → chuyển bộ đàm chữ
        const ac = R.ac, an = ac.createAnalyser(), buf = new Float32Array(512); an.fftSize = 512;
        ac.createMediaStreamSource(R.stream).connect(an);
        R.meter = setInterval(() => { if (ac.state !== "running") return; an.getFloatTimeDomainData(buf); let m = 0; for (const v of buf) m = Math.max(m, Math.abs(v)); R.peak = Math.max(R.peak, m); }, 80);   // peak = -1: không đo được → không kết luận
      } catch (e) { R.peak = -1; }
    } catch (e) { R.mr = null; R.mrEnded = true; }
  } else R.mrEnded = true;
  if (!RADIO.holding) radioStop();   // thả tay khi đang xin micro
  R.timer = setTimeout(() => radioStop(), RADIO.maxSec * 1000);
}
function radioStop() {
  const R = RADIO.rec; if (!R || R.stopping) return; R.stopping = true; R.stopAt = performance.now(); clearTimeout(R.timer);
  try { R.sr && R.sr.stop(); } catch (e) {} try { if (R.mr && R.mr.state !== "inactive") R.mr.stop(); else R.mrEnded = true; } catch (e) { R.mrEnded = true; }
  setTimeout(() => { R.srEnded = R.mrEnded = true; radioMaybeFinish(R); }, 2500);   // máy không báo kết thúc → vẫn xử lý
  radioLabel("…");
}
function radioMaybeFinish(R) {
  if (R.done || !R.stopping || !R.srEnded || !R.mrEnded) return; R.done = 1;
  clearInterval(R.meter); try { R.ac && R.ac.close(); } catch (e) {}
  RADIO.rec = null; window.EV_AUDIO_BUSY = false; const b = document.getElementById("radioBtn"); if (b) b.classList.remove("rec");
  RADIO.floor = null; radioSend("rfloor", { on: 0 }); radioLabel();
  const text = R.alts[0] || "", dur = (performance.now() - R.start) / 1000;
  if (!text) { if (dur > 1) flash("📻 I didn't hear you. Try again!"); return; }
  const chk = radioCheck(text, R.conf);
  if (!chk.ok) {   // không gửi giọng; đồng đội chỉ nghe beep
    radioSend("radio", { name: myName, blocked: 1 }); radioAddLog({ from: myId, name: myName, text, blocked: true, audio: null, at: Date.now() });
    flash(chk.why === "bad" ? "📻 That word is not OK. Please be kind! 🙂" : chk.why === "numbers" ? "📻 Don't share numbers here. Stay safe!" : "📻 English only, please 🙂<div style='font-size:13px;font-weight:400'>Chỉ gửi được khi nói tiếng Anh rõ ràng.</div>");
    return;
  }
  const clean = cleanChat(text) || text.slice(0, 60);
  const blob = R.chunks.length ? new Blob(R.chunks, { type: R.chunks[0].type || "audio/webm" }) : null;
  const ranMs = R.mrAt ? (R.stopAt || performance.now()) - R.mrAt : 0;
  if (!RADIO.textOnly && R.mr && ranMs > 1200 && (!blob || blob.size < 600 || (R.peak >= 0 && R.peak < 0.005))) {   // thu đủ lâu mà vẫn không có tiếng → máy này không thu song song được → bộ đàm chữ (lần sau)
    RADIO.textOnly = true; try { localStorage.setItem("ev_radio_text", "1"); } catch (e) {} radioLabel();
  }
  const sendAudio = !RADIO.textOnly && blob && blob.size >= 600 && blob.size < 180000;
  const fin = b64 => { radioSend("radio", { name: myName, text: clean, a: b64 || null, mime: blob ? blob.type : null });
    radioAddLog({ from: myId, name: myName, text: clean, blocked: false, audio: sendAudio ? blob : null, at: Date.now() });
    popText("📻", player.position, "#2b8a3e"); if (typeof addHeart === "function") addHeart(1); if (typeof spokeOk === "function") spokeOk(); };
  if (sendAudio) { const fr = new FileReader(); fr.onload = () => fin(String(fr.result).split(",")[1]); fr.readAsDataURL(blob); } else fin(null);
}

/* ---------- nhận ---------- */
function radioWire(ch) {
  ch.on("broadcast", { event: "rfloor" }, ({ payload: m }) => {
    if (!m.to || m.to.indexOf(myId) < 0 || !TEAM.mates.has(m.id)) return;
    if (m.on) RADIO.floor = { id: m.id, name: String(m.name || "").slice(0, 12), at: performance.now() }; else if (RADIO.floor && RADIO.floor.id === m.id) RADIO.floor = null;
  });
  ch.on("broadcast", { event: "radio" }, ({ payload: m }) => {
    if (!m.to || m.to.indexOf(myId) < 0 || !TEAM.mates.has(m.id)) return;
    const name = String(m.name || nameOf(m.id)).slice(0, 12);
    if (m.blocked) { radioBeep(); radioAddLog({ from: m.id, name, text: "", blocked: true, audio: null, at: Date.now() }); return; }
    const text = cleanChat(m.text || "").slice(0, 60); let blob = null;
    if (m.a) { try { const bin = atob(m.a), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); blob = new Blob([u], { type: m.mime || "audio/webm" }); } catch (e) { blob = null; } }
    radioAddLog({ from: m.id, name, text, blocked: false, audio: blob, at: Date.now() });
    const o = others[m.id]; if (o && typeof popText === "function") popText("📻 " + text.slice(0, 24), o.g.position, "#2b8a3e");
    radioPlay(blob, text);
  });
}
function radioPlay(blob, text) {
  window.EV_AUDIO_BUSY = true; const done = () => { window.EV_AUDIO_BUSY = false; };
  if (blob) { const a = new Audio(URL.createObjectURL(blob)); a.volume = 1; a.onended = a.onerror = done; a.play().catch(() => { speak(text); done(); }); }
  else { speak(text); setTimeout(done, 400 + text.length * 70); }   // bộ đàm chữ: máy đọc to
}
function radioBeep() {
  try { const A = window.AudioContext || window.webkitAudioContext, c = radioBeep.c = radioBeep.c || new A(), o = c.createOscillator(), g = c.createGain();
    o.frequency.value = 1000; g.gain.value = 0.08; o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 0.35); } catch (e) {}
}

/* ---------- báo cáo ---------- */
function radioReport(o, btn) {
  btn.disabled = true; btn.textContent = "…";
  const send = b64 => fetch(SUPABASE_URL + "/rest/v1/reports", { method: "POST", headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ reporter: myId, reporter_name: myName, reported: o.from, reported_name: o.name, text: o.text || "", blocked: !!o.blocked, audio_b64: b64 || null, audio_mime: o.audio ? o.audio.type : null, said_at: new Date(o.at).toISOString() }) })
    .then(r => { btn.textContent = r.ok ? "✅ Sent" : "⚠️ Failed"; flash(r.ok ? "📻 Thank you! An adult will check it." : "📻 Report failed. Please tell your teacher."); })
    .catch(() => { btn.textContent = "⚠️ Failed"; });
  if (o.audio) { const fr = new FileReader(); fr.onload = () => send(String(fr.result).split(",")[1]); fr.readAsDataURL(o.audio); } else send(null);
}
addEventListener("load", () => setTimeout(radioUi, 1200));

/* EnglishVerse – NHẠC NỀN (chủ dự án 17/11): nhạc tự sinh bằng Web Audio (không file nhạc, không bản quyền, ~0 KB tải thêm).
   - Rất nhỏ (game cần nghe bài nói và nói vào micro). Tự HẠ GẦN TẮT khi máy đang đọc câu hoặc micro đang thu
     (để nhận dạng giọng nói không nghe lẫn nhạc).
   - 2 tâm trạng: thành phố (ấm, vui nhẹ: C – Am – F – G) · vùng hoang dã (phiêu lưu, êm: Am – F – C – G, tiếng sáo).
   - Nút 🎵 bật/tắt (nhớ lựa chọn trong localStorage ev_music). Trình duyệt chỉ cho phát âm thanh sau lần chạm đầu tiên.
   Muốn đổi sang nhạc thật (file mp3 CC0) sau này: thay phần "sinh nốt" bằng <audio>, giữ nguyên phần hạ âm lượng (duck). */
(function () {
  const VOL = 0.055, DUCK = 0.08;   // âm lượng chung · tỉ lệ còn lại khi đang đọc / thu micro
  let ctx = null, master = null, wet = null, on = true, mood = "city", nextT = 0, step = 0, timer = null;
  try { on = localStorage.getItem("ev_music") !== "off"; } catch (e) {}
  const N = n => 440 * Math.pow(2, (n - 69) / 12);   // số MIDI → tần số
  const MOODS = {
    city: { bpm: 76, chords: [[48, 55, 60, 64], [45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59]], scale: [72, 74, 76, 79, 81, 84], lead: "triangle", leadP: 0.45 },
    wild: { bpm: 64, chords: [[45, 52, 57, 60], [41, 48, 53, 57], [48, 55, 60, 64], [43, 50, 55, 59]], scale: [69, 72, 74, 76, 79, 81], lead: "sine", leadP: 0.35 }
  };
  function init() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
    ctx = new AC(); master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    const d = ctx.createDelay(1); d.delayTime.value = 0.38; const fb = ctx.createGain(); fb.gain.value = 0.32; const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1800;
    wet = ctx.createGain(); wet.gain.value = 0.35; wet.connect(d); d.connect(lp); lp.connect(fb); fb.connect(d); lp.connect(master);
    return true;
  }
  function tone(freq, t, dur, type, vol, attack, toWet) {
    const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = type; o.frequency.value = freq; f.type = "lowpass"; f.frequency.value = type === "sine" ? 2400 : 1400;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(f); f.connect(g); g.connect(master); if (toWet) g.connect(wet);
    if (type === "sine" && mood === "wild") { const v = ctx.createOscillator(), vg = ctx.createGain(); v.frequency.value = 5; vg.gain.value = freq * 0.006; v.connect(vg); vg.connect(o.frequency); v.start(t); v.stop(t + dur + 0.05); }
    o.start(t); o.stop(t + dur + 0.05);
  }
  function schedule() {   // lên lịch trước ~0,6 giây, mỗi phách 1 lần
    if (!ctx || !on) return;
    const M = MOODS[mood], beat = 60 / M.bpm;
    while (nextT < ctx.currentTime + 0.6) {
      const bar = Math.floor(step / 4) % M.chords.length, b = step % 4, ch = M.chords[bar];
      if (b === 0) { ch.forEach((n, i) => tone(N(n), nextT, beat * 4.2, i ? "triangle" : "sine", i ? 0.05 : 0.08, 0.6, false)); }   // pad hợp âm
      if (Math.random() < M.leadP) tone(N(M.scale[Math.floor(Math.random() * M.scale.length)]), nextT + (Math.random() < 0.3 ? beat / 2 : 0), beat * 1.6, M.lead, 0.07, 0.02, true);   // giai điệu thưa
      nextT += beat; step++;
    }
  }
  function busy() {   // đang đọc câu hoặc đang thu micro → hạ nhạc
    try { if (speechSynthesis.speaking) return true; } catch (e) {}
    if (typeof CB !== "undefined" && CB.cast && CB.cast.rec) return true;
    return !!document.querySelector(".rec");
  }
  function tick() {
    if (!ctx) return;
    const m = typeof CB !== "undefined" && CB.on ? "wild" : "city"; if (m !== mood) { mood = m; step = 0; }
    const want = on && !document.hidden ? VOL * (busy() ? DUCK : 1) : 0;
    master.gain.setTargetAtTime(want, ctx.currentTime, busy() ? 0.05 : 0.6);
    if (on && !document.hidden) schedule();
  }
  function start() {
    if (!init()) return; if (ctx.state === "suspended") ctx.resume();
    if (!timer) { nextT = ctx.currentTime + 0.1; timer = setInterval(tick, 150); }
  }
  ["pointerdown", "keydown", "touchstart"].forEach(ev => addEventListener(ev, function first() { if (on) start(); removeEventListener(ev, first, true); }, true));
  window.setMusic = v => { on = v; try { localStorage.setItem("ev_music", v ? "on" : "off"); } catch (e) {} if (v) start(); const b = document.getElementById("musicBtn"); if (b) b.textContent = v ? "🎵" : "🔇"; };
  addEventListener("load", () => setTimeout(() => {   // nút 🎵 ngay bên phải nút 🌟 Skills (cùng hàng với 🎒), cùng kiểu dáng
    const ref = document.getElementById("skBtn") || document.getElementById("bagBtn"); if (!ref) return;
    const b = document.createElement("button"), cs = getComputedStyle(ref), r = ref.getBoundingClientRect();
    b.id = "musicBtn"; b.textContent = on ? "🎵" : "🔇"; b.title = "Music";
    ["background", "border", "borderRadius", "boxShadow", "color", "fontSize", "padding", "width", "height"].forEach(k => b.style[k] = cs[k]);
    b.style.position = "fixed"; b.style.zIndex = cs.zIndex || 5; b.style.top = cs.top; b.style.left = (r.right + 10) + "px"; b.style.minWidth = r.width + "px"; b.style.height = r.height + "px";
    b.onclick = e => { e.stopPropagation(); window.setMusic(!on); };
    document.body.appendChild(b);
  }, 1500));
})();

/* EnglishVerse – CHAT AN TOÀN cho trẻ em (chủ dự án chốt 13/11, docs/design/voice-combat.html mục 8).
   Mặc định: người chơi chỉ nói được câu có sẵn (QUICK) hoặc KHUNG CÂU có chỗ trống, chỗ trống phải là từ có trong game
   (từ vựng, đồ vật, tên nơi, tên quái, màu, con vật…). Không cho dãy số (số điện thoại), không tên thật lạ.
   Phụ huynh có thể mở "nói tự do" (vẫn lọc từ xấu) bằng khoá phép tính – lưu trên máy này.
   Mỗi câu nói với người khác được cộng vào chỉ số 💛 Heart (save.heart) – giao tiếp xã hội. */
const SAFE_TEMPLATES = [
  /^(hi|hello|hey)( there)?( \w+)?$/, /^(good (morning|afternoon|evening|job|luck)|nice to meet you|see you( later| soon)?|bye( bye)?|goodbye)( \w+)?$/,
  /^(thank you|thanks)( (very much|so much|a lot))?( \w+)?$/, /^(yes|no|ok|okay|sure|sorry|wow|cool|great|me too|of course)( please| thanks)?$/,
  /^how are you( today)?$/, /^i am (fine|good|great|ok|happy|tired|hungry|ready|lost|here)( thanks| thank you)?$/,
  /^(let s|lets) (team up|go|play|fight|be friends|go to (the )?(.+))$/, /^(do you want to|can you|will you) (join my team|help me|play with me|come with me|follow me)$/,
  /^(can you help me|help me|help)( please)?$/, /^(watch out|be careful|run|follow me|wait for me|come here|over here|ready go|ready|go go go)$/,
  /^where is (the |a |my )?(.+)$/, /^i need (a |an |some |the )?(.+?)( please)?$/, /^i have (a |an |some |the )?(.+)$/,
  /^(this is|these are) for you$/, /^i like (your |the |my )?(.+)$/, /^what is your favou?rite (.+)$/, /^my favou?rite (.+) is (.+)$/,
  /^can i (swap|trade) my (.+) for your (.+)$/, /^(can i have|would you like) (a |an |some |the |your )?(.+?)( please)?$/,
  /^(it is|it s|its) (next to|near|behind|in front of|at|in|on) (the )?(.+)$/, /^(go straight|turn left|turn right)( and (go straight|turn left|turn right))?$/,
  /^(a|the) (.+) is (here|there|over there|behind you|near you)$/
];
let SAFE_WORDS = null;
function safeWords() {   // mọi từ "có trong game" được phép điền vào chỗ trống
  if (SAFE_WORDS) return SAFE_WORDS;
  const W = new Set(("a an the my your some this that it here there me you we us team friend friends monster monsters boss food water help please park city zone gate home map bag coins coin " +
    "red orange yellow green blue purple pink black white brown grey gray big small little new old good bad fast slow hot cold " +
    "cat dog bird fish rabbit horse cow pig duck chicken monkey elephant tiger lion bear panda frog snake turtle crab bat bug worm ghost spider bee butterfly " +
    "one two three four five six seven eight nine ten first second last left right north south east west way road bridge river lake sea beach hill forest snow " +
    "game games football music drawing reading singing dancing swimming english skill skills weapon wand drum drums flute harp horn sword shield hat shirt shoes").split(" "));
  const add = s => String(s || "").toLowerCase().replace(/[^a-z ]/g, " ").split(/\s+/).filter(w => w.length > 1).forEach(w => W.add(w));
  try { Object.values(VOCAB).flat().forEach(v => add(v.w)); } catch (e) {}
  try { Object.values(ITEMS).forEach(it => add(it.name)); } catch (e) {}
  try { CITY.forEach(c => { add(c.name); add(c.type); }); SPOTS.forEach(s => add(s.name)); } catch (e) {}
  try { Object.values(MON).forEach(m => add(m.name)); } catch (e) {}
  return SAFE_WORDS = W;
}
function freeChatOn() { try { return localStorage.getItem("ev_freechat") === "1"; } catch (e) { return false; } }
function safeChat(text) {   // → câu được phép (đã chuẩn hoá) hoặc null
  const t = String(text || "").trim(); if (!t || /\d{3,}/.test(t.replace(/\s/g, ""))) return null;   // chặn dãy số
  if (freeChatOn()) return t;
  const n = t.toLowerCase().replace(/[’']/g, " ").replace(/[^a-z ]/g, " ").replace(/\s+/g, " ").trim();
  for (const q of QUICK) { const qn = q.replace("{name}", "").toLowerCase().replace(/[’']/g, " ").replace(/[^a-z ]/g, " ").replace(/\s+/g, " ").trim(); if (qn && match(qn, n) >= 0.85 && match(n, qn) >= 0.85) return q.replace("{name}", myName || ""); }
  const W = safeWords();
  for (const re of SAFE_TEMPLATES) { const m = n.match(re); if (!m) continue;
    const slots = m.slice(1).filter(Boolean).join(" ").split(" ").filter(Boolean);
    if (slots.every(w => W.has(w) || /^(hi|hello|hey|yes|no|okay|sure|sorry|wow|cool|too|course|fight|run|careful|wait|need|is|are|and|or|of|to|with|for|in|on|at|near|behind|next|front|go|turn|straight|please|very|so|much|lot|thanks|thank|you|can|i|swap|trade|have|like|would|team|up|join|play|come|follow|be|friends|let|s|lets|want|do|will|help|me|it|its|there|over|here|ready|good|morning|afternoon|evening|job|luck|nice|meet|see|later|soon|bye|goodbye|fine|great|ok|happy|tired|hungry|lost|favourite|favorite|what|your|my|the|a|an|some|this|these)$/.test(w)))
      return t.charAt(0).toUpperCase() + t.slice(1);
  }
  return null;
}
function addHeart(n) { save.heart = (save.heart || 0) + (n || 1); }   // 💛 Heart: số lượt giao tiếp với người chơi khác
function parentGate() {   // phụ huynh mở / tắt nói tự do
  const a = 3 + Math.floor(Math.random() * 7), b = 4 + Math.floor(Math.random() * 6);
  const box = document.createElement("div"); box.className = "over"; box.style.display = "block";
  box.innerHTML = "<div class='box' style='padding:14px;max-width:360px;margin:20vh auto'><b>👪 Dành cho phụ huynh</b><p style='font-size:14px'>" + (freeChatOn() ? "Đang BẬT nói tự do. Tắt để trẻ chỉ nói câu có sẵn và khung câu an toàn." : "Bật nói tự do: trẻ nói câu bất kỳ với người chơi khác (vẫn lọc từ xấu và số điện thoại).") +
    "</p><p>" + a + " × " + b + " = <input id='pgIn' inputmode='numeric' style='width:70px;font-size:16px'></p><button id='pgOk' style='padding:8px 14px;border:0;border-radius:10px;background:#1c7ed6;color:#fff;font-weight:700'>" + (freeChatOn() ? "Tắt" : "Bật") + "</button> <button id='pgNo' style='padding:8px 14px;border:0;border-radius:10px'>Huỷ</button></div>";
  document.body.appendChild(box);
  box.querySelector("#pgNo").onclick = () => box.remove();
  box.querySelector("#pgOk").onclick = () => { if (+box.querySelector("#pgIn").value === a * b) { try { localStorage.setItem("ev_freechat", freeChatOn() ? "0" : "1"); } catch (e) {} flash(freeChatOn() ? "👪 Free chat ON" : "👪 Safe chat ON"); } box.remove(); };
}

/* Dựng dữ liệu cho trang tổng hợp game (docs/bible/): đọc thẳng từ code + tài liệu rồi ghi docs/bible/data.js.
   Chạy lại mỗi khi nội dung game đổi:  node tools/bible/build.js */
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, "..", ".."), rd = f => fs.readFileSync(path.join(ROOT, f), "utf8");

// Lấy khối `const NAME = …` (cân ngoặc, bỏ qua chuỗi / chú thích) rồi chạy để ra giá trị
function grab(src, name) {
  const m = new RegExp("(?:const|let|var)\\s+" + name + "\\s*=\\s*").exec(src); if (!m) throw new Error("missing " + name);
  let i = m.index + m[0].length, d = 0, q = null; const s = i;
  for (; i < src.length; i++) {
    const c = src[i], n = src[i + 1];
    if (q) { if (c === "\\") { i++; continue; } if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === "`") { q = c; continue; }
    if (c === "/" && n === "/") { i = src.indexOf("\n", i); continue; }
    if (c === "/" && n === "*") { i = src.indexOf("*/", i) + 1; continue; }
    if ("[{(".includes(c)) d++; else if ("]})".includes(c)) { d--; if (d === 0) { i++; break; } }
    else if (d === 0 && (c === ";" || c === "\n")) break;
  }
  return vm.runInNewContext("(" + src.slice(s, i) + ")", { Math });
}
function runAll(src, names) {   // chạy cả file dữ liệu (places.js, deck.js, lessons.js) trong hộp cát
  const ctx = vm.createContext({ Math, console, Object, JSON });
  vm.runInContext(src + "\n;globalThis.__out = {" + names.join(",") + "};", ctx); return ctx.__out;
}

const P = runAll(rd("places.js"), ["ITEMS", "RARITY", "LEGENDS", "STARTER", "CITY", "ZONES", "VOCAB"]);
const D = runAll(rd("deck.js"), ["VOICE_DECK", "STARTER_DECK", "SOUNDS_DECK"]);
const L = runAll(rd("lessons.js"), ["LESSONS"]);
const E = rd("parts/combat/engine.js"), W = rd("parts/world/wilds.js");
const eng = {}; ["MON", "SEASON_MON", "SEASON_MON2", "TASK_ICON", "TASK_NAME", "TASK_COL", "CHALLENGES", "SKILLS", "BRANCH", "W_TIER", "W_LINES", "STAR_W", "BAND_WORDS"].forEach(n => eng[n] = grab(E, n));
const wild = { SEC: grab(W, "SEC"), SEC2: grab(W, "SEC2") };
const best = rd("docs/design/bestiary.html"), mons = grab(best, "M"), tierName = grab(best, "TIER");

// NPC thường (lessons.js + chủ cửa hàng trong places.js): chỉ giữ phần tóm tắt
const placeName = {}; P.CITY.forEach(c => placeName[c.id] = c.name);
const npcs = L.LESSONS.map(n => ({ name: n.name, place: n.place ? (placeName[n.place] || n.place) : "Ngoài phố", minLv: n.minLv || 1,
  steps: (n.steps || []).length, cards: (n.steps || []).filter(s => s.card).length, qs: (n.steps || []).filter(s => s.q).length,
  first: n.steps && n.steps[0] ? n.steps[0].say : "" }));
P.CITY.filter(c => c.keeper).forEach(c => npcs.push({ name: c.keeper.name, place: c.name, minLv: 1, steps: 0, cards: 0, qs: 0, first: c.keeper.greet, keeper: true }));

const items = Object.entries(P.ITEMS).map(([id, it]) => Object.assign({ id }, it));
const vocabN = Object.values(P.VOCAB).reduce((a, v) => a + v.length, 0);
const deck = {}; Object.entries(D.VOICE_DECK).forEach(([t, arr]) => { deck[t] = { n: arr.length, bands: {}, sample: [] };
  arr.forEach(x => deck[t].bands[x.band] = (deck[t].bands[x.band] || 0) + 1);
  [1, 2, 3, 4, 5].forEach(b => { const x = arr.find(y => y.band === b); if (x) deck[t].sample.push(x); }); });
const sounds = { n: D.SOUNDS_DECK.length, focus: {} }; D.SOUNDS_DECK.forEach(x => { (sounds.focus[x.focus] = sounds.focus[x.focus] || []).push(x); });
Object.keys(sounds.focus).forEach(k => sounds.focus[k] = { n: sounds.focus[k].length, sample: sounds.focus[k][0] });

const out = {
  built: new Date().toISOString().slice(0, 10),
  FX_DONE: [...new Set([...fs.readFileSync(path.join(ROOT, "parts/combat/fx3d.js"), "utf8").matchAll(/\bSK\.([a-z0-9_]+) = /g)].map(m => m[1]))],   // chiêu đã có hiệu ứng riêng
  story: rd("docs/STORY.md"),
  roadmap1: (rd("docs/ROADMAP.md").split("\n## 1.")[1] || "").split("\n## 2.")[0],
  roadmap3: (rd("docs/ROADMAP.md").split("\n## 3.")[1] || "").split("\n## 4.")[0],
  monsters: mons, tierName, items, rarity: P.RARITY, legends: P.LEGENDS, starter: P.STARTER,
  city: P.CITY.map(c => ({ id: c.id, name: c.name, type: c.type, keeper: c.keeper ? c.keeper.name : null })), zones: P.ZONES,
  npcs, cards: { vocab: vocabN, places: Object.keys(P.VOCAB).length, phrase: L.LESSONS.reduce((a, n) => a + (n.steps || []).filter(s => s.card).length, 0),
    question: L.LESSONS.reduce((a, n) => a + (n.steps || []).filter(s => s.q).length, 0), vocabSample: Object.entries(P.VOCAB).slice(0, 3).map(([k, v]) => ({ place: placeName[k] || k, words: v.slice(0, 4) })) },
  deck, starterDeck: D.STARTER_DECK, sounds, wild, ...eng
};
const file = path.join(ROOT, "docs", "bible", "data.js");
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, "/* Tự sinh bởi tools/bible/build.js – đừng sửa tay */\nwindow.BIBLE = " + JSON.stringify(out) + ";\n");
console.log("OK", file, (fs.statSync(file).size / 1024).toFixed(0) + " KB", { monsters: mons.length, items: items.length, npcs: npcs.length, vocab: vocabN });

// Tab "Hiệu ứng chiêu": chép mã hiệu ứng của game cạnh trang sổ tay
fs.copyFileSync(path.join(ROOT, "parts/combat/fx3d.js"), path.join(ROOT, "docs/bible/fx3d.js"));
console.log("đã chép fx3d.js");

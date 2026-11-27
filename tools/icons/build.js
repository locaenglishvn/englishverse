/* Tạo icon cho mọi chiêu chủ động từ hiệu ứng 3D thật (FX3D): node tools/icons/build.js [id,id,...]
   Cần Playwright + Chromium (có sẵn trong môi trường dev). Xuất assets/icons/skills/<id>.webp và assets/icons/skills/index.json */
const { chromium } = require("playwright"), http = require("http"), fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..", ".."), OUT = path.join(ROOT, "assets/icons/skills");
const src = fs.readFileSync(path.join(ROOT, "parts/combat/engine.js"), "utf8"), SK = {};
for (const m of src.matchAll(/^  ([a-z0-9_]+): \{ branch: "([a-z]+)"(.*)$/gm)) { const line = m[3], g = k => (line.match(new RegExp(k + ': ("?)([a-z0-9_.]+)\\1')) || [])[2];
  if (/type: "passive"/.test(line)) continue; SK[m[1]] = { id: m[1], branch: m[2], kind: g("kind"), radius: +g("radius") || 0, hits: +g("hits") || 0, ult: /type: "ult"/.test(line) }; }
const HINT = { hybrid_shot: { at: [0.15, 0.25, 0.35] }, four_moons: { casts: 1, at: [0.1, 0.16, 0.22] }, ring_shock: { at: [0.15, 0.22, 0.3], look: 0.5 }, e_mc2_nova: { at: [0.5, 0.8, 1.15, 1.22], look: 1 },
  microbe_swarm: { at: [0.6, 0.8, 1.0], look: 0.95, dist: 7 }, dragon_roar: { at: [0.7, 0.9, 1.1, 1.3], look: 0.35, dist: 11 }, winged_courier: { casts: 7, at: [0.35, 0.5, 0.65], look: 1, dist: 6, y: 2.4, nocrop: true }, photon_lance: { at: [0.29, 0.31], look: 0.6, dist: 8 },
  ibis_judgment: { at: [0.9, 1.1, 1.3], look: 0.15 }, echo_blast: { at: [0.25, 0.35, 0.45], look: 0.6 }, water_split: { at: [0.5, 0.65, 0.8], look: 1, dist: 6 } };   /* gợi ý chụp riêng: { at: [giây], look: 0 (người chơi) … 1 (quái), dist, y } */
const only = (process.argv[2] || "").split(",").filter(Boolean), ids = Object.keys(SK).filter(id => !only.length || only.includes(id));
const MIME = { ".html": "text/html; charset=utf-8", ".js": "application/javascript" };
const server = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split("?")[0])); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(r); });
server.listen(0, async () => {
  const b = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"] }), p = await b.newPage(); const errs = []; p.on("pageerror", e => errs.push(e.message));
  await p.goto("http://localhost:" + server.address().port + "/tools/icons/icon.html"); await p.waitForFunction(() => window.ready);
  fs.mkdirSync(OUT, { recursive: true }); const done = [];
  for (const id of ids) { const S = SK[id], times = S.ult ? [0.6, 0.9, 1.2, 1.5, 1.8, 2.1, 2.4] : [0.2, 0.35, 0.5, 0.65, 0.8, 1.0, 1.25, 1.5];
    const r = await p.evaluate(o => window.renderIcon(o), Object.assign({}, S, { rank: S.ult ? 10 : 7, times, size: 192, hint: HINT[id] }));
    fs.writeFileSync(path.join(OUT, id + ".webp"), Buffer.from(r.url.split(",")[1], "base64")); done.push(id); process.stdout.write(id + " "); }
  const all = fs.readdirSync(OUT).filter(f => f.endsWith(".webp")).map(f => f.replace(".webp", "")).sort();
  fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify(all)); console.log("\nđã tạo", done.length, "icon; lỗi:", errs.slice(0, 3)); await b.close(); server.close();
});

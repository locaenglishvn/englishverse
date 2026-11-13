/* EnglishVerse – CỔNG QA. Chạy:  node tools/qa/run.js            (kiểm tra tất cả)
                                  node tools/qa/run.js bank museum (chỉ vài nơi, theo id trong places.js)
                                  node tools/qa/run.js --data      (chỉ kiểm tra dữ liệu NPC/từ vựng, không mở trình duyệt)
   Cần Playwright + Chromium (đã có sẵn trong máy làm việc). Ảnh chụp từng nơi lưu ở tools/qa/out/ (không đưa lên git).
   Kiểm tra:
   1. Dữ liệu: mỗi NPC có nơi đứng hợp lệ, mỗi bước có say / card / 3 lựa chọn và đúng 1 lựa chọn đúng; từ vựng đủ trường, không trùng giữa các nơi.
   2. Chạy game: không lỗi JavaScript; cửa mọi nhà đứng được.
   3. Mỗi nơi có nội thất: đủ chỗ bày cho MỌI món từ vựng; tới được mọi NPC, mọi chỗ hỏi từ vựng, và cửa ra (dò đường trên lưới 0,4 m).
   4. Hiệu năng: số lần vẽ mỗi khung ≤ ngưỡng (ngoài trời 260, trong nhà 360, nơi rất rộng 450). */
const { chromium } = require('playwright'), http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../..'), OUT = path.join(__dirname, 'out'), ONLY = process.argv.slice(2).filter(a => a[0] !== '-'), DATA_ONLY = process.argv.includes('--data');
const BUDGET = { outdoor: 260, room: 360, bigRoom: 450 };   // bigRoom: nơi rộng > 40 m (bảo tàng) nhìn xuyên nhiều khu
let fails = 0, warns = 0; const fail = (m) => { fails++; console.log('  ❌ ' + m); }, warn = (m) => { warns++; console.log('  ⚠️  ' + m); }, ok = (m) => console.log('  ✅ ' + m);

// ---------- 1. Dữ liệu (không cần trình duyệt) ----------
global.window = {}; eval(fs.readFileSync(path.join(ROOT, 'places.js'), 'utf8') + ';' + fs.readFileSync(path.join(ROOT, 'lessons.js'), 'utf8') + ';global.D={CITY,VOCAB,LESSONS}');
console.log('1. DỮ LIỆU');
const ids = new Set(D.CITY.map(c => c.id));
D.LESSONS.forEach(L => {
  const who = L.name || '(không tên)';
  if (L.place && !ids.has(L.place)) fail(who + ': place "' + L.place + '" không có trong CITY');
  (L.steps || []).forEach((s, i) => {
    if (!s.say) fail(who + ' bước ' + (i + 1) + ': thiếu say');
    if (!s.card || !s.card.w || !s.card.pic || !s.card.ex) fail(who + ' bước ' + (i + 1) + ': card thiếu w/pic/ex');
    if (s.q && (!s.q.w || !s.q.pic || !s.q.ex)) fail(who + ' bước ' + (i + 1) + ': q thiếu w/pic/ex');
    const ch = s.choices || [];
    if (ch.length !== 3) warn(who + ' bước ' + (i + 1) + ': có ' + ch.length + ' lựa chọn (chuẩn là 3)');
    if (!ch.some(c => c.ok)) fail(who + " bước " + (i + 1) + ": không có lựa chọn nào ok: true");
    ch.forEach(c => { if (!c.t || !c.fb) fail(who + ' bước ' + (i + 1) + ': lựa chọn thiếu t/fb'); });
  });
  if (!L.steps || L.steps.length < 3) warn(who + ': ít hơn 3 bước');
});
const seenW = {};
Object.keys(D.VOCAB).forEach(pid => {
  if (!ids.has(pid)) fail('VOCAB.' + pid + ': không có nơi này trong CITY');
  D.VOCAB[pid].forEach(v => { ['w', 'pic', 'pos', 'kind', 'at', 'say', 'ex'].forEach(f => { if (!v[f]) fail('VOCAB.' + pid + ' "' + v.w + '": thiếu ' + f); }); (seenW[v.w] = seenW[v.w] || []).push(pid); });
});
Object.keys(seenW).forEach(w => { if (seenW[w].length > 1) warn('từ "' + w + '" trùng ở: ' + seenW[w].join(', ') + ' (cùng 1 thẻ)'); });
const npcPer = {}; D.LESSONS.forEach(L => { if (L.place) npcPer[L.place] = (npcPer[L.place] || 0) + 1; });
if (!fails) ok(D.LESSONS.length + ' NPC, ' + Object.values(D.VOCAB).reduce((a, b) => a + b.length, 0) + ' từ vựng hợp lệ');
if (DATA_ONLY) { console.log('\nKẾT QUẢ (chỉ dữ liệu): ' + (fails ? '❌ TRƯỢT – ' + fails + ' lỗi' : '✅ ĐẠT') + (warns ? ', ' + warns + ' cảnh báo' : '')); process.exit(fails ? 1 : 0); }

// ---------- 2–4. Chạy game trong trình duyệt ----------
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png', '.gltf': 'model/gltf+json', '.bin': 'application/octet-stream', '.jpg': 'image/jpeg' };
const server = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
server.listen(0, async () => {
  const port = server.address().port; fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 900, height: 600 } }); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/supabase|websocket|realtime|Failed to load resource/i.test(m.text())) errs.push(m.text()); });
  await p.addInitScript(() => { try { localStorage.setItem('ev_name', 'QA'); } catch (e) {} });
  await p.goto('http://localhost:' + port + '/index.html'); await p.waitForTimeout(5000);
  console.log('2. CHẠY GAME');
  const base = await p.evaluate(`(async () => { const fr = () => new Promise(r => requestAnimationFrame(r)); await fr(); await fr(); renderer.info.autoReset = false; renderer.info.reset(); await fr(); const calls = renderer.info.render.calls; renderer.info.autoReset = true;
    return { calls, blockedDoors: CITY.filter(P => P.doorPos && blocked(P.doorPos.x, P.doorPos.z)).map(P => P.id) }; })()`);
  base.blockedDoors.forEach(id => fail('cửa nhà "' + id + '" bị chặn'));
  (base.calls > BUDGET.outdoor ? fail : ok)('ngoài trời: ' + base.calls + ' lần vẽ/khung (ngưỡng ' + BUDGET.outdoor + ')');
  console.log('3. TỪNG NƠI');
  const places = D.CITY.filter(c => (ONLY.length ? ONLY.includes(c.id) : (D.VOCAB[c.id] || npcPer[c.id])) && c.type !== 'home');
  for (const c of places) {
    const r = await p.evaluate(`(async (id) => { const fr = () => new Promise(r => requestAnimationFrame(r)); const P = CITY.find(c => c.id === id); enterRoom(P); await fr(); await fr(); const R = room, st = 0.4, out = { id };
      const key = (x, z) => Math.round((x - R.cx) / st) + ',' + Math.round((z - R.cz) / st), seen = new Set(), q = [[player.position.x, player.position.z]]; seen.add(key(...q[0]));
      out.startBlocked = blocked(player.position.x, player.position.z);
      while (q.length) { const [x, z] = q.pop(); [[st, 0], [-st, 0], [0, st], [0, -st]].forEach(([dx, dz]) => { const nx = x + dx, nz = z + dz, k = key(nx, nz); if (!seen.has(k) && !blocked(nx, nz)) { seen.add(k); q.push([nx, nz]); } }); }
      const near = (x, z, r) => { const n = Math.ceil((r || 0.5) / st); for (let a = -n; a <= n; a++) for (let b = -n; b <= n; b++) if (Math.hypot(a, b) * st <= (r || 0.5) && seen.has(key(x + a * st, z + b * st))) return true; return false; };   // trong game: đứng cách ≤ 1,8 m là hỏi được đồ, ≤ 3,3 m là nói chuyện được NPC
      const voc = VOCAB[id] || [], spots = (R.spots || []).filter(s => s.label.indexOf('❓') === 0);
      out.vocab = voc.length; out.placed = spots.length; out.badSpots = spots.filter(s => !near(s.x, s.z, 1.5)).map(s => s.label + ' @' + (s.x - R.cx).toFixed(1) + ',' + (s.z - R.cz).toFixed(1));
      const used = {}; voc.forEach(v => used[v.at] = (used[v.at] || 0) + 1); out.short = Object.keys(used).filter(k => !P.anchors || !P.anchors[k] || P.anchors[k].length < used[k]).map(k => k + ' cần ' + used[k] + ', có ' + ((P.anchors && P.anchors[k]) || []).length);
      out.npcs = LESSONS.filter(l => l.inPlace === P).map(l => { return [l.name, near(l.x, l.z, 2.8)]; });
      out.exit = near(R.exit.x, R.exit.z); renderer.info.autoReset = false; renderer.info.reset(); await fr(); out.calls = renderer.info.render.calls; renderer.info.autoReset = true;
      return out; })('${c.id}')`);
    await p.screenshot({ path: path.join(OUT, c.id + '.png') });
    await p.evaluate('exitRoom()'); await p.waitForTimeout(150);
    const before = fails; console.log(' • ' + c.name + ' (' + c.id + '): ' + r.npcs.length + ' NPC, ' + r.vocab + ' từ vựng, ' + r.calls + ' lần vẽ');
    if (r.startBlocked) fail('chỗ đứng khi vào phòng bị chặn');
    if (!r.exit) fail('không đi ra cửa được');
    if (r.short.length) fail('thiếu chỗ bày: ' + r.short.join('; '));
    if (r.placed < r.vocab) fail('chỉ bày được ' + r.placed + '/' + r.vocab + ' món');
    r.badSpots.forEach(s => fail('không tới được chỗ hỏi: ' + s));
    r.npcs.filter(n => !n[1]).forEach(n => fail('không tới được NPC: ' + n[0]));
    if (r.npcs.length && r.npcs.length < 4) warn('mới có ' + r.npcs.length + ' NPC (chuẩn ≥ 4)');
    const lim = (c.size && c.size.w > 40) ? BUDGET.bigRoom : BUDGET.room; if (r.calls > lim) fail(r.calls + ' lần vẽ/khung, vượt ngưỡng ' + lim);
    if (fails === before) ok('đạt');
  }
  console.log('4. LỖI JAVASCRIPT'); errs.length ? errs.slice(0, 10).forEach(e => fail(e)) : ok('không có lỗi');
  console.log('\nKẾT QUẢ: ' + (fails ? '❌ TRƯỢT – ' + fails + ' lỗi' : '✅ ĐẠT') + (warns ? ', ' + warns + ' cảnh báo' : '') + ' · ảnh: tools/qa/out/');
  await b.close(); server.close(); process.exit(fails ? 1 : 0);
});

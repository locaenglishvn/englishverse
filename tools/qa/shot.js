/* EnglishVerse – CHỤP ẢNH 1 NƠI để xem nhanh (dùng chung, khỏi viết script riêng).
   node tools/qa/shot.js <id>                    → 4 góc trong nhà + 1 góc ngoài phố, ghép thành 1 ảnh: tools/qa/out/<id>-views.png
   node tools/qa/shot.js <id> '[[x,y,z, lx,ly,lz], …]'   → góc tự chọn (toạ độ tính từ GIỮA PHÒNG; camera ở x,y,z nhìn về lx,ly,lz)
   Xem ảnh bằng công cụ Read (1 ảnh ghép = rẻ hơn nhiều ảnh lẻ). */
const { chromium } = require('playwright'), http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../..'), OUT = path.join(__dirname, 'out'), id = process.argv[2];
if (!id) { console.log('Cách dùng: node tools/qa/shot.js <id> [views]'); process.exit(1); }
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.png': 'image/png', '.gltf': 'model/gltf+json', '.bin': 'application/octet-stream' };
const server = http.createServer((q, r) => { const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
server.listen(0, async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }), p = await b.newPage({ viewport: { width: 640, height: 400 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { try { localStorage.setItem('ev_name', 'QA'); } catch (e) {} });
  await p.goto('http://localhost:' + server.address().port + '/index.html'); await p.waitForTimeout(5000);
  const info = await p.evaluate(`(() => { const P = CITY.find(c => c.id === ${JSON.stringify(id)}); if (!P) return null; const S = P.size || {}; return { w: S.w || 16, d: S.d || 12, h: S.h || 3.4, door: P.doorPos, x: P.x, z: P.z }; })()`);
  if (!info) { console.log('Không có nơi "' + id + '" trong CITY'); process.exit(1); }
  const W = info.w / 2, D = info.d / 2, H = Math.min(info.h - 0.5, 4);
  const views = process.argv[3] ? JSON.parse(process.argv[3]) : [[0, H, D - 1, 0, 1.5, 0], [-W + 1, H, 0, W, 1, -D / 2], [W - 1, H, -D + 1, -W / 2, 1, D / 2], [0, H, 0, 0, 1.5, -D]];
  await p.evaluate(`(() => { const r0 = renderer.render.bind(renderer); window.FREE = null; renderer.render = (s, c) => { if (window.FREE) { c.position.set(...FREE[0]); c.lookAt(...FREE[1]); } r0(s, c); }; })()`);
  const files = [];
  // ngoài phố: đứng trước cửa nhìn vào mặt tiền
  await p.evaluate(`(() => { const d = ${JSON.stringify(info.door)}, P = { x: ${info.x}, z: ${info.z} }; player.position.set(d.x, 0, d.z); const dx = d.x - P.x, dz = d.z - P.z, L = Math.hypot(dx, dz) || 1; FREE = [[d.x + dx / L * 14, 7, d.z + dz / L * 14], [P.x, 4, P.z]]; })()`);
  await p.waitForTimeout(1500); let f = path.join(OUT, id + '-v0.png'); await p.screenshot({ path: f }); files.push(f);
  await p.evaluate(`enterRoom(CITY.find(c => c.id === ${JSON.stringify(id)}))`); await p.waitForTimeout(800);
  for (let i = 0; i < views.length; i++) {
    const [x, y, z, lx, ly, lz] = views[i];
    await p.evaluate(`(() => { const R = room; FREE = [[R.cx + ${x}, ${y}, R.cz + ${z}], [R.cx + ${lx}, ${ly}, R.cz + ${lz}]]; })()`);
    await p.waitForTimeout(900); f = path.join(OUT, id + '-v' + (i + 1) + '.png'); await p.screenshot({ path: f }); files.push(f);
  }
  // ghép tất cả thành 1 ảnh lưới (2 cột) bằng canvas trong trình duyệt
  const data = files.map(fl => 'data:image/png;base64,' + fs.readFileSync(fl).toString('base64'));
  const out = await p.evaluate(async (imgs) => { const ims = await Promise.all(imgs.map(src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; })));
    const w = 480, h = 300, cols = 2, rows = Math.ceil(ims.length / cols), c = document.createElement('canvas'); c.width = w * cols; c.height = h * rows; const x = c.getContext('2d');
    ims.forEach((im, k) => x.drawImage(im, (k % cols) * w, Math.floor(k / cols) * h, w, h)); return c.toDataURL('image/png').split(',')[1]; }, data);
  const grid = path.join(OUT, id + '-views.png'); fs.writeFileSync(grid, Buffer.from(out, 'base64')); files.forEach(fl => fs.unlinkSync(fl));
  console.log('Ảnh: ' + path.relative(ROOT, grid) + ' (ô 1 = ngoài phố, các ô sau = trong nhà)' + (errs.length ? '\nLỖI JS: ' + errs.slice(0, 3).join(' | ') : ''));
  await b.close(); server.close();
});

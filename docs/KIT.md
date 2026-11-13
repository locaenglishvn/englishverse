# Bộ đồ nghề cho Builder (đọc file này THAY cho index.html / museum.js)

> Mục tiêu: agent làm 1 nơi mà không phải đọc code lớn → tiết kiệm token. Chỉ mở thêm file khi thật cần.

## 1. Một nơi gồm những gì
| Phần | File | Ghi chú |
|---|---|---|
| Vị trí, kích thước, người bán | `places.js` → `CITY` (CTO đã khai sẵn) | `size: { w, d, h }` = kích thước phòng |
| Nội thất | `parts/interiors/<id>.js` | đăng ký `INTERIORS["<layout>"] = { furnish, customWalls?, bright?, wall? }` |
| Ngoại thất (nếu có) | `parts/exteriors/<id>.js` | đăng ký `EXTERIORS_EXTRA["<tên>"] = function (g, P) {…}` |
| NPC | `lessons.js`, dưới dòng `/* ===== NPC: <id>` | mỗi NPC bắt đầu bằng `,{` |
| Từ vựng | `places.js`, trong mảng `<id>: [` dưới `/* ===== VOCAB.<id>` | |
| Thẻ `<script>` | `index.html` | CTO đã thêm sẵn – **không sửa index.html** |

## 2. Nội thất: khung hàm
```js
function furnishX(P, g, cx, cz, W, D, fur) {
  const H = P.size.h;                       // phòng: x ∈ cx ± W/2, z ∈ cz ± D/2; cửa chính ở giữa cạnh z = cz + D/2
  // … dựng đồ (toạ độ tuyệt đối = cx + dx, cz + dz) …
  P.keeperPos = [dx, dz];                   // CHỈ khi nơi có người bán (keeper) – đứng sau quầy, người chơi tới gần được ≤ 4 m
  P.anchors = { khu1: [KIT.a(P, x, y, z, đứngX, đứngZ), …], … };   // chỗ bày từ vựng (≥ số món có at = khu1)
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["<layout>"] = { furnish: furnishX, customWalls: true, bright: true };
```
- **Chỗ người chơi xuất hiện:** `(cx, cz + D/2 − 4.5)` → để trống và chừa lối đi rộng ≥ 3 m từ cửa.
- `customWalls: true` = tự dựng tường (dùng `KIT.zone`) và tự vẽ cửa chính. `bright: true` = nơi sáng (mái kính, giếng trời).
- Không có `customWalls` → engine dựng sẵn 4 tường màu `P.wall`; muốn tường có hình thì thêm `wall: (len, h, { x, z }) => chất liệu`.

## 3. Hàm có sẵn
**Đồ nghề `KIT` (parts/kit.js) – toạ độ tính từ GIỮA PHÒNG:**
| Hàm | Làm gì |
|---|---|
| `KIT.tex(w, h, (ctx, w, h) => {…})` | ảnh lặp vẽ bằng canvas (đơn vị mét) |
| `KIT.zone(P, g, x0, x1, z0, z1, { h, tex, tileW, color, gaps: { n:[tâm, rộng], s, w, e }, doorH, lintel })` | 1 khu: 4 tường quay vào trong + vật cản + cửa + tự thêm `P.zones` (camera ở trong khu, ẩn tên NPC khu khác). n = cạnh z nhỏ, s = cạnh z lớn (phía cửa chính) |
| `KIT.wall(P, g, x0, z0, x1, z1, h, tex, tileW, color)` | 1 đoạn tường lẻ |
| `KIT.floor(P, g, x0, x1, z0, z1, tex, tileM)` / `KIT.ceiling(P, g, x0, x1, z0, z1, h, tex, tileM, color)` | sàn / trần |
| `KIT.sign(P, g, "TEXT · CHỮ VIỆT", w, x, y, z, ry, bg, fg)` | biển chữ (ry = 0 quay về phía cửa chính) |
| `KIT.block(P, g, w, h, d, màu, x, z, y)` | hộp màu + tự thêm vật cản |
| `KIT.many(P, g, geometry, màu, [[x, y, z, ry, sx, sy, sz], …])` | nhiều vật giống nhau = **1 lần vẽ** (ghế, giường, sản phẩm) |
| `KIT.a(P, x, y, z, đứngX, đứngZ)` | 1 chỗ bày từ vựng |

**Hàm trong index.html – toạ độ TUYỆT ĐỐI:** `lb(g, w, h, d, màu, x, y, z)` hộp · `lc(g, rTrên, rDưới, h, màu, x, y, z, số cạnh)` trụ · `mat(màu, {opts})` chất liệu dùng chung · `skin(w, h, ppm, draw)` ảnh canvas · `face(g, tex, w, h, x, y, z, ry)` dán ảnh lên mặt · `textPlate(text, w, h, bg, fg)` biển chữ · `archPath(ctx, X, Y, W, H)` / `archWin(ctx, X, Y, W, H, kính, khung)` / `rectWin(…)` vẽ cửa sổ trên canvas · `signText(ctx, text, cx, cy, maxW, size, màu)` · `hipRoof(g, w, d, h, màu, x, y, z)` · `pot(g, x, z, s)` chậu cây · `bigTree(g, x, z, s)` · `emojiSprite(emoji, size)`.
**Đồ KayKit có sẵn:** `fur("tên_model", x, z, ry, scale, hw, hd, y)` (x, z tuyệt đối; hw/hd = vật cản). Tên model: xem `ls assets/furniture`. Mỗi model = vài lần vẽ và **không** được gộp → dùng vừa phải.
**Vật cản tay:** `P.room.solids.push({ x, z, hw, hd })` (tuyệt đối, nửa rộng / nửa sâu).

## 4. Ngoại thất
```js
EXTERIORS_EXTRA["<tên>"] = function (g, P) {
  // hệ toạ độ riêng: giữa nhà ở (0, 0), MẶT TIỀN quay về +z, chiều ngang mặt tiền = P.w (trục x), chiều sâu = P.d (trục z)
  // mặt tường: vẽ chi tiết bằng skin() rồi face() dán lên (rẻ hơn dựng từng khối)
  return { solids: [[x, z, nửaRộng, nửaSâu], …], door: [x, z] /* điểm đứng trước cửa, ngoài vật cản */, map: [[0, 0, P.w, P.d]] };
};
```
Đồ phía trước mặt tiền không vượt quá ~3 m (đường và đèn phố ở gần).

## 5. Quy tắc bắt buộc (QA sẽ bắt lỗi)
- Lần vẽ mỗi khung ≤ **360** (phòng ≤ 40 m) / ≤ **450** (phòng rộng hơn); ngoài phố ≤ 260. Mẹo: dùng `mat(màu)` (được gộp tự động), ít ảnh canvas riêng, `KIT.many` cho đồ lặp lại.
- Mái, trần, đồ trên cao: `userData.flat = true` (không đổ bóng).
- Vật chuyển động / bật tắt sau khi tải: báo CTO (phải thêm vào danh sách bỏ qua khi gộp khối).
- Không dùng logo / tên thương hiệu thật. Không nội dung chính trị, bạo lực, đáng sợ.
- Hết hàm `furnish` phải có `P.anchors` + `P.vgroup`.

## 6. NPC & từ vựng (trình độ Movers/Flyers ≈ A1–A2)
```js
,{
  name: "Tên – Nghề", color: 0x1c7ed6, place: "<id>", x: 0, z: 0, /* minLv: 5 */
  steps: [
    { say: "NPC nói (≤ 12 từ, từ thông dụng)",
      q: { w: "Câu hỏi mẫu…?", pic: "❓", ex: "Câu ví dụ." },          // thẻ câu hỏi – 1–2 bước
      card: { w: "cụm từ học", pic: "🙂", ex: "Câu ví dụ." },          // thẻ câu nói – mỗi bước
      choices: [
        { t: "Câu trả lời đúng", ok: true,  fb: "Khen ngắn! +10" },
        { t: "Câu sai kiểu người Việt hay mắc", ok: false, fb: "Gợi ý nhẹ nhàng" },
        { t: "Câu lạc đề vui", ok: false, fb: "Gợi ý" } ] },
    … 3 bước …
  ]
}
```
Từ vựng: `{ w: "word", pic: "🔧", pos: "noun", kind: "tool", at: "khu1", say: "It's a …", ex: "Câu ví dụ ngắn." },` — `kind` ∈ drink/food/tool/machine/plant/furniture/thing. **Không trùng từ đã có** (`grep 'w: "từ"' places.js`).

## 7. Kiểm tra (bắt buộc trước khi báo xong)
```bash
node tools/qa/run.js <id>          # phải ra ✅ ĐẠT, không cảnh báo về <id>
node tools/qa/shot.js <id>         # 1 ảnh ghép (ngoài phố + 4 góc trong) → xem bằng Read: tools/qa/out/<id>-views.png
node tools/qa/shot.js <id> '[[x,y,z, lx,ly,lz]]'   # góc tự chọn (từ giữa phòng)
```
Xem tối đa 2–3 ảnh ghép; chỉnh rồi chụp lại khi thật cần.

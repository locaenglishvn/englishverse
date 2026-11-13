# Đề bài: Home & Cozy – cửa hàng nội thất
- **id:** `furniture` · **layout:** `homecozy` · **phòng:** 60 × 72 × 10 m · **tường:** customWalls
- **File được sửa:** `parts/interiors/furniture.js` · NPC dưới `/* ===== NPC: furniture` (lessons.js) · từ vựng trong `furniture: [` (places.js). Không sửa index.html, CITY, nơi khác.
- **Phần làm dở:** wip/furniture/ (interiors_furniture.js ~290 dòng + data.patch ~100 dòng từ vựng – dùng tiếp)

## Hình ảnh
Showroom kiểu IKEA (tên riêng): lối đi có mũi tên qua các phòng mẫu – phòng khách, phòng ngủ, phòng trẻ em, bếp, phòng ăn, phòng tắm, góc làm việc, giặt phơi + kho, ban công/vườn; khu đồ nhỏ (cốc, đĩa, khăn, gối, khung ảnh, cây, đồng hồ, giỏ); quầy thu ngân gần lối ra. Biển phòng Anh + Việt (LIVING ROOM · PHÒNG KHÁCH), gỗ sáng / trắng. Dùng nhiều model KayKit (`ls assets/furniture`).

## NPC
Người bán Omar – Seller (bán đồ trang trí) → `P.keeperPos` ở quầy thu ngân. ≥ 4 NPC (nhà thiết kế; gia đình mua đồ phòng bé; thợ lắp đặt; khách so sánh sofa Lv.5). Chủ đề: giới từ in/on/under/next to/between, màu, cỡ, Where do you put…?, so sánh, There is / There are.

## Từ vựng
~70 từ đồ trong nhà (đủ các phòng). Tên khu (`at` / `P.anchors`) thống nhất: **living, bedroom, kids, kitchen, dining, bath, study, laundry, garden, market**.

## Tiêu chí đạt
`node tools/qa/run.js furniture` → ✅ ĐẠT, không cảnh báo về `furniture` · `node tools/qa/shot.js furniture` nhìn đúng tinh thần ảnh tham khảo · đọc `docs/KIT.md` trước, KHÔNG đọc index.html / museum.js trừ khi thật cần.

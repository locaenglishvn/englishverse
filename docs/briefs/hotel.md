# Đề bài: Verse Hotel – khách sạn
- **id:** `hotel` · **layout:** `hotel` · **phòng:** 40 × 60 × 10 m · **tường:** tuỳ chọn
- **File được sửa:** `parts/interiors/hotel.js`, `parts/exteriors/hotel.js` · NPC dưới `/* ===== NPC: hotel` (lessons.js) · từ vựng trong `hotel: [` (places.js). Không sửa index.html, CITY, nơi khác.
- **Phần làm dở:** wip/hotel/exteriors_hotel.js (ngoại thất ~220 dòng – dùng tiếp)

## Hình ảnh
NGOẠI THẤT (`hotel`, mặt tiền 18 m, sâu 16 m, cửa quay ra quảng trường): theo khách sạn Majestic Sài Gòn – kem trắng, 5–6 tầng, cửa sổ vòm cao có ban công sắt nhỏ, tầng trệt đá nhám, phào chỉ, lan can mái, góc bo tròn có tháp nhỏ mái vòm, chữ VERSE HOTEL, mái hiên lối vào, chậu cau. NỘI THẤT cổ điển châu Âu: sảnh đá cẩm thạch, quầy lễ tân gỗ + đồng (chuông, giá chìa khoá), quầy concierge, xe hành lý, đèn chùm, cột mạ vàng, cầu thang, phòng chờ có sofa + đàn piano lớn, cửa thang máy, nhà hàng (bàn bày sẵn, quầy buffet), 1 phòng ngủ mẫu (giường, tủ áo, bàn, minibar, rèm, góc phòng tắm).

## NPC
≥ 4 NPC (lễ tân: I have a reservation; bell-boy; concierge giới thiệu chỗ chơi trong Verse City; khách nước ngoài / đầu bếp Lv.5). Chủ đề: đặt phòng, ngày, số phòng, tầng (on the third floor), Could you…?, chỉ đường.

## Từ vựng
~40 từ khách sạn. Tên khu (`at` / `P.anchors`) thống nhất: **lobby, desk, lounge, restaurant, room**.

## Tiêu chí đạt
`node tools/qa/run.js hotel` → ✅ ĐẠT, không cảnh báo về `hotel` · `node tools/qa/shot.js hotel` nhìn đúng tinh thần ảnh tham khảo · đọc `docs/KIT.md` trước, KHÔNG đọc index.html / museum.js trừ khi thật cần.

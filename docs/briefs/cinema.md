# Đề bài: Star Cinema – rạp chiếu phim
- **id:** `cinema` · **layout:** `starium` · **phòng:** 40 × 56 × 14 m · **tường:** customWalls
- **File được sửa:** `parts/interiors/cinema.js`, `parts/exteriors/cinema.js` · NPC dưới `/* ===== NPC: cinema` (lessons.js) · từ vựng trong `cinema: [` (places.js). Không sửa index.html, CITY, nơi khác.
- **Phần làm dở:** wip/cinema/ (exteriors_cinema.js ~110 dòng + interiors_cinema.js ~210 dòng – dùng tiếp)

## Hình ảnh
NGOẠI THẤT (`cinema`, mặt tiền 20 m, sâu 16 m): mặt tiền tối hiện đại, biển STAR CINEMA phát sáng, hộp đèn poster phim (tên phim tự nghĩ, hợp trẻ em), dải LED, cửa kính có mái hiên, thảm đỏ, cột xếp hàng, xe bỏng ngô. NỘI THẤT kiểu rạp CGV có phòng màn hình cực lớn (tên riêng, không logo thật): SẢNH – quầy vé có màn hình, máy bán vé tự động, quầy bỏng nước (máy bỏng ngô, vòi nước ngọt, bảng combo), màn hình NOW SHOWING, poster, ghế chờ, góc gắp thú; PHÒNG CHIẾU – màn hình cong rất lớn, ghế đỏ bậc thang (`KIT.many`), đèn lối đi, biển EXIT, ô kính phòng máy chiếu, loa tường. Hơi tối nhưng vẫn rõ trên điện thoại.

## NPC
Người bán Jack – Ticket Seller (bán bỏng, nước) → `P.keeperPos` sau quầy. ≥ 4 NPC (soát vé: Row F, seat 12; bé chọn thể loại phim; bạn rủ đi xem; người mê phim Lv.5). Chủ đề: What time does it start?, thể loại, I'd like two tickets, số ghế, nhận xét funny/scary/exciting.

## Từ vựng
~35 từ (tránh trùng: spotlight, ticket, screen đã có). Tên khu (`at` / `P.anchors`) thống nhất: **lobby, snack, hall**.

## Tiêu chí đạt
`node tools/qa/run.js cinema` → ✅ ĐẠT, không cảnh báo về `cinema` · `node tools/qa/shot.js cinema` nhìn đúng tinh thần ảnh tham khảo · đọc `docs/KIT.md` trước, KHÔNG đọc index.html / museum.js trừ khi thật cần.

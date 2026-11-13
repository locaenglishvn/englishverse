# Đề bài: Verse Electronics – siêu thị điện máy (nơi mới)
- **id:** `electronics` · **layout:** `electronics` · **phòng:** 60 × 72 × 10 m · **tường:** tuỳ chọn
- **File được sửa:** `parts/interiors/electronics.js`, `parts/exteriors/electronics.js` · NPC dưới `/* ===== NPC: electronics` (lessons.js) · từ vựng trong `electronics: [` (places.js). Không sửa index.html, CITY, nơi khác.
- **Phần làm dở:** wip/electronics/ (exteriors_electronics.js + data.patch – dùng tham khảo; nội thất làm mới)

## Hình ảnh
NGOẠI THẤT (`electronics`, mặt tiền 22 m, sâu 16 m, cửa quay ra quảng trường): phong cách chuỗi điện máy Việt Nam nhưng thương hiệu riêng “VERSE ELECTRONICS · ĐIỆN MÁY VERSE”: mặt tiền xanh dương đậm + điểm nhấn vàng, kính lớn thấy hàng bên trong, băng rôn khuyến mãi chung chung, mái hiên, bãi xe máy phía trước. NỘI THẤT kiểu siêu thị: dãy theo ngành hàng – tường TV, điện thoại & máy tính bảng, laptop, tủ lạnh, máy giặt & sấy, máy lạnh, quạt, đồ bếp (nồi cơm, lò vi sóng, máy xay, ấm, nồi chiên), máy hút bụi & bàn ủi, loa & tai nghe, máy ảnh & máy chơi game, máy lọc nước; quầy thu ngân có màn hình và hàng chờ, quầy chăm sóc khách / bảo hành, quầy trả góp, bảng giá, biển ngành hàng Anh + Việt.

## NPC
≥ 4 NPC (nhân viên so sánh 2 TV; thu ngân; kỹ thuật viên bảo hành; gia đình mua tủ lạnh Lv.5). Chủ đề: so sánh bigger/cheaper/quieter, How much…?, Does it have…?, It's broken, Can I pay by card?, tiết kiệm điện.

## Từ vựng
~60 từ đồ điện (tránh trùng: microwave, laptop, air conditioner, computer… đã có). Tên khu (`at` / `P.anchors`) thống nhất: **tv, phone, fridge, washer, kitchen, cool, audio, cashier, service**.

## Tiêu chí đạt
`node tools/qa/run.js electronics` → ✅ ĐẠT, không cảnh báo về `electronics` · `node tools/qa/shot.js electronics` nhìn đúng tinh thần ảnh tham khảo · đọc `docs/KIT.md` trước, KHÔNG đọc index.html / museum.js trừ khi thật cần.

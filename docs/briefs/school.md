# Đề bài: Verse School – khuôn viên trường
- **id:** `school` · **layout:** `campus` · **phòng:** 60 × 72 × 12 m · **tường:** customWalls + bright (sân trời)
- **File được sửa:** `parts/interiors/school.js` · NPC dưới `/* ===== NPC: school` (lessons.js) · từ vựng trong `school: [` (places.js). Không sửa index.html, CITY, nơi khác.
- **Phần làm dở:** wip/school/ (interiors_school.js đã ~320 dòng + data.patch có sẵn NPC và từ vựng – dùng tiếp, sửa cho đạt QA)

## Hình ảnh
Trường kiểu Pháp ở Sài Gòn (Lê Hồng Phong, Lê Quý Đôn, Hồng Bàng, Marie Curie): tường vàng, viền trắng, cửa chớp xanh, hành lang vòm 2 tầng, mái ngói đỏ. Giữa là sân trường lộ trời: cây phượng/bàng lớn, cột cờ chào cờ thứ Hai, trống trường trên giá gỗ, ghế đá, bảng tin. Quanh sân: lớp học, phòng thí nghiệm, phòng máy tính, phòng nhạc, phòng mỹ thuật, thư viện trường, căng tin, sân thể thao, phòng hiệu trưởng, phòng y tế.

## NPC
≥ 12 NPC mới (giáo viên các môn, thầy thể dục, hiệu trưởng Lv.5, thủ thư trường, cô căng tin, bác bảo vệ, cô y tế, vài học sinh) + dời Ms. Hoa – Teacher vào lớp học. Chủ đề: May I come in?, How do you spell…?, môn học yêu thích, thời khoá biểu, Can I borrow…?, nội quy, thể thao.

## Từ vựng
~50 từ: đồ dùng học tập, phòng học, môn học, sân trường. Tên khu (`at` / `P.anchors`) thống nhất: **yard, classroom, lab, computer, music, art, library, canteen, sports, office**.

## Tiêu chí đạt
`node tools/qa/run.js school` → ✅ ĐẠT, không cảnh báo về `school` · `node tools/qa/shot.js school` nhìn đúng tinh thần ảnh tham khảo · đọc `docs/KIT.md` trước, KHÔNG đọc index.html / museum.js trừ khi thật cần.

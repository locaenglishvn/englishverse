/* EnglishVerse – danh bạ các phần tách file (nạp TRƯỚC script chính của index.html).
   Mỗi file trong parts/interiors/ tự đăng ký: INTERIORS["<layout>"] = { furnish, wall?, customWalls?, bright? }
     furnish(P, g, cx, cz, W, D, fur): dựng nội thất, PHẢI đặt P.anchors (chỗ bày từ vựng) và P.vgroup
     wall(len, h, { x, z }): (tuỳ chọn) chất liệu cho 4 bức tường mặc định
     customWalls: true  → không dựng 4 tường/cửa/bảng tên mặc định (nơi tự dựng tường riêng)
     bright: true       → trong phòng sáng hơn, nền trời (nơi có mái kính / giếng trời)
   Mỗi file trong parts/exteriors/ tự đăng ký: EXTERIORS_EXTRA["<tên>"] = function (g, P) { … return { solids, door, map }; }
     rồi ghi exterior: "<tên>" vào nơi đó trong places.js → CITY.
   Thêm file mới: thêm 1 dòng <script src="parts/…"> trong index.html (ngay sau dòng nạp registry.js). */
const INTERIORS = {};
const EXTERIORS_EXTRA = {};

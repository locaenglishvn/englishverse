/* EnglishVerse – BỘ KHUNG GIAO DIỆN (chủ dự án chốt 16/11, docs/design/playtest-1611.html mục 11).
   Phong cách: nền xanh đêm, góc vát chéo, viền kim loại vàng, có khối nổi (sáng phía trên, bóng đổ phía dưới).
   Mọi bảng / thanh / nút mới DÙNG LẠI các lớp dưới đây, không tự chế màu riêng.
   Lớp dùng chung:
   .ev-panel        bảng góc vát, viền vàng, nổi (bọc nội dung trong <div class="ev-in">)
   .ev-btn          nút chữ góc vát vàng, nổi; thêm .alt = nút phụ (xanh tím), .ok = xanh lá, .bad = đỏ
   .ev-round        nút tròn nổi có vòng viền kim loại (nút chiêu); đặt màu nhánh bằng style="--c:#e5484d"
   .ev-bar          thanh xiên có vạch chia: <div class="ev-bar hp"><i style="width:70%"></i><em>❤️ 108/155</em></div>  (hp · mp · xp · know)
   .ev-slot         ô vật phẩm góc vát; thêm .r-common/.r-uncommon/.r-rare/.r-epic/.r-legendary để có viền màu độ hiếm
   .ev-tag          nhãn chữ nổi nhỏ (vd loại bài REPEAT / ANSWER)
   .ev-title        tiêu đề bảng (phông Chakra Petch)
   Biến màu: --ev-bg --ev-bg2 --ev-panel --ev-line --ev-fg --ev-mut --ev-gold --ev-gold2 --ev-hp --ev-mp --ev-xp --ev-know --ev-ok --ev-bad
   Màu nhánh kỹ năng: --ev-power --ev-control --ev-harmony --ev-rhythm */
(function () {
  try { const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&display=swap"; document.head.appendChild(l); } catch (e) {}
  const css = `
:root{--ev-bg:#141a2e;--ev-bg2:#1b2340;--ev-panel:#222c4f;--ev-line:#3a4677;--ev-fg:#eef1fb;--ev-mut:#a3abc9;--ev-gold:#ffc94a;--ev-gold2:#c9842a;
--ev-hp:#ff4f5e;--ev-mp:#3fa3ff;--ev-xp:#ffc94a;--ev-know:#b07cff;--ev-ok:#3fd68c;--ev-bad:#ff6b6b;
--ev-power:#ff5a5f;--ev-control:#4b8dff;--ev-harmony:#33c172;--ev-rhythm:#ff8a2a;
--ev-font:"Chakra Petch",system-ui,-apple-system,"Segoe UI",sans-serif;
--ev-cut:12px;--ev-chamf:polygon(var(--ev-cut) 0,100% 0,100% calc(100% - var(--ev-cut)),calc(100% - var(--ev-cut)) 100%,0 100%,0 var(--ev-cut))}
.ev-title{font:700 17px var(--ev-font);letter-spacing:.02em;color:var(--ev-fg)}
.ev-panel{position:relative;padding:2px;background:linear-gradient(150deg,#ffe28a,var(--ev-gold2) 22%,#3a4677 45%,#3a4677 62%,var(--ev-gold2) 85%,#ffe28a);clip-path:var(--ev-chamf);filter:drop-shadow(0 6px 0 rgba(0,0,0,.35)) drop-shadow(0 10px 18px rgba(0,0,0,.35))}
.ev-panel>.ev-in{background:linear-gradient(180deg,#2a3560 0,var(--ev-bg2) 40%,var(--ev-bg) 100%);clip-path:var(--ev-chamf);color:var(--ev-fg);padding:12px 14px;box-shadow:inset 0 1px 0 rgba(255,255,255,.18)}
.ev-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border:0;font:700 14px var(--ev-font);color:#2a1a00;padding:8px 16px;
  background:linear-gradient(180deg,#ffe9a8 0,var(--ev-gold) 45%,#e0a12e 100%);clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);
  filter:drop-shadow(0 3px 0 #8a5a12);text-shadow:0 1px 0 rgba(255,255,255,.5);transition:transform .08s}
.ev-btn:active{transform:translateY(2px);filter:drop-shadow(0 1px 0 #8a5a12)}
.ev-btn.alt{background:linear-gradient(180deg,#5d6ca8 0,#3a4677 55%,#2c365f 100%);color:var(--ev-fg);filter:drop-shadow(0 3px 0 #161c33);text-shadow:0 1px 0 rgba(0,0,0,.4)}
.ev-btn.ok{background:linear-gradient(180deg,#9ff0c4 0,var(--ev-ok) 50%,#22a565 100%);filter:drop-shadow(0 3px 0 #136b40)}
.ev-btn.bad{background:linear-gradient(180deg,#ffb0b0 0,var(--ev-bad) 50%,#d43d3d 100%);color:#fff;filter:drop-shadow(0 3px 0 #7d1f1f)}
.ev-btn:disabled{opacity:.5;filter:none}
.ev-round{--c:#e5484d;position:relative;border:0;border-radius:50%;color:#fff;display:grid;place-items:center;
  background:radial-gradient(circle at 50% 30%,rgba(255,255,255,.55) 0,rgba(255,255,255,0) 45%),radial-gradient(circle at 50% 120%,rgba(0,0,0,.35),rgba(0,0,0,0) 60%),var(--c);
  box-shadow:0 0 0 3px #1b2340,0 0 0 5px var(--ev-gold),0 0 0 6px #7a5212,0 5px 0 6px rgba(0,0,0,.35),inset 0 -4px 6px rgba(0,0,0,.35),inset 0 3px 4px rgba(255,255,255,.35);
  text-shadow:0 2px 2px rgba(0,0,0,.4);transition:transform .08s}
.ev-round:active{transform:translateY(2px) scale(.97)}
.ev-bar{position:relative;height:14px;background:linear-gradient(180deg,#0b1024,#1b2340);clip-path:polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%);box-shadow:inset 0 0 0 1px rgba(255,255,255,.15)}
.ev-bar>i{position:absolute;inset:0 auto 0 0;display:block;transition:width .2s;box-shadow:inset 0 2px 0 rgba(255,255,255,.45),inset 0 -3px 0 rgba(0,0,0,.25)}
.ev-bar::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 calc(10% - 1px),rgba(0,0,0,.35) calc(10% - 1px) 10%);pointer-events:none}
.ev-bar>em{position:absolute;left:9px;top:0;line-height:14px;font:700 10px var(--ev-font);font-style:normal;color:#fff;text-shadow:0 1px 2px #000;z-index:1;white-space:nowrap}
.ev-bar.hp>i{background:linear-gradient(180deg,#ff8a93,var(--ev-hp) 60%,#c42f3d)}
.ev-bar.mp>i{background:linear-gradient(180deg,#8fd0ff,var(--ev-mp) 60%,#1f6fc4)}
.ev-bar.xp>i{background:linear-gradient(180deg,#ffe9a8,var(--ev-xp) 60%,#c9842a)}
.ev-bar.know>i{background:linear-gradient(180deg,#d9bfff,var(--ev-know) 60%,#7340c4)}
.ev-bar.lock>i{filter:saturate(.3) brightness(.8)}
.ev-slot{position:relative;display:grid;place-items:center;border:0;color:var(--ev-fg);background:linear-gradient(180deg,#2f3a68,var(--ev-panel));clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px);box-shadow:inset 0 0 0 2px #3a4677,inset 0 2px 0 rgba(255,255,255,.12)}
.ev-slot.r-common{box-shadow:inset 0 0 0 2px #c9cfe0}.ev-slot.r-uncommon{box-shadow:inset 0 0 0 2px #40c057}.ev-slot.r-rare{box-shadow:inset 0 0 0 2px #339af0}
.ev-slot.r-epic{box-shadow:inset 0 0 0 2px #9775fa}.ev-slot.r-legendary{box-shadow:inset 0 0 0 2px #fab005,inset 0 0 12px rgba(250,176,5,.45)}
.ev-tag{display:inline-block;font:700 11px var(--ev-font);letter-spacing:.08em;text-transform:uppercase;color:#fff;padding:2px 9px;background:linear-gradient(180deg,rgba(255,255,255,.3),rgba(255,255,255,0) 60%),var(--c,#3a4677);clip-path:polygon(5px 0,100% 0,calc(100% - 5px) 100%,0 100%);filter:drop-shadow(0 2px 0 rgba(0,0,0,.35))}
`;
  const s = document.createElement("style"); s.id = "evTheme"; s.textContent = css; document.head.appendChild(s);
})();

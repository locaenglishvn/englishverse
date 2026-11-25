/* KIỂU TÓC nhân vật chính (25/11) – chọn lúc tạo nhân vật, chỉ để đẹp. Màu tóc chọn tự do bằng code (đổi màu vùng tóc trên ảnh).
   Cách làm (đã thử kỹ thuật đổi đầu – tools/tripo/swap-demo): Gemini vẽ CHÍNH Voice Guard với kiểu tóc mới, giữ mặt + đồ →
   Tripo dựng + gắn xương (~$0,75) → game chỉ lấy vùng ĐẦU (ASSEMBLE.rigid) ghép lên nhân vật. Không đeo tai nghe để mũ / tai nghe là món rời.
   Thử 25/11: Tripo text-to-3D tóc rời luôn kèm đầu ma-nơ-canh, tách phần (mesh segmentation) trộn tóc với đầu → không dùng. */
window.HAIR_STYLE = {
  m: "Edit the attached boy (Voice Guard, male). Keep EXACTLY the same face, body, outfit, proportions, A-pose and art style. REMOVE the headset and microphone completely. Change ONLY his hairstyle to: ",
  f: "Edit the attached girl (Voice Guard, female). Keep EXACTLY the same face, body, outfit, proportions, A-pose and art style. REMOVE the headset and microphone completely. Change ONLY her hairstyle to: ",
  tail: " Hair in a natural dark color (it will be recolored in game). Full body, front view, plain light grey background, no text."
};
window.HAIRSTYLES = {
  m: [
    ["Mặc định (gốc, bỏ tai nghe)", "his current messy short hair, unchanged."],
    ["Undercut vuốt ngược", "a sharp undercut: short shaved sides, longer top swept back with volume."],
    ["Tóc gai anime", "spiky anime hero hair: layered spikes pointing up and back, a few bangs over the forehead."],
    ["Mái dài rủ (Hàn)", "a soft Korean two-block cut: longer straight bangs over the eyebrows, short sides."],
    ["Buộc đuôi ngựa ngắn (kiếm sĩ)", "shoulder-length hair tied in a small low ponytail, a few loose strands framing the face, samurai style."],
    ["Xoăn bồng", "short thick curly hair with volume on top."]
  ],
  f: [
    ["Mặc định (tóc dài, bỏ tai nghe)", "her current long straight hair with side bangs and the small pink hair clip, unchanged."],
    ["Đuôi ngựa cao", "a high sporty ponytail with side bangs."],
    ["Hai bím tóc", "two long braids over the shoulders, straight bangs."],
    ["Tóc ngắn bob", "a cute chin-length bob with side-swept bangs."],
    ["Búi củ hành hai bên", "twin space buns on top of the head, short bangs."],
    ["Tóc dài gợn sóng", "long wavy hair past the shoulders, center part."]
  ]
};

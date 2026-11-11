/* ===== 1. DỮ LIỆU BÀI HỌC (sửa phần này để đổi nội dung, không cần đụng code) ===== */
/* x, z = vị trí NPC trên bản đồ. Nếu có place: "id" (id trong places.js) thì NPC đứng TRONG nhà đó,
   và x, z tính từ giữa phòng (z âm = phía quầy).
   Mỗi bước có thể có "card": trả lời đúng bước đó thì người chơi nhận thẻ từ vựng.
   w = từ/cụm từ, pic = hình (emoji), ex = câu ví dụ. */
const LESSONS = [
{
  name: "Mia – Barista", color: 0xe03131, place: "cafe", x: 0, z: -3.6,
  steps: [
    { say: "Hi! Welcome to Sunny Café. What would you like to drink?",
      card: { w: "I’d like…", pic: "☕", ex: "I’d like a coffee, please." },
      choices: [
        { t: "I’d like a coffee, please.", ok: true,  fb: "Great! Polite and natural. +10" },
        { t: "Give me coffee.",            ok: false, fb: "Understandable, but a bit rude. Try “I’d like…”" },
        { t: "Coffee is I want.",          ok: false, fb: "Word order: say “I want coffee.”" } ] },
    { say: "Sure! Would you like it hot or iced?",
      card: { w: "iced", pic: "🧊", ex: "Iced coffee, please." },
      choices: [
        { t: "Iced, please.",      ok: true,  fb: "Perfect! Short and polite. +10" },
        { t: "I am cold coffee.",  ok: false, fb: "That means YOU are cold! Say “iced coffee.”" },
        { t: "Yesterday.",         ok: false, fb: "That answers a different question." } ] },
    { say: "That’s 40,000 dong. Here you go!",
      card: { w: "Thank you very much!", pic: "🙏", ex: "Thank you very much!" },
      choices: [
        { t: "Thank you very much!", ok: true,  fb: "Lovely! +10" },
        { t: "Bye bye.",             ok: false, fb: "Don’t forget to say thanks first :)" },
        { t: "No.",                  ok: false, fb: "Hmm, try “Thank you!”" } ] }
  ]
},
{
  name: "Tom – Tourist", color: 0x2b8a3e, x: -4, z: 20,
  steps: [
    { say: "Excuse me! Is there a train station near here?",
      card: { w: "train station", pic: "🚉", ex: "The train station is near here." },
      choices: [
        { t: "Yes, it’s about five minutes from here.", ok: true,  fb: "Clear and helpful! +10" },
        { t: "Yes, station is near here.",              ok: false, fb: "Almost! Say “the station is near here.”" },
        { t: "I like trains.",                          ok: false, fb: "Nice, but he asked for directions." } ] },
    { say: "Great! How do I get there?",
      card: { w: "turn left", pic: "⬅️", ex: "Go straight, then turn left." },
      choices: [
        { t: "Go straight, then turn left.", ok: true,  fb: "Perfect directions! +10" },
        { t: "Straight go and left turn.",   ok: false, fb: "Natural order: “Go straight, then turn left.”" },
        { t: "You are there.",               ok: false, fb: "Not quite. He needs directions." } ] },
    { say: "Thank you so much! You’re very kind.",
      card: { w: "You’re welcome!", pic: "😊", ex: "You’re welcome!" },
      choices: [
        { t: "You’re welcome!",           ok: true,  fb: "Perfect! +10" },
        { t: "Yes, I am kind.",           ok: false, fb: "Funny, but say “You’re welcome!”" },
        { t: "No problem at all.",        ok: true,  fb: "Also great, very natural! +10" } ] }
  ]
}
];

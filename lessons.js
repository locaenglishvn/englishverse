/* ===== 1. DỮ LIỆU BÀI HỌC (sửa phần này để đổi nội dung, không cần đụng code) ===== */
/* x, z = vị trí NPC trên bản đồ. Nếu có place: "id" (id trong places.js) thì NPC đứng TRONG nhà đó,
   và x, z tính từ giữa phòng (z âm = phía quầy).
   Mỗi bước có thể có "card": trả lời đúng bước đó thì người chơi nhận thẻ từ vựng.
   w = từ/cụm từ, pic = hình (emoji), ex = câu ví dụ. */
const LESSONS = [
{
  name: "Mia – Barista", color: 0xe03131, place: "cafe", x: 0, z: -16.7,
  steps: [
    { say: "Hi! Welcome to Cafe Sua Da. What would you like to drink?",
      card: { w: "I’d like…", pic: "☕", ex: "I’d like a coffee, please." },
      q: { w: "What would you like…?", pic: "🙋", ex: "What would you like to drink?" },
      choices: [
        { t: "I’d like a coffee, please.", ok: true,  fb: "Great! Polite and natural. +10" },
        { t: "Give me coffee.",            ok: false, fb: "Understandable, but a bit rude. Try “I’d like…”" },
        { t: "Coffee is I want.",          ok: false, fb: "Word order: say “I want coffee.”" } ] },
    { say: "Sure! Would you like it hot or iced?",
      card: { w: "iced", pic: "🧊", ex: "Iced coffee, please." },
      q: { w: "Hot or iced?", pic: "🌡️", ex: "Would you like it hot or iced?" },
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
  name: "Tom – Tourist", color: 0x2b8a3e, x: -4, z: 30,
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
/* ===== NPC Ở CÁC ĐỊA ĐIỂM MỚI (mỗi nơi một người, dạy mẫu câu dùng ở nơi đó) =====
   Có place: "id" → đứng trong nhà đó (x, z tính từ giữa phòng). Không có place → đứng ngoài trời tại x, z. */
,{
  name: "Ms. Hoa – Teacher", color: 0x1971c2, place: "school", x: -3, z: -13,
  steps: [
    { say: "Good morning, class! Please open your books to page ten.",
      card: { w: "page", pic: "📖", ex: "Open your book to page ten." },
      choices: [
        { t: "Sorry, which page?",  ok: true,  fb: "Great! Asking again is smart. +10" },
        { t: "Book is open me.",    ok: false, fb: "Say “My book is open.”" },
        { t: "I am page ten.",      ok: false, fb: "You are not a page :) Try “Which page?”" } ] },
    { say: "Page ten. Can you read the first sentence for me?",
      card: { w: "sentence", pic: "📝", ex: "I can read the first sentence." },
      choices: [
        { t: "Sure. I’ll try my best.",  ok: true,  fb: "Brave! Trying is how we learn. +10" },
        { t: "No. I am shy always.",     ok: false, fb: "It’s OK to be shy. Try: “Sure, I’ll try.”" },
        { t: "Yes, I read yesterday.",   ok: false, fb: "She means now. Say “Sure, I’ll try.”" } ] },
    { say: "Well done! Do you have any questions?",
      card: { w: "question", pic: "❓", ex: "Can I ask a question?" },
      choices: [
        { t: "Yes. What does this word mean?", ok: true,  fb: "Perfect question! +10" },
        { t: "Question is me no.",             ok: false, fb: "Say “No, I don’t have any questions.”" },
        { t: "Mean word what?",                ok: false, fb: "Word order: “What does this word mean?”" } ] }
  ]
},
{
  name: "Leo – Museum Guide", color: 0x5c5f66, place: "museum", x: -3.8, z: 18,
  steps: [
    { say: "Welcome to the City Museum! This dinosaur is sixty-six million years old.",
      card: { w: "dinosaur", pic: "🦖", ex: "This dinosaur is very old." },
      choices: [
        { t: "Wow! That’s really old!",       ok: true,  fb: "Great reaction! +10" },
        { t: "It is old very.",               ok: false, fb: "Say “It is very old.”" },
        { t: "How old are you?",              ok: false, fb: "Ha! Ask about the dinosaur, not Leo." } ] },
    { say: "Please don’t touch the bones. Do you have any questions?",
      card: { w: "Don’t touch.", pic: "🚫", ex: "Please don’t touch the bones." },
      choices: [
        { t: "Can I take a photo?",    ok: true,  fb: "Polite and useful! +10" },
        { t: "I touch it now.",        ok: false, fb: "He said don’t touch! Ask “Can I take a photo?”" },
        { t: "Photo me can?",          ok: false, fb: "Word order: “Can I take a photo?”" } ] },
    { say: "Yes, you can. But no flash, please.",
      card: { w: "museum", pic: "🏛️", ex: "I love the city museum." },
      choices: [
        { t: "OK. Thanks for the tour!", ok: true,  fb: "Lovely! +10" },
        { t: "Flash is good.",           ok: false, fb: "He said no flash. Say “OK, thanks!”" },
        { t: "Bye.",                     ok: false, fb: "Say thank you first :)" } ] }
  ]
},
{
  name: "Ms. Green – Librarian", color: 0x364fc7, place: "library", x: 0, z: 0,
  steps: [
    { say: "Shh… Hello! Can I help you?",
      card: { w: "borrow", pic: "📚", ex: "I’d like to borrow this book." },
      choices: [
        { t: "Yes, please. I’d like to borrow this book.", ok: true,  fb: "Perfect! +10" },
        { t: "Give book.",                                 ok: false, fb: "Too short. Try “I’d like to borrow…”" },
        { t: "I want to lend a book.",                     ok: false, fb: "“Lend” = cho mượn. You want to BORROW." } ] },
    { say: "Sure. Do you have a library card?",
      card: { w: "library card", pic: "🪪", ex: "Here is my library card." },
      choices: [
        { t: "Yes. Here you are.",   ok: true,  fb: "Great! +10" },
        { t: "Yes, I have it card.", ok: false, fb: "Say “Yes, I have one.”" },
        { t: "I am a card.",         ok: false, fb: "Ha! Say “Here you are.”" } ] },
    { say: "Thank you. Please bring it back in two weeks.",
      card: { w: "two weeks", pic: "📅", ex: "I’ll bring it back in two weeks." },
      choices: [
        { t: "OK, I will. Thank you!",  ok: true,  fb: "Lovely! +10" },
        { t: "I will bring it before.", ok: false, fb: "Nearly. Say “OK, I will.”" },
        { t: "Two weeks is me.",        ok: false, fb: "Hmm. Try “OK, I will. Thank you!”" } ] }
  ]
},
{
  name: "Linh – Bank Teller", color: 0x1b5e3b, place: "bank", x: 0, z: -10.3,
  steps: [
    { say: "Good afternoon! How can I help you today?",
      card: { w: "save money", pic: "🐷", ex: "I want to save money." },
      choices: [
        { t: "I’d like to open an account, please.", ok: true,  fb: "Excellent! +10" },
        { t: "Money give me.",                       ok: false, fb: "Ha! Try “I’d like to open an account.”" },
        { t: "I am a bank.",                         ok: false, fb: "You are a customer :)" } ] },
    { say: "Sure. Can I see your ID card, please?",
      card: { w: "ID card", pic: "🪪", ex: "Here is my ID card." },
      choices: [
        { t: "Here you are.",     ok: true,  fb: "Natural! +10" },
        { t: "You can see.",      ok: false, fb: "Say “Here you are.” and give it." },
        { t: "ID is good card.",  ok: false, fb: "Try “Here you are.”" } ] },
    { say: "Thank you. How much money would you like to put in?",
      card: { w: "How much…?", pic: "💰", ex: "How much is it?" },
      choices: [
        { t: "Fifty coins, please.",  ok: true,  fb: "Clear! +10" },
        { t: "Much money is many.",   ok: false, fb: "Give a number: “Fifty coins, please.”" },
        { t: "Yes.",                  ok: false, fb: "She asked how much. Give a number." } ] }
  ]
},
{
  name: "Mr. Brown – Postman", color: 0xe8590c, place: "post", x: -10.9, z: -10,
  steps: [
    { say: "Hello! Do you want to send something?",
      q: { w: "Do you want to…?", pic: "🙋", ex: "Do you want to send something?" },
      card: { w: "send a letter", pic: "✉️", ex: "I want to send a letter." },
      choices: [
        { t: "Yes. I want to send this letter to Hanoi.", ok: true,  fb: "Clear and complete! +10" },
        { t: "Letter go Hanoi.",                          ok: false, fb: "Say “I want to send this letter to Hanoi.”" },
        { t: "I want to eat a letter.",                   ok: false, fb: "Haha, letters are not food!" } ] },
    { say: "OK. You need a stamp. It’s three coins.",
      card: { w: "stamp", pic: "📮", ex: "Can I have a stamp, please?" },
      choices: [
        { t: "Here you are. Three coins.", ok: true,  fb: "Great! +10" },
        { t: "Stamp is expensive me.",     ok: false, fb: "Say “It’s expensive!” or just pay :)" },
        { t: "Three coins is stamp.",      ok: false, fb: "Try “Here you are.”" } ] },
    { say: "Thanks! It will arrive in two days.",
      card: { w: "arrive", pic: "📬", ex: "The letter will arrive in two days." },
      choices: [
        { t: "Great. Thank you very much!", ok: true,  fb: "Polite! +10" },
        { t: "I arrive two days.",          ok: false, fb: "The LETTER arrives, not you :)" },
        { t: "No thank.",                   ok: false, fb: "Say “Thank you!”" } ] }
  ]
},
{
  name: "Dr. Nova – Scientist", color: 0x0b7285, place: "lab", x: 0, z: -3.6,
  steps: [
    { say: "Welcome to the lab! First, put on your safety goggles.",
      card: { w: "safety goggles", pic: "🥽", ex: "Put on your safety goggles." },
      choices: [
        { t: "OK. I’m wearing them now.", ok: true,  fb: "Safe scientist! +10" },
        { t: "Goggles are on me put.",    ok: false, fb: "Say “I’m wearing them now.”" },
        { t: "No, I like danger.",        ok: false, fb: "Safety first! Put them on :)" } ] },
    { say: "Good. Now, what happens when we mix water and oil?",
      card: { w: "mix", pic: "🧪", ex: "Let’s mix water and oil." },
      choices: [
        { t: "I think they don’t mix.", ok: true,  fb: "Correct! Oil floats on water. +10" },
        { t: "They become juice.",      ok: false, fb: "Not juice :) Oil and water don’t mix." },
        { t: "Mix is happen.",          ok: false, fb: "Try “I think they don’t mix.”" } ] },
    { say: "Exactly! Oil is lighter, so it floats. Great thinking!",
      card: { w: "float", pic: "🛟", ex: "Oil floats on water." },
      choices: [
        { t: "Science is fun!",          ok: true,  fb: "Yes it is! +10" },
        { t: "I am float.",              ok: false, fb: "Say “Oil floats!”" },
        { t: "Thinking is great me.",    ok: false, fb: "Try “Thank you!” or “Science is fun!”" } ] }
  ]
},
{
  name: "Hank – Mechanic", color: 0x495057, place: "workshop", x: 0, z: -3.6,
  steps: [
    { say: "Hi there! What’s the problem?",
      card: { w: "flat tire", pic: "🚲", ex: "My bike has a flat tire." },
      choices: [
        { t: "My bike has a flat tire.", ok: true,  fb: "Clear! +10" },
        { t: "Bike is problem.",         ok: false, fb: "Be specific: “My bike has a flat tire.”" },
        { t: "I have a flat head.",      ok: false, fb: "Ha! Your BIKE has a flat tire." } ] },
    { say: "No problem. I can fix it. Come back in one hour.",
      card: { w: "fix", pic: "🔧", ex: "Can you fix my bike?" },
      choices: [
        { t: "How much will it cost?", ok: true,  fb: "Smart question! +10" },
        { t: "One hour is long me.",   ok: false, fb: "Say “That’s a long time!”" },
        { t: "Fix you me.",            ok: false, fb: "Try “How much will it cost?”" } ] },
    { say: "Just five coins. See you later!",
      card: { w: "See you later!", pic: "👋", ex: "See you later!" },
      choices: [
        { t: "See you later. Thanks!", ok: true,  fb: "Natural! +10" },
        { t: "Later you see.",         ok: false, fb: "Say “See you later!”" },
        { t: "Five is coins.",         ok: false, fb: "Try “Thanks! See you later.”" } ] }
  ]
},
{
  name: "Officer Ben – Police Officer", color: 0x1864ab, place: "police", x: 0, z: -3.6,
  steps: [
    { say: "Hello. Is everything OK?",
      card: { w: "lost", pic: "🔍", ex: "I lost my wallet." },
      choices: [
        { t: "I lost my wallet.",      ok: true,  fb: "Clear! +10" },
        { t: "My wallet is lose.",     ok: false, fb: "Say “I lost my wallet.”" },
        { t: "Everything is police.",  ok: false, fb: "Hmm. Tell him your problem." } ] },
    { say: "I’m sorry. Where did you last see it?",
      card: { w: "Where did you…?", pic: "📍", ex: "Where did you last see it?" },
      choices: [
        { t: "I think it was in the park.", ok: true,  fb: "Helpful! +10" },
        { t: "It was in yesterday.",        ok: false, fb: "He asked WHERE. Name a place." },
        { t: "Park in it was.",             ok: false, fb: "Word order: “It was in the park.”" } ] },
    { say: "OK. What color is it?",
      card: { w: "What color…?", pic: "🎨", ex: "It’s a brown wallet." },
      choices: [
        { t: "It’s small and brown.",   ok: true,  fb: "Perfect description! +10" },
        { t: "Color is wallet.",        ok: false, fb: "Say “It’s brown.”" },
        { t: "I like blue.",            ok: false, fb: "Describe the wallet, not your favourite color :)" } ] }
  ]
},
{
  name: "Captain Rosa – Firefighter", color: 0xc92a2a, place: "fire", x: 0, z: -3.6,
  steps: [
    { say: "Hi! Do you know the fire number in Vietnam?",
      card: { w: "emergency", pic: "🚨", ex: "In an emergency, call 114." },
      choices: [
        { t: "Yes. It’s one one four.", ok: true,  fb: "Correct! 114 = fire. +10" },
        { t: "It’s one one one.",       ok: false, fb: "Not quite. Fire is 114." },
        { t: "Fire is hot.",            ok: false, fb: "True, but she asked the number :)" } ] },
    { say: "Great! If there is smoke, what should you do?",
      card: { w: "smoke", pic: "💨", ex: "Stay low under the smoke." },
      choices: [
        { t: "Stay low and get out fast.", ok: true,  fb: "Life-saving answer! +10" },
        { t: "Hide under the bed.",        ok: false, fb: "No! Get out of the building." },
        { t: "Smoke is fly.",              ok: false, fb: "Try “Stay low and get out.”" } ] },
    { say: "Exactly. Never go back inside for your things.",
      card: { w: "safe", pic: "✅", ex: "Stay safe!" },
      choices: [
        { t: "OK. Safety first!",       ok: true,  fb: "Yes! +10" },
        { t: "I go back for my phone.", ok: false, fb: "Never go back! Your life is more important." },
        { t: "Things are back.",        ok: false, fb: "Say “OK, safety first!”" } ] }
  ]
},
{
  name: "Mr. Tan – Bus Driver", color: 0xf59f00, x: 26, z: 74.5,
  steps: [
    { say: "Hello! Where are you going?",
      card: { w: "bus", pic: "🚌", ex: "Does this bus go to the zoo?" },
      choices: [
        { t: "Does this bus go to the zoo?", ok: true,  fb: "Perfect question! +10" },
        { t: "Bus go zoo?",                  ok: false, fb: "Say “Does this bus go to the zoo?”" },
        { t: "I am going a bus.",            ok: false, fb: "Try “I’m going to the zoo.”" } ] },
    { say: "Yes, it does. A ticket is two coins.",
      card: { w: "ticket", pic: "🎫", ex: "One ticket, please." },
      choices: [
        { t: "One ticket, please.", ok: true,  fb: "Natural! +10" },
        { t: "Ticket me two.",      ok: false, fb: "Say “One ticket, please.”" },
        { t: "It’s free?",          ok: false, fb: "He said two coins :)" } ] },
    { say: "Here you go. Please hold on tight!",
      card: { w: "hold on", pic: "✊", ex: "Hold on tight!" },
      choices: [
        { t: "OK, thank you!",     ok: true,  fb: "+10" },
        { t: "I hold the driver.", ok: false, fb: "Hold the handle, not the driver! :)" },
        { t: "Tight is good.",     ok: false, fb: "Say “OK, thank you!”" } ] }
  ]
},
{
  name: "Aunt Lan – Fruit Seller", color: 0xd9480f, x: 120, z: 4.5,
  steps: [
    { say: "Fresh mangoes! Very sweet! Do you want some?",
      card: { w: "mango", pic: "🥭", ex: "These mangoes are very sweet." },
      choices: [
        { t: "How much are the mangoes?", ok: true,  fb: "Good! Always ask the price. +10" },
        { t: "How many is mango?",        ok: false, fb: "For price: “How MUCH are the mangoes?”" },
        { t: "I am sweet.",               ok: false, fb: "Haha. Ask the price!" } ] },
    { say: "Twenty coins for a kilo.",
      card: { w: "a bit expensive", pic: "🤏", ex: "That’s a bit expensive." },
      choices: [
        { t: "That’s a bit expensive. Fifteen?", ok: true,  fb: "Nice bargaining! +10" },
        { t: "Expensive you are.",               ok: false, fb: "Be polite: “That’s a bit expensive.”" },
        { t: "OK, fifty coins.",                 ok: false, fb: "That’s MORE money! Try fifteen :)" } ] },
    { say: "Hmm… OK, seventeen. Deal?",
      card: { w: "Deal!", pic: "🤝", ex: "OK, deal!" },
      choices: [
        { t: "Deal! Thank you.",  ok: true,  fb: "You did it! +10" },
        { t: "No deal never.",    ok: false, fb: "She was kind. Say “Deal!”" },
        { t: "Seventeen is me.",  ok: false, fb: "Say “Deal! Thank you.”" } ] }
  ]
},
{
  name: "Zoe – Zookeeper", color: 0x5c940d, x: 80, z: 68,
  steps: [
    { say: "Welcome to the zoo! Which animal do you want to see?",
      card: { w: "elephant", pic: "🐘", ex: "I want to see the elephants." },
      choices: [
        { t: "I want to see the elephants.", ok: true,  fb: "Great choice! +10" },
        { t: "Elephant see want I.",         ok: false, fb: "Word order: “I want to see the elephants.”" },
        { t: "I am an animal.",              ok: false, fb: "Haha! Choose an animal to see." } ] },
    { say: "The elephants are next to the giraffes. Please don’t feed them!",
      card: { w: "next to", pic: "↔️", ex: "The elephants are next to the giraffes." },
      choices: [
        { t: "OK. What do they eat?",   ok: true,  fb: "Curious mind! +10" },
        { t: "I feed them my bread.",   ok: false, fb: "She said don’t feed them!" },
        { t: "Giraffe is next me.",     ok: false, fb: "Try “What do they eat?”" } ] },
    { say: "They eat grass, fruit and leaves. A lot every day!",
      card: { w: "leaves", pic: "🍃", ex: "Elephants eat leaves." },
      choices: [
        { t: "Wow! Thank you, Zoe!",   ok: true,  fb: "+10" },
        { t: "I eat leaves too.",      ok: false, fb: "Really? :) Say “Thank you!”" },
        { t: "Every day is a lot.",    ok: false, fb: "Try “Wow! Thank you!”" } ] }
  ]
},
{
  name: "Farmer Joe – Farmer", color: 0x8d5a2b, x: -80, z: 68,
  steps: [
    { say: "Good morning! Can you help me water the vegetables?",
      card: { w: "water the plants", pic: "🪴", ex: "I water the plants every morning." },
      choices: [
        { t: "Of course! I’d love to help.", ok: true,  fb: "So kind! +10" },
        { t: "Water is me help.",            ok: false, fb: "Say “Of course! I can help.”" },
        { t: "No. Vegetables are bad.",      ok: false, fb: "Vegetables are good for you!" } ] },
    { say: "Thanks! These are carrots and those are tomatoes.",
      card: { w: "carrot", pic: "🥕", ex: "These are carrots." },
      choices: [
        { t: "When can we pick them?",  ok: true,  fb: "Good question! +10" },
        { t: "These are tomato carrot.", ok: false, fb: "Hmm. Ask “When can we pick them?”" },
        { t: "Pick when we?",            ok: false, fb: "Word order: “When can we pick them?”" } ] },
    { say: "Next month! I’ll give you some. Come back soon!",
      card: { w: "next month", pic: "🗓️", ex: "See you next month!" },
      choices: [
        { t: "Thanks, Joe! See you next month.", ok: true,  fb: "+10" },
        { t: "Month is next.",                   ok: false, fb: "Say “See you next month!”" },
        { t: "Give me now.",                     ok: false, fb: "Be patient :) Say thank you." } ] }
  ]
},
{
  name: "Coach Kai – Coach", color: 0xe03131, x: 0, z: -94,
  steps: [
    { say: "Hey! Before we play, we need to warm up. Are you ready?",
      card: { w: "warm up", pic: "🤸", ex: "Let’s warm up before we play." },
      choices: [
        { t: "Yes, I’m ready!",    ok: true,  fb: "Let’s go! +10" },
        { t: "I am warm already.", ok: false, fb: "Warm up = khởi động. Say “I’m ready!”" },
        { t: "Ready is me.",       ok: false, fb: "Say “I’m ready!”" } ] },
    { say: "Great! What sport do you like best?",
      card: { w: "football", pic: "⚽", ex: "I like football best." },
      choices: [
        { t: "I like football best.",  ok: true,  fb: "Me too! +10" },
        { t: "Sport is like me.",      ok: false, fb: "Say “I like football best.”" },
        { t: "I like sleeping best.",  ok: false, fb: "Haha. That’s not a sport!" } ] },
    { say: "Cool! Remember: teamwork makes the dream work!",
      card: { w: "teamwork", pic: "🤝", ex: "Teamwork makes the dream work!" },
      choices: [
        { t: "Let’s win together!",    ok: true,  fb: "Team spirit! +10" },
        { t: "I win alone.",           ok: false, fb: "Teamwork is better :)" },
        { t: "Dream is work.",         ok: false, fb: "Try “Let’s win together!”" } ] }
  ]
},
{
  name: "Eli – Engineer", color: 0xfab005, x: 75, z: -105,
  steps: [
    { say: "Hi! This power plant makes electricity for the whole city.",
      card: { w: "electricity", pic: "⚡", ex: "The power plant makes electricity." },
      choices: [
        { t: "Wow! How does it work?",   ok: true,  fb: "Great question! +10" },
        { t: "City is electricity.",     ok: false, fb: "Try “How does it work?”" },
        { t: "I make electricity too.",  ok: false, fb: "Really? :) Ask how it works." } ] },
    { say: "We use the sun and the wind. That’s clean energy!",
      card: { w: "solar panel", pic: "☀️", ex: "Solar panels use the sun." },
      choices: [
        { t: "Clean energy is good for the Earth.", ok: true,  fb: "Exactly! +10" },
        { t: "The wind is dirty.",                  ok: false, fb: "No, wind energy is clean!" },
        { t: "Sun use we.",                         ok: false, fb: "Word order: “We use the sun.”" } ] },
    { say: "Yes! Please turn off the lights when you leave a room.",
      card: { w: "turn off", pic: "💡", ex: "Turn off the lights, please." },
      choices: [
        { t: "OK, I will save energy!",  ok: true,  fb: "Planet hero! +10" },
        { t: "I turn on all lights.",    ok: false, fb: "Turn them OFF to save energy :)" },
        { t: "Off is lights.",           ok: false, fb: "Say “OK, I will turn them off.”" } ] }
  ]
},
{
  name: "Captain Sky – Pilot", color: 0x1c7ed6, x: 125, z: -111,
  steps: [
    { say: "Hello! The plane leaves in ten minutes. Do you have your boarding pass?",
      card: { w: "boarding pass", pic: "🎫", ex: "Here is my boarding pass." },
      choices: [
        { t: "Yes, here it is.",       ok: true,  fb: "Ready to fly! +10" },
        { t: "Boarding is me pass.",   ok: false, fb: "Say “Here it is.”" },
        { t: "I have a plane.",        ok: false, fb: "Show your boarding pass :)" } ] },
    { say: "Thank you. Window seat or aisle seat?",
      card: { w: "window seat", pic: "🪟", ex: "A window seat, please." },
      choices: [
        { t: "A window seat, please.", ok: true,  fb: "Enjoy the view! +10" },
        { t: "Seat me window.",        ok: false, fb: "Say “A window seat, please.”" },
        { t: "I sit on the wing.",     ok: false, fb: "Haha, no! Choose window or aisle." } ] },
    { say: "Great choice! Please fasten your seat belt.",
      card: { w: "fasten", pic: "🪢", ex: "Fasten your seat belt." },
      choices: [
        { t: "Done! Let’s fly!",       ok: true,  fb: "+10" },
        { t: "Belt is fast.",          ok: false, fb: "Fasten = thắt. Say “Done!”" },
        { t: "No belt for me.",        ok: false, fb: "Safety first! Fasten it :)" } ] }
  ]
}
/* ===== CAFE SUA DA: thêm nhân viên và khách trong quán (quán rộng 20 × 48 m, z âm = quầy pha chế phía sau)
   minLv = cấp tối thiểu để NPC này chịu nói chuyện (nội dung khó hơn) ===== */
,{
  name: "Bao – Waiter", color: 0x2b8a3e, place: "cafe", x: 0, z: 1,
  steps: [
    { say: "Good afternoon! Table for how many?",
      q: { w: "Table for how many?", pic: "🍽️", ex: "Good afternoon! Table for how many?" },
      card: { w: "A table for two, please.", pic: "👫", ex: "A table for two, please." },
      choices: [
        { t: "A table for two, please.", ok: true,  fb: "Perfect! +10" },
        { t: "Two table.",               ok: false, fb: "Say “A table for two, please.”" },
        { t: "I am two.",                ok: false, fb: "Haha, you are one person :)" } ] },
    { say: "Would you like to sit inside or by the window?",
      card: { w: "by the window", pic: "🪟", ex: "I’d like to sit by the window." },
      choices: [
        { t: "By the window, please.", ok: true,  fb: "Nice view! +10" },
        { t: "Window is sit.",         ok: false, fb: "Say “By the window, please.”" },
        { t: "Yes.",                   ok: false, fb: "He asked which one: inside or by the window?" } ] },
    { say: "Here is the menu. Take your time!",
      card: { w: "Take your time.", pic: "⏳", ex: "Take your time, there’s no hurry." },
      choices: [
        { t: "Thank you. I’ll call you when I’m ready.", ok: true,  fb: "Very natural! +10" },
        { t: "Time is take.",                            ok: false, fb: "Try “Thank you!”" },
        { t: "Give food fast.",                          ok: false, fb: "Be polite :)" } ] }
  ]
},
{
  name: "Vy – Cashier", color: 0xe64980, place: "cafe", x: 5, z: -16.7,
  steps: [
    { say: "That’s 45,000 dong. Cash or card?",
      q: { w: "Cash or card?", pic: "💵", ex: "Would you like to pay by cash or card?" },
      card: { w: "pay by card", pic: "💳", ex: "Can I pay by card, please?" },
      choices: [
        { t: "Can I pay by card, please?", ok: true,  fb: "Polite! +10" },
        { t: "Card I pay.",                ok: false, fb: "Word order: “Can I pay by card?”" },
        { t: "No money.",                  ok: false, fb: "Hmm. Try “Can I pay by card?”" } ] },
    { say: "Of course. Would you like a receipt?",
      q: { w: "Would you like…?", pic: "🎁", ex: "Would you like a receipt?" },
      card: { w: "Yes, please.", pic: "👍", ex: "Yes, please. Thank you." },
      choices: [
        { t: "Yes, please.",          ok: true,  fb: "Short and polite! +10" },
        { t: "Yes, I like receipt.",  ok: false, fb: "Just say “Yes, please.”" },
        { t: "Receipt is me.",        ok: false, fb: "Try “Yes, please.”" } ] },
    { say: "Here you are. Have a nice day!",
      card: { w: "You too!", pic: "😊", ex: "Have a nice day! – Thanks, you too!" },
      choices: [
        { t: "Thanks! You too!", ok: true,  fb: "Lovely! +10" },
        { t: "Me too!",          ok: false, fb: "Say “You too!”" },
        { t: "Day is nice.",     ok: false, fb: "Try “Thanks! You too!”" } ] }
  ]
},
{
  name: "Grace – Customer", color: 0xfab005, place: "cafe", x: -7, z: 3.4,
  steps: [
    { say: "Excuse me, is this seat taken?",
      q: { w: "Is this seat taken?", pic: "💺", ex: "Excuse me, is this seat taken?" },
      card: { w: "Go ahead.", pic: "👉", ex: "No, it’s free. Go ahead!" },
      choices: [
        { t: "No, it’s free. Go ahead!", ok: true,  fb: "Friendly! +10" },
        { t: "Yes, I take seat.",        ok: false, fb: "If it’s free, say “No, it’s free. Go ahead!”" },
        { t: "Seat is no.",              ok: false, fb: "Try “No, it’s free.”" } ] },
    { say: "Thanks! What do you recommend here?",
      q: { w: "What do you recommend?", pic: "🤔", ex: "What do you recommend here?" },
      card: { w: "I recommend…", pic: "⭐", ex: "I recommend the iced milk coffee." },
      choices: [
        { t: "I recommend the iced milk coffee.", ok: true,  fb: "Great tip! +10" },
        { t: "Recommend coffee me.",              ok: false, fb: "Say “I recommend the…”" },
        { t: "I don’t know you.",                 ok: false, fb: "Be friendly :)" } ] },
    { say: "Great! By the way, I’m Grace. I’m from Canada.",
      card: { w: "I’m from Vietnam.", pic: "🇻🇳", ex: "Nice to meet you. I’m from Vietnam." },
      choices: [
        { t: "Nice to meet you, Grace. I’m from Vietnam.", ok: true,  fb: "Perfect introduction! +10" },
        { t: "I from Vietnam.",                            ok: false, fb: "Don’t forget “am”: I’m from Vietnam." },
        { t: "Canada is cold.",                            ok: false, fb: "Introduce yourself first :)" } ] }
  ]
},
{
  name: "Mr. Kha – Plant Seller", color: 0x5c940d, place: "cafe", x: 7.2, z: 13,
  steps: [
    { say: "Hello! Do you like plants? These are succulents.",
      card: { w: "They look…", pic: "🌵", ex: "They look so cute!" },
      choices: [
        { t: "Yes! They look so cute!", ok: true,  fb: "+10" },
        { t: "They looks cute.",        ok: false, fb: "“They look” – no s." },
        { t: "I eat plants.",           ok: false, fb: "Haha, please don’t!" } ] },
    { say: "How often do you water your plants?",
      q: { w: "How often…?", pic: "🔁", ex: "How often do you water your plants?" },
      card: { w: "once a week", pic: "📅", ex: "I water my plants once a week." },
      choices: [
        { t: "About once a week.", ok: true,  fb: "Good answer! +10" },
        { t: "Water is often.",    ok: false, fb: "Try “Once a week.”" },
        { t: "Yesterday.",         ok: false, fb: "He asked HOW OFTEN, not when." } ] },
    { say: "Good! This one is easy to care for. Only 30,000 dong.",
      card: { w: "I’ll take it.", pic: "🛍️", ex: "It’s lovely. I’ll take it!" },
      choices: [
        { t: "It’s lovely. I’ll take it!", ok: true,  fb: "Sold! +10" },
        { t: "I take it yesterday.",       ok: false, fb: "Say “I’ll take it.”" },
        { t: "Too lovely no.",             ok: false, fb: "Try “I’ll take it!”" } ] }
  ]
},
{
  name: "Uncle Tu – Cafe Owner", color: 0x6c4a2f, place: "cafe", x: 6.5, z: -8, minLv: 5,
  steps: [
    { say: "Welcome back, my friend! How long have you been learning English?",
      q: { w: "How long have you been…?", pic: "⏱️", ex: "How long have you been learning English?" },
      card: { w: "for six months", pic: "📆", ex: "I’ve been learning English for six months." },
      choices: [
        { t: "I’ve been learning it for six months.", ok: true,  fb: "Excellent grammar! +10" },
        { t: "I learning six months.",                ok: false, fb: "Say “I’ve been learning…”" },
        { t: "Since English.",                        ok: false, fb: "Try “For six months.”" } ] },
    { say: "Wonderful! Do you know why our coffee is so special?",
      card: { w: "I have no idea.", pic: "🤷", ex: "I have no idea. Can you tell me?" },
      choices: [
        { t: "I have no idea. Can you tell me?", ok: true,  fb: "Curious and polite! +10" },
        { t: "No idea have I.",                  ok: false, fb: "Say “I have no idea.”" },
        { t: "Coffee is coffee.",                ok: false, fb: "Be curious :)" } ] },
    { say: "We use a phin filter. The coffee drips slowly, drop by drop.",
      card: { w: "drop by drop", pic: "💧", ex: "The coffee drips slowly, drop by drop." },
      choices: [
        { t: "Wow, that’s why it tastes so rich!", ok: true,  fb: "Great reaction! +10" },
        { t: "Drop is slow me.",                   ok: false, fb: "Try “That’s why it tastes so rich!”" },
        { t: "I like tea.",                        ok: false, fb: "Stay on topic :)" } ] }
  ]
}
/* ===== POST OFFICE (sảnh lớn 24 × 48 m, quầy giao dịch 2 bên, quầy lưu niệm giữa sảnh) ===== */
,{
  name: "Ms. Thu – Counter Clerk", color: 0x2b8a3e, place: "post", x: 10.9, z: -10,
  steps: [
    { say: "Good morning! What’s inside the parcel?",
      q: { w: "What’s inside…?", pic: "📦", ex: "What’s inside the parcel?" },
      card: { w: "It’s a gift.", pic: "🎁", ex: "It’s a gift for my friend." },
      choices: [
        { t: "It’s a gift for my friend. Some books.", ok: true,  fb: "Clear answer! +10" },
        { t: "Inside is gift is.",                     ok: false, fb: "Say “It’s a gift.”" },
        { t: "I don’t tell you.",                      ok: false, fb: "She needs to know. Be polite :)" } ] },
    { say: "OK. Let me weigh it. It’s two kilos. Where are you sending it?",
      q: { w: "Where are you sending it?", pic: "📍", ex: "Where are you sending it?" },
      card: { w: "send it to…", pic: "✈️", ex: "I’m sending it to Da Nang." },
      choices: [
        { t: "I’m sending it to Da Nang.", ok: true,  fb: "+10" },
        { t: "Send Da Nang it.",           ok: false, fb: "Say “I’m sending it to Da Nang.”" },
        { t: "Two kilos.",                 ok: false, fb: "She asked WHERE, not how heavy." } ] },
    { say: "Express or standard? Express takes one day.",
      card: { w: "express", pic: "⚡", ex: "Express, please. It’s urgent." },
      choices: [
        { t: "Express, please. It’s urgent.", ok: true,  fb: "Great word: urgent! +10" },
        { t: "Fast fast.",                     ok: false, fb: "Say “Express, please.”" },
        { t: "One day is me.",                 ok: false, fb: "Try “Express, please.”" } ] }
  ]
},
{
  name: "Kevin – Tourist", color: 0x1c7ed6, place: "post", x: -1, z: 7,
  steps: [
    { say: "Hi! Sorry, where can I buy stamps?",
      q: { w: "Where can I buy…?", pic: "🛒", ex: "Where can I buy stamps?" },
      card: { w: "over there", pic: "👉", ex: "You can buy stamps over there." },
      choices: [
        { t: "At the counter over there.", ok: true,  fb: "Helpful! +10" },
        { t: "Stamp is there buy.",        ok: false, fb: "Say “At the counter over there.”" },
        { t: "I am a stamp.",              ok: false, fb: "Haha, no :)" } ] },
    { say: "Thanks! This building is beautiful. Is it very old?",
      q: { w: "Is it very old?", pic: "🏛️", ex: "Is this building very old?" },
      card: { w: "more than 100 years old", pic: "💯", ex: "It’s more than one hundred years old." },
      choices: [
        { t: "Yes, it’s more than 100 years old.", ok: true,  fb: "Correct! +10" },
        { t: "It old very.",                       ok: false, fb: "Say “It’s very old.”" },
        { t: "I am 100 years old.",                ok: false, fb: "You’re not that old :)" } ] },
    { say: "Amazing! I want to send postcards to my family in Australia.",
      card: { w: "That’s a great idea!", pic: "💡", ex: "Postcards? That’s a great idea!" },
      choices: [
        { t: "That’s a great idea! They’ll love it.", ok: true,  fb: "Friendly! +10" },
        { t: "Idea is great that.",                  ok: false, fb: "Say “That’s a great idea!”" },
        { t: "Australia is far.",                    ok: false, fb: "True, but be encouraging :)" } ] }
  ]
},
{
  name: "Mrs. Lan – Souvenir Seller", color: 0xc92a2a, place: "post", x: 2.8, z: -2,
  steps: [
    { say: "Hello dear! Postcards, magnets, keychains! What are you looking for?",
      q: { w: "What are you looking for?", pic: "🔍", ex: "What are you looking for?" },
      card: { w: "I’m looking for…", pic: "🏞️", ex: "I’m looking for postcards." },
      choices: [
        { t: "I’m looking for postcards.", ok: true,  fb: "+10" },
        { t: "Look postcard I.",           ok: false, fb: "Say “I’m looking for postcards.”" },
        { t: "I look you.",                ok: false, fb: "Try “I’m looking for…”" } ] },
    { say: "Here they are. How many would you like?",
      q: { w: "How many would you like?", pic: "🔢", ex: "How many would you like?" },
      card: { w: "five, please", pic: "5️⃣", ex: "Five postcards, please." },
      choices: [
        { t: "Five, please.",    ok: true,  fb: "Short and polite! +10" },
        { t: "Much five.",       ok: false, fb: "Say “Five, please.”" },
        { t: "How many is it?",  ok: false, fb: "She asked you. Give a number :)" } ] },
    { say: "That’s 50,000 dong. Do you want a bag?",
      card: { w: "No, thanks.", pic: "🙅", ex: "No, thanks. I have a bag." },
      choices: [
        { t: "No, thanks. I have a bag.", ok: true,  fb: "Good for the planet! +10" },
        { t: "No bag me.",                ok: false, fb: "Say “No, thanks.”" },
        { t: "Bag is good.",              ok: false, fb: "Try “Yes, please” or “No, thanks.”" } ] }
  ]
},
{
  name: "Uncle Bay – Letter Writer", color: 0x495057, place: "post", x: -6, z: -18.5, minLv: 5,
  steps: [
    { say: "Hello, young friend. Who would you like to write to?",
      q: { w: "Who would you like to…?", pic: "✍️", ex: "Who would you like to write to?" },
      card: { w: "I’d like to write to…", pic: "💌", ex: "I’d like to write to my pen pal." },
      choices: [
        { t: "I’d like to write to my pen pal in England.", ok: true,  fb: "Lovely! +10" },
        { t: "Write pen pal I.",                            ok: false, fb: "Say “I’d like to write to…”" },
        { t: "England is write.",                           ok: false, fb: "Try “I’d like to write to my pen pal.”" } ] },
    { say: "A good letter starts with “Dear…”. How do you end a letter?",
      card: { w: "Best wishes,", pic: "🌟", ex: "Best wishes, Lily." },
      choices: [
        { t: "Best wishes, and then my name.", ok: true,  fb: "Perfect ending! +10" },
        { t: "Goodbye forever.",               ok: false, fb: "Too sad! Try “Best wishes,”" },
        { t: "Dear end.",                      ok: false, fb: "“Dear” is for the beginning :)" } ] },
    { say: "Excellent. Remember: write clearly, and always say thank you.",
      card: { w: "I’ll keep that in mind.", pic: "🧠", ex: "Thank you. I’ll keep that in mind." },
      choices: [
        { t: "Thank you. I’ll keep that in mind.", ok: true,  fb: "Wise words! +10" },
        { t: "Mind is keep.",                      ok: false, fb: "Say “I’ll keep that in mind.”" },
        { t: "OK bye.",                            ok: false, fb: "Say thank you first :)" } ] }
  ]
}
/* ===== VERSE LIBRARY (phòng đọc bầu dục 28 × 40 m, quầy thủ thư ở tâm, bàn đọc tỏa nan quạt) ===== */
,{
  name: "Tom – Student", color: 0x1c7ed6, place: "library", x: 8.7, z: 2.3,
  steps: [
    { say: "Hi! Are you looking for a seat?",
      q: { w: "Is this seat free?", pic: "🪑", ex: "Excuse me, is this seat free?" },
      card: { w: "Is this seat free?", pic: "🪑", ex: "Excuse me, is this seat free?" },
      choices: [
        { t: "Yes. Is this seat free?",  ok: true,  fb: "Polite question! +10" },
        { t: "Seat free me?",            ok: false, fb: "Say “Is this seat free?”" },
        { t: "Move, please.",            ok: false, fb: "Too rude. Ask “Is this seat free?”" } ] },
    { say: "Sure, sit down. I’m doing my homework. What are you reading?",
      q: { w: "What are you reading?", pic: "📖", ex: "What are you reading?" },
      card: { w: "I’m reading…", pic: "📖", ex: "I’m reading a book about space." },
      choices: [
        { t: "I’m reading a book about space.", ok: true,  fb: "Great! +10" },
        { t: "Read I space book.",              ok: false, fb: "Say “I’m reading a book about…”" },
        { t: "Homework is you.",                ok: false, fb: "He asked about YOUR book :)" } ] },
    { say: "Cool! Shh… we have to speak quietly here.",
      card: { w: "speak quietly", pic: "🤫", ex: "Please speak quietly in the library." },
      choices: [
        { t: "Oh, sorry. I’ll speak quietly.", ok: true,  fb: "Good manners! +10" },
        { t: "I speak loud!",                  ok: false, fb: "Not in a library :)" },
        { t: "Quiet is speak.",                ok: false, fb: "Say “I’ll speak quietly.”" } ] }
  ]
},
{
  name: "Mrs. Hoa – Book Shelver", color: 0x9c36b5, place: "library", x: 9.2, z: -9.2,
  steps: [
    { say: "Hello! I’m putting books back on the shelves. Can I help you?",
      q: { w: "Can I help you?", pic: "🙋", ex: "Hello! Can I help you?" },
      card: { w: "Where can I find…?", pic: "🔎", ex: "Where can I find books about animals?" },
      choices: [
        { t: "Where can I find books about animals?", ok: true,  fb: "Clear question! +10" },
        { t: "Animal book where?",                    ok: false, fb: "Say “Where can I find books about…?”" },
        { t: "I am an animal.",                       ok: false, fb: "Haha! Ask for the books :)" } ] },
    { say: "They’re on the second shelf, next to the science books.",
      card: { w: "next to", pic: "↔️", ex: "The atlas is next to the dictionary." },
      choices: [
        { t: "Next to the science books. Got it!", ok: true,  fb: "You listened well! +10" },
        { t: "Science is animals.",                ok: false, fb: "Repeat: “next to the science books”" },
        { t: "On the floor?",                      ok: false, fb: "She said the second SHELF." } ] },
    { say: "When you finish, please don’t put the book back. Leave it on the cart.",
      card: { w: "leave it on…", pic: "🛒", ex: "Leave it on the cart, please." },
      choices: [
        { t: "OK, I’ll leave it on the cart.", ok: true,  fb: "Perfect! +10" },
        { t: "I put it back shelf.",           ok: false, fb: "She said leave it on the cart." },
        { t: "Cart is book.",                  ok: false, fb: "Say “I’ll leave it on the cart.”" } ] }
  ]
},
{
  name: "Lily – Little Reader", color: 0xf06595, place: "library", x: -8.7, z: 2.3,
  steps: [
    { say: "Hi! Do you like reading?",
      q: { w: "Do you like…?", pic: "❤️", ex: "Do you like reading?" },
      card: { w: "I love reading.", pic: "❤️", ex: "Yes! I love reading." },
      choices: [
        { t: "Yes! I love reading.", ok: true,  fb: "Me too! +10" },
        { t: "Reading is like.",     ok: false, fb: "Say “I love reading.”" },
        { t: "No books.",            ok: false, fb: "Try “Yes, I love reading.”" } ] },
    { say: "What’s your favourite book?",
      q: { w: "What’s your favourite…?", pic: "⭐", ex: "What’s your favourite book?" },
      card: { w: "My favourite book is…", pic: "⭐", ex: "My favourite book is Harry Potter." },
      choices: [
        { t: "My favourite book is a comic about a robot.", ok: true,  fb: "Sounds fun! +10" },
        { t: "Favourite me book.",                          ok: false, fb: "Say “My favourite book is…”" },
        { t: "Yes, favourite.",                             ok: false, fb: "She asked WHAT. Name a book :)" } ] },
    { say: "Can you read this word for me? I don’t know it.",
      card: { w: "Let me see.", pic: "👀", ex: "Let me see. It says “dinosaur”." },
      choices: [
        { t: "Let me see. It says “dinosaur”.", ok: true,  fb: "Kind helper! +10" },
        { t: "No time.",                        ok: false, fb: "Be kind :) Say “Let me see.”" },
        { t: "See me word.",                    ok: false, fb: "Say “Let me see.”" } ] }
  ]
},
{
  name: "Grandpa Vinh – Old Reader", color: 0x495057, place: "library", x: -8.5, z: -8.5, minLv: 5,
  steps: [
    { say: "Ah, a young reader! I come here every morning to read the newspaper.",
      q: { w: "How often do you…?", pic: "🔁", ex: "How often do you come here?" },
      card: { w: "every morning", pic: "🌅", ex: "I read every morning." },
      choices: [
        { t: "Every morning? That’s a good habit.", ok: true,  fb: "Nice reply! +10" },
        { t: "Morning is every.",                   ok: false, fb: "Say “That’s a good habit.”" },
        { t: "I hate newspapers.",                  ok: false, fb: "Be polite :)" } ] },
    { say: "When I was young, this library had no computers. We used paper cards to find books.",
      card: { w: "When I was young…", pic: "👴", ex: "When I was young, there were no phones." },
      choices: [
        { t: "Really? How did you find books?", ok: true,  fb: "Curious question! +10" },
        { t: "You young was.",                  ok: false, fb: "Ask “How did you find books?”" },
        { t: "Computers are paper.",            ok: false, fb: "Listen again :)" } ] },
    { say: "We looked at the cards in big drawers. It was slow, but fun! Now, tell me: why do you read?",
      q: { w: "Why do you…?", pic: "❓", ex: "Why do you read?" },
      card: { w: "because…", pic: "💭", ex: "I read because it’s fun." },
      choices: [
        { t: "I read because I want to learn new things.", ok: true,  fb: "Wonderful reason! +10" },
        { t: "Because read.",                              ok: false, fb: "Say “I read because…”" },
        { t: "Slow and fun.",                              ok: false, fb: "He asked WHY you read." } ] }
  ]
}
/* ===== VERSE BANK (sảnh lớn 28 × 44 m: cột đá granite, giếng trời kính cam, quầy giao dịch chữ U, phòng két) ===== */
,{
  name: "Mr. Hai – Security Guard", color: 0x343a40, place: "bank", x: 3.5, z: 15,
  steps: [
    { say: "Good morning! Welcome to Verse Bank. What do you need today?",
      q: { w: "What do you need?", pic: "🙋", ex: "What do you need today?" },
      card: { w: "I need to…", pic: "🏦", ex: "I need to open an account." },
      choices: [
        { t: "I need to open an account.", ok: true,  fb: "Clear! +10" },
        { t: "Need bank I.",               ok: false, fb: "Say “I need to…”" },
        { t: "You are a guard.",           ok: false, fb: "True :) But tell him what you need." } ] },
    { say: "OK. Please take a number from the machine and wait for your turn.",
      card: { w: "wait for your turn", pic: "⏳", ex: "Please wait for your turn." },
      choices: [
        { t: "OK. I’ll take a number and wait.", ok: true,  fb: "Good listener! +10" },
        { t: "I go first!",                      ok: false, fb: "Wait for your turn :)" },
        { t: "Number is wait.",                  ok: false, fb: "Say “I’ll take a number and wait.”" } ] },
    { say: "Your number will appear on the screen. Have a nice day!",
      card: { w: "Have a nice day!", pic: "☀️", ex: "Thank you. Have a nice day!" },
      choices: [
        { t: "Thank you. You too!", ok: true,  fb: "Friendly! +10" },
        { t: "Day nice.",           ok: false, fb: "Say “You too!”" },
        { t: "Screen.",             ok: false, fb: "Say thank you :)" } ] }
  ]
},
{
  name: "Ms. Mai – Currency Exchange", color: 0x1b5e3b, place: "bank", x: 7.2, z: -5,
  steps: [
    { say: "Hello! This is the currency exchange counter. How can I help?",
      card: { w: "change money", pic: "💱", ex: "I’d like to change some money." },
      choices: [
        { t: "I’d like to change dollars into dong.", ok: true,  fb: "Perfect! +10" },
        { t: "Dollar dong change.",                   ok: false, fb: "Say “I’d like to change dollars into dong.”" },
        { t: "I want a dollar shop.",                 ok: false, fb: "Try “I’d like to change…”" } ] },
    { say: "Of course. How many dollars do you have?",
      q: { w: "How many…do you have?", pic: "🔢", ex: "How many dollars do you have?" },
      card: { w: "one hundred dollars", pic: "💵", ex: "I have one hundred dollars." },
      choices: [
        { t: "I have one hundred dollars.", ok: true,  fb: "+10" },
        { t: "Many dollars.",               ok: false, fb: "Give a number: “I have…”" },
        { t: "Yes, I have.",                ok: false, fb: "She asked HOW MANY." } ] },
    { say: "Today’s exchange rate is on the board. Please count your money before you leave.",
      card: { w: "count your money", pic: "🧮", ex: "Count your money before you leave." },
      choices: [
        { t: "OK, I’ll count it now. Thank you.", ok: true,  fb: "Smart! +10" },
        { t: "Money count no.",                   ok: false, fb: "Say “I’ll count it now.”" },
        { t: "Board is money.",                   ok: false, fb: "Try “Thank you.”" } ] }
  ]
},
{
  name: "Grandma Sau – Customer", color: 0x862e9c, place: "bank", x: 10.8, z: 13.5,
  steps: [
    { say: "Oh dear, this machine is new. Can you help me, please?",
      q: { w: "Can you help me?", pic: "🆘", ex: "Excuse me, can you help me, please?" },
      card: { w: "Sure, I can help.", pic: "🤝", ex: "Sure, I can help you." },
      choices: [
        { t: "Sure, I can help you.", ok: true,  fb: "So kind! +10" },
        { t: "Help is machine.",      ok: false, fb: "Say “Sure, I can help.”" },
        { t: "No.",                   ok: false, fb: "Be kind to Grandma :)" } ] },
    { say: "Thank you! What do I do first?",
      card: { w: "insert your card", pic: "💳", ex: "First, insert your card." },
      choices: [
        { t: "First, insert your card here.", ok: true,  fb: "Clear instruction! +10" },
        { t: "Card the in.",                  ok: false, fb: "Say “First, insert your card.”" },
        { t: "Give me your card.",            ok: false, fb: "Never take someone’s card! Say “Insert your card.”" } ] },
    { say: "Now it asks for my PIN. Should I tell you?",
      card: { w: "Keep it secret.", pic: "🤐", ex: "Don’t tell anyone your PIN. Keep it secret." },
      choices: [
        { t: "No! Don’t tell anyone. Keep it secret.", ok: true,  fb: "Safe and smart! +10" },
        { t: "Yes, tell me.",                          ok: false, fb: "Never ask for a PIN!" },
        { t: "PIN is 1234.",                           ok: false, fb: "Keep it secret :)" } ] }
  ]
},
{
  name: "Mr. Quang – Bank Manager", color: 0x0b3d2a, place: "bank", x: -4, z: -17, minLv: 5,
  steps: [
    { say: "Welcome! I’m the manager. Behind me is our vault. Do you know what a vault is?",
      q: { w: "Do you know what…is?", pic: "❓", ex: "Do you know what a vault is?" },
      card: { w: "vault", pic: "🏦", ex: "The bank keeps gold in the vault." },
      choices: [
        { t: "It’s a strong room for money and gold.", ok: true,  fb: "Excellent! +10" },
        { t: "Vault is eat.",                          ok: false, fb: "A vault is a strong room for money." },
        { t: "I don’t care.",                          ok: false, fb: "Be curious :)" } ] },
    { say: "Right! Now, a question for you: if you get 100,000 dong, what will you do?",
      card: { w: "I’ll save half.", pic: "🐷", ex: "I’ll save half and spend half." },
      choices: [
        { t: "I’ll save half and spend half.", ok: true,  fb: "Smart plan! +10" },
        { t: "Spend all now!",                 ok: false, fb: "Hmm. Try saving some :)" },
        { t: "Half is money.",                 ok: false, fb: "Say “I’ll save half.”" } ] },
    { say: "Very wise. Saving a little every week makes a big difference.",
      card: { w: "make a big difference", pic: "📈", ex: "Small steps make a big difference." },
      choices: [
        { t: "I’ll start saving this week.", ok: true,  fb: "Great goal! +10" },
        { t: "Difference big make.",         ok: false, fb: "Say “I’ll start saving.”" },
        { t: "Week is save.",                ok: false, fb: "Try “I’ll start saving this week.”" } ] }
  ]
}
/* ===== CITY MUSEUM (60 × 72 m: sảnh chính + 4 khu – khủng long, điêu khắc & cổ vật, tranh nổi tiếng, khoa học & vũ trụ) ===== */
,{
  name: "Dr. Rex – Paleontologist", color: 0x8d5a2b, place: "museum", x: -11.5, z: 13,
  steps: [
    { say: "Hello, explorer! I study dinosaur fossils. Do you know what a fossil is?",
      q: { w: "Do you know what…is?", pic: "❓", ex: "Do you know what a fossil is?" },
      card: { w: "fossil", pic: "🪨", ex: "A fossil is a very old bone in a rock." },
      choices: [
        { t: "Is it a very old bone in a rock?", ok: true, fb: "Great guess! +10" },
        { t: "Fossil is eat.", ok: false, fb: "Not food :) Ask “Is it an old bone?”" },
        { t: "I don’t know fossil.", ok: false, fb: "Try a guess: “Is it a very old bone?”" } ] },
    { say: "Exactly! This T. rex lived about sixty-six million years ago.",
      card: { w: "million years ago", pic: "⏳", ex: "Dinosaurs lived millions of years ago." },
      choices: [
        { t: "Wow, sixty-six million years ago!", ok: true, fb: "You listened well! +10" },
        { t: "It is sixty years.", ok: false, fb: "Listen again: sixty-six MILLION." },
        { t: "It lived yesterday.", ok: false, fb: "Haha, no :)" } ] },
    { say: "We dig very slowly with small brushes. Why do you think we are so careful?",
      q: { w: "Why do you think…?", pic: "🤔", ex: "Why do you think we are careful?" },
      card: { w: "so we don’t break…", pic: "🦴", ex: "We are careful so we don’t break the bones." },
      choices: [
        { t: "So you don’t break the bones.", ok: true, fb: "Smart answer! +10" },
        { t: "Because brush.", ok: false, fb: "Say “So we don’t break the bones.”" },
        { t: "Dig fast is good.", ok: false, fb: "Fossils break easily :)" } ] }
  ]
},
{
  name: "Ben – Kid Explorer", color: 0x1c7ed6, place: "museum", x: -24, z: 19,
  steps: [
    { say: "Look at that long neck! How tall do you think it is?",
      q: { w: "How tall…?", pic: "📏", ex: "How tall is it?" },
      card: { w: "It’s about … metres tall.", pic: "📏", ex: "It’s about twelve metres tall." },
      choices: [
        { t: "I think it’s about twelve metres tall.", ok: true, fb: "Good guess! +10" },
        { t: "Tall is it.", ok: false, fb: "Say “It’s about … metres tall.”" },
        { t: "It is a neck.", ok: false, fb: "He asked HOW TALL." } ] },
    { say: "Twelve metres! Taller than my house! What did it eat?",
      card: { w: "leaves", pic: "🌿", ex: "It ate leaves from tall trees." },
      choices: [
        { t: "It ate leaves from tall trees.", ok: true, fb: "Correct! +10" },
        { t: "It eat people.", ok: false, fb: "Long-necked dinosaurs ate plants :)" },
        { t: "Eat leaf it.", ok: false, fb: "Say “It ate leaves.”" } ] },
    { say: "Cool! Which dinosaur is your favourite?",
      q: { w: "Which…is your favourite?", pic: "⭐", ex: "Which dinosaur is your favourite?" },
      card: { w: "My favourite is…", pic: "🦖", ex: "My favourite is the T. rex." },
      choices: [
        { t: "My favourite is the T. rex.", ok: true, fb: "Roar! +10" },
        { t: "Favourite is me.", ok: false, fb: "Say “My favourite is…”" },
        { t: "Yes, dinosaur.", ok: false, fb: "He asked WHICH one." } ] }
  ]
},
{
  name: "Ms. Ivy – Museum Guide", color: 0x2b8a3e, place: "museum", x: -8.5, z: 22.5,
  steps: [
    { say: "Welcome to the Dinosaur Hall! Is this your first visit?",
      q: { w: "Is this your first…?", pic: "1️⃣", ex: "Is this your first visit?" },
      card: { w: "first visit", pic: "🎉", ex: "This is my first visit." },
      choices: [
        { t: "Yes, it’s my first visit.", ok: true, fb: "Welcome! +10" },
        { t: "First me.", ok: false, fb: "Say “It’s my first visit.”" },
        { t: "Visit is first.", ok: false, fb: "Try “Yes, it’s my first visit.”" } ] },
    { say: "Lovely! You can take photos, but please don’t climb on the stairs.",
      card: { w: "climb", pic: "🧗", ex: "Please don’t climb on the stairs." },
      choices: [
        { t: "OK, I won’t climb on the stairs.", ok: true, fb: "Thank you! +10" },
        { t: "I climb now!", ok: false, fb: "Please follow the rules :)" },
        { t: "Stairs climb no.", ok: false, fb: "Say “I won’t climb.”" } ] },
    { say: "The flying reptile above you is a pterosaur. It is not a dinosaur!",
      card: { w: "above you", pic: "⬆️", ex: "Look! There is a pterosaur above you." },
      choices: [
        { t: "Really? I thought it was a dinosaur!", ok: true, fb: "Great reaction! +10" },
        { t: "Above is you.", ok: false, fb: "Say “Really? I thought…”" },
        { t: "It is a bird.", ok: false, fb: "Not a bird either :)" } ] }
  ]
},
{
  name: "Dr. Kim – Fossil Scientist", color: 0x5f3dc4, place: "museum", x: -26.5, z: 15.5, minLv: 5,
  steps: [
    { say: "Do you know why the dinosaurs disappeared?",
      q: { w: "Do you know why…?", pic: "❓", ex: "Do you know why the dinosaurs disappeared?" },
      card: { w: "disappear", pic: "💨", ex: "The dinosaurs disappeared long ago." },
      choices: [
        { t: "Was it a big rock from space?", ok: true, fb: "Good thinking! +10" },
        { t: "Dinosaurs go home.", ok: false, fb: "Hmm. Think about space :)" },
        { t: "Why is disappear.", ok: false, fb: "Try “Was it a rock from space?”" } ] },
    { say: "Many scientists think a huge meteorite hit the Earth. The sky became dark and cold.",
      card: { w: "hit the Earth", pic: "☄️", ex: "A huge meteorite hit the Earth." },
      choices: [
        { t: "So the plants died, and then the dinosaurs died?", ok: true, fb: "Excellent thinking! +10" },
        { t: "Earth hit me.", ok: false, fb: "Say “A meteorite hit the Earth.”" },
        { t: "The sky was hot.", ok: false, fb: "She said dark and COLD." } ] },
    { say: "Yes! But some dinosaurs became birds. Do you believe that?",
      q: { w: "Do you believe…?", pic: "🐦", ex: "Do you believe that birds are dinosaurs?" },
      card: { w: "I can’t believe it!", pic: "😲", ex: "Birds are dinosaurs? I can’t believe it!" },
      choices: [
        { t: "Wow, I can’t believe it! Birds are dinosaurs!", ok: true, fb: "Amazing fact! +10" },
        { t: "Believe is bird.", ok: false, fb: "Say “I can’t believe it!”" },
        { t: "No birds.", ok: false, fb: "Birds really are dinosaurs :)" } ] }
  ]
},
{
  name: "Marco – Sculptor", color: 0xadb5bd, place: "museum", x: -19, z: -26.5,
  steps: [
    { say: "Ciao! I make statues. What do you think this horse statue is made of?",
      q: { w: "What is it made of?", pic: "🪨", ex: "What is it made of?" },
      card: { w: "It’s made of…", pic: "🤍", ex: "It’s made of marble." },
      choices: [
        { t: "I think it’s made of marble.", ok: true, fb: "Correct! +10" },
        { t: "Made horse marble.", ok: false, fb: "Say “It’s made of marble.”" },
        { t: "It is a real horse.", ok: false, fb: "Haha, it’s stone :)" } ] },
    { say: "Right! Marble is hard. It takes me one year to make one statue.",
      card: { w: "It takes…", pic: "📅", ex: "It takes one year to make a statue." },
      choices: [
        { t: "One year? That’s a long time!", ok: true, fb: "Nice reaction! +10" },
        { t: "Year one take.", ok: false, fb: "Say “That’s a long time!”" },
        { t: "It takes one day.", ok: false, fb: "He said one YEAR." } ] },
    { say: "Would you like to try making a small statue from clay?",
      q: { w: "Would you like to try…?", pic: "🙋", ex: "Would you like to try?" },
      card: { w: "I’d love to!", pic: "😍", ex: "I’d love to try!" },
      choices: [
        { t: "Yes, I’d love to!", ok: true, fb: "Great! +10" },
        { t: "Try clay me.", ok: false, fb: "Say “I’d love to!”" },
        { t: "Clay is dirty, no.", ok: false, fb: "Be brave and try :)" } ] }
  ]
},
{
  name: "Anna – Art Student", color: 0xe64980, place: "museum", x: -16, z: -15,
  steps: [
    { say: "Hi! I’m drawing the statues for my art class.",
      q: { w: "What are you drawing?", pic: "✏️", ex: "What are you drawing?" },
      card: { w: "What are you drawing?", pic: "✏️", ex: "What are you drawing?" },
      choices: [
        { t: "Cool! What are you drawing now?", ok: true, fb: "Good question! +10" },
        { t: "Draw you what?", ok: false, fb: "Say “What are you drawing?”" },
        { t: "I don’t like art.", ok: false, fb: "Be kind :)" } ] },
    { say: "The man with his arm up. It’s difficult to draw hands!",
      card: { w: "difficult", pic: "😓", ex: "Drawing hands is difficult." },
      choices: [
        { t: "Yes, hands are difficult. Your drawing looks great!", ok: true, fb: "So kind! +10" },
        { t: "Hands easy.", ok: false, fb: "She thinks it’s difficult :)" },
        { t: "Difficult is hand.", ok: false, fb: "Say “Hands are difficult.”" } ] },
    { say: "Thanks! Do you like drawing too?",
      q: { w: "Do you like…?", pic: "❤️", ex: "Do you like drawing?" },
      card: { w: "I’m not very good at…", pic: "🙈", ex: "I’m not very good at drawing." },
      choices: [
        { t: "I like it, but I’m not very good at it.", ok: true, fb: "Honest answer! +10" },
        { t: "Good at drawing not.", ok: false, fb: "Say “I’m not very good at it.”" },
        { t: "Drawing is you.", ok: false, fb: "Answer about YOU :)" } ] }
  ]
},
{
  name: "Uncle Tuan – Security Guard", color: 0x343a40, place: "museum", x: -8.5, z: -14,
  steps: [
    { say: "Hello! Please don’t touch the statues. They are very old.",
      card: { w: "Don’t touch.", pic: "🚫", ex: "Please don’t touch the statues." },
      choices: [
        { t: "Sorry! I won’t touch them.", ok: true, fb: "Polite! +10" },
        { t: "I touch a little.", ok: false, fb: "No touching, please :)" },
        { t: "Touch is no.", ok: false, fb: "Say “I won’t touch them.”" } ] },
    { say: "Thank you. Can I help you find something?",
      q: { w: "Can I help you find…?", pic: "🔎", ex: "Can I help you find something?" },
      card: { w: "Where is…?", pic: "📍", ex: "Where is the bronze drum?" },
      choices: [
        { t: "Yes. Where is the bronze drum?", ok: true, fb: "Clear question! +10" },
        { t: "Drum where?", ok: false, fb: "Say “Where is the bronze drum?”" },
        { t: "I find me.", ok: false, fb: "Ask “Where is…?”" } ] },
    { say: "It’s at the end of the room, near the door to the Dinosaur Hall.",
      card: { w: "at the end of", pic: "➡️", ex: "It’s at the end of the room." },
      choices: [
        { t: "At the end of the room. Thank you!", ok: true, fb: "You listened well! +10" },
        { t: "End is room.", ok: false, fb: "Say “At the end of the room.”" },
        { t: "In the dinosaur?", ok: false, fb: "Near the door, not in it :)" } ] }
  ]
},
{
  name: "Dr. Phuong – Archaeologist", color: 0x8c6a3a, place: "museum", x: -14.5, z: -4, minLv: 5,
  steps: [
    { say: "This is a Dong Son bronze drum from Vietnam. Do you know how old it is?",
      q: { w: "How old is it?", pic: "⏳", ex: "How old is this drum?" },
      card: { w: "more than 2,000 years old", pic: "🥁", ex: "It’s more than two thousand years old." },
      choices: [
        { t: "Is it more than two thousand years old?", ok: true, fb: "Correct! +10" },
        { t: "Old is drum.", ok: false, fb: "Ask “How old is it?”" },
        { t: "It is new.", ok: false, fb: "It’s very old :)" } ] },
    { say: "Yes! Look at the top. There is a star in the middle and birds around it.",
      card: { w: "in the middle", pic: "🎯", ex: "There is a star in the middle." },
      choices: [
        { t: "I can see the star in the middle and the birds!", ok: true, fb: "Great eyes! +10" },
        { t: "Middle is star bird.", ok: false, fb: "Say “There is a star in the middle.”" },
        { t: "I see a car.", ok: false, fb: "Look again :)" } ] },
    { say: "People played these drums at festivals. Why do you think they are important?",
      q: { w: "Why are they important?", pic: "❓", ex: "Why are bronze drums important?" },
      card: { w: "They show our history.", pic: "📜", ex: "Bronze drums show our history." },
      choices: [
        { t: "Because they show our history and culture.", ok: true, fb: "Wonderful! +10" },
        { t: "Important is drum.", ok: false, fb: "Say “They show our history.”" },
        { t: "Because they are loud.", ok: false, fb: "True :) But think about history." } ] }
  ]
},
{
  name: "Mrs. Rose – Art Guide", color: 0xc2255c, place: "museum", x: 21.5, z: -30,
  steps: [
    { say: "This is the Mona Lisa. Do you know who painted it?",
      q: { w: "Who painted it?", pic: "🎨", ex: "Who painted the Mona Lisa?" },
      card: { w: "painted by…", pic: "🖌️", ex: "It was painted by Leonardo da Vinci." },
      choices: [
        { t: "Leonardo da Vinci painted it.", ok: true, fb: "Correct! +10" },
        { t: "Mona Lisa painted me.", ok: false, fb: "Haha! It was Leonardo da Vinci." },
        { t: "Who is painted?", ok: false, fb: "Say “Leonardo da Vinci painted it.”" } ] },
    { say: "Well done! Many people say her smile is a mystery. What do you think?",
      q: { w: "What do you think?", pic: "💭", ex: "What do you think about her smile?" },
      card: { w: "I think she looks…", pic: "🙂", ex: "I think she looks happy." },
      choices: [
        { t: "I think she looks happy, but a little sad too.", ok: true, fb: "Great opinion! +10" },
        { t: "Smile is think.", ok: false, fb: "Say “I think she looks…”" },
        { t: "No smile.", ok: false, fb: "Look again – she is smiling :)" } ] },
    { say: "Interesting! Please stay behind the rope, and no flash photos.",
      card: { w: "behind the rope", pic: "🟥", ex: "Please stay behind the rope." },
      choices: [
        { t: "OK, I’ll stay behind the rope.", ok: true, fb: "Thank you! +10" },
        { t: "I go over rope.", ok: false, fb: "Please stay behind it :)" },
        { t: "Rope behind no flash yes.", ok: false, fb: "Say “I’ll stay behind the rope.”" } ] }
  ]
},
{
  name: "Nam – Young Painter", color: 0xf08c00, place: "museum", x: 13, z: -7.5,
  steps: [
    { say: "Hi! I’m copying a painting to practise. Can you guess which one?",
      q: { w: "Can you guess…?", pic: "🤔", ex: "Can you guess which one?" },
      card: { w: "Is it…?", pic: "❓", ex: "Is it the rice field painting?" },
      choices: [
        { t: "Is it the rice field painting?", ok: true, fb: "Yes! +10" },
        { t: "Guess painting it.", ok: false, fb: "Ask “Is it the…?”" },
        { t: "I can’t see.", ok: false, fb: "Have a guess :)" } ] },
    { say: "Yes! I need more green. Which two colours make green?",
      q: { w: "Which colours make…?", pic: "🎨", ex: "Which colours make green?" },
      card: { w: "Blue and yellow make green.", pic: "💙💛", ex: "Blue and yellow make green." },
      choices: [
        { t: "Blue and yellow make green.", ok: true, fb: "Correct! +10" },
        { t: "Red and white.", ok: false, fb: "That makes pink :)" },
        { t: "Green is colour.", ok: false, fb: "Say “Blue and yellow make green.”" } ] },
    { say: "Thanks! One day I want to have my painting in this museum.",
      card: { w: "One day…", pic: "🌟", ex: "One day I want to be a painter." },
      choices: [
        { t: "I’m sure you will. Keep practising!", ok: true, fb: "Encouraging! +10" },
        { t: "One day museum.", ok: false, fb: "Say “Keep practising!”" },
        { t: "Your painting is bad.", ok: false, fb: "Be kind :)" } ] }
  ]
},
{
  name: "Sophie – Tourist", color: 0x15aabf, place: "museum", x: 24, z: -15,
  steps: [
    { say: "Bonjour! I’m from France. Excuse me, can you take a photo of me?",
      q: { w: "Can you take a photo…?", pic: "📷", ex: "Can you take a photo of me?" },
      card: { w: "Sure. Say cheese!", pic: "📸", ex: "Sure. Say cheese!" },
      choices: [
        { t: "Sure. Say cheese!", ok: true, fb: "Fun! +10" },
        { t: "Photo take you.", ok: false, fb: "Say “Sure. Say cheese!”" },
        { t: "No photo.", ok: false, fb: "Be helpful :)" } ] },
    { say: "Merci! Where are you from?",
      q: { w: "Where are you from?", pic: "🌏", ex: "Where are you from?" },
      card: { w: "I’m from Vietnam.", pic: "🇻🇳", ex: "I’m from Vietnam." },
      choices: [
        { t: "I’m from Vietnam.", ok: true, fb: "+10" },
        { t: "From I Vietnam.", ok: false, fb: "Say “I’m from Vietnam.”" },
        { t: "I’m from France too.", ok: false, fb: "Tell her where YOU are from." } ] },
    { say: "Vietnam! I want to visit Ha Long Bay. Is it beautiful?",
      q: { w: "Is it beautiful?", pic: "🏞️", ex: "Is Ha Long Bay beautiful?" },
      card: { w: "You should visit…", pic: "✈️", ex: "You should visit Ha Long Bay." },
      choices: [
        { t: "Yes, it’s beautiful. You should visit it!", ok: true, fb: "Great advice! +10" },
        { t: "Beautiful is bay.", ok: false, fb: "Say “You should visit it!”" },
        { t: "No, don’t go.", ok: false, fb: "It IS beautiful :)" } ] }
  ]
},
{
  name: "Mr. Henry – Art Critic", color: 0x495057, place: "museum", x: 25.5, z: -27.5, minLv: 5,
  steps: [
    { say: "Ah, The Starry Night. Some people love it, some don’t. What’s your opinion?",
      q: { w: "What’s your opinion?", pic: "💬", ex: "What’s your opinion?" },
      card: { w: "In my opinion…", pic: "💬", ex: "In my opinion, it’s beautiful." },
      choices: [
        { t: "In my opinion, it’s beautiful and full of energy.", ok: true, fb: "A real critic! +10" },
        { t: "Opinion is starry.", ok: false, fb: "Say “In my opinion…”" },
        { t: "I don’t know.", ok: false, fb: "Try: “In my opinion, it’s…”" } ] },
    { say: "Interesting. Van Gogh sold only one or two paintings in his life. Is that surprising?",
      q: { w: "Is that surprising?", pic: "😲", ex: "Is that surprising?" },
      card: { w: "surprising", pic: "😲", ex: "That’s really surprising!" },
      choices: [
        { t: "Yes! That’s really surprising, because now he is famous.", ok: true, fb: "Excellent reason! +10" },
        { t: "Surprise me Van Gogh.", ok: false, fb: "Say “That’s really surprising!”" },
        { t: "He sold a million.", ok: false, fb: "Listen again: only one or two." } ] },
    { say: "Indeed. Which painting in this room would you put in your bedroom?",
      q: { w: "Which…would you…?", pic: "🛏️", ex: "Which painting would you put in your bedroom?" },
      card: { w: "I’d choose…because…", pic: "👉", ex: "I’d choose The Great Wave because I love the sea." },
      choices: [
        { t: "I’d choose The Great Wave because I love the sea.", ok: true, fb: "Wonderful choice! +10" },
        { t: "Bedroom wave.", ok: false, fb: "Say “I’d choose… because…”" },
        { t: "I sleep.", ok: false, fb: "Choose a painting :)" } ] }
  ]
},
{
  name: "Captain Sky – Astronaut", color: 0xf1f3f5, place: "museum", x: 14.5, z: 11,
  steps: [
    { say: "Hello, future astronaut! Which planet is the biggest?",
      q: { w: "Which…is the biggest?", pic: "🪐", ex: "Which planet is the biggest?" },
      card: { w: "the biggest", pic: "🪐", ex: "Jupiter is the biggest planet." },
      choices: [
        { t: "Jupiter is the biggest.", ok: true, fb: "Correct! +10" },
        { t: "Biggest is me.", ok: false, fb: "Haha! Say “Jupiter is the biggest.”" },
        { t: "The Moon.", ok: false, fb: "The Moon is not a planet :)" } ] },
    { say: "Right! In space there is no gravity, so we float. What do you think we eat?",
      card: { w: "float", pic: "🎈", ex: "In space, astronauts float." },
      choices: [
        { t: "Do you eat special food in bags?", ok: true, fb: "Great question! +10" },
        { t: "Float eat.", ok: false, fb: "Ask “Do you eat special food?”" },
        { t: "Pizza from the shop.", ok: false, fb: "No shops in space :)" } ] },
    { say: "Yes, food in bags! Would you like to be an astronaut one day?",
      q: { w: "Would you like to be…?", pic: "👨‍🚀", ex: "Would you like to be an astronaut?" },
      card: { w: "I’d like to be…", pic: "👩‍🚀", ex: "I’d like to be an astronaut." },
      choices: [
        { t: "Yes! I’d like to be an astronaut.", ok: true, fb: "Ready for launch! +10" },
        { t: "Astronaut me be.", ok: false, fb: "Say “I’d like to be an astronaut.”" },
        { t: "No, space is food.", ok: false, fb: "Hmm, try again :)" } ] }
  ]
},
{
  name: "Ms. Nova – Science Teacher", color: 0x7048e8, place: "museum", x: 25.5, z: 25.5,
  steps: [
    { say: "Welcome to the lab corner! What happens if you put a magnet near a nail?",
      q: { w: "What happens if…?", pic: "❓", ex: "What happens if you heat ice?" },
      card: { w: "It sticks.", pic: "🧲", ex: "The nail sticks to the magnet." },
      choices: [
        { t: "The nail sticks to the magnet.", ok: true, fb: "Correct! +10" },
        { t: "Magnet nail is.", ok: false, fb: "Say “The nail sticks to the magnet.”" },
        { t: "The nail flies away.", ok: false, fb: "Look again :)" } ] },
    { say: "Good! Now, look in the microscope. What can you see?",
      q: { w: "What can you see?", pic: "👀", ex: "What can you see?" },
      card: { w: "I can see…", pic: "🔬", ex: "I can see tiny cells." },
      choices: [
        { t: "I can see tiny cells.", ok: true, fb: "Sharp eyes! +10" },
        { t: "See I cell.", ok: false, fb: "Say “I can see tiny cells.”" },
        { t: "I see nothing.", ok: false, fb: "Try again :)" } ] },
    { say: "Science is about asking questions. Do you have a question for me?",
      card: { w: "I wonder why…", pic: "💭", ex: "I wonder why the sky is blue." },
      choices: [
        { t: "Yes! I wonder why the sky is blue.", ok: true, fb: "Great question! +10" },
        { t: "Question no.", ok: false, fb: "Try “I wonder why…”" },
        { t: "Sky is blue why.", ok: false, fb: "Say “I wonder why the sky is blue.”" } ] }
  ]
},
{
  name: "Robo-7 – Museum Robot", color: 0x868e96, place: "museum", x: 13.5, z: 22.5,
  steps: [
    { say: "BEEP! Hello, human. I am Robo-7. What is your name?",
      q: { w: "What is your name?", pic: "🤖", ex: "What is your name?" },
      card: { w: "My name is…", pic: "📛", ex: "My name is Lan." },
      choices: [
        { t: "Hello, Robo-7! My name is …", ok: true, fb: "Nice to meet you! +10" },
        { t: "Name me.", ok: false, fb: "Say “My name is…”" },
        { t: "I am a robot.", ok: false, fb: "You are a human :)" } ] },
    { say: "BEEP BOOP. I can help with directions. Where do you want to go?",
      q: { w: "Where do you want to go?", pic: "🧭", ex: "Where do you want to go?" },
      card: { w: "I want to go to…", pic: "🏛️", ex: "I want to go to the Dinosaur Hall." },
      choices: [
        { t: "I want to go to the Dinosaur Hall.", ok: true, fb: "Clear! +10" },
        { t: "Go dinosaur.", ok: false, fb: "Say “I want to go to…”" },
        { t: "I want a robot.", ok: false, fb: "Choose a place :)" } ] },
    { say: "Go out to the lobby and go straight across. The Dinosaur Hall is in front of you. BEEP!",
      card: { w: "go straight across", pic: "⬆️", ex: "Go straight across the lobby." },
      choices: [
        { t: "Go straight across the lobby. Thank you, Robo-7!", ok: true, fb: "Perfect listening! +10" },
        { t: "Turn left and go up.", ok: false, fb: "Listen again: go STRAIGHT across." },
        { t: "Robot is lobby.", ok: false, fb: "Say “Go straight across. Thank you!”" } ] }
  ]
},
{
  name: "Dr. Minh – Physicist", color: 0x0b7285, place: "museum", x: 21, z: 7, minLv: 5,
  steps: [
    { say: "Why don’t we fly off the Earth? Have you heard of gravity?",
      q: { w: "Have you heard of…?", pic: "👂", ex: "Have you heard of gravity?" },
      card: { w: "gravity", pic: "🍎", ex: "Gravity pulls things down." },
      choices: [
        { t: "Yes. Gravity pulls things down.", ok: true, fb: "Correct! +10" },
        { t: "Gravity is fly.", ok: false, fb: "Gravity pulls DOWN :)" },
        { t: "Heard no of.", ok: false, fb: "Say “Yes, I’ve heard of it.”" } ] },
    { say: "Good! If you drop a ball and a feather on the Moon, which one lands first?",
      q: { w: "Which one…first?", pic: "🥇", ex: "Which one lands first?" },
      card: { w: "at the same time", pic: "⏱️", ex: "They land at the same time." },
      choices: [
        { t: "They land at the same time, because there is no air.", ok: true, fb: "Brilliant! +10" },
        { t: "The ball, it’s heavy.", ok: false, fb: "On the Moon there is no air!" },
        { t: "Feather first fly.", ok: false, fb: "Think about no air :)" } ] },
    { say: "Excellent! Real scientists test their ideas. How can you test an idea?",
      q: { w: "How can you…?", pic: "🧪", ex: "How can you test an idea?" },
      card: { w: "do an experiment", pic: "🧪", ex: "We can do an experiment." },
      choices: [
        { t: "We can do an experiment.", ok: true, fb: "Spoken like a scientist! +10" },
        { t: "Idea test how.", ok: false, fb: "Say “We can do an experiment.”" },
        { t: "Ask my mom.", ok: false, fb: "Try “do an experiment” :)" } ] }
  ]
},
/* ----- Town Hall (townhall) ----- */
{
  name: "Ana – Receptionist", color: 0x9c36b5, place: "townhall", x: -6, z: 12,
  steps: [
    { say: "Welcome to Town Hall! How can I help you today?",
      card: { w: "I have an appointment.", pic: "📅", ex: "I have an appointment at ten." },
      q: { w: "How can I help you?", pic: "🙋", ex: "How can I help you today?" },
      choices: [
        { t: "I have an appointment at ten.",  ok: true,  fb: "Great! Clear and polite. +10" },
        { t: "Appointment I have at ten is.",  ok: false, fb: "Almost! Try “I have an appointment at ten.”" },
        { t: "I am an appointment.",           ok: false, fb: "Funny! But you are a visitor :) Try “I have an appointment.”" } ] },
    { say: "Please take a number and sit down. Which office do you need?",
      card: { w: "take a number", pic: "🎫", ex: "I’ll take a number, please." },
      q: { w: "Which office…?", pic: "🏢", ex: "Which office do you need?" },
      choices: [
        { t: "I need the office for ID cards.", ok: true,  fb: "Perfect! Now the clerk can help. +10" },
        { t: "Office I need is.",               ok: false, fb: "Word order: “I need the office for ID cards.”" },
        { t: "Yes, the office is green.",       ok: false, fb: "Green is nice, but she asked which office." } ] },
    { say: "Thank you! Your number is twelve. Please wait a moment.",
      card: { w: "in a moment", pic: "⏳", ex: "Your turn is coming in a moment." },
      choices: [
        { t: "Thank you! I’ll wait a moment.", ok: true,  fb: "Lovely! +10" },
        { t: "Thank you! I am wait.",          ok: false, fb: "Try “I’ll wait a moment.”" },
        { t: "Twelve is my favourite number.", ok: false, fb: "Fun fact! Now try “I’ll wait a moment.”" } ] }
  ]
},
{
  name: "Hung – Records Clerk", color: 0x0b7285, place: "townhall", x: -10, z: 0,
  steps: [
    { say: "Hi! Do you want to register your new address?",
      card: { w: "register", pic: "✍️", ex: "I want to register my address." },
      choices: [
        { t: "I want to register my address.", ok: true,  fb: "Excellent! Clear and correct. +10" },
        { t: "Address register me want.",      ok: false, fb: "Word order: “I want to register my address.”" },
        { t: "I am a register.",               ok: false, fb: "Ha! A register is a machine. Try “I want to register.”" } ] },
    { say: "Please fill in this form. What is your address?",
      card: { w: "fill in", pic: "🖊️", ex: "Please fill in the form." },
      q: { w: "What is your address?", pic: "🏠", ex: "What is your address?" },
      choices: [
        { t: "Number 5, Maple Street.",    ok: true,  fb: "Clear and complete! +10" },
        { t: "Street is my address five.", ok: false, fb: "Word order: “Number 5, Maple Street.”" },
        { t: "I live in a big pizza.",     ok: false, fb: "Yummy! But please give your street address." } ] },
    { say: "Thank you. Sign here, please. Your card will be ready tomorrow.",
      card: { w: "tomorrow", pic: "📆", ex: "It will be ready tomorrow." },
      choices: [
        { t: "Thank you! I’ll come back tomorrow.", ok: true,  fb: "Perfect! +10" },
        { t: "Tomorrow I back come.",               ok: false, fb: "Word order: “I’ll come back tomorrow.”" },
        { t: "Yesterday, thank you.",               ok: false, fb: "Yesterday is the past. The clerk said tomorrow." } ] }
  ]
},
{
  name: "Tuan – Quest Board Officer", color: 0xe64980, place: "townhall", x: 11, z: 2,
  steps: [
    { say: "Hi! Our city needs help. Do you want a quest today?",
      card: { w: "quest", pic: "📜", ex: "I want to do a quest." },
      q: { w: "What can I do?", pic: "🤔", ex: "What can I do to help?" },
      choices: [
        { t: "Yes! I want to help the city.", ok: true,  fb: "Wonderful! +10" },
        { t: "Help is I want.",               ok: false, fb: "Word order: “I want to help.”" },
        { t: "I am a city!",                  ok: false, fb: "Haha, a city is big! Try “I want to help the city.”" } ] },
    { say: "Great! Today we need to pick up rubbish in the park.",
      card: { w: "pick up rubbish", pic: "🗑️", ex: "We pick up rubbish every Sunday." },
      choices: [
        { t: "I can pick up rubbish.", ok: true,  fb: "Thank you! Helping keeps the park clean. +10" },
        { t: "Rubbish pick up can I.", ok: false, fb: "Word order: “I can pick up rubbish.”" },
        { t: "I can eat the park.",    ok: false, fb: "Oops! Try “I can pick up rubbish.”" } ] },
    { say: "Thank you! Can you plant a tree too? Trees make the city cool.",
      card: { w: "plant a tree", pic: "🌳", ex: "We can plant a tree today." },
      q: { w: "Why are trees good?", pic: "🌿", ex: "Why are trees good for the city?" },
      choices: [
        { t: "Yes! Trees make the air clean.", ok: true,  fb: "Excellent! +10" },
        { t: "Tree is clean the air.",         ok: false, fb: "Word order: “Trees make the air clean.”" },
        { t: "Yes, I am a tree.",              ok: false, fb: "Haha! You are a student, not a tree :)" } ] }
  ]
},
{
  name: "Grace – Council Member", color: 0x364fc7, place: "townhall", x: -8, z: -12,
  steps: [
    { say: "Welcome to the meeting! What do you think about our city park?",
      card: { w: "I think…", pic: "💭", ex: "I think the park is nice." },
      q: { w: "What do you think of…?", pic: "💭", ex: "What do you think of our park?" },
      choices: [
        { t: "I think the park needs more trees.", ok: true,  fb: "Great opinion! Clear and polite. +10" },
        { t: "Park think I is more.",              ok: false, fb: "Word order: “I think the park needs more trees.”" },
        { t: "Yes, park is big park.",             ok: false, fb: "True! Now give your idea: “I think…”" } ] },
    { say: "Good idea! And what about the buses? They are often late.",
      card: { w: "We should…", pic: "🚌", ex: "We should have more buses." },
      choices: [
        { t: "We should have more buses.", ok: true,  fb: "Yes! “We should…” is perfect for ideas. +10" },
        { t: "Buses should more have we.", ok: false, fb: "Word order: “We should have more buses.”" },
        { t: "Bus is yellow and blue.",    ok: false, fb: "Colourful! But give an idea: “We should…”" } ] },
    { say: "Thank you! Your ideas are very helpful. We will think about them.",
      card: { w: "helpful", pic: "👍", ex: "Your ideas are very helpful." },
      q: { w: "Can you help us next time?", pic: "🙋", ex: "Can you help us next time?" },
      choices: [
        { t: "Thank you! I hope they help the city.", ok: true,  fb: "Lovely! Kind words for the city. +10" },
        { t: "Thank you! I am helpful.",              ok: false, fb: "Kind, but say “I hope they help the city.”" },
        { t: "Thank you! I want some pizza.",         ok: false, fb: "Yummy! Now try: “I hope they help the city.”" } ] }
  ]
},
{
  name: "Mr. Daniel – Vice Mayor", color: 0x7048e8, place: "townhall", x: 8, z: -12, minLv: 5,
  steps: [
    { say: "Hello! Would you like to help make our city better?",
      card: { w: "I would like to help.", pic: "🙋", ex: "I would like to help my city." },
      q: { w: "Why would you help?", pic: "❓", ex: "Why would you like to help?" },
      choices: [
        { t: "Yes, I would like to help my city.", ok: true,  fb: "Excellent! Polite and strong. +10" },
        { t: "Yes, city is I help would.",         ok: false, fb: "Word order: “I would like to help my city.”" },
        { t: "I would like a big pizza.",          ok: false, fb: "Pizza sounds fun! But try: “I would like to help.”" } ] },
    { say: "Good! Tell me one problem in our city, and why it is a problem.",
      card: { w: "too many cars", pic: "🚗", ex: "There are too many cars in the city." },
      q: { w: "What is one problem?", pic: "🤔", ex: "What is one problem in our city?" },
      choices: [
        { t: "There are too many cars because the roads are narrow.", ok: true,  fb: "Clear and smart! A good reason. +10" },
        { t: "Cars is too many, because road small.",                 ok: false, fb: "Almost! Say “There are too many cars because…”" },
        { t: "Cars are red and I like them.",                         ok: false, fb: "Nice colours! But tell a problem and a reason." } ] },
    { say: "Thank you! What should we do first to fix it?",
      card: { w: "We should build…", pic: "🏗️", ex: "We should build more bike lanes." },
      choices: [
        { t: "We should build bike lanes, because bikes are clean.", ok: true,  fb: "Excellent reasoning! +10" },
        { t: "Bridge new should we build.",                        ok: false, fb: "Word order: “We should build bike lanes.”" },
        { t: "Fish like the bridge a lot.",                        ok: false, fb: "Fish would love it! Now say what WE should do." } ] }
  ]
},
/* ----- City Hospital (hospital) ----- */
{
  name: "Jenny – Receptionist", color: 0x1098ad, place: "hospital", x: -6, z: 10,
  steps: [
    { say: "Hello! What’s your name, please?",
      card: { w: "first name", pic: "📛", ex: "My first name is Nam." },
      choices: [
        { t: "My name is Nam.",  ok: true,  fb: "Great! Short and clear. +10" },
        { t: "I am name Nam.",   ok: false, fb: "Word order: “My name is Nam.”" },
        { t: "Yes, I am ten.",   ok: false, fb: "Good to know, but first say your name." } ] },
    { say: "How old are you? And what’s the matter?",
      card: { w: "I have a headache.", pic: "🤕", ex: "I have a headache." },
      q: { w: "What’s the matter?", pic: "❓", ex: "What’s the matter?" },
      choices: [
        { t: "I’m ten. I have a headache.", ok: true,  fb: "Clear and complete! +10" },
        { t: "I have ten old headache.",    ok: false, fb: "Word order: “I’m ten. I have a headache.”" },
        { t: "I am headache.",              ok: false, fb: "Almost! Say “I have a headache.”" } ] },
    { say: "Please sit down. The doctor will see you soon.",
      card: { w: "I’ll sit down here.", pic: "🪑", ex: "I’ll sit down here." },
      choices: [
        { t: "Thank you. I’ll sit down here.", ok: true,  fb: "Polite and clear! +10" },
        { t: "Sit down is I here.",            ok: false, fb: "Word order: “I’ll sit down here.”" },
        { t: "Yes, I am the chair.",           ok: false, fb: "Haha! You are not a chair :) Try “I’ll sit down here.”" } ] }
  ]
},
{
  name: "Dr. Ngoc – Doctor", color: 0x228be6, place: "hospital", x: -9, z: -2,
  steps: [
    { say: "Hello! Where does it hurt?",
      card: { w: "My head hurts.", pic: "🤕", ex: "My head hurts a lot." },
      q: { w: "Where does it hurt?", pic: "🤔", ex: "Where does it hurt?" },
      choices: [
        { t: "My head hurts a lot.",        ok: true,  fb: "Clear! Doctors need to know where. +10" },
        { t: "I am head pain.",             ok: false, fb: "Almost! Say “My head hurts.”" },
        { t: "I like my doctor a lot.",     ok: false, fb: "Kind! But first tell me where it hurts." } ] },
    { say: "Let me check. Open your mouth, please.",
      card: { w: "Open your mouth.", pic: "😮", ex: "Open your mouth, please." },
      choices: [
        { t: "Okay. Ah!",                 ok: true,  fb: "Good job! That helps the doctor. +10" },
        { t: "Mouth open you.",           ok: false, fb: "Try “Okay. Ah!” Easy!" },
        { t: "No, I don’t like mouth.",   ok: false, fb: "It’s OK to feel a little shy. Try “Okay. Ah!”" } ] },
    { say: "You have a fever. Rest and drink lots of water.",
      card: { w: "drink lots of water", pic: "💧", ex: "I’ll drink lots of water." },
      choices: [
        { t: "Thank you, Doctor. I’ll rest and drink water.", ok: true,  fb: "Great! Following advice is smart. +10" },
        { t: "Water is drink me.",                            ok: false, fb: "Word order: “I’ll drink lots of water.”" },
        { t: "Doctor, I like pizza!",                         ok: false, fb: "Pizza is yummy later! Try “Thank you, Doctor.”" } ] }
  ]
},
{
  name: "Rosa – Pharmacist", color: 0x66a80f, place: "hospital", x: 13.5, z: 2,
  steps: [
    { say: "Hello! Here is your medicine. Do you know how to take it?",
      card: { w: "after meals", pic: "🍽️", ex: "Take the pills after meals." },
      q: { w: "How do I take it?", pic: "💊", ex: "How do I take it?" },
      choices: [
        { t: "I’ll take it after meals.", ok: true,  fb: "Perfect! +10" },
        { t: "After meals is I take.",    ok: false, fb: "Word order: “I’ll take it after meals.”" },
        { t: "I’ll take it on the bus.",  ok: false, fb: "Ha! Not on the bus :) Try “after meals.”" } ] },
    { say: "Take one pill three times a day. Got it?",
      card: { w: "three times a day", pic: "3️⃣", ex: "I take it three times a day." },
      choices: [
        { t: "Got it! Three times a day, after meals.", ok: true,  fb: "Great! You repeated it clearly. +10" },
        { t: "Three day times, I am.",                  ok: false, fb: "Word order: “three times a day.”" },
        { t: "Medicine is a blue box.",                 ok: false, fb: "Nice box! But say when: “three times a day.”" } ] },
    { say: "Good! Drink lots of water and rest. Get well soon!",
      card: { w: "get well soon", pic: "🌈", ex: "I hope you get well soon." },
      choices: [
        { t: "Thank you! I hope I get well soon.", ok: true,  fb: "Lovely wish! +10" },
        { t: "Thank you! I am soon well.",         ok: false, fb: "Almost! Say “I hope I get well soon.”" },
        { t: "Thank you! I like pills very much.", ok: false, fb: "Pills are not candy! Say “Thank you!”" } ] }
  ]
},
{
  name: "Bao – Young Patient", color: 0xf59f00, place: "hospital", x: -8, z: -15,
  steps: [
    { say: "Hi! I broke my arm. But I feel better now!",
      card: { w: "feel better", pic: "😊", ex: "I feel better today." },
      choices: [
        { t: "I’m glad you feel better!", ok: true,  fb: "Kind and happy! +10" },
        { t: "You are a broken arm!",     ok: false, fb: "Oops! Try “I’m glad you feel better.”" },
        { t: "Yes, I broke a pizza.",     ok: false, fb: "Pizza is yummy! But say “I’m glad you feel better.”" } ] },
    { say: "Thank you! My arm is in a plaster cast. Can you sign it?",
      card: { w: "plaster cast", pic: "🦴", ex: "My arm is in a plaster cast." },
      q: { w: "Can you sign it?", pic: "✍️", ex: "Can you sign my plaster cast?" },
      choices: [
        { t: "Sure! I’ll sign it.",   ok: true,  fb: "Great! Nice and friendly. +10" },
        { t: "Sign I am it.",         ok: false, fb: "Word order: “I’ll sign it.”" },
        { t: "Plaster is very cold!", ok: false, fb: "It is a bit cold! Say “Sure! I’ll sign it.”" } ] },
    { say: "I can play football again soon!",
      card: { w: "again", pic: "🔁", ex: "I can play again soon." },
      choices: [
        { t: "That’s great! You can play again soon.", ok: true,  fb: "Lovely news! +10" },
        { t: "I am football again.",                   ok: false, fb: "Almost! Say “You can play again soon.”" },
        { t: "Yes, I like cake and cats.",             ok: false, fb: "Cake and cats are nice! Now say: “You can play again soon.”" } ] }
  ]
},
{
  name: "Ada – Lab Scientist", color: 0x5c7cfa, place: "hospital", x: 8, z: -15, minLv: 5,
  steps: [
    { say: "Hello! Look through the microscope. What can you see?",
      card: { w: "bacteria", pic: "🦠", ex: "Bacteria are very tiny." },
      q: { w: "What can you see?", pic: "🔬", ex: "What can you see?" },
      choices: [
        { t: "I can see some tiny bacteria.", ok: true,  fb: "Great observation! +10" },
        { t: "Microscope is see I.",          ok: false, fb: "Word order: “I can see some tiny bacteria.”" },
        { t: "Bacteria is a big cat.",        ok: false, fb: "Haha! Bacteria are tiny, not big cats :)" } ] },
    { say: "Bacteria can make you sick. How can we stop them?",
      card: { w: "wash your hands", pic: "🧼", ex: "Wash your hands with soap." },
      q: { w: "How can we stop germs?", pic: "🧼", ex: "How can we stop germs?" },
      choices: [
        { t: "We should wash our hands with soap.", ok: true,  fb: "Correct! Soap helps remove germs. +10" },
        { t: "We should play with bacteria.",       ok: false, fb: "Careful! Bacteria can make us sick. Try “wash our hands.”" },
        { t: "Hands are very big.",                 ok: false, fb: "They are! But how do we stop germs?" } ] },
    { say: "Good! Scientists also make vaccines. A vaccine helps your body fight germs.",
      card: { w: "vaccine", pic: "💉", ex: "A vaccine helps you stay healthy." },
      choices: [
        { t: "A vaccine helps my body fight germs.", ok: true,  fb: "Excellent science! +10" },
        { t: "Vaccine is my body fight.",            ok: false, fb: "Word order: “A vaccine helps my body fight germs.”" },
        { t: "A vaccine is a cold pizza.",           ok: false, fb: "Haha! Vaccines are medicine, not pizza." } ] }
  ]
},
{
  name: "Hana – Visitor", color: 0xc2255c, place: "hospital", x: 6, z: 12,
  steps: [
    { say: "Excuse me! Where is the children’s ward?",
      card: { w: "ward", pic: "🛏️", ex: "The ward is at the back, on the left." },
      q: { w: "Where is the ward?", pic: "🛏️", ex: "Where is the ward, please?" },
      choices: [
        { t: "It’s at the back, on the left.", ok: true,  fb: "Clear directions! +10" },
        { t: "Back left it at is.",  ok: false, fb: "Word order: “It’s at the back, on the left.”" },
        { t: "I am a nurse!",             ok: false, fb: "Haha! You are a visitor :) Try “It’s at the back, on the left.”" } ] },
    { say: "Thank you! Is it far from here?",
      card: { w: "not far", pic: "🚶", ex: "It’s not far from here." },
      choices: [
        { t: "No, it’s not far. Just go straight.", ok: true,  fb: "Helpful! +10" },
        { t: "Far, far, I like stairs.",            ok: false, fb: "Ha! Try “No, it’s not far.”" },
        { t: "Yes, the stairs are my friend.",      ok: false, fb: "Friendly stairs! But they asked how far. Try “It’s not far.”" } ] },
    { say: "Thank you! We are waiting for our turn.",
      card: { w: "our turn", pic: "🙋", ex: "It’s our turn now!" },
      choices: [
        { t: "Sure! I hope it’s your turn soon.", ok: true,  fb: "Kind words! +10" },
        { t: "Our turn I am.",                    ok: false, fb: "Word order: “It’s our turn now!”" },
        { t: "Yes, I like turns on the bus.",     ok: false, fb: "Buses are fun! Try “I hope it’s your turn soon.”" } ] }
  ]
},
/* ----- Verse School (school) ----- */
{
  name: "Mr. Kim – Science Teacher", color: 0x0ca678, place: "school", x: -11, z: -7,
  steps: [
    { say: "Hello, class! Today we will learn about magnets. Are you ready?",
      card: { w: "magnet", pic: "🧲", ex: "This magnet picks up nails." },
      q: { w: "Are you ready?", pic: "🙋", ex: "Are you ready for science?" },
      choices: [
        { t: "Yes, I’m ready!",        ok: true,  fb: "Great energy! +10" },
        { t: "I ready am.",            ok: false, fb: "Word order: “I’m ready!” is easy." },
        { t: "Magnets are my pets!",   ok: false, fb: "Haha, pets! Try: “Yes, I’m ready!”" } ] },
    { say: "A magnet pulls metal. Can it pull a paper clip?",
      card: { w: "pull", pic: "🧲", ex: "A magnet can pull metal." },
      choices: [
        { t: "Yes, it can pull a paper clip.", ok: true,  fb: "Correct! Metal sticks to magnets. +10" },
        { t: "Yes, magnet can paper pull.",    ok: false, fb: "Word order: “Yes, it can pull a paper clip.”" },
        { t: "Paper clip is very red.",        ok: false, fb: "Red is nice! But the question is: can the magnet pull it?" } ] },
    { say: "Excellent! Now tell me, what did the magnet do?",
      card: { w: "stuck to", pic: "📎", ex: "The paper clip is stuck to the magnet." },
      q: { w: "What did it do?", pic: "🔍", ex: "What did the magnet do?" },
      choices: [
        { t: "The paper clip stuck to the magnet.",   ok: true,  fb: "Perfect past tense! +10" },
        { t: "Clip magnet to stuck.",           ok: false, fb: "Word order: “The paper clip stuck to the magnet.”" },
        { t: "The magnet is a nail, I think.",  ok: false, fb: "Ha! A magnet is not a nail. Try “stuck to”." } ] }
  ]
},
{
  name: "Ruby – Art Teacher", color: 0xd6336c, place: "school", x: 11, z: -7,
  steps: [
    { say: "Hi! Do you like painting or music?",
      card: { w: "I like to paint.", pic: "🎨", ex: "I like to paint pictures." },
      q: { w: "Painting or music?", pic: "🎵", ex: "Do you like painting or music?" },
      choices: [
        { t: "I like to paint pictures.", ok: true,  fb: "Lovely! +10" },
        { t: "Paint is like I.",          ok: false, fb: "Word order: “I like to paint pictures.”" },
        { t: "Yes, music is my brother.", ok: false, fb: "Fun idea! But tell me: “I like to paint pictures.”" } ] },
    { say: "Good! Let’s mix colours. What do you want to make?",
      card: { w: "mix colours", pic: "🎨", ex: "Let’s mix colours together." },
      choices: [
        { t: "I want to make green.", ok: true,  fb: "Nice! Blue and yellow make green. +10" },
        { t: "Colour is mix me.",     ok: false, fb: "Word order: “I want to make green.”" },
        { t: "Paint is my dog!",      ok: false, fb: "Ha! Dogs and paint... Try “I want to make green.”" } ] },
    { say: "Wonderful! Can you play the guitar?",
      card: { w: "guitar", pic: "🎸", ex: "I can play the guitar." },
      q: { w: "Can you play…?", pic: "🎸", ex: "Can you play the guitar?" },
      choices: [
        { t: "No, I can’t. But I can sing a song!", ok: true,  fb: "Great! Singing counts too. +10" },
        { t: "Yes, I can guitar play.",             ok: false, fb: "Word order: “I can play the guitar.”" },
        { t: "Guitar is a big cake.",               ok: false, fb: "Haha! Guitars make music, not cake :)" } ] }
  ]
},
{
  name: "Nam – Student", color: 0x3b5bdb, place: "school", x: -11, z: 9,
  steps: [
    { say: "Oh no! I forgot my homework. What should I do?",
      card: { w: "I forgot…", pic: "😵", ex: "I forgot my homework today." },
      q: { w: "What should I do?", pic: "🤔", ex: "What should I do?" },
      choices: [
        { t: "Don’t worry. Ask the teacher.", ok: true,  fb: "Kind advice! +10" },
        { t: "Homework is you forgot I.",     ok: false, fb: "Word order: “I forgot my homework.”" },
        { t: "Homework is a big cake.",       ok: false, fb: "Ha! Homework is not cake. Try: “Don’t worry.”" } ] },
    { say: "Thank you! Do you want to play tag at break time?",
      card: { w: "play tag", pic: "🏃", ex: "Let’s play tag at break time." },
      choices: [
        { t: "Yes, let’s play tag at break time!", ok: true,  fb: "Fun! +10" },
        { t: "Tag is play, yes, I.",               ok: false, fb: "Word order: “Yes, let’s play tag!”" },
        { t: "No, I am a tag.",                    ok: false, fb: "Ha! You are a student :) Try “Yes, let’s play tag!”" } ] },
    { say: "Great! See you at break. Bring your ball!",
      card: { w: "See you at break", pic: "⏰", ex: "See you at break!" },
      choices: [
        { t: "OK! See you at break time.", ok: true,  fb: "Perfect! +10" },
        { t: "See break you at time.",     ok: false, fb: "Word order: “See you at break time.”" },
        { t: "Ball is my bag, bye.",       ok: false, fb: "Ha! Try: “OK! See you at break time.”" } ] }
  ]
},
{
  name: "Mrs. Bich – Canteen Lady", color: 0xf08c00, place: "school", x: 11, z: 9, minLv: 5,
  steps: [
    { say: "Hello! Would you like soup or rice today?",
      card: { w: "I’d prefer…", pic: "🍲", ex: "I’d prefer the soup, please." },
      q: { w: "Soup or rice?", pic: "🍚", ex: "Would you prefer soup or rice?" },
      choices: [
        { t: "I’d prefer the soup, please.", ok: true,  fb: "Excellent! Polite and clear. +10" },
        { t: "Soup is my prefer.",           ok: false, fb: "Word order: “I’d prefer the soup.”" },
        { t: "I am soup hot.",               ok: false, fb: "Almost! Say “I’d prefer the soup.”" } ] },
    { say: "Good choice! That’s five thousand dong. Would you like a drink too?",
      card: { w: "I’ll have…", pic: "🥤", ex: "I’ll have a juice, please." },
      choices: [
        { t: "I’ll have a juice, please.", ok: true,  fb: "Great! +10" },
        { t: "Juice have I please will.",  ok: false, fb: "Word order: “I’ll have a juice, please.”" },
        { t: "No, juice is for my shoes.", ok: false, fb: "Haha! Shoes don’t drink juice. Try “I’ll have a juice, please.”" } ] },
    { say: "Here you are. Be careful, the soup is hot!",
      card: { w: "be careful", pic: "⚠️", ex: "Be careful, it’s hot!" },
      q: { w: "Is it hot?", pic: "🌡️", ex: "Is the soup hot?" },
      choices: [
        { t: "Thank you! I’ll be careful.", ok: true,  fb: "Sensible! Hot soup needs care. +10" },
        { t: "Careful is me be.",           ok: false, fb: "Word order: “I’ll be careful.”" },
        { t: "Hot soup is my friend, yes.", ok: false, fb: "Soup is not a friend! Try “I’ll be careful.”" } ] }
  ]
},
/* ----- Banh Mi Bakery (bakery) ----- */
{
  name: "Minh – Baker Helper", color: 0xe8590c, place: "bakery", x: -5, z: -2,
  steps: [
    { say: "Hi! I make the bread here. Would you like a warm roll?",
      card: { w: "I’d like a roll.", pic: "🥖", ex: "I’d like a warm roll, please." },
      q: { w: "Would you like a roll?", pic: "🥯", ex: "Would you like a warm roll?" },
      choices: [
        { t: "Yes, I’d like a warm roll, please.", ok: true,  fb: "Yummy! Great order. +10" },
        { t: "Roll warm I like a, yes.",          ok: false, fb: "Word order: “I’d like a warm roll, please.”" },
        { t: "Yes, I am a roll.",                 ok: false, fb: "Haha! You are not bread :) Try “I’d like a warm roll.”" } ] },
    { say: "Here it is! The bread came out of the oven this morning.",
      card: { w: "came out of the oven", pic: "🔥", ex: "The bread came out of the oven." },
      q: { w: "Where did the bread come from?", pic: "❓", ex: "Where did the bread come from?" },
      choices: [
        { t: "It came out of the oven this morning.", ok: true,  fb: "Correct! Past tense: came. +10" },
        { t: "Bread is oven of the this came.",       ok: false, fb: "Word order: “It came out of the oven.”" },
        { t: "The bread is a big blue hat.",          ok: false, fb: "Ha! Bread is not a hat :) Try “It came out of the oven.”" } ] },
    { say: "Can you help me? Please put the bread on the shelf.",
      card: { w: "I’ll put it on the shelf.", pic: "🥖", ex: "I’ll put it on the shelf now." },
      choices: [
        { t: "OK! I’ll put it on the shelf.", ok: true,  fb: "Thank you! Very helpful. +10" },
        { t: "Shelf is put I on the it.",     ok: false, fb: "Word order: “I’ll put it on the shelf.”" },
        { t: "Yes, I can sing the shelf.",    ok: false, fb: "Singing is nice, but first the bread! Try “I’ll put it on the shelf.”" } ] }
  ]
},
{
  name: "Grandma Tam – Customer", color: 0x9c36b5, place: "bakery", x: 5, z: -2,
  steps: [
    { say: "Excuse me, how much is the cake? It looks lovely!",
      card: { w: "twenty thousand dong", pic: "💰", ex: "It’s twenty thousand dong." },
      q: { w: "How much is it?", pic: "💰", ex: "How much is the cake?" },
      choices: [
        { t: "It’s twenty thousand dong.", ok: true,  fb: "Correct! Say the number, then “dong”. +10" },
        { t: "Thousand twenty dong it’s.", ok: false, fb: "Word order: “It’s twenty thousand dong.”" },
        { t: "The cake is very old.",      ok: false, fb: "Ha! Cakes here are fresh :) Try “It’s twenty thousand dong.”" } ] },
    { say: "Do you like sweet cakes? I love the strawberry tart!",
      card: { w: "I like sweet cakes.", pic: "🍓", ex: "I like sweet cakes very much." },
      choices: [
        { t: "Yes, I like sweet cakes very much!", ok: true,  fb: "Lovely! Sweet things make me happy too. +10" },
        { t: "Yes, I like cakes sweet very much.", ok: false, fb: "Almost! Put the adjective first: “sweet cakes”." },
        { t: "Yes, I am a strawberry tart.",       ok: false, fb: "Haha! You are not a tart :) Try “I like sweet cakes.”" } ] },
    { say: "I will make a cake tomorrow. Will you come to my party?",
      card: { w: "I will come.", pic: "🎉", ex: "Yes, I will come to your party." },
      choices: [
        { t: "Yes, I will come to your party!", ok: true,  fb: "Lovely! will + verb. +10" },
        { t: "Party will I come to yes your.",  ok: false, fb: "Word order: “Yes, I will come to your party.”" },
        { t: "Yes, I can cake the party.",      ok: false, fb: "Almost! Say “I will come to your party.”" } ] }
  ]
},
{
  name: "Lucy – Tourist", color: 0x5f3dc4, place: "bakery", x: -5, z: 4,
  steps: [
    { say: "Hi! Do you know what this bread is called?",
      card: { w: "It’s called banh mi.", pic: "🥖", ex: "It’s called banh mi. It’s tasty!" },
      q: { w: "What is it called?", pic: "❓", ex: "What is this bread called?" },
      choices: [
        { t: "It’s called banh mi. It’s tasty!", ok: true,  fb: "Yes! Banh mi is a Vietnamese sandwich. +10" },
        { t: "Called it banh mi is.",            ok: false, fb: "Word order: “It’s called banh mi.”" },
        { t: "Bread is a green dog, I think.",   ok: false, fb: "Haha! Dogs don’t make bread :) Try “It’s called banh mi.”" } ] },
    { say: "I’m hungry! What do you recommend for lunch?",
      card: { w: "I suggest…", pic: "⭐", ex: "I suggest the banh mi. It’s delicious!" },
      choices: [
        { t: "I recommend the banh mi. It’s delicious!", ok: true,  fb: "Great advice! +10" },
        { t: "Recommend the is I bread banh.",          ok: false, fb: "Word order: “I recommend the banh mi.”" },
        { t: "Lunch is my big yellow car.",             ok: false, fb: "Ha! Lunch is not a car :) Try “I recommend the banh mi.”" } ] },
    { say: "Did you eat bread for breakfast yesterday?",
      card: { w: "I ate bread.", pic: "🍞", ex: "I ate bread for breakfast." },
      choices: [
        { t: "Yes, I ate bread for breakfast.", ok: true,  fb: "Great! Past tense: ate. +10" },
        { t: "Breakfast is eat I bread yes.",   ok: false, fb: "Word order: “I ate bread for breakfast.”" },
        { t: "Yesterday I am a red bicycle.",   ok: false, fb: "Haha! Bicycles don’t eat bread :) Try “I ate bread.”" } ] }
  ]
},
{
  name: "Mrs. Thao – Shopper", color: 0xd6336c, place: "bakery", x: 5, z: 4, minLv: 5,
  steps: [
    { say: "Hi! My son wants cake. Should I buy bread instead?",
      card: { w: "I think you should…", pic: "🤔", ex: "I think you should buy bread." },
      q: { w: "Cake or bread?", pic: "🍰", ex: "Should I buy cake or bread?" },
      choices: [
        { t: "I think you should buy bread, because it’s healthier.", ok: true,  fb: "Excellent! A clear reason with “because”. +10" },
        { t: "Bread should buy you I think.",                          ok: false, fb: "Word order: “I think you should buy bread.”" },
        { t: "Cake is my son, yes.",                                   ok: false, fb: "Haha! Your son is not a cake :) Try “I think you should…”" } ] },
    { say: "Good idea! Which one is more filling: the banh mi or the roll?",
      card: { w: "is more filling than", pic: "⚖️", ex: "The banh mi is more filling than the roll." },
      choices: [
        { t: "The banh mi is more filling than the roll.", ok: true,  fb: "Great comparison! +10" },
        { t: "Filling more banh mi is than the roll.",     ok: false, fb: "Word order: “The banh mi is more filling than the roll.”" },
        { t: "Roll is my car, it is very fast.",           ok: false, fb: "Ha! Rolls are not cars :) Try “…more filling than the roll.”" } ] },
    { say: "I’ll take the bread now. What will you do after this?",
      card: { w: "I will go to the park.", pic: "🌳", ex: "I will go to the park with my son." },
      choices: [
        { t: "I will go to the park with my son.", ok: true,  fb: "Lovely plan! will + verb. +10" },
        { t: "Park will go I to the my son.",       ok: false, fb: "Word order: “I will go to the park.”" },
        { t: "I will eat the park, yes.",           ok: false, fb: "Ha! Parks are not for eating :) Try “I will go to the park.”" } ] }
  ]
},
/* ----- Pho Corner (restaurant) ----- */
{
  name: "Trang – Waiter", color: 0xc92a2a, place: "restaurant", x: -5, z: -2,
  steps: [
    { say: "Hi! Welcome to Pho Corner! How many people today?",
      card: { w: "Two people, please.", pic: "🍽️", ex: "Two people, please. Thank you." },
      q: { w: "How many people?", pic: "👥", ex: "How many people are there?" },
      choices: [
        { t: "A table for two, please.",    ok: true,  fb: "Great! Short and polite. +10" },
        { t: "Two table is please for me.", ok: false, fb: "Word order: “A table for two, please.”" },
        { t: "Yes, I am a table.",          ok: false, fb: "Haha! You are not a table :) Try “A table for two, please.”" } ] },
    { say: "Here is the menu. Do you want pho or fried rice?",
      card: { w: "I’d like the pho.", pic: "🍜", ex: "I’d like the pho, please." },
      q: { w: "Pho or fried rice?", pic: "🍜", ex: "Do you want pho or fried rice?" },
      choices: [
        { t: "I’d like the pho, please.", ok: true,  fb: "Yummy choice! +10" },
        { t: "Pho like I please would.",  ok: false, fb: "Word order: “I’d like the pho, please.”" },
        { t: "Fried rice is my cat.",     ok: false, fb: "Ha! Cats don’t eat fried rice :) Try “I’d like the pho.”" } ] },
    { say: "Your pho is ready! Be careful, the bowl is hot.",
      card: { w: "It smells good!", pic: "👃", ex: "It smells good! Thank you." },
      choices: [
        { t: "It smells good! Thank you very much.", ok: true,  fb: "Yes! Polite and happy. +10" },
        { t: "Good smell is it, bowl hot me.",       ok: false, fb: "Word order: “It smells good!”" },
        { t: "Bowl is my friend, yes.",              ok: false, fb: "Ha! A bowl is not a friend :) Try “It smells good!”" } ] }
  ]
},
{
  name: "Khoa – Kid Diner", color: 0x1098ad, place: "restaurant", x: 5, z: -2,
  steps: [
    { say: "I’m very hungry! What is your favourite food?",
      card: { w: "My favourite food is…", pic: "⭐", ex: "My favourite food is pho." },
      q: { w: "What’s your favourite food?", pic: "❓", ex: "What is your favourite food?" },
      choices: [
        { t: "My favourite food is pho. It’s delicious!", ok: true,  fb: "Yum! Good answer. +10" },
        { t: "Food favourite is my pho, yes.",            ok: false, fb: "Word order: “My favourite food is pho.”" },
        { t: "I am a favourite spoon.",                   ok: false, fb: "Ha! You are not a spoon :) Try “My favourite food is…”" } ] },
    { say: "Can you pass me the salt, please? Thank you!",
      card: { w: "Here you are.", pic: "🧂", ex: "Here you are. Take the salt." },
      choices: [
        { t: "Here you are!",         ok: true,  fb: "Thank you! Very kind. +10" },
        { t: "Salt is you here are.", ok: false, fb: "Word order: “Here you are.”" },
        { t: "No, salt is a fish.",   ok: false, fb: "Ha! Salt is not a fish :) Try “Here you are.”" } ] },
    { say: "Yesterday I ate pho with my dad. What did you eat yesterday?",
      card: { w: "I ate…", pic: "🍜", ex: "I ate rice and fish yesterday." },
      q: { w: "What did you eat?", pic: "🕒", ex: "What did you eat yesterday?" },
      choices: [
        { t: "I ate rice and fish yesterday.", ok: true,  fb: "Great! Past tense: ate. +10" },
        { t: "Yesterday eat I rice and fish.", ok: false, fb: "Word order: “I ate rice and fish yesterday.”" },
        { t: "Yesterday I am a red bicycle.",  ok: false, fb: "Haha! Bicycles don’t eat rice :) Try “I ate…”" } ] }
  ]
},
{
  name: "Emma – Tourist", color: 0xf08c00, place: "restaurant", x: -5, z: 4,
  steps: [
    { say: "Hi! Is this soup spicy? I don’t like chilli.",
      card: { w: "It isn’t very spicy.", pic: "🌶️", ex: "No, it isn’t very spicy. Try it!" },
      q: { w: "Is it spicy?", pic: "🌶️", ex: "Is this soup spicy?" },
      choices: [
        { t: "No, it isn’t very spicy. Try it!", ok: true,  fb: "Good! Friendly and clear. +10" },
        { t: "Not spicy very it is, no.",        ok: false, fb: "Word order: “No, it isn’t very spicy.”" },
        { t: "Soup is blue, my friend.",         ok: false, fb: "Ha! The soup is not blue :) Try “No, it isn’t very spicy.”" } ] },
    { say: "What is in pho? I can see noodles and meat!",
      card: { w: "beef and noodles", pic: "🍜", ex: "Pho has beef and noodles." },
      choices: [
        { t: "Pho has beef and noodles in it.", ok: true,  fb: "Yes! That’s pho. +10" },
        { t: "Beef has pho and noodles me.",    ok: false, fb: "Word order: “Pho has beef and noodles.”" },
        { t: "Pho is a red shoe, I think.",     ok: false, fb: "Ha! Pho is soup, not shoes :) Try “Pho has beef and noodles.”" } ] },
    { say: "Can I take a photo of the lantern? It’s so pretty!",
      card: { w: "Yes, you can.", pic: "📷", ex: "Yes, you can take a photo." },
      choices: [
        { t: "Yes, you can take a photo. Enjoy!", ok: true,  fb: "Nice! Enjoy your visit. +10" },
        { t: "Photo can lantern you yes take.",   ok: false, fb: "Word order: “Yes, you can take a photo.”" },
        { t: "No, lantern is my cat.",            ok: false, fb: "Haha! Lanterns are not cats :) Try “Yes, you can.”" } ] }
  ]
},
{
  name: "Mr. Dat – Food Critic", color: 0x495057, place: "restaurant", x: 5, z: 4, minLv: 5,
  steps: [
    { say: "This pho is better than yesterday’s, I think. Do you agree?",
      card: { w: "I agree, because…", pic: "👍", ex: "I agree, because the broth is tastier." },
      q: { w: "Do you agree?", pic: "🤔", ex: "Do you agree with me?" },
      choices: [
        { t: "I agree, because the broth is tastier.", ok: true,  fb: "Excellent! A clear reason with “because”. +10" },
        { t: "Better is agree I, because soup.",       ok: false, fb: "Word order: “I agree, because the broth is tastier.”" },
        { t: "Yesterday is my cat, yes.",              ok: false, fb: "Haha! Cats don’t eat pho :) Try “I agree, because…”" } ] },
    { say: "Which is more delicious: spring rolls or soup?",
      card: { w: "more delicious than", pic: "⚖️", ex: "Soup is more delicious than spring rolls." },
      q: { w: "Which is more delicious?", pic: "⚖️", ex: "Which is more delicious, spring rolls or soup?" },
      choices: [
        { t: "I think soup is more delicious than spring rolls.", ok: true,  fb: "Great comparison! +10" },
        { t: "Soup more delicious is than rolls I.",               ok: false, fb: "Word order: “Soup is more delicious than spring rolls.”" },
        { t: "Spring rolls are hungry bicycles.",                  ok: false, fb: "Ha! Rolls are not bicycles :) Try “…more delicious than…”" } ] },
    { say: "I will write a review tomorrow. Will you come back soon?",
      card: { w: "I will come back.", pic: "🔁", ex: "Yes, I will come back soon." },
      choices: [
        { t: "Yes, I will come back soon, because it’s great!", ok: true,  fb: "Lovely! will + verb. +10" },
        { t: "Back come will I soon yes.",                       ok: false, fb: "Word order: “Yes, I will come back soon.”" },
        { t: "Review is a big elephant.",                        ok: false, fb: "Ha! Reviews are not elephants :) Try “Yes, I will come back.”" } ] }
  ]
},
/* ----- Shop 24h (supermarket) ----- */
{
  name: "Tuyet – Shop Assistant", color: 0x2f9e44, place: "supermarket", x: -5, z: -2,
  steps: [
    { say: "Hello! Can I help you? We have fresh fruit today.",
      card: { w: "Can I have an apple?", pic: "🍎", ex: "Can I have an apple, please?" },
      q: { w: "Can I help you?", pic: "🙋", ex: "Can I help you?" },
      choices: [
        { t: "Yes, please. Can I have an apple?", ok: true,  fb: "Polite and clear! +10" },
        { t: "Apple is have I can yes.",          ok: false, fb: "Word order: “Can I have an apple?”" },
        { t: "I am an apple, thank you.",         ok: false, fb: "Haha! You are not a fruit :) Try “Can I have an apple?”" } ] },
    { say: "A plastic bag costs one thousand dong. Do you want one?",
      card: { w: "No, thank you.", pic: "👜", ex: "No, thank you. I have a bag." },
      choices: [
        { t: "No, thank you. I have a bag.", ok: true,  fb: "Good! Saving bags is great. +10" },
        { t: "Bag thank you no have I.",     ok: false, fb: "Word order: “No, thank you. I have a bag.”" },
        { t: "Yes, I am a plastic bag.",     ok: false, fb: "Haha! Bags don’t talk :) Try “No, thank you.”" } ] },
    { say: "Your total is fifty thousand dong. Can you pay now?",
      card: { w: "Here is the money.", pic: "💵", ex: "Here is the money, thank you." },
      choices: [
        { t: "Here is the money. Thank you!", ok: true,  fb: "Perfect! Money first, then thanks. +10" },
        { t: "Money is the here, thank you.", ok: false, fb: "Word order: “Here is the money.”" },
        { t: "Fifty thousand is my dog.",     ok: false, fb: "Haha! Dogs don’t pay :) Try “Here is the money.”" } ] }
  ]
},
{
  name: "Bin – Kid Shopper", color: 0xf59f00, place: "supermarket", x: 5, z: -2,
  steps: [
    { say: "Hi! I love snacks! What is your favourite snack?",
      card: { w: "My favourite snack is…", pic: "🍿", ex: "My favourite snack is popcorn." },
      q: { w: "Favourite snack?", pic: "🍿", ex: "What is your favourite snack?" },
      choices: [
        { t: "My favourite snack is popcorn. And you?", ok: true,  fb: "Yum! A friendly question back. +10" },
        { t: "Snack favourite is popcorn my.",          ok: false, fb: "Word order: “My favourite snack is popcorn.”" },
        { t: "I am a snack, I think.",                  ok: false, fb: "Haha! You are a friend, not a snack :) Try “My favourite snack is…”" } ] },
    { say: "I have ten thousand dong. Is it enough for a soda?",
      card: { w: "Yes, it’s enough.", pic: "✅", ex: "Yes, it’s enough for a soda." },
      choices: [
        { t: "Yes, it’s enough for a soda!", ok: true,  fb: "Great counting! +10" },
        { t: "Enough it’s yes soda a for.",  ok: false, fb: "Word order: “Yes, it’s enough for a soda.”" },
        { t: "No, soda is my shoes.",        ok: false, fb: "Haha! Shoes don’t drink soda :) Try “Yes, it’s enough.”" } ] },
    { say: "I drank a soda after school. Did you drink water yesterday?",
      card: { w: "I drank water.", pic: "💧", ex: "I drank water yesterday after school." },
      choices: [
        { t: "Yes, I drank water yesterday after school.", ok: true,  fb: "Great! Past tense: drank. +10" },
        { t: "Water drank yesterday I after yes.",          ok: false, fb: "Word order: “I drank water yesterday.”" },
        { t: "Yesterday water is my bicycle.",              ok: false, fb: "Ha! Water is not a bicycle :) Try “I drank water.”" } ] }
  ]
},
{
  name: "Jack – Tourist", color: 0x1c7ed6, place: "supermarket", x: -5, z: 4,
  steps: [
    { say: "Excuse me! Where are the cold drinks?",
      card: { w: "in the fridge", pic: "🧊", ex: "The cold drinks are in the fridge." },
      q: { w: "Where are the drinks?", pic: "❓", ex: "Where are the cold drinks?" },
      choices: [
        { t: "They’re in the fridge, over there.", ok: true,  fb: "Correct! Use “in the fridge”. +10" },
        { t: "Fridge in drinks cold the are.",     ok: false, fb: "Word order: “They’re in the fridge.”" },
        { t: "Drinks are very tall, I think.",     ok: false, fb: "Ha! Drinks are not tall :) Try “They’re in the fridge.”" } ] },
    { say: "Thanks! Is the orange juice fresh today?",
      card: { w: "Yes, it’s fresh.", pic: "🍊", ex: "Yes, it’s very fresh today." },
      choices: [
        { t: "Yes, it’s very fresh today!", ok: true,  fb: "Great! Short and clear. +10" },
        { t: "Fresh is very it yes today.", ok: false, fb: "Word order: “Yes, it’s very fresh today.”" },
        { t: "Juice is a fresh bicycle.",   ok: false, fb: "Ha! Juice is not a bicycle :) Try “Yes, it’s very fresh.”" } ] },
    { say: "I will buy two bottles. Can you help me carry them?",
      card: { w: "I can help you.", pic: "🤝", ex: "Yes, I can help you carry them." },
      choices: [
        { t: "Yes, I can help you carry them.", ok: true,  fb: "Kind! can + verb. +10" },
        { t: "Help can I you carry yes them.",  ok: false, fb: "Word order: “Yes, I can help you carry them.”" },
        { t: "Bottles can fly to the moon.",    ok: false, fb: "Ha! Bottles can’t fly :) Try “Yes, I can help you.”" } ] }
  ]
},
{
  name: "Mr. Long – Dad Shopper", color: 0x099268, place: "supermarket", x: 5, z: 4, minLv: 5,
  steps: [
    { say: "My daughter wants snacks. Which is healthier: crisps or fruit?",
      card: { w: "is healthier than", pic: "🥗", ex: "Fruit is healthier than crisps." },
      q: { w: "Which is healthier?", pic: "🥗", ex: "Which is healthier, crisps or fruit?" },
      choices: [
        { t: "I think fruit is healthier, because it’s natural.", ok: true,  fb: "Excellent! A clear reason with “because”. +10" },
        { t: "Healthier fruit is than crisps I.",                 ok: false, fb: "Word order: “Fruit is healthier than crisps.”" },
        { t: "Crisps are my shoes, I think.",                     ok: false, fb: "Ha! Shoes are not snacks :) Try “Fruit is healthier…”" } ] },
    { say: "Okay, I’ll buy fruit. Should I buy mangoes or grapes?",
      card: { w: "You should buy mangoes.", pic: "🥭", ex: "You should buy mangoes, because they’re sweet." },
      choices: [
        { t: "You should buy mangoes, because they’re sweet.", ok: true,  fb: "Good advice! should + verb. +10" },
        { t: "Mangoes should buy you, because sweet.",          ok: false, fb: "Word order: “You should buy mangoes.”" },
        { t: "Grapes are a loud drum, I think.",                ok: false, fb: "Ha! Grapes are not drums :) Try “You should buy mangoes.”" } ] },
    { say: "What will you do after the shop? Maybe you will go home.",
      card: { w: "I will go home.", pic: "🏠", ex: "I will go home and eat dinner." },
      choices: [
        { t: "I will go home and eat dinner with my family.", ok: true,  fb: "Lovely plan! will + verb. +10" },
        { t: "Home will I go and dinner eat.",                ok: false, fb: "Word order: “I will go home and eat dinner.”" },
        { t: "Dinner is my pencil, yes.",                     ok: false, fb: "Ha! Pencils don’t eat dinner :) Try “I will go home.”" } ] }
  ]
},
/* ----- Green Cross Pharmacy (pharmacy) ----- */
{
  name: "Pim – Pharmacy Helper", color: 0x0b7285, place: "pharmacy", x: -5, z: -2,
  steps: [
    { say: "Hello! How can I help you today?",
      card: { w: "I have a sore throat.", pic: "🤒", ex: "I have a sore throat today." },
      q: { w: "How can I help?", pic: "🙋", ex: "How can I help you today?" },
      choices: [
        { t: "I have a sore throat today.", ok: true,  fb: "Great! Clear and short. +10" },
        { t: "Throat sore I have a today.", ok: false, fb: "Word order: “I have a sore throat today.”" },
        { t: "I am a sore pharmacist.",     ok: false, fb: "Haha! You are not a pharmacist :) Try “I have a sore throat.”" } ] },
    { say: "Please ask a grown-up before you take any medicine. OK?",
      card: { w: "I will tell my mum.", pic: "👩", ex: "Yes, I will tell my mum first." },
      choices: [
        { t: "Yes, I will tell my mum first.", ok: true,  fb: "Very wise! Safety first. +10" },
        { t: "Mum first tell I will yes.",     ok: false, fb: "Word order: “Yes, I will tell my mum first.”" },
        { t: "Medicine is a big blue cloud.",  ok: false, fb: "Ha! Medicine is not a cloud :) Try “I will tell my mum.”" } ] },
    { say: "We have bandages and plasters. What do you need?",
      card: { w: "I need a plaster.", pic: "🩹", ex: "I need a plaster for my knee." },
      choices: [
        { t: "I need a plaster for my knee, please.", ok: true,  fb: "Great! Short and clear. +10" },
        { t: "Plaster need I a knee for.",            ok: false, fb: "Word order: “I need a plaster for my knee.”" },
        { t: "Knee is my plaster, I think.",          ok: false, fb: "Ha! A knee is not a plaster :) Try “I need a plaster.”" } ] }
  ]
},
{
  name: "Tony – Little Patient", color: 0xe03131, place: "pharmacy", x: 5, z: -2,
  steps: [
    { say: "Ouch! I fell down. My knee hurts!",
      card: { w: "Don’t worry.", pic: "😊", ex: "Don’t worry. Let’s clean it first." },
      q: { w: "Does it hurt?", pic: "❓", ex: "Does your knee hurt?" },
      choices: [
        { t: "Don’t worry. Let’s clean it first.", ok: true,  fb: "Kind words! +10" },
        { t: "Worry clean is knee, don’t.",       ok: false, fb: "Word order: “Don’t worry. Let’s clean it first.”" },
        { t: "Your knee is a big mountain!",      ok: false, fb: "Ha! A knee is not a mountain :) Try “Don’t worry.”" } ] },
    { say: "Can you give me a plaster? Please!",
      card: { w: "Here is a plaster.", pic: "🩹", ex: "Here is a plaster for you." },
      choices: [
        { t: "Here is a plaster for you.",  ok: true,  fb: "Thank you for helping! +10" },
        { t: "Plaster is you here, a for.", ok: false, fb: "Word order: “Here is a plaster for you.”" },
        { t: "Plasters are people, yes!",   ok: false, fb: "Haha! Plasters are not people :) Try “Here is a plaster.”" } ] },
    { say: "Thank you! I fell yesterday too. Did you fall before?",
      card: { w: "I fell off my bike.", pic: "🚲", ex: "I fell off my bike yesterday." },
      choices: [
        { t: "Yes, I fell off my bike yesterday.", ok: true,  fb: "Great! Past tense: fell. +10" },
        { t: "Bike off fell yesterday my I.",      ok: false, fb: "Word order: “I fell off my bike yesterday.”" },
        { t: "Yes, my bike is a big fish.",        ok: false, fb: "Ha! Bikes are not fish :) Try “I fell off my bike.”" } ] }
  ]
},
{
  name: "Grandpa Thanh – Customer", color: 0x868e96, place: "pharmacy", x: -5, z: 4,
  steps: [
    { say: "Good morning! I feel tired. What should I do?",
      card: { w: "You should rest.", pic: "😴", ex: "You should drink water and rest." },
      q: { w: "What should I do?", pic: "🤔", ex: "What should I do when I feel tired?" },
      choices: [
        { t: "You should drink water and rest a little.", ok: true,  fb: "Good advice! should + verb. +10" },
        { t: "Water should drink you tired, yes.",         ok: false, fb: "Word order: “You should drink water and rest.”" },
        { t: "Tired is a big yellow boat.",                ok: false, fb: "Ha! Tired is a feeling, not a boat :) Try “You should…”" } ] },
    { say: "Can you read this label for me? It’s too small.",
      card: { w: "It says…", pic: "🔍", ex: "It says: take one tablet a day." },
      choices: [
        { t: "Yes, it says: take one tablet a day.", ok: true,  fb: "Good reading! Ask a pharmacist if unsure. +10" },
        { t: "Tablet day one take a, it says.",       ok: false, fb: "Word order: “It says: take one tablet a day.”" },
        { t: "The label is a red bird.",             ok: false, fb: "Ha! Labels are not birds :) Try “Yes, it says…”" } ] },
    { say: "Thank you! I’ll buy it tomorrow. Will you come with me?",
      card: { w: "I will come with you.", pic: "🤝", ex: "Yes, I will come with you." },
      choices: [
        { t: "Yes, I will come with you tomorrow!", ok: true,  fb: "Lovely! will + verb. +10" },
        { t: "Come with you will I yes, tomorrow.", ok: false, fb: "Word order: “Yes, I will come with you.”" },
        { t: "Tomorrow is my dinosaur, I think.",   ok: false, fb: "Ha! Dinosaurs are not days :) Try “Yes, I will come with you.”" } ] }
  ]
},
{
  name: "Mrs. Yen – Mum Shopper", color: 0xae3ec9, place: "pharmacy", x: 5, z: 4, minLv: 5,
  steps: [
    { say: "My son has a cold. Should I ask the pharmacist first?",
      card: { w: "You should ask the pharmacist.", pic: "💬", ex: "You should ask the pharmacist first, because children need care." },
      q: { w: "What should I do?", pic: "❓", ex: "What should I do for my son?" },
      choices: [
        { t: "Yes, you should ask the pharmacist, because children need care.", ok: true,  fb: "Excellent! Safety first, with a reason. +10" },
        { t: "Pharmacist should ask you, because son.",                           ok: false, fb: "Word order: “You should ask the pharmacist.”" },
        { t: "Cold is a big red banana.",                                         ok: false, fb: "Ha! A cold is not a banana :) Try “You should ask the pharmacist.”" } ] },
    { say: "Which is easier for him to take: syrup or pills?",
      card: { w: "is easier than", pic: "🧴", ex: "Syrup is easier than pills." },
      q: { w: "Which is easier?", pic: "🧴", ex: "Which is easier, syrup or pills?" },
      choices: [
        { t: "I think syrup is easier, because children like it.", ok: true,  fb: "Good comparison and reason! +10" },
        { t: "Easier syrup is than pills I.",                       ok: false, fb: "Word order: “Syrup is easier than pills.”" },
        { t: "Pills are my green shoes.",                           ok: false, fb: "Ha! Pills are not shoes :) Try “Syrup is easier…”" } ] },
    { say: "Thank you for helping! I’ll come back tomorrow. Will you be here?",
      card: { w: "Yes, I will be here.", pic: "😊", ex: "Yes, I will be here tomorrow." },
      choices: [
        { t: "Yes, I will be here tomorrow. See you!", ok: true,  fb: "Nice! See you soon. +10" },
        { t: "Here be will I tomorrow, yes.",          ok: false, fb: "Word order: “Yes, I will be here tomorrow.”" },
        { t: "Tomorrow is a bear, I think.",           ok: false, fb: "Ha! Tomorrow is a day, not a bear :) Try “Yes, I will be here.”" } ] }
  ]
}

];

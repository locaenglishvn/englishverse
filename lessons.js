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
  name: "Ms. Hoa – Teacher", color: 0x1971c2, place: "school", x: 0, z: -3.6,
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
}

/* ===== NPC: townhall – thêm các NPC (bắt đầu bằng ",{") ngay dưới dòng này ===== */
,{
  name: "Ms. Hanh – Service Clerk", color: 0x1971c2, place: "townhall", x: -16.6, z: 10.5,
  steps: [
    {
      "say": "Good morning! How can I help you?",
      "q": {
        "w": "How can I help you?",
        "pic": "🙋",
        "ex": "How can I help you?"
      },
      "card": {
        "w": "I'd like to…",
        "pic": "🪪",
        "ex": "I'd like to get an ID card."
      },
      "choices": [
        {
          "t": "I'd like to get an ID card.",
          "ok": true,
          "fb": "Clear! +10"
        },
        {
          "t": "I like ID card get.",
          "ok": false,
          "fb": "Say “I'd like to…”"
        },
        {
          "t": "Good morning, I am fine.",
          "ok": false,
          "fb": "She asks how she can help :)"
        }
      ]
    },
    {
      "say": "Sure. Please fill in this form. Write your name and address.",
      "card": {
        "w": "fill in",
        "pic": "📝",
        "ex": "Please fill in this form."
      },
      "choices": [
        {
          "t": "I fill in the pen.",
          "ok": false,
          "fb": "Say “I'll fill in the form.”"
        },
        {
          "t": "OK. Can I borrow a pen, please?",
          "ok": true,
          "fb": "Polite! +10"
        },
        {
          "t": "I'll eat the form.",
          "ok": false,
          "fb": "Please don't eat it :)"
        }
      ]
    },
    {
      "say": "Thank you. Your ID card will be ready in two days.",
      "card": {
        "w": "ready in two days",
        "pic": "📅",
        "ex": "It will be ready in two days."
      },
      "choices": [
        {
          "t": "Great. I'll come back in two days.",
          "ok": true,
          "fb": "Good listening! +10"
        },
        {
          "t": "Two days ready it.",
          "ok": false,
          "fb": "Say “I'll come back in two days.”"
        },
        {
          "t": "No, I am ready today.",
          "ok": false,
          "fb": "The card will be ready, not you :)"
        }
      ]
    }
  ]
}
,{
  name: "Mr. Dung – Visitor Guide", color: 0x2b8a3e, place: "townhall", x: 13.6, z: -11.6,
  steps: [
    {
      "say": "Do you know when this building was built?",
      "q": {
        "w": "Do you know…?",
        "pic": "🤔",
        "ex": "Do you know when it was built?"
      },
      "card": {
        "w": "was built in",
        "pic": "🏗️",
        "ex": "It was built in 1908."
      },
      "choices": [
        {
          "t": "It built in 1908.",
          "ok": false,
          "fb": "Say “It was built in 1908.”"
        },
        {
          "t": "It was built in 1908.",
          "ok": true,
          "fb": "Correct! +10"
        },
        {
          "t": "It was built tomorrow.",
          "ok": false,
          "fb": "Look at the plaque :)"
        }
      ]
    },
    {
      "say": "Yes! French architects designed it. It has tall windows and big stairs.",
      "card": {
        "w": "architect",
        "pic": "📐",
        "ex": "An architect designs buildings."
      },
      "choices": [
        {
          "t": "Windows is tall many.",
          "ok": false,
          "fb": "Say “The windows are tall.”"
        },
        {
          "t": "I love the big stairs and the chandeliers!",
          "ok": true,
          "fb": "Lovely! +10"
        },
        {
          "t": "Architect are big stairs.",
          "ok": false,
          "fb": "An architect is a person :)"
        }
      ]
    },
    {
      "say": "People visit from all over the world. Would you like to take a photo?",
      "card": {
        "w": "Would you like to…?",
        "pic": "📷",
        "ex": "Would you like to take a photo?"
      },
      "choices": [
        {
          "t": "Yes, please. Could you take it for me?",
          "ok": true,
          "fb": "Polite! +10"
        },
        {
          "t": "Yes, I photo you.",
          "ok": false,
          "fb": "Say “Yes, please.”"
        },
        {
          "t": "No, I'm a window.",
          "ok": false,
          "fb": "Funny! But answer the question :)"
        }
      ]
    }
  ]
}
,{
  name: "Ms. Thao – Receptionist", color: 0x862e9c, place: "townhall", x: 9.6, z: -4.8,
  steps: [
    {
      "say": "Hello! Are you here for the meeting?",
      "q": {
        "w": "Are you here for…?",
        "pic": "🙋",
        "ex": "Are you here for the meeting?"
      },
      "card": {
        "w": "I'm here to…",
        "pic": "🏛️",
        "ex": "I'm here to see the mayor."
      },
      "choices": [
        {
          "t": "No, I'm here to see the mayor.",
          "ok": true,
          "fb": "Clear! +10"
        },
        {
          "t": "I'm here see mayor.",
          "ok": false,
          "fb": "Say “I'm here to see the mayor.”"
        },
        {
          "t": "Yes, I am a table.",
          "ok": false,
          "fb": "Try “No, I'm here to…”"
        }
      ]
    },
    {
      "say": "The mayor is busy now. Please wait in the Reception Hall.",
      "card": {
        "w": "Please wait",
        "pic": "⏳",
        "ex": "Please wait here for ten minutes."
      },
      "choices": [
        {
          "t": "How long wait I?",
          "ok": false,
          "fb": "Say “How long do I have to wait?”"
        },
        {
          "t": "I want to eat.",
          "ok": false,
          "fb": "Ask about the waiting time :)"
        },
        {
          "t": "OK. How long do I have to wait?",
          "ok": true,
          "fb": "Good question! +10"
        }
      ]
    },
    {
      "say": "About ten minutes. Would you like some water?",
      "card": {
        "w": "Would you like some…?",
        "pic": "💧",
        "ex": "Would you like some water?"
      },
      "choices": [
        {
          "t": "Yes, please. Thank you.",
          "ok": true,
          "fb": "Polite! +10"
        },
        {
          "t": "Water is thank you.",
          "ok": false,
          "fb": "Say “Yes, please.”"
        },
        {
          "t": "Yes, I am water.",
          "ok": false,
          "fb": "Say “Yes, please.” :)"
        }
      ]
    }
  ]
}
,{
  name: "Duy – Quest Hunter", color: 0xe8590c, place: "townhall", x: 14.2, z: 12.6,
  steps: [
    {
      "say": "Look! This is the Quest Board. New quests are coming soon!",
      "card": {
        "w": "coming soon",
        "pic": "✨",
        "ex": "New quests are coming soon."
      },
      "choices": [
        {
          "t": "Coming soon is yesterday.",
          "ok": false,
          "fb": "“Soon” means in a short time :)"
        },
        {
          "t": "Wow! I can't wait!",
          "ok": true,
          "fb": "Excited! +10"
        },
        {
          "t": "Quest is a dinner.",
          "ok": false,
          "fb": "A quest is a mission :)"
        }
      ]
    },
    {
      "say": "I want a quest with a big reward. What kind of quest do you like?",
      "q": {
        "w": "What kind of…?",
        "pic": "🎯",
        "ex": "What kind of quest do you like?"
      },
      "card": {
        "w": "reward",
        "pic": "🎁",
        "ex": "I want a big reward."
      },
      "choices": [
        {
          "t": "I like quests with treasure.",
          "ok": true,
          "fb": "Great! +10"
        },
        {
          "t": "Like quest treasure I.",
          "ok": false,
          "fb": "Say “I like quests with treasure.”"
        },
        {
          "t": "I like to sleep.",
          "ok": false,
          "fb": "Talk about quests :)"
        }
      ]
    },
    {
      "say": "Great! Please check the board again tomorrow.",
      "card": {
        "w": "check again",
        "pic": "🔄",
        "ex": "Please check the board again."
      },
      "choices": [
        {
          "t": "Tomorrow I come back will.",
          "ok": false,
          "fb": "Say “I'll come back tomorrow.”"
        },
        {
          "t": "I checked the board yesterday.",
          "ok": false,
          "fb": "He said TOMORROW :)"
        },
        {
          "t": "OK. I'll come back tomorrow.",
          "ok": true,
          "fb": "Good listener! +10"
        }
      ]
    }
  ]
}
,{
  name: "Mrs. Nga – Lost Visitor", color: 0xd6336c, place: "townhall", x: -3.8, z: 11.5,
  steps: [
    {
      "say": "Excuse me! Where is the post office?",
      "q": {
        "w": "Where is…?",
        "pic": "🗺️",
        "ex": "Where is the post office?"
      },
      "card": {
        "w": "Go straight",
        "pic": "⬆️",
        "ex": "Go straight and turn left."
      },
      "choices": [
        {
          "t": "Go out and go straight. It's on your right.",
          "ok": true,
          "fb": "Clear directions! +10"
        },
        {
          "t": "Post office is go there.",
          "ok": false,
          "fb": "Say “Go straight. It's on your right.”"
        },
        {
          "t": "I am a visitor, too.",
          "ok": false,
          "fb": "Try to help her :)"
        }
      ]
    },
    {
      "say": "Is it far from here?",
      "card": {
        "w": "on foot",
        "pic": "🚶",
        "ex": "It's five minutes on foot."
      },
      "choices": [
        {
          "t": "Far it is not.",
          "ok": false,
          "fb": "Say “No, it's not far.”"
        },
        {
          "t": "Yes, it's on the moon.",
          "ok": false,
          "fb": "Funny! But it is near :)"
        },
        {
          "t": "No, it's not far. It's five minutes on foot.",
          "ok": true,
          "fb": "Perfect! +10"
        }
      ]
    },
    {
      "say": "Thank you so much! You are very kind.",
      "card": {
        "w": "You're welcome",
        "pic": "😊",
        "ex": "You're welcome! Have a nice trip."
      },
      "choices": [
        {
          "t": "You're welcome. Have a nice trip!",
          "ok": true,
          "fb": "Friendly! +10"
        },
        {
          "t": "No welcome.",
          "ok": false,
          "fb": "Say “You're welcome.”"
        },
        {
          "t": "You are kind, too thank.",
          "ok": false,
          "fb": "Say “You're welcome!”"
        }
      ]
    }
  ]
}
,{
  name: "Mr. Phong – City Planner", color: 0x0b7285, place: "townhall", x: -14, z: -11, minLv: 5,
  steps: [
    {
      "say": "I design streets and parks. Could you tell me what our city needs?",
      "q": {
        "w": "Could you tell me…?",
        "pic": "🙋",
        "ex": "Could you tell me the way to the library?"
      },
      "card": {
        "w": "I think we need…",
        "pic": "💭",
        "ex": "I think we need more parks."
      },
      "choices": [
        {
          "t": "Need more parks I think.",
          "ok": false,
          "fb": "Say “I think we need more parks.”"
        },
        {
          "t": "I think we need more parks for children.",
          "ok": true,
          "fb": "Good idea! +10"
        },
        {
          "t": "We need no city.",
          "ok": false,
          "fb": "Give an idea :)"
        }
      ]
    },
    {
      "say": "Good idea! Parks make people happy. How should people travel in the city?",
      "q": {
        "w": "How should…?",
        "pic": "🚦",
        "ex": "How should people travel?"
      },
      "card": {
        "w": "instead of",
        "pic": "🚌",
        "ex": "Take the bus instead of a car."
      },
      "choices": [
        {
          "t": "They should to take bus.",
          "ok": false,
          "fb": "Say “They should take the bus.”"
        },
        {
          "t": "They should fly with eggs.",
          "ok": false,
          "fb": "Be realistic :)"
        },
        {
          "t": "They should take the bus instead of cars.",
          "ok": true,
          "fb": "Great thinking! +10"
        }
      ]
    },
    {
      "say": "Great! If you have an idea, please tell me. Would you like to write it down?",
      "card": {
        "w": "If you have an idea…",
        "pic": "💡",
        "ex": "If you have an idea, tell me."
      },
      "choices": [
        {
          "t": "Yes. If I have an idea, I'll tell you.",
          "ok": true,
          "fb": "Excellent! +10"
        },
        {
          "t": "If I will have idea tell.",
          "ok": false,
          "fb": "Say “If I have an idea, I'll tell you.”"
        },
        {
          "t": "No, ideas are heavy.",
          "ok": false,
          "fb": "Ideas are light :)"
        }
      ]
    }
  ]
}


/* ===== NPC: hospital – thêm các NPC (bắt đầu bằng ",{") ngay dưới dòng này ===== */
,{
  name: "Ms. Hanh – Receptionist", color: 0x2fb894, place: "hospital", x: -21, z: 12.3,
  steps: [
    { say: "Good morning! Can I help you?",
      q: { w: "Can I help you?", pic: "🙋", ex: "Can I help you?" },
      card: { w: "I'd like to see a doctor.", pic: "🩺", ex: "I'd like to see a doctor, please." },
      choices: [
        { t: "I'd like to see a doctor, please.", ok: true, fb: "Polite and clear! +10" },
        { t: "I want see doctor.", ok: false, fb: "Say “I’d like to see a doctor.”" },
        { t: "I am a doctor.", ok: false, fb: "Haha :) Say “I’d like to see a doctor.”" } ] },
    { say: "Please take a number and wait here. Your number is twenty-three.",
      card: { w: "Take a number.", pic: "🎫", ex: "Please take a number." },
      choices: [
        { t: "OK. I'll wait here.", ok: true, fb: "Good listening! +10" },
        { t: "I go home now.", ok: false, fb: "Please wait a little :)" },
        { t: "Number is twenty-three yes.", ok: false, fb: "Try “OK, I’ll wait here.”" } ] },
    { say: "Your doctor is in the Children's Clinic. Go down the corridor and turn left.",
      q: { w: "Where is…?", pic: "📍", ex: "Where is the Children's Clinic?" },
      card: { w: "down the corridor", pic: "➡️", ex: "Go down the corridor." },
      choices: [
        { t: "Thank you! I'll go down the corridor.", ok: true, fb: "You listened well! +10" },
        { t: "Corridor where?", ok: false, fb: "Say “Thank you! I’ll go down the corridor.”" },
        { t: "I turn right.", ok: false, fb: "Listen again: turn LEFT :)" } ] }
  ]
}
,{
  name: "Dr. Hung – ER Doctor", color: 0x1c7ed6, place: "hospital", x: -19.6, z: 1.2, minLv: 5,
  steps: [
    { say: "A boy fell off his bike. He hurt his arm.",
      card: { w: "hurt his arm", pic: "💪", ex: "He fell and hurt his arm." },
      choices: [
        { t: "Oh no! Is he OK now?", ok: true, fb: "Kind question! +10" },
        { t: "He is hurting arm yesterday.", ok: false, fb: "Try “Is he OK now?”" },
        { t: "I like your bike.", ok: false, fb: "Funny :) But the boy needs help." } ] },
    { say: "We took an X-ray. His arm isn't broken. It's only a sprain.",
      card: { w: "sprain", pic: "🩹", ex: "A sprain is a small injury, not a broken bone." },
      choices: [
        { t: "That's good news. His arm isn't broken.", ok: true, fb: "You understood! +10" },
        { t: "His arm not break.", ok: false, fb: "Say “His arm isn’t broken.”" },
        { t: "It's a bad news.", ok: false, fb: "Listen: NOT broken. Good news!" } ] },
    { say: "He must rest for three days. What should he do next time?",
      q: { w: "What should…?", pic: "🤔", ex: "What should he do next time?" },
      card: { w: "He should rest.", pic: "😴", ex: "He should rest and wear a helmet." },
      choices: [
        { t: "He should wear a helmet when he rides.", ok: true, fb: "Great advice! +10" },
        { t: "He must to run.", ok: false, fb: "Try “He should wear a helmet.”" },
        { t: "He should play football tomorrow.", ok: false, fb: "A hurt arm needs rest :)" } ] }
  ]
}
,{
  name: "Khoa – Paramedic", color: 0xe03131, place: "hospital", x: -24.5, z: 7.6,
  steps: [
    { say: "I'm a paramedic. I help people in an emergency.",
      card: { w: "emergency", pic: "🚨", ex: "Call 115 in an emergency." },
      choices: [
        { t: "Wow! Your job is important.", ok: true, fb: "Nice! +10" },
        { t: "Emergency is eat.", ok: false, fb: "Not food :) Say “Your job is important.”" },
        { t: "I am emergency too.", ok: false, fb: "Try “Your job is important.”" } ] },
    { say: "First I check the patient. Then I take him to the hospital quickly.",
      card: { w: "quickly", pic: "⚡", ex: "The ambulance goes quickly." },
      choices: [
        { t: "The ambulance goes very quickly!", ok: true, fb: "Good! +10" },
        { t: "Ambulance go quick very.", ok: false, fb: "Say “goes very quickly.”" },
        { t: "It goes slowly.", ok: false, fb: "Listen: QUICKLY :)" } ] },
    { say: "Do you know what number to call for an ambulance in Vietnam?",
      q: { w: "Do you know…?", pic: "❓", ex: "Do you know the number?" },
      card: { w: "Call one-one-five.", pic: "📞", ex: "Call 115 for an ambulance." },
      choices: [
        { t: "You call one-one-five.", ok: true, fb: "Correct! 115 +10" },
        { t: "You call one-one-three.", ok: false, fb: "113 is the police. Ambulance is one-one-five." },
        { t: "You call your friend.", ok: false, fb: "In an emergency, call one-one-five." } ] }
  ]
}
,{
  name: "Dr. Thao – Paediatrician", color: 0xf08c00, place: "hospital", x: -10.5, z: -12.5,
  steps: [
    { say: "Hello! What's the matter?",
      q: { w: "What's the matter?", pic: "🩺", ex: "What's the matter?" },
      card: { w: "I have a headache.", pic: "🤕", ex: "I have a headache and a fever." },
      choices: [
        { t: "I have a headache.", ok: true, fb: "Clear! +10" },
        { t: "I am headache.", ok: false, fb: "Say “I have a headache.”" },
        { t: "My head is hurt?", ok: false, fb: "Try “I have a headache.”" } ] },
    { say: "Open your mouth and say Ahh. Does your throat hurt?",
      card: { w: "Open your mouth.", pic: "😮", ex: "Open your mouth, please." },
      choices: [
        { t: "Yes, it hurts a little.", ok: true, fb: "Good! +10" },
        { t: "Yes, it is pain.", ok: false, fb: "Say “It hurts.”" },
        { t: "My mouth is open.", ok: false, fb: "Answer her question: “Yes, it hurts.”" } ] },
    { say: "You have a cold. Drink warm water and sleep early.",
      card: { w: "Get some rest.", pic: "😴", ex: "Get some rest and drink water." },
      choices: [
        { t: "OK, I'll drink water and sleep early.", ok: true, fb: "Well done! +10" },
        { t: "I drink yesterday water.", ok: false, fb: "Say “I’ll drink water.”" },
        { t: "I will play all night.", ok: false, fb: "The doctor says sleep early :)" } ] }
  ]
}
,{
  name: "Bin – Little Patient", color: 0x74c0fc, place: "hospital", x: -21, z: -8.5,
  steps: [
    { say: "I don't feel well. I have a stomach ache.",
      card: { w: "stomach ache", pic: "🤢", ex: "I have a stomach ache." },
      choices: [
        { t: "I'm sorry to hear that. Sit down, please.", ok: true, fb: "Kind! +10" },
        { t: "You are happy?", ok: false, fb: "Bin feels sick, not happy." },
        { t: "Sorry I stomach.", ok: false, fb: "Try “I’m sorry to hear that.”" } ] },
    { say: "The doctor wants to give me an injection. I'm scared!",
      card: { w: "I'm scared.", pic: "😨", ex: "I'm scared of the dark." },
      choices: [
        { t: "Don't worry. It's quick and you'll feel better.", ok: true, fb: "Comforting! +10" },
        { t: "You are scary.", ok: false, fb: "“Scared” = afraid. Say “Don’t worry.”" },
        { t: "Run away fast!", ok: false, fb: "Be kind: “Don’t worry.”" } ] },
    { say: "I was brave! Now I want to be healthy. What should I eat?",
      q: { w: "What should I…?", pic: "🥦", ex: "What should I eat?" },
      card: { w: "healthy food", pic: "🥦", ex: "Fruit and vegetables are healthy food." },
      choices: [
        { t: "Eat fruit and vegetables every day.", ok: true, fb: "Healthy choice! +10" },
        { t: "Eat candy every day.", ok: false, fb: "Candy isn't healthy :)" },
        { t: "Don't eat anything.", ok: false, fb: "We need healthy food!" } ] }
  ]
}
,{
  name: "Dr. Duc – Dentist", color: 0x12b886, place: "hospital", x: -22.2, z: -20.7,
  steps: [
    { say: "Open your mouth, please. I can see a small hole in this tooth.",
      card: { w: "a hole in the tooth", pic: "🦷", ex: "There is a hole in my tooth." },
      choices: [
        { t: "Oh no! Does it hurt?", ok: true, fb: "Good question! +10" },
        { t: "My tooth is a window.", ok: false, fb: "Haha, ask “Does it hurt?”" },
        { t: "I have hole tooth.", ok: false, fb: "Try “Does it hurt?”" } ] },
    { say: "No, it doesn't hurt. How often do you brush your teeth?",
      q: { w: "How often…?", pic: "🪥", ex: "How often do you brush your teeth?" },
      card: { w: "twice a day", pic: "🪥", ex: "I brush my teeth twice a day." },
      choices: [
        { t: "I brush them twice a day.", ok: true, fb: "Excellent! +10" },
        { t: "I brush it one day.", ok: false, fb: "Say “twice a day.”" },
        { t: "I don't brush.", ok: false, fb: "Please brush: “twice a day.”" } ] },
    { say: "Good! Brush in the morning and before bed. Don't eat too many sweets.",
      card: { w: "too many sweets", pic: "🍬", ex: "Don't eat too many sweets." },
      choices: [
        { t: "OK. I won't eat too many sweets.", ok: true, fb: "Healthy smile! +10" },
        { t: "I eat many sweets.", ok: false, fb: "Try “I won’t eat too many sweets.”" },
        { t: "I brush the sweets.", ok: false, fb: "Haha! Say “I won’t eat too many sweets.”" } ] }
  ]
}
,{
  name: "Dr. Eva – Eye Doctor", color: 0x845ef7, place: "hospital", x: -15, z: -30.2,
  steps: [
    { say: "Look at the chart. Can you read the letters?",
      q: { w: "Can you…?", pic: "👁️", ex: "Can you read the letters?" },
      card: { w: "Can you read…?", pic: "👁️", ex: "I can read the first letter." },
      choices: [
        { t: "Yes, I can. The first letter is E.", ok: true, fb: "Sharp eyes! +10" },
        { t: "I can reading.", ok: false, fb: "Say “I can read.”" },
        { t: "Yes, I eat E.", ok: false, fb: "Say “The first letter is E.”" } ] },
    { say: "Please cover your left eye. Now read the next line.",
      card: { w: "cover your eye", pic: "🙈", ex: "Cover your left eye with your hand." },
      choices: [
        { t: "OK. The next line is F, P.", ok: true, fb: "Great! +10" },
        { t: "I cover eyes both.", ok: false, fb: "Only the LEFT eye :)" },
        { t: "Which is left eye?", ok: false, fb: "Try “OK. F, P.”" } ] },
    { say: "Your eyes are fine. Don't read in the dark or look at your phone too long.",
      card: { w: "take a break", pic: "⏸️", ex: "Take a break from your phone." },
      choices: [
        { t: "OK. I'll take a break from my phone.", ok: true, fb: "Healthy eyes! +10" },
        { t: "I look phone all night.", ok: false, fb: "Rest your eyes: “I’ll take a break.”" },
        { t: "Phone is my eye.", ok: false, fb: "Try “I’ll take a break.”" } ] }
  ]
}
,{
  name: "Mr. Long – X-ray Technician", color: 0x4263eb, place: "hospital", x: 13.5, z: 4.5,
  steps: [
    { say: "We're going to take an X-ray of your arm. Please stand here.",
      card: { w: "Stand here, please.", pic: "🧍", ex: "Stand here, please." },
      choices: [
        { t: "OK. I'm ready.", ok: true, fb: "Good! +10" },
        { t: "I standing here.", ok: false, fb: "Say “OK. I’m ready.”" },
        { t: "No, I sit.", ok: false, fb: "Please stand here :)" } ] },
    { say: "Keep still. Don't move. Take a deep breath.",
      card: { w: "Don't move.", pic: "✋", ex: "Don't move, please." },
      choices: [
        { t: "I'll keep still.", ok: true, fb: "Well done! +10" },
        { t: "I moving now.", ok: false, fb: "Say “I’ll keep still.”" },
        { t: "I run.", ok: false, fb: "Please keep still :)" } ] },
    { say: "All done! The doctor will look at the picture. Your bones look strong.",
      card: { w: "strong", pic: "💪", ex: "Strong bones help you run." },
      choices: [
        { t: "Great! Thank you for your help.", ok: true, fb: "Polite! +10" },
        { t: "Bones is strong thank.", ok: false, fb: "Say “Thank you for your help.”" },
        { t: "I want another X-ray.", ok: false, fb: "All done! Say thank you :)" } ] }
  ]
}
,{
  name: "Ms. Quyen – Lab Scientist", color: 0x40c057, place: "hospital", x: 16.5, z: -7.3, minLv: 5,
  steps: [
    { say: "Welcome to the lab! Have you ever looked through a microscope?",
      q: { w: "Have you ever…?", pic: "🔬", ex: "Have you ever looked through a microscope?" },
      card: { w: "germs", pic: "🦠", ex: "Washing your hands stops germs." },
      choices: [
        { t: "No, I haven't. Can I try?", ok: true, fb: "Curious scientist! +10" },
        { t: "Yes, I look yesterday.", ok: false, fb: "Say “Yes, I have” or “No, I haven’t.”" },
        { t: "I have never microscope.", ok: false, fb: "Try “No, I haven’t. Can I try?”" } ] },
    { say: "Germs live on our hands, our phones and our desks. Why do we wash our hands?",
      q: { w: "Why do we…?", pic: "🧼", ex: "Why do we wash our hands?" },
      card: { w: "to stop germs", pic: "🧼", ex: "We wash our hands to stop germs." },
      choices: [
        { t: "We wash our hands to stop germs.", ok: true, fb: "Smart! +10" },
        { t: "To make hands blue.", ok: false, fb: "Haha, no :)" },
        { t: "Because soap is nice.", ok: false, fb: "Nice, but the main reason is germs." } ] },
    { say: "If you wash your hands for twenty seconds, you'll stop many germs.",
      q: { w: "If you…, you'll…", pic: "⏱️", ex: "If you wash your hands, you'll stop germs." },
      card: { w: "twenty seconds", pic: "⏱️", ex: "Wash for twenty seconds." },
      choices: [
        { t: "I'll wash my hands before I eat.", ok: true, fb: "Healthy habit! +10" },
        { t: "I wash hands one second.", ok: false, fb: "Longer: twenty seconds :)" },
        { t: "I will wash my phone in soup.", ok: false, fb: "Haha! Try “I’ll wash my hands before I eat.”" } ] }
  ]
}
,{
  name: "Mr. Phat – Pharmacist", color: 0x2f9e44, place: "hospital", x: 23.2, z: 21.5,
  steps: [
    { say: "Here is your medicine. Take this medicine twice a day.",
      card: { w: "twice a day", pic: "💊", ex: "Take it twice a day." },
      choices: [
        { t: "Twice a day. I understand.", ok: true, fb: "Good! +10" },
        { t: "Two day a twice.", ok: false, fb: "Say “Twice a day.”" },
        { t: "I take the medicine two.", ok: false, fb: "Try “Twice a day. I understand.”" } ] },
    { say: "Take one pill after breakfast and one pill after dinner.",
      card: { w: "after breakfast", pic: "🍳", ex: "Take one pill after breakfast." },
      choices: [
        { t: "One after breakfast and one after dinner.", ok: true, fb: "Perfect! +10" },
        { t: "Pills eat breakfast.", ok: false, fb: "Say “One after breakfast.”" },
        { t: "One pill for dinner only.", ok: false, fb: "Two pills: breakfast AND dinner." } ] },
    { say: "Don't take more than two pills a day. Keep medicine away from small children.",
      card: { w: "Keep it away.", pic: "🧒", ex: "Keep medicine away from children." },
      choices: [
        { t: "OK. I'll keep it in a safe place.", ok: true, fb: "Safe! +10" },
        { t: "I give pills to my brother.", ok: false, fb: "Medicine is not for brothers :)" },
        { t: "I take ten pills.", ok: false, fb: "No! Only two pills a day." } ] }
  ]
}
,{
  name: "Mrs. Trang – Worried Parent", color: 0xe64980, place: "hospital", x: -16, z: 24,
  steps: [
    { say: "My son has a high fever. I'm very worried.",
      card: { w: "I'm worried.", pic: "😟", ex: "I'm worried about my son." },
      choices: [
        { t: "Don't worry. The doctor will help him.", ok: true, fb: "Kind! +10" },
        { t: "You are very happy.", ok: false, fb: "She is worried, not happy." },
        { t: "Your son is worry.", ok: false, fb: "Say “Don’t worry.”" } ] },
    { say: "His temperature is thirty-nine degrees. He feels hot and tired.",
      card: { w: "temperature", pic: "🌡️", ex: "The temperature is thirty-eight degrees." },
      choices: [
        { t: "He should drink water and rest.", ok: true, fb: "Good advice! +10" },
        { t: "He should go swimming.", ok: false, fb: "A sick boy needs rest :)" },
        { t: "He should eat a lot of ice cream.", ok: false, fb: "Try “He should drink water and rest.”" } ] },
    { say: "Thank you. Where can I buy some medicine?",
      q: { w: "Where can I…?", pic: "📍", ex: "Where can I buy medicine?" },
      card: { w: "on the right", pic: "➡️", ex: "The pharmacy is on the right." },
      choices: [
        { t: "The pharmacy is over there on the right.", ok: true, fb: "Helpful! +10" },
        { t: "Pharmacy is eat.", ok: false, fb: "Point and say “It’s on the right.”" },
        { t: "I don't know the medicine.", ok: false, fb: "Try “The pharmacy is on the right.”" } ] }
  ]
}
,{
  name: "Uncle Dung – Porter", color: 0x868e96, place: "hospital", x: 2.8, z: 7,
  steps: [
    { say: "Excuse me, can you open the door for me, please?",
      q: { w: "Can you…for me?", pic: "🚪", ex: "Can you open the door for me?" },
      card: { w: "Can you…?", pic: "🚪", ex: "Can you help me, please?" },
      choices: [
        { t: "Sure! No problem.", ok: true, fb: "Helpful! +10" },
        { t: "No, door is open.", ok: false, fb: "Say “Sure! No problem.”" },
        { t: "I am the door.", ok: false, fb: "Haha :) Say “Sure! No problem.”" } ] },
    { say: "I'm new here. Where is the Dentist?",
      q: { w: "Where is…?", pic: "📍", ex: "Where is the Dentist?" },
      card: { w: "on the left", pic: "⬅️", ex: "The Dentist is on the left." },
      choices: [
        { t: "The Dentist is on the left, after the Children's Clinic.", ok: true, fb: "Great directions! +10" },
        { t: "The Dentist is on the right, next to the Lab.", ok: false, fb: "Check the signs: it’s on the LEFT." },
        { t: "Dentist is a doctor.", ok: false, fb: "Say where it is: “on the left.”" } ] },
    { say: "Thanks! Please walk slowly and keep quiet. Patients are resting.",
      card: { w: "Walk slowly.", pic: "🚶", ex: "Walk slowly in the hospital." },
      choices: [
        { t: "Sorry! I'll walk slowly.", ok: true, fb: "Polite! +10" },
        { t: "I will run, run, run.", ok: false, fb: "Be careful in a hospital." },
        { t: "I am quiet loud.", ok: false, fb: "Say “Sorry! I’ll walk slowly.”" } ] }
  ]
}
,{
  name: "Nurse Tam – Ward Nurse", color: 0x15aabf, place: "hospital", x: 11.5, z: -30,
  steps: [
    { say: "Hello! Are you visiting someone? Visiting hours are from two to eight.",
      card: { w: "visiting hours", pic: "🕑", ex: "Visiting hours are from two to eight." },
      choices: [
        { t: "Yes, I'm visiting my grandpa.", ok: true, fb: "Good! +10" },
        { t: "Yes, I visit hours.", ok: false, fb: "Say “I’m visiting my grandpa.”" },
        { t: "No, I'm sleeping here.", ok: false, fb: "Say “I’m visiting my grandpa.”" } ] },
    { say: "Please speak quietly and wash your hands.",
      card: { w: "speak quietly", pic: "🤫", ex: "Please speak quietly." },
      choices: [
        { t: "OK. I'll speak quietly.", ok: true, fb: "Kind! +10" },
        { t: "I speak loud.", ok: false, fb: "Patients are resting :)" },
        { t: "Quiet is speak.", ok: false, fb: "Try “I’ll speak quietly.”" } ] },
    { say: "Grandpa Khoi is in bed three. He likes visitors. Bring some fruit!",
      card: { w: "bring some fruit", pic: "🍎", ex: "I'll bring some fruit." },
      choices: [
        { t: "Thank you. I'll bring some fruit.", ok: true, fb: "Thoughtful! +10" },
        { t: "I bring fruit yesterday.", ok: false, fb: "Say “I’ll bring some fruit.”" },
        { t: "I eat visitors.", ok: false, fb: "Haha :) Say “I’ll bring some fruit.”" } ] }
  ]
}
,{
  name: "Grandpa Khoi – Patient", color: 0x9c6b3c, place: "hospital", x: 23.8, z: -31,
  steps: [
    { say: "Hello, young friend. I feel a bit better today. How are you?",
      q: { w: "How are you?", pic: "🙂", ex: "How are you?" },
      card: { w: "Get well soon!", pic: "💐", ex: "Get well soon, Grandpa!" },
      choices: [
        { t: "I'm fine, thank you. Get well soon!", ok: true, fb: "So kind! +10" },
        { t: "Me fine, you old.", ok: false, fb: "Be polite: “Get well soon!”" },
        { t: "I am very ill.", ok: false, fb: "Say “I’m fine. Get well soon!”" } ] },
    { say: "Look at my leg. I can't walk well.",
      q: { w: "What happened?", pic: "❓", ex: "What happened to your leg?" },
      card: { w: "broke my leg", pic: "🦵", ex: "He broke his leg last week." },
      choices: [
        { t: "What happened to your leg?", ok: true, fb: "Caring! +10" },
        { t: "What is happen leg?", ok: false, fb: "Say “What happened to your leg?”" },
        { t: "Why you leg?", ok: false, fb: "Try “What happened to your leg?”" } ] },
    { say: "I fell down the stairs last week. Be careful on stairs!",
      card: { w: "fell down", pic: "🪜", ex: "I fell down the stairs." },
      choices: [
        { t: "I'll be careful. Thank you, Grandpa!", ok: true, fb: "Wise! +10" },
        { t: "I fall down every day.", ok: false, fb: "Take care: “I’ll be careful.”" },
        { t: "Stairs are bad.", ok: false, fb: "Try “I’ll be careful.”" } ] }
  ]
}
,{
  name: "Nurse Chi – Head Nurse", color: 0x0ca678, place: "hospital", x: 2, z: -34.4,
  steps: [
    { say: "Good morning! Do you wash your hands before meals?",
      q: { w: "Do you…?", pic: "🧼", ex: "Do you wash your hands?" },
      card: { w: "wash your hands", pic: "🧼", ex: "Wash your hands with soap." },
      choices: [
        { t: "Yes, I do. I wash my hands with soap.", ok: true, fb: "Clean hands! +10" },
        { t: "Yes, I wash my food.", ok: false, fb: "Hands, not food :)" },
        { t: "No, hands are clean.", ok: false, fb: "Always use soap: “I wash my hands with soap.”" } ] },
    { say: "How many hours do you sleep every night?",
      q: { w: "How many hours…?", pic: "😴", ex: "How many hours do you sleep?" },
      card: { w: "nine hours", pic: "😴", ex: "I sleep about nine hours." },
      choices: [
        { t: "I sleep about nine hours.", ok: true, fb: "Good sleep! +10" },
        { t: "I sleep nine hour a night.", ok: false, fb: "Say “nine hours.”" },
        { t: "I don't sleep at night.", ok: false, fb: "Kids need about nine hours of sleep." } ] },
    { say: "Great! Eat fruit, drink water and exercise to stay healthy.",
      card: { w: "stay healthy", pic: "💪", ex: "Exercise every day to stay healthy." },
      choices: [
        { t: "I exercise every day to stay healthy.", ok: true, fb: "Super healthy! +10" },
        { t: "I stay in bed all day.", ok: false, fb: "Try to move: “I exercise every day.”" },
        { t: "I drink soda every day.", ok: false, fb: "Water is healthier :)" } ] }
  ]
}

/* ===== NPC: school – thêm các NPC (bắt đầu bằng ",{") ngay dưới dòng này ===== */

/* ===== NPC: bakery – thêm các NPC (bắt đầu bằng ",{") ngay dưới dòng này ===== */
,{
  name: "Auntie Hanh – Banh Mi Seller", color: 0xe8590c, place: "bakery", x: -7.5, z: 9.6,
  steps: [
    { say: "Hello! What would you like in your banh mi?",
      q: { w: "What would you like…?", pic: "🥪", ex: "What would you like in your banh mi?" },
      card: { w: "with pâté", pic: "🥫", ex: "One banh mi with pâté, please." },
      choices: [
        { t: "One banh mi with pâté, please.", ok: true,  fb: "Perfect order! +10" },
        { t: "I want banh mi pâté have.",      ok: false, fb: "Try “One banh mi with pâté, please.”" },
        { t: "Pâté is good morning.",          ok: false, fb: "Haha! Say what you want: “with pâté”." } ] },
    { say: "Sure. Would you like chilli?",
      q: { w: "Would you like…?", pic: "🌶️", ex: "Would you like chilli?" },
      card: { w: "no chilli", pic: "🚫", ex: "No chilli, please." },
      choices: [
        { t: "No chilli, please.",      ok: true,  fb: "Clear and polite! +10" },
        { t: "Chilli no I like.",       ok: false, fb: "Word order: “No chilli, please.”" },
        { t: "Yes, I am a chilli.",     ok: false, fb: "Ha ha! Try “No chilli, please.”" } ] },
    { say: "Here you are. That’s 20,000 dong.",
      card: { w: "How much is it?", pic: "💰", ex: "How much is it? – It’s 20,000 dong." },
      choices: [
        { t: "Here you are. Thank you!", ok: true,  fb: "Lovely! +10" },
        { t: "It is how much?",          ok: false, fb: "Say “How much is it?” when you ask." },
        { t: "I give you bread.",        ok: false, fb: "You pay money :) Try “Here you are.”" } ] }
  ]
},
{
  name: "Chef Minh – Pastry Chef", color: 0xf1f3f5, place: "bakery", x: 3.2, z: -13.2,
  steps: [
    { say: "Welcome to my kitchen! First, we mix flour, water and yeast.",
      q: { w: "First… then…", pic: "1️⃣", ex: "First we mix the flour. Then we make dough." },
      card: { w: "mix the flour", pic: "🌾", ex: "First, we mix the flour and water." },
      choices: [
        { t: "What do you make with it?", ok: true,  fb: "Good question! +10" },
        { t: "Flour is mix I.",           ok: false, fb: "Try “What do you make with it?”" },
        { t: "I mix you.",                ok: false, fb: "Not you, the flour :) Ask about the bread." } ] },
    { say: "Then we make the dough soft. We wait one hour.",
      card: { w: "wait one hour", pic: "⏲️", ex: "The dough must wait for one hour." },
      choices: [
        { t: "Why does it wait?",         ok: true,  fb: "Smart! The dough grows. +10" },
        { t: "Hour one is wait why.",     ok: false, fb: "Try “Why does it wait?”" },
        { t: "I am hungry now.",          ok: false, fb: "Me too! But first ask: “Why does it wait?”" } ] },
    { say: "Then we bake it in the oven for twenty minutes. It smells great!",
      q: { w: "bake in the oven", pic: "♨️", ex: "We bake the bread in the oven." },
      card: { w: "It smells great!", pic: "👃", ex: "The bread smells great!" },
      choices: [
        { t: "It smells great! I’m hungry.", ok: true,  fb: "Delicious! +10" },
        { t: "Oven is smell me.",            ok: false, fb: "Try “It smells great!”" },
        { t: "The bread is run away.",       ok: false, fb: "Ha ha! Say “It smells great!”" } ] }
  ]
},
{
  name: "Mimi – Birthday Girl", color: 0xe64980, place: "bakery", x: 0.9, z: 4.4,
  steps: [
    { say: "Hi! It’s my birthday tomorrow. I want a cake!",
      card: { w: "Happy birthday!", pic: "🎉", ex: "Happy birthday! How old are you?" },
      choices: [
        { t: "Happy birthday! How old are you?", ok: true,  fb: "Sweet! +10" },
        { t: "Birthday is happy you.",           ok: false, fb: "Say “Happy birthday!”" },
        { t: "I am not birthday.",               ok: false, fb: "Be kind :) Try “Happy birthday!”" } ] },
    { say: "I’m nine! Which cake is nice? Chocolate or strawberry?",
      q: { w: "Chocolate or strawberry?", pic: "🍓", ex: "Do you like chocolate or strawberry?" },
      card: { w: "I like… best", pic: "😋", ex: "I like strawberry best." },
      choices: [
        { t: "I like strawberry best.", ok: true,  fb: "Pink and yummy! +10" },
        { t: "Strawberry I am like.",   ok: false, fb: "Word order: “I like strawberry.”" },
        { t: "Yes, the cake.",          ok: false, fb: "She asked you to choose one :)" } ] },
    { say: "Great idea! How many candles? Nine, right?",
      card: { w: "nine candles", pic: "🕯️", ex: "We need nine candles, please." },
      choices: [
        { t: "Yes, nine candles, please.", ok: true,  fb: "Great! +10" },
        { t: "Nine candle have.",          ok: false, fb: "Many things: “nine candles”." },
        { t: "I am nine.",                 ok: false, fb: "She is nine! Say “nine candles”." } ] }
  ]
},
{
  name: "Mr. Dat – Delivery Man", color: 0x1c7ed6, place: "bakery", x: 6.5, z: 15, minLv: 5,
  steps: [
    { say: "Good morning! I have twenty bags of flour for the bakery.",
      q: { w: "How many…?", pic: "🔢", ex: "How many bags do you have?" },
      card: { w: "bags of flour", pic: "🌾", ex: "Twenty bags of flour, please." },
      choices: [
        { t: "Thank you. Please put them in the kitchen.", ok: true,  fb: "Very polite! +10" },
        { t: "Put flour kitchen at.",                      ok: false, fb: "Try “Please put them in the kitchen.”" },
        { t: "I do not eat flour.",                        ok: false, fb: "Ha ha! Try “Please put them in the kitchen.”" } ] },
    { say: "Of course. Could you sign here, please?",
      q: { w: "Could you…?", pic: "🙏", ex: "Could you sign here, please?" },
      card: { w: "sign here", pic: "✍️", ex: "Please sign here." },
      choices: [
        { t: "Sure. Is this the right place?", ok: true,  fb: "Good checking! +10" },
        { t: "Sign is here I.",                ok: false, fb: "Try “Sure. Is this the right place?”" },
        { t: "No, I am a customer.",           ok: false, fb: "He asks you to sign. Try “Sure.”" } ] },
    { say: "Thanks! I must go. I have ten more deliveries today.",
      card: { w: "deliveries", pic: "🚚", ex: "He has ten deliveries today." },
      choices: [
        { t: "Good luck! Drive safely.", ok: true,  fb: "Kind words! +10" },
        { t: "You are go quickly bye.",  ok: false, fb: "Try “Good luck! Drive safely.”" },
        { t: "Give me one delivery.",    ok: false, fb: "Be kind :) Try “Drive safely.”" } ] }
  ]
},
{
  name: "Grandpa Ba – Regular Customer", color: 0x868e96, place: "bakery", x: 5.4, z: -3.9,
  steps: [
    { say: "Good morning! I come here every day. The bread is always fresh.",
      card: { w: "every day", pic: "📅", ex: "I eat breakfast here every day." },
      choices: [
        { t: "Wow, you must love this bakery!", ok: true,  fb: "Nice talking! +10" },
        { t: "Every day is come you.",          ok: false, fb: "Try “You must love this bakery!”" },
        { t: "I am the bread.",                 ok: false, fb: "Ha ha! Try “You must love this bakery!”" } ] },
    { say: "I do. Which bread tastes the best, do you think?",
      q: { w: "Which…?", pic: "🥖", ex: "Which bread do you like?" },
      card: { w: "crispy and warm", pic: "🔥", ex: "The baguette is crispy and warm." },
      choices: [
        { t: "I think the baguette is crispy and warm.", ok: true,  fb: "Good opinion! +10" },
        { t: "Baguette is crispy warm is.",              ok: false, fb: "Try “The baguette is crispy and warm.”" },
        { t: "I do not know the bread.",                 ok: false, fb: "Take a look at the shelf and try “crispy and warm.”" } ] },
    { say: "Yes! Would you like to sit with me? I have a free seat.",
      card: { w: "Would you like to…?", pic: "🪑", ex: "Would you like to sit down?" },
      choices: [
        { t: "Thank you! I’d love to.", ok: true,  fb: "Friendly! +10" },
        { t: "No sit I.",               ok: false, fb: "Try “Thank you! I’d love to.”" },
        { t: "The seat is a table.",    ok: false, fb: "Try “I’d love to.”" } ] }
  ]
}

/* ===== NPC: furniture – thêm các NPC (bắt đầu bằng ",{") ngay dưới dòng này ===== */

/* ===== NPC: electronics – thêm các NPC (bắt đầu bằng ",{") ngay dưới dòng này ===== */

/* ===== NPC: cinema – thêm các NPC (bắt đầu bằng ",{") ngay dưới dòng này ===== */

/* ===== NPC: hotel – thêm các NPC (bắt đầu bằng ",{") ngay dưới dòng này ===== */

];

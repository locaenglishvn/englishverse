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
  name: "Leo – Museum Guide", color: 0x5c5f66, place: "museum", x: 0, z: -2,
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
  name: "Linh – Bank Teller", color: 0x2b8a3e, place: "bank", x: 0, z: -3.6,
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
];

window.ADVENTURE={
  "n": 15,
  "week": "Tổng ôn tuần 1–12",
  "name": "Lâu đài Văn Lang",
  "en": "Van Lang Castle",
  "theme": "castle",
  "icon": "🏰",
  "goal": "Vận dụng kiến thức đã học để chinh phục thử thách tổng hợp.",
  "reward": "Van Lang Champion",
  "topics": "Ôn phối hợp từ vựng, ngữ pháp và đọc hiểu tuần 1–12",
  "items": [
    {
      "type": "choice",
      "title": "The first clue",
      "scene": "Titi is from Australia. He lives in Hanoi now.",
      "prompt": "Where is Titi from?",
      "options": [
        "Australia",
        "Hanoi",
        "The library",
        "Hue"
      ],
      "answer": "Australia",
      "why": "From chỉ nơi xuất thân; lives in chỉ nơi đang sống.",
      "sourceWeek": 1,
      "id": "g15q1",
      "hint": "From chỉ nơi xuất thân; lives in chỉ nơi đang sống.",
      "speech": "Titi is from Australia. He lives in Hanoi now. Where is Titi from?"
    },
    {
      "type": "collect",
      "title": "Art class delivery",
      "scene": "Bring only the things for drawing and painting: a pencil, paper and a paintbrush.",
      "prompt": "Collect all the things you need. Then check your basket.",
      "options": [
        "a pencil",
        "paper",
        "a paintbrush",
        "a football",
        "a spoon"
      ],
      "answer": [
        "a pencil",
        "paper",
        "a paintbrush"
      ],
      "why": "Chọn đúng ba đồ dùng theo yêu cầu của lớp mỹ thuật.",
      "sourceWeek": 2,
      "id": "g15q2",
      "hint": "Chọn đúng ba đồ dùng theo yêu cầu của lớp mỹ thuật.",
      "speech": "Bring only the things for drawing and painting: a pencil, paper and a paintbrush. Collect all the things you need. Then check your basket."
    },
    {
      "type": "memory",
      "title": "Find a club",
      "prompt": "Find the matching pairs. Turn over two cards.",
      "pairs": [
        [
          "swimming",
          "pool"
        ],
        [
          "reading",
          "books"
        ],
        [
          "painting",
          "colours"
        ],
        [
          "playing chess",
          "chessboard"
        ]
      ],
      "why": "Ghép hoạt động với đồ dùng hoặc nơi phù hợp.",
      "sourceWeek": 3,
      "id": "g15q3",
      "hint": "Ghép hoạt động với đồ dùng hoặc nơi phù hợp.",
      "speech": "Find the matching pairs. Turn over two cards."
    },
    {
      "type": "sort",
      "title": "Furnish the house",
      "prompt": "Put each card in the correct group.",
      "groups": [
        "Kitchen",
        "Bedroom",
        "Bathroom"
      ],
      "cards": [
        [
          "a cooker",
          "Kitchen"
        ],
        [
          "a fridge",
          "Kitchen"
        ],
        [
          "a bed",
          "Bedroom"
        ],
        [
          "a wardrobe",
          "Bedroom"
        ],
        [
          "a shower",
          "Bathroom"
        ],
        [
          "a bathtub",
          "Bathroom"
        ]
      ],
      "why": "Cooker/fridge ở bếp; bed/wardrobe ở phòng ngủ; shower/bathtub ở phòng tắm.",
      "sourceWeek": 4,
      "id": "g15q4",
      "hint": "Cooker/fridge ở bếp; bed/wardrobe ở phòng ngủ; shower/bathtub ở phòng tắm.",
      "speech": "Put each card in the correct group."
    },
    {
      "type": "choice",
      "title": "Pay the bill",
      "scene": "A sandwich costs 20,000 dong. Water costs 10,000 dong. Titi buys one of each.",
      "prompt": "How much does he pay?",
      "options": [
        "30,000 dong",
        "20,000 dong",
        "40,000 dong",
        "50,000 dong"
      ],
      "answer": "30,000 dong",
      "why": "20,000 + 10,000 = 30,000 đồng.",
      "sourceWeek": 5,
      "id": "g15q5",
      "hint": "20,000 + 10,000 = 30,000 đồng.",
      "speech": "A sandwich costs 20,000 dong. Water costs 10,000 dong. Titi buys one of each. How much does he pay?"
    },
    {
      "type": "spot",
      "title": "Check the advice",
      "prompt": "Find the wrong word. Then choose its replacement.",
      "words": [
        "You",
        "should",
        "drinks",
        "water",
        "."
      ],
      "error": "drinks",
      "options": [
        "drink",
        "drinking",
        "drank"
      ],
      "answer": "drink",
      "why": "Sau should dùng drink, không thêm s.",
      "sourceWeek": 6,
      "id": "g15q6",
      "hint": "Sau should dùng drink, không thêm s.",
      "speech": "You should drinks water. Find the wrong word. Then choose its replacement."
    },
    {
      "type": "route",
      "title": "Deliver the first letter",
      "scene": "Start at the flag. Go up two squares. Then go right two squares.",
      "prompt": "Move Titi. Follow the directions, then tap Arrived!",
      "answer": [
        0,
        2
      ],
      "why": "Đi lên hai ô rồi sang phải hai ô để đến góc trên bên phải.",
      "start": [
        2,
        0
      ],
      "sourceWeek": 7,
      "id": "g15q7",
      "hint": "Đi lên hai ô rồi sang phải hai ô để đến góc trên bên phải.",
      "speech": "Start at the flag. Go up two squares. Then go right two squares. Move Titi. Follow the directions, then tap Arrived!"
    },
    {
      "type": "sequence",
      "title": "Festival timetable",
      "scene": "The parade is at nine. Lunch is at twelve. Fireworks are at eight in the evening.",
      "prompt": "Put the events in order.",
      "answer": [
        "Watch the parade.",
        "Have lunch.",
        "Watch the fireworks."
      ],
      "why": "9 giờ sáng → 12 giờ trưa → 8 giờ tối.",
      "sourceWeek": 8,
      "id": "g15q8",
      "hint": "9 giờ sáng → 12 giờ trưa → 8 giờ tối.",
      "speech": "The parade is at nine. Lunch is at twelve. Fireworks are at eight in the evening. Put the events in order."
    },
    {
      "type": "build",
      "title": "At the pond",
      "scene": "Describe the ducks now.",
      "prompt": "Build the sentence. Tap the words in order.",
      "answer": [
        "The ducks",
        "are",
        "swimming",
        "in the pond",
        "."
      ],
      "why": "Are + V-ing cho hành động đang diễn ra của chủ ngữ số nhiều.",
      "sourceWeek": 9,
      "id": "g15q9",
      "hint": "Are + V-ing cho hành động đang diễn ra của chủ ngữ số nhiều.",
      "speech": "Describe the ducks now. Build the sentence. Tap the words in order."
    },
    {
      "type": "sort",
      "title": "The sound of -ed",
      "prompt": "Put each card in the correct group.",
      "groups": [
        "/t/",
        "/d/",
        "/ɪd/"
      ],
      "cards": [
        [
          "walked",
          "/t/"
        ],
        [
          "watched",
          "/t/"
        ],
        [
          "played",
          "/d/"
        ],
        [
          "cleaned",
          "/d/"
        ],
        [
          "wanted",
          "/ɪd/"
        ],
        [
          "visited",
          "/ɪd/"
        ]
      ],
      "why": "Phân loại theo âm cuối của động từ gốc: /t,d/ → /ɪd/; âm vô thanh khác → /t/; còn lại → /d/.",
      "sourceWeek": 10,
      "id": "g15q10",
      "hint": "Phân loại theo âm cuối của động từ gốc: /t,d/ → /ɪd/; âm vô thanh khác → /t/; còn lại → /d/.",
      "speech": "Put each card in the correct group."
    },
    {
      "type": "choice",
      "title": "Meet the firefighter",
      "scene": "Sam helps people during fires. He wears protective clothes and works with a team.",
      "prompt": "What is his job?",
      "options": [
        "A firefighter.",
        "A singer.",
        "A farmer.",
        "A pilot."
      ],
      "answer": "A firefighter.",
      "why": "Firefighter là lính cứu hỏa; protective clothes là quần áo bảo hộ.",
      "sourceWeek": 11,
      "id": "g15q11",
      "hint": "Firefighter là lính cứu hỏa; protective clothes là quần áo bảo hộ.",
      "speech": "Sam helps people during fires. He wears protective clothes and works with a team. What is his job?"
    },
    {
      "type": "sequence",
      "title": "Three film scenes",
      "scene": "First, Titi finds a map. Next, he follows the path. Finally, he opens the treasure chest.",
      "prompt": "Put the events in order.",
      "answer": [
        "Find a map.",
        "Follow the path.",
        "Open the chest."
      ],
      "why": "First → next → finally giúp xác định trình tự.",
      "sourceWeek": 12,
      "id": "g15q12",
      "hint": "First → next → finally giúp xác định trình tự.",
      "speech": "First, Titi finds a map. Next, he follows the path. Finally, he opens the treasure chest. Put the events in order."
    }
  ]
};

window.ADVENTURE={
  "n": 14,
  "week": "Tổng ôn tuần 1–8",
  "name": "Đại hội nhà thám hiểm",
  "en": "Explorer Games",
  "theme": "arena",
  "icon": "🏆",
  "goal": "Vận dụng kiến thức đã học để chinh phục thử thách tổng hợp.",
  "reward": "Treasure Champion",
  "topics": "Ôn phối hợp từ vựng, ngữ pháp và đọc hiểu tuần 1–8",
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
      "id": "g14q1",
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
      "id": "g14q2",
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
      "id": "g14q3",
      "hint": "Ghép hoạt động với đồ dùng hoặc nơi phù hợp.",
      "speech": "Find the matching pairs. Turn over two cards."
    },
    {
      "type": "spot",
      "title": "Repair the room sign",
      "prompt": "Find the wrong word. Then choose its replacement.",
      "words": [
        "There",
        "are",
        "a",
        "sofa",
        "in",
        "the",
        "room",
        "."
      ],
      "error": "are",
      "options": [
        "is",
        "am",
        "be"
      ],
      "answer": "is",
      "why": "A sofa là số ít: There is a sofa.",
      "sourceWeek": 4,
      "id": "g14q4",
      "hint": "A sofa là số ít: There is a sofa.",
      "speech": "There are a sofa in the room. Find the wrong word. Then choose its replacement."
    },
    {
      "type": "sort",
      "title": "Sort the ingredients",
      "prompt": "Put each card in the correct group.",
      "groups": [
        "Countable",
        "Uncountable"
      ],
      "cards": [
        [
          "apple",
          "Countable"
        ],
        [
          "egg",
          "Countable"
        ],
        [
          "banana",
          "Countable"
        ],
        [
          "rice",
          "Uncountable"
        ],
        [
          "milk",
          "Uncountable"
        ],
        [
          "water",
          "Uncountable"
        ]
      ],
      "why": "Apple, egg, banana đếm được; rice, milk, water thường không đếm được.",
      "sourceWeek": 5,
      "id": "g14q5",
      "hint": "Apple, egg, banana đếm được; rice, milk, water thường không đếm được.",
      "speech": "Put each card in the correct group."
    },
    {
      "type": "build",
      "title": "Give advice",
      "scene": "Ben has a toothache.",
      "prompt": "Build the sentence. Tap the words in order.",
      "answer": [
        "He",
        "should",
        "see",
        "a dentist",
        "."
      ],
      "why": "Should + động từ nguyên mẫu; dentist là nha sĩ.",
      "sourceWeek": 6,
      "id": "g14q6",
      "hint": "Should + động từ nguyên mẫu; dentist là nha sĩ.",
      "speech": "Ben has a toothache. Build the sentence. Tap the words in order."
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
      "id": "g14q7",
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
      "id": "g14q8",
      "hint": "9 giờ sáng → 12 giờ trưa → 8 giờ tối.",
      "speech": "The parade is at nine. Lunch is at twelve. Fireworks are at eight in the evening. Put the events in order."
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
      "id": "g14q9",
      "hint": "20,000 + 10,000 = 30,000 đồng.",
      "speech": "A sandwich costs 20,000 dong. Water costs 10,000 dong. Titi buys one of each. How much does he pay?"
    },
    {
      "type": "sort",
      "title": "Healthy choices",
      "prompt": "Put each card in the correct group.",
      "groups": [
        "Healthy habit",
        "Unhealthy habit"
      ],
      "cards": [
        [
          "Wash your hands.",
          "Healthy habit"
        ],
        [
          "Drink enough water.",
          "Healthy habit"
        ],
        [
          "Stay up very late every night.",
          "Unhealthy habit"
        ],
        [
          "Eat too many sweets.",
          "Unhealthy habit"
        ]
      ],
      "why": "Rửa tay và uống đủ nước là thói quen tốt; thức quá khuya và ăn quá nhiều kẹo không tốt.",
      "sourceWeek": 6,
      "id": "g14q10",
      "hint": "Rửa tay và uống đủ nước là thói quen tốt; thức quá khuya và ăn quá nhiều kẹo không tốt.",
      "speech": "Put each card in the correct group."
    },
    {
      "type": "build",
      "title": "Ask the way",
      "scene": "You want to find the museum.",
      "prompt": "Build the sentence. Tap the words in order.",
      "answer": [
        "How",
        "can",
        "I",
        "get to",
        "the museum",
        "?"
      ],
      "why": "How can I get to...? dùng để hỏi đường.",
      "sourceWeek": 7,
      "id": "g14q11",
      "hint": "How can I get to...? dùng để hỏi đường.",
      "speech": "You want to find the museum. Build the sentence. Tap the words in order."
    },
    {
      "type": "spot",
      "title": "The forecast screen",
      "prompt": "Find the wrong word. Then choose its replacement.",
      "words": [
        "It",
        "will",
        "rains",
        "tomorrow",
        "."
      ],
      "error": "rains",
      "options": [
        "rain",
        "raining",
        "rained"
      ],
      "answer": "rain",
      "why": "Sau will dùng động từ nguyên mẫu.",
      "sourceWeek": 8,
      "id": "g14q12",
      "hint": "Sau will dùng động từ nguyên mẫu.",
      "speech": "It will rains tomorrow. Find the wrong word. Then choose its replacement."
    }
  ]
};

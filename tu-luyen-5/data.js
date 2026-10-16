window.ADVENTURE={
  "n": 5,
  "week": "Tuần 5",
  "name": "Quán ăn cầu vồng",
  "en": "Rainbow Café",
  "theme": "cafe",
  "icon": "🍓",
  "goal": "Nhớ đơn hàng, chọn nguyên liệu và tính tiền cho khách.",
  "reward": "Rainbow Chef",
  "topics": "Đồ ăn · đồ uống · mua sắm · lượng từ · giá tiền",
  "items": [
    {
      "type": "memory",
      "title": "At the counter",
      "prompt": "Find the matching pairs. Turn over two cards.",
      "pairs": [
        [
          "a loaf of",
          "bread"
        ],
        [
          "a bottle of",
          "water"
        ],
        [
          "a bowl of",
          "rice"
        ],
        [
          "a cup of",
          "tea"
        ]
      ],
      "why": "a loaf of bread; a bottle of water; a bowl of rice; a cup of tea.",
      "id": "g5q1",
      "hint": "a loaf of bread; a bottle of water; a bowl of rice; a cup of tea.",
      "speech": "Find the matching pairs. Turn over two cards."
    },
    {
      "type": "collect",
      "title": "Order number one",
      "scene": "The customer wants an apple, a sandwich and a bottle of water.",
      "prompt": "Collect all the things you need. Then check your basket.",
      "options": [
        "an apple",
        "a sandwich",
        "a bottle of water",
        "a cake",
        "a cup of tea"
      ],
      "answer": [
        "an apple",
        "a sandwich",
        "a bottle of water"
      ],
      "why": "Đọc đủ đơn hàng trước khi chọn; không thêm món khách không yêu cầu.",
      "id": "g5q2",
      "hint": "Đọc đủ đơn hàng trước khi chọn; không thêm món khách không yêu cầu.",
      "speech": "The customer wants an apple, a sandwich and a bottle of water. Collect all the things you need. Then check your basket."
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
      "id": "g5q3",
      "hint": "Apple, egg, banana đếm được; rice, milk, water thường không đếm được.",
      "speech": "Put each card in the correct group."
    },
    {
      "type": "build",
      "title": "Ask the price",
      "scene": "Ask the price of these shoes.",
      "prompt": "Build the sentence. Tap the words in order.",
      "answer": [
        "How much",
        "are",
        "these shoes",
        "?"
      ],
      "why": "These shoes là số nhiều nên dùng are.",
      "id": "g5q4",
      "hint": "These shoes là số nhiều nên dùng are.",
      "speech": "Ask the price of these shoes. Build the sentence. Tap the words in order."
    },
    {
      "type": "spot",
      "title": "Fix the recipe",
      "prompt": "Find the wrong word. Then choose its replacement.",
      "words": [
        "How",
        "many",
        "milk",
        "do",
        "we",
        "need",
        "?"
      ],
      "error": "many",
      "options": [
        "much",
        "any",
        "a"
      ],
      "answer": "much",
      "why": "Milk không đếm được: How much milk...?",
      "id": "g5q5",
      "hint": "Milk không đếm được: How much milk...?",
      "speech": "How many milk do we need? Find the wrong word. Then choose its replacement."
    },
    {
      "type": "choice",
      "title": "The empty fridge",
      "scene": "There is not ___ juice in the fridge.",
      "prompt": "Which word fits?",
      "options": [
        "any",
        "some",
        "many",
        "a"
      ],
      "answer": "any",
      "why": "Trong câu phủ định này dùng any juice.",
      "id": "g5q6",
      "hint": "Trong câu phủ định này dùng any juice.",
      "speech": "There is not  blank  juice in the fridge. Which word fits?"
    },
    {
      "type": "collect",
      "title": "Fruit salad",
      "scene": "Use only the three fruits: a banana, an apple and an orange.",
      "prompt": "Collect all the things you need. Then check your basket.",
      "options": [
        "a banana",
        "an apple",
        "an orange",
        "an onion",
        "a potato"
      ],
      "answer": [
        "a banana",
        "an apple",
        "an orange"
      ],
      "why": "Onion là hành và potato là khoai tây; không thuộc ba loại quả của công thức.",
      "id": "g5q7",
      "hint": "Onion là hành và potato là khoai tây; không thuộc ba loại quả của công thức.",
      "speech": "Use only the three fruits: a banana, an apple and an orange. Collect all the things you need. Then check your basket."
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
      "id": "g5q8",
      "hint": "20,000 + 10,000 = 30,000 đồng.",
      "speech": "A sandwich costs 20,000 dong. Water costs 10,000 dong. Titi buys one of each. How much does he pay?"
    },
    {
      "type": "choice",
      "title": "In the clothes shop",
      "scene": "The jacket looks nice, but Mia needs to check its size.",
      "prompt": "What does she ask?",
      "options": [
        "Can I try it on?",
        "Can I turn it off?",
        "Can I look it up?",
        "Can I throw it away?"
      ],
      "answer": "Can I try it on?",
      "why": "Try on = mặc thử.",
      "id": "g5q9",
      "hint": "Try on = mặc thử.",
      "speech": "The jacket looks nice, but Mia needs to check its size. What does she ask?"
    },
    {
      "type": "choice",
      "title": "Hear the ending",
      "scene": "Listen: cups, apples, bananas.",
      "prompt": "Which word ends with /s/?",
      "options": [
        "cups",
        "apples",
        "bananas",
        "eggs"
      ],
      "answer": "cups",
      "why": "Cups có âm cuối /s/; apples và bananas có âm cuối /z/.",
      "id": "g5q10",
      "hint": "Cups có âm cuối /s/; apples và bananas có âm cuối /z/.",
      "speech": "Listen: cups, apples, bananas. Which word ends with the S sound?"
    }
  ]
};

window.ADVENTURE={
  "n": 10,
  "week": "Tuần 10",
  "name": "Cỗ máy thời gian",
  "en": "Time Travellers",
  "theme": "time",
  "icon": "⏳",
  "goal": "Khôi phục nhật ký chuyến đi và đưa cỗ máy về đúng thời điểm.",
  "reward": "Time Traveller",
  "topics": "Du lịch · cắm trại · quá khứ đơn · âm cuối -ed",
  "items": [
    {
      "type": "memory",
      "title": "Past tense portal",
      "prompt": "Find the matching pairs. Turn over two cards.",
      "pairs": [
        [
          "go",
          "went"
        ],
        [
          "see",
          "saw"
        ],
        [
          "take",
          "took"
        ],
        [
          "buy",
          "bought"
        ]
      ],
      "why": "Đây là các động từ bất quy tắc; không thêm -ed.",
      "id": "g10q1",
      "hint": "Đây là các động từ bất quy tắc; không thêm -ed.",
      "speech": "Find the matching pairs. Turn over two cards."
    },
    {
      "type": "sequence",
      "title": "The camp diary",
      "scene": "At seven, we packed. At eight, we left home. At ten, we arrived at the campsite.",
      "prompt": "Put the events in order.",
      "answer": [
        "Pack our bags.",
        "Leave home.",
        "Arrive at the campsite."
      ],
      "why": "Dựa vào thời gian 7 → 8 → 10 để xếp sự kiện.",
      "id": "g10q2",
      "hint": "Dựa vào thời gian 7 → 8 → 10 để xếp sự kiện.",
      "speech": "At seven, we packed. At eight, we left home. At ten, we arrived at the campsite. Put the events in order."
    },
    {
      "type": "build",
      "title": "Yesterday’s trip",
      "scene": "Tell Titi about yesterday.",
      "prompt": "Build the sentence. Tap the words in order.",
      "answer": [
        "We",
        "visited",
        "the museum",
        "yesterday",
        "."
      ],
      "why": "Yesterday là dấu hiệu quá khứ; visit → visited.",
      "id": "g10q3",
      "hint": "Yesterday là dấu hiệu quá khứ; visit → visited.",
      "speech": "Tell Titi about yesterday. Build the sentence. Tap the words in order."
    },
    {
      "type": "spot",
      "title": "Repair the diary",
      "prompt": "Find the wrong word. Then choose its replacement.",
      "words": [
        "Did",
        "you",
        "went",
        "camping",
        "last",
        "week",
        "?"
      ],
      "error": "went",
      "options": [
        "go",
        "goes",
        "going"
      ],
      "answer": "go",
      "why": "Sau did dùng động từ nguyên mẫu go.",
      "id": "g10q4",
      "hint": "Sau did dùng động từ nguyên mẫu go.",
      "speech": "Did you went camping last week? Find the wrong word. Then choose its replacement."
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
      "id": "g10q5",
      "hint": "Phân loại theo âm cuối của động từ gốc: /t,d/ → /ɪd/; âm vô thanh khác → /t/; còn lại → /d/.",
      "speech": "Put each card in the correct group."
    },
    {
      "type": "collect",
      "title": "Camp packing list",
      "scene": "Bring a tent, a torch and a sleeping bag.",
      "prompt": "Collect all the things you need. Then check your basket.",
      "options": [
        "a tent",
        "a torch",
        "a sleeping bag",
        "a fridge",
        "a sofa"
      ],
      "answer": [
        "a tent",
        "a torch",
        "a sleeping bag"
      ],
      "why": "Tent: lều; torch: đèn pin; sleeping bag: túi ngủ.",
      "id": "g10q6",
      "hint": "Tent: lều; torch: đèn pin; sleeping bag: túi ngủ.",
      "speech": "Bring a tent, a torch and a sleeping bag. Collect all the things you need. Then check your basket."
    },
    {
      "type": "build",
      "title": "A negative sentence",
      "scene": "Say that Ben stayed home yesterday.",
      "prompt": "Build the sentence. Tap the words in order.",
      "answer": [
        "Ben",
        "did not",
        "go",
        "to school",
        "yesterday",
        "."
      ],
      "why": "Did not + động từ nguyên mẫu; Ben không đi học hôm qua.",
      "id": "g10q7",
      "hint": "Did not + động từ nguyên mẫu; Ben không đi học hôm qua.",
      "speech": "Say that Ben stayed home yesterday. Build the sentence. Tap the words in order."
    },
    {
      "type": "choice",
      "title": "Past form of be",
      "scene": "Mia and Ben ___ at the beach yesterday.",
      "prompt": "Which word fits?",
      "options": [
        "were",
        "was",
        "are",
        "is"
      ],
      "answer": "were",
      "why": "Mia and Ben là số nhiều; quá khứ của are là were.",
      "id": "g10q8",
      "hint": "Mia and Ben là số nhiều; quá khứ của are là were.",
      "speech": "Mia and Ben  blank  at the beach yesterday. Which word fits?"
    },
    {
      "type": "choice",
      "title": "Lost photo",
      "scene": "Last Sunday, Anna went to the zoo. She saw elephants and took photos. She did not buy any toys.",
      "prompt": "Which statement is true?",
      "options": [
        "She did not buy any toys.",
        "She bought a toy elephant.",
        "She bought a camera.",
        "She bought a kite."
      ],
      "answer": "She did not buy any toys.",
      "why": "Câu phủ định nói rõ Anna không mua đồ chơi nào.",
      "id": "g10q9",
      "hint": "Câu phủ định nói rõ Anna không mua đồ chơi nào.",
      "speech": "Last Sunday, Anna went to the zoo. She saw elephants and took photos. She did not buy any toys. Which statement is true?"
    },
    {
      "type": "choice",
      "title": "Word stress",
      "scene": "Listen: holiday, travel, arrive.",
      "prompt": "Which word has stress on the second syllable?",
      "options": [
        "holiday",
        "travel",
        "arrive",
        "camping"
      ],
      "answer": "arrive",
      "why": "arRIVE nhấn âm hai; HOLiday và TRAVel nhấn âm một.",
      "id": "g10q10",
      "hint": "arRIVE nhấn âm hai; HOLiday và TRAVel nhấn âm một.",
      "speech": "Listen: holiday, travel, arrive. Which word has stress on the second syllable?"
    }
  ]
};

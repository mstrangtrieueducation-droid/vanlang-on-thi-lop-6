window.ADVENTURE={
  "n": 7,
  "week": "Tuần 7",
  "name": "Thành phố tìm đường",
  "en": "Titi City",
  "theme": "city",
  "icon": "🧭",
  "goal": "Điều khiển Titi trên bản đồ và giao thư đúng địa chỉ.",
  "reward": "City Navigator",
  "topics": "Địa điểm · phương tiện · chỉ đường · thời gian di chuyển",
  "items": [
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
      "id": "g7q1",
      "hint": "Đi lên hai ô rồi sang phải hai ô để đến góc trên bên phải.",
      "speech": "Start at the flag. Go up two squares. Then go right two squares. Move Titi. Follow the directions, then tap Arrived!"
    },
    {
      "type": "memory",
      "title": "Where do you go?",
      "prompt": "Find the matching pairs. Turn over two cards.",
      "pairs": [
        [
          "buy medicine",
          "pharmacy"
        ],
        [
          "send a letter",
          "post office"
        ],
        [
          "borrow books",
          "library"
        ],
        [
          "see a doctor",
          "hospital"
        ]
      ],
      "why": "Pharmacy: hiệu thuốc; post office: bưu điện; library: thư viện; hospital: bệnh viện.",
      "id": "g7q2",
      "hint": "Pharmacy: hiệu thuốc; post office: bưu điện; library: thư viện; hospital: bệnh viện.",
      "speech": "Find the matching pairs. Turn over two cards."
    },
    {
      "type": "route",
      "title": "The short route",
      "scene": "Start at the flag. Go right one square. Then go up one square.",
      "prompt": "Move Titi. Follow the directions, then tap Arrived!",
      "answer": [
        1,
        1
      ],
      "why": "Sang phải một ô rồi đi lên một ô: ô giữa bản đồ.",
      "start": [
        2,
        0
      ],
      "id": "g7q3",
      "hint": "Sang phải một ô rồi đi lên một ô: ô giữa bản đồ.",
      "speech": "Start at the flag. Go right one square. Then go up one square. Move Titi. Follow the directions, then tap Arrived!"
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
      "id": "g7q4",
      "hint": "How can I get to...? dùng để hỏi đường.",
      "speech": "You want to find the museum. Build the sentence. Tap the words in order."
    },
    {
      "type": "spot",
      "title": "Transport ticket",
      "prompt": "Find the wrong word. Then choose its replacement.",
      "words": [
        "Mia",
        "goes",
        "to",
        "school",
        "on",
        "bus",
        "."
      ],
      "error": "on",
      "options": [
        "by",
        "at",
        "with"
      ],
      "answer": "by",
      "why": "By bus = bằng xe buýt; on foot = đi bộ.",
      "id": "g7q5",
      "hint": "By bus = bằng xe buýt; on foot = đi bộ.",
      "speech": "Mia goes to school on bus. Find the wrong word. Then choose its replacement."
    },
    {
      "type": "sort",
      "title": "Travel phrases",
      "prompt": "Put each card in the correct group.",
      "groups": [
        "by",
        "on"
      ],
      "cards": [
        [
          "bus",
          "by"
        ],
        [
          "train",
          "by"
        ],
        [
          "bike",
          "by"
        ],
        [
          "foot",
          "on"
        ]
      ],
      "why": "By + phương tiện không có mạo từ; on foot là cụm cố định.",
      "id": "g7q6",
      "hint": "By + phương tiện không có mạo từ; on foot là cụm cố định.",
      "speech": "Put each card in the correct group."
    },
    {
      "type": "build",
      "title": "Journey time",
      "scene": "The walk to school takes ten minutes.",
      "prompt": "Build the sentence. Tap the words in order.",
      "answer": [
        "It",
        "takes",
        "me",
        "ten minutes",
        "to walk",
        "to school",
        "."
      ],
      "why": "It takes + người + thời gian + to V.",
      "id": "g7q7",
      "hint": "It takes + người + thời gian + to V.",
      "speech": "The walk to school takes ten minutes. Build the sentence. Tap the words in order."
    },
    {
      "type": "choice",
      "title": "Time spent",
      "scene": "I spend twenty minutes ___ to school.",
      "prompt": "Which word fits?",
      "options": [
        "walking",
        "walk",
        "to walk",
        "walks"
      ],
      "answer": "walking",
      "why": "Spend + thời gian + V-ing.",
      "id": "g7q8",
      "hint": "Spend + thời gian + V-ing.",
      "speech": "I spend twenty minutes  blank  to school. Which word fits?"
    },
    {
      "type": "choice",
      "title": "At the crossroads",
      "scene": "The library is opposite the park. The bank is next to the library.",
      "prompt": "What is opposite the park?",
      "options": [
        "The library.",
        "The station.",
        "The cinema.",
        "The supermarket."
      ],
      "answer": "The library.",
      "why": "Opposite là đối diện. Chọn đúng nơi được mô tả.",
      "id": "g7q9",
      "hint": "Opposite là đối diện. Chọn đúng nơi được mô tả.",
      "speech": "The library is opposite the park. The bank is next to the library. What is opposite the park?"
    },
    {
      "type": "choice",
      "title": "Choose your transport",
      "scene": "The island has no road or bridge to the mainland. There is a boat service.",
      "prompt": "How can Titi get there?",
      "options": [
        "By boat.",
        "By train.",
        "On foot.",
        "By car."
      ],
      "answer": "By boat.",
      "why": "Boat là thuyền; không có đường hay cầu tới đảo.",
      "id": "g7q10",
      "hint": "Boat là thuyền; không có đường hay cầu tới đảo.",
      "speech": "The island has no road or bridge to the mainland. There is a boat service. How can Titi get there?"
    },
    {
      "type": "choice",
      "title": "Word stress",
      "scene": "Listen: station, airport, hotel.",
      "prompt": "Which word has stress on the second syllable?",
      "options": [
        "station",
        "airport",
        "hotel",
        "city"
      ],
      "answer": "hotel",
      "why": "hoTEL nhấn âm tiết hai; STAtion và AIRport nhấn âm tiết một.",
      "id": "g7q11",
      "hint": "hoTEL nhấn âm tiết hai; STAtion và AIRport nhấn âm tiết một.",
      "speech": "Listen: station, airport, hotel. Which word has stress on the second syllable?"
    }
  ]
};

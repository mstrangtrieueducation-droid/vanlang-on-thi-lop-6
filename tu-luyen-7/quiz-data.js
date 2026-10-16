window.ADVENTURE={
  "n": 7,
  "week": "Tuần 7",
  "name": "Thử thách 8",
  "en": "Challenge 8",
  "theme": "city",
  "icon": "🧭",
  "goal": "Nghe câu hỏi, suy nghĩ và chọn đáp án đúng.",
  "reward": "City Navigator",
  "topics": "Địa điểm · phương tiện · chỉ đường · thời gian di chuyển",
  "items": [
    {
      "type": "choice",
      "title": "Deliver the first letter",
      "scene": "Start at the bottom-left square of a 3 by 3 map. Start at the flag. Go up two squares. Then go right two squares.",
      "prompt": "Where do you finish?",
      "answer": "Top right",
      "why": "Đi lên hai ô rồi sang phải hai ô để đến góc trên bên phải.",
      "start": [
        2,
        0
      ],
      "id": "g7q1",
      "hint": "Đi lên hai ô rồi sang phải hai ô để đến góc trên bên phải.",
      "sourceId": "g7q1",
      "options": [
        "Top right",
        "Top left",
        "Top centre",
        "Middle left"
      ],
      "speech": "Start at the bottom-left square of a 3 by 3 map. Start at the flag. Go up two squares. Then go right two squares. Where do you finish?"
    },
    {
      "type": "choice",
      "title": "Where do you go?",
      "prompt": "Which answer matches the clue?",
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
      "id": "g7q2-0",
      "hint": "Pharmacy: hiệu thuốc; post office: bưu điện; library: thư viện; hospital: bệnh viện.",
      "scene": "buy medicine",
      "sourceId": "g7q2",
      "options": [
        "pharmacy",
        "post office",
        "library",
        "hospital"
      ],
      "answer": "pharmacy",
      "speech": "buy medicine Which answer matches the clue?"
    },
    {
      "type": "choice",
      "title": "Where do you go?",
      "prompt": "Which answer matches the clue?",
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
      "id": "g7q2-1",
      "hint": "Pharmacy: hiệu thuốc; post office: bưu điện; library: thư viện; hospital: bệnh viện.",
      "scene": "send a letter",
      "sourceId": "g7q2",
      "options": [
        "post office",
        "pharmacy",
        "library",
        "hospital"
      ],
      "answer": "post office",
      "speech": "send a letter Which answer matches the clue?"
    },
    {
      "type": "choice",
      "title": "Where do you go?",
      "prompt": "Which answer matches the clue?",
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
      "id": "g7q2-2",
      "hint": "Pharmacy: hiệu thuốc; post office: bưu điện; library: thư viện; hospital: bệnh viện.",
      "scene": "borrow books",
      "sourceId": "g7q2",
      "options": [
        "library",
        "pharmacy",
        "post office",
        "hospital"
      ],
      "answer": "library",
      "speech": "borrow books Which answer matches the clue?"
    },
    {
      "type": "choice",
      "title": "Where do you go?",
      "prompt": "Which answer matches the clue?",
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
      "id": "g7q2-3",
      "hint": "Pharmacy: hiệu thuốc; post office: bưu điện; library: thư viện; hospital: bệnh viện.",
      "scene": "see a doctor",
      "sourceId": "g7q2",
      "options": [
        "hospital",
        "pharmacy",
        "post office",
        "library"
      ],
      "answer": "hospital",
      "speech": "see a doctor Which answer matches the clue?"
    },
    {
      "type": "choice",
      "title": "The short route",
      "scene": "Start at the bottom-left square of a 3 by 3 map. Start at the flag. Go right one square. Then go up one square.",
      "prompt": "Where do you finish?",
      "answer": "Centre",
      "why": "Sang phải một ô rồi đi lên một ô: ô giữa bản đồ.",
      "start": [
        2,
        0
      ],
      "id": "g7q3",
      "hint": "Sang phải một ô rồi đi lên một ô: ô giữa bản đồ.",
      "sourceId": "g7q3",
      "options": [
        "Centre",
        "Top left",
        "Top centre",
        "Top right"
      ],
      "speech": "Start at the bottom-left square of a 3 by 3 map. Start at the flag. Go right one square. Then go up one square. Where do you finish?"
    },
    {
      "type": "choice",
      "title": "Ask the way",
      "scene": "You want to find the museum.\nHow ___ I get to the museum?",
      "prompt": "Which word or phrase completes the sentence?",
      "answer": "can",
      "why": "How can I get to...? dùng để hỏi đường.",
      "id": "g7q4",
      "hint": "How can I get to...? dùng để hỏi đường.",
      "sourceId": "g7q4",
      "options": [
        "can",
        "cans",
        "canning",
        "canned"
      ],
      "speech": "You want to find the museum.\nHow ___ I get to the museum? Which word or phrase completes the sentence?"
    },
    {
      "type": "choice",
      "title": "Transport ticket",
      "prompt": "Replace the incorrect word “on”.",
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
        "with",
        "in"
      ],
      "answer": "by",
      "why": "By bus = bằng xe buýt; on foot = đi bộ.",
      "id": "g7q5",
      "hint": "By bus = bằng xe buýt; on foot = đi bộ.",
      "scene": "Mia goes to school on bus.",
      "sourceId": "g7q5",
      "speech": "Mia goes to school on bus. Replace the incorrect word “on”."
    },
    {
      "type": "choice",
      "title": "Travel phrases",
      "prompt": "Which group does this belong to?",
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
      "id": "g7q6-0",
      "hint": "By + phương tiện không có mạo từ; on foot là cụm cố định.",
      "scene": "bus",
      "sourceId": "g7q6",
      "options": [
        "by",
        "on",
        "Both groups",
        "Neither group"
      ],
      "answer": "by",
      "speech": "bus Which group does this belong to?"
    },
    {
      "type": "choice",
      "title": "Travel phrases",
      "prompt": "Which group does this belong to?",
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
      "id": "g7q6-1",
      "hint": "By + phương tiện không có mạo từ; on foot là cụm cố định.",
      "scene": "train",
      "sourceId": "g7q6",
      "options": [
        "by",
        "on",
        "Both groups",
        "Neither group"
      ],
      "answer": "by",
      "speech": "train Which group does this belong to?"
    },
    {
      "type": "choice",
      "title": "Travel phrases",
      "prompt": "Which group does this belong to?",
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
      "id": "g7q6-2",
      "hint": "By + phương tiện không có mạo từ; on foot là cụm cố định.",
      "scene": "bike",
      "sourceId": "g7q6",
      "options": [
        "by",
        "on",
        "Both groups",
        "Neither group"
      ],
      "answer": "by",
      "speech": "bike Which group does this belong to?"
    },
    {
      "type": "choice",
      "title": "Travel phrases",
      "prompt": "Which group does this belong to?",
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
      "id": "g7q6-3",
      "hint": "By + phương tiện không có mạo từ; on foot là cụm cố định.",
      "scene": "foot",
      "sourceId": "g7q6",
      "options": [
        "by",
        "on",
        "Both groups",
        "Neither group"
      ],
      "answer": "on",
      "speech": "foot Which group does this belong to?"
    },
    {
      "type": "choice",
      "title": "Journey time",
      "scene": "The walk to school takes ten minutes.\nIt ___ me ten minutes to walk to school.",
      "prompt": "Which word or phrase completes the sentence?",
      "answer": "takes",
      "why": "It takes + người + thời gian + to V.",
      "id": "g7q7",
      "hint": "It takes + người + thời gian + to V.",
      "sourceId": "g7q7",
      "options": [
        "takes",
        "take",
        "taking",
        "taken"
      ],
      "speech": "The walk to school takes ten minutes.\nIt ___ me ten minutes to walk to school. Which word or phrase completes the sentence?"
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
      "sourceId": "g7q8",
      "speech": "I spend twenty minutes ___ to school. Which word fits?"
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
      "sourceId": "g7q9",
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
      "sourceId": "g7q10",
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
      "sourceId": "g7q11",
      "speech": "Listen: station, airport, hotel. Which word has stress on the second syllable?"
    }
  ]
};

window.ADVENTURE={
  "n": 2,
  "week": "Tuần 2",
  "name": "Học viện bí mật",
  "en": "School Quest",
  "theme": "school",
  "icon": "🏫",
  "goal": "Khám phá các phòng học, ghép lịch và sửa robot trực nhật.",
  "reward": "School Explorer",
  "topics": "Trường học · môn học · hiện tại đơn · sở thích",
  "items": [
    {
      "type": "memory",
      "title": "School rooms",
      "prompt": "Find the matching pairs. Turn over two cards.",
      "pairs": [
        [
          "Read books",
          "library"
        ],
        [
          "Do experiments",
          "science lab"
        ],
        [
          "Play basketball",
          "gym"
        ],
        [
          "Eat lunch",
          "canteen"
        ]
      ],
      "why": "Library: thư viện; science lab: phòng thí nghiệm; gym: nhà thể chất; canteen: căng tin.",
      "id": "g2q1",
      "hint": "Library: thư viện; science lab: phòng thí nghiệm; gym: nhà thể chất; canteen: căng tin.",
      "speech": "Find the matching pairs. Turn over two cards."
    },
    {
      "type": "sort",
      "title": "Daily routine",
      "prompt": "Put each card in the correct group.",
      "groups": [
        "Morning",
        "Evening"
      ],
      "cards": [
        [
          "Have breakfast",
          "Morning"
        ],
        [
          "Go to school at seven a.m.",
          "Morning"
        ],
        [
          "Have dinner",
          "Evening"
        ],
        [
          "Go to bed at nine p.m.",
          "Evening"
        ]
      ],
      "why": "a.m. chỉ buổi trước trưa; p.m. chỉ buổi sau trưa.",
      "id": "g2q2",
      "hint": "a.m. chỉ buổi trước trưa; p.m. chỉ buổi sau trưa.",
      "speech": "Put each card in the correct group."
    },
    {
      "type": "choice",
      "title": "Choose a lesson",
      "scene": "We learn about numbers and shapes in this lesson.",
      "prompt": "Which subject is it?",
      "options": [
        "Maths",
        "Music",
        "History",
        "Science"
      ],
      "answer": "Maths",
      "why": "Maths học về số và hình; Music là âm nhạc; History là lịch sử.",
      "id": "g2q3",
      "hint": "Maths học về số và hình; Music là âm nhạc; History là lịch sử.",
      "speech": "We learn about numbers and shapes in this lesson. Which subject is it?"
    },
    {
      "type": "build",
      "title": "The school bus",
      "scene": "Tell Titi about Ben’s routine.",
      "prompt": "Build the sentence. Tap the words in order.",
      "answer": [
        "Ben",
        "goes",
        "to school",
        "by bus",
        "."
      ],
      "why": "He/She/Ben + goes trong hiện tại đơn.",
      "id": "g2q4",
      "hint": "He/She/Ben + goes trong hiện tại đơn.",
      "speech": "Tell Titi about Ben’s routine. Build the sentence. Tap the words in order."
    },
    {
      "type": "spot",
      "title": "Fix the helper robot",
      "prompt": "Find the wrong word. Then choose its replacement.",
      "words": [
        "Mia",
        "play",
        "chess",
        "every",
        "Monday",
        "."
      ],
      "error": "play",
      "options": [
        "plays",
        "playing",
        "played"
      ],
      "answer": "plays",
      "why": "Mia là ngôi thứ ba số ít: plays. Every Monday diễn tả thói quen.",
      "id": "g2q5",
      "hint": "Mia là ngôi thứ ba số ít: plays. Every Monday diễn tả thói quen.",
      "speech": "Mia play chess every Monday. Find the wrong word. Then choose its replacement."
    },
    {
      "type": "build",
      "title": "Ask about a routine",
      "scene": "Ask your friend about Saturday.",
      "prompt": "Build the sentence. Tap the words in order.",
      "answer": [
        "Do",
        "you",
        "study",
        "on Saturdays",
        "?"
      ],
      "why": "Câu hỏi hiện tại đơn: Do + you + động từ nguyên mẫu.",
      "id": "g2q6",
      "hint": "Câu hỏi hiện tại đơn: Do + you + động từ nguyên mẫu.",
      "speech": "Ask your friend about Saturday. Build the sentence. Tap the words in order."
    },
    {
      "type": "choice",
      "title": "Club card",
      "scene": "Titi is interested ___ science.",
      "prompt": "Which word completes the sentence?",
      "options": [
        "in",
        "on",
        "at",
        "to"
      ],
      "answer": "in",
      "why": "Cụm đúng: be interested in + danh từ/V-ing.",
      "id": "g2q7",
      "hint": "Cụm đúng: be interested in + danh từ/V-ing.",
      "speech": "Titi is interested  blank  science. Which word completes the sentence?"
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
      "id": "g2q8",
      "hint": "Chọn đúng ba đồ dùng theo yêu cầu của lớp mỹ thuật.",
      "speech": "Bring only the things for drawing and painting: a pencil, paper and a paintbrush. Collect all the things you need. Then check your basket."
    },
    {
      "type": "choice",
      "title": "Listen to the ending",
      "scene": "Listen: books, bags, pens.",
      "prompt": "Which word ends with the sound /s/?",
      "options": [
        "books",
        "bags",
        "pens",
        "toys"
      ],
      "answer": "books",
      "why": "books kết thúc bằng /s/; bags và pens kết thúc bằng /z/.",
      "id": "g2q9",
      "hint": "books kết thúc bằng /s/; bags và pens kết thúc bằng /z/.",
      "speech": "Listen: books, bags, pens. Which word ends with the sound the S sound?"
    },
    {
      "type": "choice",
      "title": "The missing pupil",
      "scene": "Anna has English on Monday and Thursday. Today is Thursday. She is in the English classroom.",
      "prompt": "Which lesson does Anna have today?",
      "options": [
        "English",
        "PE",
        "Art",
        "Maths"
      ],
      "answer": "English",
      "why": "Thursday là thứ Năm. Anna học English vào Monday và Thursday.",
      "id": "g2q10",
      "hint": "Thursday là thứ Năm. Anna học English vào Monday và Thursday.",
      "speech": "Anna has English on Monday and Thursday. Today is Thursday. She is in the English classroom. Which lesson does Anna have today?"
    }
  ]
};

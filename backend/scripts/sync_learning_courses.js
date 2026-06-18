require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, closeDB } = require('../src/config/database');

const TARGET_PER_GROUP = 5;
const DRY_RUN = process.argv.includes('--dry-run');

const receptiveQuestions = {
  multiple(prompt, options, answer, explanation = '') {
    return { type: 'multiple_choice', prompt, options, answer, explanation };
  },
  boolean(prompt, answer, explanation = '') {
    return { type: 'true_false', prompt, answer, explanation };
  },
  blank(prompt, answer, acceptedAnswers = [], explanation = '') {
    return { type: 'fill_blank', prompt, answer, acceptedAnswers, explanation };
  }
};

const DATA = {
  listening: {
    table: 'ListeningLessons',
    foundation: [
      {
        title: 'Nghe chữ cái và đánh vần',
        description: 'Luyện nghe bảng chữ cái, cách đánh vần tên và từ ngắn.',
        level: 'A1',
        topic: 'Alphabet',
        objective: 'Nghe và nhận diện chữ cái tiếng Anh.',
        duration: '8 phút',
        segments: [
          ['Teacher', 'Listen and repeat the letters: A, B, C, D, E.'],
          ['Student', 'A, B, C, D, E.'],
          ['Teacher', 'How do you spell your name?'],
          ['Student', 'L-I-N-H. Linh.']
        ],
        vocabulary: [['letter', 'chữ cái'], ['spell', 'đánh vần'], ['repeat', 'lặp lại']],
        questions: [
          receptiveQuestions.multiple('What does the teacher ask the student to do?', ['Repeat the letters', 'Open a book', 'Write an email', 'Buy a pen'], 'Repeat the letters', 'The teacher says: Listen and repeat the letters.'),
          receptiveQuestions.multiple('How does the student spell Linh?', ['L-I-N-H', 'L-A-N-H', 'L-I-M-H', 'L-E-N-H'], 'L-I-N-H'),
          receptiveQuestions.blank('Complete the word: sp___', 'spell', ['spell'], 'The lesson practices spelling names.')
        ]
      },
      {
        title: 'Màu sắc và đồ vật quen thuộc',
        description: 'Nghe câu ngắn về màu sắc và đồ vật trong lớp học.',
        level: 'A1',
        topic: 'Colors and objects',
        objective: 'Nhận diện màu sắc và đồ vật qua câu ngắn.',
        duration: '8 phút',
        segments: [
          ['Teacher', 'This is a blue pen.'],
          ['Student', 'The pen is blue.'],
          ['Teacher', 'That is a red notebook.'],
          ['Student', 'The notebook is red.']
        ],
        vocabulary: [['blue', 'màu xanh dương'], ['red', 'màu đỏ'], ['notebook', 'vở ghi']],
        questions: [
          receptiveQuestions.multiple('What color is the pen?', ['Blue', 'Red', 'Green', 'Yellow'], 'Blue'),
          receptiveQuestions.multiple('What object is red?', ['Notebook', 'Pen', 'Desk', 'Bag'], 'Notebook'),
          receptiveQuestions.boolean('The notebook is blue.', false, 'The notebook is red.')
        ]
      },
      {
        title: 'Thời gian trong ngày',
        description: 'Luyện nghe giờ đơn giản và hoạt động trong ngày.',
        level: 'A1',
        topic: 'Time',
        objective: 'Nghe giờ và hoạt động thường ngày.',
        duration: '9 phút',
        segments: [
          ['Anna', 'I get up at six thirty.'],
          ['Anna', 'I go to school at seven fifteen.'],
          ['Mark', 'I have dinner at seven o clock.'],
          ['Mark', 'I go to bed at ten.']
        ],
        vocabulary: [['get up', 'thức dậy'], ['dinner', 'bữa tối'], ['go to bed', 'đi ngủ']],
        questions: [
          receptiveQuestions.multiple('What time does Anna get up?', ['Six thirty', 'Seven fifteen', 'Seven o clock', 'Ten'], 'Six thirty'),
          receptiveQuestions.multiple('What does Mark do at seven o clock?', ['He has dinner', 'He goes to school', 'He gets up', 'He studies English'], 'He has dinner'),
          receptiveQuestions.blank('Anna goes to school at seven ___.', 'fifteen', ['fifteen', '7:15'], 'The audio says seven fifteen.')
        ]
      }
    ],
    main: [
      {
        title: 'Ordering Lunch',
        description: 'Listen to a short conversation at a lunch counter.',
        level: 'A1',
        topic: 'Food',
        objective: 'Understand simple food orders and prices.',
        duration: '10 phút',
        segments: [
          ['Cashier', 'Hello. What would you like for lunch?'],
          ['Customer', 'I would like a chicken sandwich and orange juice.'],
          ['Cashier', 'Sure. That is six dollars.'],
          ['Customer', 'Here you are. Thank you.']
        ],
        vocabulary: [['sandwich', 'bánh mì kẹp'], ['orange juice', 'nước cam'], ['dollars', 'đô la']],
        questions: [
          receptiveQuestions.multiple('What does the customer order?', ['A chicken sandwich and orange juice', 'A salad and tea', 'A burger and water', 'Soup and coffee'], 'A chicken sandwich and orange juice'),
          receptiveQuestions.multiple('How much is the lunch?', ['Six dollars', 'Five dollars', 'Seven dollars', 'Ten dollars'], 'Six dollars'),
          receptiveQuestions.boolean('The customer orders coffee.', false, 'The customer orders orange juice.')
        ]
      },
      {
        title: 'At The Bus Stop',
        description: 'Listen for route, time, and destination details.',
        level: 'A1',
        topic: 'Transport',
        objective: 'Catch simple travel information in a short dialogue.',
        duration: '11 phút',
        segments: [
          ['Traveler', 'Excuse me, does this bus go to the museum?'],
          ['Local', 'Yes, take bus number twelve.'],
          ['Traveler', 'When does it arrive?'],
          ['Local', 'It arrives in ten minutes.']
        ],
        vocabulary: [['museum', 'bảo tàng'], ['arrive', 'đến nơi'], ['minutes', 'phút']],
        questions: [
          receptiveQuestions.multiple('Where does the traveler want to go?', ['The museum', 'The airport', 'The library', 'The hotel'], 'The museum'),
          receptiveQuestions.multiple('Which bus should the traveler take?', ['Number twelve', 'Number twenty', 'Number two', 'Number ten'], 'Number twelve'),
          receptiveQuestions.blank('The bus arrives in ___ minutes.', 'ten', ['ten', '10'])
        ]
      },
      {
        title: 'Making An Appointment',
        description: 'Understand a simple phone call about choosing a time.',
        level: 'A2',
        topic: 'Appointments',
        objective: 'Listen for day, time, and purpose.',
        duration: '12 phút',
        segments: [
          ['Receptionist', 'Good morning. How can I help you?'],
          ['Caller', 'I need to make an appointment with Dr. Brown.'],
          ['Receptionist', 'Is Thursday at three o clock okay?'],
          ['Caller', 'Yes, Thursday at three is fine.']
        ],
        vocabulary: [['appointment', 'cuộc hẹn'], ['receptionist', 'lễ tân'], ['fine', 'ổn']],
        questions: [
          receptiveQuestions.multiple('Who does the caller want to meet?', ['Dr. Brown', 'A teacher', 'A manager', 'A driver'], 'Dr. Brown'),
          receptiveQuestions.multiple('When is the appointment?', ['Thursday at three', 'Tuesday at three', 'Thursday at two', 'Friday at ten'], 'Thursday at three'),
          receptiveQuestions.boolean('The call is about buying medicine.', false, 'The call is about making an appointment.')
        ]
      }
    ]
  },
  reading: {
    table: 'ReadingLessons',
    foundation: [
      {
        title: 'A Small Family',
        description: 'Đọc đoạn ngắn về các thành viên trong gia đình.',
        level: 'A1',
        topic: 'Family',
        objective: 'Nhận biết từ vựng gia đình và thông tin cơ bản.',
        duration: '8 phút',
        passageTitle: 'My Family',
        paragraphs: [
          'My name is Mai. I live with my father, my mother, and my little brother.',
          'My father is a driver. My mother is a nurse. My brother is six years old.',
          'We eat dinner together every evening.'
        ],
        vocabulary: [['father', 'bố'], ['mother', 'mẹ'], ['together', 'cùng nhau']],
        questions: [
          receptiveQuestions.multiple('Who does Mai live with?', ['Her parents and brother', 'Her aunt', 'Her teacher', 'Her friends'], 'Her parents and brother'),
          receptiveQuestions.multiple('What is Mai s mother?', ['A nurse', 'A driver', 'A student', 'A cook'], 'A nurse'),
          receptiveQuestions.boolean('Mai has a little brother.', true)
        ]
      },
      {
        title: 'My School Bag',
        description: 'Đọc đoạn ngắn về đồ vật trong cặp sách.',
        level: 'A1',
        topic: 'School objects',
        objective: 'Hiểu câu mô tả đồ vật quen thuộc.',
        duration: '8 phút',
        passageTitle: 'In My Bag',
        paragraphs: [
          'This is my school bag. It is black and blue.',
          'I have two books, one notebook, three pens, and a small ruler.',
          'I bring my bag to school every day.'
        ],
        vocabulary: [['school bag', 'cặp sách'], ['ruler', 'thước kẻ'], ['bring', 'mang theo']],
        questions: [
          receptiveQuestions.multiple('What color is the school bag?', ['Black and blue', 'Red and yellow', 'Green and white', 'Pink and black'], 'Black and blue'),
          receptiveQuestions.multiple('How many pens are in the bag?', ['Three', 'Two', 'One', 'Four'], 'Three'),
          receptiveQuestions.blank('The student has a small ___.', 'ruler', ['ruler'])
        ]
      },
      {
        title: 'The Weather Today',
        description: 'Đọc bản tin thời tiết rất ngắn.',
        level: 'A1',
        topic: 'Weather',
        objective: 'Hiểu từ vựng thời tiết và lời khuyên đơn giản.',
        duration: '9 phút',
        passageTitle: 'Sunny Morning',
        paragraphs: [
          'It is sunny this morning. The sky is clear and blue.',
          'It is hot in the afternoon, so bring a bottle of water.',
          'In the evening, it may be windy.'
        ],
        vocabulary: [['sunny', 'có nắng'], ['clear', 'quang đãng'], ['windy', 'có gió']],
        questions: [
          receptiveQuestions.multiple('How is the sky in the morning?', ['Clear and blue', 'Dark and rainy', 'Cloudy and gray', 'Windy and cold'], 'Clear and blue'),
          receptiveQuestions.multiple('What should you bring?', ['A bottle of water', 'A heavy coat', 'A notebook', 'An umbrella'], 'A bottle of water'),
          receptiveQuestions.boolean('It may be windy in the evening.', true)
        ]
      }
    ],
    main: [
      {
        title: 'A Weekend Market',
        description: 'Read about a local market and answer detail questions.',
        level: 'A1',
        topic: 'Shopping',
        objective: 'Understand prices, items, and simple preferences.',
        duration: '10 phút',
        passageTitle: 'Saturday Market',
        paragraphs: [
          'Every Saturday morning, Lan visits the market near her house.',
          'She buys fresh vegetables, eggs, and fruit for her family.',
          'Her favorite stall sells mangoes because they are sweet and cheap.'
        ],
        vocabulary: [['market', 'chợ'], ['stall', 'quầy hàng'], ['cheap', 'rẻ']],
        questions: [
          receptiveQuestions.multiple('When does Lan visit the market?', ['Saturday morning', 'Sunday evening', 'Monday morning', 'Friday night'], 'Saturday morning'),
          receptiveQuestions.multiple('What does her favorite stall sell?', ['Mangoes', 'Bread', 'Fish', 'Books'], 'Mangoes'),
          receptiveQuestions.boolean('The mangoes are expensive.', false)
        ]
      },
      {
        title: 'A New Neighbor',
        description: 'Read a short story about meeting a neighbor.',
        level: 'A2',
        topic: 'Community',
        objective: 'Identify people, actions, and feelings in a story.',
        duration: '11 phút',
        passageTitle: 'Next Door',
        paragraphs: [
          'Tom moved into the apartment next to Nina last week.',
          'On Sunday, Nina helped him carry two heavy boxes upstairs.',
          'Tom thanked her and invited her family for tea.'
        ],
        vocabulary: [['neighbor', 'hàng xóm'], ['carry', 'mang vác'], ['invite', 'mời']],
        questions: [
          receptiveQuestions.multiple('When did Tom move in?', ['Last week', 'Yesterday', 'Last year', 'This morning'], 'Last week'),
          receptiveQuestions.multiple('What did Nina help Tom carry?', ['Two heavy boxes', 'Three chairs', 'A small table', 'A bag of food'], 'Two heavy boxes'),
          receptiveQuestions.boolean('Tom invited Nina s family for tea.', true)
        ]
      },
      {
        title: 'Saving Water At Home',
        description: 'Read a practical text about saving water.',
        level: 'A2',
        topic: 'Environment',
        objective: 'Understand advice and reasons in a simple article.',
        duration: '12 phút',
        passageTitle: 'Use Less Water',
        paragraphs: [
          'Water is important, but many families use more than they need.',
          'You can save water by taking shorter showers and turning off the tap while brushing your teeth.',
          'Small habits at home can help protect rivers and lakes.'
        ],
        vocabulary: [['tap', 'vòi nước'], ['habit', 'thói quen'], ['protect', 'bảo vệ']],
        questions: [
          receptiveQuestions.multiple('How can you save water while brushing your teeth?', ['Turn off the tap', 'Use hot water', 'Brush longer', 'Open the window'], 'Turn off the tap'),
          receptiveQuestions.multiple('What can small habits protect?', ['Rivers and lakes', 'Cars and roads', 'Books and pens', 'Phones and computers'], 'Rivers and lakes'),
          receptiveQuestions.boolean('The text says water is not important.', false)
        ]
      }
    ]
  },
  speaking: {
    table: 'SpeakingLessons',
    foundation: [
      {
        title: 'Hỏi và trả lời tuổi',
        description: 'Luyện nói câu hỏi tuổi và câu trả lời ngắn.',
        questions: [
          speakingQuestion('How old are you?', 'Bạn bao nhiêu tuổi?', ['I am twelve years old.', 'I am twenty years old.', 'I am a student.'], ['Tôi 12 tuổi.', 'Tôi 20 tuổi.', 'Tôi là học sinh.']),
          speakingQuestion('How old is your brother?', 'Em trai bạn bao nhiêu tuổi?', ['He is six years old.', 'She is six years old.', 'It is six years old.'], ['Em ấy 6 tuổi.', 'Cô ấy 6 tuổi.', 'Nó 6 tuổi.']),
          speakingQuestion('Are you a student?', 'Bạn có phải học sinh không?', ['Yes, I am a student.', 'No, I am a teacher.', 'Yes, I live here.'], ['Vâng, tôi là học sinh.', 'Không, tôi là giáo viên.', 'Vâng, tôi sống ở đây.'])
        ]
      },
      {
        title: 'Nói về đồ vật trong lớp',
        description: 'Luyện trả lời đồ vật và màu sắc đơn giản.',
        questions: [
          speakingQuestion('What is this?', 'Đây là gì?', ['This is a pencil.', 'This is my father.', 'This is sunny.'], ['Đây là bút chì.', 'Đây là bố tôi.', 'Trời nắng.']),
          speakingQuestion('What color is your book?', 'Sách của bạn màu gì?', ['My book is blue.', 'My book is Monday.', 'My book is school.'], ['Sách của tôi màu xanh.', 'Sách của tôi là thứ Hai.', 'Sách của tôi là trường học.']),
          speakingQuestion('Do you have a notebook?', 'Bạn có vở ghi không?', ['Yes, I have a notebook.', 'No, I am a notebook.', 'Yes, it is raining.'], ['Có, tôi có một quyển vở.', 'Không, tôi là quyển vở.', 'Có, trời đang mưa.'])
        ]
      },
      {
        title: 'Hỏi giờ đơn giản',
        description: 'Luyện nói giờ và hoạt động trong ngày.',
        questions: [
          speakingQuestion('What time is it?', 'Mấy giờ rồi?', ['It is seven o clock.', 'It is my name.', 'It is a book.'], ['Bảy giờ rồi.', 'Đó là tên tôi.', 'Đó là một quyển sách.']),
          speakingQuestion('When do you go to school?', 'Khi nào bạn đi học?', ['I go to school at seven.', 'I go to school in my bag.', 'I go to school blue.'], ['Tôi đi học lúc bảy giờ.', 'Tôi đi học trong cặp.', 'Tôi đi học màu xanh.']),
          speakingQuestion('When do you have dinner?', 'Khi nào bạn ăn tối?', ['I have dinner at seven.', 'I have dinner at school bag.', 'I have dinner very red.'], ['Tôi ăn tối lúc bảy giờ.', 'Tôi ăn tối ở cặp sách.', 'Tôi ăn tối rất đỏ.'])
        ]
      }
    ],
    main: [
      {
        title: 'Chao hoi va phan hoi',
        description: 'Practice natural greetings and short replies.',
        questions: [
          speakingQuestion('Good morning. How are you today?', 'Chao buoi sang. Hom nay ban the nao?', ['Good morning. I am fine, thank you.', 'Good night. I am sleeping.', 'Goodbye. I am busy.'], ['Chao buoi sang. Toi khoe, cam on.', 'Chuc ngu ngon. Toi dang ngu.', 'Tam biet. Toi ban.']),
          speakingQuestion('Nice to meet you.', 'Rat vui duoc gap ban.', ['Nice to meet you too.', 'I am twelve years old.', 'It is on the table.'], ['Toi cung rat vui duoc gap ban.', 'Toi 12 tuoi.', 'No o tren ban.']),
          speakingQuestion('See you tomorrow.', 'Hen gap ban ngay mai.', ['See you tomorrow.', 'I am from Vietnam.', 'It costs five dollars.'], ['Hen gap ban ngay mai.', 'Toi den tu Viet Nam.', 'No gia nam do la.'])
        ]
      },
      {
        title: 'Gioi thieu ban than',
        description: 'Practice giving basic personal information.',
        questions: [
          speakingQuestion('Can you introduce yourself?', 'Ban co the gioi thieu ban than khong?', ['My name is Linh. I am a student.', 'This is a blue pen.', 'The weather is sunny.'], ['Toi ten la Linh. Toi la hoc sinh.', 'Day la mot cay but mau xanh.', 'Thoi tiet co nang.']),
          speakingQuestion('Where are you from?', 'Ban den tu dau?', ['I am from Vietnam.', 'I am in the morning.', 'I am twenty dollars.'], ['Toi den tu Viet Nam.', 'Toi o buoi sang.', 'Toi la hai muoi do la.']),
          speakingQuestion('What do you do?', 'Ban lam nghe gi?', ['I am a student.', 'I am at seven o clock.', 'I am a sandwich.'], ['Toi la hoc sinh.', 'Toi luc bay gio.', 'Toi la banh mi kep.'])
        ]
      },
      {
        title: 'Dat mon tai nha hang',
        description: 'Practice ordering food and drinks politely.',
        questions: [
          speakingQuestion('What would you like to order?', 'Ban muon goi mon gi?', ['I would like chicken rice, please.', 'I live near the school.', 'It is Monday today.'], ['Toi muon com ga, lam on.', 'Toi song gan truong.', 'Hom nay la thu Hai.']),
          speakingQuestion('Would you like anything to drink?', 'Ban muon uong gi khong?', ['Yes, I would like orange juice.', 'Yes, I go by bus.', 'No, it is a book.'], ['Co, toi muon nuoc cam.', 'Co, toi di bang xe buyt.', 'Khong, do la mot quyen sach.']),
          speakingQuestion('Can I have the bill, please?', 'Cho toi xin hoa don duoc khong?', ['Can I have the bill, please?', 'Can I have a hospital, please?', 'Can I have the weather, please?'], ['Cho toi xin hoa don duoc khong?', 'Cho toi xin benh vien duoc khong?', 'Cho toi xin thoi tiet duoc khong?'])
        ]
      },
      {
        title: 'Hoi duong',
        description: 'Practice asking for directions in simple situations.',
        questions: [
          speakingQuestion('Excuse me, where is the library?', 'Xin loi, thu vien o dau?', ['It is next to the bank.', 'It is very delicious.', 'It is my sister.'], ['No o canh ngan hang.', 'No rat ngon.', 'Do la chi gai toi.']),
          speakingQuestion('How can I get to the station?', 'Toi den nha ga bang cach nao?', ['Go straight and turn left.', 'I am a student.', 'It opens at seven.'], ['Di thang va re trai.', 'Toi la hoc sinh.', 'No mo cua luc bay gio.']),
          speakingQuestion('Is it far from here?', 'No co xa day khong?', ['No, it is about five minutes away.', 'No, I like coffee.', 'Yes, I have two pens.'], ['Khong, cach khoang nam phut.', 'Khong, toi thich ca phe.', 'Co, toi co hai cay but.'])
        ]
      },
      {
        title: 'Mua sam co ban',
        description: 'Practice asking prices and buying common items.',
        questions: [
          speakingQuestion('How much is this T-shirt?', 'Ao phong nay gia bao nhieu?', ['It is ten dollars.', 'It is at ten o clock.', 'It is my teacher.'], ['No gia muoi do la.', 'No luc muoi gio.', 'Do la giao vien cua toi.']),
          speakingQuestion('Do you have this in blue?', 'Ban co mau xanh khong?', ['Yes, we have it in blue.', 'Yes, I have breakfast.', 'No, I am from here.'], ['Co, chung toi co mau xanh.', 'Co, toi an sang.', 'Khong, toi den tu day.']),
          speakingQuestion('I will take it.', 'Toi se lay cai nay.', ['I will take it.', 'I will sleep it.', 'I will weather it.'], ['Toi se lay cai nay.', 'Toi se ngu no.', 'Toi se thoi tiet no.'])
        ]
      }
    ]
  },
  writing: {
    table: 'WritingLessons',
    foundation: [
      {
        title: 'Viết câu với I have',
        description: 'Luyện viết câu sở hữu rất ngắn.',
        passageEN: 'I have a book. I have two pens. I have a small bag.',
        passageVI: 'Tôi có một quyển sách. Tôi có hai cây bút. Tôi có một chiếc cặp nhỏ.',
        exercises: [
          writingExercise('Tôi có một quyển sách.', 'I have a book.', [['book', 'quyển sách']]),
          writingExercise('Tôi có hai cây bút.', 'I have two pens.', [['two', 'hai'], ['pens', 'bút']]),
          writingExercise('Tôi có một chiếc cặp nhỏ.', 'I have a small bag.', [['small', 'nhỏ'], ['bag', 'cặp']])
        ]
      },
      {
        title: 'Viết câu với There is',
        description: 'Luyện viết câu mô tả có một đồ vật.',
        passageEN: 'There is a desk. There is a chair. There is a clock on the wall.',
        passageVI: 'Có một cái bàn học. Có một cái ghế. Có một chiếc đồng hồ trên tường.',
        exercises: [
          writingExercise('Có một cái bàn học.', 'There is a desk.', [['desk', 'bàn học']]),
          writingExercise('Có một cái ghế.', 'There is a chair.', [['chair', 'ghế']]),
          writingExercise('Có một chiếc đồng hồ trên tường.', 'There is a clock on the wall.', [['clock', 'đồng hồ'], ['wall', 'tường']])
        ]
      },
      {
        title: 'Viết câu về thời gian',
        description: 'Luyện viết giờ và hoạt động hằng ngày.',
        passageEN: 'I get up at six. I go to school at seven. I go to bed at ten.',
        passageVI: 'Tôi thức dậy lúc sáu giờ. Tôi đi học lúc bảy giờ. Tôi đi ngủ lúc mười giờ.',
        exercises: [
          writingExercise('Tôi thức dậy lúc sáu giờ.', 'I get up at six.', [['get up', 'thức dậy']]),
          writingExercise('Tôi đi học lúc bảy giờ.', 'I go to school at seven.', [['school', 'trường học']]),
          writingExercise('Tôi đi ngủ lúc mười giờ.', 'I go to bed at ten.', [['go to bed', 'đi ngủ']])
        ]
      }
    ],
    main: [
      {
        title: 'Gioi thieu ban than',
        description: 'Write a short self-introduction paragraph.',
        passageEN: 'My name is Nam. I am a student. I live in Da Nang. I like English because it helps me talk to new people.',
        passageVI: 'Toi ten la Nam. Toi la hoc sinh. Toi song o Da Nang. Toi thich tieng Anh vi no giup toi noi chuyen voi nguoi moi.',
        exercises: [
          writingExercise('Toi ten la Nam.', 'My name is Nam.', [['name', 'ten']]),
          writingExercise('Toi la hoc sinh.', 'I am a student.', [['student', 'hoc sinh']]),
          writingExercise('Toi thich tieng Anh.', 'I like English.', [['like', 'thich'], ['English', 'tieng Anh']])
        ]
      },
      {
        title: 'So thich ca nhan',
        description: 'Write sentences about hobbies and free time.',
        passageEN: 'I like reading books after school. On weekends, I play football with my friends. These hobbies help me relax.',
        passageVI: 'Toi thich doc sach sau gio hoc. Vao cuoi tuan, toi choi bong da voi ban be. Nhung so thich nay giup toi thu gian.',
        exercises: [
          writingExercise('Toi thich doc sach sau gio hoc.', 'I like reading books after school.', [['reading', 'doc'], ['after school', 'sau gio hoc']]),
          writingExercise('Toi choi bong da voi ban be.', 'I play football with my friends.', [['football', 'bong da'], ['friends', 'ban be']]),
          writingExercise('Nhung so thich nay giup toi thu gian.', 'These hobbies help me relax.', [['hobbies', 'so thich'], ['relax', 'thu gian']])
        ]
      },
      {
        title: 'Email cong viec',
        description: 'Write a polite short work email.',
        passageEN: 'Dear Ms. Lee, I am writing to confirm our meeting tomorrow. The meeting will start at 9 a.m. Thank you for your time.',
        passageVI: 'Kinh gui co Lee, toi viet de xac nhan cuoc hop ngay mai. Cuoc hop se bat dau luc 9 gio sang. Cam on co vi da danh thoi gian.',
        exercises: [
          writingExercise('Toi viet de xac nhan cuoc hop ngay mai.', 'I am writing to confirm our meeting tomorrow.', [['confirm', 'xac nhan'], ['meeting', 'cuoc hop']]),
          writingExercise('Cuoc hop se bat dau luc 9 gio sang.', 'The meeting will start at 9 a.m.', [['start', 'bat dau'], ['9 a.m.', '9 gio sang']]),
          writingExercise('Cam on co vi da danh thoi gian.', 'Thank you for your time.', [['thank you', 'cam on'], ['time', 'thoi gian']])
        ]
      },
      {
        title: 'Mot ngay thuong nhat',
        description: 'Write about a daily routine with time markers.',
        passageEN: 'I get up at six o clock. I go to school in the morning and do homework in the evening. I usually go to bed at ten.',
        passageVI: 'Toi thuc day luc sau gio. Toi di hoc vao buoi sang va lam bai tap vao buoi toi. Toi thuong di ngu luc muoi gio.',
        exercises: [
          writingExercise('Toi thuc day luc sau gio.', 'I get up at six o clock.', [['get up', 'thuc day']]),
          writingExercise('Toi lam bai tap vao buoi toi.', 'I do homework in the evening.', [['homework', 'bai tap'], ['evening', 'buoi toi']]),
          writingExercise('Toi thuong di ngu luc muoi gio.', 'I usually go to bed at ten.', [['usually', 'thuong'], ['go to bed', 'di ngu']])
        ]
      },
      {
        title: 'Ky niem o truong',
        description: 'Write a short memory about school.',
        passageEN: 'Last month, my class joined a music show at school. We practiced every afternoon. I felt nervous, but the show was successful.',
        passageVI: 'Thang truoc, lop toi tham gia mot chuong trinh am nhac o truong. Chung toi luyen tap moi buoi chieu. Toi cam thay hoi lo, nhung chuong trinh da thanh cong.',
        exercises: [
          writingExercise('Lop toi tham gia mot chuong trinh am nhac.', 'My class joined a music show.', [['joined', 'tham gia'], ['music show', 'chuong trinh am nhac']]),
          writingExercise('Chung toi luyen tap moi buoi chieu.', 'We practiced every afternoon.', [['practiced', 'luyen tap'], ['afternoon', 'buoi chieu']]),
          writingExercise('Chuong trinh da thanh cong.', 'The show was successful.', [['successful', 'thanh cong']])
        ]
      }
    ]
  }
};

function speakingQuestion(question, translation, options, translations) {
  return {
    question,
    translation,
    options: options.map((text, index) => ({ text, translation: translations[index] || '' }))
  };
}

function writingExercise(contentVI, correctAnswerEN, vocab = []) {
  return { contentVI, correctAnswerEN, vocab };
}

function normalizeTitle(value) {
  return String(value || '').trim().toLowerCase();
}

async function tableExists(pool, tableName) {
  const result = await pool.query(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public' AND lower(table_name) = lower($1)
    ) AS exists
  `, [tableName]);
  return Boolean(result.rows[0]?.exists);
}

async function columnSet(pool, tableName) {
  const result = await pool.query(`
    SELECT lower(column_name) AS name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND lower(table_name) = lower($1)
  `, [tableName]);
  return new Set(result.rows.map((row) => row.name));
}

async function ensureCourseColumns(pool, tableName) {
  if (!await tableExists(pool, tableName)) return;
  await pool.query(`ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS IsFoundation boolean DEFAULT false`);
  await pool.query(`ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS OrderIndex integer DEFAULT 0`);
}

async function insertRow(pool, tableName, data) {
  const columns = await columnSet(pool, tableName);
  const entries = Object.entries(data).filter(([key, value]) => value !== undefined && columns.has(key.toLowerCase()));
  const names = entries.map(([key]) => key);
  const values = entries.map(([, value]) => value);
  const placeholders = values.map((_, index) => `$${index + 1}`);
  const result = await pool.query(`
    INSERT INTO ${tableName} (${names.join(', ')})
    VALUES (${placeholders.join(', ')})
    RETURNING Id AS id
  `, values);
  return result.rows[0].id;
}

async function getLessons(pool, tableName) {
  const hasCreatedAt = (await columnSet(pool, tableName)).has('createdat');
  const result = await pool.query(`
    SELECT Id, Title, COALESCE(IsFoundation, false) AS is_foundation, COALESCE(OrderIndex, 0) AS order_index
    FROM ${tableName}
    ORDER BY COALESCE(IsFoundation, false) DESC, COALESCE(OrderIndex, 0) ASC, ${hasCreatedAt ? 'CreatedAt ASC,' : ''} Title ASC
  `);
  return result.rows;
}

function groupRows(rows, isFoundation) {
  return rows
    .filter((row) => Boolean(row.is_foundation) === isFoundation)
    .sort((a, b) => Number(a.order_index || 0) - Number(b.order_index || 0) || String(a.title).localeCompare(String(b.title)));
}

async function deleteLessons(pool, skill, ids) {
  if (!ids.length) return;

  if (skill === 'listening') {
    await pool.query('DELETE FROM ListeningProgress WHERE LessonId = ANY($1::uuid[])', [ids]);
    await pool.query('DELETE FROM ListeningQuestions WHERE LessonId = ANY($1::uuid[])', [ids]);
    await pool.query('DELETE FROM ListeningVocabulary WHERE LessonId = ANY($1::uuid[])', [ids]);
    await pool.query('DELETE FROM ListeningSegments WHERE LessonId = ANY($1::uuid[])', [ids]);
    if (await tableExists(pool, 'ListeningSpeakers')) {
      await pool.query('DELETE FROM ListeningSpeakers WHERE LessonId = ANY($1::uuid[])', [ids]);
    }
    await pool.query('DELETE FROM ListeningLessons WHERE Id = ANY($1::uuid[])', [ids]);
    return;
  }

  if (skill === 'reading') {
    await pool.query('DELETE FROM ReadingProgress WHERE LessonId = ANY($1::uuid[])', [ids]);
    await pool.query('DELETE FROM ReadingQuestions WHERE LessonId = ANY($1::uuid[])', [ids]);
    await pool.query('DELETE FROM ReadingVocabulary WHERE LessonId = ANY($1::uuid[])', [ids]);
    await pool.query('DELETE FROM ReadingParagraphs WHERE LessonId = ANY($1::uuid[])', [ids]);
    await pool.query('DELETE FROM ReadingLessons WHERE Id = ANY($1::uuid[])', [ids]);
    return;
  }

  if (skill === 'speaking') {
    await pool.query('DELETE FROM SpeakingProgress WHERE LessonId = ANY($1::uuid[])', [ids]);
    await pool.query('DELETE FROM SpeakingQuestions WHERE LessonId = ANY($1::uuid[])', [ids]);
    await pool.query('DELETE FROM SpeakingLessons WHERE Id = ANY($1::uuid[])', [ids]);
    return;
  }

  if (skill === 'writing') {
    await pool.query('DELETE FROM WritingProgress WHERE LessonId = ANY($1::uuid[])', [ids]);
    await pool.query(`
      DELETE FROM WritingVocab
      WHERE ExerciseId IN (
        SELECT Id FROM WritingExercises WHERE LessonId = ANY($1::uuid[])
      )
    `, [ids]);
    await pool.query('DELETE FROM WritingExercises WHERE LessonId = ANY($1::uuid[])', [ids]);
    await pool.query('DELETE FROM WritingLessons WHERE Id = ANY($1::uuid[])', [ids]);
  }
}

async function insertLessonContent(pool, skill, lessonId, lesson) {
  if (skill === 'listening') {
    for (const [index, [speaker, text]] of lesson.segments.entries()) {
      await insertRow(pool, 'ListeningSegments', { LessonId: lessonId, Speaker: speaker, Text: text, OrderIndex: index + 1 });
    }
    for (const [index, [word, meaning]] of lesson.vocabulary.entries()) {
      await insertRow(pool, 'ListeningVocabulary', { LessonId: lessonId, Word: word, Meaning: meaning, OrderIndex: index + 1 });
    }
    for (const [index, question] of lesson.questions.entries()) {
      await insertRow(pool, 'ListeningQuestions', {
        LessonId: lessonId,
        QuestionType: question.type,
        Prompt: question.prompt,
        OptionA: question.options?.[0] || null,
        OptionB: question.options?.[1] || null,
        OptionC: question.options?.[2] || null,
        OptionD: question.options?.[3] || null,
        CorrectAnswer: question.type === 'true_false' ? null : question.answer,
        CorrectBoolean: question.type === 'true_false' ? question.answer : null,
        AcceptedAnswers: question.acceptedAnswers?.join('\n') || null,
        Explanation: question.explanation || '',
        OrderIndex: index + 1
      });
    }
    return;
  }

  if (skill === 'reading') {
    for (const [index, content] of lesson.paragraphs.entries()) {
      await insertRow(pool, 'ReadingParagraphs', { LessonId: lessonId, Content: content, OrderIndex: index + 1 });
    }
    for (const [index, [word, meaning]] of lesson.vocabulary.entries()) {
      await insertRow(pool, 'ReadingVocabulary', { LessonId: lessonId, Word: word, Meaning: meaning, OrderIndex: index + 1 });
    }
    for (const [index, question] of lesson.questions.entries()) {
      await insertRow(pool, 'ReadingQuestions', {
        LessonId: lessonId,
        QuestionType: question.type,
        Prompt: question.prompt,
        OptionA: question.options?.[0] || null,
        OptionB: question.options?.[1] || null,
        OptionC: question.options?.[2] || null,
        OptionD: question.options?.[3] || null,
        CorrectAnswer: question.type === 'true_false' ? null : question.answer,
        CorrectBoolean: question.type === 'true_false' ? question.answer : null,
        AcceptedAnswers: question.acceptedAnswers?.join('\n') || null,
        Explanation: question.explanation || '',
        OrderIndex: index + 1
      });
    }
    return;
  }

  if (skill === 'speaking') {
    for (const [index, question] of lesson.questions.entries()) {
      await insertRow(pool, 'SpeakingQuestions', {
        LessonId: lessonId,
        Question: question.question,
        Translation: question.translation,
        Option1: question.options[0]?.text || '',
        Option1VI: question.options[0]?.translation || '',
        Option2: question.options[1]?.text || '',
        Option2VI: question.options[1]?.translation || '',
        Option3: question.options[2]?.text || '',
        Option3VI: question.options[2]?.translation || '',
        OrderIndex: index + 1
      });
    }
    return;
  }

  if (skill === 'writing') {
    for (const [index, exercise] of lesson.exercises.entries()) {
      const exerciseId = await insertRow(pool, 'WritingExercises', {
        LessonId: lessonId,
        ContentVI: exercise.contentVI,
        CorrectAnswerEN: exercise.correctAnswerEN,
        OrderIndex: index + 1
      });
      for (const [vocabIndex, [word, meaning]] of exercise.vocab.entries()) {
        await insertRow(pool, 'WritingVocab', { ExerciseId: exerciseId, Word: word, Meaning: meaning, OrderIndex: vocabIndex + 1 });
      }
    }
  }
}

async function insertLesson(pool, skill, isFoundation, orderIndex, lesson) {
  const config = DATA[skill];
  const base = {
    Title: lesson.title,
    Description: lesson.description || '',
    Level: lesson.level,
    Topic: lesson.topic,
    Objective: lesson.objective,
    Duration: lesson.duration,
    PassageTitle: lesson.passageTitle,
    PassageEN: lesson.passageEN,
    PassageVI: lesson.passageVI,
    IsFoundation: isFoundation,
    OrderIndex: orderIndex,
    UpdatedAt: new Date()
  };
  const lessonId = await insertRow(pool, config.table, base);
  await insertLessonContent(pool, skill, lessonId, lesson);
  return lessonId;
}

async function reorderLessons(pool, tableName) {
  const rows = await getLessons(pool, tableName);
  const foundationRows = groupRows(rows, true);
  const mainRows = groupRows(rows, false);

  for (const [index, row] of foundationRows.entries()) {
    await pool.query(`UPDATE ${tableName} SET IsFoundation = true, OrderIndex = $1 WHERE Id = $2`, [-50 + index, row.id]);
  }
  for (const [index, row] of mainRows.entries()) {
    await pool.query(`UPDATE ${tableName} SET IsFoundation = false, OrderIndex = $1 WHERE Id = $2`, [index + 1, row.id]);
  }
}

function pickInsertCandidates(existingRows, candidates, needed) {
  const titles = new Set(existingRows.map((row) => normalizeTitle(row.title)));
  return candidates.filter((lesson) => !titles.has(normalizeTitle(lesson.title))).slice(0, needed);
}

async function syncSkill(pool, skill) {
  const config = DATA[skill];
  await ensureCourseColumns(pool, config.table);
  let rows = await getLessons(pool, config.table);
  const operations = [];

  for (const [groupName, isFoundation] of [['foundation', true], ['main', false]]) {
    const groupRows = groupRowsByOrder(rows, isFoundation);
    const extras = groupRows.slice(TARGET_PER_GROUP);
    if (extras.length) {
      operations.push({ type: 'delete', skill, group: groupName, titles: extras.map((row) => row.title) });
      if (!DRY_RUN) {
        await deleteLessons(pool, skill, extras.map((row) => row.id));
      }
    }
  }

  if (!DRY_RUN) rows = await getLessons(pool, config.table);

  for (const [groupName, isFoundation] of [['foundation', true], ['main', false]]) {
    const currentGroupRows = groupRowsByOrder(rows, isFoundation);
    const needed = Math.max(0, TARGET_PER_GROUP - currentGroupRows.length);
    if (!needed) continue;

    const candidates = pickInsertCandidates(currentGroupRows, config[groupName], needed);
    if (candidates.length < needed) {
      throw new Error(`${skill} ${groupName} needs ${needed} lessons, but only ${candidates.length} seed candidates are available.`);
    }

    operations.push({ type: 'insert', skill, group: groupName, titles: candidates.map((lesson) => lesson.title) });
    if (!DRY_RUN) {
      const startIndex = currentGroupRows.length;
      for (const [offset, lesson] of candidates.entries()) {
        await insertLesson(pool, skill, isFoundation, isFoundation ? -50 + startIndex + offset : startIndex + offset + 1, lesson);
      }
    }
  }

  if (!DRY_RUN) {
    await reorderLessons(pool, config.table);
  }

  return operations;
}

function groupRowsByOrder(rows, isFoundation) {
  return rows
    .filter((row) => Boolean(row.is_foundation) === isFoundation)
    .sort((a, b) => Number(a.order_index || 0) - Number(b.order_index || 0) || String(a.title).localeCompare(String(b.title)));
}

async function auditFinal(pool) {
  const result = {};
  for (const [skill, config] of Object.entries(DATA)) {
    const rows = await getLessons(pool, config.table);
    result[skill] = {
      foundation: groupRowsByOrder(rows, true).length,
      main: groupRowsByOrder(rows, false).length
    };
  }
  return result;
}

async function run() {
  await connectDB();
  const pool = getPool();

  try {
    if (!DRY_RUN) await pool.query('BEGIN');
    const operations = [];
    for (const skill of ['listening', 'reading', 'speaking', 'writing']) {
      operations.push(...await syncSkill(pool, skill));
    }
    const finalCounts = DRY_RUN ? null : await auditFinal(pool);
    if (!DRY_RUN) await pool.query('COMMIT');

    console.log(JSON.stringify({
      dryRun: DRY_RUN,
      operations,
      finalCounts
    }, null, 2));
  } catch (error) {
    if (!DRY_RUN) await pool.query('ROLLBACK');
    throw error;
  } finally {
    await closeDB();
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

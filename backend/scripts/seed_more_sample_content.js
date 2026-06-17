require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const crypto = require('crypto');
const { connectDB, getPool, closeDB } = require('../src/config/database');

function stableId(scope, value) {
  const hex = crypto.createHash('sha1').update(`${scope}:${value}`).digest('hex');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    `4${hex.slice(13, 16)}`,
    `${((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16)}${hex.slice(17, 20)}`,
    hex.slice(20, 32)
  ].join('-');
}

const gameSets = [
  {
    key: 'daily-life',
    name: 'Daily Life Challenge',
    description: 'Ôn từ vựng và câu giao tiếp hằng ngày qua 4 dạng mini game.',
    icon: '🏠',
    orderIndex: 4,
    levels: [
      {
        name: 'Morning Routine',
        difficulty: 'easy',
        timeLimit: 120,
        passScore: 60,
        questions: [
          ['matching', 'Breakfast', 'Bữa sáng', 'Breakfast', []],
          ['matching', 'Shower', 'Tắm', 'Shower', []],
          ['listening', 'I wake up at six', 'Tôi thức dậy lúc sáu giờ', 'I wake up at six', ['I wake up at six', 'I work at six', 'I walk at six', 'I wait at six']],
          ['listening', 'She brushes her teeth', 'Cô ấy đánh răng', 'She brushes her teeth', ['She washes her face', 'She brushes her teeth', 'She cooks breakfast', 'She drinks water']],
          ['listenbuild', 'I make my bed every morning', 'Tôi dọn giường mỗi buổi sáng', 'I make my bed every morning', ['I', 'make', 'my', 'bed', 'every', 'morning']],
          ['listenbuild', 'We have breakfast together', 'Chúng tôi ăn sáng cùng nhau', 'We have breakfast together', ['We', 'have', 'breakfast', 'together']],
          ['truefalse', 'I go to bed at night', 'Tôi đi ngủ vào ban đêm', 'true', []],
          ['truefalse', 'Breakfast means bữa tối', 'Breakfast nghĩa là bữa tối', 'false', []],
          ['matching', 'Commute', 'Đi lại hằng ngày', 'Commute', []],
          ['listening', 'The bus is late today', 'Xe buýt hôm nay đến muộn', 'The bus is late today', ['The bus is late today', 'The bus is early today', 'The train is late today', 'The car is late today']]
        ]
      },
      {
        name: 'At Home',
        difficulty: 'medium',
        timeLimit: 110,
        passScore: 70,
        questions: [
          ['matching', 'Kitchen', 'Nhà bếp', 'Kitchen', []],
          ['matching', 'Living room', 'Phòng khách', 'Living room', []],
          ['listening', 'Please clean your room', 'Vui lòng dọn phòng của bạn', 'Please clean your room', ['Please clean your room', 'Please close your room', 'Please call your room', 'Please cook your room']],
          ['listening', 'The keys are on the table', 'Chìa khóa ở trên bàn', 'The keys are on the table', ['The keys are in the bag', 'The keys are on the table', 'The keys are under the chair', 'The keys are near the door']],
          ['listenbuild', 'My family watches TV after dinner', 'Gia đình tôi xem TV sau bữa tối', 'My family watches TV after dinner', ['My', 'family', 'watches', 'TV', 'after', 'dinner']],
          ['listenbuild', 'I need to buy some groceries', 'Tôi cần mua một ít thực phẩm', 'I need to buy some groceries', ['I', 'need', 'to', 'buy', 'some', 'groceries']],
          ['truefalse', 'A bedroom is a place to sleep', 'Phòng ngủ là nơi để ngủ', 'true', []],
          ['truefalse', 'A fridge is used to wash clothes', 'Tủ lạnh dùng để giặt quần áo', 'false', []],
          ['matching', 'Laundry', 'Đồ giặt / việc giặt đồ', 'Laundry', []],
          ['listening', 'Can you open the window', 'Bạn có thể mở cửa sổ không', 'Can you open the window', ['Can you open the window', 'Can you close the window', 'Can you open the door', 'Can you clean the window']]
        ]
      },
      {
        name: 'Weekend Plans',
        difficulty: 'hard',
        timeLimit: 100,
        passScore: 80,
        questions: [
          ['matching', 'Relax', 'Thư giãn', 'Relax', []],
          ['matching', 'Appointment', 'Cuộc hẹn', 'Appointment', []],
          ['listening', 'We are going to visit our grandparents', 'Chúng tôi sẽ thăm ông bà', 'We are going to visit our grandparents', ['We are going to visit our grandparents', 'We are going to visit our parents', 'We are going to invite our grandparents', 'We are going to meet our classmates']],
          ['listening', 'I might go shopping this Sunday', 'Tôi có thể đi mua sắm Chủ nhật này', 'I might go shopping this Sunday', ['I might go shopping this Sunday', 'I must go shopping this Sunday', 'I might go jogging this Sunday', 'I might go swimming this Sunday']],
          ['listenbuild', 'If it rains, we will stay at home', 'Nếu trời mưa, chúng tôi sẽ ở nhà', 'If it rains, we will stay at home', ['If', 'it', 'rains', 'we', 'will', 'stay', 'at', 'home']],
          ['listenbuild', 'I usually prepare my clothes before a trip', 'Tôi thường chuẩn bị quần áo trước chuyến đi', 'I usually prepare my clothes before a trip', ['I', 'usually', 'prepare', 'my', 'clothes', 'before', 'a', 'trip']],
          ['truefalse', 'An appointment is a planned meeting', 'Appointment là một cuộc hẹn đã được lên kế hoạch', 'true', []],
          ['truefalse', 'Relax means làm việc quá sức', 'Relax nghĩa là làm việc quá sức', 'false', []],
          ['matching', 'Outdoor', 'Ngoài trời', 'Outdoor', []],
          ['listening', 'Let us meet at the coffee shop', 'Chúng ta hãy gặp ở quán cà phê', 'Let us meet at the coffee shop', ['Let us meet at the coffee shop', 'Let us eat at the coffee shop', 'Let us meet at the bookshop', 'Let us wait at the coffee shop']]
        ]
      }
    ]
  },
  {
    key: 'travel',
    name: 'Travel English Quest',
    description: 'Từ vựng sân bay, khách sạn và hỏi đường dành cho người đi du lịch.',
    icon: '✈️',
    orderIndex: 5,
    levels: [
      {
        name: 'At the Airport',
        difficulty: 'easy',
        timeLimit: 120,
        passScore: 60,
        questions: [
          ['matching', 'Passport', 'Hộ chiếu', 'Passport', []],
          ['matching', 'Luggage', 'Hành lý', 'Luggage', []],
          ['listening', 'Where is the check-in counter', 'Quầy làm thủ tục ở đâu', 'Where is the check-in counter', ['Where is the check-in counter', 'Where is the ticket counter', 'Where is the information desk', 'Where is the boarding gate']],
          ['listening', 'My flight is delayed', 'Chuyến bay của tôi bị hoãn', 'My flight is delayed', ['My flight is delayed', 'My flight is canceled', 'My train is delayed', 'My flight is early']],
          ['listenbuild', 'I have one suitcase and one backpack', 'Tôi có một vali và một ba lô', 'I have one suitcase and one backpack', ['I', 'have', 'one', 'suitcase', 'and', 'one', 'backpack']],
          ['listenbuild', 'Please show me your boarding pass', 'Vui lòng cho tôi xem thẻ lên máy bay', 'Please show me your boarding pass', ['Please', 'show', 'me', 'your', 'boarding', 'pass']],
          ['truefalse', 'A passport is used for international travel', 'Hộ chiếu dùng cho du lịch quốc tế', 'true', []],
          ['truefalse', 'Luggage means vé máy bay', 'Luggage nghĩa là vé máy bay', 'false', []],
          ['matching', 'Gate', 'Cổng lên máy bay', 'Gate', []],
          ['listening', 'The boarding gate has changed', 'Cổng lên máy bay đã thay đổi', 'The boarding gate has changed', ['The boarding gate has changed', 'The boarding time has changed', 'The boarding pass has changed', 'The boarding gate has closed']]
        ]
      },
      {
        name: 'Hotel Check-in',
        difficulty: 'medium',
        timeLimit: 110,
        passScore: 70,
        questions: [
          ['matching', 'Reservation', 'Đặt phòng', 'Reservation', []],
          ['matching', 'Reception', 'Lễ tân', 'Reception', []],
          ['listening', 'I have a reservation under the name Linh', 'Tôi có đặt phòng dưới tên Linh', 'I have a reservation under the name Linh', ['I have a reservation under the name Linh', 'I have a question under the name Linh', 'I made a reservation for lunch', 'I have a room with Linh']],
          ['listening', 'Could I have a room with a window', 'Tôi có thể lấy phòng có cửa sổ không', 'Could I have a room with a window', ['Could I have a room with a window', 'Could I have a room with a balcony', 'Could I have a room near the window', 'Could I have a room without a window']],
          ['listenbuild', 'The room is clean and comfortable', 'Căn phòng sạch sẽ và thoải mái', 'The room is clean and comfortable', ['The', 'room', 'is', 'clean', 'and', 'comfortable']],
          ['listenbuild', 'Breakfast is included in the price', 'Bữa sáng được bao gồm trong giá', 'Breakfast is included in the price', ['Breakfast', 'is', 'included', 'in', 'the', 'price']],
          ['truefalse', 'Reception is the hotel front desk', 'Reception là quầy lễ tân khách sạn', 'true', []],
          ['truefalse', 'Reservation means trả phòng', 'Reservation nghĩa là trả phòng', 'false', []],
          ['matching', 'Key card', 'Thẻ khóa phòng', 'Key card', []],
          ['listening', 'What time is check-out', 'Mấy giờ trả phòng', 'What time is check-out', ['What time is check-out', 'What time is check-in', 'What time is breakfast', 'What time is the meeting']]
        ]
      },
      {
        name: 'Asking for Directions',
        difficulty: 'hard',
        timeLimit: 100,
        passScore: 80,
        questions: [
          ['matching', 'Intersection', 'Ngã tư', 'Intersection', []],
          ['matching', 'Pharmacy', 'Nhà thuốc', 'Pharmacy', []],
          ['listening', 'Go straight and turn left at the bank', 'Đi thẳng và rẽ trái ở ngân hàng', 'Go straight and turn left at the bank', ['Go straight and turn left at the bank', 'Go straight and turn right at the bank', 'Go straight and turn left at the park', 'Go across and turn left at the bank']],
          ['listening', 'Is there a bus stop near here', 'Có trạm xe buýt gần đây không', 'Is there a bus stop near here', ['Is there a bus stop near here', 'Is there a train station near here', 'Is there a bus stop over there', 'Is there a taxi stand near here']],
          ['listenbuild', 'The museum is opposite the post office', 'Bảo tàng ở đối diện bưu điện', 'The museum is opposite the post office', ['The', 'museum', 'is', 'opposite', 'the', 'post', 'office']],
          ['listenbuild', 'You can get there in ten minutes', 'Bạn có thể đến đó trong mười phút', 'You can get there in ten minutes', ['You', 'can', 'get', 'there', 'in', 'ten', 'minutes']],
          ['truefalse', 'Opposite means across from something', 'Opposite nghĩa là ở đối diện một thứ gì đó', 'true', []],
          ['truefalse', 'Turn left means rẽ phải', 'Turn left nghĩa là rẽ phải', 'false', []],
          ['matching', 'Crosswalk', 'Vạch qua đường', 'Crosswalk', []],
          ['listening', 'Could you show me on the map', 'Bạn có thể chỉ cho tôi trên bản đồ không', 'Could you show me on the map', ['Could you show me on the map', 'Could you call me on the map', 'Could you show me the menu', 'Could you show me at the map']]
        ]
      }
    ]
  },
  {
    key: 'work-study',
    name: 'Work & Study Arena',
    description: 'Luyện tiếng Anh dùng trong lớp học, công việc và email.',
    icon: '💼',
    orderIndex: 6,
    levels: [
      {
        name: 'Classroom English',
        difficulty: 'easy',
        timeLimit: 120,
        passScore: 60,
        questions: [
          ['matching', 'Assignment', 'Bài tập được giao', 'Assignment', []],
          ['matching', 'Deadline', 'Hạn chót', 'Deadline', []],
          ['listening', 'Please submit your homework by Friday', 'Vui lòng nộp bài tập trước thứ Sáu', 'Please submit your homework by Friday', ['Please submit your homework by Friday', 'Please send your homework by Monday', 'Please submit your project by Friday', 'Please finish your homework by Friday']],
          ['listening', 'I do not understand this question', 'Tôi không hiểu câu hỏi này', 'I do not understand this question', ['I do not understand this question', 'I do not answer this question', 'I do not remember this question', 'I do not understand this lesson']],
          ['listenbuild', 'Can you explain it again', 'Bạn có thể giải thích lại không', 'Can you explain it again', ['Can', 'you', 'explain', 'it', 'again']],
          ['listenbuild', 'The teacher gave us useful feedback', 'Giáo viên đã cho chúng tôi phản hồi hữu ích', 'The teacher gave us useful feedback', ['The', 'teacher', 'gave', 'us', 'useful', 'feedback']],
          ['truefalse', 'Deadline means the final time to finish something', 'Deadline là hạn cuối để hoàn thành việc gì đó', 'true', []],
          ['truefalse', 'Assignment means kỳ nghỉ', 'Assignment nghĩa là kỳ nghỉ', 'false', []],
          ['matching', 'Feedback', 'Phản hồi', 'Feedback', []],
          ['listening', 'May I ask a question', 'Em có thể hỏi một câu không', 'May I ask a question', ['May I ask a question', 'May I answer a question', 'May I make a question', 'May I repeat a question']]
        ]
      },
      {
        name: 'Office Talk',
        difficulty: 'medium',
        timeLimit: 110,
        passScore: 70,
        questions: [
          ['matching', 'Meeting', 'Cuộc họp', 'Meeting', []],
          ['matching', 'Report', 'Báo cáo', 'Report', []],
          ['listening', 'Can we move the meeting to tomorrow', 'Chúng ta có thể dời cuộc họp sang ngày mai không', 'Can we move the meeting to tomorrow', ['Can we move the meeting to tomorrow', 'Can we start the meeting tomorrow', 'Can we cancel the meeting tomorrow', 'Can we move the report to tomorrow']],
          ['listening', 'I will send the report this afternoon', 'Tôi sẽ gửi báo cáo chiều nay', 'I will send the report this afternoon', ['I will send the report this afternoon', 'I will read the report this afternoon', 'I will send the email this afternoon', 'I will write the report tomorrow']],
          ['listenbuild', 'Our team is working on a new project', 'Nhóm chúng tôi đang làm một dự án mới', 'Our team is working on a new project', ['Our', 'team', 'is', 'working', 'on', 'a', 'new', 'project']],
          ['listenbuild', 'Could you share the file with me', 'Bạn có thể chia sẻ file với tôi không', 'Could you share the file with me', ['Could', 'you', 'share', 'the', 'file', 'with', 'me']],
          ['truefalse', 'A report presents information clearly', 'Báo cáo trình bày thông tin một cách rõ ràng', 'true', []],
          ['truefalse', 'Meeting means đi nghỉ', 'Meeting nghĩa là đi nghỉ', 'false', []],
          ['matching', 'Colleague', 'Đồng nghiệp', 'Colleague', []],
          ['listening', 'Let us review the plan together', 'Chúng ta hãy cùng xem lại kế hoạch', 'Let us review the plan together', ['Let us review the plan together', 'Let us remove the plan together', 'Let us rewrite the plan tomorrow', 'Let us receive the plan together']]
        ]
      },
      {
        name: 'Professional Email',
        difficulty: 'hard',
        timeLimit: 100,
        passScore: 80,
        questions: [
          ['matching', 'Attachment', 'Tệp đính kèm', 'Attachment', []],
          ['matching', 'Confirm', 'Xác nhận', 'Confirm', []],
          ['listening', 'Please find the attached document', 'Vui lòng xem tài liệu đính kèm', 'Please find the attached document', ['Please find the attached document', 'Please sign the attached document', 'Please send the attached document', 'Please open the attached document']],
          ['listening', 'I look forward to your response', 'Tôi mong nhận được phản hồi của bạn', 'I look forward to your response', ['I look forward to your response', 'I look forward to your report', 'I look forward to your request', 'I look forward to your result']],
          ['listenbuild', 'Could you confirm the schedule by today', 'Bạn có thể xác nhận lịch trình trong hôm nay không', 'Could you confirm the schedule by today', ['Could', 'you', 'confirm', 'the', 'schedule', 'by', 'today']],
          ['listenbuild', 'Thank you for your quick reply', 'Cảm ơn phản hồi nhanh của bạn', 'Thank you for your quick reply', ['Thank', 'you', 'for', 'your', 'quick', 'reply']],
          ['truefalse', 'Attachment is a file sent with an email', 'Attachment là tệp được gửi kèm email', 'true', []],
          ['truefalse', 'Confirm means từ chối', 'Confirm nghĩa là từ chối', 'false', []],
          ['matching', 'Regarding', 'Về việc / liên quan đến', 'Regarding', []],
          ['listening', 'I am writing regarding your request', 'Tôi viết email liên quan đến yêu cầu của bạn', 'I am writing regarding your request', ['I am writing regarding your request', 'I am reading regarding your request', 'I am writing about your result', 'I am waiting regarding your request']]
        ]
      }
    ]
  }
];

const writingLessons = [
  {
    key: 'daily-routine-paragraph',
    title: 'Một ngày thường nhật',
    description: 'Viết đoạn văn ngắn kể về lịch trình mỗi ngày.',
    orderIndex: 4,
    passageEN: 'I usually wake up at six o\'clock and drink a glass of water. After that, I have breakfast with my family before going to school. In the afternoon, I review my lessons and do my homework carefully. In the evening, I spend thirty minutes practicing English online. This routine helps me stay healthy and study better every day.',
    passageVI: 'Tôi thường thức dậy lúc sáu giờ và uống một ly nước. Sau đó, tôi ăn sáng với gia đình trước khi đến trường. Vào buổi chiều, tôi ôn lại bài và làm bài tập cẩn thận. Vào buổi tối, tôi dành ba mươi phút luyện tiếng Anh trực tuyến. Thói quen này giúp tôi khỏe mạnh và học tốt hơn mỗi ngày.',
    exercises: [
      ['Tôi thường thức dậy lúc sáu giờ và uống một ly nước.', 'I usually wake up at six o\'clock and drink a glass of water.', [['usually', 'thường'], ['wake up', 'thức dậy']]],
      ['Sau đó, tôi ăn sáng với gia đình trước khi đến trường.', 'After that, I have breakfast with my family before going to school.', [['after that', 'sau đó'], ['breakfast', 'bữa sáng']]],
      ['Vào buổi chiều, tôi ôn lại bài và làm bài tập cẩn thận.', 'In the afternoon, I review my lessons and do my homework carefully.', [['review', 'ôn lại'], ['carefully', 'cẩn thận']]],
      ['Vào buổi tối, tôi dành ba mươi phút luyện tiếng Anh trực tuyến.', 'In the evening, I spend thirty minutes practicing English online.', [['spend', 'dành thời gian'], ['online', 'trực tuyến']]],
      ['Thói quen này giúp tôi khỏe mạnh và học tốt hơn mỗi ngày.', 'This routine helps me stay healthy and study better every day.', [['routine', 'thói quen'], ['healthy', 'khỏe mạnh']]]
    ]
  },
  {
    key: 'school-memory-paragraph',
    title: 'Kỷ niệm ở trường',
    description: 'Viết đoạn văn kể về một kỷ niệm đáng nhớ ở trường.',
    orderIndex: 5,
    passageEN: 'Last month, my class joined an English speaking contest at school. At first, I felt nervous because many students were watching us. My friends encouraged me and helped me practice before the performance. Finally, our group won second prize and everyone was very happy. That day taught me that teamwork can make difficult things easier.',
    passageVI: 'Tháng trước, lớp tôi tham gia một cuộc thi nói tiếng Anh ở trường. Lúc đầu, tôi cảm thấy lo lắng vì nhiều học sinh đang xem chúng tôi. Bạn bè đã động viên tôi và giúp tôi luyện tập trước phần trình bày. Cuối cùng, nhóm chúng tôi giành giải nhì và mọi người rất vui. Ngày hôm đó dạy tôi rằng làm việc nhóm có thể khiến những việc khó trở nên dễ hơn.',
    exercises: [
      ['Tháng trước, lớp tôi tham gia một cuộc thi nói tiếng Anh ở trường.', 'Last month, my class joined an English speaking contest at school.', [['contest', 'cuộc thi'], ['joined', 'tham gia']]],
      ['Lúc đầu, tôi cảm thấy lo lắng vì nhiều học sinh đang xem chúng tôi.', 'At first, I felt nervous because many students were watching us.', [['nervous', 'lo lắng'], ['at first', 'lúc đầu']]],
      ['Bạn bè đã động viên tôi và giúp tôi luyện tập trước phần trình bày.', 'My friends encouraged me and helped me practice before the performance.', [['encouraged', 'động viên'], ['performance', 'phần trình bày']]],
      ['Cuối cùng, nhóm chúng tôi giành giải nhì và mọi người rất vui.', 'Finally, our group won second prize and everyone was very happy.', [['finally', 'cuối cùng'], ['second prize', 'giải nhì']]],
      ['Ngày hôm đó dạy tôi rằng làm việc nhóm có thể khiến những việc khó trở nên dễ hơn.', 'That day taught me that teamwork can make difficult things easier.', [['teamwork', 'làm việc nhóm'], ['difficult', 'khó khăn']]]
    ]
  },
  {
    key: 'healthy-lifestyle-paragraph',
    title: 'Lối sống lành mạnh',
    description: 'Viết đoạn văn đưa ra lời khuyên về sức khỏe.',
    orderIndex: 6,
    passageEN: 'A healthy lifestyle is important for both students and workers. We should eat more vegetables, drink enough water, and avoid too much fast food. Regular exercise also helps us reduce stress and sleep better at night. Besides, we need to take short breaks when we study or work for a long time. If we keep these habits, we will have more energy every day.',
    passageVI: 'Một lối sống lành mạnh rất quan trọng đối với cả học sinh và người đi làm. Chúng ta nên ăn nhiều rau hơn, uống đủ nước và tránh quá nhiều đồ ăn nhanh. Tập thể dục thường xuyên cũng giúp chúng ta giảm căng thẳng và ngủ ngon hơn vào ban đêm. Bên cạnh đó, chúng ta cần nghỉ ngắn khi học hoặc làm việc trong thời gian dài. Nếu duy trì những thói quen này, chúng ta sẽ có nhiều năng lượng hơn mỗi ngày.',
    exercises: [
      ['Một lối sống lành mạnh rất quan trọng đối với cả học sinh và người đi làm.', 'A healthy lifestyle is important for both students and workers.', [['lifestyle', 'lối sống'], ['important', 'quan trọng']]],
      ['Chúng ta nên ăn nhiều rau hơn, uống đủ nước và tránh quá nhiều đồ ăn nhanh.', 'We should eat more vegetables, drink enough water, and avoid too much fast food.', [['vegetables', 'rau'], ['avoid', 'tránh']]],
      ['Tập thể dục thường xuyên cũng giúp chúng ta giảm căng thẳng và ngủ ngon hơn vào ban đêm.', 'Regular exercise also helps us reduce stress and sleep better at night.', [['regular', 'thường xuyên'], ['reduce stress', 'giảm căng thẳng']]],
      ['Bên cạnh đó, chúng ta cần nghỉ ngắn khi học hoặc làm việc trong thời gian dài.', 'Besides, we need to take short breaks when we study or work for a long time.', [['besides', 'bên cạnh đó'], ['breaks', 'nghỉ giải lao']]],
      ['Nếu duy trì những thói quen này, chúng ta sẽ có nhiều năng lượng hơn mỗi ngày.', 'If we keep these habits, we will have more energy every day.', [['habits', 'thói quen'], ['energy', 'năng lượng']]]
    ]
  },
  {
    key: 'travel-experience-paragraph',
    title: 'Trải nghiệm du lịch',
    description: 'Viết đoạn văn kể về một chuyến đi đáng nhớ.',
    orderIndex: 7,
    passageEN: 'Last summer, my family traveled to Da Nang for three days. We visited the beach in the morning and enjoyed fresh seafood in the evening. The weather was sunny, so we took many beautiful photos together. I was especially impressed by the friendly local people. This trip helped my family relax after a busy year.',
    passageVI: 'Mùa hè năm ngoái, gia đình tôi đi du lịch Đà Nẵng trong ba ngày. Chúng tôi đến bãi biển vào buổi sáng và thưởng thức hải sản tươi vào buổi tối. Thời tiết nắng đẹp nên chúng tôi chụp nhiều bức ảnh đẹp cùng nhau. Tôi đặc biệt ấn tượng với người dân địa phương thân thiện. Chuyến đi này giúp gia đình tôi thư giãn sau một năm bận rộn.',
    exercises: [
      ['Mùa hè năm ngoái, gia đình tôi đi du lịch Đà Nẵng trong ba ngày.', 'Last summer, my family traveled to Da Nang for three days.', [['traveled', 'đã đi du lịch'], ['for three days', 'trong ba ngày']]],
      ['Chúng tôi đến bãi biển vào buổi sáng và thưởng thức hải sản tươi vào buổi tối.', 'We visited the beach in the morning and enjoyed fresh seafood in the evening.', [['beach', 'bãi biển'], ['seafood', 'hải sản']]],
      ['Thời tiết nắng đẹp nên chúng tôi chụp nhiều bức ảnh đẹp cùng nhau.', 'The weather was sunny, so we took many beautiful photos together.', [['sunny', 'nắng'], ['took photos', 'chụp ảnh']]],
      ['Tôi đặc biệt ấn tượng với người dân địa phương thân thiện.', 'I was especially impressed by the friendly local people.', [['especially', 'đặc biệt'], ['local people', 'người dân địa phương']]],
      ['Chuyến đi này giúp gia đình tôi thư giãn sau một năm bận rộn.', 'This trip helped my family relax after a busy year.', [['relax', 'thư giãn'], ['busy', 'bận rộn']]]
    ]
  },
  {
    key: 'environment-paragraph',
    title: 'Bảo vệ môi trường',
    description: 'Viết đoạn văn nêu hành động bảo vệ môi trường.',
    orderIndex: 8,
    passageEN: 'Protecting the environment starts with small actions in daily life. We can save electricity by turning off lights when we leave a room. We should also use reusable bags instead of plastic bags. At school, students can plant trees and keep the classroom clean. If everyone takes responsibility, our city will become greener and cleaner.',
    passageVI: 'Bảo vệ môi trường bắt đầu từ những hành động nhỏ trong đời sống hằng ngày. Chúng ta có thể tiết kiệm điện bằng cách tắt đèn khi rời khỏi phòng. Chúng ta cũng nên dùng túi tái sử dụng thay vì túi nhựa. Ở trường, học sinh có thể trồng cây và giữ lớp học sạch sẽ. Nếu mọi người có trách nhiệm, thành phố của chúng ta sẽ trở nên xanh và sạch hơn.',
    exercises: [
      ['Bảo vệ môi trường bắt đầu từ những hành động nhỏ trong đời sống hằng ngày.', 'Protecting the environment starts with small actions in daily life.', [['environment', 'môi trường'], ['daily life', 'đời sống hằng ngày']]],
      ['Chúng ta có thể tiết kiệm điện bằng cách tắt đèn khi rời khỏi phòng.', 'We can save electricity by turning off lights when we leave a room.', [['electricity', 'điện'], ['turn off', 'tắt']]],
      ['Chúng ta cũng nên dùng túi tái sử dụng thay vì túi nhựa.', 'We should also use reusable bags instead of plastic bags.', [['reusable', 'có thể tái sử dụng'], ['instead of', 'thay vì']]],
      ['Ở trường, học sinh có thể trồng cây và giữ lớp học sạch sẽ.', 'At school, students can plant trees and keep the classroom clean.', [['plant trees', 'trồng cây'], ['clean', 'sạch sẽ']]],
      ['Nếu mọi người có trách nhiệm, thành phố của chúng ta sẽ trở nên xanh và sạch hơn.', 'If everyone takes responsibility, our city will become greener and cleaner.', [['responsibility', 'trách nhiệm'], ['greener', 'xanh hơn']]]
    ]
  },
  {
    key: 'online-learning-paragraph',
    title: 'Học trực tuyến',
    description: 'Viết đoạn văn trình bày lợi ích và khó khăn của học online.',
    orderIndex: 9,
    passageEN: 'Online learning has become popular because it is flexible and convenient. Students can review recorded lessons whenever they have free time. However, they may feel distracted if they do not have a quiet place to study. To learn effectively, students should prepare a clear schedule and take notes carefully. With good discipline, online learning can bring excellent results.',
    passageVI: 'Học trực tuyến trở nên phổ biến vì linh hoạt và tiện lợi. Học sinh có thể xem lại bài giảng đã ghi hình bất cứ khi nào có thời gian rảnh. Tuy nhiên, họ có thể bị xao nhãng nếu không có nơi yên tĩnh để học. Để học hiệu quả, học sinh nên chuẩn bị một lịch trình rõ ràng và ghi chú cẩn thận. Với tính kỷ luật tốt, học trực tuyến có thể mang lại kết quả xuất sắc.',
    exercises: [
      ['Học trực tuyến trở nên phổ biến vì linh hoạt và tiện lợi.', 'Online learning has become popular because it is flexible and convenient.', [['flexible', 'linh hoạt'], ['convenient', 'tiện lợi']]],
      ['Học sinh có thể xem lại bài giảng đã ghi hình bất cứ khi nào có thời gian rảnh.', 'Students can review recorded lessons whenever they have free time.', [['recorded lessons', 'bài giảng đã ghi hình'], ['whenever', 'bất cứ khi nào']]],
      ['Tuy nhiên, họ có thể bị xao nhãng nếu không có nơi yên tĩnh để học.', 'However, they may feel distracted if they do not have a quiet place to study.', [['however', 'tuy nhiên'], ['distracted', 'bị xao nhãng']]],
      ['Để học hiệu quả, học sinh nên chuẩn bị một lịch trình rõ ràng và ghi chú cẩn thận.', 'To learn effectively, students should prepare a clear schedule and take notes carefully.', [['effectively', 'hiệu quả'], ['schedule', 'lịch trình']]],
      ['Với tính kỷ luật tốt, học trực tuyến có thể mang lại kết quả xuất sắc.', 'With good discipline, online learning can bring excellent results.', [['discipline', 'kỷ luật'], ['excellent', 'xuất sắc']]]
    ]
  },
  {
    key: 'job-application-email',
    title: 'Email xin việc',
    description: 'Viết email ngắn ứng tuyển công việc bằng tiếng Anh.',
    orderIndex: 10,
    passageEN: 'Dear Hiring Manager, I am writing to apply for the part-time assistant position at your company. I believe my communication skills and careful working style are suitable for this role. I have attached my CV for your review. I would appreciate the opportunity to discuss my application in an interview. Thank you for your time and consideration.',
    passageVI: 'Kính gửi nhà tuyển dụng, tôi viết email này để ứng tuyển vị trí trợ lý bán thời gian tại công ty của ông/bà. Tôi tin rằng kỹ năng giao tiếp và phong cách làm việc cẩn thận của tôi phù hợp với vai trò này. Tôi đã đính kèm CV để ông/bà xem xét. Tôi rất mong có cơ hội thảo luận về hồ sơ của mình trong một buổi phỏng vấn. Cảm ơn ông/bà vì thời gian và sự cân nhắc.',
    exercises: [
      ['Kính gửi nhà tuyển dụng, tôi viết email này để ứng tuyển vị trí trợ lý bán thời gian tại công ty của ông/bà.', 'Dear Hiring Manager, I am writing to apply for the part-time assistant position at your company.', [['apply for', 'ứng tuyển'], ['position', 'vị trí']]],
      ['Tôi tin rằng kỹ năng giao tiếp và phong cách làm việc cẩn thận của tôi phù hợp với vai trò này.', 'I believe my communication skills and careful working style are suitable for this role.', [['communication skills', 'kỹ năng giao tiếp'], ['suitable', 'phù hợp']]],
      ['Tôi đã đính kèm CV để ông/bà xem xét.', 'I have attached my CV for your review.', [['attached', 'đã đính kèm'], ['review', 'xem xét']]],
      ['Tôi rất mong có cơ hội thảo luận về hồ sơ của mình trong một buổi phỏng vấn.', 'I would appreciate the opportunity to discuss my application in an interview.', [['opportunity', 'cơ hội'], ['interview', 'phỏng vấn']]],
      ['Cảm ơn ông/bà vì thời gian và sự cân nhắc.', 'Thank you for your time and consideration.', [['consideration', 'sự cân nhắc'], ['thank you for', 'cảm ơn vì']]]
    ]
  }
];

async function upsertGameContent(pool) {
  const trackId = '2f2131f7-33c3-4c00-a3c9-7db3c93b9ea2';

  await pool.query(`
    SELECT $1::uuid AS Id, $2::text AS Name, $3::text AS Description, $4::text AS Icon
  `, [
    trackId,
    'Mini Games tổng hợp',
    'Một thẻ mini game duy nhất, các chủ đề được chia thành nhiều cấp độ bên trong.',
    '🎮'
  ]);

  let globalLevelNumber = 4;

  for (const set of gameSets) {
    for (const [levelIndex, level] of set.levels.entries()) {
      const sourceLevelNumber = levelIndex + 1;
      const levelId = stableId('game-level', `${set.key}-${sourceLevelNumber}`);
      await pool.query(`
        INSERT INTO GameLevels (Id, LevelNumber, Name, Difficulty, TimeLimit, PassScore, IsLocked)
        VALUES ($1, $2, $3, $4, $5, $6, false)
        ON CONFLICT (Id) DO UPDATE SET
          LevelNumber = EXCLUDED.LevelNumber,
          Name = EXCLUDED.Name,
          Difficulty = EXCLUDED.Difficulty,
          TimeLimit = EXCLUDED.TimeLimit,
          PassScore = EXCLUDED.PassScore,
          IsLocked = EXCLUDED.IsLocked
      `, [
        levelId,
        globalLevelNumber,
        `${set.name} - ${level.name}`,
        level.difficulty,
        level.timeLimit,
        level.passScore
      ]);

      for (const [questionIndex, q] of level.questions.entries()) {
        const [type, contentEN, contentVI, correctAnswer, options] = q;
        const questionId = stableId('mini-game-question', `${set.key}-${sourceLevelNumber}-${questionIndex + 1}`);
        await pool.query(`
          INSERT INTO MiniGameQuestions
            (Id, LevelId, QuestionType, ContentEN, ContentVI, AudioUrl, ImageUrl, CorrectAnswer, Options, OrderIndex)
          VALUES ($1, $2, $3, $4, $5, NULL, NULL, $6, $7, $8)
          ON CONFLICT (Id) DO UPDATE SET
            LevelId = EXCLUDED.LevelId,
            QuestionType = EXCLUDED.QuestionType,
            ContentEN = EXCLUDED.ContentEN,
            ContentVI = EXCLUDED.ContentVI,
            CorrectAnswer = EXCLUDED.CorrectAnswer,
            Options = EXCLUDED.Options,
            OrderIndex = EXCLUDED.OrderIndex
        `, [questionId, levelId, type, contentEN, contentVI, correctAnswer, JSON.stringify(options), questionIndex]);
      }

      globalLevelNumber += 1;
    }
  }

  for (const set of gameSets) {
    await pool.query('SELECT $1::uuid', [stableId('game-set', set.key)]);
  }
}

async function upsertWritingContent(pool) {
  await pool.query(`ALTER TABLE WritingLessons ADD COLUMN IF NOT EXISTS PassageEN text`);
  await pool.query(`ALTER TABLE WritingLessons ADD COLUMN IF NOT EXISTS PassageVI text`);

  for (const lesson of writingLessons) {
    const lessonId = stableId('writing-lesson', lesson.key);
    await pool.query(`
      INSERT INTO WritingLessons (Id, Title, Description, PassageEN, PassageVI, OrderIndex)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (Id) DO UPDATE SET
        Title = EXCLUDED.Title,
        Description = EXCLUDED.Description,
        PassageEN = EXCLUDED.PassageEN,
        PassageVI = EXCLUDED.PassageVI,
        OrderIndex = EXCLUDED.OrderIndex
    `, [lessonId, lesson.title, lesson.description, lesson.passageEN, lesson.passageVI, lesson.orderIndex]);

    for (const [exerciseIndex, exercise] of lesson.exercises.entries()) {
      const [contentVI, correctAnswerEN, vocab] = exercise;
      const exerciseId = stableId('writing-exercise', `${lesson.key}-${exerciseIndex + 1}`);
      await pool.query(`
        INSERT INTO WritingExercises (Id, LessonId, ContentVI, CorrectAnswerEN, OrderIndex)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (Id) DO UPDATE SET
          LessonId = EXCLUDED.LessonId,
          ContentVI = EXCLUDED.ContentVI,
          CorrectAnswerEN = EXCLUDED.CorrectAnswerEN,
          OrderIndex = EXCLUDED.OrderIndex
      `, [exerciseId, lessonId, contentVI, correctAnswerEN, exerciseIndex + 1]);

      for (const [vocabIndex, [word, meaning]] of vocab.entries()) {
        const vocabId = stableId('writing-vocab', `${lesson.key}-${exerciseIndex + 1}-${vocabIndex + 1}`);
        await pool.query(`
          INSERT INTO WritingVocab (Id, ExerciseId, Word, Meaning)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (Id) DO UPDATE SET
            ExerciseId = EXCLUDED.ExerciseId,
            Word = EXCLUDED.Word,
            Meaning = EXCLUDED.Meaning
        `, [vocabId, exerciseId, word, meaning]);
      }
    }
  }
}

async function main() {
  try {
    await connectDB();
    const pool = getPool();

    await upsertGameContent(pool);
    await upsertWritingContent(pool);

    console.log(`Seeded 1 game set, ${gameSets.reduce((sum, set) => sum + set.levels.length, 0)} extra game levels, ${gameSets.reduce((sum, set) => sum + set.levels.reduce((levelSum, level) => levelSum + level.questions.length, 0), 0)} mini game questions.`);
    console.log(`Seeded ${writingLessons.length} writing lessons, ${writingLessons.reduce((sum, lesson) => sum + lesson.exercises.length, 0)} writing exercises.`);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

main();

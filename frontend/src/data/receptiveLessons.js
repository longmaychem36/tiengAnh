export const receptiveSkillMeta = {
  listening: {
    title: 'Luyện Nghe',
    subtitle: 'Khóa luyện nghe',
    description: 'Nghe ý chính, bắt chi tiết và luyện lại bằng transcript theo từng câu.',
    backLabel: 'Về khóa nghe',
    listPath: '/listening/lessons',
    accent: '#0e7490'
  },
  reading: {
    title: 'Luyện Đọc',
    subtitle: 'Khóa luyện đọc',
    description: 'Đọc nhanh lấy ý chính, quét thông tin và học từ vựng trong ngữ cảnh.',
    backLabel: 'Về khóa đọc',
    listPath: '/reading/lessons',
    accent: '#7c3aed'
  }
};

export const receptiveLessons = {
  listening: [
    {
      id: 'daily-routine-a1',
      title: 'A Morning Routine',
      level: 'A1',
      topic: 'Daily life',
      duration: '8 phút',
      description: 'Nghe hội thoại ngắn về thói quen buổi sáng.',
      objective: 'Nhận biết thời gian, hoạt động hằng ngày và ý chính của cuộc hội thoại.',
      vocabulary: [
        { word: 'weekday', meaning: 'ngày trong tuần' },
        { word: 'catch the bus', meaning: 'bắt xe buýt' },
        { word: 'usually', meaning: 'thường xuyên' },
        { word: 'news', meaning: 'tin tức' }
      ],
      transcript: [
        { speaker: 'Anna', text: 'Hi Ben. What time do you wake up on weekdays?' },
        { speaker: 'Ben', text: 'I usually wake up at six thirty. I catch the bus at seven fifteen.' },
        { speaker: 'Anna', text: 'That is early. I wake up at seven and have breakfast at home.' },
        { speaker: 'Ben', text: 'What do you eat for breakfast?' },
        { speaker: 'Anna', text: 'I eat bread, drink coffee, and read the news for ten minutes.' },
        { speaker: 'Ben', text: 'That sounds calm. My mornings are always busy.' }
      ],
      questions: [
        {
          id: 'q1',
          type: 'multiple_choice',
          prompt: 'What is the conversation mainly about?',
          options: ['Weekend plans', 'Morning routines', 'A bus ticket', 'A school test'],
          answer: 'Morning routines',
          explanation: 'Anna and Ben talk about waking up, breakfast, and going out in the morning.'
        },
        {
          id: 'q2',
          type: 'true_false',
          prompt: 'Ben catches the bus at seven fifteen.',
          answer: true,
          explanation: 'Ben says he catches the bus at seven fifteen.'
        },
        {
          id: 'q3',
          type: 'fill_blank',
          prompt: 'Anna drinks coffee and reads the ____.',
          answer: 'news',
          acceptedAnswers: ['news', 'the news'],
          explanation: 'The missing word is "news".'
        }
      ]
    },
    {
      id: 'hotel-checkin-a2',
      title: 'Checking In At A Hotel',
      level: 'A2',
      topic: 'Travel',
      duration: '10 phút',
      description: 'Nghe tình huống nhận phòng khách sạn.',
      objective: 'Bắt thông tin về đặt phòng, giấy tờ và thời gian trả phòng.',
      vocabulary: [
        { word: 'reservation', meaning: 'đặt phòng' },
        { word: 'passport', meaning: 'hộ chiếu' },
        { word: 'key card', meaning: 'thẻ phòng' },
        { word: 'check-out', meaning: 'trả phòng' }
      ],
      transcript: [
        { speaker: 'Receptionist', text: 'Good evening. Welcome to Green Lake Hotel. How can I help you?' },
        { speaker: 'Guest', text: 'Hello. I have a reservation under the name Nguyen.' },
        { speaker: 'Receptionist', text: 'Let me check. Yes, one single room for two nights.' },
        { speaker: 'Guest', text: 'That is right. Do you need my passport?' },
        { speaker: 'Receptionist', text: 'Yes, please. Here is your key card. Breakfast is from six thirty to nine.' },
        { speaker: 'Guest', text: 'Great. What time is check-out?' },
        { speaker: 'Receptionist', text: 'Check-out is at eleven in the morning.' }
      ],
      questions: [
        {
          id: 'q1',
          type: 'multiple_choice',
          prompt: 'How long will the guest stay?',
          options: ['One night', 'Two nights', 'Three nights', 'One week'],
          answer: 'Two nights',
          explanation: 'The receptionist confirms one single room for two nights.'
        },
        {
          id: 'q2',
          type: 'true_false',
          prompt: 'Breakfast starts at six thirty.',
          answer: true,
          explanation: 'The receptionist says breakfast is from six thirty to nine.'
        },
        {
          id: 'q3',
          type: 'fill_blank',
          prompt: 'Check-out is at ____ in the morning.',
          answer: 'eleven',
          acceptedAnswers: ['eleven', '11', '11:00'],
          explanation: 'Check-out is at eleven in the morning.'
        }
      ]
    },
    {
      id: 'team-meeting-b1',
      title: 'A Short Team Meeting',
      level: 'B1',
      topic: 'Work',
      duration: '12 phút',
      description: 'Nghe cuộc họp ngắn về kế hoạch dự án.',
      objective: 'Nắm vai trò, deadline và hành động tiếp theo trong bối cảnh công việc.',
      vocabulary: [
        { word: 'deadline', meaning: 'hạn chót' },
        { word: 'update', meaning: 'cập nhật' },
        { word: 'draft', meaning: 'bản nháp' },
        { word: 'confirm', meaning: 'xác nhận' }
      ],
      transcript: [
        { speaker: 'Manager', text: 'Before we finish, I need a quick update on the website project.' },
        { speaker: 'Linh', text: 'The first draft is ready, but we still need product photos from the marketing team.' },
        { speaker: 'Manager', text: 'Can they send the photos by Thursday afternoon?' },
        { speaker: 'Linh', text: 'I will confirm with them today and update the project board.' },
        { speaker: 'Manager', text: 'Good. If we receive the photos on time, we can publish the page next Monday.' }
      ],
      questions: [
        {
          id: 'q1',
          type: 'multiple_choice',
          prompt: 'What does the team still need?',
          options: ['A new manager', 'Product photos', 'A meeting room', 'Customer emails'],
          answer: 'Product photos',
          explanation: 'Linh says they still need product photos from marketing.'
        },
        {
          id: 'q2',
          type: 'true_false',
          prompt: 'Linh will update the project board.',
          answer: true,
          explanation: 'She says she will confirm with marketing and update the board.'
        },
        {
          id: 'q3',
          type: 'fill_blank',
          prompt: 'The page can be published next ____ if the photos arrive on time.',
          answer: 'Monday',
          acceptedAnswers: ['monday', 'next monday'],
          explanation: 'The manager says they can publish the page next Monday.'
        }
      ]
    }
  ],
  reading: [
    {
      id: 'healthy-breakfast-a1',
      title: 'A Healthy Breakfast',
      level: 'A1',
      topic: 'Health',
      duration: '7 phút',
      description: 'Đọc đoạn văn ngắn về bữa sáng lành mạnh.',
      objective: 'Hiểu ý chính, nhận biết thực phẩm và thói quen đơn giản.',
      vocabulary: [
        { word: 'healthy', meaning: 'lành mạnh' },
        { word: 'energy', meaning: 'năng lượng' },
        { word: 'instead of', meaning: 'thay vì' },
        { word: 'habit', meaning: 'thói quen' }
      ],
      passageTitle: 'Why Breakfast Matters',
      paragraphs: [
        'Many students skip breakfast because they are busy in the morning. This can make them feel tired before lunch.',
        'A healthy breakfast does not need to be complicated. A banana, an egg, some bread, or a bowl of rice can give the body energy.',
        'Drinking water is also important. It is better to drink water or milk instead of sweet drinks every morning.'
      ],
      questions: [
        {
          id: 'q1',
          type: 'multiple_choice',
          prompt: 'What is the main idea of the passage?',
          options: ['Breakfast can help students have energy', 'Students should sleep late', 'Sweet drinks are the best choice', 'Lunch is not important'],
          answer: 'Breakfast can help students have energy',
          explanation: 'The passage explains why breakfast gives students energy.'
        },
        {
          id: 'q2',
          type: 'true_false',
          prompt: 'A healthy breakfast must be complicated.',
          answer: false,
          explanation: 'The passage says a healthy breakfast does not need to be complicated.'
        },
        {
          id: 'q3',
          type: 'fill_blank',
          prompt: 'It is better to drink water or ____ instead of sweet drinks.',
          answer: 'milk',
          acceptedAnswers: ['milk'],
          explanation: 'The final paragraph mentions water or milk.'
        }
      ]
    },
    {
      id: 'city-library-a2',
      title: 'The City Library',
      level: 'A2',
      topic: 'Community',
      duration: '9 phút',
      description: 'Đọc thông báo về thư viện thành phố.',
      objective: 'Tìm thông tin về giờ mở cửa, dịch vụ và quy định.',
      vocabulary: [
        { word: 'membership card', meaning: 'thẻ thành viên' },
        { word: 'borrow', meaning: 'mượn' },
        { word: 'return', meaning: 'trả lại' },
        { word: 'quiet area', meaning: 'khu vực yên tĩnh' }
      ],
      passageTitle: 'New Services At The City Library',
      paragraphs: [
        'The City Library is open from 8 a.m. to 7 p.m. from Monday to Saturday. It is closed on Sundays.',
        'Visitors can read newspapers, use computers, and borrow up to five books with a membership card. Books must be returned within two weeks.',
        'The second floor is a quiet area for reading and studying. Phone calls are not allowed there.'
      ],
      questions: [
        {
          id: 'q1',
          type: 'multiple_choice',
          prompt: 'When is the library closed?',
          options: ['Monday', 'Friday', 'Saturday', 'Sunday'],
          answer: 'Sunday',
          explanation: 'The first paragraph says the library is closed on Sundays.'
        },
        {
          id: 'q2',
          type: 'true_false',
          prompt: 'Visitors can borrow up to five books.',
          answer: true,
          explanation: 'The notice says visitors can borrow up to five books with a membership card.'
        },
        {
          id: 'q3',
          type: 'fill_blank',
          prompt: 'Books must be returned within two ____.',
          answer: 'weeks',
          acceptedAnswers: ['weeks', 'week'],
          explanation: 'Books must be returned within two weeks.'
        }
      ]
    },
    {
      id: 'remote-work-b1',
      title: 'Remote Work Habits',
      level: 'B1',
      topic: 'Work',
      duration: '11 phút',
      description: 'Đọc bài ngắn về làm việc từ xa hiệu quả.',
      objective: 'Suy luận ý chính và nhận biết lời khuyên thực tế trong bài đọc.',
      vocabulary: [
        { word: 'remote work', meaning: 'làm việc từ xa' },
        { word: 'distraction', meaning: 'sự xao nhãng' },
        { word: 'schedule', meaning: 'lịch trình' },
        { word: 'productive', meaning: 'hiệu quả' }
      ],
      passageTitle: 'How To Stay Productive At Home',
      paragraphs: [
        'Remote work gives people more flexibility, but it can also create distractions. Some workers find it difficult to separate work time from personal time.',
        'A simple schedule can help. Start work at the same time each day, take short breaks, and write down the three most important tasks before opening email.',
        'It is also useful to create a clear work area. The area does not need to be large, but it should be quiet enough for focused work.'
      ],
      questions: [
        {
          id: 'q1',
          type: 'multiple_choice',
          prompt: 'Which problem does the passage mention?',
          options: ['Remote work is always expensive', 'People may face distractions at home', 'Email cannot be used at home', 'Workers must have a large office'],
          answer: 'People may face distractions at home',
          explanation: 'The first paragraph says remote work can create distractions.'
        },
        {
          id: 'q2',
          type: 'true_false',
          prompt: 'The passage suggests writing down three important tasks.',
          answer: true,
          explanation: 'The second paragraph gives this as a practical habit.'
        },
        {
          id: 'q3',
          type: 'fill_blank',
          prompt: 'A clear work area should be quiet enough for ____ work.',
          answer: 'focused',
          acceptedAnswers: ['focused', 'focus'],
          explanation: 'The final sentence says "quiet enough for focused work".'
        }
      ]
    }
  ]
};

export const getReceptiveLessons = (skill) => receptiveLessons[skill] || [];

export const getReceptiveLesson = (skill, lessonId) => {
  return getReceptiveLessons(skill).find((lesson) => lesson.id === lessonId) || null;
};

export const getNextReceptiveLesson = (skill, lessonId) => {
  const lessons = getReceptiveLessons(skill);
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  return index >= 0 ? lessons[index + 1] || null : null;
};

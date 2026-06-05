const DETAIL_MARKER = 'data-grammar-enhancement="quick-review"';

const topicTips = {
  'Present Simple': [
    'Dùng cho thói quen, sự thật hiển nhiên, lịch trình cố định và động từ trạng thái.',
    'Nhớ thêm s/es với he, she, it trong câu khẳng định.',
    'Sau do, does, don\'t, doesn\'t, động từ chính luôn về nguyên thể.'
  ],
  'Present Continuous': [
    'Dùng cho hành động đang diễn ra, việc tạm thời và kế hoạch gần đã sắp xếp.',
    'Cấu trúc bắt buộc là am/is/are + V-ing.',
    'Không dùng thì tiếp diễn với stative verbs như know, want, believe khi mang nghĩa trạng thái.'
  ],
  'Present Perfect': [
    'Dùng cho trải nghiệm, kết quả còn liên quan hiện tại và hành động bắt đầu trong quá khứ còn tiếp tục.',
    'Since đi với mốc thời gian, for đi với khoảng thời gian.',
    'Already, yet, ever, never thường là tín hiệu quan trọng của thì này.'
  ],
  'Past Simple': [
    'Dùng cho hành động đã kết thúc tại một thời điểm xác định trong quá khứ.',
    'Câu phủ định/nghi vấn dùng did nên động từ chính về nguyên thể.',
    'Phân biệt động từ có quy tắc thêm -ed và động từ bất quy tắc.'
  ],
  'Future Simple': [
    'Dùng will cho quyết định ngay lúc nói, dự đoán, lời hứa và đề nghị.',
    'Dùng be going to cho dự định đã có trước hoặc dự đoán dựa trên dấu hiệu hiện tại.',
    'Sau will luôn dùng động từ nguyên thể.'
  ],
  'Zero & First Conditional': [
    'Loại 0 nói về sự thật chung: If + present simple, present simple.',
    'Loại 1 nói về khả năng thật ở tương lai: If + present simple, will + V.',
    'Không dùng will trong mệnh đề if của điều kiện loại 1.'
  ],
  'Second Conditional': [
    'Dùng cho tình huống giả định, ít có thật ở hiện tại hoặc tương lai.',
    'Cấu trúc chính: If + past simple, would + V.',
    'Với động từ be, were thường dùng cho mọi chủ ngữ trong văn phong chuẩn.'
  ],
  'Third Conditional': [
    'Dùng để nói về điều không xảy ra trong quá khứ và kết quả giả định của nó.',
    'Cấu trúc chính: If + past perfect, would have + V3.',
    'Không trộn past simple vào mệnh đề if khi nói điều kiện loại 3.'
  ],
  'Passive Voice': [
    'Dùng bị động khi muốn nhấn mạnh người/vật chịu tác động hơn người thực hiện.',
    'Cấu trúc chung là be + V3, trong đó be đổi theo thì.',
    'Chỉ thêm by + agent khi người thực hiện thật sự cần thiết.'
  ],
  'Reported Speech': [
    'Đổi lùi thì khi động từ tường thuật ở quá khứ.',
    'Đổi đại từ, trạng từ thời gian và nơi chốn theo ngữ cảnh.',
    'Câu hỏi gián tiếp dùng trật tự câu kể, không đảo trợ động từ.'
  ],
  'Modal Verbs': [
    'Sau modal verb luôn dùng động từ nguyên thể không to.',
    'Must diễn tả bắt buộc mạnh; have to thường nhấn mạnh quy định bên ngoài.',
    'Should dùng cho lời khuyên; may/might dùng cho khả năng.'
  ],
  'Comparatives & Superlatives': [
    'Tính từ ngắn thường thêm -er/-est, tính từ dài dùng more/most.',
    'So sánh hơn dùng than; so sánh nhất thường dùng the.',
    'Một số tính từ bất quy tắc như good, bad, far cần học riêng.'
  ],
  'Relative Clauses': [
    'Who dùng cho người, which dùng cho vật, whose dùng cho sở hữu.',
    'That có thể thay who/which trong nhiều mệnh đề xác định.',
    'Không bỏ đại từ quan hệ nếu nó là chủ ngữ của mệnh đề quan hệ.'
  ],
  'Articles (A / An / The)': [
    'A/an dùng khi nhắc lần đầu hoặc nói một đối tượng chưa xác định.',
    'The dùng khi người nghe đã biết đối tượng hoặc đối tượng là duy nhất trong ngữ cảnh.',
    'Không dùng mạo từ với danh từ số nhiều/không đếm được khi nói chung.'
  ],
  'Prepositions of Time & Place': [
    'At dùng cho điểm thời gian/nơi chốn cụ thể; on dùng cho ngày/bề mặt; in dùng cho khoảng/thể tích/khu vực.',
    'Một số cụm cố định cần học như at night, on the weekend, in the morning.',
    'Không dịch máy móc từng giới từ từ tiếng Việt sang tiếng Anh.'
  ],
  'Gerunds & Infinitives': [
    'Một số động từ theo sau bởi V-ing, một số theo sau bởi to + V.',
    'Sau giới từ luôn dùng V-ing.',
    'Một số động từ đổi nghĩa khi đi với V-ing hoặc to + V, như remember, stop, try.'
  ],
  'Question Tags': [
    'Mệnh đề chính khẳng định thì đuôi phủ định, và ngược lại.',
    'Dùng cùng trợ động từ/thì với mệnh đề chính.',
    'Các trường hợp đặc biệt như I am -> aren\'t I, let\'s -> shall we cần ghi nhớ.'
  ],
  'Subject-Verb Agreement': [
    'Động từ phải hòa hợp với chủ ngữ thật, không phải từ đứng gần nhất.',
    'Each, every, everyone thường đi với động từ số ít.',
    'Một số danh từ tập hợp hoặc cụm nối bằng and/or cần xét nghĩa và vị trí.'
  ]
};

function q(question, options, correctAnswer, explanation) {
  return {
    question,
    optionA: options[0],
    optionB: options[1],
    optionC: options[2],
    optionD: options[3],
    correctAnswer,
    explanation
  };
}

const extraGrammarQuizzes = {
  'Present Simple': [
    q('My brother ___ football on Sundays.', ['play', 'plays', 'is playing', 'played'], 'B', 'My brother là ngôi 3 số ít nên động từ thêm -s.'),
    q('I ___ coffee after 8 p.m.', ['does not drink', 'do not drink', 'am not drink', 'not drink'], 'B', 'Với I dùng do not + động từ nguyên thể.'),
    q('___ they live near the school?', ['Does', 'Are', 'Do', 'Is'], 'C', 'They dùng trợ động từ do trong câu hỏi hiện tại đơn.'),
    q('The museum ___ at 9 a.m. every day.', ['open', 'opens', 'is opening', 'opened'], 'B', 'Lịch trình cố định dùng hiện tại đơn, museum số ít nên opens.'),
    q('She rarely ___ fast food.', ['eat', 'eats', 'eating', 'ate'], 'B', 'Rarely là trạng từ tần suất; she dùng eats.'),
    q('Cats ___ milk.', ['likes', 'like', 'are liking', 'liked'], 'B', 'Cats là danh từ số nhiều nên động từ giữ nguyên.'),
    q('He ___ have a car.', ['don\'t', 'doesn\'t', 'isn\'t', 'aren\'t'], 'B', 'He dùng doesn\'t + động từ nguyên thể.'),
    q('Where ___ your parents work?', ['do', 'does', 'are', 'is'], 'A', 'Your parents là số nhiều nên dùng do.'),
    q('The sun ___ in the east.', ['rise', 'rises', 'is rising', 'rose'], 'B', 'Sự thật hiển nhiên dùng hiện tại đơn.'),
    q('My teacher ___ three languages.', ['speak', 'speaks', 'speaking', 'is speak'], 'B', 'Teacher số ít nên speak thêm -s.')
  ],
  'Present Continuous': [
    q('Listen! Someone ___ at the door.', ['knocks', 'is knocking', 'knock', 'knocked'], 'B', 'Listen! báo hiệu hành động đang xảy ra.'),
    q('We ___ dinner right now.', ['have', 'are having', 'has', 'had'], 'B', 'Right now dùng hiện tại tiếp diễn.'),
    q('She ___ with her aunt this week.', ['stays', 'is staying', 'stay', 'stayed'], 'B', 'This week ở đây diễn tả tình huống tạm thời.'),
    q('I ___ the answer.', ['am knowing', 'know', 'knowing', 'am know'], 'B', 'Know là stative verb nên thường dùng hiện tại đơn.'),
    q('They ___ a new bridge in the city.', ['build', 'are building', 'builds', 'built'], 'B', 'Hành động đang diễn ra trong giai đoạn hiện tại dùng are building.'),
    q('Look! The dog ___ across the street.', ['runs', 'is running', 'run', 'ran'], 'B', 'Look! dùng với hành động đang xảy ra.'),
    q('What ___ you ___ tonight?', ['do / do', 'are / doing', 'did / do', 'does / do'], 'B', 'Kế hoạch gần có thể dùng hiện tại tiếp diễn.'),
    q('Online prices ___ quickly.', ['change', 'are changing', 'changes', 'changed'], 'B', 'Xu hướng đang thay đổi dùng hiện tại tiếp diễn.'),
    q('He ___ a blue shirt today.', ['wears', 'is wearing', 'wear', 'wore'], 'B', 'Today diễn tả trạng thái tạm thời trong hiện tại.'),
    q('Be quiet! The students ___ a test.', ['take', 'are taking', 'takes', 'took'], 'B', 'Be quiet! cho thấy hành động đang diễn ra.')
  ],
  'Present Perfect': [
    q('I ___ this movie before.', ['see', 'saw', 'have seen', 'am seeing'], 'C', 'Before nói về trải nghiệm đến hiện tại, dùng have seen.'),
    q('She ___ her homework yet.', ['hasn\'t finished', 'didn\'t finish', 'isn\'t finishing', 'doesn\'t finish'], 'A', 'Yet thường dùng trong phủ định/nghi vấn hiện tại hoàn thành.'),
    q('They ___ here since 2020.', ['live', 'lived', 'have lived', 'are living'], 'C', 'Since + mốc thời gian dùng hiện tại hoàn thành.'),
    q('We have studied English ___ five years.', ['since', 'for', 'already', 'yet'], 'B', 'For đi với khoảng thời gian.'),
    q('Have you ___ eaten sushi?', ['never', 'ever', 'yet', 'already'], 'B', 'Ever dùng trong câu hỏi về trải nghiệm.'),
    q('He has ___ left the office.', ['yet', 'ever', 'just', 'since'], 'C', 'Just diễn tả hành động vừa mới xảy ra.'),
    q('My phone ___ working.', ['stopped', 'has stopped', 'stops', 'is stopping'], 'B', 'Kết quả hiện tại là điện thoại không hoạt động, dùng has stopped.'),
    q('She has never ___ to Japan.', ['be', 'was', 'been', 'being'], 'C', 'Present perfect dùng have/has + V3.'),
    q('How long ___ you known him?', ['do', 'did', 'have', 'are'], 'C', 'How long với sự việc còn liên quan hiện tại dùng have known.'),
    q('The train ___ already arrived.', ['is', 'has', 'was', 'does'], 'B', 'Already thường đi với has/have + V3.')
  ],
  'Past Simple': [
    q('We ___ to Da Nang last summer.', ['go', 'goes', 'went', 'gone'], 'C', 'Last summer là thời điểm quá khứ đã kết thúc.'),
    q('She ___ breakfast this morning.', ['doesn\'t eat', 'didn\'t eat', 'isn\'t eating', 'hasn\'t eat'], 'B', 'Phủ định quá khứ dùng didn\'t + V nguyên thể.'),
    q('___ you watch the game yesterday?', ['Do', 'Did', 'Are', 'Have'], 'B', 'Yesterday dùng quá khứ đơn; câu hỏi dùng did.'),
    q('They ___ at home last night.', ['was', 'were', 'are', 'be'], 'B', 'They đi với were trong quá khứ.'),
    q('He ___ the window two minutes ago.', ['opens', 'opened', 'is opening', 'has opened'], 'B', 'Ago là dấu hiệu quá khứ đơn.'),
    q('I ___ my keys yesterday.', ['lose', 'lost', 'loses', 'am losing'], 'B', 'Lose là động từ bất quy tắc: lost.'),
    q('Did she ___ the email?', ['sent', 'sends', 'send', 'sending'], 'C', 'Sau did, động từ chính về nguyên thể.'),
    q('The meeting ___ at 10 a.m.', ['begin', 'began', 'begun', 'begins'], 'B', 'Begin ở quá khứ đơn là began.'),
    q('We ___ tired after the trip.', ['was', 'were', 'are', 'be'], 'B', 'We dùng were.'),
    q('My father ___ a new bike when he was young.', ['buys', 'bought', 'buy', 'buying'], 'B', 'When he was young là bối cảnh quá khứ.')
  ],
  'Future Simple': [
    q('I think it ___ rain tomorrow.', ['is', 'will', 'does', 'was'], 'B', 'Dự đoán thường dùng will.'),
    q('She ___ call you later.', ['will', 'is', 'does', 'has'], 'A', 'Will + động từ nguyên thể.'),
    q('Look at those clouds. It ___ rain.', ['will', 'is going to', 'does', 'was'], 'B', 'Dự đoán dựa vào dấu hiệu hiện tại dùng be going to.'),
    q('I promise I ___ be late.', ['won\'t', 'don\'t', 'am not', 'didn\'t'], 'A', 'Lời hứa dùng will/won\'t.'),
    q('We ___ visit our grandparents this weekend.', ['are going to', 'will to', 'going', 'do'], 'A', 'Kế hoạch đã có trước dùng be going to.'),
    q('Will you ___ me with this box?', ['helping', 'helps', 'help', 'helped'], 'C', 'Sau will dùng động từ nguyên thể.'),
    q('The phone is ringing. I ___ answer it.', ['am going to', 'will', 'am', 'did'], 'B', 'Quyết định ngay lúc nói dùng will.'),
    q('They ___ not finish on time.', ['will', 'are', 'do', 'have'], 'A', 'Phủ định tương lai đơn: will not + V.'),
    q('___ she join us for dinner?', ['Does', 'Is', 'Will', 'Did'], 'C', 'Câu hỏi tương lai đơn dùng will đứng đầu.'),
    q('He is saving money because he ___ buy a laptop.', ['will', 'is going to', 'does', 'has'], 'B', 'Dự định có trước dùng be going to.')
  ],
  'Zero & First Conditional': [
    q('If you heat ice, it ___.', ['melts', 'will melt', 'melted', 'is melting'], 'A', 'Sự thật chung dùng điều kiện loại 0.'),
    q('If it rains tomorrow, we ___ at home.', ['stay', 'stayed', 'will stay', 'stays'], 'C', 'Điều kiện loại 1: if + hiện tại đơn, will + V.'),
    q('If water reaches 100°C, it ___.', ['boil', 'boils', 'will boil', 'boiled'], 'B', 'Quy luật tự nhiên dùng loại 0.'),
    q('If she ___ hard, she will pass.', ['studies', 'will study', 'studied', 'study'], 'A', 'Mệnh đề if loại 1 dùng hiện tại đơn.'),
    q('You get tired if you ___ enough.', ['don\'t sleep', 'won\'t sleep', 'didn\'t sleep', 'aren\'t sleep'], 'A', 'Loại 0 diễn tả kết quả thường đúng.'),
    q('If I see Tom, I ___ him your message.', ['give', 'gave', 'will give', 'gives'], 'C', 'Kết quả tương lai dùng will.'),
    q('Plants die if they ___ water.', ['don\'t get', 'won\'t get', 'didn\'t get', 'aren\'t get'], 'A', 'Sự thật chung dùng hiện tại đơn ở cả hai mệnh đề.'),
    q('If you are free tonight, ___ you call me?', ['do', 'did', 'will', 'are'], 'C', 'Câu hỏi kết quả trong loại 1 dùng will.'),
    q('If he misses the bus, he ___ late.', ['is', 'was', 'will be', 'be'], 'C', 'Khả năng thật ở tương lai dùng first conditional.'),
    q('If people eat too much sugar, they often ___ weight.', ['gain', 'will gain', 'gained', 'gains'], 'A', 'Thói quen/kết quả chung dùng loại 0.')
  ],
  'Second Conditional': [
    q('If I ___ rich, I would travel the world.', ['am', 'were', 'will be', 'be'], 'B', 'Giả định hiện tại dùng were.'),
    q('She would buy a house if she ___ enough money.', ['has', 'had', 'will have', 'have'], 'B', 'If + past simple trong điều kiện loại 2.'),
    q('If he studied harder, he ___ better results.', ['gets', 'got', 'would get', 'will get'], 'C', 'Mệnh đề chính dùng would + V.'),
    q('What would you do if you ___ a wallet?', ['find', 'found', 'will find', 'are finding'], 'B', 'Tình huống giả định dùng past simple.'),
    q('If I were you, I ___ apologize.', ['will', 'would', 'do', 'am'], 'B', 'If I were you là cấu trúc lời khuyên giả định.'),
    q('They ___ happier if they had more free time.', ['are', 'will be', 'would be', 'were'], 'C', 'Kết quả giả định dùng would be.'),
    q('If she didn\'t live far away, we ___ her more often.', ['visit', 'visited', 'would visit', 'will visit'], 'C', 'Điều kiện không thật ở hiện tại dùng would + V.'),
    q('If I ___ speak French, I would work in Paris.', ['can', 'could', 'will', 'am able'], 'B', 'Could dùng như dạng quá khứ giả định của can.'),
    q('He would exercise more if he ___ busy.', ['isn\'t', 'wasn\'t', 'weren\'t', 'won\'t be'], 'C', 'Văn phong chuẩn thường dùng weren\'t cho giả định.'),
    q('If we had a car, we ___ to the beach.', ['drive', 'drove', 'would drive', 'will drive'], 'C', 'Kết quả giả định dùng would drive.')
  ],
  'Third Conditional': [
    q('If I had known, I ___ you.', ['would call', 'will call', 'would have called', 'called'], 'C', 'Điều kiện loại 3 dùng would have + V3.'),
    q('She would have passed if she ___ more.', ['studied', 'had studied', 'studies', 'would study'], 'B', 'Mệnh đề if loại 3 dùng had + V3.'),
    q('If they had left earlier, they ___ the train.', ['catch', 'caught', 'would catch', 'would have caught'], 'D', 'Kết quả giả định trong quá khứ dùng would have caught.'),
    q('We ___ late if the taxi had arrived on time.', ['weren\'t', 'wouldn\'t be', 'wouldn\'t have been', 'aren\'t'], 'C', 'Kết quả ngược quá khứ dùng wouldn\'t have been.'),
    q('If he ___ the map, he wouldn\'t have got lost.', ['checked', 'had checked', 'checks', 'would check'], 'B', 'Điều kiện không xảy ra trong quá khứ dùng had checked.'),
    q('I would have helped you if you ___ me.', ['ask', 'asked', 'had asked', 'would ask'], 'C', 'If + past perfect.'),
    q('If it hadn\'t rained, we ___ outside.', ['played', 'will play', 'would play', 'would have played'], 'D', 'Kết quả giả định quá khứ dùng would have played.'),
    q('She ___ the job if she had prepared better.', ['gets', 'got', 'would get', 'would have got'], 'D', 'Would have + V3 cho kết quả quá khứ.'),
    q('If I had seen the email, I ___ earlier.', ['reply', 'replied', 'would have replied', 'will reply'], 'C', 'Email không được thấy trong quá khứ, kết quả giả định dùng would have replied.'),
    q('They would not have missed the flight if they ___ on time.', ['arrive', 'arrived', 'had arrived', 'would arrive'], 'C', 'Mệnh đề if loại 3 dùng had arrived.')
  ],
  'Passive Voice': [
    q('The room ___ every day.', ['cleans', 'is cleaned', 'cleaned', 'is cleaning'], 'B', 'Bị động hiện tại đơn: am/is/are + V3.'),
    q('The cake ___ by my mother yesterday.', ['made', 'was made', 'is made', 'makes'], 'B', 'Bị động quá khứ đơn: was/were + V3.'),
    q('English ___ in many countries.', ['speaks', 'is spoken', 'spoke', 'is speaking'], 'B', 'English là đối tượng được nói, dùng bị động.'),
    q('The windows ___ right now.', ['are cleaning', 'clean', 'are being cleaned', 'were cleaned'], 'C', 'Bị động hiện tại tiếp diễn: am/is/are being + V3.'),
    q('This report ___ by Friday.', ['will finish', 'will be finished', 'finished', 'is finishing'], 'B', 'Bị động tương lai: will be + V3.'),
    q('The letters ___ already ___.', ['have / sent', 'have been / sent', 'are / send', 'were / send'], 'B', 'Bị động hiện tại hoàn thành: have/has been + V3.'),
    q('A new school ___ next year.', ['builds', 'will build', 'will be built', 'built'], 'C', 'School được xây, dùng bị động tương lai.'),
    q('The car ___ repaired now.', ['is being', 'has', 'was', 'will'], 'A', 'Now + bị động tiếp diễn: is being repaired.'),
    q('The problem can ___ solved easily.', ['be', 'is', 'being', 'been'], 'A', 'Sau modal trong bị động dùng be + V3.'),
    q('Romeo and Juliet ___ by Shakespeare.', ['wrote', 'was written', 'is writing', 'were written'], 'B', 'Tên tác phẩm số ít, dùng was written.')
  ],
  'Reported Speech': [
    q('He said, "I am tired." -> He said that he ___ tired.', ['is', 'was', 'were', 'be'], 'B', 'Am lùi thì thành was.'),
    q('She said, "I like tea." -> She said that she ___ tea.', ['likes', 'liked', 'has liked', 'will like'], 'B', 'Present simple lùi thành past simple.'),
    q('"I will call you," Tom said. -> Tom said he ___ call me.', ['will', 'would', 'can', 'did'], 'B', 'Will lùi thành would.'),
    q('He asked me, "Where do you live?" -> He asked me where I ___.', ['do live', 'did live', 'lived', 'am living'], 'C', 'Câu hỏi gián tiếp dùng trật tự câu kể.'),
    q('She asked, "Are you ready?" -> She asked if I ___ ready.', ['am', 'was', 'were', 'be'], 'B', 'Yes/no question dùng if/whether và lùi thì.'),
    q('He said, "I have finished." -> He said he ___ finished.', ['has', 'had', 'was', 'would'], 'B', 'Present perfect lùi thành past perfect.'),
    q('"Don\'t be late," she said. -> She told me ___ late.', ['don\'t be', 'not be', 'not to be', 'to not'], 'C', 'Mệnh lệnh phủ định: told + object + not to V.'),
    q('"Please sit down," he said. -> He asked me ___ down.', ['sit', 'to sit', 'sat', 'sitting'], 'B', 'Lời yêu cầu: asked + object + to V.'),
    q('Today usually changes to ___ in reported speech.', ['that day', 'this day', 'the next day', 'yesterday'], 'A', 'Today đổi thành that day khi tường thuật.'),
    q('Here usually changes to ___ in reported speech.', ['there', 'then', 'that', 'this'], 'A', 'Here thường đổi thành there.')
  ],
  'Modal Verbs': [
    q('You ___ wear a helmet on a motorbike.', ['can', 'must', 'might', 'would'], 'B', 'Must diễn tả bắt buộc mạnh.'),
    q('She ___ speak three languages.', ['can', 'must', 'should', 'may'], 'A', 'Can diễn tả khả năng.'),
    q('You ___ see a doctor if you feel worse.', ['can', 'should', 'mustn\'t', 'may'], 'B', 'Should dùng cho lời khuyên.'),
    q('He ___ be at home. The lights are off.', ['must', 'can', 'might', 'should'], 'C', 'Might diễn tả khả năng không chắc chắn.'),
    q('Students ___ use phones during the exam.', ['mustn\'t', 'don\'t have to', 'may', 'could'], 'A', 'Mustn\'t là cấm.'),
    q('You ___ finish it today; tomorrow is fine.', ['must', 'mustn\'t', 'don\'t have to', 'can\'t'], 'C', 'Don\'t have to nghĩa là không cần thiết.'),
    q('Could you ___ the window?', ['open', 'to open', 'opening', 'opened'], 'A', 'Sau modal dùng động từ nguyên thể không to.'),
    q('It ___ rain later, so take an umbrella.', ['should', 'might', 'must', 'can\'t'], 'B', 'Might dùng cho khả năng.'),
    q('You ___ smoke in this room.', ['can', 'should', 'mustn\'t', 'may'], 'C', 'Mustn\'t diễn tả điều bị cấm.'),
    q('We ___ be quiet in the library.', ['should', 'might', 'can', 'would'], 'A', 'Should phù hợp với lời khuyên/quy tắc lịch sự.')
  ],
  'Comparatives & Superlatives': [
    q('This book is ___ than that one.', ['interesting', 'more interesting', 'most interesting', 'interestinger'], 'B', 'Tính từ dài dùng more + adjective.'),
    q('She is the ___ student in class.', ['good', 'better', 'best', 'well'], 'C', 'So sánh nhất bất quy tắc: good -> best.'),
    q('My bag is ___ than yours.', ['heavy', 'heavier', 'heaviest', 'more heavy'], 'B', 'Heavy đổi y thành i rồi thêm -er.'),
    q('This is the ___ movie I have ever seen.', ['bad', 'worse', 'worst', 'more bad'], 'C', 'Bad -> worse -> worst.'),
    q('He runs ___ than his brother.', ['fast', 'faster', 'fastest', 'more fast'], 'B', 'Tính từ/trạng từ ngắn fast thêm -er.'),
    q('The Nile is one of the ___ rivers in the world.', ['long', 'longer', 'longest', 'more long'], 'C', 'One of the + superlative + danh từ số nhiều.'),
    q('Today is ___ than yesterday.', ['hot', 'hotter', 'hottest', 'more hot'], 'B', 'Hot nhân đôi t rồi thêm -er.'),
    q('This exercise is ___ difficult than the last one.', ['most', 'more', 'much', 'very'], 'B', 'So sánh hơn với tính từ dài dùng more.'),
    q('Mount Everest is the ___ mountain in the world.', ['high', 'higher', 'highest', 'more high'], 'C', 'So sánh nhất dùng the highest.'),
    q('Her answer is ___ than mine.', ['clear', 'clearer', 'clearest', 'most clear'], 'B', 'Clear có thể dùng clearer trong so sánh hơn.')
  ],
  'Relative Clauses': [
    q('The man ___ lives next door is a doctor.', ['which', 'who', 'where', 'when'], 'B', 'Who dùng cho người.'),
    q('This is the book ___ I bought yesterday.', ['who', 'where', 'which', 'when'], 'C', 'Which dùng cho vật.'),
    q('The girl ___ bag was stolen is crying.', ['who', 'which', 'whose', 'where'], 'C', 'Whose chỉ sở hữu.'),
    q('The cafe ___ we met is closed now.', ['where', 'who', 'which', 'whose'], 'A', 'Where dùng cho nơi chốn.'),
    q('I remember the day ___ we first met.', ['where', 'when', 'who', 'which'], 'B', 'When dùng cho thời gian.'),
    q('The teacher ___ teaches math is very kind.', ['which', 'who', 'where', 'when'], 'B', 'Đại từ quan hệ là chủ ngữ chỉ người nên dùng who.'),
    q('The laptop ___ is on the desk is mine.', ['who', 'which', 'where', 'whose'], 'B', 'Which làm chủ ngữ chỉ vật.'),
    q('That is the house ___ my grandparents live.', ['who', 'which', 'where', 'whose'], 'C', 'Where thay cho in which chỉ nơi ở.'),
    q('The boy ___ you met yesterday is my cousin.', ['who', 'which', 'where', 'when'], 'A', 'Who dùng cho người làm tân ngữ.'),
    q('The movie ___ we watched was exciting.', ['who', 'which', 'where', 'whose'], 'B', 'Which dùng cho vật/sự việc.')
  ],
  'Articles (A / An / The)': [
    q('I saw ___ elephant at the zoo.', ['a', 'an', 'the', 'no article'], 'B', 'Elephant bắt đầu bằng âm nguyên âm nên dùng an.'),
    q('She bought ___ new phone yesterday.', ['a', 'an', 'the', 'no article'], 'A', 'Nhắc lần đầu một chiếc điện thoại chưa xác định dùng a.'),
    q('___ sun rises in the east.', ['A', 'An', 'The', 'No article'], 'C', 'Sun là đối tượng duy nhất trong ngữ cảnh.'),
    q('I like ___ music.', ['a', 'an', 'the', 'no article'], 'D', 'Nói chung về music không dùng mạo từ.'),
    q('He is ___ honest man.', ['a', 'an', 'the', 'no article'], 'B', 'Honest bắt đầu bằng âm /o/ nên dùng an.'),
    q('Can you close ___ door?', ['a', 'an', 'the', 'no article'], 'C', 'Door đã xác định trong ngữ cảnh.'),
    q('She wants to be ___ engineer.', ['a', 'an', 'the', 'no article'], 'B', 'Engineer bắt đầu bằng âm nguyên âm nên dùng an.'),
    q('___ apples are good for your health.', ['A', 'An', 'The', 'No article'], 'D', 'Nói chung về danh từ số nhiều dùng no article.'),
    q('This is ___ best day of my life.', ['a', 'an', 'the', 'no article'], 'C', 'So sánh nhất dùng the.'),
    q('We stayed at ___ hotel near the airport.', ['a', 'an', 'the', 'no article'], 'A', 'Hotel được nhắc lần đầu, dùng a.')
  ],
  'Prepositions of Time & Place': [
    q('The meeting starts ___ 9 a.m.', ['in', 'on', 'at', 'by'], 'C', 'At dùng với giờ cụ thể.'),
    q('My birthday is ___ June.', ['in', 'on', 'at', 'to'], 'A', 'In dùng với tháng.'),
    q('We have class ___ Monday.', ['in', 'on', 'at', 'by'], 'B', 'On dùng với ngày trong tuần.'),
    q('She lives ___ the third floor.', ['in', 'on', 'at', 'to'], 'B', 'On dùng cho tầng.'),
    q('There is a picture ___ the wall.', ['in', 'on', 'at', 'under'], 'B', 'On dùng trên bề mặt.'),
    q('The children are ___ the park.', ['in', 'on', 'at', 'by'], 'A', 'In dùng trong khu vực/không gian.'),
    q('I usually study ___ night.', ['in', 'on', 'at', 'by'], 'C', 'Cụm cố định: at night.'),
    q('The keys are ___ the table.', ['in', 'on', 'at', 'to'], 'B', 'On dùng khi vật nằm trên bề mặt.'),
    q('We arrived ___ the airport early.', ['in', 'on', 'at', 'to'], 'C', 'At dùng cho địa điểm cụ thể như airport.'),
    q('She was born ___ 2001.', ['in', 'on', 'at', 'by'], 'A', 'In dùng với năm.'),
    q('The bus leaves ___ noon.', ['in', 'on', 'at', 'to'], 'C', 'At dùng với thời điểm cụ thể như noon.'),
    q('There is a small cafe ___ the corner.', ['in', 'on', 'at', 'by'], 'C', 'At the corner nhấn mạnh điểm/vị trí cụ thể.')
  ],
  'Gerunds & Infinitives': [
    q('I enjoy ___ books.', ['read', 'to read', 'reading', 'reads'], 'C', 'Enjoy theo sau bởi V-ing.'),
    q('She decided ___ abroad.', ['study', 'to study', 'studying', 'studied'], 'B', 'Decide theo sau bởi to + V.'),
    q('He is interested in ___ English.', ['learn', 'to learn', 'learning', 'learned'], 'C', 'Sau giới từ in dùng V-ing.'),
    q('They want ___ a new car.', ['buy', 'to buy', 'buying', 'bought'], 'B', 'Want theo sau bởi to + V.'),
    q('I avoid ___ late at night.', ['drive', 'to drive', 'driving', 'drove'], 'C', 'Avoid theo sau bởi V-ing.'),
    q('We hope ___ you soon.', ['see', 'to see', 'seeing', 'saw'], 'B', 'Hope theo sau bởi to + V.'),
    q('She suggested ___ a break.', ['take', 'to take', 'taking', 'took'], 'C', 'Suggest theo sau bởi V-ing.'),
    q('I need ___ this report today.', ['finish', 'to finish', 'finishing', 'finished'], 'B', 'Need theo sau bởi to + V khi chủ ngữ là người cần làm việc.'),
    q('He stopped ___ because he was tired.', ['work', 'to work', 'working', 'worked'], 'C', 'Stop + V-ing nghĩa là dừng hành động đang làm.'),
    q('She went to the shop ___ some milk.', ['buy', 'to buy', 'buying', 'bought'], 'B', 'To + V diễn tả mục đích.')
  ],
  'Question Tags': [
    q('You are a student, ___?', ['are you', 'aren\'t you', 'do you', 'don\'t you'], 'B', 'Mệnh đề chính khẳng định với are, đuôi phủ định là aren\'t you.'),
    q('She doesn\'t like coffee, ___?', ['does she', 'doesn\'t she', 'is she', 'isn\'t she'], 'A', 'Mệnh đề phủ định thì đuôi khẳng định.'),
    q('He can swim, ___?', ['can he', 'can\'t he', 'does he', 'doesn\'t he'], 'B', 'Dùng lại modal can ở đuôi.'),
    q('They went home, ___?', ['did they', 'didn\'t they', 'do they', 'don\'t they'], 'B', 'Past simple khẳng định dùng didn\'t ở đuôi.'),
    q('I am late, ___?', ['am I', 'aren\'t I', 'don\'t I', 'isn\'t I'], 'B', 'Trường hợp đặc biệt: I am -> aren\'t I.'),
    q('Let\'s go, ___?', ['will we', 'shall we', 'do we', 'are we'], 'B', 'Let\'s dùng tag shall we.'),
    q('Don\'t be noisy, ___?', ['do you', 'will you', 'are you', 'don\'t you'], 'B', 'Câu mệnh lệnh thường dùng will you.'),
    q('There is a bank near here, ___?', ['is there', 'isn\'t there', 'does there', 'doesn\'t there'], 'B', 'There is dùng tag isn\'t there.'),
    q('Nobody called, ___?', ['did they', 'didn\'t they', 'do they', 'does he'], 'A', 'Nobody mang nghĩa phủ định nên tag khẳng định.'),
    q('She has finished, ___?', ['has she', 'hasn\'t she', 'does she', 'did she'], 'B', 'Present perfect dùng has/have trong question tag.'),
    q('Open the door, ___?', ['do you', 'will you', 'are you', 'can you'], 'B', 'Câu mệnh lệnh thường dùng will you ở question tag.'),
    q('This is your pen, ___?', ['is this', 'isn\'t it', 'does it', 'isn\'t this'], 'B', 'This is thường dùng tag isn\'t it.')
  ],
  'Subject-Verb Agreement': [
    q('Each student ___ a book.', ['have', 'has', 'are having', 'were'], 'B', 'Each đi với động từ số ít.'),
    q('The list of items ___ on the desk.', ['are', 'is', 'were', 'be'], 'B', 'Chủ ngữ thật là list, số ít.'),
    q('My friends and I ___ ready.', ['am', 'is', 'are', 'be'], 'C', 'Chủ ngữ ghép với and thường là số nhiều.'),
    q('Neither answer ___ correct.', ['are', 'is', 'were', 'be'], 'B', 'Neither thường đi với động từ số ít.'),
    q('The news ___ surprising.', ['are', 'is', 'were', 'be'], 'B', 'News là danh từ số ít về mặt ngữ pháp.'),
    q('There ___ two chairs in the room.', ['is', 'are', 'was', 'be'], 'B', 'Động từ hòa hợp với two chairs.'),
    q('A number of students ___ absent.', ['is', 'are', 'was', 'be'], 'B', 'A number of + danh từ số nhiều dùng động từ số nhiều.'),
    q('The number of students ___ increasing.', ['are', 'is', 'were', 'be'], 'B', 'The number of là chủ ngữ số ít.'),
    q('Either Tom or his brothers ___ coming.', ['is', 'are', 'was', 'be'], 'B', 'Với either...or, động từ thường hòa hợp với chủ ngữ gần nhất.'),
    q('Everyone ___ to join the club.', ['want', 'wants', 'are wanting', 'were wanting'], 'B', 'Everyone là đại từ bất định số ít.')
  ]
};

function getGrammarEnhancement(title) {
  return {
    tips: topicTips[title] || [],
    quizzes: extraGrammarQuizzes[title] || []
  };
}

function enhanceGrammarContent(title, content) {
  if (!content || content.includes(DETAIL_MARKER)) return content;
  const tips = getGrammarEnhancement(title).tips;
  if (tips.length === 0) return content;

  const tipItems = tips.map((tip) => `<li>${tip}</li>`).join('');
  return `${content}
<section ${DETAIL_MARKER}>
<h3>Ôn nhanh trước khi làm bài</h3>
<ul>${tipItems}</ul>
<p><b>Cách tự kiểm tra:</b> đọc lại ví dụ, xác định dạng câu, dấu hiệu thời gian/ngữ cảnh, sau đó mới chọn đáp án. Nếu nhầm một điểm, quay lại đúng dòng lý thuyết liên quan để sửa ngay.</p>
</section>`;
}

async function insertExtraGrammarQuizzes(pool, insertQuiz) {
  const topicResult = await pool.request().query('SELECT Id, Title FROM GrammarTopics');

  for (const topic of topicResult.recordset) {
    const enhancement = getGrammarEnhancement(topic.Title);
    if (enhancement.quizzes.length === 0) continue;

    const quizResult = await pool.request()
      .input('topicId', topic.Id)
      .query('SELECT Question FROM GrammarQuiz WHERE TopicId = @topicId');
    const existingQuestions = new Set(quizResult.recordset.map((row) => String(row.Question || '').trim()));
    let total = existingQuestions.size;

    for (const quiz of enhancement.quizzes) {
      if (total >= 15) break;
      if (existingQuestions.has(quiz.question)) continue;

      await insertQuiz(
        topic.Id,
        quiz.question,
        quiz.optionA,
        quiz.optionB,
        quiz.optionC,
        quiz.optionD,
        quiz.correctAnswer,
        quiz.explanation
      );
      existingQuestions.add(quiz.question);
      total += 1;
    }
  }
}

module.exports = {
  DETAIL_MARKER,
  enhanceGrammarContent,
  insertExtraGrammarQuizzes,
  getGrammarEnhancement
};

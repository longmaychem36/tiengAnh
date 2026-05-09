const { connectDB, getPool, sql } = require('../src/config/database');

const topics = [
  { Title: 'Chào hỏi cơ bản', Desc: 'Các mẫu câu chào hỏi hàng ngày', Order: 1 },
  { Title: 'Giới thiệu bản thân', Desc: 'Nói về bản thân và gia đình', Order: 2 },
  { Title: 'Tại nhà hàng', Desc: 'Giao tiếp khi đi ăn uống', Order: 3 },
  { Title: 'Hỏi đường', Desc: 'Hỏi và chỉ đường đi', Order: 4 },
  { Title: 'Mua sắm', Desc: 'Giao tiếp khi đi mua hàng', Order: 5 },
  { Title: 'Sở thích cá nhân', Desc: 'Nói về những gì bạn thích làm', Order: 6 },
  { Title: 'Tại bệnh viện', Desc: 'Miêu tả triệu chứng và khám bệnh', Order: 7 },
  { Title: 'Đi du lịch', Desc: 'Giao tiếp khi đi du lịch', Order: 8 },
  { Title: 'Công việc', Desc: 'Nói về nghề nghiệp và công việc', Order: 9 },
  { Title: 'Thời tiết', Desc: 'Nói về thời tiết và mùa', Order: 10 },
];

const allQuestions = [
  // 1. Chào hỏi cơ bản
  [
    { q:'How are you doing today?', t:'Hôm nay bạn thế nào?', o1:'I am doing well, thank you.', v1:'Tôi khỏe, cảm ơn bạn.', o2:'Not too bad, how about you?', v2:'Không tệ lắm, còn bạn?', o3:'I feel great today!', v3:'Hôm nay tôi cảm thấy tuyệt!' },
    { q:'What is your name?', t:'Tên của bạn là gì?', o1:'My name is John.', v1:'Tên tôi là John.', o2:'I am Sarah.', v2:'Tôi là Sarah.', o3:'You can call me Mike.', v3:'Bạn có thể gọi tôi là Mike.' },
    { q:'Where are you from?', t:'Bạn đến từ đâu?', o1:'I am from Vietnam.', v1:'Tôi đến từ Việt Nam.', o2:'I come from the United States.', v2:'Tôi đến từ Mỹ.', o3:'I was born in London.', v3:'Tôi sinh ra ở London.' },
    { q:'Nice to meet you!', t:'Rất vui được gặp bạn!', o1:'Nice to meet you too.', v1:'Tôi cũng rất vui được gặp bạn.', o2:'Likewise.', v2:'Tôi cũng vậy.', o3:'It is a pleasure meeting you.', v3:'Rất hân hạnh được gặp bạn.' },
    { q:'How old are you?', t:'Bạn bao nhiêu tuổi?', o1:'I am twenty years old.', v1:'Tôi hai mươi tuổi.', o2:'I just turned eighteen.', v2:'Tôi vừa mới mười tám tuổi.', o3:'I am in my mid-twenties.', v3:'Tôi khoảng giữa tuổi hai mươi.' },
    { q:'See you later!', t:'Hẹn gặp lại nhé!', o1:'See you soon!', v1:'Hẹn gặp lại sớm!', o2:'Take care!', v2:'Bảo trọng nhé!', o3:'Goodbye, have a nice day!', v3:'Tạm biệt, chúc một ngày tốt lành!' },
  ],
  // 2. Giới thiệu bản thân
  [
    { q:'Tell me about yourself.', t:'Hãy kể về bạn.', o1:'I am a student from Vietnam.', v1:'Tôi là sinh viên đến từ Việt Nam.', o2:'I work as a teacher.', v2:'Tôi làm giáo viên.', o3:'I love traveling and reading.', v3:'Tôi thích đi du lịch và đọc sách.' },
    { q:'What do you do for a living?', t:'Bạn làm nghề gì?', o1:'I am a software engineer.', v1:'Tôi là kỹ sư phần mềm.', o2:'I work in marketing.', v2:'Tôi làm trong lĩnh vực marketing.', o3:'I am still a student.', v3:'Tôi vẫn còn là sinh viên.' },
    { q:'Do you have any brothers or sisters?', t:'Bạn có anh chị em không?', o1:'I have one older brother.', v1:'Tôi có một anh trai.', o2:'I have two younger sisters.', v2:'Tôi có hai em gái.', o3:'No, I am an only child.', v3:'Không, tôi là con một.' },
    { q:'Where do you live?', t:'Bạn sống ở đâu?', o1:'I live in Ho Chi Minh City.', v1:'Tôi sống ở Thành phố Hồ Chí Minh.', o2:'I live in a small town.', v2:'Tôi sống ở một thị trấn nhỏ.', o3:'I recently moved to Hanoi.', v3:'Tôi mới chuyển đến Hà Nội.' },
    { q:'What are your hobbies?', t:'Sở thích của bạn là gì?', o1:'I enjoy cooking and swimming.', v1:'Tôi thích nấu ăn và bơi lội.', o2:'I like playing video games.', v2:'Tôi thích chơi game.', o3:'I love listening to music.', v3:'Tôi thích nghe nhạc.' },
  ],
  // 3. Tại nhà hàng
  [
    { q:'Are you ready to order?', t:'Bạn đã sẵn sàng gọi món chưa?', o1:'Yes, I will have the steak.', v1:'Vâng, tôi sẽ dùng bò bít tết.', o2:'Not yet, I need a few more minutes.', v2:'Chưa, cho tôi thêm vài phút.', o3:'Can you recommend something?', v3:'Bạn có thể gợi ý gì không?' },
    { q:'What would you like to drink?', t:'Bạn muốn uống gì?', o1:'Just water, please.', v1:'Cho tôi nước lọc.', o2:'I would like a cup of coffee.', v2:'Tôi muốn một ly cà phê.', o3:'Can I get some orange juice?', v3:'Cho tôi nước cam được không?' },
    { q:'How is your food?', t:'Thức ăn thế nào?', o1:'It is delicious, thank you.', v1:'Rất ngon, cảm ơn.', o2:'It tastes amazing!', v2:'Nó ngon tuyệt vời!', o3:'It is a little too salty.', v3:'Nó hơi mặn một chút.' },
    { q:'Would you like some dessert?', t:'Bạn có muốn tráng miệng không?', o1:'No thank you, I am full.', v1:'Không cảm ơn, tôi no rồi.', o2:'Yes, I will have the cheesecake.', v2:'Vâng, cho tôi bánh phô mai.', o3:'What desserts do you have?', v3:'Có những loại tráng miệng nào?' },
    { q:'Can I get the check, please?', t:'Cho tôi xin hóa đơn.', o1:'Sure, here is your bill.', v1:'Được, đây là hóa đơn của bạn.', o2:'Would you like to pay by card?', v2:'Bạn muốn thanh toán bằng thẻ không?', o3:'Are you paying together or separately?', v3:'Bạn thanh toán chung hay riêng?' },
  ],
  // 4. Hỏi đường
  [
    { q:'Excuse me, how do I get to the train station?', t:'Xin lỗi, làm sao để đến ga tàu?', o1:'Go straight and turn left at the traffic light.', v1:'Đi thẳng rồi rẽ trái ở đèn giao thông.', o2:'It is about ten minutes by walking.', v2:'Đi bộ khoảng mười phút.', o3:'Take the bus number five.', v3:'Đi xe buýt số năm.' },
    { q:'Is there a pharmacy nearby?', t:'Có nhà thuốc nào gần đây không?', o1:'Yes, there is one on the corner.', v1:'Có, có một nhà thuốc ở góc đường.', o2:'The nearest one is two blocks away.', v2:'Nhà thuốc gần nhất cách hai dãy nhà.', o3:'I am not sure, you can ask someone else.', v3:'Tôi không chắc, bạn hỏi người khác nhé.' },
    { q:'How far is the airport from here?', t:'Sân bay cách đây bao xa?', o1:'It is about thirty kilometers.', v1:'Khoảng ba mươi ki-lô-mét.', o2:'You can get there in forty minutes by taxi.', v2:'Bạn có thể đến đó trong bốn mươi phút bằng taxi.', o3:'It takes one hour by bus.', v3:'Đi xe buýt mất một tiếng.' },
    { q:'Can you show me on the map?', t:'Bạn có thể chỉ trên bản đồ không?', o1:'Sure, we are here and you need to go there.', v1:'Được, chúng ta đang ở đây và bạn cần đi đến kia.', o2:'Let me look it up for you.', v2:'Để tôi tìm giúp bạn.', o3:'Sorry, I do not have a map.', v3:'Xin lỗi, tôi không có bản đồ.' },
    { q:'Which bus goes to the city center?', t:'Xe buýt nào đi đến trung tâm thành phố?', o1:'Bus number seven goes there.', v1:'Xe buýt số bảy đi đến đó.', o2:'You should take the subway instead.', v2:'Bạn nên đi tàu điện ngầm.', o3:'Any bus from this stop will take you there.', v3:'Bất kỳ xe buýt nào từ trạm này đều đến đó.' },
  ],
  // 5. Mua sắm
  [
    { q:'Can I help you find something?', t:'Tôi có thể giúp bạn tìm gì không?', o1:'Yes, I am looking for a pair of shoes.', v1:'Vâng, tôi đang tìm một đôi giày.', o2:'No thanks, I am just browsing.', v2:'Không, cảm ơn, tôi chỉ xem thôi.', o3:'Do you have this in a smaller size?', v3:'Bạn có cái này cỡ nhỏ hơn không?' },
    { q:'How much does this cost?', t:'Cái này giá bao nhiêu?', o1:'It is twenty dollars.', v1:'Nó giá hai mươi đô la.', o2:'Let me check the price for you.', v2:'Để tôi kiểm tra giá cho bạn.', o3:'It is on sale for half price.', v3:'Đang giảm giá còn một nửa.' },
    { q:'Do you accept credit cards?', t:'Bạn có nhận thẻ tín dụng không?', o1:'Yes, we accept all major credit cards.', v1:'Vâng, chúng tôi nhận mọi loại thẻ tín dụng.', o2:'Sorry, we only accept cash.', v2:'Xin lỗi, chúng tôi chỉ nhận tiền mặt.', o3:'We also accept mobile payment.', v3:'Chúng tôi cũng nhận thanh toán di động.' },
    { q:'Can I try this on?', t:'Tôi có thể thử cái này không?', o1:'Of course, the fitting room is over there.', v1:'Tất nhiên, phòng thử đồ ở đằng kia.', o2:'Sure, what size do you need?', v2:'Được, bạn cần cỡ bao nhiêu?', o3:'Yes, there is a mirror inside.', v3:'Vâng, bên trong có gương.' },
    { q:'I would like to return this item.', t:'Tôi muốn trả lại món hàng này.', o1:'Do you have the receipt?', v1:'Bạn có hóa đơn không?', o2:'What is the reason for the return?', v2:'Lý do trả hàng là gì?', o3:'We can exchange it for another one.', v3:'Chúng tôi có thể đổi cho bạn cái khác.' },
  ],
  // 6. Sở thích cá nhân
  [
    { q:'What do you like to do in your free time?', t:'Bạn thích làm gì khi rảnh?', o1:'I enjoy reading books.', v1:'Tôi thích đọc sách.', o2:'I love playing soccer.', v2:'Tôi thích chơi bóng đá.', o3:'I usually watch movies.', v3:'Tôi thường xem phim.' },
    { q:'Do you play any sports?', t:'Bạn có chơi thể thao không?', o1:'I play basketball every weekend.', v1:'Tôi chơi bóng rổ mỗi cuối tuần.', o2:'I go jogging every morning.', v2:'Tôi chạy bộ mỗi sáng.', o3:'Not really, but I like watching sports.', v3:'Không hẳn, nhưng tôi thích xem thể thao.' },
    { q:'What kind of music do you like?', t:'Bạn thích thể loại nhạc nào?', o1:'I listen to pop music.', v1:'Tôi nghe nhạc pop.', o2:'I am a big fan of rock.', v2:'Tôi rất thích nhạc rock.', o3:'I prefer classical music.', v3:'Tôi thích nhạc cổ điển hơn.' },
    { q:'Have you seen any good movies lately?', t:'Dạo này bạn xem phim nào hay không?', o1:'Yes, I watched a great action movie.', v1:'Có, tôi xem một phim hành động rất hay.', o2:'Not really, I have been busy.', v2:'Không, dạo này tôi bận lắm.', o3:'I just saw a funny comedy.', v3:'Tôi vừa xem một phim hài rất vui.' },
    { q:'Do you like cooking?', t:'Bạn có thích nấu ăn không?', o1:'Yes, I cook dinner every day.', v1:'Có, tôi nấu bữa tối mỗi ngày.', o2:'I love trying new recipes.', v2:'Tôi thích thử các công thức mới.', o3:'Not really, I prefer eating out.', v3:'Không, tôi thích ăn ngoài hơn.' },
  ],
  // 7. Tại bệnh viện
  [
    { q:'What seems to be the problem?', t:'Vấn đề của bạn là gì?', o1:'I have a terrible headache.', v1:'Tôi bị đau đầu kinh khủng.', o2:'I have been coughing for three days.', v2:'Tôi bị ho ba ngày rồi.', o3:'My stomach hurts a lot.', v3:'Bụng tôi đau lắm.' },
    { q:'How long have you been feeling this way?', t:'Bạn bị như vậy bao lâu rồi?', o1:'Since yesterday morning.', v1:'Từ sáng hôm qua.', o2:'About a week now.', v2:'Khoảng một tuần rồi.', o3:'It just started today.', v3:'Vừa mới bắt đầu hôm nay.' },
    { q:'Are you allergic to any medicine?', t:'Bạn có dị ứng thuốc nào không?', o1:'No, I am not allergic to anything.', v1:'Không, tôi không dị ứng gì.', o2:'Yes, I am allergic to penicillin.', v2:'Có, tôi dị ứng với penicillin.', o3:'I am not sure, let me check.', v3:'Tôi không chắc, để tôi kiểm tra.' },
    { q:'Do you have health insurance?', t:'Bạn có bảo hiểm y tế không?', o1:'Yes, here is my insurance card.', v1:'Có, đây là thẻ bảo hiểm của tôi.', o2:'No, I will pay out of pocket.', v2:'Không, tôi sẽ tự trả tiền.', o3:'I have travel insurance only.', v3:'Tôi chỉ có bảo hiểm du lịch.' },
    { q:'You need to take this medicine twice a day.', t:'Bạn cần uống thuốc này hai lần mỗi ngày.', o1:'Should I take it before or after meals?', v1:'Tôi nên uống trước hay sau bữa ăn?', o2:'How many days should I take it?', v2:'Tôi nên uống trong bao nhiêu ngày?', o3:'Are there any side effects?', v3:'Có tác dụng phụ nào không?' },
  ],
  // 8. Đi du lịch
  [
    { q:'I would like to book a hotel room.', t:'Tôi muốn đặt phòng khách sạn.', o1:'For how many nights?', v1:'Bạn đặt mấy đêm?', o2:'Single or double room?', v2:'Phòng đơn hay phòng đôi?', o3:'When would you like to check in?', v3:'Bạn muốn nhận phòng khi nào?' },
    { q:'What time does the flight depart?', t:'Chuyến bay khởi hành lúc mấy giờ?', o1:'It departs at ten in the morning.', v1:'Nó khởi hành lúc mười giờ sáng.', o2:'Your flight leaves at three PM.', v2:'Chuyến bay của bạn cất cánh lúc ba giờ chiều.', o3:'Please check your boarding pass.', v3:'Vui lòng kiểm tra thẻ lên máy bay.' },
    { q:'Can you recommend a good restaurant?', t:'Bạn gợi ý nhà hàng nào ngon không?', o1:'There is a great seafood place nearby.', v1:'Có một quán hải sản ngon gần đây.', o2:'I recommend the Italian restaurant on Main Street.', v2:'Tôi giới thiệu nhà hàng Ý trên phố chính.', o3:'You should try the local street food.', v3:'Bạn nên thử đồ ăn đường phố địa phương.' },
    { q:'How much is the entrance fee?', t:'Vé vào cửa bao nhiêu?', o1:'It is free for children under twelve.', v1:'Miễn phí cho trẻ dưới mười hai tuổi.', o2:'The ticket costs ten dollars per person.', v2:'Vé mười đô la mỗi người.', o3:'Students get a fifty percent discount.', v3:'Sinh viên được giảm năm mươi phần trăm.' },
    { q:'What is the best time to visit this place?', t:'Thời điểm nào tốt nhất để đến đây?', o1:'Spring is the best season to visit.', v1:'Mùa xuân là mùa đẹp nhất để đến.', o2:'I recommend coming in the morning.', v2:'Tôi khuyên nên đến vào buổi sáng.', o3:'Avoid the rainy season if possible.', v3:'Tránh mùa mưa nếu có thể.' },
  ],
  // 9. Công việc
  [
    { q:'What do you do for work?', t:'Bạn làm công việc gì?', o1:'I work as an accountant.', v1:'Tôi làm kế toán.', o2:'I am a freelance designer.', v2:'Tôi là nhà thiết kế tự do.', o3:'I run my own small business.', v3:'Tôi tự kinh doanh nhỏ.' },
    { q:'How long have you been working there?', t:'Bạn đã làm ở đó bao lâu?', o1:'I have been there for three years.', v1:'Tôi đã làm ở đó ba năm.', o2:'I just started last month.', v2:'Tôi mới bắt đầu tháng trước.', o3:'Almost five years now.', v3:'Gần năm năm rồi.' },
    { q:'Do you enjoy your job?', t:'Bạn có thích công việc không?', o1:'Yes, I love what I do.', v1:'Có, tôi yêu công việc của mình.', o2:'It is challenging but rewarding.', v2:'Nó đầy thử thách nhưng bổ ích.', o3:'Sometimes it can be stressful.', v3:'Đôi khi nó khá căng thẳng.' },
    { q:'What time do you finish work?', t:'Bạn tan làm lúc mấy giờ?', o1:'I usually finish at five PM.', v1:'Tôi thường tan làm lúc năm giờ chiều.', o2:'It depends on the day.', v2:'Tùy vào từng ngày.', o3:'I work from home so my schedule is flexible.', v3:'Tôi làm việc ở nhà nên lịch linh hoạt.' },
    { q:'Are you looking for a new job?', t:'Bạn có đang tìm việc mới không?', o1:'Yes, I want to try something different.', v1:'Có, tôi muốn thử cái gì đó khác.', o2:'No, I am happy where I am.', v2:'Không, tôi hài lòng chỗ hiện tại.', o3:'Maybe in the future.', v3:'Có thể trong tương lai.' },
  ],
  // 10. Thời tiết
  [
    { q:'What is the weather like today?', t:'Hôm nay thời tiết thế nào?', o1:'It is sunny and warm.', v1:'Trời nắng và ấm.', o2:'It is cloudy and a bit cold.', v2:'Trời nhiều mây và hơi lạnh.', o3:'It looks like it is going to rain.', v3:'Trông có vẻ sắp mưa.' },
    { q:'Do you like rainy days?', t:'Bạn có thích ngày mưa không?', o1:'Yes, I find them relaxing.', v1:'Có, tôi thấy chúng thư giãn.', o2:'Not really, I prefer sunny weather.', v2:'Không, tôi thích thời tiết nắng hơn.', o3:'Only when I am staying at home.', v3:'Chỉ khi tôi ở nhà.' },
    { q:'What is your favorite season?', t:'Mùa yêu thích của bạn là gì?', o1:'I love autumn because of the cool weather.', v1:'Tôi thích mùa thu vì thời tiết mát mẻ.', o2:'Summer is my favorite season.', v2:'Mùa hè là mùa tôi thích nhất.', o3:'I enjoy spring the most.', v3:'Tôi thích mùa xuân nhất.' },
    { q:'Is it always this hot here?', t:'Ở đây luôn nóng thế này sao?', o1:'Yes, it is hot all year round.', v1:'Vâng, nóng quanh năm.', o2:'No, it gets cooler in winter.', v2:'Không, mùa đông sẽ mát hơn.', o3:'This is unusually hot for this time of year.', v3:'Thời điểm này năm nay nóng bất thường.' },
    { q:'Should I bring an umbrella?', t:'Tôi có nên mang ô không?', o1:'Yes, it might rain this afternoon.', v1:'Có, chiều nay có thể mưa.', o2:'No, the forecast says it will be clear.', v2:'Không, dự báo nói trời sẽ quang.', o3:'Just in case, you should bring one.', v3:'Phòng khi, bạn nên mang theo.' },
  ],
];

async function seed() {
  try {
    await connectDB();
    const pool = getPool();

    console.log('Clearing old speaking data...');
    await pool.request().query('DELETE FROM SpeakingQuestions');
    await pool.request().query('DELETE FROM SpeakingProgress');
    await pool.request().query('DELETE FROM SpeakingLessons');

    for (let i = 0; i < topics.length; i++) {
      const t = topics[i];
      const res = await pool.request()
        .input('title', sql.NVarChar, t.Title)
        .input('desc', sql.NVarChar, t.Desc)
        .input('order', sql.Int, t.Order)
        .query(`INSERT INTO SpeakingLessons (Title, Description, OrderIndex) OUTPUT INSERTED.Id VALUES (@title, @desc, @order)`);

      const topicId = res.recordset[0].Id;
      const qs = allQuestions[i];

      for (let j = 0; j < qs.length; j++) {
        const q = qs[j];
        await pool.request()
          .input('lid', sql.UniqueIdentifier, topicId)
          .input('question', sql.NVarChar, q.q).input('trans', sql.NVarChar, q.t)
          .input('o1', sql.NVarChar, q.o1).input('v1', sql.NVarChar, q.v1)
          .input('o2', sql.NVarChar, q.o2).input('v2', sql.NVarChar, q.v2)
          .input('o3', sql.NVarChar, q.o3).input('v3', sql.NVarChar, q.v3)
          .input('ord', sql.Int, j + 1)
          .query(`INSERT INTO SpeakingQuestions (LessonId,Question,Translation,Option1,Option1VI,Option2,Option2VI,Option3,Option3VI,OrderIndex) VALUES (@lid,@question,@trans,@o1,@v1,@o2,@v2,@o3,@v3,@ord)`);
      }
      console.log(`  Seeded topic ${i+1}/${topics.length}: ${t.Title} (${qs.length} questions)`);
    }

    console.log('Done! Seeded ' + topics.length + ' topics.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}
seed();

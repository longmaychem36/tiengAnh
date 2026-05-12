// ============================================
// Clear old grammar data and reseed with detailed content
// ============================================
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectDB, getPool, sql } = require('../src/config/database');

async function clearAndReseed() {
  await connectDB();
  const pool = getPool();

  console.log('🗑️  Clearing old grammar data...');
  await pool.request().query('DELETE FROM GrammarQuiz');
  await pool.request().query('DELETE FROM GrammarTopics');
  await pool.request().query('DELETE FROM GrammarCategories');
  console.log('Old data cleared.\n');

  // Helper
  async function insertCategory(name, nameVI, icon, order) {
    const r = await pool.request()
      .input('n', sql.NVarChar, name).input('nv', sql.NVarChar, nameVI)
      .input('i', sql.NVarChar, icon).input('o', sql.Int, order)
      .query('INSERT INTO GrammarCategories (Name,NameVI,Icon,OrderIndex) VALUES (@n,@nv,@i,@o) RETURNING Id');
    return r.recordset[0].Id;
  }
  async function insertTopic(catId, title, titleVI, content, order) {
    const r = await pool.request()
      .input('c', sql.Int, catId).input('t', sql.NVarChar, title).input('tv', sql.NVarChar, titleVI)
      .input('ct', sql.NVarChar, content).input('o', sql.Int, order)
      .query('INSERT INTO GrammarTopics (CategoryId,Title,TitleVI,Content,OrderIndex) VALUES (@c,@t,@tv,@ct,@o) RETURNING Id');
    return r.recordset[0].Id;
  }
  async function insertQuiz(topicId, q, a, b, c, d, ans, explain) {
    await pool.request()
      .input('tid', sql.UniqueIdentifier, topicId)
      .input('q', sql.NVarChar, q).input('a', sql.NVarChar, a).input('b', sql.NVarChar, b)
      .input('c', sql.NVarChar, c).input('d', sql.NVarChar, d)
      .input('ans', sql.NVarChar, ans).input('ex', sql.NVarChar, explain)
      .query('INSERT INTO GrammarQuiz (TopicId,Question,OptionA,OptionB,OptionC,OptionD,CorrectAnswer,Explanation) VALUES (@tid,@q,@a,@b,@c,@d,@ans,@ex)');
  }

  // =============================================================
  // 1. TENSES
  // =============================================================
  const cat1 = await insertCategory('Tenses', 'Các thì trong tiếng Anh', '⏰', 0);
  console.log('⏰ Seeding Tenses...');

  // --- 1.1 Present Simple ---
  const t1 = await insertTopic(cat1, 'Present Simple', 'Thì Hiện Tại Đơn', `
<h3>Định nghĩa</h3>
<p>Thì Hiện tại đơn (Present Simple) diễn tả một <b>sự thật hiển nhiên</b>, <b>thói quen lặp đi lặp lại</b>, hoặc một <b>trạng thái cố định</b> ở hiện tại. Đây là thì cơ bản và quan trọng nhất trong tiếng Anh.</p>

<h3>Cấu trúc chi tiết</h3>

<ul><li><strong>Dạng câu</strong></li><li><strong>Cấu trúc</strong></li><li><strong>Ví dụ</strong></li></ul>
<ul><li><b>Khẳng định</b></li><li>S + V(s/es)</li><li>She <b>works</b> at a bank.</li></ul>
<ul><li><b>Phủ định</b></li><li>S + do/does + not + V(nguyên thể)</li><li>She <b>doesn't work</b> at a bank.</li></ul>
<ul><li><b>Nghi vấn</b></li><li>Do/Does + S + V(nguyên thể)?</li><li><b>Does</b> she <b>work</b> at a bank?</li></ul>
<ul><li><b>WH-question</b></li><li>Wh- + do/does + S + V?</li><li><b>Where does</b> she <b>work</b>?</li></ul>


<h3>📏 Quy tắc thêm -s/-es cho ngôi thứ 3 số ít (he/she/it)</h3>

<ul><li><strong>Quy tắc</strong></li><li><strong>Ví dụ</strong></li></ul>
<ul><li>Hầu hết các động từ: thêm <b>-s</b></li><li>play → play<b>s</b>, read → read<b>s</b></li></ul>
<ul><li>Tận cùng -s, -ss, -sh, -ch, -x, -z, -o: thêm <b>-es</b></li><li>watch → watch<b>es</b>, go → go<b>es</b>, miss → miss<b>es</b></li></ul>
<ul><li>Tận cùng phụ âm + y: đổi y → <b>-ies</b></li><li>study → stud<b>ies</b>, carry → carr<b>ies</b></li></ul>
<ul><li>Tận cùng nguyên âm + y: thêm <b>-s</b></li><li>play → play<b>s</b>, enjoy → enjoy<b>s</b></li></ul>
<ul><li>Trường hợp đặc biệt: <b>have → has</b></li><li>She <b>has</b> a beautiful house.</li></ul>


<h3>Cách dùng chi tiết</h3>
<p><b>1. Thói quen, hành động lặp đi lặp lại:</b></p>
<p>I <b>wake up</b> at 6 AM every morning. <i>(Tôi thức dậy lúc 6 giờ sáng mỗi ngày.)</i></p>
<p>My mother <b>cooks</b> dinner every evening. <i>(Mẹ tôi nấu bữa tối mỗi buổi chiều.)</i></p>
<p>We <b>don't eat</b> meat on Fridays. <i>(Chúng tôi không ăn thịt vào thứ Sáu.)</i></p>

<p><b>2. Sự thật hiển nhiên, chân lý, quy luật tự nhiên:</b></p>
<p>The Earth <b>revolves</b> around the Sun. <i>(Trái Đất quay quanh Mặt Trời.)</i></p>
<p>Water <b>freezes</b> at 0°C. <i>(Nước đóng băng ở 0°C.)</i></p>
<p>Light <b>travels</b> faster than sound. <i>(Ánh sáng truyền nhanh hơn âm thanh.)</i></p>

<p><b>3. Lịch trình, thời gian biểu cố định:</b></p>
<p>The train <b>departs</b> at 7:30 AM. <i>(Tàu khởi hành lúc 7:30 sáng.)</i></p>
<p>The shop <b>opens</b> at 9 and <b>closes</b> at 6. <i>(Cửa hàng mở cửa lúc 9 và đóng cửa lúc 6.)</i></p>

<p><b>4. Trạng thái, cảm xúc, suy nghĩ (stative verbs):</b></p>
<p>She <b>loves</b> chocolate. <i>(Cô ấy yêu thích sô-cô-la.)</i></p>
<p>I <b>believe</b> you are right. <i>(Tôi tin rằng bạn đúng.)</i></p>
<p>He <b>owns</b> three cars. <i>(Anh ấy sở hữu ba chiếc xe.)</i></p>

<h3>Dấu hiệu nhận biết</h3>
<p>
<b>Trạng từ tần suất:</b> always, usually, often, sometimes, rarely, seldom, never, hardly ever<br>
<b>Cụm từ chỉ thời gian:</b> every day/week/month/year, once a week, twice a month, on Mondays, in the morning/afternoon/evening
</p>

<h3>Lỗi sai thường gặp</h3>
<p>
She <b>don't</b> like coffee. → She <b>doesn't</b> like coffee. <i>(Ngôi 3 số ít dùng doesn't)</i><br>
He <b>playes</b> guitar. → He <b>plays</b> guitar. <i>(play tận cùng nguyên âm+y → chỉ thêm s)</i><br>
<b>Does</b> she <b>works</b>? → <b>Does</b> she <b>work</b>? <i>(Sau does, V trở về nguyên thể)</i><br>
I <b>am go</b> to school. → I <b>go</b> to school. <i>(HTĐ không dùng to be + V thường)</i>
</p>

<h3>Mẹo ghi nhớ</h3>
<p>
Quy tắc vàng: Khi câu có <b>does/doesn't</b>, động từ chính LUÔN ở <b>nguyên thể</b> (không thêm -s/-es).<br>
Nhớ: <b>"Does ăn hết chữ S"</b> → Does she work<del>s</del>? → Does she work?
</p>`, 0);

  await insertQuiz(t1, 'She ___ to school every day.', 'goes', 'go', 'going', 'gone', 'A', 'Chủ ngữ "She" là ngôi 3 số ít → động từ thêm -es. "go" → "goes".');
  await insertQuiz(t1, 'Water ___ at 100 degrees Celsius.', 'boil', 'boils', 'boiling', 'is boiling', 'B', '"Water" là ngôi 3 số ít, diễn tả sự thật hiển nhiên → dùng HTĐ, V thêm -s.');
  await insertQuiz(t1, '___ your father ___ coffee in the morning?', 'Do / drinks', 'Does / drink', 'Does / drinks', 'Is / drinking', 'B', 'Ngôi 3 số ít dùng "Does" + V nguyên thể (không thêm s). "Does ăn hết chữ S".');
  await insertQuiz(t1, 'They never ___ late for class.', 'arrives', 'arrive', 'arriving', 'are arrive', 'B', '"They" là ngôi thứ 3 số nhiều → V giữ nguyên, không thêm s.');
  await insertQuiz(t1, 'My sister ___ (study) English every evening.', 'studys', 'studies', 'study', 'studying', 'B', '"study" kết thúc bằng phụ âm + y → bỏ y, thêm -ies: "studies".');

  // --- 1.2 Present Continuous ---
  const t2 = await insertTopic(cat1, 'Present Continuous', 'Thì Hiện Tại Tiếp Diễn', `
<h3>Định nghĩa</h3>
<p>Thì Hiện tại tiếp diễn (Present Continuous / Present Progressive) diễn tả <b>hành động đang xảy ra ngay tại thời điểm nói</b>, hoặc <b>hành động tạm thời</b> xung quanh thời điểm hiện tại, hoặc <b>kế hoạch đã lên lịch</b> trong tương lai gần.</p>

<h3>Cấu trúc chi tiết</h3>

<ul><li><strong>Dạng câu</strong></li><li><strong>Cấu trúc</strong></li><li><strong>Ví dụ</strong></li></ul>
<ul><li><b>Khẳng định</b></li><li>S + am/is/are + V-ing</li><li>I <b>am reading</b> a book.</li></ul>
<ul><li><b>Phủ định</b></li><li>S + am/is/are + not + V-ing</li><li>She <b>isn't watching</b> TV.</li></ul>
<ul><li><b>Nghi vấn</b></li><li>Am/Is/Are + S + V-ing?</li><li><b>Are</b> you <b>listening</b>?</li></ul>


<h3>📏 Quy tắc thêm -ing</h3>

<ul><li><strong>Quy tắc</strong></li><li><strong>Ví dụ</strong></li></ul>
<ul><li>Hầu hết: thêm <b>-ing</b></li><li>read → read<b>ing</b>, play → play<b>ing</b></li></ul>
<ul><li>Tận cùng -e câm: bỏ e, thêm <b>-ing</b></li><li>make → mak<b>ing</b>, write → writ<b>ing</b></li></ul>
<ul><li>Tận cùng 1 nguyên âm + 1 phụ âm (1 âm tiết): nhân đôi phụ âm</li><li>run → ru<b>nn</b>ing, sit → si<b>tt</b>ing, swim → swi<b>mm</b>ing</li></ul>
<ul><li>Tận cùng -ie: đổi ie → y, thêm -ing</li><li>die → d<b>y</b>ing, lie → l<b>y</b>ing</li></ul>
<ul><li>Tận cùng -ee: giữ nguyên, thêm -ing</li><li>see → see<b>ing</b>, agree → agree<b>ing</b></li></ul>


<h3>Cách dùng chi tiết</h3>
<p><b>1. Hành động đang diễn ra ngay lúc nói:</b></p>
<p>Shhh! The baby <b>is sleeping</b>. <i>(Suỵt! Em bé đang ngủ.)</i></p>
<p>Look! It <b>is raining</b> outside. <i>(Nhìn kìa! Trời đang mưa ngoài kia.)</i></p>

<p><b>2. Hành động tạm thời (không phải thói quen):</b></p>
<p>I usually drive to work, but today I <b>am taking</b> the bus. <i>(Tôi thường lái xe đi làm, nhưng hôm nay tôi đang đi xe buýt.)</i></p>
<p>She <b>is staying</b> with her sister this week. <i>(Cô ấy đang ở cùng chị gái tuần này.)</i></p>

<p><b>3. Kế hoạch chắc chắn trong tương lai gần:</b></p>
<p>We <b>are meeting</b> the client at 3 PM tomorrow. <i>(Chúng tôi sẽ gặp khách hàng lúc 3 giờ chiều mai.)</i></p>
<p>I <b>am flying</b> to Hanoi next Monday. <i>(Tôi bay ra Hà Nội thứ Hai tuần sau.)</i></p>

<p><b>4. Xu hướng đang thay đổi:</b></p>
<p>The population <b>is growing</b> rapidly. <i>(Dân số đang tăng nhanh chóng.)</i></p>
<p>Online shopping <b>is becoming</b> more popular. <i>(Mua sắm trực tuyến đang trở nên phổ biến hơn.)</i></p>

<h3>🚫 Động từ KHÔNG dùng với thì tiếp diễn (Stative Verbs)</h3>
<p>
<b>Cảm xúc:</b> love, hate, like, want, need, prefer<br>
<b>Nhận thức:</b> know, believe, understand, remember, forget, think (= nghĩ rằng)<br>
<b>Sở hữu:</b> have (= sở hữu), own, belong, possess<br>
<b>Giác quan:</b> see, hear, smell, taste (khi mang nghĩa tự nhiên)<br>
I <b>am knowing</b> the answer. → I <b>know</b> the answer.
</p>

<h3>Dấu hiệu nhận biết</h3>
<p>
now, right now, at the moment, at present, currently, today, tonight, this week/month<br>
Các cảm thán: <b>Look!</b>, <b>Listen!</b>, <b>Be quiet!</b>, <b>Watch out!</b>
</p>

<h3>Lỗi sai thường gặp</h3>
<p>
She <b>is work</b> now. → She <b>is working</b> now. <i>(Thiếu -ing)</i><br>
I <b>am wanting</b> a coffee. → I <b>want</b> a coffee. <i>(want là stative verb)</i><br>
He <b>is runing</b>. → He <b>is running</b>. <i>(run: nhân đôi phụ âm n)</i>
</p>`, 1);

  await insertQuiz(t2, 'Look! The children ___ in the garden.', 'play', 'plays', 'are playing', 'played', 'C', '"Look!" là dấu hiệu của HTTD. Hành động đang xảy ra → are + V-ing.');
  await insertQuiz(t2, 'She ___ (write) an email at the moment.', 'writes', 'is writing', 'write', 'was writing', 'B', '"at the moment" → HTTD. "write" bỏ e + ing = writing.');
  await insertQuiz(t2, 'I ___ (not/watch) TV right now. I ___ (study).', 'don\'t watch / study', 'am not watching / am studying', 'not watch / studying', 'doesn\'t watch / studies', 'B', '"right now" → HTTD: am not watching / am studying.');
  await insertQuiz(t2, 'We ___ dinner with friends tonight. (Kế hoạch đã lên lịch)', 'have', 'has', 'are having', 'will have', 'C', 'HTTD dùng cho kế hoạch đã sắp xếp trong tương lai gần.');
  await insertQuiz(t2, 'Chọn câu SAI:', 'I am loving this song.', 'She is reading a book.', 'They are playing tennis.', 'We are waiting for the bus.', 'A', '"love" là stative verb, không dùng thì tiếp diễn. Phải nói: "I love this song."');

  // --- 1.3 Present Perfect ---
  const t3 = await insertTopic(cat1, 'Present Perfect', 'Thì Hiện Tại Hoàn Thành', `
<h3>Định nghĩa</h3>
<p>Thì Hiện tại hoàn thành (Present Perfect) diễn tả hành động <b>đã xảy ra trong quá khứ nhưng có liên quan đến hiện tại</b>, hoặc hành động <b>bắt đầu trong quá khứ và kéo dài đến hiện tại</b>.</p>

<h3>Cấu trúc chi tiết</h3>

<ul><li><strong>Dạng câu</strong></li><li><strong>Cấu trúc</strong></li><li><strong>Ví dụ</strong></li></ul>
<ul><li><b>Khẳng định</b></li><li>S + have/has + V3 (past participle)</li><li>I <b>have finished</b> my homework.</li></ul>
<ul><li><b>Phủ định</b></li><li>S + have/has + not + V3</li><li>She <b>hasn't eaten</b> lunch yet.</li></ul>
<ul><li><b>Nghi vấn</b></li><li>Have/Has + S + V3?</li><li><b>Have</b> you ever <b>been</b> to Japan?</li></ul>

<p><b>Lưu ý:</b> I/you/we/they → <b>have</b> | he/she/it → <b>has</b></p>

<h3>Cách dùng chi tiết</h3>
<p><b>1. Kinh nghiệm, trải nghiệm (không nói thời gian cụ thể):</b></p>
<p>I <b>have visited</b> Paris three times. <i>(Tôi đã đến Paris ba lần.)</i></p>
<p><b>Have</b> you ever <b>tried</b> sushi? <i>(Bạn đã bao giờ thử sushi chưa?)</i></p>
<p>She <b>has never seen</b> snow. <i>(Cô ấy chưa bao giờ nhìn thấy tuyết.)</i></p>

<p><b>2. Hành động vừa mới xảy ra (just, already, yet):</b></p>
<p>He <b>has just arrived</b>. <i>(Anh ấy vừa mới đến.)</i></p>
<p>I <b>have already done</b> my homework. <i>(Tôi đã làm xong bài tập rồi.)</i></p>
<p><b>Has</b> the meeting <b>started</b> yet? <i>(Cuộc họp đã bắt đầu chưa?)</i></p>

<p><b>3. Hành động kéo dài từ quá khứ đến hiện tại (since, for):</b></p>
<p>I <b>have lived</b> here <b>since</b> 2010. <i>(Tôi đã sống ở đây từ năm 2010.)</i></p>
<p>She <b>has worked</b> at this company <b>for</b> 5 years. <i>(Cô ấy đã làm việc ở công ty này được 5 năm.)</i></p>
<p>We <b>have known</b> each other <b>since</b> childhood. <i>(Chúng tôi đã biết nhau từ nhỏ.)</i></p>

<h3>Since vs For</h3>

<ul><li><strong>SINCE (từ khi — mốc thời gian)</strong></li><li><strong>FOR (được — khoảng thời gian)</strong></li></ul>
<ul><li>since 2020, since Monday, since I was a child, since last summer, since 8 AM</li><li>for 5 years, for 3 hours, for a long time, for two weeks, for ages</li></ul>


<h3>Dấu hiệu nhận biết</h3>
<p>
<b>just</b> (vừa mới), <b>already</b> (đã...rồi), <b>yet</b> (chưa — dùng trong phủ định và nghi vấn)<br>
<b>ever</b> (đã bao giờ), <b>never</b> (chưa bao giờ), <b>since</b> (từ khi), <b>for</b> (trong khoảng)<br>
<b>so far</b> (cho đến nay), <b>up to now / until now</b> (cho đến bây giờ), <b>recently / lately</b> (gần đây)
</p>

<h3>Phân biệt HTHT vs Quá khứ đơn</h3>
<p>
I <b>have gone</b> to Paris <b>last year</b>. → I <b>went</b> to Paris last year. <i>(Có mốc thời gian cụ thể "last year" → dùng QKĐ)</i><br>
I <b>have been</b> to Paris. <i>(Không nói khi nào → HTHT: kinh nghiệm)</i><br><br>
<b>Quy tắc:</b> Có thời gian cụ thể trong quá khứ (yesterday, last week, in 2019...) → dùng <b>Past Simple</b>.<br>
Không có / không cần thời gian cụ thể → dùng <b>Present Perfect</b>.
</p>`, 2);

  await insertQuiz(t3, 'I ___ (live) in Saigon since 2018.', 'lived', 'have lived', 'am living', 'was living', 'B', '"since 2018" → HTHT: have/has + V3. Hành động kéo dài từ 2018 đến nay.');
  await insertQuiz(t3, 'She ___ already ___ her report.', 'has / finished', 'have / finished', 'had / finished', 'is / finishing', 'A', '"She" → has. "already" → HTHT. has already finished.');
  await insertQuiz(t3, '___ you ever ___ to London?', 'Have / been', 'Did / go', 'Have / gone', 'Were / going', 'A', '"ever" → HTHT. "Have you ever been to...?" là câu hỏi kinh nghiệm chuẩn.');
  await insertQuiz(t3, 'Chọn câu ĐÚNG:', 'I have seen that movie yesterday.', 'She has worked here for three years.', 'He have finished his project.', 'They has already left.', 'B', 'A sai (yesterday → QKĐ), C sai (He → has), D sai (They → have). B đúng: has + V3 + for 3 years.');
  await insertQuiz(t3, 'We ___ each other ___ we were children.', 'knew / when', 'have known / since', 'know / for', 'are knowing / since', 'B', '"since we were children" → HTHT. have known...since = biết nhau từ khi còn nhỏ.');

  // --- 1.4 Past Simple ---
  const t4 = await insertTopic(cat1, 'Past Simple', 'Thì Quá Khứ Đơn', `
<h3>Định nghĩa</h3>
<p>Thì Quá khứ đơn (Past Simple) diễn tả <b>hành động đã xảy ra và kết thúc hoàn toàn trong quá khứ</b>, thường đi kèm với mốc thời gian cụ thể.</p>

<h3>Cấu trúc chi tiết</h3>

<ul><li><strong>Dạng câu</strong></li><li><strong>V thường</strong></li><li><strong>V to be</strong></li></ul>
<ul><li><b>Khẳng định</b></li><li>S + V2/ed</li><li>S + was/were</li></ul>
<ul><li><b>Phủ định</b></li><li>S + did not + V (nguyên thể)</li><li>S + was/were + not</li></ul>
<ul><li><b>Nghi vấn</b></li><li>Did + S + V (nguyên thể)?</li><li>Was/Were + S...?</li></ul>


<h3>📏 Quy tắc chia động từ có quy tắc thêm -ed</h3>

<ul><li><strong>Quy tắc</strong></li><li><strong>Ví dụ</strong></li></ul>
<ul><li>Hầu hết: thêm <b>-ed</b></li><li>play → play<b>ed</b>, work → work<b>ed</b></li></ul>
<ul><li>Tận cùng -e: thêm <b>-d</b></li><li>live → live<b>d</b>, love → love<b>d</b></li></ul>
<ul><li>Tận cùng phụ âm + y: đổi y → <b>-ied</b></li><li>study → stud<b>ied</b>, carry → carr<b>ied</b></li></ul>
<ul><li>1 nguyên âm + 1 phụ âm (1 âm tiết): nhân đôi</li><li>stop → sto<b>pp</b>ed, plan → pla<b>nn</b>ed</li></ul>


<h3>📋 Động từ bất quy tắc phổ biến</h3>

<ul><li><strong>V1</strong></li><li><strong>V2</strong></li><li><strong>V3</strong></li><li><strong>Nghĩa</strong></li></ul>
<ul><li>go</li><li><b>went</b></li><li>gone</li><li>đi</li></ul>
<ul><li>come</li><li><b>came</b></li><li>come</li><li>đến</li></ul>
<ul><li>eat</li><li><b>ate</b></li><li>eaten</li><li>ăn</li></ul>
<ul><li>see</li><li><b>saw</b></li><li>seen</li><li>nhìn</li></ul>
<ul><li>buy</li><li><b>bought</b></li><li>bought</li><li>mua</li></ul>
<ul><li>take</li><li><b>took</b></li><li>taken</li><li>lấy</li></ul>
<ul><li>give</li><li><b>gave</b></li><li>given</li><li>cho</li></ul>
<ul><li>write</li><li><b>wrote</b></li><li>written</li><li>viết</li></ul>


<h3>Cách dùng</h3>
<p><b>1. Hành động đã xảy ra và kết thúc trong quá khứ:</b></p>
<p>I <b>visited</b> my grandparents <b>last weekend</b>. <i>(Tôi đã thăm ông bà cuối tuần trước.)</i></p>
<p>She <b>graduated</b> from university <b>in 2020</b>. <i>(Cô ấy tốt nghiệp đại học năm 2020.)</i></p>

<p><b>2. Chuỗi hành động liên tiếp trong quá khứ:</b></p>
<p>He <b>woke up</b>, <b>brushed</b> his teeth, and <b>had</b> breakfast. <i>(Anh ấy thức dậy, đánh răng và ăn sáng.)</i></p>

<h3>Dấu hiệu nhận biết</h3>
<p>
yesterday, last night/week/month/year, ago (2 days ago), in 2019, when I was young, this morning (nếu đã qua)
</p>

<h3>Lỗi sai thường gặp</h3>
<p>
She <b>didn't went</b>. → She <b>didn't go</b>. <i>(Sau didn't, V luôn ở nguyên thể)</i><br>
<b>Did</b> you <b>went</b>? → <b>Did</b> you <b>go</b>? <i>(Sau Did, V ở nguyên thể)</i><br>
I <b>goed</b> to school. → I <b>went</b> to school. <i>(go là V bất quy tắc)</i>
</p>`, 3);

  await insertQuiz(t4, 'She ___ (go) to the cinema last night.', 'goes', 'went', 'has gone', 'is going', 'B', '"last night" → QKĐ. "go" là V bất quy tắc: go → went → gone.');
  await insertQuiz(t4, 'I ___ (not/see) him yesterday.', 'didn\'t see', 'don\'t see', 'haven\'t seen', 'wasn\'t seeing', 'A', '"yesterday" → QKĐ. Phủ định: didn\'t + V nguyên thể (see).');
  await insertQuiz(t4, '___ you ___ (enjoy) the party?', 'Did / enjoy', 'Do / enjoy', 'Have / enjoyed', 'Were / enjoying', 'A', 'QKĐ nghi vấn: Did + S + V nguyên thể?');
  await insertQuiz(t4, 'They ___ (buy) a new house two years ago.', 'buy', 'buyed', 'bought', 'have bought', 'C', '"two years ago" → QKĐ. "buy" là V bất quy tắc: buy → bought → bought.');
  await insertQuiz(t4, 'Chọn câu ĐÚNG:', 'She didn\'t liked the movie.', 'Did you went to school?', 'He doesn\'t came yesterday.', 'We didn\'t know the answer.', 'D', 'A: didn\'t like (bỏ d). B: Did you go (V nguyên thể). C: didn\'t come. D đúng: didn\'t know.');

  // --- 1.5 Future Simple ---
  const t5 = await insertTopic(cat1, 'Future Simple', 'Thì Tương Lai Đơn', `
<h3>Định nghĩa</h3>
<p>Thì Tương lai đơn (Future Simple) diễn tả <b>dự đoán</b>, <b>quyết định tại thời điểm nói</b>, <b>lời hứa</b>, <b>đề nghị</b>, hoặc <b>sự kiện sẽ xảy ra trong tương lai</b>.</p>

<h3>Cấu trúc</h3>

<ul><li><strong>Dạng câu</strong></li><li><strong>Cấu trúc</strong></li><li><strong>Ví dụ</strong></li></ul>
<ul><li><b>Khẳng định</b></li><li>S + will + V (nguyên thể)</li><li>I <b>will call</b> you later.</li></ul>
<ul><li><b>Phủ định</b></li><li>S + will not (won't) + V</li><li>She <b>won't come</b> tomorrow.</li></ul>
<ul><li><b>Nghi vấn</b></li><li>Will + S + V?</li><li><b>Will</b> you <b>help</b> me?</li></ul>


<h3>Cách dùng</h3>
<p><b>1. Quyết định ngay tại thời điểm nói (spontaneous decision):</b></p>
<p>[Chuông điện thoại reo] I<b>'ll answer</b> it. <i>(Tôi sẽ nghe máy.)</i></p>
<p>I'm hungry. I <b>think I'll order</b> a pizza. <i>(Tôi đói. Tôi nghĩ tôi sẽ đặt pizza.)</i></p>

<p><b>2. Lời hứa:</b></p>
<p>I <b>will always love</b> you. <i>(Anh sẽ luôn yêu em.)</i></p>
<p>I <b>promise I won't tell</b> anyone. <i>(Tôi hứa tôi sẽ không nói với ai.)</i></p>

<p><b>3. Dự đoán (không có căn cứ rõ ràng):</b></p>
<p>I <b>think</b> it <b>will rain</b> tomorrow. <i>(Tôi nghĩ ngày mai trời sẽ mưa.)</i></p>

<p><b>4. Đề nghị, yêu cầu lịch sự:</b></p>
<p><b>Will</b> you <b>open</b> the window, please? <i>(Bạn vui lòng mở cửa sổ được không?)</i></p>
<p><b>Shall I help</b> you with that? <i>(Tôi giúp bạn việc đó nhé?)</i></p>

<h3>Phân biệt Will vs Be going to</h3>

<ul><li><strong>WILL</strong></li><li><strong>BE GOING TO</strong></li></ul>
<ul><li>Quyết định ngay tại thời điểm nói</li><li>Kế hoạch, dự định đã có từ trước</li></ul>
<ul><li>Dự đoán dựa trên ý kiến cá nhân</li><li>Dự đoán dựa trên bằng chứng hiện tại</li></ul>
<ul><li><i>I'll have the chicken.</i> (vừa quyết định)</li><li><i>I'm going to visit Paris next month.</i> (đã lên kế hoạch)</li></ul>
<ul><li><i>I think it will rain.</i> (dự đoán cá nhân)</li><li><i>Look at those clouds. It's going to rain.</i> (có bằng chứng)</li></ul>


<h3>Dấu hiệu nhận biết</h3>
<p>
tomorrow, next week/month/year, I think/believe/hope, probably, perhaps, maybe, in the future, someday
</p>`, 4);

  await insertQuiz(t5, 'I think she ___ the exam.', 'passes', 'will pass', 'is passing', 'passed', 'B', '"I think" → dự đoán cá nhân → will + V nguyên thể.');
  await insertQuiz(t5, 'Don\'t worry. I ___ you with your bags.', 'help', 'will help', 'am helping', 'helped', 'B', 'Lời hứa/đề nghị → will + V. Quyết định ngay lúc nói.');
  await insertQuiz(t5, '___ you ___ the door, please?', 'Will / close', 'Do / close', 'Are / closing', 'Did / close', 'A', 'Yêu cầu lịch sự → Will you + V nguyên thể?');
  await insertQuiz(t5, 'Look at those dark clouds! It ___ rain.', 'will', 'is going to', 'shall', 'would', 'B', 'Có bằng chứng hiện tại (dark clouds) → dùng "be going to" chứ không phải "will".');
  await insertQuiz(t5, 'She ___ 25 next month.', 'is', 'will be', 'is being', 'was', 'B', 'Sự kiện trong tương lai → will + be.');

  console.log('  Tenses: 5 topics seeded');

  // =============================================================
  // 2. CONDITIONALS
  // =============================================================
  const cat2 = await insertCategory('Conditionals', 'Câu điều kiện', '🔀', 1);
  console.log('🔀 Seeding Conditionals...');

  const c0 = await insertTopic(cat2, 'Zero & First Conditional', 'Câu điều kiện loại 0 & 1', `
<h3>Câu điều kiện loại 0 — Sự thật hiển nhiên</h3>

<ul><li><strong>Cấu trúc</strong></li><li><strong>If + S + V (HTĐ), S + V (HTĐ)</strong></li></ul>

<p>Dùng khi kết quả <b>luôn luôn đúng</b>, là sự thật khoa học hoặc quy luật tự nhiên.</p>
<p>If you <b>heat</b> ice, it <b>melts</b>. <i>(Nếu bạn đun nóng đá, nó tan.)</i></p>
<p>If you <b>don't water</b> plants, they <b>die</b>. <i>(Nếu bạn không tưới cây, chúng chết.)</i></p>

<h3>Câu điều kiện loại 1 — Có thể xảy ra ở hiện tại/tương lai</h3>

<ul><li><strong>Cấu trúc</strong></li><li><strong>If + S + V (HTĐ), S + will + V</strong></li></ul>

<p>Dùng khi điều kiện <b>có thể xảy ra</b> trong thực tế ở hiện tại hoặc tương lai.</p>
<p>If it <b>rains</b>, I <b>will take</b> an umbrella. <i>(Nếu trời mưa, tôi sẽ mang ô.)</i></p>
<p>If you <b>study</b> hard, you <b>will pass</b> the exam. <i>(Nếu bạn học chăm, bạn sẽ đỗ.)</i></p>
<p>If she <b>doesn't hurry</b>, she <b>will miss</b> the bus. <i>(Nếu cô ấy không nhanh lên, cô ấy sẽ lỡ xe buýt.)</i></p>

<h3>Lỗi sai thường gặp</h3>
<p>
If it <b>will rain</b>, I will stay home. → If it <b>rains</b>... <i>(Mệnh đề IF không dùng "will"!)</i><br>
If you <b>will study</b>... → If you <b>study</b>...
</p>

<h3>Lưu ý quan trọng</h3>
<p>
<b>Quy tắc vàng:</b> Mệnh đề IF trong loại 0 và loại 1 <b>KHÔNG BAO GIỜ</b> dùng "will".<br>
Mệnh đề IF luôn dùng <b>Hiện tại đơn</b>, chỉ mệnh đề chính mới dùng "will".
</p>`, 0);

  await insertQuiz(c0, 'If you heat water to 100°C, it ___.', 'will boil', 'boils', 'boiled', 'is boiling', 'B', 'Câu ĐK loại 0: cả 2 vế dùng HTĐ. Sự thật hiển nhiên.');
  await insertQuiz(c0, 'If it ___ tomorrow, we will stay at home.', 'rains', 'will rain', 'rained', 'is raining', 'A', 'CĐK loại 1: mệnh đề If dùng HTĐ, KHÔNG dùng will.');
  await insertQuiz(c0, 'If you don\'t study, you ___ the test.', 'fail', 'will fail', 'failed', 'are failing', 'B', 'CĐK loại 1: mệnh đề chính dùng will + V nguyên thể.');
  await insertQuiz(c0, 'Chọn câu SAI:', 'If it rains, the grass gets wet.', 'If you heat ice, it melts.', 'If she will come, I will be happy.', 'If I\'m late, I\'ll call you.', 'C', 'C sai vì mệnh đề IF không dùng "will". Đúng: "If she comes..."');
  await insertQuiz(c0, 'If you ___ (mix) blue and yellow, you ___ (get) green.', 'mix / get', 'mix / will get', 'will mix / get', 'mixed / got', 'A', 'Sự thật luôn đúng → CĐK loại 0: cả 2 vế dùng HTĐ.');

  const c2 = await insertTopic(cat2, 'Second Conditional', 'Câu điều kiện loại 2', `
<h3>Định nghĩa</h3>
<p>Câu điều kiện loại 2 diễn tả <b>điều kiện không có thật ở hiện tại</b> — tưởng tượng, ước muốn, giả định trái với thực tế.</p>

<h3>Cấu trúc</h3>

<ul><li><strong>Cấu trúc</strong></li><li><strong>If + S + V2/ed (quá khứ đơn), S + would + V</strong></li></ul>

<p><b>Lưu ý đặc biệt:</b> Trong CĐK loại 2, to be → <b>were</b> cho TẤT CẢ các ngôi (kể cả I, he, she, it).</p>

<h3>Ví dụ</h3>
<p>If I <b>were</b> rich, I <b>would travel</b> around the world. <i>(Nếu tôi giàu, tôi sẽ đi du lịch vòng quanh TG.) → Thực tế: Tôi KHÔNG giàu.</i></p>
<p>If I <b>had</b> wings, I <b>would fly</b>. <i>(Nếu tôi có cánh, tôi sẽ bay.) → Thực tế: Tôi KHÔNG có cánh.</i></p>
<p>If she <b>spoke</b> English, she <b>would get</b> a better job. <i>(Nếu cô ấy nói được tiếng Anh, cô ấy sẽ có công việc tốt hơn.) → Thực tế: Cô ấy KHÔNG nói được tiếng Anh.</i></p>

<h3>Ứng dụng: Cho lời khuyên</h3>
<p>
If I <b>were</b> you, I <b>would study</b> harder. <i>(Nếu tôi là bạn, tôi sẽ học chăm hơn.)</i><br>
→ Cách nói cho lời khuyên rất phổ biến: <b>"If I were you, I would..."</b>
</p>`, 1);

  await insertQuiz(c2, 'If I ___ a bird, I would fly to the moon.', 'am', 'was', 'were', 'be', 'C', 'CĐK loại 2: to be → "were" cho tất cả các ngôi, kể cả "I".');
  await insertQuiz(c2, 'If he ___ more money, he ___ a new car.', 'has / will buy', 'had / would buy', 'have / would buy', 'had / will buy', 'B', 'CĐK loại 2: If + V2 (had), would + V (buy).');
  await insertQuiz(c2, 'If I were you, I ___ that job offer.', 'will accept', 'would accept', 'accept', 'accepted', 'B', '"If I were you" → CĐK loại 2 → would + V nguyên thể.');
  await insertQuiz(c2, 'Câu nào diễn tả điều KHÔNG CÓ THẬT ở hiện tại?', 'If it rains, I will stay home.', 'If I had a car, I would drive to work.', 'If you study, you will pass.', 'If you heat ice, it melts.', 'B', 'B là CĐK loại 2: giả định không có thật. Thực tế: Tôi KHÔNG có xe.');
  await insertQuiz(c2, 'What ___ you ___ if you won the lottery?', 'will / do', 'would / do', 'do / do', 'did / do', 'B', '"won" (V2) → CĐK loại 2 → would + V. "What would you do?"');

  const c3 = await insertTopic(cat2, 'Third Conditional', 'Câu điều kiện loại 3', `
<h3>Định nghĩa</h3>
<p>Câu điều kiện loại 3 diễn tả <b>điều kiện không có thật trong quá khứ</b> — hối tiếc về điều đã xảy ra, giả định trái với quá khứ.</p>

<h3>Cấu trúc</h3>

<ul><li><strong>Cấu trúc</strong></li><li><strong>If + S + had + V3, S + would have + V3</strong></li></ul>


<h3>Ví dụ</h3>
<p>If I <b>had studied</b> harder, I <b>would have passed</b> the exam. <i>(Nếu tôi đã học chăm hơn, tôi đã đỗ kỳ thi.) → Thực tế: Tôi KHÔNG học chăm và KHÔNG đỗ.</i></p>
<p>If she <b>had left</b> earlier, she <b>wouldn't have missed</b> the flight. <i>(Nếu cô ấy đã đi sớm hơn, cô ấy đã không lỡ chuyến bay.) → Thực tế: Cô ấy đi muộn và LỠ chuyến bay.</i></p>

<h3>So sánh 3 loại câu điều kiện</h3>

<ul><li><strong>Loại</strong></li><li><strong>Mệnh đề IF</strong></li><li><strong>Mệnh đề chính</strong></li><li><strong>Thực tế</strong></li></ul>
<ul><li><b>Loại 1</b></li><li>V (HTĐ)</li><li>will + V</li><li>Có thể xảy ra</li></ul>
<ul><li><b>Loại 2</b></li><li>V2/ed (QKĐ)</li><li>would + V</li><li>Không thật ở hiện tại</li></ul>
<ul><li><b>Loại 3</b></li><li>had + V3 (QKHT)</li><li>would have + V3</li><li>Không thật ở quá khứ</li></ul>
`, 2);

  await insertQuiz(c3, 'If I ___ (know), I would have told you.', 'know', 'knew', 'had known', 'have known', 'C', 'CĐK loại 3: If + had + V3 (had known). Sự việc đã qua → không thể thay đổi.');
  await insertQuiz(c3, 'If she had left earlier, she ___ the train.', 'will catch', 'would catch', 'would have caught', 'catches', 'C', 'CĐK loại 3: would have + V3 (would have caught).');
  await insertQuiz(c3, 'If they ___ harder, they would have won.', 'try', 'tried', 'had tried', 'have tried', 'C', 'CĐK loại 3: mệnh đề If dùng had + V3: "had tried".');
  await insertQuiz(c3, 'Câu nào diễn tả sự HỐI TIẾC về quá khứ?', 'If I study, I will pass.', 'If I were you, I would go.', 'If I had known, I would have helped.', 'If it rains, the road gets wet.', 'C', 'C là CĐK loại 3: giả định trái với quá khứ, thể hiện sự hối tiếc.');
  await insertQuiz(c3, 'I wouldn\'t have been late if I ___ up earlier.', 'wake', 'woke', 'had woken', 'would wake', 'C', 'CĐK loại 3: If + had + V3. "had woken" up earlier.');

  console.log('  Conditionals: 3 topics seeded');

  // =============================================================
  // 3. PASSIVE VOICE
  // =============================================================
  const cat3 = await insertCategory('Passive Voice', 'Câu bị động', '🔄', 2);
  console.log('🔄 Seeding Passive Voice...');

  const pv = await insertTopic(cat3, 'Passive Voice', 'Câu bị động toàn diện', `
<h3>Khi nào dùng câu bị động?</h3>
<ul>
<li>Khi <b>không biết</b> hoặc <b>không cần biết</b> ai thực hiện hành động</li>
<li>Khi muốn <b>nhấn mạnh đối tượng bị tác động</b>, không phải người thực hiện</li>
<li>Trong văn bản <b>khoa học, báo chí, thông báo chính thức</b></li>
</ul>

<h3>Công thức tổng quát</h3>
<p>
<b>S (tân ngữ cũ) + BE (chia theo thì) + V3/ed + (by + tác nhân)</b>
</p>

<h3>Bảng chuyển đổi theo từng thì</h3>

<ul><li><strong>Thì</strong></li><li><strong>Chủ động</strong></li><li><strong>Bị động</strong></li></ul>
<ul><li>HTĐ</li><li>She <b>writes</b> a letter.</li><li>A letter <b>is written</b> (by her).</li></ul>
<ul><li>HTTD</li><li>She <b>is writing</b> a letter.</li><li>A letter <b>is being written</b>.</li></ul>
<ul><li>HTHT</li><li>She <b>has written</b> a letter.</li><li>A letter <b>has been written</b>.</li></ul>
<ul><li>QKĐ</li><li>She <b>wrote</b> a letter.</li><li>A letter <b>was written</b>.</li></ul>
<ul><li>QKTD</li><li>She <b>was writing</b> a letter.</li><li>A letter <b>was being written</b>.</li></ul>
<ul><li>TLĐ</li><li>She <b>will write</b> a letter.</li><li>A letter <b>will be written</b>.</li></ul>
<ul><li>Modal</li><li>She <b>can write</b> a letter.</li><li>A letter <b>can be written</b>.</li></ul>


<h3>Thêm ví dụ thực tế</h3>
<p>English <b>is spoken</b> in many countries. <i>(Tiếng Anh được nói ở nhiều nước.)</i></p>
<p>The Mona Lisa <b>was painted</b> by Leonardo da Vinci. <i>(Bức Mona Lisa được vẽ bởi Leonardo da Vinci.)</i></p>
<p>The new bridge <b>is being built</b> now. <i>(Cây cầu mới đang được xây dựng.)</i></p>
<p>All the tickets <b>have been sold</b>. <i>(Tất cả vé đã được bán hết.)</i></p>
<p>Homework <b>must be done</b> before class. <i>(Bài tập phải được hoàn thành trước giờ học.)</i></p>

<h3>Lỗi sai thường gặp</h3>
<p>
The cake <b>was make</b> by my mom. → The cake <b>was made</b>. <i>(Phải dùng V3: make → made)</i><br>
English <b>is speak</b> worldwide. → English <b>is spoken</b>. <i>(speak → spoken)</i><br>
The house <b>is build</b>. → The house <b>is being built</b> / <b>was built</b>. <i>(build → built)</i>
</p>`, 0);

  await insertQuiz(pv, 'This book ___ by millions of people.', 'reads', 'is read', 'is reading', 'has reading', 'B', 'Bị động HTĐ: is/are + V3. "read" → V3 = "read" (phát âm /red/). is read.');
  await insertQuiz(pv, 'The house ___ (build) in 1990.', 'built', 'was built', 'is built', 'has been built', 'B', 'Bị động QKĐ: was/were + V3. "in 1990" → quá khứ → was built.');
  await insertQuiz(pv, 'A new hospital ___ (build) in our city now.', 'is built', 'is being built', 'was built', 'has been built', 'B', '"now" → HTTD bị động: is/are + being + V3 = is being built.');
  await insertQuiz(pv, 'All the cookies ___ (eat) by the children.', 'have been eaten', 'has been eaten', 'was eaten', 'are eating', 'A', '"All the cookies" số nhiều → have been + V3 (eaten). HTHT bị động.');
  await insertQuiz(pv, 'This report ___ by tomorrow.', 'must finish', 'must be finished', 'must be finish', 'must finished', 'B', 'Modal + bị động: must + be + V3 = "must be finished".');

  console.log('  Passive Voice seeded');

  // =============================================================
  // 4-12: Other categories (shorter but still detailed)
  // =============================================================
  // 4. REPORTED SPEECH
  const cat4 = await insertCategory('Reported Speech', 'Câu tường thuật', '💬', 3);
  const rs = await insertTopic(cat4, 'Reported Speech', 'Câu tường thuật (câu gián tiếp)', `
<h3>Định nghĩa</h3>
<p>Câu tường thuật (Reported Speech / Indirect Speech) dùng để <b>thuật lại lời nói của người khác</b>, không trích dẫn nguyên văn.</p>

<h3>Bảng lùi thì</h3>

<ul><li><strong>Trực tiếp</strong></li><li><strong>Gián tiếp</strong></li></ul>
<ul><li>am/is → <b>was</b></li><li>are → <b>were</b></li></ul>
<ul><li>V1/V(s/es) → <b>V2/ed</b></li><li>am/is/are + V-ing → <b>was/were + V-ing</b></li></ul>
<ul><li>have/has + V3 → <b>had + V3</b></li><li>V2/ed → <b>had + V3</b></li></ul>
<ul><li>will → <b>would</b></li><li>can → <b>could</b></li></ul>
<ul><li>may → <b>might</b></li><li>must → <b>had to</b></li></ul>
<ul><li>shall → <b>should</b></li><li></li></ul>


<h3>Đổi trạng từ</h3>

<ul><li><strong>Trực tiếp</strong></li><li><strong>Gián tiếp</strong></li></ul>
<ul><li>today → <b>that day</b></li><li>tomorrow → <b>the next day / the following day</b></li></ul>
<ul><li>yesterday → <b>the day before / the previous day</b></li><li>now → <b>then / at that time</b></li></ul>
<ul><li>here → <b>there</b></li><li>this → <b>that</b></li></ul>
<ul><li>these → <b>those</b></li><li>ago → <b>before</b></li></ul>


<h3>Ví dụ</h3>
<p><b>Câu trần thuật:</b> "I am tired." → He said (that) he <b>was</b> tired.</p>
<p><b>Câu hỏi Yes/No:</b> "Do you like coffee?" → She asked me <b>if/whether</b> I <b>liked</b> coffee.</p>
<p><b>Câu hỏi Wh:</b> "Where do you live?" → He asked me <b>where</b> I <b>lived</b>.</p>
<p><b>Câu mệnh lệnh:</b> "Open the door." → She told me <b>to open</b> the door.</p>
<p><b>Câu phủ định mệnh lệnh:</b> "Don't touch that." → He told me <b>not to touch</b> that.</p>

<h3>Lưu ý quan trọng</h3>
<p>
Câu hỏi gián tiếp dùng <b>trật tự câu trần thuật</b> (S + V), KHÔNG đảo ngữ.<br>
He asked where <b>did I live</b>. → He asked where <b>I lived</b>.
</p>`, 0);

  await insertQuiz(rs, '"I am a teacher." → She said she ___ a teacher.', 'is', 'was', 'were', 'be', 'B', 'Lùi thì: am → was.');
  await insertQuiz(rs, '"I will call you." → He said he ___ call me.', 'will', 'would', 'can', 'should', 'B', 'Lùi thì: will → would.');
  await insertQuiz(rs, '"Do you speak English?" → She asked me ___ I ___ English.', 'if / spoke', 'that / speak', 'do / speak', 'if / will speak', 'A', 'Câu hỏi Yes/No → asked if/whether + S + V (lùi thì).');
  await insertQuiz(rs, '"Don\'t open the window." → He told me ___ the window.', 'don\'t open', 'not to open', 'to not open', 'not opening', 'B', 'Mệnh lệnh phủ định → told sb NOT TO + V.');
  await insertQuiz(rs, '"Where is the bank?" → She asked ___.', 'where is the bank', 'where the bank is', 'where was the bank', 'where the bank was', 'D', 'Câu hỏi gián tiếp: đảo lại trật tự S+V và lùi thì: is → was.');

  console.log('  Reported Speech seeded');

  // 5. MODAL VERBS
  const cat5 = await insertCategory('Modal Verbs', 'Động từ khuyết thiếu', '🔧', 4);
  const mv = await insertTopic(cat5, 'Modal Verbs', 'Động từ khuyết thiếu: can, could, must, should, may, might', `
<h3>Đặc điểm chung</h3>
<ul>
<li>Luôn đi với <b>V nguyên thể</b> (không chia, không thêm to)</li>
<li>Không có dạng V-ing, V3, hay thêm -s/-es</li>
<li>Tự tạo phủ định (thêm not) và nghi vấn (đảo lên trước S)</li>
</ul>

<h3>Bảng tổng hợp</h3>

<ul><li><strong>Modal</strong></li><li><strong>Nghĩa chính</strong></li><li><strong>Ví dụ</strong></li></ul>
<ul><li><b>can</b></li><li>Có thể (khả năng), cho phép</li><li>I <b>can</b> swim. / You <b>can</b> go now.</li></ul>
<ul><li><b>could</b></li><li>Có thể (quá khứ), lịch sự</li><li><b>Could</b> you help me? / I <b>could</b> read at age 5.</li></ul>
<ul><li><b>must</b></li><li>Phải (bắt buộc), chắc chắn</li><li>You <b>must</b> wear a helmet. / She <b>must</b> be tired.</li></ul>
<ul><li><b>mustn't</b></li><li>Cấm, không được</li><li>You <b>mustn't</b> smoke here.</li></ul>
<ul><li><b>should</b></li><li>Nên (lời khuyên)</li><li>You <b>should</b> see a doctor.</li></ul>
<ul><li><b>may</b></li><li>Có thể (xin phép), khả năng</li><li><b>May</b> I come in? / It <b>may</b> rain.</li></ul>
<ul><li><b>might</b></li><li>Có thể (khả năng thấp)</li><li>He <b>might</b> be late.</li></ul>
<ul><li><b>have to</b></li><li>Phải (bắt buộc bên ngoài)</li><li>I <b>have to</b> work on Saturday.</li></ul>


<h3>Phân biệt must vs have to vs should</h3>
<p>
<b>must:</b> bắt buộc (nội quy, luật) — You <b>must</b> stop at a red light.<br>
<b>have to:</b> bắt buộc (hoàn cảnh bên ngoài) — I <b>have to</b> wake up early for work.<br>
<b>should:</b> nên (lời khuyên, không bắt buộc) — You <b>should</b> drink more water.<br>
<b>mustn't:</b> CẤM — You <b>mustn't</b> cheat in the exam.<br>
<b>don't have to:</b> KHÔNG CẦN — You <b>don't have to</b> come if you don't want. (Bạn không cần phải đến.)
</p>`, 0);

  await insertQuiz(mv, 'You ___ drive without a license. It\'s against the law.', 'shouldn\'t', 'mustn\'t', 'don\'t have to', 'can\'t', 'B', 'Cấm (luật pháp) → mustn\'t. "shouldn\'t" chỉ là lời khuyên, "mustn\'t" là cấm.');
  await insertQuiz(mv, 'You look sick. You ___ see a doctor.', 'must', 'should', 'can', 'might', 'B', 'Lời khuyên → should. Không bắt buộc nhưng nên làm.');
  await insertQuiz(mv, 'It\'s Sunday. I ___ go to work today.', 'mustn\'t', 'don\'t have to', 'shouldn\'t', 'can\'t', 'B', '= Không cần đi làm (vì Chủ nhật). don\'t have to = không cần.');
  await insertQuiz(mv, '___ I use your phone, please?', 'Must', 'Should', 'May', 'Will', 'C', 'Xin phép lịch sự → May I...?');
  await insertQuiz(mv, 'She ___ be at home. Her car is in the driveway.', 'must', 'should', 'can', 'might', 'A', 'Suy đoán chắc chắn (có bằng chứng: xe đỗ ở đó) → must.');

  console.log('  Modal Verbs seeded');

  // 6. COMPARATIVES & SUPERLATIVES
  const cat6 = await insertCategory('Comparatives & Superlatives', 'So sánh hơn & So sánh nhất', '⚖️', 5);
  const comp = await insertTopic(cat6, 'Comparatives & Superlatives', 'So sánh hơn và So sánh nhất', `
<h3>Quy tắc tổng hợp</h3>

<ul><li><strong>Loại</strong></li><li><strong>So sánh hơn</strong></li><li><strong>So sánh nhất</strong></li></ul>
<ul><li>Tính từ ngắn (1 âm tiết)</li><li>adj + <b>-er</b> + than</li><li><b>the</b> + adj + <b>-est</b></li></ul>
<ul><li>Tính từ kết thúc -e</li><li>adj + <b>-r</b> + than</li><li><b>the</b> + adj + <b>-st</b></li></ul>
<ul><li>Tính từ kết thúc 1NÂ+1PÂ</li><li>nhân đôi PÂ + <b>-er</b></li><li>nhân đôi PÂ + <b>-est</b></li></ul>
<ul><li>Tính từ dài (2+ âm tiết)</li><li><b>more</b> + adj + than</li><li><b>the most</b> + adj</li></ul>
<ul><li>Bất quy tắc</li><li>good → better → best | bad → worse → worst | far → farther → farthest | much/many → more → most | little → less → least</li></ul>


<h3>Ví dụ</h3>
<p>Tokyo is <b>bigger than</b> Osaka. <i>(Tokyo lớn hơn Osaka.)</i></p>
<p>This book is <b>more interesting than</b> that one. <i>(Cuốn sách này thú vị hơn cuốn kia.)</i></p>
<p>Mount Everest is <b>the highest</b> mountain in the world. <i>(Everest là ngọn núi cao nhất TG.)</i></p>

<h3>So sánh bằng: as...as</h3>
<p><b>S + be + as + adj + as + O</b></p>
<p>She is <b>as tall as</b> her brother. <i>(Cô ấy cao bằng anh trai.)</i></p>
<p>He is <b>not as rich as</b> his father. <i>(Anh ấy không giàu bằng bố.)</i></p>`, 0);

  await insertQuiz(comp, 'She is ___ than her sister.', 'more tall', 'taller', 'tallest', 'most tall', 'B', '"tall" (1 âm tiết) → thêm -er: taller + than.');
  await insertQuiz(comp, 'This is ___ movie I\'ve ever seen.', 'the most exciting', 'more exciting', 'excitingest', 'most exciting', 'A', '"exciting" (3 âm tiết) → the most + adj. Phải có "the" trước.');
  await insertQuiz(comp, 'My English is getting ___ and ___.', 'good / good', 'better / better', 'gooder / gooder', 'best / best', 'B', 'Cấu trúc "more and more" / "adj-er and adj-er": better and better.');
  await insertQuiz(comp, 'He runs ___ than me.', 'faster', 'more fast', 'fastest', 'more faster', 'A', '"fast" (1 âm tiết) → faster. Không dùng "more fast".');
  await insertQuiz(comp, 'She is as ___ as her mother.', 'beautiful', 'more beautiful', 'most beautiful', 'beautifuler', 'A', 'So sánh bằng: as + adj (nguyên thể) + as.');

  console.log('  Comparatives & Superlatives seeded');

  // 7. RELATIVE CLAUSES
  const cat7 = await insertCategory('Relative Clauses', 'Mệnh đề quan hệ', '🔗', 6);
  const rc = await insertTopic(cat7, 'Relative Clauses', 'Mệnh đề quan hệ: who, which, that, whose, where, when', `
<h3>Bảng tổng hợp đại từ quan hệ</h3>

<ul><li><strong>Đại từ</strong></li><li><strong>Thay cho</strong></li><li><strong>Chức năng</strong></li><li><strong>Ví dụ</strong></li></ul>
<ul><li><b>who</b></li><li>Người</li><li>Chủ ngữ / Tân ngữ</li><li>The man <b>who</b> called you is my boss.</li></ul>
<ul><li><b>whom</b></li><li>Người</li><li>Tân ngữ (trang trọng)</li><li>The girl <b>whom</b> I met was kind.</li></ul>
<ul><li><b>which</b></li><li>Vật / Sự việc</li><li>Chủ ngữ / Tân ngữ</li><li>The book <b>which</b> I bought is great.</li></ul>
<ul><li><b>that</b></li><li>Người / Vật</li><li>Chủ ngữ / Tân ngữ</li><li>The car <b>that</b> he drives is red.</li></ul>
<ul><li><b>whose</b></li><li>Sở hữu</li><li>Thay cho his/her/its/their</li><li>The boy <b>whose</b> father is a doctor.</li></ul>
<ul><li><b>where</b></li><li>Nơi chốn</li><li>= in/at which</li><li>The city <b>where</b> I was born.</li></ul>
<ul><li><b>when</b></li><li>Thời gian</li><li>= in/at/on which</li><li>The day <b>when</b> we first met.</li></ul>


<h3>Hai loại mệnh đề quan hệ</h3>
<p><b>1. Xác định (Defining):</b> Cung cấp thông tin THIẾT YẾU, không có dấu phẩy.</p>
<p>The student <b>who studies hard</b> will pass. <i>(Sinh viên nào học chăm sẽ đỗ.)</i></p>

<p><b>2. Không xác định (Non-defining):</b> Thêm thông tin PHỤ, có dấu phẩy. KHÔNG dùng "that".</p>
<p>My mother<b>, who is 60,</b> still works every day. <i>(Mẹ tôi, người 60 tuổi, vẫn làm việc mỗi ngày.)</i></p>`, 0);

  await insertQuiz(rc, 'The woman ___ lives next door is a teacher.', 'which', 'who', 'whose', 'where', 'B', 'Thay cho người (chủ ngữ) → who.');
  await insertQuiz(rc, 'The book ___ you gave me was very interesting.', 'who', 'which', 'whose', 'where', 'B', 'Thay cho vật (tân ngữ) → which/that.');
  await insertQuiz(rc, 'That is the restaurant ___ we had dinner last night.', 'which', 'who', 'where', 'whose', 'C', 'Nơi chốn → where (= at which).');
  await insertQuiz(rc, 'The man ___ car was stolen called the police.', 'who', 'which', 'whose', 'that', 'C', '"car was stolen" = xe CỦA ai → sở hữu → whose.');
  await insertQuiz(rc, 'I still remember the day ___ I graduated.', 'which', 'where', 'when', 'whose', 'C', 'Thời gian → when (= on which).');

  console.log('  Relative Clauses seeded');

  // 8. ARTICLES
  const cat8 = await insertCategory('Articles', 'Mạo từ', '📎', 7);
  const ar = await insertTopic(cat8, 'Articles (A / An / The)', 'Mạo từ A, An, The và trường hợp không dùng mạo từ', `
<h3>Bảng quy tắc</h3>

<ul><li><strong>Mạo từ</strong></li><li><strong>Khi nào dùng</strong></li><li><strong>Ví dụ</strong></li></ul>
<ul><li><b>A</b></li><li>Trước DT đếm được số ít, bắt đầu phụ âm. Nhắc đến lần đầu.</li><li>I saw <b>a</b> dog.</li></ul>
<ul><li><b>An</b></li><li>Trước DT đếm được số ít, bắt đầu nguyên âm (âm đọc).</li><li>She is <b>an</b> engineer. / <b>an</b> hour</li></ul>
<ul><li><b>The</b></li><li>Cả 2 đều biết. Vật duy nhất. Đã nhắc đến trước đó.</li><li><b>The</b> sun. / I saw a dog. <b>The</b> dog was big.</li></ul>
<ul><li><b>Ø (không dùng)</b></li><li>DT số nhiều / không đếm được khi nói chung.</li><li><b>Ø</b> Dogs are loyal. / <b>Ø</b> Water is important.</li></ul>


<h3>Trường hợp đặc biệt</h3>
<p>
<b>an</b> honest person (h câm), <b>an</b> hour, <b>an</b> MBA<br>
<b>a</b> university (phát âm /juː/), <b>a</b> European country (phát âm /jʊ/)<br>
→ Quy tắc dựa vào <b>ÂM ĐỌC</b>, không phải chữ cái đầu.
</p>`, 0);

  await insertQuiz(ar, 'She is ___ honest woman.', 'a', 'an', 'the', '-', 'B', '"honest" h câm, âm đầu là nguyên âm /ɒ/ → dùng "an".');
  await insertQuiz(ar, 'I bought ___ new car. ___ car is blue.', 'a / The', 'an / The', 'the / A', 'a / A', 'A', 'Lần đầu nhắc → a. Đã biết → the.');
  await insertQuiz(ar, '___ Earth moves around ___ Sun.', 'A / a', 'An / the', 'The / the', '- / -', 'C', 'Vật duy nhất (chỉ có 1) → the Earth, the Sun.');
  await insertQuiz(ar, 'He is ___ university student.', 'a', 'an', 'the', '-', 'A', '"university" phát âm /juː/ (bắt đầu bằng phụ âm) → dùng "a".');
  await insertQuiz(ar, '___ water is essential for life.', 'A', 'An', 'The', '-', 'D', 'DT không đếm được nói chung → không dùng mạo từ (Ø).');

  console.log('  Articles seeded');

  // 9. PREPOSITIONS
  const cat9 = await insertCategory('Prepositions', 'Giới từ', '📍', 8);
  const prep = await insertTopic(cat9, 'Prepositions of Time & Place', 'Giới từ chỉ thời gian (in, on, at) và nơi chốn', `
<h3>Giới từ chỉ thời gian</h3>

<ul><li><strong>Giới từ</strong></li><li><strong>Dùng với</strong></li><li><strong>Ví dụ</strong></li></ul>
<ul><li><b>IN</b></li><li>Tháng, năm, mùa, buổi, thế kỷ</li><li>in May, in 2024, in summer, in the morning, in the 21st century</li></ul>
<ul><li><b>ON</b></li><li>Ngày, thứ, ngày lễ cụ thể</li><li>on Monday, on June 5th, on Christmas Day, on my birthday</li></ul>
<ul><li><b>AT</b></li><li>Giờ, thời điểm cụ thể</li><li>at 7 AM, at noon, at midnight, at night, at the weekend</li></ul>


<h3>Giới từ chỉ nơi chốn</h3>

<ul><li><strong>Giới từ</strong></li><li><strong>Dùng với</strong></li><li><strong>Ví dụ</strong></li></ul>
<ul><li><b>IN</b></li><li>Không gian 3D, bên trong</li><li>in the room, in Vietnam, in a box, in the car</li></ul>
<ul><li><b>ON</b></li><li>Bề mặt, trên</li><li>on the table, on the wall, on the 2nd floor, on the bus</li></ul>
<ul><li><b>AT</b></li><li>Một điểm cụ thể</li><li>at school, at the airport, at home, at the door</li></ul>


<h3>Ngoại lệ cần nhớ</h3>
<p>
<b>at night</b> (KHÔNG dùng in night)<br>
<b>at the weekend</b> (British) / <b>on the weekend</b> (American)<br>
<b>in the morning/afternoon/evening</b> NHƯNG <b>at night</b><br>
<b>on the bus/train/plane</b> NHƯNG <b>in the car/taxi</b>
</p>`, 0);

  await insertQuiz(prep, 'She was born ___ 1995.', 'on', 'in', 'at', 'by', 'B', 'Năm → in.');
  await insertQuiz(prep, 'The meeting is ___ Monday ___ 9 AM.', 'in / at', 'on / at', 'at / on', 'on / in', 'B', 'Thứ → on. Giờ → at.');
  await insertQuiz(prep, 'There is a picture ___ the wall.', 'in', 'on', 'at', 'by', 'B', 'Trên bề mặt tường → on the wall.');
  await insertQuiz(prep, 'I\'ll see you ___ Christmas Day.', 'in', 'on', 'at', 'by', 'B', 'Ngày lễ cụ thể (Christmas Day) → on. (Nhưng "at Christmas" khi nói chung)');
  await insertQuiz(prep, 'She arrived ___ the airport ___ 6 PM.', 'in / on', 'at / at', 'on / in', 'at / in', 'B', 'Địa điểm cụ thể → at the airport. Giờ → at 6 PM.');

  console.log('  Prepositions seeded');

  // 10. GERUNDS & INFINITIVES
  const cat10 = await insertCategory('Gerunds & Infinitives', 'Danh động từ & Nguyên mẫu', '🔤', 9);
  const gi = await insertTopic(cat10, 'Gerunds & Infinitives', 'V-ing vs To + V: quy tắc và danh sách động từ', `
<h3>Động từ theo sau bởi V-ing (Gerund)</h3>
<p>
<b>enjoy, avoid, finish, mind, suggest, keep, practice, consider, imagine, deny, risk, miss, delay, quit, admit, recall, resist, tolerate, involve, postpone</b>
</p>
<p>I <b>enjoy reading</b> books. | She <b>avoids eating</b> junk food. | He <b>finished writing</b> his essay.</p>

<h3>Động từ theo sau bởi To + V (Infinitive)</h3>
<p>
<b>want, need, decide, hope, expect, plan, agree, refuse, promise, learn, offer, pretend, seem, appear, manage, afford, deserve, fail, tend, wish</b>
</p>
<p>She <b>decided to study</b> abroad. | I <b>want to learn</b> English. | They <b>agreed to help</b>.</p>

<h3>Động từ dùng được CẢ HAI (nghĩa KHÁC nhau)</h3>

<ul><li><strong>Động từ</strong></li><li><strong>+ V-ing</strong></li><li><strong>+ To V</strong></li></ul>
<ul><li><b>remember</b></li><li>Nhớ ĐÃ LÀM: I remember <b>locking</b> the door.</li><li>Nhớ PHẢI LÀM: Remember <b>to lock</b> the door.</li></ul>
<ul><li><b>forget</b></li><li>Quên ĐÃ LÀM: I'll never forget <b>meeting</b> her.</li><li>Quên PHẢI LÀM: Don't forget <b>to call</b> me.</li></ul>
<ul><li><b>stop</b></li><li>Dừng làm gì: He stopped <b>smoking</b>.</li><li>Dừng lại để làm gì: He stopped <b>to smoke</b>.</li></ul>
<ul><li><b>try</b></li><li>Thử làm: Try <b>adding</b> more salt.</li><li>Cố gắng: Try <b>to finish</b> it.</li></ul>


<h3>Sau giới từ: LUÔN dùng V-ing</h3>
<p>I'm interested <b>in learning</b>. | She's good <b>at cooking</b>. | Thank you <b>for helping</b>.</p>`, 0);

  await insertQuiz(gi, 'She enjoys ___ (cook) Italian food.', 'cook', 'to cook', 'cooking', 'cooked', 'C', 'enjoy + V-ing. "enjoys cooking".');
  await insertQuiz(gi, 'I decided ___ (change) my job.', 'changing', 'to change', 'change', 'changed', 'B', 'decide + to V. "decided to change".');
  await insertQuiz(gi, 'He stopped ___ (smoke). Now he is healthier.', 'to smoke', 'smoking', 'smoke', 'smoked', 'B', 'stop + V-ing = dừng hẳn việc hút thuốc. "stopped smoking".');
  await insertQuiz(gi, 'Don\'t forget ___ (bring) your passport tomorrow.', 'bringing', 'to bring', 'bring', 'brought', 'B', 'forget + to V = quên phải làm gì (chưa làm). "Don\'t forget to bring".');
  await insertQuiz(gi, 'She is interested ___ (learn) Japanese.', 'to learn', 'learning', 'in learning', 'for learning', 'C', 'interested IN + V-ing. "interested in learning".');

  console.log('  Gerunds & Infinitives seeded');

  // 11. QUESTION TAGS
  const cat11 = await insertCategory('Question Tags', 'Câu hỏi đuôi', '❓', 10);
  const qt = await insertTopic(cat11, 'Question Tags', 'Câu hỏi đuôi: quy tắc và trường hợp đặc biệt', `
<h3>Quy tắc chính</h3>
<p>
Câu <b>khẳng định</b> → đuôi <b>phủ định</b><br>
Câu <b>phủ định</b> → đuôi <b>khẳng định</b>
</p>

<h3>Ví dụ theo từng dạng</h3>

<ul><li><strong>Câu chính</strong></li><li><strong>Đuôi</strong></li></ul>
<ul><li>She <b>is</b> a student,</li><li><b>isn't she</b>?</li></ul>
<ul><li>They <b>can't</b> swim,</li><li><b>can they</b>?</li></ul>
<ul><li>You <b>live</b> here,</li><li><b>don't you</b>?</li></ul>
<ul><li>He <b>didn't</b> call,</li><li><b>did he</b>?</li></ul>
<ul><li>She <b>has finished</b>,</li><li><b>hasn't she</b>?</li></ul>
<ul><li>You <b>won't</b> forget,</li><li><b>will you</b>?</li></ul>


<h3>Trường hợp đặc biệt</h3>
<p>• <b>I am</b> right, <b>aren't I</b>? (KHÔNG dùng "amn't I")</p>
<p>• <b>Let's</b> go, <b>shall we</b>?</p>
<p>• <b>Don't</b> touch that, <b>will you</b>?</p>
<p>• <b>Nobody</b> came, <b>did they</b>? (nobody = phủ định → đuôi khẳng định)</p>
<p>• <b>Everyone</b> is here, <b>aren't they</b>? (everyone → đại từ "they")</p>`, 0);

  await insertQuiz(qt, 'She is a doctor, ___?', 'isn\'t she', 'is she', 'doesn\'t she', 'does she', 'A', 'Khẳng định (is) → đuôi phủ định: isn\'t she.');
  await insertQuiz(qt, 'You can\'t drive, ___?', 'can\'t you', 'can you', 'do you', 'don\'t you', 'B', 'Phủ định (can\'t) → đuôi khẳng định: can you.');
  await insertQuiz(qt, 'They went to Paris, ___?', 'didn\'t they', 'did they', 'don\'t they', 'weren\'t they', 'A', 'QKĐ khẳng định (went) → đuôi phủ định: didn\'t they.');
  await insertQuiz(qt, 'Let\'s go to the cinema, ___?', 'don\'t we', 'do we', 'shall we', 'will we', 'C', 'Trường hợp đặc biệt: Let\'s → shall we.');
  await insertQuiz(qt, 'Nobody called, ___?', 'didn\'t they', 'did they', 'didn\'t he', 'don\'t they', 'B', '"Nobody" = phủ định → đuôi khẳng định: did they.');

  console.log('  Question Tags seeded');

  // 12. SUBJECT-VERB AGREEMENT
  const cat12 = await insertCategory('Subject-Verb Agreement', 'Sự hòa hợp chủ-vị', '🤝', 11);
  const sva = await insertTopic(cat12, 'Subject-Verb Agreement', 'Sự hòa hợp giữa chủ ngữ và động từ', `
<h3>Quy tắc tổng hợp</h3>

<ul><li><strong>Chủ ngữ</strong></li><li><strong>Động từ</strong></li><li><strong>Ví dụ</strong></li></ul>
<ul><li>Everyone, someone, nobody, each, every</li><li><b>Số ít</b></li><li>Everyone <b>is</b> here.</li></ul>
<ul><li>Both, many, few, several</li><li><b>Số nhiều</b></li><li>Both <b>are</b> correct.</li></ul>
<ul><li>The news, mathematics, physics</li><li><b>Số ít</b></li><li>The news <b>is</b> good.</li></ul>
<ul><li>Either A or B / Neither A nor B</li><li><b>Theo B (gần nhất)</b></li><li>Neither he nor they <b>are</b> coming.</li></ul>
<ul><li>A number of + N</li><li><b>Số nhiều</b></li><li>A number of students <b>are</b> absent.</li></ul>
<ul><li>The number of + N</li><li><b>Số ít</b></li><li>The number of students <b>is</b> 50.</li></ul>


<h3>Ví dụ thêm</h3>
<p>Each student <b>has</b> a textbook. <i>(Mỗi sinh viên có một cuốn sách.)</i></p>
<p>Neither the teacher nor the students <b>were</b> happy. <i>(Chia theo SN gần nhất: students → số nhiều)</i></p>
<p>The United States <b>is</b> a big country. <i>(Tên nước → số ít dù có -s)</i></p>`, 0);

  await insertQuiz(sva, 'Everyone ___ ready for the exam.', 'is', 'are', 'were', 'have', 'A', 'Everyone → luôn đi với V số ít → is.');
  await insertQuiz(sva, 'The news ___ very surprising.', 'is', 'are', 'were', 'have been', 'A', '"news" tuy có -s nhưng là DT không đếm được → V số ít: is.');
  await insertQuiz(sva, 'Neither she nor her friends ___ coming to the party.', 'is', 'are', 'was', 'has', 'B', 'Neither...nor → chia theo CN gần nhất: "friends" (số nhiều) → are.');
  await insertQuiz(sva, 'A number of employees ___ absent today.', 'is', 'are', 'was', 'has', 'B', '"A number of + N" → số nhiều → are. (≠ "The number of" → số ít)');
  await insertQuiz(sva, 'The number of students in this class ___ 35.', 'is', 'are', 'were', 'have', 'A', '"The number of..." → một con số cụ thể → số ít → is.');

  console.log('  Subject-Verb Agreement seeded');

  console.log('\n🎉 All grammar data reseeded with DETAILED content!');
  process.exit(0);
}

clearAndReseed().catch(err => { console.error('', err.message); process.exit(1); });

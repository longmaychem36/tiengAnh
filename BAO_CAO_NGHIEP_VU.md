# TÀI LIỆU MÔ TẢ NGHIỆP VỤ HỆ THỐNG (BUSINESS REQUIREMENTS)
**Tên dự án:** Nền tảng Học Tiếng Anh Tương Tác (English Learning Platform)

---

## I. MỤC TIÊU HỆ THỐNG
Hệ thống được xây dựng nhằm cung cấp một môi trường học tiếng Anh toàn diện, kết hợp giữa việc học lý thuyết (khóa học, từ vựng, ngữ pháp) và thực hành (làm bài test, chơi game). Hệ thống đặc biệt chú trọng vào yếu tố Gamification (Trò chơi hóa) để kích thích và duy trì động lực học tập của học viên thông qua hệ thống điểm kinh nghiệm (EXP), thăng cấp (Level) và thành tựu (Achievements).

---

## II. DANH SÁCH QUYỀN VÀ VAI TRÒ (USER ROLES)

Hệ thống được thiết kế với 3 nhóm người dùng chính tương tác với các phạm vi khác nhau:

### 1. Khách (Guest - Người dùng chưa đăng nhập)
*   **Mô tả:** Người dùng truy cập vào ứng dụng nhưng chưa có tài khoản hoặc chưa đăng nhập.
*   **Quyền hạn nghiệp vụ:**
    *   Xem trang chủ (Landing Page/Home).
    *   Xem giới thiệu về nền tảng và các tính năng nổi bật.
    *   Thực hiện nghiệp vụ **Đăng ký (Register)** và **Đăng nhập (Login)**.
*   **Hạn chế:** Không được phép truy cập vào các nội dung học tập, chơi game, tra cứu từ điển hay quản lý thông tin.

### 2. Học viên (User / Member)
*   **Mô tả:** Người dùng đã có tài khoản và đăng nhập thành công. Đây là đối tượng sử dụng chính của hệ thống.
*   **Quyền hạn nghiệp vụ:**
    *   **Học tập:** Xem danh sách các khóa học (Courses), tham gia vào bài giảng (Lessons) bao gồm đọc lý thuyết, xem video và Audio.
    *   **Ngữ pháp (Grammar):** Học lý thuyết ngữ pháp chi tiết theo 12 chủ đề đa dạng, làm bài trắc nghiệm (Quiz) sát với lý thuyết vừa học để củng cố kiến thức.
    *   **Tra cứu (Dictionary):** Tìm kiếm từ vựng tiếng Anh, xem phát âm chuẩn, từ loại, định nghĩa (tiếng Việt/Anh), ví dụ minh họa và nghe audio phát âm.
    *   **Flashcard & Bộ sưu tập:** Lưu trữ từ vựng đã tra cứu vào các Bộ sưu tập (Collections) cá nhân để ôn tập lại.
    *   **Trò chơi (Mini Games):** Tham gia 4 loại hình game (Trắc nghiệm, Nghe hiểu, Gõ từ, Ghép cặp) để luyện phản xạ tiếng Anh.
    *   **Gamification (Tiến trình học):** Tích lũy điểm EXP sau mỗi lần hoàn thành bài học, quiz hoặc chơi game; tự động lên cấp (Level-up) khi đủ điểm; theo dõi chuỗi ngày học liên tục (Streak) và nhận huy hiệu thành tựu (Achievements).
    *   **Quản lý cá nhân:** Xem thống kê học tập (Dashboard/Progress) và cập nhật thông tin cá nhân.

### 3. Quản trị viên (Admin)
*   **Mô tả:** Nhân sự quản trị nội dung của hệ thống, có đặc quyền cao nhất để vận hành nền tảng.
*   **Quyền hạn nghiệp vụ:**
    *   **(Bao gồm toàn bộ quyền của Học viên).**
    *   **Quản lý Khóa học (Course Management):** Thêm mới, chỉnh sửa, xóa và xuất bản các khóa học.
    *   **Quản lý Bài giảng (Lesson Management):** Quản trị nội dung chi tiết của từng khóa học, cấu trúc các bài giảng, upload file đính kèm hoặc media (Video, Audio).
    *   **Bảng điều khiển Admin (Dashboard):** Bao gồm thanh điều hướng (Sidebar) riêng biệt với các công cụ kiểm soát dữ liệu hệ thống (truy cập CMS nội bộ).

---

## III. CHI TIẾT CÁC LUỒNG NGHIỆP VỤ (BUSINESS FLOWS)

### 1. Luồng Xác thực (Authentication Flow)
*   **Đăng ký:** Guest nhập các thông tin cơ bản (Username, Email, Password). Hệ thống kiểm tra tính hợp lệ (độ mạnh mật khẩu, trùng lặp Email), tạo bản ghi user trong DB (mặc định role = `user`), và khởi tạo hồ sơ **Gamification** (Level 1, 0 EXP) ở bảng `UserStats`.
*   **Đăng nhập:** Guest nhập Email và Password hợp lệ. Hệ thống đối chiếu dữ liệu, sinh ra chuỗi mã hóa bảo mật JWT (JSON Web Token), cấp quyền truy cập và chuyển hướng tới trang Dashboard cá nhân.

### 2. Luồng Học Tập (Learning Flow)
*   **Bước 1: Chọn khóa học.** User truy cập mục **Courses**, duyệt qua các danh mục.
*   **Bước 2: Học bài.** User chọn một bài giảng (Lesson). Hệ thống ghi nhận tiến độ mở bài học. User đọc hiểu lý thuyết, theo dõi video/audio media do Admin cung cấp.
*   **Bước 3: (Tương lai mở rộng)** Hoàn thành bài học, nhấn "Mark as Completed" để tích lũy % tiến trình khóa học.

### 3. Luồng Ngữ Pháp & Làm Test (Grammar & Quiz Flow)
*   **Bước 1: Chọn chuyên đề.** User vào mục **Grammar**, chọn chuyên đề lớn (VD: TENSES - Các thì).
*   **Bước 2: Đọc lý thuyết.** Mở một chủ đề cụ thể (VD: Hiện tại đơn). Nắm bắt cấu trúc, cách dùng, lỗi thường gặp, mẹo ghi nhớ.
*   **Bước 3: Thực hành Quiz.** User nhấn "Làm bài test". Giao diện chuyển sang màn hình câu hỏi trắc nghiệm tương tác:
    *   Chọn đáp án A, B, C, D.
    *   Hệ thống chấm điểm theo thời gian thực: Hiện tick Xanh/Đỏ ngay lập tức.
    *   Hiển thị lời giải thích chi tiết trực tiếp bên dưới câu trả lời.
*   **Bước 4: Kết quả.** Hoàn thành bộ câu hỏi, hệ thống tổng kết % câu đúng, động viên bằng hệ thống biểu tượng (Tốt/Khá/Cố gắng).

### 4. Luồng Tra Cứu và Lưu Từ Vựng (Dictionary & Collection Flow)
*   **Bước 1: Tra từ.** User nhập từ vào ô tìm kiếm ở trang **Dictionary**.
*   **Bước 2: Xử lý dữ liệu.** Backend kết nối song song với các API bên thứ 3 (Free Dictionary API, MyMemory Translation API) để gom trọn mọi thông tin từ ngữ nghĩa, âm thanh, đến dịch chuẩn xác về Frontend.
*   **Bước 3: Lưu trữ.** Tại màn hình kết quả từ vựng, User nhấn "Save". Hộp thoại hiện ra yêu cầu chọn Bộ sưu tập (Collection) muốn lưu (hoặc tạo mới bộ sưu tập). Từ vựng sẽ được ánh xạ vào bộ sưu tập đó để lưu giữ.

### 5. Luồng Trò Chơi Hóa (Gamification & Mini-games Flow)
Đây là nghiệp vụ vòng lặp cốt lõi tạo sự gắn kết với User.
*   **Bước 1: Bắt đầu ván chơi.** User vào trang **Mini Games**. Lựa chọn một mini game (VD: Word Match - Nối từ).
*   **Bước 2: Tương tác gameplay.** Giao diện hiện đếm ngược thời gian và danh sách câu hỏi kéo từ Database dựa vào loại trò chơi (Multiple Choice, Typing, Listening,...). Phía User thao tác gửi câu trả lời.
*   **Bước 3: Gửi kết quả (Submit Session).** Hết giờ hoặc trả lời hết, Frontend tổng hợp danh sách câu trả lời gửi về `POST /games/submit`.
*   **Bước 4: Xử lý nghiệp vụ backend.**
    1.  Khớp đáp án với DB → Tính phần trăm chính xác (Score).
    2.  Dựa theo kết quả (chuẩn mức > 80% hoặc qua màn) → Tính ra số EXP (Điểm kinh nghiệm) thưởng cho user.
    3.  Lưu Session điểm vào DB (bảng `UserGameSession`).
*   **Bước 5: Kích hoạt Trigger Hệ thống cày cấp (Level-up):**
    1.  Cộng EXP vào bảng `UserStats`.
    2.  Kiểm tra mốc kinh nghiệm giới hạn theo cấp độ (Level Threshold). Nếu số EXP hiện tại => mốc nâng cấp, tự động thăng Level (+1).
*   **Bước 6: Kích hoạt Trigger Thành tựu (Check Achievements):**
    1.  Scan toàn bộ lịch sử chơi của User xem có thỏa mãn logic thành tựu nào ẩn chưa mở khóa hay không (VD: Vừa hoàn thành đúng 100% ván đầu tiên -> Mở khóa "Perfect Score", Đạt level 10 -> Mở khóa "Rising Star").
    2.  Lưu các danh hiệu mới đạt vào DB `UserAchievements`.
*   **Bước 7: Trả phản hồi.** Gửi toàn bộ dữ liệu (Điểm, EXP tăng lên, Level hiện tại, Danh hiệu vừa lấy được) về cho màn hình hiển thị hoạt ảnh vinh danh.

### 6. Luồng Quản Trị Tổ Chức Nội Dung (Content Management System)
*   **Khu vực:** Dành riêng Admin (`/admin/...`).
*   **Bảo vệ:** Lớp Middleware kiểm tra cẩn thận Token và trường `role === 'admin'`. Nếu là User bình thường truy cập, lập tức trả mã 403 Forbidden và điều hướng ra ngoài.
*   **Nghiệp vụ:** Admin thao tác Bảng biểu (Data Table). Nhấn nút Thêm/Sửa/Xóa Khóa học. Backend lắng nghe và thực hiện các transaction an toàn thay đổi cơ sở dữ liệu. Admin có thể định cấu trúc Media tĩnh (Ảnh Thumbnail, Audio), tập tin sẽ được đẩy qua Multer để lưu vĩnh viễn trong server backend/uploads.

---

## IV. TÍNH KHẢ THI VÀ LỢI ÍCH ỨNG DỤNG
*   Về phía Tổ chức/Trung tâm: Giúp dễ dàng đóng gói, xây dựng khóa học một cách bảo mật.
*   Về phía Học viên: Tiếp cận dễ dàng, không bị nhàm chán như đọc sách tĩnh truyền thống mà thay bằng tương tác hai chiều, cảm nhận được thành quả rõ rệt biểu diễn ngay lập tức qua điểm EXP và Level cá nhân. Giải phẫu trực quan những cấu trúc ngữ pháp khó. Mở rộng kho tàng từ vựng theo nhu cầu cá nhân.

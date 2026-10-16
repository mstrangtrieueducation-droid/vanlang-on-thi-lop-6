# Hành trình 15 game Văn Lang

Game 1 giữ bộ khung ba lô–tàu–cửa đã có. Game 2–15 dùng `engine.js` trong thư mục này: 14 game mới, 149 hoạt động, tám cơ chế: lật thẻ ghép cặp, phân loại kéo/chạm, giỏ hàng nhiều đáp án, xây câu, xếp sự kiện, điều khiển bản đồ, tìm/sửa từ sai và chọn đáp án theo tình huống.

## Nội dung và đường dẫn

`content.cjs` là nguồn biên tập duy nhất. Dựa trên `vanlang-11-12-20260914/sources/theory2.json` đến `theory12.json`; câu hỏi mới là bài luyện ứng dụng, không phải bản chép toàn bộ tài liệu lý thuyết. Mỗi game tuần có 10–11 hoạt động; lật thẻ/phân loại có nhiều lượt tương tác trong một hoạt động. Mỗi game tổng ôn có 12 hoạt động, gồm ít nhất một hoạt động của từng tuần thuộc phạm vi.

| Game | Tuần | Thế giới |
|---|---|---|
|2|2|Học viện bí mật|
|3|3|Đảo câu lạc bộ|
|4|4|Nhà thiết kế nhí|
|5|5|Quán ăn cầu vồng|
|6|6|Biệt đội sức khỏe|
|7|7|Thành phố tìm đường|
|8|8|Trạm thời tiết lễ hội|
|9|9|Safari cứu hộ|
|10|10|Cỗ máy thời gian|
|11|11|Thành phố nghề nghiệp|
|12|12|Xưởng phim cổ tích|
|13|1–4|Kho báu khởi hành|
|14|1–8|Đại hội nhà thám hiểm|
|15|1–12|Lâu đài Văn Lang|

`hanh-trinh/` xếp theo thứ tự 1,2,3,4,13,5,6,7,8,14,9,10,11,12,15. Đường mòn có số chặng 1–15, kèm mã game để phân biệt ba bài tổng ôn. Hoàn thành chặng trước mở chặng sau; những game đã có tiến độ từ phiên bản cũ vẫn mở để không chặn bài đang học. Từng nhiệm vụ trong game cũng mở tuần tự. Không tự gửi kết quả về giáo viên hay máy chủ. Các game tổng ôn tái sử dụng hoạt động theo phạm vi tuần; không phải bộ đề kiểm tra độc lập.

## Biên tập / xuất bản

1. Sửa `content.cjs` và rà đáp án, ngữ cảnh, giải thích.
2. Chạy `node game-kit/adventures/build.cjs`. Tạo lại config/data/HTML của game 2–15, catalog và manifest âm thanh. Chỉ chạy trong repository này; công cụ chủ động ghi lại các đầu ra này.
3. Chạy `python game-kit/adventures/record.py` với edge-tts 7.3.1. Bản ghi Jenny en-US, tốc độ -3%, được lưu thành MP3 tĩnh theo hash. Không cần Python, TTS service hay backend khi học sinh chơi. Kiểm tra thêm từ đồng tự/âm cuối nếu thêm nội dung.
4. Chạy `node --test game-kit/adventures/validate.test.cjs game-kit/tests/content.test.cjs`.
5. Thử giao diện qua trình duyệt, sau đó commit/push các đầu ra và mã nguồn cần thiết lên GitHub Pages. Đổi version query khi cập nhật engine/style/data sau lần xuất bản đầu.

`make-qa.cjs`, `patch-integration.cjs`, `finish-audio.cjs` và thư mục `tu-luyen-qa-adventures/` là công cụ làm việc cục bộ; không nằm trong bản xuất bản. Không chạy lại các script vá một lần.

## Hành vi chung

- Đếm 5–1 trước khi vào game; mặc định không giới hạn giờ, tùy chọn thử thách 10 phút.
- Câu đọc hiểu: đọc ngữ cảnh bằng giọng nữ, tự hiện câu hỏi rồi đọc câu hỏi, không có nút Show question. Lỗi audio/tắt tiếng vẫn cho phép làm bài. Listen hỗ trợ tạm dừng/tiếp tục.
- Sai: rung nhẹ, khích lệ bằng tiếng Anh, ghi câu vào luyện lại. Không trừ mạng. Lật cặp chưa khớp không bị tính sai kiến thức vì học sinh đang khám phá thẻ úp.
- Đúng: sao/confetti và hợp âm Web Audio. Đúng liên tiếp có combo. Hoàn thành toàn bộ hoạt động mới được mở rương nhận huy hiệu.
- Lưu từng bước trong giỏ, thứ tự thẻ, thẻ đã ghép, nhóm đã phân loại và vị trí trên bản đồ. Câu đúng không cộng điểm trùng khi chơi lại.
- Tên và tiến độ tách theo hồ sơ đã xác thực bằng bộ đọc profile dùng chung. Link chuyển game giữ tên/lớp từ hồ sơ đang mở, không lấy một tên cũ từ localStorage.
- Desktop có khung bo tròn; điện thoại dọc bố trí một cột và cuộn tự nhiên. Bối cảnh rừng và các nhân vật là ảnh render 3D tạo bằng image_gen; lá, ánh nắng, hạt sáng và nhân vật có hoạt ảnh CSS, không phải mô hình WebGL.
- Cô giáo Cáo đeo kính, mặc polo navy cộc tay có cổ và logo vàng trung tâm trên ngực trái. Ba biểu cảm dùng chung một sprite trong `teacher-fox-uniform.webp`. Thỏ, sóc, gấu, chim đeo khăn đỏ có sao vàng ở `forest-pupils.webp`. Nền là `forest-bg.webp`. Prompt gốc lưu ở `forest-prompts.txt` và `uniform-prompt.txt`.
- Trắc nghiệm có bốn lựa chọn A–B–C–D đã rà đáp án gây nhiễu. Sai hiện đỏ/rung, đúng hiện xanh và nhân vật ăn mừng. Các kiểu chơi khác giữ tương tác riêng.
- Hoàn thành nhận 1–3 sao: 3 sao khi không còn câu cần luyện lại; 2 sao khi số câu cần luyện không quá một phần tư; còn lại 1 sao. Chưa hoàn thành là 0 sao. Luyện lại đúng có thể nâng sao. Bộ quy tắc nằm ở `rules.js` và được kiểm tra tự động.
- Hỗ trợ thao tác chuột, chạm chọn đích, kéo thả phân loại, bàn phím Tab/Enter và phím mũi tên ở màn bản đồ; tôn trọng reduced-motion.

## Điểm cần giữ khi ra câu mới

Không ép chỉ một đáp án khi có hai cách nói đúng. `like + to V` có thể đúng; dùng enjoy để kiểm tra V-ing. Câu hỏi danh từ/động từ cần đủ ngữ cảnh. -ed phân loại theo âm cuối, không theo chữ cuối. So sánh hơn không áp dụng máy móc “hai âm tiết trở lên dùng more”. Dùng because/but/or theo phạm vi tuần 8. Tránh câu phân biệt âm phụ thuộc giọng Anh–Anh/Anh–Mỹ khi bản đọc là en-US.

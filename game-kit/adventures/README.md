# Phiên bản trắc nghiệm — rừng ngày/đêm

15 level được đặt tên Thử thách 1–15 theo thứ tự bản đồ. Tất cả 292 câu đều có đúng bốn lựa chọn, một đáp án. Bỏ giao diện kéo thả, ba lô và xếp tàu. Bấm level từ bản đồ tự đếm 3–2–1, hiện BẮT ĐẦU rồi vào bài.

Nguồn: `content.cjs` và nội dung gốc Game 1 trong `tu-luyen-1/data.js`; `quiz-content.cjs` chuyển thành các câu ABCD. Mỗi cặp/thẻ phân loại trở thành một câu riêng để giữ nội dung. `sourceId` dùng để chuyển tiến độ cũ sang những câu tương đương. Game 1 được nạp từ `quiz-data.js`; file data cũ chỉ dùng làm nguồn biên tập.

Chạy `node game-kit/adventures/build.cjs`, rồi `python game-kit/adventures/record.py`. Bộ giọng nữ Jenny en-US được lưu MP3 tĩnh; không cần dịch vụ giọng nói khi chơi. Nếu âm thanh bị trình duyệt chặn, học sinh bấm Listen.

Kiểm tra: `node --test game-kit/adventures/quiz.test.cjs`. Các kiểm thử phiên bản đa cơ chế trước đây là kiểm thử nguồn cũ, không phải tiêu chí nghiệm thu UI hiện tại.

`day-night.js` lưu lựa chọn ngày/đêm trên thiết bị và dùng chung với nút tập trung trong bài. Bướm/ong là CSS, đom đóm có ánh sáng nhấp nháy; reduced-motion tắt chuyển động. Rừng và nhân vật là ảnh render 3D kèm chuyển động CSS, không phải mô hình 3D WebGL.

`forest-pupils-seated.webp` tạo bằng công cụ image_gen tích hợp, nền trong suốt, chuyển WebP để giảm tải. Prompt được lưu ở `seated-pupils-prompt.txt`. Cô giáo giữ polo navy cộc tay.

## Cập nhật Titi và cây táo
- Một cô giáo Titi duy nhất trong header góc trên trái; không có nhân vật lặp ở bản đồ, hộp thoại hoặc màn hoàn thành.
- `forest-classroom-bg.webp` là ảnh nền có học sinh hòa trong cảnh rừng, tạo bằng image_gen ở chế độ chỉnh ảnh. Không dùng các cutout học sinh rời. Prompt ở `forest-classroom-prompt.txt`.
- `apple-timer.js`: 0% nảy mầm, 20% cây nhỏ, 35% hoa, 50% táo, 100% táo rụng vào giỏ. Phần trăm là thời gian đã trôi qua, không phải số câu đã làm. Mặc định bài mới bật 10 phút; vẫn giữ lựa chọn không giới hạn và trạng thái bài cũ. Hết giờ có thể tiếp tục không giới hạn mà không mất đáp án.
- Khi kết thúc bài, hiện giỏ táo và thông báo hoàn thành; kết thúc thời gian không tự đánh dấu các câu chưa làm là hoàn thành.
- Chỗ điền từ `___` phát hai nốt nhẹ + khoảng lặng 0,75 giây. `record.py` tách câu thành đoạn âm thanh và chèn `gap-cue.wav`. Trình phát hỗ trợ Pause/Listen xuyên các đoạn; giọng dự phòng thay ký tự gạch dưới bằng dấu ba chấm. Từ “blank” trong nội dung thật như “blank pages” vẫn được đọc đúng nghĩa.

### Cây táo nổi khối
SVG dùng gradient, bóng đổ và điểm sáng; tán lá đung đưa nhẹ. `AppleTimer.update()` thay CSS variables trên cùng cây SVG ở mỗi nhịp đồng hồ để tránh khởi tạo lại hoạt ảnh. Năm quả rơi lệch nhau 650 ms, vào miệng giỏ; táo trong giỏ xuất hiện theo lần chạm, giỏ nảy và phát âm thanh nhỏ nếu bật âm. Chế độ giảm chuyển động hiển thị giỏ đầy ngay, không ép chạy hoạt ảnh.

### Cây táo di chuyển và giọng dẫn bài
Cây trượt từ trái sang phải theo thời gian đã trôi qua, với CSS variable --travel từ 0 đến 250 đơn vị SVG; tán cây lớn liên tục và quả xuất hiện từ giữa giờ. Giỏ cố định ở cuối đường đi. Chế độ giảm chuyển động cập nhật vị trí trực tiếp. Titi ở màn chờ và bản đồ có hào quang, chuyển động chào; vẫn chỉ có một nhân vật ở góc trên trái.

Giọng nữ đọc yêu cầu, nghỉ 500 ms, đọc ngữ cảnh, nghỉ 500 ms rồi đọc câu hỏi. build.cjs tạo narration-keys.json; record.py chèn tệp WAV im lặng vào chuỗi clip để Pause/Listen và tắt tiếng hoạt động xuyên khoảng nghỉ. Đúng: Excellent! / Great job!, hợp âm và sao bay. Sai: Oh no… — nghỉ 300 ms — Let’s try it again!, kèm ba nốt động viên nhẹ. Chuyển câu hoặc tắt tiếng hủy lời và chuỗi nốt đang phát.

### Biểu cảm và giọng phản hồi Titi
`teacher-titi-emotions.webp` là ảnh sprite 3 cột trong suốt, chỉnh từ tạo hình đã duyệt bằng built-in image_gen (prompt: `titi-emotions-prompt.txt`). Giữ kính, polo navy cộc tay, váy navy và logo ngực. Ba pose: chào thân thiện, cười giơ ngón cái, xòe tay tiếc nuối. CSS bổ sung nhún mừng, nghiêng đầu và gật nhẹ; tôn trọng reduced-motion.

Khi phản hồi, cùng một Titi tạm nổi ở góc trên trái, vẫn nhìn thấy khi học sinh cuộn xuống đáp án. Header giữ chỗ để không nhảy bố cục. Sau lời thoại, cô về vị trí ban đầu. Không tạo bản sao mascot. Sai: pose tiếc nuối trong clip Oh no… và khoảng nghỉ 300 ms, đổi sang pose chào ấm áp đúng khi clip It's okay… bắt đầu. Tắt âm vẫn có chuỗi biểu cảm; chuyển câu/tắt âm/mở hộp thoại hủy phản hồi cũ.

`feedback-voices.json` cấu hình bốn clip Jenny en-US riêng: lời khen nhanh/sáng hơn, tiếc nuối chậm/trầm/nhẹ hơn, động viên ấm và rõ. Đây là điều chỉnh prosody (rate, pitch, volume, punctuation), không dùng nhãn emotional-style SSML. Cache filename tính cả thông số giọng, nên đổi sắc thái sẽ thu clip mới. Giọng đọc câu hỏi giữ nguyên. SpeechSynthesis dự phòng dùng rate/pitch tương ứng và ngắt 300 ms; âm sắc dự phòng tùy giọng tiếng Anh trên thiết bị.

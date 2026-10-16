# Phiên bản trắc nghiệm — rừng ngày/đêm

## Bản hiện hành: Titi chibi và lá chuối (chibi-9)

Các mô tả vị trí mascot và thời gian nghỉ ở phần lịch sử bên dưới được thay thế bằng cấu hình này:

- Màn chờ có một Titi chibi lớn bên cạnh nút bắt đầu. Trong bài, một Titi đứng ở cột trái 1/3; câu hỏi và đáp án ở cột phải 2/3. Dưới 600px, Titi và lời nhắn thu gọn phía trên câu hỏi để chữ và vùng chạm đủ lớn.
- `chibi.css`, `banana-leaf.svg`, `banana-answer.svg`: lá xanh nổi khối; đúng đổi thành chuối vàng, sai héo/rũ; phản hồi có sao, âm thanh và biểu cảm. Không thay đổi dữ liệu câu hỏi hay khóa lưu tiến độ.
- `teacher-titi-chibi.webp`: sprite ba tư thế, được chỉnh từ Titi đã duyệt bằng công cụ image_gen tích hợp; prompt lưu ở `titi-chibi-prompt.txt`. Giữ kính, áo polo navy cộc tay và váy navy.
- Câu hỏi và bốn đáp án hiện ngay, luôn cho chọn khi đang đọc. Chọn đáp án hoặc chuyển câu hủy chuỗi lời đọc cũ; chỉ khóa bốn lựa chọn sau khi trả lời đúng.
- `pacing-audio.js` nạp sau `audio-map.js`, thay toàn bộ lời đọc hiện dùng bằng 285 bản MP3 tĩnh. Jenny en-US đọc mặc định +4%; từng cụm giữ dấu câu để duy trì ngữ điệu hỏi/cảm thán. Chèn khoảng lặng PCM 150ms ở dấu phẩy và 200ms ở hết câu/xuống dòng. Các chỗ `___` giữ tín hiệu điền từ không lời. MP3 và cơ chế phát của trình duyệt có thể thêm độ trễ nhỏ giữa hai tệp riêng.
- Lời khen nhanh/sáng hơn; “Oh no…” trầm hơn, sau đó động viên. Đây là giọng tổng hợp neural, không phải diễn viên thu âm. SpeechSynthesis là dự phòng và chất giọng phụ thuộc thiết bị.

Khi bổ sung câu hỏi: chạy `node game-kit/adventures/build.cjs`, rồi `python game-kit/adventures/record-pacing.py` (cần edge_tts, numpy, imageio_ffmpeg). Bộ tạo giữ bản ghi từng cụm trong thư mục tạm để tái sử dụng. `pacing-audit.json` lưu thông số khoảng nghỉ của từng bản ghi. Không cần backend khi chơi.

Kiểm tra hiện hành: `node --test game-kit/adventures/quiz.test.cjs game-kit/adventures/pacing.test.cjs`. Kiểm thử quiz cũng kiểm tra dữ liệu/âm thanh cũ còn lưu để tương thích; kiểm thử pacing kiểm tra lớp ghi đè đang dùng. Đã kiểm tra trình duyệt ở 390×844, 844×390 và màn hình máy tính, gồm chọn đáp án trong khi nút âm thanh đang báo Pause.

## Nền tảng và lịch sử thay đổi

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

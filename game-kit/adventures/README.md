# Phiên bản trắc nghiệm — rừng ngày/đêm

15 level được đặt tên Thử thách 1–15 theo thứ tự bản đồ. Tất cả 292 câu đều có đúng bốn lựa chọn, một đáp án. Bỏ giao diện kéo thả, ba lô và xếp tàu. Bấm level từ bản đồ tự đếm 3–2–1, hiện BẮT ĐẦU rồi vào bài.

Nguồn: `content.cjs` và nội dung gốc Game 1 trong `tu-luyen-1/data.js`; `quiz-content.cjs` chuyển thành các câu ABCD. Mỗi cặp/thẻ phân loại trở thành một câu riêng để giữ nội dung. `sourceId` dùng để chuyển tiến độ cũ sang những câu tương đương. Game 1 được nạp từ `quiz-data.js`; file data cũ chỉ dùng làm nguồn biên tập.

Chạy `node game-kit/adventures/build.cjs`, rồi `python game-kit/adventures/record.py`. Bộ giọng nữ Jenny en-US được lưu MP3 tĩnh; không cần dịch vụ giọng nói khi chơi. Nếu âm thanh bị trình duyệt chặn, học sinh bấm Listen.

Kiểm tra: `node --test game-kit/adventures/quiz.test.cjs`. Các kiểm thử phiên bản đa cơ chế trước đây là kiểm thử nguồn cũ, không phải tiêu chí nghiệm thu UI hiện tại.

`day-night.js` lưu lựa chọn ngày/đêm trên thiết bị và dùng chung với nút tập trung trong bài. Bướm/ong là CSS, đom đóm có ánh sáng nhấp nháy; reduced-motion tắt chuyển động. Rừng và nhân vật là ảnh render 3D kèm chuyển động CSS, không phải mô hình 3D WebGL.

`forest-pupils-seated.webp` tạo bằng công cụ image_gen tích hợp, nền trong suốt, chuyển WebP để giảm tải. Prompt được lưu ở `seated-pupils-prompt.txt`. Cô giáo giữ polo navy cộc tay.

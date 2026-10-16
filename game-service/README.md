# Bảng xếp hạng và thách đấu Văn Lang

## Trạng thái

Đã có mã nguồn và kiểm thử trên máy cục bộ. **Chưa triển khai máy chủ online**; `dau-truong/config.js` để trống API có chủ ý. Trang công khai hiển thị cách chơi và trạng thái chờ kết nối, không dùng điểm/bạn chơi giả. Không có dữ liệu học sinh thật trong bộ thử nghiệm.

## Luồng sử dụng

1. Cô đăng nhập trang `dau-truong/admin.html` bằng mã quản trị, cấp mã riêng cho mỗi biệt danh. Không dùng họ tên đầy đủ, ngày sinh hay số điện thoại.
2. Học sinh nhập mã tại `dau-truong/`. Dùng cùng mã trên thiết bị khác để vào đúng tài khoản. Mã phòng đấu khác với mã học sinh; chỉ chia sẻ mã phòng với bạn.
3. **Tính hạng:** chọn một trong 15 game, làm trọn đề trong 10 phút. Mỗi câu chỉ tính lần chọn đầu; 10 điểm/câu. Máy chủ giữ thứ tự câu, kiểm tra đáp án và đo giờ, không tin điểm/thời gian do trình duyệt gửi lên.
4. **Xếp hạng:** mỗi học sinh lấy kết quả tốt nhất của từng game trong kỳ, cộng điểm và thời gian các lượt đó. Điểm cao đứng trước, bằng điểm xét thời gian ngắn hơn. Tuần bắt đầu thứ Hai, tháng theo lịch Việt Nam (UTC+7). Lượt tự luyện offline trước đây không được nhập vào bảng hạng vì không thể xác minh.
5. **PVP:** tạo hoặc nhập mã phòng 8 ký tự; tối đa hai học sinh; cả hai sẵn sàng rồi đồng loạt bắt đầu sau 3 giây. Cùng 10 câu lấy từ game được chọn, giới hạn 3 phút. Thanh tiến độ cập nhật qua máy chủ mỗi giây (không phải WebSocket). Đúng nhiều hơn thắng, bằng điểm xét thời gian; bằng cả hai là hòa.
6. Thắng PVP nhận huy hiệu và 20 điểm thách đấu, tối đa một lần mỗi cặp bạn/tuần. Điểm này tách khỏi bảng tự luyện để không khuyến khích tạo phòng liên tục để cày hạng.
7. Mất mạng: đồng hồ phía máy chủ vẫn chạy; giữ trang để tự nối lại. Có thể nhập lại mã phòng khi phòng còn hiệu lực. Không bấm đi nơi khác khi đang gửi đáp án. Kết quả chỉ được xác nhận khi máy chủ trả lời.

## Thiết lập Cloudflare (chưa thực hiện)

Tạo một Worker riêng; không dùng cơ sở dữ liệu điểm/hồ sơ của các ứng dụng khác. Cần người sở hữu đăng nhập Cloudflare và chọn tài khoản. Không nâng gói trả phí tự động.

```sh
cd game-service
npx wrangler login
npx wrangler deploy
npx wrangler secret put ADMIN_SECRET
```

Đặt mã quản trị dài, ngẫu nhiên ở lệnh `secret put`; không ghi vào Git, HTML, URL hoặc config công khai. Worker dùng SQLite Durable Object `GameHub`, tài nguyên riêng của `vanlang-game-arena`. Trước khi đưa cho học sinh: xác nhận tài khoản/gói đang dùng, cấu hình giới hạn phù hợp, gọi `/health`, thử hai tài khoản thử và xóa dữ liệu thử, rồi điền URL HTTPS Worker vào `dau-truong/config.js` và phát hành lại GitHub Pages. Không gửi mã quản trị/mã học sinh qua URL.

Tài liệu chính thức: [SQLite Durable Objects và hạn mức](https://developers.cloudflare.com/durable-objects/platform/pricing/), [Wrangler deploy](https://developers.cloudflare.com/workers/wrangler/commands/#deploy), [Secrets](https://developers.cloudflare.com/workers/configuration/secrets/).

Giới hạn hiện tại: đây là game khuyến khích học tập, không phải hệ thống chống gian lận kỳ thi; đáp án tự luyện vẫn có trong mã nguồn tĩnh. Bảng hạng chỉ cho người có mã học sinh xem. Mã học sinh là bí mật đăng nhập; cần cô giữ riêng, chưa có màn tự khôi phục hoặc thu hồi mã. Lịch sử chi tiết của lượt/phòng lưu tối đa khoảng 24 giờ (dọn khi có truy cập); kết quả tốt nhất và biệt danh lưu dài hạn. Chưa có giao diện xóa/xuất hồ sơ nên phải hoàn thiện quy trình quản trị dữ liệu trước khi triển khai rộng.

## Kiểm thử

Node 24 (có `node:sqlite`):

```sh
node --test game-service/core.test.mjs game-kit/adventures/results.test.cjs
node game-service/local.mjs
```

Máy chủ thử chỉ nghe `127.0.0.1:8793`, dữ liệu trong RAM và mất khi tắt. Frontend ở `127.0.0.1:8792` tự dùng API thử. Mã quản trị thử là `local-test-only`, không được dùng cho triển khai thật. `questions.json` sinh từ `quiz-content.cjs`; giữ đồng bộ khi đổi đề. Cấu hình CORS production giới hạn origin GitHub của trung tâm.

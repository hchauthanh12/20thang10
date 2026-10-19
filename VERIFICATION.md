# Kết quả kiểm tra — 20/10/2026

Kiểm tra bằng Playwright với Microsoft Edge (Chromium), chạy website từ localhost.

- PASS: bốn lựa chọn trả đúng loài hoa và lời chúc trong dữ liệu.
- PASS: tải thực tế bốn file PNG, kiểm tra kích thước 1600 × 2000 px và dữ liệu ảnh; xem trực quan ảnh xuất.
- PASS: sao chép và đọc lại nội dung clipboard; thử thêm tình huống Clipboard API bị từ chối và fallback sao chép.
- PASS: trình duyệt thiếu Web Share sẽ sao chép nội dung; mô phỏng API chia sẻ thành công và người dùng hủy, nút hoạt động lại bình thường.
- PASS: không tràn ngang tại 320, 390, 768, 1024 và 1440 px; xem trực quan desktop và mobile.
- PASS: nút bắt đầu cuộn và focus lựa chọn đầu; Enter mở quà; Tab giữ focus trong hộp thoại; Escape đóng và trả focus về lựa chọn.
- PASS: bật prefers-reduced-motion không tạo cánh hoa và tắt các animation.
- PASS: mở index.html trực tiếp bằng file URL, chặn tải font ngoài, vẫn mở quà và tải PNG được.
- PASS: kiểm tra cú pháp JavaScript; không có lỗi JavaScript trên trang trong các luồng kiểm tra.

Giới hạn: chưa kiểm tra menu chia sẻ của hệ điều hành trên điện thoại vật lý; Web Share đã được kiểm tra ở mức lời gọi API bằng mô phỏng. Website không cần máy chủ ứng dụng; Clipboard và Web Share nâng cao phụ thuộc hỗ trợ và quyền của trình duyệt.

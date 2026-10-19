# BLOOM FOR YOU

Tiệm hoa và lời chúc tương tác cho Ngày Phụ nữ Việt Nam 20/10. Website tĩnh, HTML/CSS/JavaScript thuần, không cần build hay API.

## Chạy

Mở `index.html` trực tiếp, hoặc chạy `python -m http.server 4173 --bind 127.0.0.1` trong thư mục này và truy cập `http://127.0.0.1:4173`. Nên dùng localhost hoặc HTTPS để có Clipboard API và Web Share API khi trình duyệt hỗ trợ.

## Chỉnh sửa

- `data.js`: bốn nhu cầu, tên hoa, lời chúc và bảng màu.
- `app.js`: SVG hoa, luồng mở quà, tải PNG 1600 × 2000 px, sao chép và chia sẻ.
- `styles.css`: giao diện, responsive, focus và reduced motion.

Font Google là tùy chọn; khi offline, website dùng font hệ thống. Minh họa SVG, xuất ảnh và nội dung không phụ thuộc mạng. Nút chia sẻ mở bảng chia sẻ của thiết bị nếu hỗ trợ; trình duyệt khác sao chép toàn bộ lời chúc. Người dùng có thể tải PNG riêng để đính kèm vào tin nhắn.

## Kiểm tra thủ công

1. Bắt đầu nhận quà: cuộn tới và focus lựa chọn đầu tiên.
2. Chọn từng nhu cầu: nhận đúng hoa và nội dung tương ứng, không mở trùng khi bấm nhanh.
3. Tải PNG: kiểm tra ảnh đủ hoa, dấu tiếng Việt, lời chúc và dòng ngày 20.10.
4. Sao chép: dán vào trình soạn thảo; chia sẻ: thử trên thiết bị có Web Share và trình duyệt không hỗ trợ.
5. Đóng bằng nút, Escape, ngoài hộp thoại; nhận thêm quà; thử bàn phím và màn hình nhỏ.
6. Bật reduced motion trong hệ điều hành để tắt chuyển động.

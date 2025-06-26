Dự án "Cú Chăm Học" - Ứng dụng tạo câu hỏi bằng AI
Đây là dự án front-end cho ứng dụng "Cú Chăm Học", được xây dựng bằng ReactJS và làm giao diện với TailwindCSS.
Mục tiêu của dự án là sử dụng sức mạnh của mô hình ngôn ngữ Google Gemini để tự động tạo ra các bộ câu hỏi ôn tập theo chủ đề, định dạng và cấp độ khó do người dùng yêu cầu.
Các tính năng chính
Tạo bộ câu hỏi theo chủ đề: Người dùng nhập vào một chủ đề bất kỳ (ví dụ: "Lịch sử Việt Nam thế kỷ 20", "Các định luật Newton",...), hệ thống sẽ tạo ra các câu hỏi liên quan.
Tạo câu hỏi theo Form có sẵn: Cho phép người dùng đưa ra một cấu trúc câu hỏi và yêu cầu AI điền vào chỗ trống.
Phân loại độ khó: Mỗi câu hỏi được tạo ra sẽ được phân loại theo 3 cấp độ: Dễ, Trung bình, và Khó.
Giao diện hiện đại: Giao diện người dùng được thiết kế đơn giản, trực quan và đáp ứng tốt trên nhiều thiết bị nhờ TailwindCSS.
Công nghệ sử dụng
Front-end: ReactJS
Styling: TailwindCSS
AI / API: Google Gemini API
Hướng dẫn cài đặt và chạy dự án
Để chạy dự án này trên máy của bạn, hãy làm theo các bước sau:
1. Clone repository này về máy:
Generated bash
git clone <URL_REPOSITORY_CUA_BAN>
Use code with caution.
Bash
2. Di chuyển vào thư mục dự án:
Generated bash
cd ten-du-an
Use code with caution.
Bash
3. Cài đặt các thư viện cần thiết:
Lệnh này sẽ tải và cài đặt tất cả các dependencies được định nghĩa trong file package.json (bao gồm React, TailwindCSS,...).
Generated bash
npm install
Use code with caution.
Bash
4. Cấu hình API Key (Quan trọng):
Dự án cần có API Key từ Google Gemini để hoạt động.
Tạo một file mới ở thư mục gốc của dự án với tên là .env
Thêm dòng sau vào file .env và thay thế bằng key của bạn:
Generated code
REACT_APP_GEMINI_API_KEY='API_KEY_CUA_BAN_O_DAY'
Use code with caution.
5. Khởi chạy dự án:
Sau khi cài đặt xong, chạy lệnh sau để khởi động ứng dụng ở chế độ development.
Generated bash
npm start
Use code with caution.
Bash
Mở trình duyệt và truy cập vào http://localhost:3000 để xem ứng dụng. Trang sẽ tự động tải lại mỗi khi bạn lưu thay đổi trong mã nguồn.

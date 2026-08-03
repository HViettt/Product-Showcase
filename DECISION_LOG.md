# Decision Log

## [2026-08-03 18:00] Review code ban đầu
- Tình huống: Cần xác định các lỗi thật sự trong project trước khi sửa.
- Các phương án đã cân nhắc:
  1. Sửa ngay UI mà không kiểm tra build.
  2. Đọc toàn bộ source và verify bằng lint/build trước khi thay đổi.
- Quyết định: Chọn cách 2.
- Kết quả: Phát hiện blocker thực sự gồm missing router dependency, missing auth service/context files, duplicate export trong `ProductCard`, và type-only import issue.
- Prompt đã dùng: "Đọc toàn bộ project, xác định lỗi thật sự, không sửa trước khi có evidence."
- Kết quả AI trả về: AI liệt kê các blocker build/runtime và đề xuất sửa các file liên quan.
- Đánh giá của tôi: AI đúng ở phần phát hiện blocker, nhưng chưa đề cập đầy đủ Docker/doc requirement nên cần bổ sung thêm kiểm tra theo đề bài.

## [2026-08-03 19:20] Sửa Dockerfile / docker-compose
- Tình huống: Dockerfile và docker-compose đang trống, không thể đáp ứng requirement bắt buộc.
- Các phương án đã cân nhắc:
  1. Chỉ giữ nguyên Docker như hiện tại.
  2. Viết Dockerfile và compose để frontend + mock-api chạy cùng nhau.
- Quyết định: Chọn cách 2.
- Kết quả: Tạo `Dockerfile`, `docker-compose.yml`, `nginx.conf` và cấu hình frontend + mock-api trong cùng stack.
- Prompt đã dùng: "Cần đảm bảo Dockerfile và docker-compose đáp ứng requirement kỹ thuật, không sửa UI không cần thiết."
- Kết quả AI trả về: AI đề xuất cấu hình multi-stage build cho frontend và `mockoon/cli` container cho mock API.
- Đánh giá của tôi: AI đúng, vì đây là phần rỗng và cần bổ sung để project đạt chuẩn đề bài.

## [2026-08-04 09:30] Sửa breakpoint responsive
- Tình huống: Requirement yêu cầu `lg:` phải tương ứng 1280px, nhưng Tailwind v4 đang sử dụng breakpoint mặc định khác.
- Các phương án đã cân nhắc:
  1. Đổi toàn bộ `lg:` thành `xl:` trong code.
  2. Thêm `@theme` trong `src/index.css` để map `lg` về 1280px.
- Quyết định: Chọn cách 2 để giữ nguyên structure UI hiện có.
- Kết quả: Thêm `@theme { --breakpoint-lg: 1280px; }` để `lg:` đúng chuẩn 1280px trên toàn bộ project.
- Prompt đã dùng: "Sửa breakpoint responsive theo requirement mà không làm thay đổi cấu trúc UI hiện có."
- Kết quả AI trả về: AI khuyên dùng Tailwind v4 `@theme` block vì là cách tối thiểu và nhất quán.
- Đánh giá của tôi: AI đúng, vì không cần refactor toàn bộ className.

## [2026-08-04 10:10] Thêm Authorization interceptor
- Tình huống: Mọi request cần xác thực phải gửi JWT trong header, và 401 cần tự động logout + redirect login.
- Các phương án đã cân nhắc:
  1. Chỉ thêm token thủ công ở từng component.
  2. Thêm interceptor tại service layer để gắn header và xử lý 401 tập trung.
- Quyết định: Chọn cách 2.
- Kết quả: Thêm request/response interceptor vào `auth.service.ts` và `product.service.ts`, đọc token từ `localStorage`, gắn `Authorization: Bearer <token>` và redirect về `/login` khi 401.
- Prompt đã dùng: "Làm sao để tất cả request xác thực tự động đính token và tự logout khi API trả 401 mà không đổi business logic."
- Kết quả AI trả về: AI đề xuất dùng `axios.interceptors.request.use` và `axios.interceptors.response.use` trong service instance.
- Đánh giá của tôi: AI đúng, vì tránh lặp code và không chạm business logic của UI.

## [2026-08-04 10:40] Sửa README và file bắt buộc
- Tình huống: README đang chứa đường dẫn cá nhân tuyệt đối và chưa hỗ trợ hướng dẫn multi-platform.
- Các phương án đã cân nhắc:
  1. Để nguyên README.
  2. Bỏ đường dẫn cá nhân và viết hướng dẫn dùng cả PowerShell và bash.
- Quyết định: Chọn cách 2.
- Kết quả: README được cập nhật và có hướng dẫn general setup + run + Docker.
- Prompt đã dùng: "Cập nhật README để biến nó thành hướng dẫn setup/run tổng quát, không chứa đường dẫn cá nhân."
- Kết quả AI trả về: AI đề xuất format general `cd <path-to-project>` và dạng lệnh `bash`/PowerShell song song.
- Đánh giá của tôi: AI đúng. 

## [2026-08-04 05:10] Hiển thị thuộc tính màu sắc và chuẩn hóa ảnh placeholder
- Tình huống: Thuộc tính `color` dùng để lọc sản phẩm nhưng chưa được hiển thị trên UI. Ngoài ra, tham số `background=random` trong URL ảnh placeholder (UI-Avatars) ngẫu nhiên không tương xứng trực quan giữa các sản phẩm cùng loại.
- Các phương án đã cân nhắc:
  1. Chỉ ghi chú ảnh là placeholder ngẫu nhiên mà không sửa UI/mock data.
  2. Bổ sung hiển thị `color` vào `ProductCard` (thành 1 tag phụ cạnh tag chính) và `ProductDetailPage` (cạnh brand/category); đồng thời chuẩn hóa ảnh placeholder bằng cách gán màu nền tĩnh (background hex) theo từng `category` sản phẩm (ví dụ Laptop dùng màu Indigo, Smartphone dùng màu Cyan) để tăng tính nhất quán trực quan.
- Quyết định: Chọn phương án 2.
- Kết quả:
  - Cập nhật `ProductCard.tsx` hiển thị tag `Màu: {color}` cạnh tag gốc.
  - Cập nhật `ProductDetailPage.tsx` hiển thị badge `Màu sắc: {color}` cạnh brand.
  - Sửa `generate-mock.js` gán màu nền ảnh tĩnh theo category sản phẩm, chạy tạo lại dữ liệu, đồng bộ sang Mockoon thành công.

## Tổng kết
- Review ban đầu và sửa blocker thực sự đã hoàn tất.
- Dockerfile, docker-compose, README, APPROACH, DECISION_LOG đều đã được hoàn thiện theo yêu cầu.
- Frontend build/lint và dev server đã được verify bằng lệnh thực tế.

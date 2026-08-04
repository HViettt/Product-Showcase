# GEEK UP Product Showcase

Ứng dụng **Product Showcase** thực hiện cho bài Technical Assessment vị trí Frontend Developer tại GEEK UP. Ứng dụng gồm luồng Đăng nhập → Danh sách sản phẩm (Search + Filter) → Chi tiết sản phẩm → Đăng xuất, kết nối với Mock API tự thiết kế bằng Mockoon, đóng gói hoàn chỉnh bằng Docker.

## Mục lục

- [Tính năng](#tính-năng)
- [Tech Stack](#tech-stack)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Yêu cầu môi trường](#yêu-cầu-môi-trường)
- [Cài đặt & Chạy dự án](#cài-đặt--chạy-dự-án)
- [Chạy bằng Docker (khuyến nghị)](#chạy-bằng-docker-khuyến-nghị)
- [Tài khoản mock mặc định](#tài-khoản-mock-mặc-định)
- [Tái tạo lại dữ liệu Mock](#tái-tạo-lại-dữ-liệu-mock)
- [Build & Lint](#build--lint)
- [Biến môi trường](#biến-môi-trường)
- [Ghi chú kỹ thuật](#ghi-chú-kỹ-thuật)

---

## Tính năng

- **Đăng nhập**: form username/password, gọi `POST /api/login`, lưu token vào `localStorage`, tự động đính kèm `Authorization: Bearer <token>` cho mọi request kế tiếp qua Axios interceptor.
- **Danh sách sản phẩm**: hiển thị 106 sản phẩm (`GET /api/product`), Search theo tên, Filter theo toàn bộ thuộc tính (category, brand, color, tags, trạng thái, khoảng giá, tồn kho, đánh giá, năm phát hành), sắp xếp và phân trang.
- **Chi tiết sản phẩm**: hiển thị đầy đủ thông tin từng sản phẩm theo `id` (`GET /api/product/:id`).
- **Đăng xuất**: gọi `POST /api/logout` để thu hồi token, tự động điều hướng về trang đăng nhập.
- **Responsive**: bố cục tối ưu cho PC (≥1280px, Sidebar cố định) và Mobile (<1280px, Sidebar chuyển thành Drawer trượt).
- **Tự động đăng xuất khi token hết hạn**: response `401` từ API sẽ tự xóa token và điều hướng về `/login`.

## Tech Stack

| Hạng mục | Công nghệ |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4 |
| Routing | react-router-dom v7 |
| HTTP client | Axios (kèm interceptor) |
| Data fetching | @tanstack/react-query |
| Mock API | Mockoon CLI (`mockoon/cli`) |
| Containerization | Docker + Docker Compose, Nginx (phục vụ static build) |

## Cấu trúc thư mục

```
product-showcase/
├── src/
│   ├── components/
│   │   ├── common/        # Header, ProductCard, Pagination
│   │   ├── filter/        # FilterSidebar
│   │   └── product/       # ProductToolbar
│   ├── context/           # AuthContext, AuthProvider, useAuth
│   ├── hooks/             # useProductFilter (filter/search/sort/pagination pipeline)
│   ├── pages/             # LoginPage, ProductListPage, ProductDetailPage
│   ├── services/          # apiClient (axios instance dùng chung), auth.service, product.service
│   ├── types/             # Kiểu dữ liệu Product, response API (product.ts)
│   ├── utils/             # currency, productOptions
│   ├── App.tsx            # Khai báo route + ProtectedRoute
│   └── main.tsx
├── generate-mock.js       # Sinh dữ liệu mock (products.json, product-details.json, users.json)
├── sync-mockoon.js        # Đồng bộ dữ liệu mới vào mockoon-data.json (route rules theo từng id)
├── mockoon-data.json      # Cấu hình Mock API cho Mockoon (nộp kèm theo yêu cầu đề bài)
├── Dockerfile             # Multi-stage build: Node build → Nginx serve
├── docker-compose.yml     # Service frontend + mock-api
├── nginx.conf             # SPA fallback + reverse proxy /api → mock-api
└── DECISION_LOG.md        # Nhật ký quyết định kỹ thuật trong quá trình làm bài
```

## Yêu cầu môi trường

- **Node.js** ≥ 20
- **npm** (đi kèm Node.js)
- **Docker Desktop** (nếu muốn chạy theo cách được đề bài khuyến nghị)
- (Tùy chọn) **Mockoon Desktop** nếu muốn chỉnh sửa trực quan file `mockoon-data.json`

## Cài đặt & Chạy dự án

### 1. Clone và cài đặt dependencies

```bash
git clone https://github.com/HViettt/Product-Showcase.git
cd Product-Showcase
npm install
```

### 2. Khởi động Mock API

Cách nhanh nhất là dùng Docker Compose chỉ cho service `mock-api` (không cần build frontend):

```bash
docker compose up mock-api -d
```

Mock API sẽ chạy tại `http://localhost:3001`.

> Nếu không dùng Docker, có thể mở file `mockoon-data.json` bằng **Mockoon Desktop** và bấm Start server (mặc định cũng chạy ở cổng `3001`).

### 3. Chạy Frontend ở chế độ development

```bash
npm run dev
```

Ứng dụng chạy tại `http://localhost:5173`, gọi Mock API mặc định tại `http://localhost:3001/api` (xem mục [Biến môi trường](#biến-môi-trường)).

## Chạy bằng Docker (khuyến nghị)

Đây là cách chạy đúng theo yêu cầu đề bài — dựng đồng thời `frontend` và `mock-api` chỉ bằng một lệnh:

```bash
docker compose up --build
```

- Frontend: `http://localhost:8080`
- Mock API: `http://localhost:3001`

Frontend giao tiếp with `mock-api` thông qua reverse proxy của Nginx (`/api/*` → `mock-api:3001`), không gọi trực tiếp ra ngoài container.

**Lưu ý khi dữ liệu mock hoặc cấu hình build-time thay đổi**, cần build lại không dùng cache để tránh Docker giữ layer cũ:

```bash
docker compose down
docker compose build --no-cache
docker compose up
```

Dừng toàn bộ container:

```bash
docker compose down
```

## Tài khoản mock mặc định

| Username | Password |
|---|---|
| `geekup_tester` | `123456` |

## Tái tạo lại dữ liệu Mock

Dự án tách biệt 2 bước khi cần tạo lại/điều chỉnh dữ liệu mock (ví dụ đổi ảnh placeholder, thêm sản phẩm):

```bash
node generate-mock.js   # Sinh lại products.json, product-details.json, users.json
node sync-mockoon.js    # Đồng bộ dữ liệu mới vào mockoon-data.json
```

**Vì sao cần bước `sync-mockoon.js` riêng?** File `mockoon-data.json` lưu response ở dạng **INLINE** (nhúng cứng JSON ngay trong từng route cấu hình Mockoon), hoàn toàn độc lập với `products.json`/`product-details.json`. Nếu chỉ chạy `generate-mock.js` mà bỏ qua bước đồng bộ, Mock API (chạy qua Docker hoặc Mockoon CLI) vẫn sẽ phục vụ dữ liệu cũ. Script `sync-mockoon.js` sinh riêng cho route `GET /api/product/:id` một `rule` khớp chính xác theo từng `id` sản phẩm (kèm 1 response `404` fallback cho id không tồn tại), đảm bảo mỗi sản phẩm trả về đúng dữ liệu của chính nó.

Sau khi chạy 2 script trên, nếu đang mở `mockoon-data.json` bằng **Mockoon Desktop**, cần **Stop rồi Start lại server** để nạp cấu hình mới (mở lại file không tự restart server đang chạy).

## Build & Lint

```bash
npm run build     # Build production, kiểm tra type qua tsc -b
npm run lint      # Chạy ESLint (React Hooks rules, TypeScript rules)
npm run preview   # Xem thử bản build production ở local
```

## Biến môi trường

| Biến | Mặc định | Ý nghĩa |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3001/api` (dev) / `/api` (Docker build) | Base URL gọi Mock API |

Vì đây là biến của Vite, giá trị được **nhúng cứng vào bundle tại thời điểm build** (`npm run build`), không thể thay đổi sau khi build xong bằng biến môi trường runtime thông thường. Khi build qua Docker, giá trị được truyền vào đúng thời điểm build thông qua build argument:

```yaml
# docker-compose.yml
frontend:
  build:
    context: .
    args:
      VITE_API_BASE_URL: /api
```

```dockerfile
# Dockerfile
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build
```

## Ghi chú kỹ thuật

- Ảnh sản phẩm sử dụng dịch vụ placeholder [ui-avatars.com](https://ui-avatars.com/) theo đúng gợi ý của đề bài, không phải ảnh sản phẩm thật.
- Toàn bộ quá trình phân tích đề bài, các phương án kỹ thuật đã cân nhắc, và các lỗi phát hiện/khắc phục trong lúc tự kiểm thử được ghi lại chi tiết tại [`DECISION_LOG.md`](./DECISION_LOG.md).
- Breakpoint responsive được cấu hình lại đúng **1280px** (không dùng mặc định 1024px của Tailwind) thông qua `@theme` trong `src/index.css`.

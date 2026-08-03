# GEEK UP Product Showcase

## Setup

1. Vào thư mục project:
   ```powershell
   cd "C:\Users\Gigabyte\OneDrive - ut.edu.vn\Desktop\Technical Test\product-showcase"
   ```
2. Cài đặt dependencies:
   ```powershell
   npm install
   ```
3. Khởi động mock API bằng Mockoon CLI:
   ```powershell
   docker compose up mock-api -d
   ```

## Run locally

### Frontend
```powershell
npm run dev -- --host 0.0.0.0
```

### Build production
```powershell
npm run build
```

### Lint
```powershell
npm run lint
```

## Docker

```powershell
docker build -t product-showcase .
docker compose up --build
```

### Default mock credentials
- Username: `geekup_tester`
- Password: `123456`

### API base URL
Frontend default calls:
- `http://localhost:3001/api`

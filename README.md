# GEEK UP Product Showcase

## Setup

1. Di chuyển vào thư mục project:
   ```powershell
   cd <path-to-project>
   ```
   ```bash
   cd <path-to-project>
   ```
2. Cài đặt dependencies:
   ```powershell
   npm install
   ```
   ```bash
   npm install
   ```
3. Khởi động mock API bằng Mockoon CLI:
   ```powershell
   docker compose up mock-api -d
   ```
   ```bash
   docker compose up mock-api -d
   ```

## Run locally

### Frontend
```powershell
npm run dev -- --host 0.0.0.0
```
```bash
npm run dev -- --host 0.0.0.0
```

### Build production
```powershell
npm run build
```
```bash
npm run build
```

### Lint
```powershell
npm run lint
```
```bash
npm run lint
```

## Docker

```powershell
docker build -t product-showcase .
docker compose up --build
```
```bash
docker build -t product-showcase .
docker compose up --build
```

### Default mock credentials
- Username: `geekup_tester`
- Password: `123456`

### API base URL
Frontend default calls:
- `http://localhost:3001/api`
- khi chạy trong container Docker, frontend nên gọi qua proxy path `/api`

# Bài tập: Upload & hiển thị hình với Azure Blob Storage

Frontend HTML thuần + Backend Node.js (Express), không dùng database.
Ảnh được lưu trực tiếp trên Azure Blob Storage.

## Cấu trúc

| File | Vai trò |
|---|---|
| `server.js` | Backend Express, 2 API: `GET /api/images`, `POST /api/upload` |
| `public/index.html` | Frontend, không framework, không thư viện ngoài |
| `.env` | Nơi điền connection string và tên container |
| `Dockerfile` | Đóng gói app thành image |
| `docker-compose.yml` | Chạy app bằng 1 câu lệnh |

## Bước 1 — Cấu hình

Mở file `.env` và điền 2 giá trị:

```
AZURE_STORAGE_CONNECTION_STRING=<connection string của Storage Account>
AZURE_CONTAINER_NAME=<tên container>
```

Trên Azure Portal, vào container > **Change access level** > chọn
**Blob (anonymous read access for blobs only)** để ảnh hiển thị được trên trình duyệt.

> Không commit file `.env` lên git — connection string chứa key toàn quyền
> đọc/ghi/xoá storage account.

## Bước 2 — Chạy

### Cách A: Docker (khuyến khích)

```bash
docker compose up -d --build     # khởi động
docker compose logs -f           # xem log
docker compose down              # dừng
```

### Cách B: Chạy trực tiếp bằng Node

```bash
npm install
npm start
```

Mở http://localhost:8088

## API

| Method | Đường dẫn | Mô tả |
|---|---|---|
| `GET` | `/api/images` | Trả về `[{ name, url }]` — danh sách ảnh trong container |
| `POST` | `/api/upload` | Nhận `multipart/form-data`, field tên `image` |

## Xử lý sự cố

| Hiện tượng | Nguyên nhân |
|---|---|
| Container `Exited (1)`, log báo "Chua dien..." | `.env` còn trống |
| Ảnh hiện ô vỡ | Container chưa bật anonymous read access |
| `AuthenticationFailed` | Connection string sai hoặc key đã bị xoay vòng |
| `port is already allocated` | Cổng 8088 đang bị chiếm, đổi port trong `docker-compose.yml` |

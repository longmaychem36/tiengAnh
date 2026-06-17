# Deploy Lên Internet Bằng Railway + Vercel

Hướng dẫn này dùng phương án gọn một nơi:

- Railway: PostgreSQL database
- Railway: Backend Node.js/Express
- Railway: Whisper Python service
- Vercel: Frontend React/Vite

Sau khi deploy, người dùng truy cập frontend trên Vercel. Frontend gọi backend trên Railway. Backend gọi PostgreSQL và Whisper cùng trong Railway.

## 0. Lưu Ý Bảo Mật Trước Khi Làm

Bạn đang có connection string database kèm password trong nội dung đang mở. Hãy đổi/reset password database đó ngay nếu đã từng chia sẻ hoặc commit.

Không commit các file sau lên GitHub:

```text
backend/.env
frontend/.env
```

Đảm bảo `.gitignore` có:

```gitignore
.env
.env.local
node_modules
dist
uploads
```

Nên rotate các key nếu đã lộ:

- `NVIDIA_API_KEY`
- `JWT_SECRET`
- `SEPAY_API_TOKEN`
- `SEPAY_WEBHOOK_API_KEY`
- `CLOUDINARY_API_SECRET`
- Database password

## 1. Chuẩn Bị Tài Khoản Và Tool

Cần có:

- GitHub: https://github.com
- Railway: https://railway.app hoặc https://railway.com
- Vercel: https://vercel.com

Kiểm tra trên máy:

```powershell
node -v
npm -v
git --version
psql --version
```

Nếu chưa có `psql`, cài PostgreSQL client trước. Trên Windows, có thể cài PostgreSQL và tick chọn Command Line Tools.

## 2. Đẩy Code Lên GitHub

Từ thư mục gốc dự án:

```powershell
cd D:\tiengAnh
git status
```

Nếu mọi file cần thiết đã đúng:

```powershell
git add .
git commit -m "Prepare Railway deployment"
git push origin main
```

Nếu branch của bạn không phải `main`, dùng tên branch thực tế.

## 3. Tạo Project Trên Railway

1. Vào Railway.
2. Chọn **New Project**.
3. Chọn **Deploy from GitHub repo**.
4. Chọn repo của dự án.

Trong cùng một Railway project, ta sẽ tạo 3 service:

```text
PostgreSQL
Backend API
Whisper Service
```

## 4. Tạo PostgreSQL Trên Railway

Trong Railway project:

1. Bấm **New**.
2. Chọn **Database**.
3. Chọn **Add PostgreSQL**.

Railway sẽ tạo một PostgreSQL service và sinh các biến như:

```text
PGHOST
PGPORT
PGDATABASE
PGUSER
POSTGRES_PASSWORD
DATABASE_URL
```

## 5. Bật Public Networking Cho PostgreSQL Để Import SQL

Để import `cosodulieu.sql` từ máy local, database cần có public connection.

Trong PostgreSQL service trên Railway:

1. Vào tab **Settings**.
2. Tìm **Networking**.
3. Bật **Public Networking** hoặc **TCP Proxy** cho PostgreSQL.
4. Copy public connection string nếu Railway hiện sẵn.

Nếu Railway không hiện connection string đầy đủ, từ các biến tạo public URL dạng:

```text
postgresql://PGUSER:POSTGRES_PASSWORD@RAILWAY_TCP_PROXY_DOMAIN:RAILWAY_TCP_PROXY_PORT/PGDATABASE
```

Ví dụ mẫu:

```text
postgresql://postgres:password@viaduct.proxy.rlwy.net:12345/railway
```

## 6. Import File cosodulieu.sql Vào Railway PostgreSQL

Từ máy local:

```powershell
cd D:\tiengAnh
psql "postgresql://PGUSER:POSTGRES_PASSWORD@RAILWAY_TCP_PROXY_DOMAIN:RAILWAY_TCP_PROXY_PORT/PGDATABASE" -v ON_ERROR_STOP=1 -f .\cosodulieu.sql
```

Nếu password có ký tự đặc biệt, dùng connection string Railway copy sẵn.

Test sau khi import:

```powershell
psql "postgresql://PGUSER:POSTGRES_PASSWORD@RAILWAY_TCP_PROXY_DOMAIN:RAILWAY_TCP_PROXY_PORT/PGDATABASE" -c "select count(*) from users;"
```

Kiểm tra danh sách bảng:

```powershell
psql "postgresql://PGUSER:POSTGRES_PASSWORD@RAILWAY_TCP_PROXY_DOMAIN:RAILWAY_TCP_PROXY_PORT/PGDATABASE" -c "\dt"
```

Neu Railway da co bang nhung cac bang khong co du lieu, thu import phan data bang script Node:

```powershell
cd D:\tiengAnh\backend
$env:DATABASE_URL="postgresql://PGUSER:POSTGRES_PASSWORD@RAILWAY_TCP_PROXY_DOMAIN:RAILWAY_TCP_PROXY_PORT/PGDATABASE"
$env:DB_SSL="true"
npm.cmd run db:import-data
```

Kiem tra file dump co bao nhieu dong data truoc khi import:

```powershell
cd D:\tiengAnh\backend
npm.cmd run db:import-data:check
```

Luu y: `cosodulieu.sql` dung cu phap `COPY ... FROM stdin`. PostgreSQL CLI `psql` doc duoc cu phap nay, nhung SQL editor tren web hoac script Node chay thang `client.query(sqlContent)` thuong chi tao duoc bang roi khong nap duoc du lieu.

Sau khi import database, chạy thêm migration/seed cho nội dung học hiện tại. Bước này đặc biệt quan trọng với trang Admin Listening/Reading: trang user có fallback dữ liệu tĩnh trong frontend, còn trang admin chỉ đọc dữ liệu thật trong PostgreSQL.

```powershell
cd D:\tiengAnh\backend
$env:DATABASE_URL="postgresql://PGUSER:POSTGRES_PASSWORD@RAILWAY_TCP_PROXY_DOMAIN:RAILWAY_TCP_PROXY_PORT/PGDATABASE"
$env:DB_SSL="true"
npm.cmd run db:migrate-receptive
npm.cmd run db:seed-receptive
npm.cmd run db:migrate-onboarding
npm.cmd run db:seed-onboarding
npm.cmd run db:migrate-minigames
npm.cmd run db:counts
```

Kiểm tra nhanh Listening/Reading có dữ liệu:

```powershell
psql "POSTGRES_PUBLIC_URL" -c "select count(*) from public.listeninglessons;"
psql "POSTGRES_PUBLIC_URL" -c "select count(*) from public.readinglessons;"
```

## 7. Deploy Whisper Service Trên Railway

Whisper là Python Flask service. Nên deploy riêng, không chung với backend Node.

Trong Railway project:

1. Bấm **New**.
2. Chọn **GitHub Repo**.
3. Chọn cùng repo.
4. Đặt service name:

```text
english-whisper
```

5. Cấu hình service:

```text
Root Directory: whisper
Build Command: pip install -r requirements.txt
Start Command: python whisper_server.py
```

6. Thêm Variables cho Whisper service:

```env
WHISPER_MODEL=tiny
WHISPER_DEVICE=cpu
WHISPER_COMPUTE=int8
PYTHONUNBUFFERED=1
```

Ghi chú:

- Railway tự cấp biến `PORT`.
- `whisper/whisper_server.py` đã đọc `PORT`.
- Nên dùng `WHISPER_MODEL=tiny` trước vì nhẹ hơn.
- Nếu service ổn định và muốn chính xác hơn, thử `WHISPER_MODEL=base`.

7. Vào tab **Settings** của Whisper service.
8. Trong **Networking**, bấm **Generate Domain**.

Bạn sẽ có URL dạng:

```text
https://english-whisper-production.up.railway.app
```

Test Whisper:

```powershell
curl https://english-whisper-production.up.railway.app/health
```

Kết quả mong đợi:

```json
{"status":"ok","model":"tiny","device":"cpu"}
```

Lần đầu gọi có thể lâu vì service cần tải model.

## 8. Deploy Backend API Trên Railway

Trong Railway project:

1. Bấm **New**.
2. Chọn **GitHub Repo**.
3. Chọn cùng repo.
4. Đặt service name:

```text
english-learning-api
```

5. Cấu hình service:

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

6. Vào tab **Variables** của backend service.

Thêm biến kết nối PostgreSQL. Nếu backend và PostgreSQL cùng Railway project, bạn có thể dùng variable reference từ PostgreSQL service.

Dạng dễ hiểu nhất là điền thủ công theo PostgreSQL variables:

```env
NODE_ENV=production

DB_HOST=${{Postgres.PGHOST}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.POSTGRES_PASSWORD}}
DB_PORT=${{Postgres.PGPORT}}
DB_SSL=false

JWT_SECRET=thay_bang_chuoi_bi_mat_rat_dai
JWT_EXPIRES_IN=7d

WHISPER_SERVER_URL=https://english-whisper-production.up.railway.app

CLIENT_URL=https://your-frontend.vercel.app

NVIDIA_API_KEY=your_nvidia_key
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=meta/llama-3.3-70b-instruct
SPEAKING_NVIDIA_MODEL=meta/llama-3.1-8b-instruct
SPEAKING_AI_TIMEOUT_MS=25000
WRITING_NVIDIA_MODEL=meta/llama-3.1-8b-instruct
WRITING_AI_TIMEOUT_MS=6000
WRITING_AI_MAX_TOKENS=280
WRITING_FAST_PASS_SCORE=92
WRITING_FAST_FAIL_SCORE=45
DAILY_TASK_NVIDIA_MODEL=meta/llama-3.1-8b-instruct
DAILY_TASK_TIMEOUT_MS=12000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

UPLOAD_DIR=./uploads
MAX_IMAGE_SIZE=5242880
MAX_AUDIO_SIZE=10485760

PLUS_PRICE_VND=2000
PLUS_DURATION_DAYS=30
SEPAY_BANK_CODE=your_bank_code
SEPAY_ACCOUNT_NUMBER=your_account_number
SEPAY_ACCOUNT_NAME=your_account_name
SEPAY_WEBHOOK_API_KEY=your_webhook_key
SEPAY_API_TOKEN=your_sepay_token
```

Lưu ý:

- Tên PostgreSQL service trên Railway có thể khác `Postgres`.
- Nếu service của bạn tên `PostgreSQL`, reference sẽ là `${{PostgreSQL.PGHOST}}`.
- Để chắc chắn, vào tab Variables của backend, bấm **Add Reference** và chọn biến từ PostgreSQL service.
- Khi backend kết nối PostgreSQL bằng private network trong Railway, thường dùng `DB_SSL=false`.

7. Vào tab **Settings** của backend service.
8. Trong **Networking**, bấm **Generate Domain**.

Bạn sẽ có URL dạng:

```text
https://english-learning-api-production.up.railway.app
```

Test backend:

```powershell
curl https://english-learning-api-production.up.railway.app/api/v1/health
```

Kết quả mong đợi:

```json
{
  "success": true,
  "message": "English Learning System API is running"
}
```

## 9. Deploy Frontend Trên Vercel

Frontend Vite nên deploy trên Vercel.

1. Vào https://vercel.com
2. Chọn **Add New** -> **Project**.
3. Import GitHub repo.
4. Cấu hình:

```text
Framework Preset: Vite
Root Directory: frontend
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

5. Thêm Environment Variables trên Vercel:

```env
VITE_API_URL=https://english-learning-api-production.up.railway.app/api/v1
VITE_APP_NAME=English Learning System
```

6. Deploy.

Sau khi deploy, Vercel cho URL dạng:

```text
https://your-frontend.vercel.app
```

## 10. Cập Nhật CLIENT_URL Cho Backend

Sau khi có URL frontend Vercel, quay lại Railway backend service.

Sửa:

```env
CLIENT_URL=https://your-frontend.vercel.app
```

Sau đó redeploy backend.

Test lại frontend:

```text
https://your-frontend.vercel.app
```

## 11. Test Toàn Bộ Hệ Thống

Kiểm tra theo thứ tự:

1. PostgreSQL đã có bảng:

```powershell
psql "POSTGRES_PUBLIC_URL" -c "\dt"
```

2. Whisper health:

```powershell
curl https://english-whisper-production.up.railway.app/health
```

3. Backend health:

```powershell
curl https://english-learning-api-production.up.railway.app/api/v1/health
```

4. Frontend:

```text
https://your-frontend.vercel.app
```

5. Test trên web:

- Đăng ký tài khoản
- Đăng nhập
- Mở Dictionary
- Mở Grammar
- Mở Games
- Mở Speaking và ghi âm
- Mở Writing
- Test Admin nếu có tài khoản admin/superadmin

## 12. Cấu Hình SePay Webhook

Sau khi backend public, webhook URL là:

```text
https://english-learning-api-production.up.railway.app/api/v1/billing/sepay/webhook
```

Nhập URL này vào dashboard SePay.

Trong Railway backend variables, đảm bảo có:

```env
SEPAY_WEBHOOK_API_KEY=your_webhook_key
SEPAY_API_TOKEN=your_sepay_token
```

## 13. Lỗi Thường Gặp Và Cách Sửa

### 13.1 Frontend Bị CORS

Triệu chứng:

- Login/register gọi API thất bại.
- Console báo CORS error.

Sửa:

```env
CLIENT_URL=https://your-frontend.vercel.app
```

Sau đó redeploy backend trên Railway.

### 13.2 Frontend Vẫn Gọi Localhost

Kiểm tra Vercel env:

```env
VITE_API_URL=https://english-learning-api-production.up.railway.app/api/v1
```

Sau khi sửa env, phải redeploy frontend trên Vercel.

### 13.3 Admin Listening/Reading Không Thấy Bài Nhưng User Vẫn Thấy

Nguyên nhân thường gặp: database Railway chưa được seed bài Listening/Reading. Trang user có fallback dữ liệu tĩnh nên vẫn hiển thị, còn trang admin chỉ quản lý dữ liệu trong PostgreSQL.

Chạy trên máy local với public database URL của Railway:

```powershell
cd D:\tiengAnh\backend
$env:DATABASE_URL="POSTGRES_PUBLIC_URL"
$env:DB_SSL="true"
npm.cmd run db:seed-receptive
npm.cmd run db:counts
```

Nếu vẫn rỗng, kiểm tra Vercel có đúng biến:

```env
VITE_API_URL=https://english-learning-api-production.up.railway.app/api/v1
```

Sau khi sửa env, redeploy frontend.

### 13.4 Backend Không Kết Nối Database

Kiểm tra Railway backend logs.

Nếu lỗi connection:

- Kiểm tra `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`.
- Nếu dùng private Railway variables, thử `DB_SSL=false`.
- Nếu dùng public TCP proxy, thử `DB_SSL=true`.

### 13.5 Import SQL Lỗi Permission Hoặc Extension

File `cosodulieu.sql` đã bỏ `OWNER TO postgres` và dùng `CREATE EXTENSION IF NOT EXISTS pgcrypto`.

Nếu vẫn lỗi, kiểm tra PostgreSQL user của Railway có quyền tạo extension không.

### 13.6 Whisper Crash Vì Hết RAM

Sửa Whisper variables:

```env
WHISPER_MODEL=tiny
WHISPER_DEVICE=cpu
WHISPER_COMPUTE=int8
```

Sau đó redeploy Whisper.

### 13.7 Speaking Báo Whisper Offline

Kiểm tra backend variable:

```env
WHISPER_SERVER_URL=https://english-whisper-production.up.railway.app
```

Test:

```powershell
curl https://english-whisper-production.up.railway.app/health
```

Nếu health chạy được mà backend vẫn lỗi, xem backend logs khi bấm ghi âm.

### 13.8 Railway Service Sleep Hoặc Cold Start

Lần đầu truy cập có thể chậm. Whisper có thể chậm hơn vì cần load model. Nếu cần ổn định, nâng cấp plan Railway.

### 13.9 Railpack Báo Không Xác Định Được Cách Build App

Lỗi thường gặp:

```text
Script start.sh not found
Railpack could not determine how to build the app.
The app contents that Railpack analyzed contains:
./
├── backend/
├── frontend/
...
```

Nguyên nhân: Railway đang build ở thư mục gốc repo, trong khi app thật nằm trong `backend`.

Nếu service này là Whisper, sửa trong Railway:

```text
Root Directory: whisper
Build Command: pip install -r requirements.txt
Start Command: python whisper_server.py
```

Nếu service này là backend Node.js, sửa trong Railway:

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

Sau khi sửa:

1. Vào tab **Deployments**.
2. Bấm **Redeploy**.
3. Nếu vẫn lỗi, vào **Settings** và xóa mọi command cũ kiểu `start.sh`.

### 13.10 Whisper Báo `ModuleNotFoundError: No module named 'requests'`

Lỗi:

```text
ModuleNotFoundError: No module named 'requests'
```

Nguyên nhân: môi trường Python thiếu package `requests`, trong khi `faster-whisper` cần import package này.

Cách sửa trong repo:

```text
whisper/requirements.txt
```

Phải có:

```text
requests==2.32.3
```

Sau đó commit, push và redeploy Whisper service.

## 14. Checklist URL Cuối Cùng

Ghi lại:

```text
Frontend:
https://your-frontend.vercel.app

Backend API:
https://english-learning-api-production.up.railway.app/api/v1

Backend health:
https://english-learning-api-production.up.railway.app/api/v1/health

Whisper:
https://english-whisper-production.up.railway.app

Whisper health:
https://english-whisper-production.up.railway.app/health

SePay webhook:
https://english-learning-api-production.up.railway.app/api/v1/billing/sepay/webhook
```

## 15. Nên Làm Sau Khi Deploy Xong

- Reset lại database password nếu từng để lộ.
- Đổi `JWT_SECRET`.
- Rotate tất cả API key đã từng xuất hiện trong code, ảnh chụp, chat hoặc commit.
- Xóa public networking của PostgreSQL nếu không cần import từ máy local nữa.
- Chỉ giữ private connection giữa backend và PostgreSQL trong Railway.
- Không đưa secret vào frontend env `VITE_*`.

## 16. Cập Nhật Sau Khi Chuyển Từ Điển Sang API-Only

Từ điển hiện tra hoàn toàn qua API ngoài:

- Free Dictionary API cho nghĩa tiếng Anh, phát âm, audio, từ loại.
- MyMemory API cho dịch Anh-Việt hoặc Việt-Anh.
- Datamuse API cho gợi ý/autocomplete tiếng Anh.

Backend không insert từ tra cứu vào bảng `DictionaryEntries` nữa. Khi người dùng lưu từ vào bộ sưu tập, hệ thống lưu trực tiếp vào `UserCollectionWords` qua các cột:

```text
CustomWord
CustomMeaning
CustomExample
```

Nếu database Railway đã deploy trước đó, chạy thêm lệnh này để bỏ phụ thuộc collection vào bảng từ điển:

```powershell
psql "POSTGRES_PUBLIC_URL" -c "ALTER TABLE public.usercollectionwords DROP CONSTRAINT IF EXISTS usercollectionwords_dictionaryentryid_fkey;"
```

Sau đó:

1. Commit và push code mới.
2. Redeploy backend Railway.
3. Redeploy frontend Vercel.
4. Test lại trang Dictionary.
5. Tra một từ bất kỳ rồi lưu vào collection.



cd D:\tiengAnh\backend

Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue
Remove-Item Env:DATABASE_PUBLIC_URL -ErrorAction SilentlyContinue

$env:DB_HOST="postgres.railway.internal"
$env:DB_PORT="5432"
$env:DB_NAME="railway"
$env:DB_USER="postgres"
$env:DB_PASSWORD="tLROTZxyMimaqKbGDVRPkAfSbugxwEta"
$env:DB_SSL="true"

npm.cmd run db:import-data




cd D:\tiengAnh\backend
$env:DATABASE_URL="postgresql://postgres:tLROTZxyMimaqKbGDVRPkAfSbugxwEta@zephyr.proxy.rlwy.net:39619/railway"
$env:DB_SSL="true"
npm.cmd run db:import-data

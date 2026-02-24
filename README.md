# Ali Termin System (SaaS) — Ready-to-run ZIP

This ZIP contains:
- **backend/** Node.js (Express) + MySQL + JWT + Cron (24h & 2h reminders) + Retry + i18n (DE/FR/IT) + Twilio SMS/WhatsApp
- **frontend/** React Admin UI (Vite) + i18n (DE/FR/IT)

## 1) Requirements
- Ubuntu 22.04 (or similar)
- Node.js 18+ (recommended)
- MySQL 8+
- (optional) PM2, Nginx

## 2) Database
Create DB and user, then import schema:

```bash
mysql -u root -p
CREATE DATABASE ali_termin_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ali_user'@'localhost' IDENTIFIED BY 'strongpassword';
GRANT ALL PRIVILEGES ON ali_termin_system.* TO 'ali_user'@'localhost';
FLUSH PRIVILEGES;
exit
```

Import:
```bash
mysql -u ali_user -p ali_termin_system < backend/sql/schema.sql
```

## 3) Backend setup
```bash
cd backend
cp .env.example .env
npm install
npm run start
```

### Notes
- Set `MOCK_MESSAGING=true` if you want to test without sending real SMS/WhatsApp.
- Set timezone to Switzerland via `APP_TIMEZONE=Europe/Zurich` (default is Europe/Zurich).

## 4) Frontend setup
```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

Build for production:
```bash
npm run build
```

## 5) Default API
Backend: http://localhost:5000  
Frontend dev: http://localhost:5173

## 6) Quick test flow
1) Register user: POST `http://localhost:5000/api/auth/register`
2) Login: POST `http://localhost:5000/api/auth/login`
3) Create appointment with `client_language` in (de|fr|it)
4) Cron runs automatically (every 5 min) and will send reminders when time window matches

## 7) Deploy (optional)
- Use PM2 to keep backend running:
```bash
npm i -g pm2
pm2 start backend/src/server.js --name ali-termin-backend
pm2 save
pm2 startup
```

- Serve frontend build with Nginx (after `npm run build` in frontend)

---

If you want Docker Compose (api + mysql) later, tell me and I’ll add it to the project.

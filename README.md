# Ali Termin System

**Appointment Reminder System with Multi-Language Support**

A complete SaaS solution for managing appointments with automated SMS/WhatsApp reminders.

## Features

- ✅ **Multi-tenant System** - Each company has their own isolated data
- 📅 **Appointment Management** - Create, update, and track appointments
- 📱 **Automated Reminders** - 24h and 2h reminders via SMS or WhatsApp
- 🌍 **Multi-Language** - German, French, Italian support
- 🔄 **Retry Mechanism** - Automatic retry for failed messages
- 📊 **Message Logs** - Track all sent messages and delivery status
- 📥 **Excel Export** - Export appointments and message logs
- 🎨 **Modern UI** - React + Material-UI with dark/light mode
- 🔐 **Secure** - JWT authentication, bcrypt password hashing

## Tech Stack

### Backend
- Node.js + Express
- SQLite database
- Twilio for SMS/WhatsApp
- node-cron for automated tasks
- JWT authentication
- Zod validation

### Frontend
- React 18
- Vite
- Material-UI (MUI)
- i18next for translations
- Axios for API calls

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install

# Copy environment file
cp .env.example .env

# Edit .env and add your Twilio credentials
# Set MOCK_MESSAGING=true for testing without Twilio

# Start backend
npm start
```

Backend runs on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install

# Copy environment file (optional)
cp .env.example .env

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

### 3. Test Twilio Integration (Optional)

```bash
cd backend
node test-twilio.js
```

## Environment Variables

### Backend (.env)

```env
# Database (SQLite - auto-created)
DB_PATH=./database.db

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=12h

# Server
PORT=5000
NODE_ENV=development

# Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_SMS_FROM=+41XXXXXXXXX
TWILIO_WHATSAPP_FROM=whatsapp:+41XXXXXXXXX
MOCK_MESSAGING=true

# Application
APP_TIMEZONE=Europe/Zurich
PUBLIC_BASE_URL=http://localhost:5000
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed cPanel deployment instructions.

## Project Structure

```
ali-termin-system/
├── backend/
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── cron/          # Automated reminder jobs
│   │   ├── locales/       # Translation files (DE/FR/IT)
│   │   ├── middleware/    # JWT authentication
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Twilio, translations
│   │   ├── utils/         # Time utilities
│   │   └── server.js      # Express app entry
│   ├── test-twilio.js     # Twilio test script
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── locales/       # Frontend translations
│   │   ├── pages/         # App pages
│   │   ├── api.js         # Axios configuration
│   │   ├── i18n.js        # i18next setup
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login and get JWT token

### Appointments (Protected)
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Messages (Protected)
- `GET /api/messages` - List message logs
- `POST /api/messages/resend/:id` - Retry failed message
- `GET /api/messages/export/appointments` - Export appointments as Excel
- `GET /api/messages/export/messages` - Export messages as Excel

### Public
- `GET /cancel/:id` - Public appointment cancellation link
- `GET /health` - Health check endpoint

## Cron Jobs

- **Reminder Cron** (every 5 minutes): Checks appointments and sends 24h/2h reminders
- **Retry Cron** (every 15 minutes): Retries failed messages (max 5 attempts)

## Development

### Run Backend in Development
```bash
cd backend
npm run dev  # with nodemon auto-reload
```

### Build Frontend for Production
```bash
cd frontend
npm run build
```

## License

Private - All rights reserved

## Support

For issues or questions, contact the development team.
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

# Apparel Creations - ระบบบันทึกข้อมูลการผลิตเสื้อผ้า

ระบบบันทึกข้อมูลการผลิตเสื้อผ้าแบบครบวงจร รองรับทั้ง Desktop, Tablet และ Mobile พร้อม PWA (Progressive Web App) สำหรับใช้งานแบบแอปพลิเคชัน

## 📋 สิ่งที่ปรับปรุงและเพิ่มเติม

### การปรับปรุงหลัก:
- ✅ **PWA Support** - เพิ่ม Progressive Web App สำหรับใช้งานแบบแอปบนมือถือ
- ✅ **MongoDB Atlas Integration** - เชื่อมต่อฐานข้อมูล cloud สำหรับเก็บข้อมูลแบบ online
- ✅ **Full-stack Deployment** - Deploy backend บน Render และ frontend บน Vercel
- ✅ **Responsive Design** - รองรับทุกขนาดหน้าจอ (Mobile, Tablet, Desktop)
- ✅ **CORS Configuration** - ตั้งค่า CORS สำหรับการเชื่อมต่อระหว่าง frontend และ backend

### การแก้ไขปัญหา:
- ✅ **MongoDB SSL Error** - แก้ไข connection string ด้วย SSL parameters
- ✅ **Package-lock.json Sync** - แก้ไขปัญหา sync สำหรับการ deploy
- ✅ **Dockerfile Optimization** - เปลี่ยนจาก npm ci เป็น npm install

## 🚀 วิธีการใช้งาน

### การใช้งานแบบ Local (Development)

#### 1. Clone Repository
```bash
git clone https://github.com/chaya121/ac.git
cd ac
```

#### 2. ติดตั้ง Dependencies
```bash
npm install
```

#### 3. ตั้งค่า Environment Variables
สร้างไฟล์ `.env` ใน root directory:
```env
PORT=3001
NODE_ENV=development
DATABASE_TYPE=sqlite
```

#### 4. เริ่มใช้งาน
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### การใช้งานแบบ Production (Cloud)

#### การ Deploy:
- **Frontend**: Vercel (https://your-app.vercel.app)
- **Backend**: Render (https://apparel-backend-6igk.onrender.com)
- **Database**: MongoDB Atlas

#### Environment Variables บน Render:
- `DATABASE_TYPE`: `mongodb`
- `DATABASE_URL`: `mongodb+srv://chatsharev_db_user:JZvyskvJxRYNPHwD@cluster0.vwuvu4f.mongodb.net/?retryWrites=true&w=majority`
- `NODE_ENV`: `production`
- `FRONTEND_URL`: URL ของ Vercel frontend

## 📱 PWA (Progressive Web App)

### การติดตั้ง PWA บน Mobile:
1. เปิดเว็บบน mobile browser
2. คลิก "Share" หรือ menu
3. เลือก "Add to Home Screen"
4. Icon จะปรากฏบนหน้าจอเหมือน native app

### การสร้าง PWA Icons:
สร้างไฟล์ใน `frontend/public/`:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

## 🗂️ โครงสร้าง Project

```
ac/
├── backend/
│   ├── index.js          # Express server
│   └── db.js             # Database layer (SQLite + MongoDB)
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── api/          # API client
│   │   └── App.jsx       # Main app component
│   └── public/           # Static files + PWA icons
├── database/             # SQLite database files
├── vite.config.js        # Vite configuration + PWA
├── package.json          # Dependencies
└── .env.example          # Environment variables template
```

## 🔧 การตั้งค่า Environment Variables

### Local Development:
```env
PORT=3001
NODE_ENV=development
DATABASE_TYPE=sqlite
```

### Production (MongoDB Atlas):
```env
PORT=3001
NODE_ENV=production
DATABASE_TYPE=mongodb
DATABASE_URL=mongodb+srv://[USERNAME]:[PASSWORD]@cluster0.[CLUSTER-ID].mongodb.net/?retryWrites=true&w=majority
```

## 📦 Scripts ที่มีใช้

```bash
npm run dev          # เริ่ม development server (frontend + backend)
npm run dev:client   # เริ่ม frontend เท่านั้น
npm run dev:server  # เริ่ม backend เท่านั้น
npm run build        # Build frontend สำหรับ production
npm run start        # เริ่ม production server
npm run preview      # Build และเริ่ม production server
```

## 🌐 Deployment

### การ Deploy ไป Vercel (Frontend):
1. เชื่อมต่อ GitHub repository กับ Vercel
2. Vercel จะ auto-detect React/Vite project
3. Deploy อัตโนมัติทุกครั้งที่ push ไป GitHub

### การ Deploy ไป Render (Backend):
1. เชื่อมต่อ GitHub repository กับ Render
2. ตั้งค่า Build Command: `npm install`
3. ตั้งค่า Start Command: `node backend/index.js`
4. เพิ่ม environment variables ตามที่ระบุข้างบน

## 🐛 การแก้ปัญหา

### MongoDB SSL Error:
หากเกิด error เรื่อง SSL connection กับ MongoDB Atlas:
- ตรวจสอบว่า connection string มี `?retryWrites=true&w=majority` ต่อท้าย
- ตรวจสอบ IP whitelist บน MongoDB Atlas

### PWA ไม่ทำงาน:
- ตรวจสอบว่า icons มีอยู่ใน `frontend/public/`
- ตรวจสอบว่า service worker ลงทะเบียนแล้ว (ดูใน browser console)

### Frontend ไม่เชื่อมต่อ Backend:
- ตรวจสอบว่า API_BASE ใน `frontend/src/api/client.js` ถูกต้อง
- ตรวจสอบ CORS configuration ใน `backend/index.js`
- ตรวจสอบว่า FRONTEND_URL ตั้งค่าบน Render

## 📝 ข้อมูลเพิ่มเติม

- **Frontend Framework**: React 19 + Vite
- **Backend Framework**: Express.js
- **Database**: SQLite (local) / MongoDB Atlas (cloud)
- **Deployment**: Vercel (frontend) + Render (backend)
- **PWA**: vite-plugin-pwa

## 📧 ติดต่อ

GitHub Repository: https://github.com/chaya121/ac

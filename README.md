# Apparel Creations - ระบบบันทึกข้อมูลการผลิตเสื้อผ้า

ระบบบันทึกข้อมูลการผลิตเสื้อผ้าแบบครบวงจร รองรับทั้ง Desktop, Tablet และ Mobile พร้อม PWA (Progressive Web App) สำหรับใช้งานแบบแอปพลิเคชัน

## 📋 สิ่งที่ปรับปรุงและเพิ่มเติม

### การปรับปรุงหลัก:
- ✅ **PWA Support** - เพิ่ม Progressive Web App สำหรับใช้งานแบบแอปบนมือถือ
- ✅ **MongoDB Atlas Integration** - เชื่อมต่อฐานข้อมูล cloud สำหรับเก็บข้อมูลแบบ online
- ✅ **Full-stack Deployment** - Deploy backend บน Render และ frontend บน Vercel
- ✅ **Responsive Design** - รองรับทุกขนาดหน้าจอ (Mobile, Tablet, Desktop)
- ✅ **CORS Configuration** - ตั้งค่า CORS สำหรับการเชื่อมต่อระหว่าง frontend และ backend

### การปรับปรุงล่าสุด (2024):
- ✅ **เพิ่มช่องเลือกชนิดเสื้อผ้า** - เพิ่ม dropdown เลือกชนิด (เสื้อ, กางเกง, ชุดเซ็ต, อื่นๆ)
- ✅ **ปรับปรุงระบบเลือกลูกค้าและแบรนด์** - เปลี่ยนช่องลูกค้าเป็น dropdown และทำให้แบรนด์ขึ้นอยู่กับลูกค้าที่เลือก
- ✅ **เพิ่มฟิลเตอร์ในหน้าประวัติ** - เพิ่ม dropdown กรองตามลูกค้าและแบรนด์ (แบรนด์ขึ้นอยู่กับลูกค้า)
- ✅ **แสดงข้อมูลเพิ่มเติมในการ์ด** - เพิ่มแสดงลูกค้า, แบรนด์, ราคาประมาณ, ราคาจริง
- ✅ **เพิ่มจำนวนรายการที่กรอง** - แสดงจำนวนรายการที่กรองได้
- ✅ **เพิ่มปุ่มดูข้อมูล** - เพิ่ม modal เพื่อดูรายละเอียดข้อมูลโดยไม่ต้องโหลด PDF
- ✅ **ปรับปรุงปุ่มแก้ไข** - เปลี่ยน "โหลดข้อมูล" เป็น "แก้ไขข้อมูล" เพื่อความชัดเจน
- ✅ **เปลี่ยนข้อความ** - เปลี่ยน "ใบดีทั้งหมด" เป็น "ใบขั้นตอนการผลิต"

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
- **Frontend**: Vercel (https://apparel01.vercel.app)
- **Backend**: Render (https://apparel-backend-6igk.onrender.com)
- **Database**: MongoDB Atlas

#### Environment Variables บน Render:
- `DATABASE_TYPE`: `mongodb`
- `DATABASE_URL`: MongoDB Atlas connection string (ติดต่อ admin เพื่อรับค่า)
- `NODE_ENV`: `production`
- `FRONTEND_URL`: `https://apparel01.vercel.app`

## 📱 วิธีการใช้งานตามอุปกรณ์

### 📲 การใช้งานบนมือถือ (Mobile)

#### บน Android:
1. **เปิดเว็บแอปพลิเคชัน**
   - เปิด Chrome หรือ browser อื่นๆ
   - พิมพ์ URL ของแอปพลิเคชัน (เช่น https://your-app.vercel.app)

2. **ติดตั้งเป็น PWA (Progressive Web App)**
   - คลิกที่ปุ่ม "⋮" (menu) ที่มุมขวาบน
   - เลือก "Add to Home Screen" หรือ "เพิ่มในหน้าจอหลัก"
   - คลิก "Add" หรือ "เพิ่ม"
   - Icon จะปรากฏบนหน้าจอหลัก

3. **ใช้งานแอปพลิเคชัน**
   - กดที่ icon บนหน้าจอหลักเพื่อเปิดแอป
   - แอปจะเปิดขึ้นแบบ fullscreen เหมือน native app
   - ใช้งานได้ทั้ง online และ offline (บางส่วน)

4. **การบันทึกข้อมูล**
   - กดที่แท็บ "ฟอร์ม" เพื่อเพิ่มข้อมูลใหม่
   - กรอกข้อมูลในฟอร์ม
   - กด "บันทึก" เพื่อบันทึกข้อมูล
   - ข้อมูลจะถูกบันทึกไปยัง MongoDB Atlas

#### บน iPhone (iOS):
1. **เปิดเว็บแอปพลิเคชัน**
   - เปิด Safari
   - พิมพ์ URL ของแอปพลิเคชัน

2. **ติดตั้งเป็น PWA**
   - คลิกที่ปุ่ม "Share" (สี่เหลี่ยมที่มีลูกศรขึ้น)
   - เลือก "Add to Home Screen" หรือ "เพิ่มในหน้าจอหลัก"
   - คลิก "Add" หรือ "เพิ่ม"
   - Icon จะปรากฏบนหน้าจอหลัก

3. **ใช้งานแอปพลิเคชัน**
   - กดที่ icon บนหน้าจอหลัก
   - แอปจะเปิดขึ้นแบบ fullscreen
   - ใช้งานได้เหมือน native app

### 📱 การใช้งานบนแท็บเล็ต (Tablet)

#### บน Android Tablet:
1. **เปิดเว็บแอปพลิเคชัน**
   - เปิด Chrome หรือ browser อื่นๆ
   - พิมพ์ URL ของแอปพลิเคชัน

2. **ติดตั้งเป็น PWA**
   - คลิกที่ปุ่ม "⋮" (menu)
   - เลือก "Add to Home Screen"
   - คลิก "Add"

3. **ใช้งานแอปพลิเคชัน**
   - กดที่ icon บนหน้าจอหลัก
   - ใช้งานได้ทั้งแนวตั้งและแนวนอน
   - หน้าจอขนาดใหญ่ทำให้กรอกข้อมูลง่ายขึ้น

#### บน iPad:
1. **เปิดเว็บแอปพลิเคชัน**
   - เปิด Safari
   - พิมพ์ URL ของแอปพลิเคชัน

2. **ติดตั้งเป็น PWA**
   - คลิกที่ปุ่ม "Share"
   - เลือก "Add to Home Screen"
   - คลิก "Add"

3. **ใช้งานแอปพลิเคชัน**
   - กดที่ icon บนหน้าจอหลัก
   - ใช้งานได้ทั้งแนวตั้งและแนวนอน
   - หน้าจอขนาดใหญ่เหมาะสำหรับการกรอกข้อมูลจำนวนมาก

### 💻 การใช้งานบนคอมพิวเตอร์ (Desktop/Laptop)

#### บน Windows:
1. **เปิดเว็บแอปพลิเคชัน**
   - เปิด Chrome, Edge, Firefox หรือ browser อื่นๆ
   - พิมพ์ URL ของแอปพลิเคชัน

2. **ใช้งานแอปพลิเคชัน**
   - ใช้งานผ่าน browser โดยตรง
   - สามารถติดตั้งเป็น PWA ได้ (Chrome/Edge):
     - คลิกที่ icon ที่แถบ address bar
     - เลือก "Install [App Name]"
     - แอปจะถูกติดตั้งและเปิดแบบ standalone

3. **การบันทึกข้อมูล**
   - ใช้ keyboard ช่วยในการกรอกข้อมูล
   - สามารถใช้ Tab เพื่อเลื่อนระหว่างฟิลด์
   - กด Enter เพื่อบันทึกข้อมูล

#### บน Mac:
1. **เปิดเว็บแอปพลิเคชัน**
   - เปิด Safari, Chrome หรือ browser อื่นๆ
   - พิมพ์ URL ของแอปพลิเคชัน

2. **ใช้งานแอปพลิเคชัน**
   - ใช้งานผ่าน browser โดยตรง
   - สามารถติดตั้งเป็น PWA ได้ (Chrome/Edge):
     - คลิกที่ icon ที่แถบ address bar
     - เลือก "Install [App Name]"
     - แอปจะถูกติดตั้งและเปิดแบบ standalone

3. **การบันทึกข้อมูล**
   - ใช้ keyboard ช่วยในการกรอกข้อมูล
   - สามารถใช้ Tab เพื่อเลื่อนระหว่างฟิลด์
   - กด Enter เพื่อบันทึกข้อมูล

### 🎯 ฟีเจอร์หลักที่ใช้งานได้บนทุกอุปกรณ์

#### 1. ฟอร์มบันทึกข้อมูล
- กรอกข้อมูลการผลิตเสื้อผ้า
- อัปโหลดรูปภาพ
- เลือกขั้นตอนการผลิต
- บันทึกข้อมูลไปยัง cloud database

#### 2. ดาวน์โหลดรายงาน
- ดาวน์โหลดรายงานเป็น PDF
- ดาวน์โหลดรายงานเป็น Excel
- เลือกช่วงเวลาที่ต้องการ

#### 3. สถิติ
- ดูสถิติการผลิต
- ดูจำนวนงานทั้งหมด
- ดูสถิติตามประเภท

#### 4. จัดการ Master Data
- เพิ่ม/แก้ไข/ลบรายการ master
- จัดการข้อมูลหลักของระบบ

### 💡 เคล็ดลับการใช้งาน

#### บน Mobile/Tablet:
- ใช้ landscape mode (แนวนอน) เพื่อหน้าจอที่กว้างขึ้น
- ใช้ PWA เพื่อประสบการณ์ที่ดีกว่า browser
- ข้อมูลจะ sync อัตโนมัติเมื่อมี internet

#### บน Desktop:
- ใช้ keyboard shortcuts เพื่อเพิ่มความเร็ว
- ใช้ PWA เพื่อแอปที่เปิดเร็วขึ้น
- สามารถใช้หลาย tab พร้อมกัน

#### ทั่วไป:
- ข้อมูลถูกบันทึกไปยัง MongoDB Atlas อัตโนมัติ
- สามารถใช้งานได้ทุกที่ทุกเวลาที่มี internet
- PWA ทำงานได้แม้ไม่มี internet (บางส่วน)

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

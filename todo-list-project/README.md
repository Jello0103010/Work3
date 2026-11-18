# TaskFlow — To-do List Workshop

เว็บแอปพลิเคชันจัดการรายการสิ่งที่ต้องทำ สร้างด้วย Node.js, Express.js, REST API และ Fetch API ตามแนวทางในคู่มือเวิร์กช็อป

## 1. สิ่งที่ต้องติดตั้ง

- Windows 10/11
- Node.js เวอร์ชัน LTS (ติดตั้ง npm มาพร้อมกัน)
- Visual Studio Code
- Google Chrome
- อินเทอร์เน็ตสำหรับติดตั้งแพ็กเกจ

ดาวน์โหลด Node.js: https://nodejs.org/en/download  
ดาวน์โหลด VS Code: https://code.visualstudio.com/

## 2. ตรวจสอบ Node.js และ npm

เปิด Terminal หรือ PowerShell แล้วพิมพ์ทีละคำสั่ง:

```bash
node -v
npm -v
```

ถ้าแสดงหมายเลขเวอร์ชัน แสดงว่าพร้อมใช้งาน

หาก PowerShell แจ้งว่าไม่อนุญาตให้รันสคริปต์ npm ให้เปิด PowerShell แล้วใช้คำสั่งตามคู่มือ:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 3. เปิดโปรเจกต์และติดตั้งแพ็กเกจ

1. แตกไฟล์ ZIP
2. เปิด VS Code
3. เลือก File > Open Folder แล้วเลือกโฟลเดอร์ `todo-list-project`
4. เปิด Terminal ใน VS Code ด้วย `Ctrl + backtick`
5. รันคำสั่ง:

```bash
npm install
```

คำสั่งนี้จะติดตั้ง Express, CORS และ nodemon ตามที่กำหนดใน `package.json`

## 4. เริ่มเซิร์ฟเวอร์

โหมดพัฒนา (แนะนำ):

```bash
npm run dev
```

หรือโหมดปกติ:

```bash
npm start
```

เมื่อเห็นข้อความ `Server is running at http://localhost:3000/` ให้เปิด Chrome ไปที่:

http://localhost:3000

หยุดเซิร์ฟเวอร์ด้วย `Ctrl + C`

## 5. ความสามารถของเว็บไซต์

- เพิ่มรายการงาน
- แสดงรายการงานทั้งหมด
- กรองงานทั้งหมด / กำลังทำ / เสร็จแล้ว
- เปลี่ยนสถานะงาน
- แก้ไขข้อความงาน
- ลบรายการงาน
- แสดงสรุปจำนวนงานและเปอร์เซ็นต์ความคืบหน้า

## 6. REST API

Base URL: `http://localhost:3000`

| Method | Endpoint | หน้าที่ |
|---|---|---|
| GET | `/api/tasks` | อ่านรายการทั้งหมด |
| GET | `/api/tasks?done=true` | อ่านเฉพาะงานที่เสร็จ |
| GET | `/api/tasks?done=false` | อ่านเฉพาะงานที่ยังไม่เสร็จ |
| GET | `/api/tasks/1` | อ่านงานตาม ID |
| POST | `/api/tasks` | เพิ่มงาน |
| PUT | `/api/tasks/1` | แก้ไขข้อความงาน |
| PATCH | `/api/tasks/1` | สลับสถานะงาน |
| DELETE | `/api/tasks/1` | ลบงาน |

ตัวอย่าง Body สำหรับ POST และ PUT:

```json
{
  "text": "ทำรายงานส่งอาจารย์"
}
```

ตัวอย่างทดสอบ GET:

เปิด `http://localhost:3000/api/tasks` ใน Chrome

สำหรับ POST, PUT, PATCH และ DELETE สามารถทดสอบผ่านหน้าเว็บไซต์ หรือใช้ REST Client / Postman ได้

Status code ที่ใช้:
- `200 OK` สำเร็จ
- `201 Created` สร้างข้อมูลสำเร็จ
- `204 No Content` ลบข้อมูลสำเร็จ
- `400 Bad Request` ข้อมูลไม่ถูกต้อง
- `404 Not Found` ไม่พบรายการ
- `500 Internal Server Error` เกิดข้อผิดพลาดฝั่งเซิร์ฟเวอร์

## 7. การ Debug ด้วย VS Code

1. เปิดไฟล์ `app.js`
2. คลิกบริเวณด้านซ้ายของเลขบรรทัดเพื่อวาง breakpoint เช่น บรรทัด `const task = tasks.find(...)` ภายใน GET `/api/tasks/:id`
3. เปิด Run and Debug ด้วย `Ctrl + Shift + D`
4. เลือก `Launch app.js`
5. กด `F5`
6. เปิด `http://localhost:3000/api/tasks/1` ใน Chrome เพื่อเรียก route และทำให้ breakpoint ทำงาน

ปุ่มที่ควรรู้:
- F5: Continue
- F10: Step Over
- F11: Step Into
- Shift + F11: Step Out
- Stop: หยุดการ Debug

แผงที่ควรตรวจสอบ:
- Variables: ดูค่าตัวแปร
- Watch: ติดตาม expression เช่น `tasks.length`
- Call Stack: ดูลำดับการเรียกฟังก์ชัน
- Debug Console: ทดลองประเมิน expression เช่น `req.params.id`

## 8. Chrome DevTools — Network

1. เปิดหน้าเว็บ `http://localhost:3000`
2. กด F12
3. เลือกแท็บ Network
4. เลือกตัวกรอง Fetch/XHR
5. เพิ่มงานจากหน้าเว็บ
6. เลือก request `POST /api/tasks`
7. ดู Payload และ Response
8. สังเกต request `GET /api/tasks` ที่หน้าเว็บเรียกเพื่อโหลดรายการใหม่

## 9. ทดลอง CORS ตามขั้นที่ 18

โปรเจกต์เปิด `cors()` ไว้ใน Express แล้ว

1. ให้เซิร์ฟเวอร์ทำงานที่ port 3000
2. เปิดไฟล์ `public/index.html` ด้วย Live Server (หากติดตั้งส่วนขยาย Live Server) จะได้ origin อีกตัว เช่น `http://127.0.0.1:5500`
3. เปิด Console และ Network ใน DevTools
4. ทดลองเพิ่มงาน และสังเกต request ที่ส่งข้าม origin

หมายเหตุ: การเปิดหน้าเว็บผ่าน `http://localhost:3000` เป็นวิธีหลักที่แนะนำ เพราะใช้ origin เดียวกับ API และไม่จำเป็นต้องใช้ Live Server

## 10. Debug Node.js ผ่าน Chrome DevTools (ขั้นโบนัส)

หยุดเซิร์ฟเวอร์เดิมก่อน แล้วรัน:

```bash
node --inspect app.js
```

เปิด Chrome ไปที่:

`chrome://inspect`

เลือก `inspect` ในหัวข้อ Remote Target จากนั้นเปิดแท็บ Sources และตั้ง breakpoint ได้

## 11. โครงสร้างโปรเจกต์

```text
todo-list-project/
├── app.js                 # Express server และ REST API
├── package.json           # ข้อมูลโปรเจกต์และ dependencies
├── .gitignore             # ไม่ส่ง node_modules ขึ้น Git
├── README.md              # คู่มือใช้งาน
├── .vscode/
│   └── launch.json        # การตั้งค่า VS Code Debugger
└── public/
    ├── index.html         # โครงสร้างหน้าเว็บ
    ├── style.css          # การตกแต่งหน้าเว็บ
    └── script.js          # Fetch API และการทำงานหน้าเว็บ
```

## 12. การอัปโหลด GitHub

1. สมัคร/เข้าสู่ระบบ https://github.com
2. สร้าง Repository ใหม่ เช่น `todo-list-workshop`
3. เปิด Terminal ในโฟลเดอร์โปรเจกต์
4. สั่งคำสั่งต่อไปนี้ (แทน URL ด้วย URL repository ของกลุ่ม):

```bash
git init
git add .
git commit -m "Create TaskFlow todo list application"
git branch -M main
git remote add origin https://github.com/USERNAME/todo-list-workshop.git
git push -u origin main
```

ห้ามอัปโหลด `node_modules` เพราะมีขนาดใหญ่และสร้างใหม่ได้ด้วย `npm install`

## 13. ข้อจำกัดของเวอร์ชันนี้

- ใช้ Array เก็บข้อมูลในหน่วยความจำ (in-memory) ไม่ใช่ฐานข้อมูลถาวร
- เมื่อหยุดหรือรีสตาร์ตเซิร์ฟเวอร์ ข้อมูลที่เพิ่ม/แก้ไข/ลบจะหาย และกลับไปเป็นข้อมูลตัวอย่าง
- ยังไม่มีระบบสมาชิกและการเข้าสู่ระบบ
- ไม่มีการซิงก์ข้อมูลระหว่างเครื่อง

## 14. เชื่อมโยงกับขั้นตอนในคู่มือ 0–19

| ขั้นในคู่มือ | สิ่งที่ทำในโปรเจกต์ |
|---|---|
| 0 | ติดตั้ง Node.js |
| 1 | ตรวจสอบ `node -v` และ `npm -v` |
| 2 | สร้างโปรเจกต์, `package.json`, `.gitignore` |
| 3 | ทดลองรัน JavaScript ด้วย Node.js (สามารถทดลองแยกด้วยไฟล์ app.js ชั่วคราวได้) |
| 4–5 | เรียนรู้ HTTP server และ routing พื้นฐานก่อน Express |
| 6 | ติดตั้ง Express ผ่าน npm |
| 7 | สร้างเซิร์ฟเวอร์ด้วย Express |
| 8–10 | REST API, HTTP verbs, status codes, route params และ query string |
| 11 | Logging middleware และ nodemon |
| 12–15 | VS Code Debugger, breakpoint, Variables, Watch, Call Stack, Logpoint |
| 16 | เสิร์ฟหน้าเว็บด้วย `express.static` และเรียก API ด้วย Fetch |
| 17 | ตรวจ request/response ด้วย Chrome Network |
| 18 | ทดลอง CORS ผ่าน Live Server |
| 19 | ทดลอง `node --inspect app.js` และ `chrome://inspect` |

หมายเหตุ: ขั้น 3–5 เป็นแบบฝึกพื้นฐานก่อนเปลี่ยนมาใช้ Express จึงไม่ต้องนำ HTTP server แบบเก่ามารวมในแอปฉบับสุดท้าย

## 15. แหล่งอ้างอิง

- คู่มือเวิร์กช็อป Node.js Express.js และการดีบัก (ไฟล์ประกอบการเรียน)
- Node.js: https://nodejs.org/docs/latest/api/
- Express.js: https://expressjs.com/
- npm: https://docs.npmjs.com/
- VS Code Debugging: https://code.visualstudio.com/docs/debugtest/debugging
- Chrome DevTools Network: https://developer.chrome.com/docs/devtools/network/

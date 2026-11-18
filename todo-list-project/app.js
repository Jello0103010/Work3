const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: บันทึก request ที่เข้ามาในเซิร์ฟเวอร์
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
  next();
});

// Middleware สำหรับอ่าน JSON และเปิด CORS (ใช้เมื่อทดสอบคนละ origin)
app.use(express.json());
app.use(cors());

// ให้ Express ส่งไฟล์หน้าเว็บไซต์จากโฟลเดอร์ public
app.use(express.static('public'));

// ข้อมูลตัวอย่างเก็บใน Array ตามขอบเขตของเวิร์กช็อป
// ข้อมูลจะเริ่มต้นใหม่เมื่อรีสตาร์ตเซิร์ฟเวอร์
let tasks = [
  { id: 1, text: 'ศึกษาพื้นฐาน Node.js', done: false, createdAt: new Date().toISOString() },
  { id: 2, text: 'ทดลองสร้าง REST API ด้วย Express', done: true, createdAt: new Date().toISOString() },
  { id: 3, text: 'ฝึกใช้ VS Code Debugger', done: false, createdAt: new Date().toISOString() }
];
let nextId = 4;

// GET /api/tasks หรือ GET /api/tasks?done=true|false
app.get('/api/tasks', (req, res) => {
  const { done } = req.query;

  if (done === undefined) {
    return res.json(tasks);
  }

  if (done !== 'true' && done !== 'false') {
    return res.status(400).json({ error: 'ค่า done ต้องเป็น true หรือ false' });
  }

  const filteredTasks = tasks.filter(task => String(task.done) === done);
  res.json(filteredTasks);
});

// GET /api/tasks/:id — อ่านรายการเดียว
app.get('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id ต้องเป็นจำนวนเต็มบวก' });
  }

  const task = tasks.find(item => item.id === id);
  if (!task) {
    return res.status(404).json({ error: 'ไม่พบรายการนี้' });
  }

  res.json(task);
});

// POST /api/tasks — เพิ่มรายการใหม่
app.post('/api/tasks', (req, res) => {
  const text = typeof req.body.text === 'string' ? req.body.text.trim() : '';

  if (!text) {
    return res.status(400).json({ error: 'ต้องระบุข้อความงาน (text)' });
  }

  const newTask = {
    id: nextId++,
    text,
    done: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id — แก้ไขข้อความงาน
app.put('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const text = typeof req.body.text === 'string' ? req.body.text.trim() : '';

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id ต้องเป็นจำนวนเต็มบวก' });
  }
  if (!text) {
    return res.status(400).json({ error: 'ต้องระบุข้อความงาน (text)' });
  }

  const task = tasks.find(item => item.id === id);
  if (!task) {
    return res.status(404).json({ error: 'ไม่พบรายการนี้' });
  }

  task.text = text;
  res.json(task);
});

// PATCH /api/tasks/:id — สลับสถานะงาน
app.patch('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id ต้องเป็นจำนวนเต็มบวก' });
  }

  const task = tasks.find(item => item.id === id);
  if (!task) {
    return res.status(404).json({ error: 'ไม่พบรายการนี้' });
  }

  task.done = !task.done;
  res.json(task);
});

// DELETE /api/tasks/:id — ลบรายการ
app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id ต้องเป็นจำนวนเต็มบวก' });
  }

  const exists = tasks.some(item => item.id === id);
  if (!exists) {
    return res.status(404).json({ error: 'ไม่พบรายการนี้' });
  }

  tasks = tasks.filter(item => item.id !== id);
  res.status(204).end();
});

// จัดการ JSON ที่ไม่ถูกต้อง
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'รูปแบบ JSON ไม่ถูกต้อง' });
  }
  next(err);
});

// Error handler กลาง
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});

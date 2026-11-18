const taskInput = document.querySelector('#task-input');
const taskForm = document.querySelector('#task-form');
const taskList = document.querySelector('#task-list');
const toast = document.querySelector('#toast');

let tasks = [];
let currentFilter = 'all';
let toastTimer;

// แสดงวันที่ปัจจุบัน
const now = new Date();
document.querySelector('#date-display').textContent = new Intl.DateTimeFormat('th-TH', {
  day: 'numeric', month: 'short', year: 'numeric'
}).format(now);
document.querySelector('#today-label').textContent = new Intl.DateTimeFormat('en', {
  weekday: 'long'
}).format(now).toUpperCase() + ' · YOUR OVERVIEW';

function showToast(message, isError = false) {
  toast.textContent = message;
  toast.classList.toggle('error', isError);
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      message = data.error || message;
    } catch (_) {}
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

// GET: โหลดรายการงานจาก REST API
async function loadTasks() {
  try {
    tasks = await apiRequest('/api/tasks');
    renderTasks();
  } catch (error) {
    taskList.innerHTML = '<div class="empty-state">ไม่สามารถโหลดข้อมูลได้ กรุณาตรวจสอบว่าเซิร์ฟเวอร์กำลังทำงาน</div>';
    showToast(error.message, true);
  }
}

function updateSummary() {
  const total = tasks.length;
  const done = tasks.filter(task => task.done).length;
  const active = total - done;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  document.querySelector('#stat-total').textContent = total;
  document.querySelector('#stat-active').textContent = active;
  document.querySelector('#stat-done').textContent = done;
  document.querySelector('#stat-progress').textContent = progress;
  document.querySelector('#progress-bar').style.width = `${progress}%`;

  document.querySelector('#all-count').textContent = total;
  document.querySelector('#active-count').textContent = active;
  document.querySelector('#done-count').textContent = done;
}

function createTaskElement(task) {
  const row = document.createElement('div');
  row.className = `task-row${task.done ? ' completed' : ''}`;

  const check = document.createElement('button');
  check.className = 'task-check';
  check.type = 'button';
  check.textContent = task.done ? '✓' : '';
  check.setAttribute('aria-label', task.done ? 'ทำเครื่องหมายว่ายังไม่เสร็จ' : 'ทำเครื่องหมายว่าเสร็จแล้ว');
  check.addEventListener('click', () => toggleTask(task.id));

  const text = document.createElement('span');
  text.className = 'task-text';
  text.textContent = task.text;

  const status = document.createElement('span');
  status.className = `task-status ${task.done ? 'status-done' : 'status-active'}`;
  status.textContent = task.done ? 'เสร็จแล้ว' : 'กำลังทำ';

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const edit = document.createElement('button');
  edit.className = 'icon-button';
  edit.type = 'button';
  edit.title = 'แก้ไขงาน';
  edit.setAttribute('aria-label', 'แก้ไขงาน');
  edit.textContent = '✎';
  edit.addEventListener('click', () => editTask(task));

  const remove = document.createElement('button');
  remove.className = 'icon-button delete';
  remove.type = 'button';
  remove.title = 'ลบงาน';
  remove.setAttribute('aria-label', 'ลบงาน');
  remove.textContent = '×';
  remove.addEventListener('click', () => deleteTask(task.id));

  actions.append(edit, remove);
  row.append(check, text, status, actions);
  return row;
}

function renderTasks() {
  updateSummary();

  const filtered = tasks.filter(task => {
    if (currentFilter === 'active') return !task.done;
    if (currentFilter === 'done') return task.done;
    return true;
  });

  document.querySelector('#visible-count').textContent = `${filtered.length} รายการ`;
  taskList.replaceChildren();

  if (filtered.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    const icon = document.createElement('span');
    icon.className = 'empty-icon';
    icon.textContent = currentFilter === 'done' ? '✓' : '✦';
    const message = document.createElement('div');
    message.textContent = currentFilter === 'done'
      ? 'ยังไม่มีงานที่เสร็จแล้ว'
      : currentFilter === 'active'
        ? 'ไม่มีงานที่กำลังทำอยู่'
        : 'ยังไม่มีรายการงาน เริ่มเพิ่มงานแรกของคุณได้เลย';
    empty.append(icon, message);
    taskList.append(empty);
    return;
  }

  filtered.forEach(task => taskList.append(createTaskElement(task)));
}

async function addTask(event) {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) {
    showToast('กรุณาพิมพ์รายการงานก่อน', true);
    return;
  }

  try {
    await apiRequest('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ text })
    });
    taskInput.value = '';
    currentFilter = 'all';
    setActiveFilter('all');
    await loadTasks();
    showToast('เพิ่มงานเรียบร้อยแล้ว');
  } catch (error) {
    showToast(error.message, true);
  }
}

async function toggleTask(id) {
  try {
    await apiRequest(`/api/tasks/${id}`, { method: 'PATCH' });
    await loadTasks();
    showToast('อัปเดตสถานะงานแล้ว');
  } catch (error) {
    showToast(error.message, true);
  }
}

async function editTask(task) {
  const updatedText = window.prompt('แก้ไขข้อความงาน:', task.text);
  if (updatedText === null) return;
  const text = updatedText.trim();
  if (!text) {
    showToast('ข้อความงานต้องไม่เป็นค่าว่าง', true);
    return;
  }

  try {
    await apiRequest(`/api/tasks/${task.id}`, {
      method: 'PUT',
      body: JSON.stringify({ text })
    });
    await loadTasks();
    showToast('แก้ไขงานเรียบร้อยแล้ว');
  } catch (error) {
    showToast(error.message, true);
  }
}

async function deleteTask(id) {
  if (!window.confirm('ต้องการลบรายการงานนี้ใช่หรือไม่?')) return;

  try {
    await apiRequest(`/api/tasks/${id}`, { method: 'DELETE' });
    await loadTasks();
    showToast('ลบงานเรียบร้อยแล้ว');
  } catch (error) {
    showToast(error.message, true);
  }
}

function setActiveFilter(filter) {
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.classList.toggle('active', button.classList.contains('nav-item') && button.dataset.filter === filter);
    button.classList.toggle('selected', button.classList.contains('filter-tab') && button.dataset.filter === filter);
  });
}

document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    setActiveFilter(currentFilter);
    renderTasks();
  });
});

taskForm.addEventListener('submit', addTask);

// เริ่มต้นเรียก API เมื่อหน้าเว็บโหลดเสร็จ
loadTasks();

// ============ DATA ============
const catData = [
  { name:'Food', icon:'🍔', color:'#fb923c', spent:1450, budget:2000 },
  { name:'Travel', icon:'🚌', color:'#38bdf8', spent:620, budget:1000 },
  { name:'Education', icon:'📚', color:'#7c6bff', spent:300, budget:500 },
  { name:'Entertainment', icon:'🎮', color:'#f472b6', spent:890, budget:1000 },
  { name:'Health', icon:'💊', color:'#34d399', spent:120, budget:500 },
  { name:'Other', icon:'📦', color:'#fbbf24', spent:230, budget:400 },
];

let expenses = [
  { desc:'Lunch', amt:120, cat:'food', date:'Today' },
  { desc:'Bus pass', amt:500, cat:'travel', date:'Yesterday' },
  { desc:'Spotify', amt:119, cat:'entertainment', date:'08 Apr' },
  { desc:'Textbooks', amt:300, cat:'education', date:'06 Apr' },
];

let goals = [
  { name:'New iPhone 15', icon:'📱', target:80000, saved:24000, date:'Dec 2025' },
  { name:'Study Trip to Manali', icon:'✈️', target:15000, saved:8500, date:'Jun 2025' },
  { name:'Gaming Setup', icon:'🎮', target:25000, saved:5000, date:'Aug 2025' },
];

let selectedGoalIcon = '📱';

const notifications = [
  { icon:'💡', title:'Spending Alert!', body:'You\'ve spent 89% of your food budget this month.', time:'2 min ago', unread:true },
  { icon:'🎉', title:'Goal Progress!', body:'You\'re 30% closer to your iPhone goal. Keep it up!', time:'1 hr ago', unread:true },
  { icon:'💰', title:'Cashback Received', body:'₹27 cashback added from Swiggy order.', time:'3 hr ago', unread:false },
  { icon:'🛡️', title:'Insurance Due', body:'Health Shield premium of ₹299 due in 5 days.', time:'Yesterday', unread:false },
  { icon:'📈', title:'Investment Update', body:'Your Nifty 50 SIP returned 12.4% this quarter.', time:'2 days ago', unread:false },
];

const aiResponses = {
  'save': 'Here are 3 easy ways to save more: \n1. Set a daily spending limit of ₹200\n2. Cook at home 4 days a week\n3. Cancel subscriptions you don\'t use\nYou could save ₹3,000-5,000 more per month! 💪',
  'spend': 'Your top 3 spending categories this month:\n1. 🍔 Food: ₹1,450 (72% of budget)\n2. 🎮 Entertainment: ₹890 (89% of budget)\n3. 🚌 Travel: ₹620 (62% of budget)\nWatch your entertainment spending! 📊',
  'insurance': 'For your age, I recommend:\n1. Health Shield Basic (₹299/mo) - already active!\n2. PhoneGuard Basic (₹79/mo) - great for your ₹15K+ phone\nBoth need parent approval. Want me to explain benefits? 🛡️',
  'invest': 'For teens, I suggest starting with:\n1. Liquid Mutual Funds (low risk, 6-7% returns)\n2. Index Funds via SIP (₹500/month minimum)\n3. Fixed Deposits (safe, 6.5% interest)\nAll need parent co-sign. Start small & stay consistent! 📈',
  'default': 'That\'s a great question! I\'m here to help you manage money better. You can ask me about saving tips, spending analysis, investment advice, or insurance plans. What would you like to know? 😊',
};

// ============ TABS ============
function switchTab(tab) {
  document.querySelectorAll('.feat-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  ['overview','expenses','goals','savings'].forEach(t => {
    document.getElementById('tab-' + t).style.display = t === tab ? 'block' : 'none';
  });
  if (tab === 'expenses') { renderExpenses(); setTimeout(drawBarChart, 100); }
  if (tab === 'goals') renderGoals();
  if (tab === 'savings') setTimeout(drawSavingsChart, 100);
}

document.getElementById('featTabs').addEventListener('click', e => {
  const tab = e.target.closest('.feat-tab');
  if (tab) switchTab(tab.dataset.tab);
});

// ============ DONUT CHART ============
function drawDonut() {
  const canvas = document.getElementById('donutChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 55, cy = 55, r = 45, inner = 28;
  const total = catData.reduce((s,c) => s + c.spent, 0);
  let start = -Math.PI / 2;
  ctx.clearRect(0, 0, 110, 110);
  catData.forEach(c => {
    const slice = (c.spent / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.arc(cx, cy, r, start, start + slice);
    ctx.arc(cx, cy, inner, start + slice, start, true);
    ctx.fillStyle = c.color;
    ctx.fill();
    start += slice;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, inner - 2, 0, 2 * Math.PI);
  ctx.fillStyle = '#1e2238';
  ctx.fill();
  // Legend
  const legend = document.getElementById('donutLegend');
  if (legend) {
    legend.innerHTML = catData.map(c => `
      <div class="dl-item">
        <div class="dl-dot" style="background:${c.color}"></div>
        <span class="dl-name">${c.name}</span>
        <span class="dl-pct" style="color:${c.color}">₹${c.spent}</span>
      </div>
    `).join('');
  }
}

// ============ BAR CHART ============
function drawBarChart() {
  const canvas = document.getElementById('barChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 340, H = 180;
  canvas.width = W; canvas.height = H;
  ctx.clearRect(0, 0, W, H);
  const bars = catData;
  const pad = 20, barW = (W - pad * 2) / bars.length - 8, maxV = 2000;
  bars.forEach((c, i) => {
    const x = pad + i * ((W - pad * 2) / bars.length);
    const barH = ((c.spent / maxV) * (H - 50));
    const budgetH = ((c.budget / maxV) * (H - 50));
    // Budget bar (faint)
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    ctx.beginPath(); ctx.roundRect(x, H - 30 - budgetH, barW, budgetH, 4); ctx.fill();
    // Spent bar
    ctx.fillStyle = c.color;
    ctx.beginPath(); ctx.roundRect(x, H - 30 - barH, barW, barH, 4); ctx.fill();
    // Label
    ctx.fillStyle = '#a0a3c4';
    ctx.font = '9px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(c.name.slice(0,4), x + barW / 2, H - 12);
    ctx.fillStyle = c.color;
    ctx.font = 'bold 9px Nunito, sans-serif';
    ctx.fillText('₹' + c.spent, x + barW / 2, H - 30 - barH - 4);
  });
}

// ============ SAVINGS CHART ============
function drawSavingsChart() {
  const canvas = document.getElementById('savingsChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 340, H = 160;
  canvas.width = W; canvas.height = H;
  const months = ['Oct','Nov','Dec','Jan','Feb','Mar','Apr'];
  const vals = [3200, 4100, 5000, 5800, 6900, 7600, 8250];
  const maxV = 10000, pad = 30;
  const stepX = (W - pad * 2) / (vals.length - 1);
  // Grid lines
  [0.25, 0.5, 0.75, 1].forEach(r => {
    const y = H - 25 - r * (H - 50);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke();
  });
  // Area fill
  ctx.beginPath();
  vals.forEach((v, i) => {
    const x = pad + i * stepX, y = H - 25 - (v / maxV) * (H - 50);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(pad + (vals.length - 1) * stepX, H - 25);
  ctx.lineTo(pad, H - 25);
  ctx.closePath();
  ctx.fillStyle = 'rgba(124,107,255,0.15)';
  ctx.fill();
  // Line
  ctx.beginPath();
  vals.forEach((v, i) => {
    const x = pad + i * stepX, y = H - 25 - (v / maxV) * (H - 50);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#7c6bff';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  // Dots
  vals.forEach((v, i) => {
    const x = pad + i * stepX, y = H - 25 - (v / maxV) * (H - 50);
    ctx.beginPath(); ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = i === vals.length - 1 ? '#fbbf24' : '#7c6bff';
    ctx.fill();
    ctx.fillStyle = '#a0a3c4';
    ctx.font = '9px Nunito'; ctx.textAlign = 'center';
    ctx.fillText(months[i], x, H - 8);
  });
}

// ============ EXPENSES ============
function renderExpenses() {
  // Category grid
  const grid = document.getElementById('expGrid');
  grid.innerHTML = catData.map(c => `
    <div class="exp-cat-card">
      <div class="ecc-icon">${c.icon}</div>
      <div class="ecc-name">${c.name}</div>
      <div class="ecc-bar"><div class="ecc-fill" style="width:${Math.round(c.spent/c.budget*100)}%;background:${c.color}"></div></div>
      <div class="ecc-amt" style="color:${c.color}">₹${c.spent}<span style="font-size:0.7rem;color:var(--text3)"> / ₹${c.budget}</span></div>
    </div>
  `).join('');
  // Expense list
  const list = document.getElementById('expList');
  list.innerHTML = expenses.map((e,i) => {
    const cat = catData.find(c => c.name.toLowerCase() === e.cat) || catData[5];
    return `<div class="txn-item" style="${i===expenses.length-1?'border-bottom:none':''}">
      <div class="txn-avatar" style="background:${cat.color}22;color:${cat.color};font-size:1.2rem;border-radius:12px;width:42px;height:42px;display:flex;align-items:center;justify-content:center">${cat.icon}</div>
      <div class="txn-info"><div class="txn-name">${e.desc}</div><div class="txn-detail">${cat.name} · ${e.date}</div></div>
      <div class="txn-amt red">-₹${e.amt}</div>
    </div>`;
  }).join('');
}

function addExpense() {
  const desc = document.getElementById('expDesc').value.trim();
  const amt = parseInt(document.getElementById('expAmt').value) || 0;
  const cat = document.getElementById('expCat').value;
  if (!desc || amt < 1) { showToast('Please fill all fields'); return; }
  expenses.unshift({ desc, amt, cat, date:'Today' });
  const c = catData.find(x => x.name.toLowerCase() === cat);
  if (c) c.spent += amt;
  closeModal('addExpModal');
  showToast('✅ Expense added!');
  renderExpenses();
  setTimeout(drawBarChart, 100);
}

// ============ GOALS ============
function renderGoals() {
  const el = document.getElementById('goalsList');
  el.innerHTML = goals.map((g, idx) => {
    const pct = Math.round((g.saved / g.target) * 100);
    return `<div class="goal-card">
      <div class="gc-top">
        <div class="gc-icon">${g.icon}</div>
        <div class="gc-info">
          <div class="gc-name">${g.name}</div>
          <div class="gc-date">🗓️ By ${g.date}</div>
        </div>
        <div class="gc-pct">${pct}%</div>
      </div>
      <div class="gc-bar"><div class="gc-fill" style="width:${pct}%"></div></div>
      <div class="gc-amounts"><span>₹${g.saved.toLocaleString()} saved</span><span>Goal: ₹${g.target.toLocaleString()}</span></div>
      <div class="gc-add">
        <input type="number" placeholder="Add savings (₹)" id="goalInput${idx}"/>
        <button class="btn btn-primary btn-sm" onclick="addToGoal(${idx})">+ Add</button>
      </div>
    </div>`;
  }).join('');
}

function addToGoal(idx) {
  const val = parseInt(document.getElementById('goalInput' + idx).value) || 0;
  if (val < 1) { showToast('Enter a valid amount'); return; }
  goals[idx].saved = Math.min(goals[idx].saved + val, goals[idx].target);
  showToast('💰 ₹' + val + ' added to "' + goals[idx].name + '"!');
  renderGoals();
}

// Goal icon select
document.getElementById('goalIconSelect').addEventListener('click', e => {
  const btn = e.target.closest('.gi-btn');
  if (!btn) return;
  document.querySelectorAll('.gi-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedGoalIcon = btn.dataset.icon;
});

function addGoal() {
  const name = document.getElementById('goalName').value.trim();
  const target = parseInt(document.getElementById('goalTarget').value) || 0;
  const date = document.getElementById('goalDate').value;
  if (!name || target < 1) { showToast('Please fill all fields'); return; }
  const dateStr = date ? new Date(date).toLocaleDateString('en-IN',{month:'short',year:'numeric'}) : 'Dec 2025';
  goals.push({ name, icon:selectedGoalIcon, target, saved:0, date:dateStr });
  closeModal('addGoalModal');
  showToast('🎯 Goal "' + name + '" created!');
  renderGoals();
}

// ============ NOTIFICATIONS ============
function renderNotifications() {
  const list = document.getElementById('notifList');
  list.innerHTML = notifications.map(n => `
    <div class="notif-item ${n.unread ? 'unread' : ''}">
      <div class="notif-icon">${n.icon}</div>
      <div>
        <div class="notif-title">${n.title}</div>
        <div class="notif-body">${n.body}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>
  `).join('');
}

// ============ AI ASSISTANT ============
function openAI() { openModal('aiModal'); }

function sendAIMsg(preset) {
  const input = document.getElementById('aiInput');
  const msg = preset || input.value.trim();
  if (!msg) return;
  input.value = '';
  const chat = document.getElementById('aiChat');
  // User msg
  chat.innerHTML += `<div class="ai-msg user"><div class="ai-bubble">${msg}</div></div>`;
  // Typing
  const typingId = 'typing-' + Date.now();
  chat.innerHTML += `<div class="ai-msg bot ai-typing" id="${typingId}"><div class="ai-bubble"></div></div>`;
  chat.scrollTop = chat.scrollHeight;
  // AI response
  const key = Object.keys(aiResponses).find(k => msg.toLowerCase().includes(k)) || 'default';
  setTimeout(() => {
    document.getElementById(typingId)?.remove();
    const resp = aiResponses[key].replace(/\n/g, '<br>');
    chat.innerHTML += `<div class="ai-msg bot"><div class="ai-bubble">${resp}</div></div>`;
    chat.scrollTop = chat.scrollHeight;
  }, 1200);
}

// ============ PANELS & MODALS ============
function openPanel(id) {
  document.getElementById(id).classList.add('open');
  document.getElementById('panelBackdrop').classList.add('show');
  renderNotifications();
}
function closePanel(id) {
  document.getElementById(id).classList.remove('open');
  document.getElementById('panelBackdrop').classList.remove('show');
}
function closePanels() {
  document.querySelectorAll('.side-panel').forEach(p => p.classList.remove('open'));
  document.getElementById('panelBackdrop').classList.remove('show');
}
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function addSaveRule() {
  closeModal('addSaveRuleModal');
  showToast('✅ Auto-save rule added!');
}

function refreshTips() { showToast('💡 Tips refreshed!'); }

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function goPage(page) {
  const map = { home:'index.html', payment:'payment.html', investment:'investment.html', loan:'loan.html', wallet:'wallet.html' };
  if (map[page]) window.location.href = map[page];
}

// Init
drawDonut();
renderNotifications();

const contacts = [
  { name: 'Rahul Sharma', upi: 'rahul@finteen', acc: '9876543210' },
  { name: 'Priya Singh', upi: 'priya@oksbi', acc: '9123456789' },
  { name: 'Mom', upi: 'mom@paytm', acc: '9800012345' },
  { name: 'Dad', upi: 'dad@upi', acc: '9811122233' },
  { name: 'Ananya Joshi', upi: 'ananya@gpay', acc: '9766554433' },
];

function goTo(page) { window.location.href = page; }

function openSearch() {
  document.getElementById('searchOverlay').classList.add('open');
  setTimeout(() => document.getElementById('searchInput').focus(), 100);
  renderSearch(contacts);
}
function closeSearch() {
  document.getElementById('searchOverlay').classList.remove('open');
  document.getElementById('searchInput').value = '';
}
function filterSearch() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.upi.toLowerCase().includes(q) ||
    c.acc.includes(q)
  );
  renderSearch(filtered);
}
function renderSearch(list) {
  const el = document.getElementById('searchResults');
  el.innerHTML = list.map(c => `
    <div class="search-result-item" onclick="selectContact('${c.name}','${c.upi}')">
      <div class="search-avatar">${c.name[0]}</div>
      <div class="search-info">
        <div class="name">${c.name}</div>
        <div class="upi">${c.upi} · ${c.acc}</div>
      </div>
      <span style="color:var(--accent2);font-size:0.8rem;font-weight:700;">Pay →</span>
    </div>
  `).join('');
}
function selectContact(name, upi) {
  closeSearch();
  sessionStorage.setItem('payTo', name);
  sessionStorage.setItem('payUPI', upi);
  window.location.href = 'payment.html';
}

let balanceVisible = true;
function toggleBalance() {
  balanceVisible = !balanceVisible;
  document.getElementById('balanceVal').textContent = balanceVisible ? '₹ 12,450.00' : '₹ ••••••';
}
const express = require('express');
const app = express();
const PORT = 5000;

// Allow frontend to connect
const cors = require('cors');
app.use(cors());

// Dummy data (later replace with database)
const userData = {
  name: "Aryan Kumar",
  balance: 12450,
  income: 3200,
  spent: 1850,
  goal: 5000,
  transactions: [
    { name: "Rahul Sharma", amount: -250 },
    { name: "Pocket Money", amount: 2000 },
    { name: "Zomato", amount: -340 }
  ]
};

// API
app.get('/api/user', (req, res) => {
  res.json(userData);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




// backend


async function loadUserData() {
  try {
    const res = await fetch('http://localhost:5000/api/user');
    const data = await res.json();

    // Update UI
    document.querySelector('.greeting-name').textContent = data.name;
    document.getElementById('balanceVal').textContent = `₹ ${data.balance}`;

    // Stats
    document.querySelectorAll('.stat-val')[0].textContent = `₹${data.income}`;
    document.querySelectorAll('.stat-val')[1].textContent = `₹${data.spent}`;
    document.querySelectorAll('.stat-val')[2].textContent = `₹${data.goal}`;

    // Goal
    document.querySelector('.goal-name').textContent = "New iPhone 16";
    document.querySelector('.progress-labels').innerHTML =
      `<span>₹${data.saved} saved</span><span>₹${data.goal} goal</span>`;

    // Progress %
    const percent = (data.saved / data.goal) * 100;
    document.querySelector('.progress-bar-fill').style.width = percent + '%';

    // Transactions
    renderTransactions(data.transactions);

  } catch (err) {
    console.error("Error loading data:", err);
  }
}

function renderTransactions(txns) {
  const container = document.querySelector('.txn-list');

  container.innerHTML = txns.map(txn => `
    <div class="txn-item">
      <div class="txn-avatar">${txn.name[0]}</div>
      <div class="txn-info">
        <p class="txn-name">${txn.name}</p>
        <p class="txn-detail">${txn.type}</p>
      </div>
      <div class="txn-amt ${txn.amount > 0 ? 'green' : 'red'}">
        ${txn.amount > 0 ? '+' : ''}₹${Math.abs(txn.amount)}
      </div>
    </div>
  `).join('');
}

// Load data when page opens
window.onload = loadUserData;
const TEEN_LIMIT = 5000;
let currentMethod = 'upi';

// Pre-fill from search
window.addEventListener('load', () => {
  const payTo = sessionStorage.getItem('payTo');
  const payUPI = sessionStorage.getItem('payUPI');
  if (payTo && payUPI) {
    document.getElementById('receiverInput').value = payUPI;
    showVerified(payTo, payUPI);
    sessionStorage.removeItem('payTo');
    sessionStorage.removeItem('payUPI');
  }
});

function setMethod(btn, method) {
  document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentMethod = method;
  const labels = { upi:'UPI ID / Name', phone:'Phone Number', account:'Account Number' };
  const placeholders = { upi:'Enter UPI ID e.g. name@paytm', phone:'Enter 10-digit mobile number', account:'Enter bank account number' };
  document.getElementById('receiverLabel').textContent = labels[method];
  document.getElementById('receiverInput').placeholder = placeholders[method];
}

function selectContact(name, upi) {
  document.getElementById('receiverInput').value = upi;
  showVerified(name, upi);
}

function verifyReceiver() {
  const val = document.getElementById('receiverInput').value.trim();
  if (!val) { showToast('Please enter a UPI ID / phone number'); return; }
  showToast('Verifying...');
  setTimeout(() => { showVerified('Verified User', val); showToast('✓ Receiver verified!'); }, 800);
}

function showVerified(name, upi) {
  document.getElementById('verifiedCard').style.display = 'flex';
  document.getElementById('verifiedName').textContent = name;
  document.getElementById('verifiedUPI').textContent = upi;
  document.getElementById('verifiedAvatar').textContent = name[0].toUpperCase();
}

function setAmount(val) {
  document.getElementById('amountInput').value = val;
  checkLimit();
}

function checkLimit() {
  const amt = parseFloat(document.getElementById('amountInput').value) || 0;
  const note = document.getElementById('limitNote');
  if (amt > TEEN_LIMIT) {
    note.textContent = `⚠️ Exceeds teen limit of ₹${TEEN_LIMIT}. Parent approval needed.`;
    note.classList.add('warn');
  } else {
    note.textContent = `💡 Teen limit: ₹${TEEN_LIMIT} per transaction`;
    note.classList.remove('warn');
  }
}

function sendMoney() {
  const receiver = document.getElementById('verifiedName')?.textContent || 'Unknown';
  const amt = parseFloat(document.getElementById('amountInput').value);
  if (!amt || amt <= 0) { showToast('Enter a valid amount'); return; }
  if (amt > TEEN_LIMIT) { showToast('⚠️ Needs parent approval for amounts above ₹5,000'); return; }
  document.getElementById('successMsg').textContent = `₹${amt} sent to ${receiver}`;
  document.getElementById('successModal').classList.add('open');
}

function closeSuccess() {
  document.getElementById('successModal').classList.remove('open');
  document.getElementById('amountInput').value = '';
}

function openQR() {
  document.getElementById('qrModal').classList.add('open');
  drawQR();
}
function closeQR() { document.getElementById('qrModal').classList.remove('open'); }

function drawQR() {
  const canvas = document.getElementById('qrCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 160; canvas.height = 160;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 160, 160);
  // Simple QR pattern simulation
  ctx.fillStyle = '#000';
  const size = 8;
  const pattern = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,0,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0],
    [1,0,1,0,1,0,1,0,1,1,0,1,1,1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,0,0,1,0,0,0,0,0,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
  ];
  pattern.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell) ctx.fillRect(c * 7 + 8, r * 8 + 8, 6, 7);
    });
  });
}

// Search
const contacts = [
  { name:'Rahul Sharma', upi:'rahul@finteen', acc:'9876543210' },
  { name:'Priya Singh', upi:'priya@oksbi', acc:'9123456789' },
  { name:'Mom', upi:'mom@paytm', acc:'9800012345' },
  { name:'Dad', upi:'dad@upi', acc:'9811122233' },
];
function openSearch() { document.getElementById('searchOverlay').classList.add('open'); renderSearch(contacts); }
function closeSearch() { document.getElementById('searchOverlay').classList.remove('open'); }
function filterSearch() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  renderSearch(contacts.filter(c => c.name.toLowerCase().includes(q) || c.upi.includes(q) || c.acc.includes(q)));
}
function renderSearch(list) {
  document.getElementById('searchResults').innerHTML = list.map(c => `
    <div class="search-result-item" onclick="pickContact('${c.name}','${c.upi}')">
      <div class="search-avatar">${c.name[0]}</div>
      <div class="search-info"><div class="name">${c.name}</div><div class="upi">${c.upi}</div></div>
    </div>`).join('');
}
function pickContact(name, upi) { closeSearch(); selectContact(name, upi); }

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

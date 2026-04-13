// Filter
document.getElementById('filterChips').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  const f = chip.dataset.filter;
  document.querySelectorAll('#txnList .txn-item').forEach(item => {
    item.style.display = (f === 'all' || item.dataset.type === f) ? 'flex' : 'none';
  });
});

// Add money
function setAmt(val) {
  document.getElementById('addAmtInput').value = val;
}
function addMoney() {
  const amt = parseInt(document.getElementById('addAmtInput').value) || 0;
  if (amt < 1) { showToast('Please enter a valid amount'); return; }
  closeModal('addMoneyModal');
  showToast('✅ ₹' + amt + ' added to wallet!');
}

// Spin wheel
const segments = ['₹5','₹10','Better luck!','₹20','₹2','₹50','Try again','₹15'];
const colors = ['#7c6bff','#38bdf8','#f87171','#34d399','#fbbf24','#a78bfa','#fb923c','#34d399'];
let spinning = false;
let currentAngle = 0;

function drawWheel() {
  const canvas = document.getElementById('spinWheel');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 120, cy = 120, r = 110;
  const arc = (2 * Math.PI) / segments.length;
  ctx.clearRect(0, 0, 240, 240);
  segments.forEach((seg, i) => {
    const start = currentAngle + i * arc;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, start + arc);
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(start + arc / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Nunito, sans-serif';
    ctx.fillText(seg, r - 10, 4);
    ctx.restore();
  });
  // Center circle
  ctx.beginPath();
  ctx.arc(cx, cy, 20, 0, 2 * Math.PI);
  ctx.fillStyle = '#1e2238';
  ctx.fill();
  ctx.strokeStyle = '#7c6bff';
  ctx.lineWidth = 3;
  ctx.stroke();
  // Pointer
  ctx.beginPath();
  ctx.moveTo(cx + r - 5, cy);
  ctx.lineTo(cx + r + 15, cy - 8);
  ctx.lineTo(cx + r + 15, cy + 8);
  ctx.fillStyle = '#fbbf24';
  ctx.fill();
}

function spinWheel() {
  if (spinning) return;
  spinning = true;
  document.getElementById('spinBtn').disabled = true;
  document.getElementById('spinResult').textContent = '';
  const totalSpins = (5 + Math.random() * 5) * 2 * Math.PI;
  const duration = 3000;
  const start = performance.now();
  const startAngle = currentAngle;

  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    currentAngle = startAngle + totalSpins * ease;
    drawWheel();
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      const arc = (2 * Math.PI) / segments.length;
      const normalized = ((2 * Math.PI) - (currentAngle % (2 * Math.PI))) % (2 * Math.PI);
      const idx = Math.floor(normalized / arc) % segments.length;
      const prize = segments[idx];
      document.getElementById('spinResult').textContent = '🎉 You won: ' + prize + '!';
      document.getElementById('spinBtn').disabled = false;
      if (prize !== 'Better luck!' && prize !== 'Try again') {
        showToast('🎊 ' + prize + ' cashback added!');
      }
    }
  }
  requestAnimationFrame(animate);
}

// Draw QR (simple pattern)
function drawQR() {
  const canvas = document.getElementById('qrCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = 180, cell = 6;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  const seed = 'insurpay-teen';
  for (let r = 0; r < size / cell; r++) {
    for (let c = 0; c < size / cell; c++) {
      const v = (r * 31 + c * 17 + seed.charCodeAt((r + c) % seed.length)) % 3;
      if (v === 0) {
        ctx.fillStyle = '#1a1040';
        ctx.fillRect(c * cell, r * cell, cell, cell);
      }
    }
  }
  // Corner squares
  [[0,0],[0,size-42],[size-42,0]].forEach(([x,y]) => {
    ctx.fillStyle = '#1a1040';
    ctx.fillRect(x, y, 42, 42);
    ctx.fillStyle = '#fff';
    ctx.fillRect(x+6, y+6, 30, 30);
    ctx.fillStyle = '#1a1040';
    ctx.fillRect(x+12, y+12, 18, 18);
  });
}

function copyCoupon(code) {
  navigator.clipboard.writeText(code).catch(()=>{});
  showToast('✅ Coupon code ' + code + ' copied!');
}

function shareQR() {
  showToast('📤 QR shared!');
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
  if (id === 'spinModal') { setTimeout(drawWheel, 100); }
  if (id === 'qrModal') { setTimeout(drawQR, 100); }
}
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function goPage(page) {
  const map = { home:'home.html', payment:'payment.html', investment:'investment.html', loan:'loan.html', insurance:'insurance.html' };
  if (map[page]) window.location.href = map[page];
}

function showSearch() { showToast('🔍 Search coming soon'); }

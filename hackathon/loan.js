let duration = 3;
const RATE = 8 / 100 / 12;

function showLoanTab(id, btn) {
  ['personal','education','active'].forEach(t => {
    document.getElementById('ltab-' + t).style.display = 'none';
  });
  document.getElementById('ltab-' + id).style.display = 'block';
  document.querySelectorAll('.loan-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function updateLoan() {
  const amt = parseInt(document.getElementById('loanSlider').value);
  document.getElementById('sliderAmt').textContent = '₹' + amt.toLocaleString('en-IN');
  document.getElementById('emiPrincipal').textContent = '₹' + amt.toLocaleString('en-IN');
  calcEMI(amt);
}

function calcEMI(principal) {
  const n = duration;
  const r = RATE;
  const emi = r === 0 ? principal / n : Math.round(principal * r * Math.pow(1+r, n) / (Math.pow(1+r, n) - 1));
  const total = emi * n;
  document.getElementById('emiAmt').textContent = '₹' + emi.toLocaleString('en-IN');
  document.getElementById('emiTotal').textContent = '₹' + total.toLocaleString('en-IN');
}

function setDuration(btn, months) {
  duration = months;
  document.querySelectorAll('.dur-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const amt = parseInt(document.getElementById('loanSlider').value);
  calcEMI(amt);
}

function updateEdu() {
  const amt = parseInt(document.getElementById('eduSlider').value);
  document.getElementById('eduAmt').textContent = '₹' + amt.toLocaleString('en-IN');
}

function applyLoan(type) {
  const phone = document.getElementById('parentPhone')?.value;
  if (type === 'Personal' && !phone) { showToast('Enter parent phone number'); return; }
  document.getElementById('loanModal').classList.add('open');
}
function closeLoanModal() { document.getElementById('loanModal').classList.remove('open'); }

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// Init
window.addEventListener('load', () => { updateLoan(); updateEdu(); });

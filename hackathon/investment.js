function showTab(id, btn) {
  ['mf','stocks','crypto','tips'].forEach(t => {
    document.getElementById('tab-' + t).style.display = 'none';
  });
  document.getElementById('tab-' + id).style.display = 'block';
  document.querySelectorAll('.inv-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

let currentFund = '';
function openInvest(name, meta, ret, min) {
  currentFund = name;
  document.getElementById('modalFundName').textContent = 'Invest in ' + name;
  document.getElementById('modalFundMeta').textContent = `${meta} · Returns: ${ret} · Min: ${min}`;
  document.getElementById('investAmt').value = '';
  document.getElementById('investModal').classList.add('open');
}
function closeInvest() { document.getElementById('investModal').classList.remove('open'); }

function confirmInvest() {
  const amt = parseFloat(document.getElementById('investAmt').value);
  if (!amt || amt <= 0) { showToast('Please enter a valid amount'); return; }
  if (amt > 2000) {
    showToast('📲 Parent approval request sent!');
  } else {
    showToast(`✅ ₹${amt} invested in ${currentFund}!`);
  }
  closeInvest();
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// Tab switching
document.getElementById('insTabs').addEventListener('click', e => {
  const tab = e.target.closest('.ins-tab');
  if (!tab) return;
  document.querySelectorAll('.ins-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  const key = tab.dataset.tab;
  ['health','life','gadget'].forEach(t => {
    document.getElementById('tab-' + t).style.display = t === key ? 'flex' : 'none';
  });
  document.querySelectorAll('#tab-' + key + ' .ins-plan-card').forEach((c,i) => {
    c.style.animationDelay = (i * 0.1) + 's';
    c.classList.add('fade-up');
  });
});
document.getElementById('tab-health').style.display = 'flex';

function applyPlan(btn) {
  const card = btn.closest('.ins-plan-card');
  document.getElementById('modalPlanName').textContent = card.dataset.plan;
  document.getElementById('modalPremiumAmt').textContent = '₹' + card.dataset.premium;
  document.getElementById('applyModal').classList.add('open');
}

function viewPlan(btn) {
  showToast('You already have this plan active ✓');
}

function submitInsurance() {
  closeModal('applyModal');
  showToast('📩 Approval request sent to parent!');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function goPage(page) {
  const map = { home:'index.html', payment:'payment.html', investment:'investment.html', loan:'loan.html' };
  if (map[page]) window.location.href = map[page];
}

function showSearch() { showToast('🔍 Search coming soon'); }

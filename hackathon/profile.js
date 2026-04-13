// ── AVATAR PICKER ──
const avatarSeeds = ['teen','alex','morgan','riley','sam','casey','jordan','taylor','blake','avery','quinn','skyler'];

function changeAvatar() {
  const grid = document.getElementById('avatarGrid');
  grid.innerHTML = avatarSeeds.map(seed => `
    <div class="av-option" onclick="selectAvatar('${seed}', this)">
      <img src="https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}&backgroundColor=7c6bff" alt="${seed}"/>
    </div>
  `).join('');
  openModal('avatarModal');
}

function selectAvatar(seed, el) {
  document.querySelectorAll('.av-option').forEach(a => a.classList.remove('selected'));
  el.classList.add('selected');
  const url = `https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}&backgroundColor=7c6bff`;
  document.getElementById('avatarImg').src = url;
  setTimeout(() => {
    closeModal('avatarModal');
    showToast('✅ Avatar updated!');
  }, 300);
}

// ── EDIT PROFILE ──
function saveProfile() {
  const name = document.getElementById('editName').value.trim();
  if (name) {
    document.getElementById('heroName').textContent = name;
    document.getElementById('infoName').textContent = name;
  }
  closeModal('editModal');
  showToast('✅ Profile updated!');
}

// ── PARENT ──
function saveParent() {
  closeModal('parentModal');
  showToast('📲 OTP sent to guardian\'s number!');
}

// ── PIN PAD ──
let pinEntry = '';
let pinStage = 'new'; // 'new' | 'confirm'
let pinFirst = '';

function pinPress(d) {
  if (pinEntry.length >= 4) return;
  pinEntry += d;
  updatePinDots();
  if (pinEntry.length === 4) {
    setTimeout(() => {
      if (pinStage === 'new') {
        pinFirst = pinEntry;
        pinEntry = '';
        pinStage = 'confirm';
        document.getElementById('pinLabel').textContent = 'Confirm your new PIN';
        updatePinDots();
      } else {
        if (pinEntry === pinFirst) {
          closeModal('pinModal');
          pinReset();
          showToast('🔐 PIN changed successfully!');
        } else {
          document.getElementById('pinLabel').textContent = '❌ PINs don\'t match. Try again.';
          pinEntry = '';
          pinStage = 'new';
          pinFirst = '';
          updatePinDots();
        }
      }
    }, 200);
  }
}

// MODAL CONTROL
function openModal(id) {
  document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

// PIN SAVE (localStorage for demo)
function savePin() {
  const pin = document.getElementById("newPin").value;

  if(pin.length < 4) {
    alert("PIN must be at least 4 digits");
    return;
  }

  localStorage.setItem("moneybee_pin", pin);
  alert("PIN Updated Successfully ✅");
  closeModal("pinModal");
}

function toggleTheme() {
  const isDark = document.getElementById("themeToggle").checked;

  if(isDark) {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}

// LOAD SAVED THEME
window.onload = () => {
  const savedTheme = localStorage.getItem("theme");

  if(savedTheme === "light") {
    document.body.classList.remove("dark");
    document.getElementById("themeToggle").checked = false;
  }
};

// LANGUAGE SWITCH
function setLanguage(lang) {
  localStorage.setItem("language", lang);
  alert("Language changed to " + (lang === "en" ? "English" : "Hindi"));
  closeModal("langModal");
}

// LOGOUT
function confirmLogout() {
  const confirmAction = confirm("Are you sure you want to logout?");
  
  if(confirmAction) {
    localStorage.clear(); // clear session
    window.location.href = "login.html"; // redirect
  }
}


function pinClear() {
  pinEntry = pinEntry.slice(0, -1);
  updatePinDots();
}

function pinSubmit() {
  if (pinEntry.length === 4) pinPress('');
}

function pinReset() {
  pinEntry = ''; pinStage = 'new'; pinFirst = '';
  document.getElementById('pinLabel').textContent = 'Enter new 4-digit PIN';
  updatePinDots();
}

function updatePinDots() {
  document.querySelectorAll('.pin-dot').forEach((d, i) => {
    d.classList.toggle('filled', i < pinEntry.length);
  });
}

// ── SPEND LIMIT ──
function updateLimit(val) {
  document.getElementById('limitDisplay').textContent = '₹' + parseInt(val).toLocaleString('en-IN');
}

function saveLimit() {
  const val = document.getElementById('limitSlider').value;
  document.getElementById('spendLimitLabel').textContent = '₹' + parseInt(val).toLocaleString('en-IN') + ' / day';
  closeModal('limitModal');
  const needsApproval = parseInt(val) > 1000;
  showToast(needsApproval ? '👨‍👩‍👧 Approval request sent to parent!' : '✅ Spend limit updated!');
}

// ── LANGUAGE ──
function setLang(lang, el) {
  document.querySelectorAll('.lang-item').forEach(l => {
    l.classList.remove('active');
    const chk = l.querySelector('.lang-check');
    if (chk) chk.remove();
  });
  el.classList.add('active');
  const chk = document.createElement('span');
  chk.className = 'lang-check'; chk.textContent = '✓';
  el.appendChild(chk);
  document.getElementById('langLabel').textContent = lang;
  setTimeout(() => {
    closeModal('langModal');
    showToast('🌍 Language set to ' + lang);
  }, 300);
}

// ── UPLOAD ──
function fakeUpload() {
  closeModal('uploadModal');
  showToast('📤 Document uploaded for review!');
}

// ── THEME ──
function toggleTheme() {
  const on = document.getElementById('darkToggle').checked;
  document.getElementById('themeLabel').textContent = on ? 'Currently dark' : 'Currently light';
  showToast(on ? '🌙 Dark mode on' : '☀️ Light mode on');
}

// ── LOGOUT / DELETE ──
function confirmLogout() {
  if (confirm('Log out of InsurPay?')) {
    showToast('👋 Logged out. See you soon!');
    setTimeout(() => window.location.href = 'login.html', 1500);
  }
}

function confirmDelete() {
  if (confirm('⚠️ This will permanently delete your account and all data. Are you sure?')) {
    showToast('🗑️ Deletion request submitted. You\'ll receive an email.');
  }
}

// ── MODALS ──
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── NAV ──
function goPage(page) {
  const map = {
    home: 'index.html', payment: 'payment.html',
    wallet: 'wallet.html', features: 'features.html',
    investment: 'investment.html', loan: 'loan.html',
    insurance: 'insurance.html'
  };
  if (map[page]) window.location.href = map[page];
}

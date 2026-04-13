// Splash
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('splash').classList.add('hide');
    document.getElementById('loginPage').style.opacity = '1';
  }, 1800);
});

function switchTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const loginTab = document.getElementById('loginTab');
  const signupTab = document.getElementById('signupTab');

  if (tab === 'login') {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
  } else {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    loginTab.classList.remove('active');
    signupTab.classList.add('active');
  }
}

function togglePwd(id, el) {
  const inp = document.getElementById(id);
  if (inp.type === 'password') { inp.type = 'text'; el.textContent = '🙈'; }
  else { inp.type = 'password'; el.textContent = '👁'; }
}

function checkAge() {
  const dob = new Date(document.getElementById('dobInput').value);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const notice = document.getElementById('minorNotice');
  notice.style.display = (age < 18) ? 'flex' : 'none';
}

function doLogin() {
  // Redirect to home/dashboard
  window.location.href = 'home.html';
}

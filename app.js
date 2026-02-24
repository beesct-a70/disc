// Đăng ký Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

const QUESTIONS = (typeof QUESTIONS_12 !== 'undefined' ? QUESTIONS_12.map((q) => q.items) : []);
const QUESTION_TITLES = (typeof QUESTIONS_12 !== 'undefined' ? QUESTIONS_12.map((q) => q.title) : []);
const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbwLICDW0wx2vsi1-N4VoalggNsuHSDXfWzcSCShhAsNHPF-zhdtuu7DySTpk6FaMMaQ/exec';

let state = {
  index: 0,
  selections: QUESTIONS.map(() => ({ most: null, least: null })),
  name: '',
  user: null,
  candidate: {
    gender: '',
    birthYear: '',
    job: '',
    phone: ''
  }
};
let viewingHistoryResult = false;

const elLogin = document.getElementById('screen-login');
const elRegister = document.getElementById('screen-register');
const elConsent = document.getElementById('screen-consent');
const elCandidate = document.getElementById('screen-candidate');
const elSelectVersion = document.getElementById('screen-select-version');
const elDiscInfo = document.getElementById('screen-disc-info');
const elTest = document.getElementById('screen-test');
const elResult = document.getElementById('screen-result');
const elHistory = document.getElementById('screen-history');
const elForgot = document.getElementById('screen-forgot');
const elProfile = document.getElementById('screen-profile');
const elChangePassword = document.getElementById('screen-change-password');

const loginForm = document.getElementById('login-form');
const loginPhone = document.getElementById('login-phone');
const loginPassword = document.getElementById('login-password');
const loginError = document.getElementById('login-error');

const registerForm = document.getElementById('register-form');
const registerName = document.getElementById('register-name');
const registerPhone = document.getElementById('register-phone');
const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');
const registerPassword2 = document.getElementById('register-password2');
const registerError = document.getElementById('register-error');
const registerSuccess = document.getElementById('register-success');
const registerLoginBtn = document.getElementById('register-login-btn');

const linkToRegister = document.getElementById('link-to-register');
const linkToLogin = document.getElementById('link-to-login');
const forgotLink = document.getElementById('forgot-password-link');

const forgotForm = document.getElementById('forgot-form');
const forgotPhone = document.getElementById('forgot-phone');
const forgotEmail = document.getElementById('forgot-email');
const forgotError = document.getElementById('forgot-error');
const forgotSuccess = document.getElementById('forgot-success');
const forgotBackBtn = document.getElementById('forgot-back-btn');

const profileForm = document.getElementById('profile-form');
const profileNameInput = document.getElementById('profile-name');
const profilePhoneInput = document.getElementById('profile-phone');
const profileEmailInput = document.getElementById('profile-email');
const profileGenderInput = document.getElementById('profile-gender');
const profileBirthYearInput = document.getElementById('profile-birth-year');
const profileJobInput = document.getElementById('profile-job');
const profilePhoneContactInput = document.getElementById('profile-phone-contact');
const profileError = document.getElementById('profile-error');
const profileSuccess = document.getElementById('profile-success');
const profileBackBtn = document.getElementById('profile-back-btn');

const passwordForm = document.getElementById('password-form');
const passwordOldInput = document.getElementById('password-old');
const passwordNewInput = document.getElementById('password-new');
const passwordNew2Input = document.getElementById('password-new2');
const passwordError = document.getElementById('password-error');
const passwordSuccess = document.getElementById('password-success');
const passwordBackBtn = document.getElementById('password-back-btn');

const introNextBtn = document.getElementById('intro-next-btn');
const introExitBtn = document.getElementById('intro-exit-btn');
const startBtn = document.getElementById('start-btn');
const select12QuestionsBtn = document.getElementById('select-12-questions');
const select28QuestionsBtn = document.getElementById('select-28-questions');
const selectionBackBtn = document.getElementById('selection-back-btn');
const consentCheckbox = document.getElementById('consent-checkbox');
const nameInput = document.getElementById('candidate-name');
const candidateGender = document.getElementById('candidate-gender');
const candidateBirthYear = document.getElementById('candidate-birth-year');
const candidateJob = document.getElementById('candidate-job');
const candidatePhone = document.getElementById('candidate-phone');

const historyBtn = document.getElementById('history-btn');
const historyList = document.getElementById('history-list');
const historyBackBtn = document.getElementById('history-back');
const exitBtn = document.getElementById('exit-btn');
const homeBtn = document.getElementById('home-btn');
const accountBtn = document.getElementById('account-btn');
const accountMenu = document.getElementById('account-menu');

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const saveBtn = document.getElementById('save-btn');
const saveStatus = document.getElementById('save-status');
const resultHistoryBackBtn = document.getElementById('result-history-back');
const viewDiscInfoLink = document.getElementById('view-disc-info-link');
const infoBackBtn = document.getElementById('info-back-btn');

const progressText = document.getElementById('progress-text');
const questionGroup = document.getElementById('question-group');

const scoresBox = document.getElementById('scores');
const barsAdapted = document.getElementById('bars-adapted');
const barsNatural = document.getElementById('bars-natural');
const bpvContainer = document.getElementById('bpv-container');
const pieChart = document.getElementById('piechart');
const detailsBox = document.getElementById('details');
const resultAnalysis = document.getElementById('result-analysis');
const appToolbar = document.getElementById('app-toolbar');

if (consentCheckbox && startBtn) {
  consentCheckbox.addEventListener('change', () => {
    startBtn.disabled = !consentCheckbox.checked;
  });
}

if (nameInput) {
  nameInput.addEventListener('input', (e) => {
    state.name = e.target.value || '';
  });
}

if (candidateGender) {
  candidateGender.addEventListener('change', (e) => {
    state.candidate.gender = e.target.value || '';
  });
}

if (candidateBirthYear) {
  candidateBirthYear.addEventListener('input', (e) => {
    state.candidate.birthYear = e.target.value || '';
  });
}

if (candidateJob) {
  candidateJob.addEventListener('input', (e) => {
    state.candidate.job = e.target.value || '';
  });
}

if (candidatePhone) {
  candidatePhone.addEventListener('input', (e) => {
    state.candidate.phone = e.target.value || '';
  });
}

if (forgotForm) {
  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = (forgotPhone && forgotPhone.value ? forgotPhone.value : '').trim();
    const email = (forgotEmail && forgotEmail.value ? forgotEmail.value : '').trim();
    if (forgotError) {
      forgotError.textContent = '';
    }
    if (forgotSuccess) {
      forgotSuccess.textContent = '';
      forgotSuccess.style.display = 'none';
    }
    if (!phone || !email) {
      if (forgotError) {
        forgotError.textContent = 'Vui lòng nhập đầy đủ Số điện thoại và Email.';
      }
      return;
    }
    const button = forgotForm.querySelector('button[type="submit"]');
    if (button) {
      button.disabled = true;
      button.textContent = 'Đang gửi...';
    }
    try {
      if (!SHEET_API_URL || SHEET_API_URL === 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec') {
        throw new Error('API chưa được cấu hình.');
      }
      const res = await fetch(SHEET_API_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'forgotPassword', phone, email })
      });
      const data = await res.json();
      if (!res.ok || !data || data.ok === false) {
        const msg = data && data.message ? data.message : 'Không thể gửi yêu cầu đặt lại mật khẩu.';
        throw new Error(msg);
      }
      if (forgotSuccess) {
        forgotSuccess.textContent = 'Đã gửi mật khẩu mới vào email của bạn. Vui lòng kiểm tra hộp thư.';
        forgotSuccess.style.display = 'block';
      }
    } catch (err) {
      if (forgotError) {
        forgotError.textContent = err && err.message ? err.message : 'Không thể gửi yêu cầu đặt lại mật khẩu.';
      }
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = 'Gửi yêu cầu đặt lại';
      }
    }
  });
}

if (profileForm) {
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!state.user) {
      showScreen('screen-login');
      return;
    }
    const name = (profileNameInput && profileNameInput.value ? profileNameInput.value : '').trim();
    const email = (profileEmailInput && profileEmailInput.value ? profileEmailInput.value : '').trim();
    const gender = profileGenderInput ? profileGenderInput.value : '';
    const birthYear = profileBirthYearInput && profileBirthYearInput.value ? profileBirthYearInput.value.trim() : '';
    const job = profileJobInput && profileJobInput.value ? profileJobInput.value.trim() : '';
    const phoneContact =
      profilePhoneContactInput && profilePhoneContactInput.value ? profilePhoneContactInput.value.trim() : '';
    if (profileError) {
      profileError.textContent = '';
    }
    if (profileSuccess) {
      profileSuccess.textContent = '';
      profileSuccess.style.display = 'none';
    }
    if (!name) {
      if (profileError) profileError.textContent = 'Vui lòng nhập Họ và tên.';
      return;
    }
    const button = profileForm.querySelector('button[type="submit"]');
    if (button) {
      button.disabled = true;
      button.textContent = 'Đang lưu...';
    }
    try {
      if (!SHEET_API_URL || SHEET_API_URL === 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec') {
        throw new Error('API chưa được cấu hình.');
      }
      const body = {
        action: 'updateProfile',
        userId: state.user.id,
        name,
        gender,
        birthYear,
        job,
        phoneContact,
        email
      };
      const res = await fetch(SHEET_API_URL, {
        method: 'POST',
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok || !data || data.ok === false) {
        const msg = data && data.message ? data.message : 'Không thể lưu thông tin tài khoản.';
        throw new Error(msg);
      }
      state.user.name = name;
      state.user.email = email;
      state.user.gender = gender;
      state.user.birthYear = birthYear;
      state.user.job = job;
      state.user.phoneContact = phoneContact;
      try {
        localStorage.setItem('beesct-user', JSON.stringify(state.user));
      } catch {}
      if (profileSuccess) {
        profileSuccess.textContent = 'Đã lưu thông tin tài khoản.';
        profileSuccess.style.display = 'block';
      }
    } catch (err) {
      if (profileError) {
        profileError.textContent =
          err && err.message ? err.message : 'Không thể lưu thông tin tài khoản. Vui lòng thử lại.';
      }
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = 'Lưu thông tin';
      }
    }
  });
}

if (profileBackBtn) {
  profileBackBtn.addEventListener('click', () => {
    showScreen('screen-consent');
  });
}

if (passwordForm) {
  passwordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!state.user) {
      showScreen('screen-login');
      return;
    }
    const oldPassword = passwordOldInput && passwordOldInput.value ? passwordOldInput.value : '';
    const newPassword = passwordNewInput && passwordNewInput.value ? passwordNewInput.value : '';
    const newPassword2 = passwordNew2Input && passwordNew2Input.value ? passwordNew2Input.value : '';
    if (passwordError) {
      passwordError.textContent = '';
    }
    if (passwordSuccess) {
      passwordSuccess.textContent = '';
      passwordSuccess.style.display = 'none';
    }
    if (!oldPassword || !newPassword || !newPassword2) {
      if (passwordError) passwordError.textContent = 'Vui lòng nhập đầy đủ tất cả các trường.';
      return;
    }
    if (newPassword !== newPassword2) {
      if (passwordError) passwordError.textContent = 'Mật khẩu mới nhập lại không khớp.';
      return;
    }
    const button = passwordForm.querySelector('button[type="submit"]');
    if (button) {
      button.disabled = true;
      button.textContent = 'Đang lưu...';
    }
    try {
      if (!SHEET_API_URL || SHEET_API_URL === 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec') {
        throw new Error('API chưa được cấu hình.');
      }
      const body = {
        action: 'changePassword',
        userId: state.user.id,
        oldPassword,
        newPassword
      };
      const res = await fetch(SHEET_API_URL, {
        method: 'POST',
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok || !data || data.ok === false) {
        const msg = data && data.message ? data.message : 'Không thể đổi mật khẩu.';
        throw new Error(msg);
      }
      if (passwordSuccess) {
        passwordSuccess.textContent = 'Đã đổi mật khẩu thành công.';
        passwordSuccess.style.display = 'block';
      }
      if (passwordOldInput) passwordOldInput.value = '';
      if (passwordNewInput) passwordNewInput.value = '';
      if (passwordNew2Input) passwordNew2Input.value = '';
    } catch (err) {
      if (passwordError) {
        passwordError.textContent = err && err.message ? err.message : 'Không thể đổi mật khẩu. Vui lòng thử lại.';
      }
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = 'Lưu mật khẩu';
      }
    }
  });
}

if (passwordBackBtn) {
  passwordBackBtn.addEventListener('click', () => {
    showScreen('screen-consent');
  });
}

if (resultHistoryBackBtn) {
  resultHistoryBackBtn.addEventListener('click', () => {
    viewingHistoryResult = false;
    if (restartBtn) restartBtn.style.display = 'inline-flex';
    if (saveBtn) saveBtn.style.display = 'inline-flex';
    resultHistoryBackBtn.style.display = 'none';
    showScreen('screen-history');
  });
}

if (viewDiscInfoLink) {
  viewDiscInfoLink.addEventListener('click', (e) => {
    e.preventDefault();
    elResult.classList.remove('active');
    if (elDiscInfo) elDiscInfo.classList.add('active');
  });
}

if (infoBackBtn) {
  infoBackBtn.addEventListener('click', () => {
    if (elDiscInfo) elDiscInfo.classList.remove('active');
    elResult.classList.add('active');
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = (loginPhone.value || '').trim();
    const password = (loginPassword.value || '').trim();
    loginError.textContent = '';
    if (!phone || !password) {
      loginError.textContent = 'Vui lòng nhập Số điện thoại và Mật khẩu.';
      return;
    }
    const button = loginForm.querySelector('button[type="submit"]');
    if (button) {
      button.disabled = true;
      button.textContent = 'Đang đăng nhập...';
    }
    let user = { id: phone, name: '', phone };
    try {
      if (SHEET_API_URL && SHEET_API_URL !== 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec') {
        const res = await fetch(SHEET_API_URL, {
          method: 'POST',
          body: JSON.stringify({ action: 'login', phone, password })
        });
        const data = await res.json();
        if (!res.ok || (data && data.ok === false)) {
          throw new Error(data && data.message ? data.message : 'Không thể đăng nhập.');
        }
        user = {
          id: (data && data.userId) || phone,
          name: (data && data.name) || '',
          phone: (data && data.phone) || phone
        };
      }
      state.user = user;
      try {
        localStorage.setItem('beesct-user', JSON.stringify(user));
      } catch {}
      showScreen('screen-consent');
    } catch (err) {
      loginError.textContent =
        err && err.message ? err.message : 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.';
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = 'Đăng nhập';
      }
    }
  });
}

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = (registerName.value || '').trim();
    const phone = (registerPhone.value || '').trim();
    const email = (registerEmail && registerEmail.value ? registerEmail.value : '').trim();
    const password = (registerPassword.value || '').trim();
    const password2 = (registerPassword2.value || '').trim();
    registerError.textContent = '';
    if (registerSuccess) {
      registerSuccess.textContent = '';
      registerSuccess.style.display = 'none';
    }
    if (registerLoginBtn) {
      registerLoginBtn.style.display = 'none';
    }
    if (!name || !phone || !password || !password2) {
      registerError.textContent = 'Vui lòng điền đầy đủ tất cả các trường.';
      return;
    }
    if (password !== password2) {
      registerError.textContent = 'Mật khẩu nhập lại không khớp.';
      return;
    }
    const button = registerForm.querySelector('button[type="submit"]');
    if (button) {
      button.disabled = true;
      button.textContent = 'Đang tạo tài khoản...';
    }
    try {
      if (SHEET_API_URL && SHEET_API_URL !== 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec') {
        const res = await fetch(SHEET_API_URL, {
          method: 'POST',
          body: JSON.stringify({ action: 'register', name, phone, email, password })
        });
        const data = await res.json();
        if (!res.ok || (data && data.ok === false)) {
          throw new Error(data && data.message ? data.message : 'Không thể tạo tài khoản.');
        }
      }
      if (registerSuccess) {
        registerSuccess.textContent = 'Đã tạo tài khoản thành công. Vui lòng đăng nhập để tiếp tục.';
        registerSuccess.style.display = 'block';
      }
      if (registerLoginBtn) {
        registerLoginBtn.style.display = 'inline-flex';
      }
    } catch (err) {
      registerError.textContent =
        err && err.message ? err.message : 'Không thể tạo tài khoản. Vui lòng thử lại.';
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = 'Tạo tài khoản';
      }
    }
  });
}

if (linkToRegister) {
  linkToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    showScreen('screen-register');
  });
}

if (linkToLogin) {
  linkToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    showScreen('screen-login');
  });
}

if (registerLoginBtn) {
  registerLoginBtn.addEventListener('click', () => {
    if (loginPhone && registerPhone) {
      loginPhone.value = registerPhone.value;
    }
    showScreen('screen-login');
  });
}

if (forgotLink) {
  forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (forgotPhone && loginPhone) {
      forgotPhone.value = loginPhone.value || '';
    }
    if (forgotError) {
      forgotError.textContent = '';
    }
    if (forgotSuccess) {
      forgotSuccess.textContent = '';
      forgotSuccess.style.display = 'none';
    }
    showScreen('screen-forgot');
  });
}

if (forgotBackBtn) {
  forgotBackBtn.addEventListener('click', () => {
    showScreen('screen-login');
  });
}

  if (historyBtn) {
    historyBtn.addEventListener('click', () => {
      loadHistory();
    });
  }

  function loadHistory() {
    if (!historyList) return;
    
    // Nếu chưa đăng nhập, chỉ hiển thị local
    if (!state.user) {
      loadHistoryLocal();
      return;
    }

    if (!SHEET_API_URL || SHEET_API_URL.includes('YOUR_SCRIPT_ID')) {
      loadHistoryLocal();
      return;
    }

    historyList.innerHTML = '<div class="note">Đang tải dữ liệu từ máy chủ...</div>';

    fetch(SHEET_API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'listTests', userId: state.user.id })
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.ok === false) {
          throw new Error('Lỗi API');
        }
        const tests = data.tests || [];
        renderHistoryList(tests);
      })
      .catch(() => {
        // Fallback to local storage if API fails
        loadHistoryLocal();
      });
  }

  function loadHistoryLocal() {
    try {
      const key = 'beesct-disc-results';
      let list = JSON.parse(localStorage.getItem(key) || '[]');
      renderHistoryList(list);
    } catch (e) {
      historyList.innerHTML = '<div class="note">Không thể tải lịch sử.</div>';
    }
  }

  function renderHistoryList(list) {
    if (!list || list.length === 0) {
      historyList.innerHTML = '<div class="note">Chưa có kết quả nào được lưu.</div>';
      return;
    }

    // Sắp xếp: Mới nhất lên đầu
    // Lưu ý: Dữ liệu từ API có thể dùng createdAt, LocalStorage dùng ts
    list.sort((a, b) => {
      const timeA = new Date(a.ts || a.createdAt).getTime() || 0;
      const timeB = new Date(b.ts || b.createdAt).getTime() || 0;
      return timeB - timeA;
    });

    historyList.innerHTML = '';
    list.forEach((item) => {
      const div = document.createElement('div');
      div.className = 'history-item';
      
      const ts = item.ts || item.createdAt;
      const date = ts ? new Date(ts).toLocaleString('vi-VN') : 'Không rõ ngày';
      
      // Xử lý dữ liệu khác nhau giữa API và Local
      let p, s, scoreStr, name;
      
      if (item.result && item.result.natural) {
        // Format LocalStorage
        p = item.result.primary;
        s = item.result.secondary;
        name = item.name || 'Ứng viên';
        scoreStr = ['D','I','S','C'].map(t => `${t}: ${item.result.natural[t]}`).join(' ');
      } else {
        // Format API (phẳng hóa)
        p = item.primaryType;
        s = item.secondaryType;
        name = item.candidateName || 'Ứng viên';
        // Với API cũ có thể chỉ lưu D,I,S,C dạng số
        scoreStr = `D: ${item.D} I: ${item.I} S: ${item.S} C: ${item.C}`;
      }

      div.innerHTML = `
        <div style="font-weight:700;margin-bottom:4px;color:#0f172a;">${name}</div>
        <div style="font-size:12px;color:#64748b;margin-bottom:8px;">${date}</div>
        <div style="font-size:14px;color:#334155;margin-bottom:4px;">
          Kiểu chính: <b>${p}</b> • Kiểu phụ: <b>${s}</b>
        </div>
        <div style="font-size:12px;color:#64748b;">${scoreStr}</div>
      `;
      div.addEventListener('click', () => {
        showHistoryResult(item);
      });
      historyList.appendChild(div);
    });
    showScreen('screen-history');
  }

if (historyBackBtn) {
  historyBackBtn.addEventListener('click', () => {
    showScreen('screen-consent');
  });
}

if (exitBtn) {
  exitBtn.addEventListener('click', () => {
    state.user = null;
    try {
      localStorage.removeItem('beesct-user');
    } catch {}
    showScreen('screen-login');
  });
}

if (introNextBtn) {
  introNextBtn.addEventListener('click', () => {
    showScreen('screen-candidate');
  });
}

if (introExitBtn) {
  introExitBtn.addEventListener('click', () => {
    state.user = null;
    try {
      localStorage.removeItem('beesct-user');
    } catch {}
    showScreen('screen-login');
  });
}

if (homeBtn) {
  homeBtn.addEventListener('click', () => {
    showScreen('screen-consent');
  });
}

if (accountBtn && accountMenu) {
  accountBtn.addEventListener('click', () => {
    accountMenu.classList.toggle('open');
  });
  accountMenu.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    accountMenu.classList.remove('open');
    if (action === 'history') {
      loadHistory();
    } else if (action === 'logout') {
      state.user = null;
      try {
        localStorage.removeItem('beesct-user');
      } catch {}
      showScreen('screen-login');
    } else if (action === 'profile') {
      if (!state.user) {
        showScreen('screen-login');
        return;
      }
      if (profileNameInput) profileNameInput.value = state.user.name || '';
      if (profilePhoneInput) profilePhoneInput.value = state.user.phone || '';
      if (profileEmailInput) profileEmailInput.value = state.user.email || '';
      if (profileGenderInput) profileGenderInput.value = state.user.gender || '';
      if (profileBirthYearInput) profileBirthYearInput.value = state.user.birthYear || '';
      if (profileJobInput) profileJobInput.value = state.user.job || '';
      if (profilePhoneContactInput) profilePhoneContactInput.value = state.user.phoneContact || '';
      if (profileError) profileError.textContent = '';
      if (profileSuccess) {
        profileSuccess.textContent = '';
        profileSuccess.style.display = 'none';
      }
      showScreen('screen-profile');
    } else if (action === 'password') {
      if (!state.user) {
        showScreen('screen-login');
        return;
      }
      if (passwordOldInput) passwordOldInput.value = '';
      if (passwordNewInput) passwordNewInput.value = '';
      if (passwordNew2Input) passwordNew2Input.value = '';
      if (passwordError) passwordError.textContent = '';
      if (passwordSuccess) {
        passwordSuccess.textContent = '';
        passwordSuccess.style.display = 'none';
      }
      showScreen('screen-change-password');
    }
  });
}

if (startBtn) {
  startBtn.addEventListener('click', () => {
    const errorEl = document.getElementById('candidate-error');
    if (!nameInput.value.trim() || !candidateGender.value || !candidateBirthYear.value || !candidateJob.value.trim() || !candidatePhone.value.trim()) {
      if (errorEl) errorEl.textContent = 'Vui lòng điền đầy đủ tất cả thông tin ứng viên.';
      return;
    }
    if (!consentCheckbox.checked) {
      if (errorEl) errorEl.textContent = 'Bạn cần đồng ý tham gia và cho phép lưu kết quả.';
      return;
    }
    if (errorEl) errorEl.textContent = '';
    showScreen('screen-select-version');
  });
}

if (select12QuestionsBtn) {
  select12QuestionsBtn.addEventListener('click', () => {
    if (typeof QUESTIONS_12 !== 'undefined') {
      window.QUESTIONS = QUESTIONS_12.map((q) => {
        // Tạo bản sao của items và xáo trộn ngẫu nhiên
        const shuffledItems = [...q.items].sort(() => Math.random() - 0.5);
        return shuffledItems;
      });
      window.QUESTION_TITLES = QUESTIONS_12.map((q) => q.title);
      state.index = 0;
      state.selections = window.QUESTIONS.map(() => ({ most: null, least: null }));
      showScreen('screen-test');
      renderQuestion();
    }
  });
}

if (select28QuestionsBtn) {
  select28QuestionsBtn.addEventListener('click', () => {
    if (typeof QUESTIONS_28 !== 'undefined') {
      window.QUESTIONS = QUESTIONS_28.map((q) => {
        // Tạo bản sao của items và xáo trộn ngẫu nhiên
        const shuffledItems = [...q.items].sort(() => Math.random() - 0.5);
        return shuffledItems;
      });
      window.QUESTION_TITLES = QUESTIONS_28.map((q) => q.title);
      state.index = 0;
      state.selections = window.QUESTIONS.map(() => ({ most: null, least: null }));
      showScreen('screen-test');
      renderQuestion();
    }
  });
}

if (selectionBackBtn) {
  selectionBackBtn.addEventListener('click', () => {
    showScreen('screen-candidate');
  });
}

prevBtn.addEventListener('click', () => {
  if (state.index > 0) {
    state.index -= 1;
    renderQuestion();
  } else {
    // Nếu ở câu đầu tiên, quay lại màn hình chọn phiên bản
    showScreen('screen-select-version');
  }
});

nextBtn.addEventListener('click', () => {
  const sel = state.selections[state.index];
  if (sel.most == null || sel.least == null) return;
  const currentQuestions = window.QUESTIONS || QUESTIONS;
  if (state.index < currentQuestions.length - 1) {
    state.index += 1;
    renderQuestion();
  } else {
    viewingHistoryResult = false;
    if (restartBtn) restartBtn.style.display = 'inline-flex';
    if (saveBtn) saveBtn.style.display = 'inline-flex';
    if (resultHistoryBackBtn) resultHistoryBackBtn.style.display = 'none';
    renderResult();
    elTest.classList.remove('active');
    elResult.classList.add('active');
  }
});

restartBtn.addEventListener('click', () => {
  if (viewingHistoryResult) {
    return;
  }
  const currentQuestions = window.QUESTIONS || QUESTIONS;
  state = {
    index: 0,
    selections: currentQuestions.map(() => ({ most: null, least: null })),
    name: '',
    user: state.user,
    candidate: {
      gender: '',
      birthYear: '',
      job: '',
      phone: ''
    }
  };
  consentCheckbox.checked = false;
  nameInput.value = '';
  if (candidateGender) candidateGender.value = '';
  if (candidateBirthYear) candidateBirthYear.value = '';
  if (candidateJob) candidateJob.value = '';
  if (candidatePhone) candidatePhone.value = '';
  startBtn.disabled = true;
  showScreen('screen-consent');
});

saveBtn.addEventListener('click', () => {
  if (viewingHistoryResult) {
    return;
  }
  const result = computeScores();
  const scoresPayload = {
    adapted: result.adapted,
    natural: result.natural,
    primary: result.primary,
    secondary: result.secondary
  };
  const payload = {
    ts: new Date().toISOString(),
    name: state.name || null,
    result
  };
  try {
    const key = 'beesct-disc-results';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    list.push(payload);
    localStorage.setItem(key, JSON.stringify(list));
    saveStatus.textContent = 'Đã lưu kết quả trên thiết bị.';
  } catch (e) {
    saveStatus.textContent = 'Không thể lưu kết quả (trình duyệt chặn).';
  }
  if (state.user && SHEET_API_URL && SHEET_API_URL !== 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec') {
    const body = {
      action: 'saveResult',
      userId: state.user.id,
      userName: state.user.name,
      userPhone: state.user.phone,
      candidateName: state.name || null,
      candidateGender: state.candidate.gender || '',
      candidateBirthYear: state.candidate.birthYear || '',
      candidateJob: state.candidate.job || '',
      candidatePhone: state.candidate.phone || '',
      scores: scoresPayload,
      selections: state.selections
    };
    fetch(SHEET_API_URL, {
      method: 'POST',
      body: JSON.stringify(body)
    }).catch(() => {});
  }
});

function showScreen(id) {
  [elLogin, elRegister, elForgot, elProfile, elChangePassword, elConsent, elCandidate, elSelectVersion, elDiscInfo, elTest, elResult, elHistory].forEach((s) => {
    if (s) s.classList.remove('active');
  });
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
  if (appToolbar) {
    if (id === 'screen-login' || id === 'screen-register') {
      appToolbar.classList.remove('active');
    } else {
      appToolbar.classList.add('active');
    }
  }
}

function renderQuestion() {
  const total = (window.QUESTIONS || QUESTIONS).length;
  const currentNum = state.index + 1;
  const prefix = `Câu ${currentNum}/${total}`;

  if (window.QUESTION_TITLES && window.QUESTION_TITLES[state.index]) {
    let title = window.QUESTION_TITLES[state.index];
    // Đồng bộ định dạng "Câu X/Y" cho tất cả phiên bản
    if (title.startsWith('Câu')) {
      // Thay thế "Câu X" hoặc "Câu X/Y" bằng định dạng chuẩn "Câu X/Y"
      title = title.replace(/^Câu \d+(\/\d+)?/, prefix);
      progressText.textContent = title;
    } else {
      progressText.textContent = `${prefix} – ${title}`;
    }
  } else {
    progressText.textContent = prefix;
  }
  const group = (window.QUESTIONS || QUESTIONS)[state.index];
  const sel = state.selections[state.index];
  questionGroup.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'options-table';

  const header = document.createElement('div');
  header.className = 'options-header';
  const empty = document.createElement('div');
  const mostCol = document.createElement('div');
  mostCol.textContent = 'Giống tôi nhất';
  mostCol.className = 'col-title col-most';
  const leastCol = document.createElement('div');
  leastCol.textContent = 'Khác tôi nhất';
  leastCol.className = 'col-title col-least';
  header.appendChild(empty);
  header.appendChild(mostCol);
  header.appendChild(leastCol);
  container.appendChild(header);

  group.forEach((opt, i) => {
    const row = document.createElement('div');
    row.className = 'option-row';

    const textCell = document.createElement('div');
    textCell.className = 'option-text';
    textCell.textContent = opt.text;

    const mostCell = document.createElement('div');
    mostCell.className = 'cell-most';
    const mostLabel = document.createElement('label');
    const mostRadio = document.createElement('input');
    mostRadio.type = 'radio';
    mostRadio.name = 'most';
    mostRadio.checked = sel.most === i;
    mostRadio.addEventListener('change', () => {
      if (sel.least === i) {
        sel.least = null;
        const leastInput = row.querySelector('input[name="least"]');
        if (leastInput) leastInput.checked = false;
      }
      sel.most = i;
      validateNext();
    });
    const mostSpan = document.createElement('span');
    mostSpan.textContent = '';
    mostLabel.appendChild(mostRadio);
    mostLabel.appendChild(mostSpan);
    mostCell.appendChild(mostLabel);

    const leastCell = document.createElement('div');
    leastCell.className = 'cell-least';
    const leastLabel = document.createElement('label');
    const leastRadio = document.createElement('input');
    leastRadio.type = 'radio';
    leastRadio.name = 'least';
    leastRadio.checked = sel.least === i;
    leastRadio.addEventListener('change', () => {
      if (sel.most === i) {
        sel.most = null;
        const mostInput = row.querySelector('input[name="most"]');
        if (mostInput) mostInput.checked = false;
      }
      sel.least = i;
      validateNext();
    });
    const leastSpan = document.createElement('span');
    leastSpan.textContent = '';
    leastLabel.appendChild(leastRadio);
    leastLabel.appendChild(leastSpan);
    leastCell.appendChild(leastLabel);

    row.appendChild(textCell);
    row.appendChild(mostCell);
    row.appendChild(leastCell);
    container.appendChild(row);
  });

  questionGroup.appendChild(container);
  validateNext();
}

function validateNext() {
  const sel = state.selections[state.index];
  if (nextBtn) nextBtn.disabled = !(sel.most != null && sel.least != null);
  if (prevBtn) prevBtn.disabled = false;
}



function computeScores() {
  const mostCounts = { D: 0, I: 0, S: 0, C: 0 };
  const leastCounts = { D: 0, I: 0, S: 0, C: 0 };
  const currentQuestions = window.QUESTIONS || QUESTIONS;
  const totalQ = currentQuestions.length;

  state.selections.forEach((sel, gi) => {
    const group = currentQuestions[gi];
    if (sel.most != null) { const t = group[sel.most].trait; mostCounts[t] += 1; }
    if (sel.least != null) { const t = group[sel.least].trait; leastCounts[t] += 1; }
  });

  // Biểu đồ 1 (Thích ứng - Adapted): Dựa trên Most
  // Vấn đề cũ: (Most / 28) * 100 thường thấp vì hiếm khi ai chọn 1 trait quá 20 lần
  // Điều chỉnh: Dùng quy tắc phân phối chuẩn (Norm) hoặc scale lại
  // Giả sử max thực tế thường chỉ khoảng 18-20 câu cho 1 trait nổi trội
  // Scale factor: Nhân 1.2 để đẩy điểm lên, max vẫn cap ở 100
  const scale = 1.25; 
  const adapted = {
    D: Math.min(100, Math.round((mostCounts.D / totalQ) * 100 * scale)),
    I: Math.min(100, Math.round((mostCounts.I / totalQ) * 100 * scale)),
    S: Math.min(100, Math.round((mostCounts.S / totalQ) * 100 * scale)),
    C: Math.min(100, Math.round((mostCounts.C / totalQ) * 100 * scale))
  };

  // Biểu đồ 2 (Tự nhiên - Natural): Dựa trên Least (đảo ngược)
  // Công thức cũ: ((Total - Least) / Total) * 100
  // Điều chỉnh: Để tránh điểm 100 tuyệt đối quá dễ dàng (khi Least=0),
  // ta tăng mẫu số lên một chút (Total + 2) hoặc scale nhẹ.
  // Ví dụ 28 câu -> chia cho 30.
  const naturalScaleDivisor = totalQ + 2;
  const natural = {
    D: Math.round(((totalQ - leastCounts.D) / naturalScaleDivisor) * 100),
    I: Math.round(((totalQ - leastCounts.I) / naturalScaleDivisor) * 100),
    S: Math.round(((totalQ - leastCounts.S) / naturalScaleDivisor) * 100),
    C: Math.round(((totalQ - leastCounts.C) / naturalScaleDivisor) * 100)
  };

  // Xác định Primary/Secondary dựa trên NATURAL (Tự nhiên)
  const entries = Object.entries(natural).sort((a, b) => b[1] - a[1]);
  const primary = entries[0][0];
  const secondary = entries[1][0];

  return { adapted, natural, primary, secondary, mostCounts, leastCounts };
}

function renderResult(snapshot) {
  const { adapted, natural, primary, secondary, mostCounts } = snapshot || computeScores();
  
  // Render Bar Charts
  renderBarChart(barsAdapted, adapted);
  renderBarChart(barsNatural, natural);

  // Render BPV Markers
  if (bpvContainer) {
    renderBPV(bpvContainer, adapted, natural);
  }

  // Render Pie Chart (Using NATURAL style now)
  if (natural) {
    renderPie(natural);
  } else {
    pieChart.innerHTML = '';
  }

  // Render Analysis
  renderAnalysis(primary, secondary, adapted, natural);
}

function renderBPV(container, adapted, natural) {
  // Xóa markers cũ (giữ lại ảnh nền)
  const bg = container.querySelector('.bpv-bg');
  container.innerHTML = '';
  if (bg) container.appendChild(bg);

  // Hàm tính tọa độ (0-100% relative to container)
  const getPos = (scores) => {
    // Vector lực cho từng nhóm (D, I, S, C)
    // Giả sử tâm là (0,0). Bán kính tối đa R.
    // D: góc 45 độ (Top-Right)
    // I: góc -45 độ (Bottom-Right)
    // S: góc -135 độ (Bottom-Left)
    // C: góc 135 độ (Top-Left)
    
    // Tính tổng hợp lực
    // X = (D + I) - (S + C)  => Sai, phải chiếu theo góc
    // X = D*cos(45) + I*cos(-45) + S*cos(-135) + C*cos(135)
    // Y = D*sin(45) + I*sin(-45) + S*sin(-135) + C*sin(135)
    
    const rad = Math.PI / 180;
    const vD = { x: Math.cos(45 * rad), y: -Math.sin(45 * rad) }; // Y ngược vì web coord (0 ở trên)
    const vI = { x: Math.cos(-45 * rad), y: -Math.sin(-45 * rad) };
    const vS = { x: Math.cos(-135 * rad), y: -Math.sin(-135 * rad) };
    const vC = { x: Math.cos(135 * rad), y: -Math.sin(135 * rad) };

    let x = scores.D * vD.x + scores.I * vI.x + scores.S * vS.x + scores.C * vC.x;
    let y = scores.D * vD.y + scores.I * vI.y + scores.S * vS.y + scores.C * vC.y;

    // Chuẩn hóa về % (Container size)
    // Max score mỗi chiều khoảng 100 * sqrt(2) ~ 141
    // Scale factor để vừa khung hình tròn (bán kính ~40% container để chừa lề)
    const scale = 0.35; // Điều chỉnh độ bung của điểm
    
    // Chuyển từ hệ tọa độ tâm (0,0) sang % (50,50)
    // x, y đang là đơn vị điểm (max ~140)
    // Cần chia cho max range rồi nhân scale
    
    const finalX = 50 + (x / 140) * 100 * scale * 2.5; // *2.5 để phóng to ra sát viền hơn
    const finalY = 50 + (y / 140) * 100 * scale * 2.5;

    return { x: Math.max(5, Math.min(95, finalX)), y: Math.max(5, Math.min(95, finalY)) };
  };

  const posNat = getPos(natural);
  const posAdp = getPos(adapted);

  // Helper tạo marker có thể kéo thả
  const createDraggableMarker = (className, text, initialPos, title) => {
    const mk = document.createElement('div');
    mk.className = `bpv-marker ${className}`;
    mk.textContent = text;
    mk.style.left = initialPos.x + '%';
    mk.style.top = initialPos.y + '%';
    mk.title = title;
    mk.style.cursor = 'move'; // Thêm cursor move

    // Drag logic
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    const onMouseDown = (e) => {
      e.preventDefault(); // Ngăn chọn text
      isDragging = true;
      startX = e.clientX || e.touches[0].clientX;
      startY = e.clientY || e.touches[0].clientY;
      startLeft = parseFloat(mk.style.left);
      startTop = parseFloat(mk.style.top);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchmove', onMouseMove, { passive: false });
      document.addEventListener('touchend', onMouseUp);
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault(); // Ngăn cuộn trang trên mobile
      const clientX = e.clientX || e.touches[0].clientX;
      const clientY = e.clientY || e.touches[0].clientY;
      
      const containerRect = container.getBoundingClientRect();
      const dx = clientX - startX;
      const dy = clientY - startY;

      // Chuyển đổi delta pixel sang %
      const deltaXPercent = (dx / containerRect.width) * 100;
      const deltaYPercent = (dy / containerRect.height) * 100;

      let newLeft = startLeft + deltaXPercent;
      let newTop = startTop + deltaYPercent;

      // Giới hạn trong khung (0-100%)
      newLeft = Math.max(0, Math.min(100, newLeft));
      newTop = Math.max(0, Math.min(100, newTop));

      mk.style.left = newLeft + '%';
      mk.style.top = newTop + '%';
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onMouseMove);
      document.removeEventListener('touchend', onMouseUp);
      // Có thể thêm logic lưu vị trí mới nếu cần
    };

    mk.addEventListener('mousedown', onMouseDown);
    mk.addEventListener('touchstart', onMouseDown, { passive: false });
    
    return mk;
  };

  // Vẽ Marker Tự nhiên (Tròn đen)
  const mkNat = createDraggableMarker('marker-natural', '●', posNat, 'Phong cách Tự nhiên (Kéo để di chuyển)');
  container.appendChild(mkNat);

  // Vẽ Marker Thích ứng (Sao đen)
  const mkAdp = createDraggableMarker('marker-adapted', '★', posAdp, 'Phong cách Thích ứng (Kéo để di chuyển)');
  container.appendChild(mkAdp);
}

function renderBarChart(container, scores) {
  container.innerHTML = '';
  ['D', 'I', 'S', 'C'].forEach((t) => {
    const val = scores[t];
    const col = document.createElement('div');
    col.className = 'bar-col';
    
    const valText = document.createElement('div');
    valText.className = 'bar-val';
    valText.textContent = val;

    const fill = document.createElement('div');
    fill.className = `bar-fill bg-${t}`;
    fill.style.height = val + '%';

    const label = document.createElement('div');
    label.className = 'bar-label';
    label.textContent = t;

    col.appendChild(valText);
    col.appendChild(fill);
    col.appendChild(label);
    container.appendChild(col);
  });
}

function renderAnalysis(primary, secondary, adapted, natural) {
  resultAnalysis.innerHTML = '';
  
  // 1. Định danh kiểu người
  const patternName = getPatternName(primary, secondary, natural);
  
  const section1 = document.createElement('div');
  section1.className = 'analysis-section';
  section1.innerHTML = `
    <div class="analysis-title">
      <img src="assets/DISC.png" style="width:24px;height:24px;object-fit:contain" />
      Kiểu tính cách của bạn: ${patternName}
    </div>
    <div class="analysis-content">
      ${getPatternDescription(primary, secondary)}
    </div>
  `;

  // 2. Khuyến nghị môi trường
  const section2 = document.createElement('div');
  section2.className = 'analysis-section';
  section2.innerHTML = `
    <div class="analysis-title">Môi trường phát triển lý tưởng</div>
    <div class="analysis-content">
      ${getEnvironmentAdvice(primary)}
    </div>
  `;

  // 3. Động lực (Mong muốn và nhu cầu)
  const section3 = document.createElement('div');
  section3.className = 'analysis-section';
  section3.innerHTML = `
    <div class="analysis-title">Động lực: Mong muốn và Nhu cầu</div>
    <div class="analysis-content">
      ${getMotivationAdvice(primary)}
    </div>
  `;

  // 4. Lời khuyên giao tiếp
  const section4 = document.createElement('div');
  section4.className = 'analysis-section';
  section4.innerHTML = `
    <div class="analysis-title">Lời khuyên khi giao tiếp</div>
    <div class="analysis-content">
      ${getCommunicationAdvice(primary)}
    </div>
  `;

  // 5. Những lợi ích mang lại cho tổ chức
  const orgBenefits = getOrganizationalBenefits(primary);
  const section5 = document.createElement('div');
  section5.className = 'analysis-section';
  section5.innerHTML = `
    <div class="analysis-title">Những lợi ích bạn có thể mang lại cho tổ chức</div>
    <div class="analysis-content">
      ${orgBenefits}
    </div>
  `;

  resultAnalysis.appendChild(section1);
  resultAnalysis.appendChild(section2);
  resultAnalysis.appendChild(section3);
  resultAnalysis.appendChild(section4);
  resultAnalysis.appendChild(section5);
}

// --- Content Data & Helpers ---

function getPatternName(p, s, scores) {
  // Nếu điểm phụ thấp hơn 50 hoặc chênh lệch quá lớn (>30), coi như thuần
  const gap = scores[p] - scores[s];
  if (scores[s] < 50 || gap > 30) {
    const map = {
      D: 'Người Thống trị (Dominance)',
      I: 'Người Ảnh hưởng (Influence)',
      S: 'Người Kiên định (Steadiness)',
      C: 'Người Tuân thủ (Compliance)'
    };
    return map[p];
  }
  // Kết hợp
  const pair = p + s;
  const map = {
    DI: 'Người Thúc đẩy (DI)',
    DS: 'Người Quyết đoán (DS)',
    DC: 'Người Kiến tạo (DC)',
    ID: 'Người Truyền cảm hứng (ID)',
    IS: 'Người Hòa giải (IS)',
    IC: 'Người Thuyết phục (IC)',
    SI: 'Người Cố vấn (SI)',
    SD: 'Người Điều phối (SD)',
    SC: 'Người Ổn định (SC)',
    CD: 'Người Cẩn trọng (CD)',
    CI: 'Người Đánh giá (CI)',
    CS: 'Người Hoàn hảo (CS)'
  };
  return map[pair] || `${p}${s}`;
}

function getPatternDescription(p, s) {
  const traits = {
    D: 'Bạn là người mạnh mẽ, quyết đoán và hướng đến kết quả. Bạn thích nắm quyền kiểm soát, giải quyết vấn đề nhanh chóng và không ngại thử thách.',
    I: 'Bạn là người nhiệt tình, cởi mở và lạc quan. Bạn có khả năng giao tiếp tốt, thích kết nối mọi người và tạo bầu không khí vui vẻ.',
    S: 'Bạn là người điềm tĩnh, kiên nhẫn và đáng tin cậy. Bạn thích sự ổn định, quan tâm đến người khác và là người lắng nghe tuyệt vời.',
    C: 'Bạn là người tỉ mỉ, logic và tuân thủ quy tắc. Bạn chú trọng đến sự chính xác, phân tích kỹ lưỡng và chất lượng công việc.'
  };
  return `<p>${traits[p]}</p><p>Kết hợp với yếu tố <b>${s}</b>, phong cách của bạn càng thêm linh hoạt và độc đáo.</p>`;
}

function getEnvironmentAdvice(p) {
  const advice = {
    D: '<ul><li>Môi trường cho phép ra quyết định và tự chủ.</li><li>Được đánh giá dựa trên kết quả và hiệu suất.</li><li>Có cơ hội thăng tiến và thử thách mới.</li><li>Tránh sự quản lý vi mô (micromanagement).</li></ul>',
    I: '<ul><li>Môi trường năng động, sáng tạo và vui vẻ.</li><li>Được giao tiếp và làm việc nhóm thường xuyên.</li><li>Được công nhận và khen ngợi công khai.</li><li>Tránh môi trường quá cô lập hoặc quá nhiều quy tắc cứng nhắc.</li></ul>',
    S: '<ul><li>Môi trường ổn định, hòa đồng và ít xung đột.</li><li>Quy trình làm việc rõ ràng, ít thay đổi đột ngột.</li><li>Được hỗ trợ và làm việc cùng đồng nghiệp tin cậy.</li><li>Tránh môi trường cạnh tranh gay gắt hoặc áp lực thời gian quá lớn.</li></ul>',
    C: '<ul><li>Môi trường chuyên nghiệp, ngăn nắp và logic.</li><li>Đề cao chất lượng, sự chính xác và tiêu chuẩn cao.</li><li>Có thời gian để nghiên cứu và phân tích.</li><li>Tránh môi trường hỗn loạn, thiếu quy trình hoặc cảm tính.</li></ul>'
  };
  return advice[p];
}

function getMotivationAdvice(p) {
  const map = {
    D: '<ul><li><b>Mong muốn:</b> Quyền lực, kiểm soát, thử thách và đạt được kết quả nhanh chóng.</li><li><b>Nhu cầu:</b> Cơ hội thăng tiến, sự công nhận về năng lực và quyền tự quyết.</li><li><b>Động lực:</b> Được dẫn đầu, chiến thắng và vượt qua chướng ngại vật.</li></ul>',
    I: '<ul><li><b>Mong muốn:</b> Sự yêu mến, phổ biến, công nhận xã hội và không khí vui vẻ.</li><li><b>Nhu cầu:</b> Được tương tác, tự do biểu đạt ý kiến và tránh sự từ chối.</li><li><b>Động lực:</b> Sự khen ngợi, phần thưởng công khai và các hoạt động tập thể.</li></ul>',
    S: '<ul><li><b>Mong muốn:</b> Sự an toàn, ổn định, hòa hợp và chân thành.</li><li><b>Nhu cầu:</b> Thời gian để thích nghi, sự hỗ trợ từ đồng nghiệp và quy trình rõ ràng.</li><li><b>Động lực:</b> Sự đánh giá cao về lòng trung thành, sự hợp tác và môi trường thân thiện.</li></ul>',
    C: '<ul><li><b>Mong muốn:</b> Sự chính xác, chất lượng, quy tắc và sự logic.</li><li><b>Nhu cầu:</b> Thông tin chi tiết, thời gian suy nghĩ và đảm bảo không có rủi ro.</li><li><b>Động lực:</b> Được làm đúng quy trình, hoàn thiện kỹ năng và sự công nhận về chuyên môn.</li></ul>'
  };
  return map[p];
}

function getCommunicationAdvice(p) {
  const map = {
    D: '<ul><li><b>NÊN:</b> Đi thẳng vào vấn đề, ngắn gọn, tập trung vào kết quả/mục tiêu. Đưa ra các lựa chọn thay vì chỉ đạo.</li><li><b>KHÔNG NÊN:</b> Dài dòng, lan man, do dự hoặc cố gắng kiểm soát họ quá mức.</li></ul>',
    I: '<ul><li><b>NÊN:</b> Thân thiện, nhiệt tình, dành thời gian trò chuyện xã giao. Cho họ cơ hội chia sẻ ý tưởng.</li><li><b>KHÔNG NÊN:</b> Quá lạnh lùng, chỉ tập trung vào số liệu khô khan hoặc phớt lờ ý kiến của họ.</li></ul>',
    S: '<ul><li><b>NÊN:</b> Nhẹ nhàng, chân thành, lắng nghe kiên nhẫn. Đưa ra lộ trình rõ ràng và sự đảm bảo an toàn.</li><li><b>KHÔNG NÊN:</b> Gây áp lực gấp gáp, thay đổi đột ngột hoặc tỏ ra hung hăng, áp đặt.</li></ul>',
    C: '<ul><li><b>NÊN:</b> Chuẩn bị kỹ lưỡng, dùng số liệu/dẫn chứng cụ thể. Tôn trọng quy tắc và sự riêng tư.</li><li><b>KHÔNG NÊN:</b> Nói chung chung, thiếu căn cứ, quá cảm tính hoặc xâm phạm không gian cá nhân.</li></ul>'
  };
  return map[p];
}

function getOrganizationalBenefits(p) {
  const map = {
    D: `
      <p><b>Điểm mạnh:</b> Bạn là người tiên phong, quyết đoán và luôn hướng tới kết quả. Bạn không ngại khó khăn và sẵn sàng nhận trách nhiệm trong những tình huống khủng hoảng.</p>
      <p><b>Khuynh hướng phong cách làm việc:</b> Tập trung vào bức tranh toàn cảnh, giải quyết vấn đề nhanh chóng và thích sự đổi mới.</p>
      <p><b>Làm việc hiệu quả nhất trong môi trường:</b> Cho phép tự chủ, đánh giá dựa trên hiệu suất và có cơ hội thăng tiến rõ ràng.</p>
    `,
    I: `
      <p><b>Điểm mạnh:</b> Bạn mang lại năng lượng tích cực, khả năng kết nối và thuyết phục tuyệt vời. Bạn giúp xây dựng tinh thần đồng đội và lan tỏa sự nhiệt huyết.</p>
      <p><b>Khuynh hướng phong cách làm việc:</b> Sáng tạo, linh hoạt và thích tương tác với con người hơn là làm việc với dữ liệu khô khan.</p>
      <p><b>Làm việc hiệu quả nhất trong môi trường:</b> Cởi mở, vui vẻ, khuyến khích sự sáng tạo và ghi nhận công khai.</p>
    `,
    S: `
      <p><b>Điểm mạnh:</b> Bạn là trụ cột của sự ổn định, kiên nhẫn và đáng tin cậy. Bạn luôn hỗ trợ đồng nghiệp và giúp duy trì sự hài hòa trong tổ chức.</p>
      <p><b>Khuynh hướng phong cách làm việc:</b> Có kế hoạch, quy trình rõ ràng và tập trung vào sự hợp tác lâu dài.</p>
      <p><b>Làm việc hiệu quả nhất trong môi trường:</b> Ổn định, ít xung đột, đề cao sự chân thành và làm việc nhóm.</p>
    `,
    C: `
      <p><b>Điểm mạnh:</b> Bạn mang lại sự chính xác, chất lượng và tư duy logic. Bạn giúp tổ chức giảm thiểu rủi ro và tối ưu hóa quy trình vận hành.</p>
      <p><b>Khuynh hướng phong cách làm việc:</b> Tỉ mỉ, cẩn trọng, dựa trên dữ liệu thực tế và tuân thủ các tiêu chuẩn cao.</p>
      <p><b>Làm việc hiệu quả nhất trong môi trường:</b> Chuyên nghiệp, trật tự, có đủ thời gian để nghiên cứu và phân tích sâu.</p>
    `
  };
  return map[p];
}

function analyzeShift(adapted, natural) {
  let comments = [];
  ['D', 'I', 'S', 'C'].forEach(t => {
    const diff = adapted[t] - natural[t];
    // Chỉ đưa ra nhận xét nếu sự chênh lệch thực sự đáng kể (>20)
    if (diff > 20) {
      comments.push(`Bạn đang phải nỗ lực thể hiện tính <b>${t}</b> cao hơn nhiều so với bản năng. Điều này có thể giúp bạn thích nghi tốt, nhưng nếu kéo dài có thể gây căng thẳng.`);
    } else if (diff < -20) {
      comments.push(`Môi trường hiện tại có vẻ đang hạn chế tính <b>${t}</b> tự nhiên của bạn. Bạn đang phải kìm nén đặc điểm này để phù hợp với yêu cầu bên ngoài.`);
    }
  });
  
  if (comments.length === 0) {
    return '<p>Phong cách Thích ứng và Tự nhiên của bạn khá đồng nhất (chênh lệch thấp). Điều này cho thấy bạn đang được là chính mình, cảm thấy thoải mái và không phải "gồng" mình quá nhiều trong công việc/cuộc sống hiện tại.</p>';
  }
  return comments.map(c => `<p>${c}</p>`).join('');
}

function showHistoryResult(test) {
  if (!test) return;
  viewingHistoryResult = true;
  if (restartBtn) restartBtn.style.display = 'none';
  if (saveBtn) saveBtn.style.display = 'none';
  if (resultHistoryBackBtn) resultHistoryBackBtn.style.display = 'inline-flex';
  
  // Support for localStorage format
  if (test.result && test.result.natural) {
    state.name = test.name || '';
    showScreen('screen-result');
    renderResult(test.result);
    return;
  }

  let selections = null;
  if (test.rawJson) {
    try {
      const parsed = JSON.parse(test.rawJson);
      if (parsed && Array.isArray(parsed.selections)) {
        selections = parsed.selections;
      }
    } catch {}
  }

  state.name = test.candidateName || '';
  if (selections) {
    state.selections = selections;
    const snapshot = computeScores(); // Tính lại theo logic mới từ selections
    showScreen('screen-result');
    renderResult(snapshot);
    return;
  }
  
  // Fallback cho dữ liệu cũ (chỉ có totals, không có selections)
  // Logic cũ: totals = adapted (tạm coi là vậy vì ngày xưa tính theo Most)
  const totals = {
      D: Number(test.D || 0),
      I: Number(test.I || 0),
      S: Number(test.S || 0),
      C: Number(test.C || 0)
  };
  // Fake data để hiển thị
  const snapshot = {
      adapted: { D: totals.D * 3, I: totals.I * 3, S: totals.S * 3, C: totals.C * 3 }, // Fake scale
      natural: { D: totals.D * 3, I: totals.I * 3, S: totals.S * 3, C: totals.C * 3 },
      primary: test.primaryType || 'D',
      secondary: test.secondaryType || 'I',
      mostCounts: totals,
      leastCounts: { D:0, I:0, S:0, C:0 }
  };
  showScreen('screen-result');
  renderResult(snapshot);
}

function renderPie(scores) {
  const total = Object.values(scores).reduce((a,b)=>a+b,0) || 1;
  const colors = { D: '#ef4444', I: '#f59e0b', S: '#10b981', C: '#3b82f6' };
  
  // Tính phần trăm
  const percents = {};
  ['D','I','S','C'].forEach(t => {
    percents[t] = Math.round((scores[t] / total) * 100);
  });

  // Vẽ biểu đồ
  let start = 0;
  const r = 90, cx = 100, cy = 100; // Tăng kích thước
  const svgParts = [];
  ['D','I','S','C'].forEach((t) => {
    const value = scores[t];
    if (value > 0) {
      const angle = (value / total) * 2 * Math.PI;
      const x1 = cx + r * Math.cos(start);
      const y1 = cy + r * Math.sin(start);
      const end = start + angle;
      const x2 = cx + r * Math.cos(end);
      const y2 = cy + r * Math.sin(end);
      const largeArc = angle > Math.PI ? 1 : 0;
      
      let d = '';
      if (value >= total * 0.999) { // Gần như 100%
        d = `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r}`;
      } else {
        d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      }
      
      svgParts.push(`<path d="${d}" fill="${colors[t]}" stroke="#fff" stroke-width="2" />`);
      
      // Text % (chỉ hiện nếu > 5%)
      if (percents[t] > 5) {
        const midAngle = start + angle / 2;
        const tx = cx + (r * 0.6) * Math.cos(midAngle);
        const ty = cy + (r * 0.6) * Math.sin(midAngle);
        svgParts.push(`<text x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="13" font-weight="bold">${percents[t]}%</text>`);
      }
      
      start = end;
    }
  });

  // Legend bên phải
  const legend = ['D','I','S','C'].map(t => `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
      <div style="width:36px;height:12px;background:${colors[t]};border-radius:2px;flex-shrink:0;"></div>
      <span style="font-weight:600;color:#334155;white-space:nowrap;">Nhóm ${t}</span>
    </div>
  `).join('');

  pieChart.innerHTML = `
    <div class="card" style="padding:24px;width:100%;box-sizing:border-box;">
      <h3 style="margin:0 0 20px 0;font-size:18px;color:#334155;text-align:center;text-transform:uppercase;">Phân bổ Phong cách Tự nhiên</h3>
      <div class="pie-layout">
        <div class="pie-svg">
           <svg width="200" height="200" viewBox="0 0 200 200">${svgParts.join('')}</svg>
        </div>
        <div class="pie-legend">
          ${legend}
        </div>
      </div>
    </div>`;
}

function renderDetails(mostCounts) {
  detailsBox.innerHTML = '';
  const colors = { D: 'var(--D)', I: 'var(--I)', S: 'var(--S)', C: 'var(--C)' };
  ['D','I','S','C'].forEach((t) => {
    const panel = document.createElement('div');
    panel.className = 'trait-panel';
    const title = document.createElement('div');
    title.className = 'title';
    const dot = document.createElement('span');
    dot.style.cssText = `display:inline-block;width:10px;height:10px;border-radius:50%;background:${colors[t]}`;
    const name = document.createElement('span');
    name.textContent = t;
    const count = document.createElement('span');
    count.className = 'count';
    count.textContent = `Điểm dương: ${mostCounts[t]}`;
    title.appendChild(dot); title.appendChild(name); title.appendChild(count);
    const chips = document.createElement('div'); chips.className = 'chips';
    const currentQuestions = window.QUESTIONS || QUESTIONS;
    state.selections.forEach((sel, gi) => {
      const group = currentQuestions[gi];
      if (sel.most != null && group[sel.most].trait === t) {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = group[sel.most].text;
        chips.appendChild(chip);
      }
    });
    panel.appendChild(title);
    panel.appendChild(chips);
    detailsBox.appendChild(panel);
  });
}

function summaryText(p, s) {
  const advice = {
    D: '<b>D (Quyết đoán)</b>: Trực diện, ngắn gọn, nhấn mạnh mục tiêu và kết quả.',
    I: '<b>I (Giao tiếp)</b>: Tạo kết nối, kể câu chuyện, truyền cảm hứng.',
    S: '<b>S (Ổn định)</b>: Cam kết hỗ trợ, lộ trình an toàn, nhịp độ đều.',
    C: '<b>C (Chuẩn xác)</b>: Số liệu, quy trình, minh bạch rủi ro/lợi ích.'
  };
  return `
    <h3>Kiểu chính: ${p} | Kiểu phụ: ${s}</h3>
    <p>${advice[p]}</p>
    <p>${advice[s]}</p>
    <p class="note">Gợi ý tiếp cận được đề xuất theo phong cách nổi trội.</p>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    const raw = localStorage.getItem('beesct-user');
    if (raw) {
      state.user = JSON.parse(raw);
      showScreen('screen-consent');
      return;
    }
  } catch {}
  showScreen('screen-login');
});

// --- NAVIGASI HALAMAN UTAMA ---
function showPage(pageId) {
  const views = document.querySelectorAll('.page-view');
  views.forEach(v => {
    v.style.display = 'none';
    v.classList.remove('active-view');
  });

  const target = document.getElementById(pageId);
  if (target) {
    target.style.display = 'block';
    target.classList.add('active-view');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// --- FITUR AKSESIBILITAS ---
function toggleAccessibilityModal() {
  const modal = document.getElementById('accessibility-modal');
  if (modal) {
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
  }
}

let currentZoomPercent = 100;
function adjustFontSize(amount) {
  currentZoomPercent += amount;
  if (currentZoomPercent < 80) currentZoomPercent = 80;
  if (currentZoomPercent > 150) currentZoomPercent = 150;
  const label = document.getElementById('font-size-label');
  if (label) label.innerText = currentZoomPercent + '%';
  document.body.style.fontSize = (currentZoomPercent / 100) * 1.05 + 'rem';
}

function toggleDyslexiaFont(checkbox) {
  document.body.style.fontFamily = checkbox.checked ? '"Comic Sans MS", cursive, sans-serif' : "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
}
function toggleUnderlineLinks(checkbox) {
  document.querySelectorAll('a').forEach(l => l.style.textDecoration = checkbox.checked ? 'underline' : 'none');
}
function toggleHighlightHeadings(checkbox) {
  document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
    h.style.backgroundColor = checkbox.checked ? '#fef08a' : 'transparent';
    h.style.padding = checkbox.checked ? '2px 6px' : '0';
  });
}
function toggleBoldText(checkbox) {
  document.querySelectorAll('p, span, li, a').forEach(el => el.style.fontWeight = checkbox.checked ? '700' : 'normal');
}
function toggleLineHeight(checkbox) {
  document.body.style.lineHeight = checkbox.checked ? '2.2' : '1.75';
}
function toggleLetterSpacing(checkbox) {
  document.body.style.letterSpacing = checkbox.checked ? '1.5px' : 'normal';
}

// --- MENU PETUGAS & ADMIN AUTH ---
function checkLoginAndOpenMenu() {
  const isAuth = localStorage.getItem('smpn2_petugas_logged_in');
  if (isAuth === 'true') {
    showPage('view-panel-petugas');
  } else {
    showPage('view-login-petugas');
  }
}

function handleLogin(event) {
  event.preventDefault();
  const user = document.getElementById('login-user').value;
  const pass = document.getElementById('login-pass').value;
  if (user === 'admin' && pass === 'smpn2karamat') {
    localStorage.setItem('smpn2_petugas_logged_in', 'true');
    alert('Login Berhasil!');
    showPage('view-panel-petugas');
  } else {
    alert('Username atau Password salah!');
  }
}

function handleLogout() {
  localStorage.removeItem('smpn2_petugas_logged_in');
  showPage('view-beranda');
}

// --- FUNGSI TAB ADMIN BERFUNGSI UTUH ---
function switchTab(tabId) {
  const tabs = document.querySelectorAll('.admin-tab-content');
  tabs.forEach(tab => tab.style.display = 'none');

  const buttons = document.querySelectorAll('.admin-tab-btn');
  buttons.forEach(btn => btn.classList.remove('active-admin-btn'));

  const activeTab = document.getElementById(tabId);
  if (activeTab) activeTab.style.display = 'block';

  const activeBtn = document.getElementById('btn-' + tabId);
  if (activeBtn) activeBtn.classList.add('active-admin-btn');
}

// --- DATA HANDLING SISWA & BERANDA ---
const defaultStudentData = {
  '7a': { l: 18, p: 17 }
};

function getStudentData() {
  const data = localStorage.getItem('smpn2_data_peserta_didik');
  return data ? JSON.parse(data) : defaultStudentData;
}

function renderStudentData() {
  const data = getStudentData();
  const d7 = data['7a'] || { l: 0, p: 0 };
  if (document.getElementById('display-7a-l')) document.getElementById('display-7a-l').innerText = d7.l;
  if (document.getElementById('display-7a-p')) document.getElementById('display-7a-p').innerText = d7.p;
  if (document.getElementById('display-7a-total')) document.getElementById('display-7a-total').innerText = Number(d7.l) + Number(d7.p);
  if (document.getElementById('input-7a-l')) document.getElementById('input-7a-l').value = d7.l;
  if (document.getElementById('input-7a-p')) document.getElementById('input-7a-p').value = d7.p;
}

function saveStudentData(event) {
  event.preventDefault();
  let newdata = getStudentData();
  newdata['7a'] = {
    l: document.getElementById('input-7a-l').value,
    p: document.getElementById('input-7a-p').value
  };
  localStorage.setItem('smpn2_data_peserta_didik', JSON.stringify(newdata));
  renderStudentData();
  alert('Data siswa berhasil disimpan!');
}

function saveBerandaData(event) {
  event.preventDefault();
  const sambutan = document.getElementById('input-beranda-sambutan').value;
  localStorage.setItem('smpn2_sambutan', sambutan);
  if (document.getElementById('display-beranda-sambutan')) {
    document.getElementById('display-beranda-sambutan').innerText = sambutan;
  }
  alert('Beranda berhasil diperbarui!');
}

function tambahVideoAdmin() {
  alert('Fitur tambah video berhasil diproses.');
}

window.addEventListener('DOMContentLoaded', () => {
  renderStudentData();
  const savedSambutan = localStorage.getItem('smpn2_sambutan');
  if (savedSambutan && document.getElementById('display-beranda-sambutan')) {
    document.getElementById('display-beranda-sambutan').innerText = savedSambutan;
    if (document.getElementById('input-beranda-sambutan')) {
      document.getElementById('input-beranda-sambutan').value = savedSambutan;
    }
  }
});

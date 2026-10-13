// --- 1. NAVIGASI HALAMAN ---
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

// --- 2. FITUR AKSESIBILITAS INTERAKTIF ---
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
  if (checkbox.checked) {
    document.body.style.fontFamily = '"Comic SansMS", "Comic Sans", cursive, sans-serif';
  } else {
    document.body.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
  }
}

function toggleUnderlineLinks(checkbox) {
  const links = document.querySelectorAll('a');
  links.forEach(l => {
    l.style.textDecoration = checkbox.checked ? 'underline' : 'none';
  });
}

function toggleHighlightHeadings(checkbox) {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(h => {
    h.style.backgroundColor = checkbox.checked ? '#fef08a' : 'transparent';
    h.style.padding = checkbox.checked ? '2px 6px' : '0';
    h.style.borderRadius = checkbox.checked ? '4px' : '0';
  });
}

function toggleBoldText(checkbox) {
  const elements = document.querySelectorAll('p, span, li, a');
  elements.forEach(el => {
    el.style.fontWeight = checkbox.checked ? '700' : 'normal';
  });
}

function toggleLineHeight(checkbox) {
  document.body.style.lineHeight = checkbox.checked ? '2.2' : '1.75';
}

function toggleLetterSpacing(checkbox) {
  document.body.style.letterSpacing = checkbox.checked ? '1.5px' : 'normal';
}

// --- 3. DATA & RENDER SISWA / BERANDA ---
const defaultStudentData = {
  '7a': { l: 18, p: 17, wali: 'Dra. Hj. Nurain, M.Pd', foto: 'https://via.placeholder.com/150' },
  '7b': { l: 17, p: 18, wali: 'Moh. Rifai, S.Pd', foto: 'https://via.placeholder.com/150' },
  '8a': { l: 16, p: 18, wali: 'Siti Aminuh, S.Pd', foto: 'https://via.placeholder.com/150' },
  '8b': { l: 17, p: 15, wali: 'Ahmad Yado, S.Sos', foto: 'https://via.placeholder.com/150' },
  '9a': { l: 14, p: 17, wali: 'Irawati Nigi, S.Pd', foto: 'https://via.placeholder.com/150' },
  '9b': { l: 15, p: 16, wali: 'Supratman, S.Pd', foto: 'https://via.placeholder.com/150' }
};

function getStudentData() {
  const data = localStorage.getItem('smpn2_data_peserta_didik');
  return data ? JSON.parse(data) : defaultStudentData;
}

function renderStudentData() {
  const data = getStudentData();
  const classes = ['7a', '7b', '8a', '8b', '9a', '9b'];

  classes.forEach(cls => {
    const clsduta = data[cls] || { l: 0, p: 0, wali: '', foto: '' };
    const elL = document.getElementById(`display-${cls}-l`);
    const elP = document.getElementById(`display-${cls}-p`);
    const elTot = document.getElementById(`display-${cls}-total`);
    const elWali = document.getElementById(`display-${cls}-wali`);
    const elFoto = document.getElementById(`display-${cls}-foto`);

    if (elL) elL.innerText = clsduta.l;
    if (elP) elP.innerText = clsduta.p;
    if (elTot) elTot.innerText = Number(clsduta.l) + Number(clsduta.p);
    if (elWali) elWali.innerText = clsduta.wali;
    if (elFoto) elFoto.src = clsduta.foto;

    if (document.getElementById(`input-${cls}-l`)) document.getElementById(`input-${cls}-l`).value = clsduta.l;
    if (document.getElementById(`input-${cls}-p`)) document.getElementById(`input-${cls}-p`).value = clsduta.p;
    if (document.getElementById(`input-${cls}-wali`)) document.getElementById(`input-${cls}-wali`).value = clsduta.wali;
    if (document.getElementById(`input-${cls}-foto`)) document.getElementById(`input-${cls}-foto`).value = clsduta.foto;
  });
}

function saveStudentData(event) {
  event.preventDefault();
  const classes = ['7a', '7b', '8a', '8b', '9a', '9b'];
  let newdata = {};
  classes.forEach(cls => {
    newdata[cls] = {
      l: document.getElementById(`input-${cls}-l`).value,
      p: document.getElementById(`input-${cls}-p`).value,
      wali: document.getElementById(`input-${cls}-wali`).value,
      foto: document.getElementById(`input-${cls}-foto`).value
    };
  });
  localStorage.setItem('smpn2_data_peserta_didik', JSON.stringify(newdata));
  renderStudentData();
  alert('Data peserta didik berhasil diperbarui!');
}

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

function switchTab(tabId) {
  const tabs = document.querySelectorAll('.admin-tab-content');
  tabs.forEach(tab => tab.style.display = 'none');
  const activeTab = document.getElementById(tabId);
  if (activeTab) activeTab.style.display = 'block';
}

const defaultBerandaData = {
  sambutan: "Puji dan syukur marilah kita panjatkan ke hadirat Allah SWT, Tuhan Yang Maha Esa...",
  banner: "images/WhatsApp Video 2026-10-13 at 12.31.10.mp4",
  kepsek: "https://i.postimg.cc/sxPCtknH/Gemini-Generated-Image-tnppjqtnppjqtnpp.jpg"
};

function saveBerandaData(event) {
  event.preventDefault();
  const berandaData = {
    sambutan: document.getElementById('input-beranda-sambutan').value,
    banner: document.getElementById('input-beranda-banner').value,
    kepsek: document.getElementById('input-beranda-kepsek').value
  };
  localStorage.setItem('smpn2_content_beranda', JSON.stringify(berandaData));
  renderBerandaData();
  alert('Data Beranda berhasil diperbarui!');
}

function renderBerandaData() {
  const localData = localStorage.getItem('smpn2_content_beranda');
  const data = localData ? JSON.parse(localData) : defaultBerandaData;

  if (document.getElementById('display-beranda-sambutan')) document.getElementById('display-beranda-sambutan').innerText = data.sambutan;
  if (document.getElementById('display-beranda-kepsek')) document.getElementById('display-beranda-kepsek').src = data.kepsek;
  if (document.getElementById('input-beranda-sambutan')) document.getElementById('input-beranda-sambutan').value = data.sambutan;
  if (document.getElementById('input-beranda-banner')) document.getElementById('input-beranda-banner').value = data.banner;
  if (document.getElementById('input-beranda-kepsek')) document.getElementById('input-beranda-kepsek').value = data.kepsek;
}

window.addEventListener('DOMContentLoaded', () => {
  renderStudentData();
  renderBerandaData();
});

// --- 1. NAVIGASI HALAMAN (SHOW PAGE) ---
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

// --- 2. FITUR DINAMIS DATA SISWA (LOCALSTORAGE) ---
const defaultStudentData = {
  '7a': { l: 15, p: 17, wali: 'Dra. Hj. Nurain, M.Pd', foto: 'https://via.placeholder.com/150' },
  '7b': { l: 14, p: 18, wali: 'Moh. Rifai, S.Pd', foto: 'https://via.placeholder.com/150' },
  '8a': { l: 16, p: 16, wali: 'Siti Aminah, S.Pd', foto: 'https://via.placeholder.com/150' },
  '8b': { l: 15, p: 15, wali: 'Ahmad Yada, S.Sos', foto: 'https://via.placeholder.com/150' },
  '9a': { l: 13, p: 17, wali: 'Irawati Sigi, S.Pd', foto: 'https://via.placeholder.com/150' },
  '9b': { l: 14, p: 16, wali: 'Supratman, S.Pd', foto: 'https://via.placeholder.com/150' }
};

function getStudentData() {
  const data = localStorage.getItem('smpn2_data_peserta_didik');
  return data ? JSON.parse(data) : defaultStudentData;
}

function renderStudentData() {
  const data = getStudentData();
  const classes = ['7a', '7b', '8a', '8b', '9a', '9b'];

  classes.forEach(cls => {
    const clsData = data[cls] || { l: 0, p: 0, wali: '', foto: '' };
    
    // Update tampilan publik
    const elL = document.getElementById(`display-${cls}-l`);
    const elP = document.getElementById(`display-${cls}-p`);
    const elTot = document.getElementById(`display-${cls}-total`);
    const elWali = document.getElementById(`display-${cls}-wali`);
    const elFoto = document.getElementById(`display-${cls}-foto`);

    if (elL) elL.innerText = clsData.l;
    if (elP) elP.innerText = clsData.p;
    if (elTot) elTot.innerText = `Total: ${clsData.l + clsData.p} Siswa`;
    if (elWali) elWali.innerText = clsData.wali;
    if (elFoto) elFoto.src = clsData.foto;

    // Update form input di Panel Petugas
    const inputL = document.getElementById(`input-${cls}-l`);
    const inputP = document.getElementById(`input-${cls}-p`);
    const inputWali = document.getElementById(`input-${cls}-wali`);
    const inputFoto = document.getElementById(`input-${cls}-foto`);

    if (inputL) inputL.value = clsData.l;
    if (inputP) inputP.value = clsData.p;
    if (inputWali) inputWali.value = clsData.wali;
    if (inputFoto) inputFoto.value = clsData.foto;
  });
}

function saveStudentData(event) {
  event.preventDefault();
  const classes = ['7a', '7b', '8a', '8b', '9a', '9b'];
  let newdata = {};

  classes.forEach(cls => {
    newdata[cls] = {
      l: parseInt(document.getElementById(`input-${cls}-l`).value) || 0,
      p: parseInt(document.getElementById(`input-%s-p`.replace('%s', cls)).value) || 0, // atau langsung template literal:
      // l: parseInt(document.getElementById(`input-${cls}-l`).value) || 0,
      p: parseInt(document.getElementById(`input-${cls}-p`).value) || 0,
      wali: document.getElementById(`input-${cls}-wali`).value,
      foto: document.getElementById(`input-${cls}-foto`).value
    };
  });

  localStorage.setItem('smpn2_data_peserta_didik', JSON.stringify(newdata));
  renderStudentData();
  alert('Data peserta didik dari kelas 7A sampai 9B berhasil diperbarui dan disimpan!');
}

// --- 3. KONTROL AKSES & LOGIN PETUGAS ---
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
    alert('Login Berhasil! Selamat datang, Petugas.');
    document.getElementById('login-user').value = '';
    document.getElementById('login-pass').value = '';
    showPage('view-panel-petugas');
  } else {
    alert('Username atau Password salah! Silakan coba lagi.');
  }
}

function handlelogout() {
  localStorage.removeItem('smpn2_petugas_logged_in');
  alert('Anda telah keluar dari Panel Petugas.');
  showPage('view-beranda');
}

// --- 4. FUNGSI TAB SWITCHING DI PANEL PETUGAS ---
function switchTab(tabId) {
  const tabs = document.querySelectorAll('.admin-tab-content');
  tabs.forEach(tab => tab.style.display = 'none');

  const activeTab = document.getElementById(tabId);
  if (activeTab) activeTab.style.display = 'block';

  const buttons = document.querySelectorAll('[id^="btn-tab-"]');
  buttons.forEach(btn => {
    btn.style.background = '#cbd5e1';
    btn.style.color = 'var(--text-dark)';
  });

  const activeBtn = document.getElementById('btn-' + tabId);
  if (activeBtn) {
    activeBtn.style.background = 'var(--primary-color)';
    activeBtn.style.color = 'white';
  }
}

// --- 5. SIMPAN KONTEN DINAMIS LAINNYA (Sejarah, Visi Misi, dll) ---
function savePageContent(event, pageKey) {
  event.preventDefault();
  let contentData = {};

  if (pageKey === 'sejarah') {
    contentData.text = document.getElementById('input-content-sejarah').value;
  } else if (pageKey === 'visimisi') {
    contentData.visi = document.getElementById('input-content-visi').value;
    contentData.misi = document.getElementById('input-content-misi').value;
  } else {
    const inputEl = document.getElementById(`input-content-${pageKey}`);
    if (inputEl) contentData.text = inputEl.value;
  }

  localStorage.setItem('smpn2_content_' + pageKey, JSON.stringify(contentData));
  alert(`Data ${pageKey} berhasil diperbarui dan disimpan!`);
  renderPageContent();
}

function renderPageContent() {
  // Render Sejarah
  const sejarahData = JSON.parse(localStorage.getItem('smpn2_content_sejarah'));
  if (sejarahData) {
    const el = document.getElementById('display-sejarah');
    if (el) el.innerHTML = `<p>${sejarahData.text}</p>`;
    const inputEl = document.getElementById('input-content-sejarah');
    if (inputEl) inputEl.value = sejarahData.text;
  }

  // Render Visi Misi
  const visiData = JSON.parse(localStorage.getItem('smpn2_content_visimisi'));
  if (visiData) {
    const elVisi = document.getElementById('display-visi');
    const elMisi = document.getElementById('display-misi');
    if (elVisi) elVisi.innerText = visiData.visi;
    if (elMisi) elMisi.innerHTML = `<p>${visiData.misi}</p>`;
    
    const inVisi = document.getElementById('input-content-visi');
    const inMisi = document.getElementById('input-content-misi');
    if (inVisi) inVisi.value = visiData.visi;
    if (inMisi) inMisi.value = visiData.misi;
  }
}

// Render Sarana & Prasarana
  const saranaData = JSON.parse(localStorage.getItem('smpn2_content_sarana'));
  if (saranaData) {
    const el = document.getElementById('display-sarana');
    if (el) el.innerHTML = `<p>${saranaData.text}</p>`;
    const inputEl = document.getElementById('input-content-sarana');
    if (inputEl) inputEl.value = saranaData.text;
  }

// --- 6. EKSEKUSI AWAL SAAT HALAMAN DIMUAT ---
window.addEventListener('DOMContentLoaded', () => {
  renderStudentData();
  renderPageContent();
});

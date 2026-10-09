// ==========================================
// SCRIPT UTUH DAN LENGKAP - WEBSITE SMPN 2 KARAMAT
// ==========================================

// --- 1. FITUR FILTER JADWAL PELAJARAN ---
const dataJadwal = {
  '7a': [
    { hari: "Senin", waktu: "07:30 - 09:00", mapel: "Upacara & IPS", guru: "Siti Rahma, S.Pd.", ruang: "R. IX-A" },
    { hari: "Selasa", waktu: "07:30 - 09:00", mapel: "Bahasa Inggris", guru: "Rina Marlina, S.Pd.", ruang: "R. IX-A" },
    { hari: "Kamis", waktu: "07:30 - 09:00", mapel: "Matematika", guru: "Budi Santoso, S.Si.", ruang: "R. IX-A" }
  ]
};

function filterJadwal() {
  const kelasSelect = document.getElementById("kelasSelect");
  const tbody = document.getElementById("jadwalBody");

  if (!kelasSelect || !tbody) return;

  const kelas = kelasSelect.value;
  tbody.innerHTML = "";

  const list = dataJadwal[kelas] || [];
  list.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.hari}</strong></td>
      <td>${item.waktu}</td>
      <td>${item.mapel}</td>
      <td>${item.guru}</td>
      <td>${item.ruang}</td>
    `;
    tbody.appendChild(tr);
  });
}


// --- 2. FITUR NAVIGASI HALAMAN (SHOW PAGE) ---
function showPage(pageId) {
  const views = document.querySelectorAll('.page-view');
  views.forEach(v => {
    v.style.display = 'none';
  });

  const target = document.getElementById(pageId);
  if (target) {
    target.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}


// --- 2. FITUR DINAMIS PESERTA DIDIK & WALI KELAS (LOCALSTORAGE) ---
const defaultStudentData = {
  '7a': { L: 15, P: 17, wali: 'Dra. Hj. Nurain, M.Pd', foto: 'https://via.placeholder.com/150' },
  '7b': { L: 14, P: 18, wali: 'Moh. Rifai, S.Pd', foto: 'https://via.placeholder.com/150' },
  '8a': { L: 16, P: 16, wali: 'Siti Aminah, S.Pd', foto: 'https://via.placeholder.com/150' },
  '8b': { L: 15, P: 15, wali: 'Ahmad Yada, S.Sos', foto: 'https://via.placeholder.com/150' },
  '9a': { L: 13, P: 17, wali: 'Irawati Sigi, S.Pd', foto: 'https://via.placeholder.com/150' },
  '9b': { L: 14, P: 16, wali: 'Supratman, S.Pd', foto: 'https://via.placeholder.com/150' }
};

// Ambil data dari localstorage
function getStudentData() {
  const data = localStorage.getItem('smpn2_data_peserta_didik');
  return data ? JSON.parse(data) : defaultStudentData;
}

// Tampilkan data ke halaman website & form input
function renderStudentData() {
  const data = getStudentData();
  const classes = ['7a', '7b', '8a', '8b', '9a', '9b'];

  classes.forEach(cls => {
    const clsData = data[cls] || { L: 0, P: 0, wali: '', foto: '' };
    const total = clsData.L + clsData.P;

    // Update kartu tampilan di halaman khusus Kelas (misal: #display-7a-L, dll)
    const elL = document.getElementById(`display-${cls}-L`);
    const elP = document.getElementById(`display-${cls}-P`);
    const elTot = document.getElementById(`display-${cls}-total`);
    const elWali = document.getElementById(`display-${cls}-wali`);
    const elFoto = document.getElementById(`display-${cls}-foto`);

    if (elL) elL.innerText = `${clsData.L} Siswa`;
    if (elP) elP.innerText = `${clsData.P} Siswa`;
    if (elTot) elTot.innerText = `Total: ${total} Siswa`;
    if (elWali) elWali.innerText = clsData.wali || 'Wali Kelas';
    if (elFoto && clsData.foto) elFoto.src = clsData.foto;

    // Update nilai pada form input di Menu Petugas
    const inputL = document.getElementById(`input-${cls}-L`);
    const inputP = document.getElementById(`input-${cls}-P`);
    const inputWali = document.getElementById(`input-${cls}-wali`);
    const inputFoto = document.getElementById(`input-${cls}-foto`);

    if (inputL) inputL.value = clsData.L;
    if (inputP) inputP.value = clsData.P;
    if (inputWali) inputWali.value = clsData.wali || '';
    if (inputFoto) inputFoto.value = clsData.foto || '';
  });
}

// Simpan data dari form input ke localstorage
function saveStudentData(event) {
  event.preventDefault();
  const classes = ['7a', '7b', '8a', '8b', '9a', '9b'];
  let newdata = {};

  classes.forEach(cls => {
    const lVal = parseInt(document.getElementById(`input-${cls}-L`).value) || 0;
    const pVal = parseInt(document.getElementById(`input-${cls}-P`).value) || 0;
    const waliVal = document.getElementById(`input-${cls}-wali`).value;
    const fotoVal = document.getElementById(`input-${cls}-foto`).value;

    newdata[cls] = { L: lVal, P: pVal, wali: waliVal, foto: fotoVal };
  });

  localStorage.setItem('smpn2_data_peserta_didik', JSON.stringify(newdata));
  renderStudentData();
  alert('Data peserta didik dan wali kelas berhasil diperbarui dan disimpan!');
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

  const validUser = 'admin';
  const validPass = 'smpn2karamat';

  if (user === validUser && pass === validPass) {
    localStorage.setItem('smpn2_petugas_logged_in', 'true');
    alert('Login Berhasil! Selamat datang petugas.');
    document.getElementById('login-user').value = '';
    document.getElementById('login-pass').value = '';
    showPage('view-panel-petugas');
  } else {
    alert('Username atau Password salah! Silakan coba lagi.');
  }
}

function handleLogout() {
  localStorage.removeItem('smpn2_petugas_logged_in');
  alert('Anda telah keluar dari Panel Petugas.');
  showPage('view-beranda');
}

// --- 5. EKSEKUSI AWAL SAAT HALAMAN DIMUAT ---
window.addEventListener('DOMContentLoaded', () => {
  renderStudentData();
});
// --- FUNGSI TAB SWITCHING DI PANEL PETUGAS ---
function switchTab(tabId) {
  const tabs = document.querySelectorAll('.admin-tab-content');
  tabs.forEach(tab => tab.style.display = 'none');
  
  const buttons = document.querySelectorAll('[id^="btn-tab-"]');
  buttons.forEach(btn => {
    btn.style.background = '#cbd5e1';
    btn.style.color = 'var(--text-dark)';
  });

  document.getElementById(tabId).style.display = 'block';
  const activeBtn = document.getElementById('btn-' + tabId);
  if (activeBtn) {
    activeBtn.style.background = 'var(--primary-color)';
    activeBtn.style.color = 'white';
  }
}

// --- FUNGSI SIMPAN KONTEN HALAMAN LAIN (Sejarah, Visi Misi, dll) ---
function savePageContent(event, pageKey) {
  event.preventDefault();
  let contentData = {};

  if (pageKey === 'sejarah') {
    contentData.text = document.getElementById('input-content-sejarah').value;
  } else if (pageKey === 'visimisi') {
    contentData.visi = document.getElementById('input-content-visi').value;
    contentData.misi = document.getElementById('input-content-misi').value;
  } else if (pageKey === 'struktur') {
    contentData.text = document.getElementById('input-content-struktur').value;
  } else if (pageKey === 'guru') {
    contentData.text = document.getElementById('input-content-guru').value;
  } else if (pageKey === 'pramuka') {
    contentData.text = document.getElementById('input-content-pramuka').value;
  } else if (pageKey === 'pencaksilat') {
    contentData.text = document.getElementById('input-content-pencaksilat').value;
  }

  localStorage.setItem('smpn2_content_' + pageKey, JSON.stringify(contentData));
  alert('Data halaman ' + pageKey + ' berhasil diperbarui dan disimpan!');
  renderPageContent();
}

// --- FUNGSI RENDER KONTEN DINAMIS KE WEBSITE UTAMA ---
function renderPageContent() {
  const sejarahData = JSON.parse(localStorage.getItem('smpn2_content_sejarah'));
  if (sejarahData) {
    const el = document.getElementById('display-sejarah');
    if (el) el.innerHTML = sejarahData.text;
    const inputEl = document.getElementById('input-content-sejarah');
    if (inputEl) inputEl.value = sejarahData.text;
  }

  const visiMisiData = JSON.parse(localStorage.getItem('smpn2_content_visimisi'));
  if (visiMisiData) {
    const elVisi = document.getElementById('display-visi');
    if (elVisi) elVisi.innerHTML = visiMisiData.visi;
    const elMisi = document.getElementById('display-misi');
    if (elMisi) elMisi.innerHTML = visiMisiData.misi;
    
    if (document.getElementById('input-content-visi')) document.getElementById('input-content-visi').value = visiMisiData.visi;
    if (document.getElementById('input-content-misi')) document.getElementById('input-content-misi').value = visiMisiData.misi;
  }

  const strukturData = JSON.parse(localStorage.getItem('smpn2_content_struktur'));
  if (strukturData) {
    const el = document.getElementById('display-struktur');
    if (el) el.innerHTML = strukturData.text;
    if (document.getElementById('input-content-struktur')) document.getElementById('input-content-struktur').value = strukturData.text;
  }

  const guruData = JSON.parse(localStorage.getItem('smpn2_content_guru'));
  if (guruData) {
    const el = document.getElementById('display-guru');
    if (el) el.innerHTML = guruData.text;
    if (document.getElementById('input-content-guru')) document.getElementById('input-content-guru').value = guruData.text;
  }

  const pramukaData = JSON.parse(localStorage.getItem('smpn2_content_pramuka'));
  if (pramukaData) {
    const el = document.getElementById('display-pramuka');
    if (el) el.innerHTML = pramukaData.text;
    if (document.getElementById('input-content-pramuka')) document.getElementById('input-content-pramuka').value = pramukaData.text;
  }

  const silatData = JSON.parse(localStorage.getItem('smpn2_content_pencaksilat'));
  if (silatData) {
    const el = document.getElementById('display-pencaksilat');
    if (el) el.innerHTML = silatData.text;
    if (document.getElementById('input-content-pencaksilat')) document.getElementById('input-content-pencaksilat').value = silatData.text;
  }
}

// Perbarui event listener di bagian paling bawah untuk memuat semuanya saat halaman dibuka
window.addEventListener('DOMContentLoaded', () => {
  renderStudentData();
  renderPageContent();
});

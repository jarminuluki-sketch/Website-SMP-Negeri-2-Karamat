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


// --- 3. FITUR DINAMIS PESERTA DIDIK & MENU PETUGAS (LOCALSTORAGE) ---
const defaultStudentData = {
  '7a': { L: 15, P: 17 },
  '7b': { L: 14, P: 18 },
  '8a': { L: 16, P: 16 },
  '8b': { L: 15, P: 15 },
  '9a': { L: 13, P: 17 },
  '9b': { L: 14, P: 16 }
};

// Ambil data dari localStorage
function getStudentData() {
  const data = localStorage.getItem('smpn2_data_peserta_didik');
  return data ? JSON.parse(data) : defaultStudentData;
}

// Tampilkan data ke halaman website & form input
function renderStudentData() {
  const data = getStudentData();
  const classes = ['7a', '7b', '8a', '8b', '9a', '9b'];

  classes.forEach(cls => {
    const l = data[cls].L;
    const p = data[cls].P;
    const total = l + p;

    // Update kartu tampilan di halaman Peserta Didik
    const spanL = document.getElementById(`val-${cls}-L`);
    const spanP = document.getElementById(`val-${cls}-P`);
    const spanTotal = document.getElementById(`val-${cls}-total`);
    if (spanL) spanL.innerText = `${l} Siswa`;
    if (spanP) spanP.innerText = `${p} Siswa`;
    if (spanTotal) spanTotal.innerText = `Total: ${total} Siswa`;

    // Update nilai pada form input di Menu Petugas
    const inputL = document.getElementById(`input-${cls}-L`);
    const inputP = document.getElementById(`input-${cls}-P`);
    if (inputL) inputL.value = l;
    if (inputP) inputP.value = p;
  });
}

// Simpan data dari form input ke localStorage
function saveStudentData(event) {
  event.preventDefault();
  const classes = ['7a', '7b', '8a', '8b', '9a', '9b'];
  let newData = {};

  classes.forEach(cls => {
    const lVal = parseInt(document.getElementById(`input-${cls}-L`).value) || 0;
    const pVal = parseInt(document.getElementById(`input-${cls}-P`).value) || 0;
    newData[cls] = { L: lVal, P: pVal };
  });

  localStorage.setItem('smpn2_data_peserta_didik', JSON.stringify(newData));
  renderStudentData();
  alert('Data peserta didik berhasil diperbarui dan disimpan!');
  showPage('view-peserta-didik');
}


// --- 4. SISTEM KEAMANAN LOGIN PETUGAS ---

function checkLoginAndOpenMenu() {
  const isAuth = localStorage.getItem('smpn2_petugas_logged_in');
  if (isAuth === 'true') {
    showPage('view-menu-petugas');
  } else {
    showPage('view-login-petugas');
  }
}

function handleLogin(event) {
  event.preventDefault();
  const user = document.getElementById('login-user').value;
  const pass = document.getElementById('login-pass').value;

  // Kredensial Petugas (bisa disesuaikan kapan saja)
  const validUser = 'admin';
  const validPass = 'smpn2karamat';

  if (user === validUser && pass === validPass) {
    localStorage.setItem('smpn2_petugas_logged_in', 'true');
    alert('Login Berhasil! Selamat datang petugas.');
    document.getElementById('login-user').value = '';
    document.getElementById('login-pass').value = '';
    showPage('view-menu-petugas');
  } else {
    alert('Username atau Password salah! Silakan coba lagi.');
  }
}

function handleLogout() {
  localStorage.removeItem('smpn2_petugas_logged_in');
  alert('Anda telah keluar dari Menu Petugas.');
  showPage('view-beranda');
}


// --- 5. EKSEKUSI AWAL SAAT HALAMAN DIMUAT ---
window.addEventListener('DOMContentLoaded', () => {
  renderStudentData();
});

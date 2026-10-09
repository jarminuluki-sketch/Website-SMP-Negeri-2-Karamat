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

// --- KELOLA HALAMAN BERANDA ---
function saveBerandaData(event) {
  event.preventDefault();
  const berandaData = {
    sambutan: document.getElementById('input-beranda-sambutan').value,
    kegiatan: document.getElementById('input-beranda-kegiatan').value,
    banner: document.getElementById('input-beranda-banner').value,
    kepsek: document.getElementById('input-beranda-kepsek').value,
    kadis: document.getElementById('input-beranda-kadis').value
  };

  localStorage.setItem('smpn2_content_beranda', JSON.stringify(berandaData));
  renderBerandaData();
  alert('Data Halaman Beranda berhasil diperbarui dan disimpan!');
}

function renderBerandaData() {
  const data = JSON.parse(localStorage.getItem('smpn2_content_beranda'));
  if (data) {
    if (document.getElementById('display-beranda-sambutan')) document.getElementById('display-beranda-sambutan').innerText = data.sambutan;
    if (document.getElementById('display-beranda-kegiatan')) document.getElementById('display-beranda-kegiatan').innerText = data.kegiatan;
    if (document.getElementById('display-beranda-banner')) document.getElementById('display-beranda-banner').src = data.banner;
    if (document.getElementById('display-beranda-kepsek')) document.getElementById('display-beranda-kepsek').src = data.kepsek;
    if (document.getElementById('display-beranda-kadis')) document.getElementById('display-beranda-kadis').src = data.kadis;

    if (document.getElementById('input-beranda-sambutan')) document.getElementById('input-beranda-sambutan').value = data.sambutan;
    if (document.getElementById('input-beranda-kegiatan')) document.getElementById('input-beranda-kegiatan').value = data.kegiatan;
    if (document.getElementById('input-beranda-banner')) document.getElementById('input-beranda-banner').value = data.banner;
    if (document.getElementById('input-beranda-kepsek')) document.getElementById('input-beranda-kepsek').value = data.kepsek;
    if (document.getElementById('input-beranda-kadis')) document.getElementById('input-beranda-kadis').value = data.kadis;
  }
}
// --- KELOLA DAFTAR KEGIATAN DINAMIS ---
function getKegiatanList() {
  const data = localStorage.getItem('smpn2_content_kegiatan_list');
  return data ? JSON.parse(data) : [];
}

function tambahKegiatan() {
  const judul = document.getElementById('input-kegiatan-judul').value;
  const tanggal = document.getElementById('input-kegiatan-tanggal').value;
  const deskripsi = document.getElementById('input-kegiatan-deskripsi').value;

  if (!judul || !deskripsi) {
    alert('Judul dan Deskripsi kegiatan wajib diisi!');
    return;
  }

  let list = getKegiatanList();
  list.push({ judul, tanggal, deskripsi });
  localStorage.setItem('smpn2_content_kegiatan_list', JSON.stringify(list));

  document.getElementById('input-kegiatan-judul').value = '';
  document.getElementById('input-kegiatan-tanggal').value = '';
  document.getElementById('input-kegiatan-deskripsi').value = '';

  renderKegiatanList();
  alert('Kegiatan berhasil ditambahkan ke daftar!');
}

function hapusKegiatan(index) {
  let list = getKegiatanList();
  list.splice(index, 1);
  localStorage.setItem('smpn2_content_kegiatan_list', JSON.stringify(list));
  renderKegiatanList();
}

function renderKegiatanList() {
  const list = getKegiatanList();
  
  const adminListEl = document.getElementById('admin-kegiatan-list');
  if (adminListEl) {
    if (list.length === 0) {
      adminListEl.innerHTML = '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada kegiatan yang ditambahkan.</p>';
    } else {
      adminListEl.innerHTML = list.map((item, idx) => `
        <div style="background: #f8fafc; padding: 12px 15px; border-radius: 6px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong style="color: var(--primary-color);">${item.judul}</strong> <span style="font-size: 0.8rem; color: var(--text-muted);">(${item.tanggal || 'Tanpa Tanggal'})</span>
            <p style="font-size: 0.85rem; color: var(--text-dark); margin-top: 3px;">${item.deskripsi}</p>
          </div>
          <button type="button" onclick="hapusKegiatan(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;"><i class="fas fa-trash"></i> Hapus</button>
        </div>
      `).join('');
    }
  }

  const publicListEl = document.getElementById('display-beranda-kegiatan-list');
  if (publicListEl) {
    if (list.length === 0) {
      publicListEl.innerHTML = '<p style="color: var(--text-muted);">Belum ada informasi kegiatan terbaru.</p>';
    } else {
      publicListEl.innerHTML = list.map(item => `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
          <span style="font-size: 0.75rem; background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 4px; font-weight: 600;"><i class="fas fa-calendar-alt"></i> ${item.tanggal || 'Agenda Sekolah'}</span>
          <h4 style="color: var(--primary-color); margin: 10px 0 6px 0; font-size: 1.05rem;">${item.judul}</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;">${item.deskripsi}</p>
        </div>
      `).join('');
    }
  }
}

// --- 6. EKSEKUSI AWAL SAAT HALAMAN DIMUAT ---
window.addEventListener('DOMContentLoaded', () => {
  renderStudentData();
  renderPageContent();
  renderBerandaData();
  renderKegiatanList(); // <--- Tambahkan baris ini di sini
});

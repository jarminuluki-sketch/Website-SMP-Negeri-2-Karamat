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

    const inputL = document.getElementById(`input-${cls}-l`);
    const inputP = document.getElementById(`input-${cls}-p`);
    const inputWali = document.getElementById(`input-${cls}-wali`);
    const inputFoto = document.getElementById(`input-${cls}-foto`);

    if (inputL) inputL.value = clsduta.l;
    if (inputP) inputP.value = clsduta.p;
    if (inputWali) inputWali.value = clsduta.wali;
    if (inputFoto) inputFoto.value = clsduta.foto;
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
  alert('Data peserta didik berhasil diperbarui dan disimpan!');
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

function handleLogout() {
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

// --- 5. SIMPAN KONTEN DINAMIS LAINNYA ---
function savePageContent(event, pageKey) {
  event.preventDefault();
  let contentdata = {};

  if (pageKey === 'sejarah') {
    contentdata.text = document.getElementById('input-content-sejarah').value;
  } else if (pageKey === 'visimisi') {
    contentdata.visi = document.getElementById('input-content-visi').value;
    contentdata.misi = document.getElementById('input-content-misi').value;
  } else if (pageKey === 'tupoksi') {
    contentdata.text = document.getElementById('input-content-tupoksi').value;
  }

  localStorage.setItem('smpn2_content_' + pageKey, JSON.stringify(contentdata));
  alert(`Data ${pageKey} berhasil diperbarui dan disimpan!`);
  renderPageContent();
}

function saveStrukturGambar(event) {
  event.preventDefault();
  const imgUrl = document.getElementById('input-struktur-img').value.trim();
  localStorage.setItem('smpn2_content_struktur_img', imgUrl);
  renderPageContent();
  alert('Gambar Struktur Organisasi berhasil diperbarui!');
}

function saveKontakData(event) {
  event.preventDefault();
  const kontakData = {
    alamat: document.getElementById('input-kontak-alamat').value.trim(),
    telp: document.getElementById('input-kontak-telp').value.trim(),
    email: document.getElementById('input-kontak-email').value.trim(),
    maps: document.getElementById('input-kontak-maps').value.trim()
  };
  localStorage.setItem('smpn2_content_kontak', JSON.stringify(kontakData));
  renderPageContent();
  alert('Informasi Kontak berhasil diperbarui!');
}

function renderPageContent() {
  const sejarahData = JSON.parse(localStorage.getItem('smpn2_content_sejarah'));
  if (sejarahData) {
    const el = document.getElementById('display-sejarah');
    if (el) el.innerHTML = `<p>${sejarahData.text}</p>`;
    const input1 = document.getElementById('input-content-sejarah');
    if (input1) input1.value = sejarahData.text;
  }

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

  const tupoksiData = JSON.parse(localStorage.getItem('smpn2_content_tupoksi'));
  if (tupoksiData) {
    const elTupoksi = document.getElementById('display-tupoksi');
    if (elTupoksi) elTupoksi.innerHTML = `<p>${tupoksiData.text}</p>`;
    const inTupoksi = document.getElementById('input-content-tupoksi');
    if (inTupoksi) inTupoksi.value = tupoksiData.text;
  }

  const strukturImg = localStorage.getItem('smpn2_content_struktur_img');
  if (strukturImg) {
    const imgEl = document.getElementById('display-struktur-img');
    if (imgEl) imgEl.src = strukturImg;
    const inputStruktur = document.getElementById('input-struktur-img');
    if (inputStruktur) inputStruktur.value = strukturImg;
  }

  const kontakData = JSON.parse(localStorage.getItem('smpn2_content_kontak'));
  if (kontakData) {
    if (document.getElementById('display-kontak-alamat')) document.getElementById('display-kontak-alamat').innerText = kontakData.alamat;
    if (document.getElementById('display-kontak-telp')) document.getElementById('display-kontak-telp').innerText = kontakData.telp;
    if (document.getElementById('display-kontak-email')) document.getElementById('display-kontak-email').innerText = kontakData.email;
    if (document.getElementById('display-kontak-maps')) document.getElementById('display-kontak-maps').src = kontakData.maps;

    if (document.getElementById('input-kontak-alamat')) document.getElementById('input-kontak-alamat').value = kontakData.alamat;
    if (document.getElementById('input-kontak-telp')) document.getElementById('input-kontak-telp').value = kontakData.telp;
    if (document.getElementById('input-kontak-email')) document.getElementById('input-kontak-email').value = kontakData.email;
    if (document.getElementById('input-kontak-maps')) document.getElementById('input-kontak-maps').value = kontakData.maps;
  }
}

// --- KELOLA HALAMAN BERANDA ---
function saveBerandaData(event) {
  event.preventDefault();
  const berandaData = {
    sambutan: document.getElementById('input-beranda-sambutan').value,
    banner: document.getElementById('input-beranda-banner').value,
    kepsek: document.getElementById('input-beranda-kepsek').value
  };

  localStorage.setItem('smpn2_content_beranda', JSON.stringify(berandaData));
  renderBerandaData();
  alert('Data Halaman Beranda berhasil diperbarui dan disimpan!');
}

function renderBerandaData() {
  const data = JSON.parse(localStorage.getItem('smpn2_content_beranda'));
  if (data) {
    if (document.getElementById('display-beranda-sambutan')) document.getElementById('display-beranda-sambutan').innerText = data.sambutan;
    if (document.getElementById('display-beranda-banner')) document.getElementById('display-beranda-banner').src = data.banner;
    if (document.getElementById('display-beranda-kepsek')) document.getElementById('display-beranda-kepsek').src = data.kepsek;

    if (document.getElementById('input-beranda-sambutan')) document.getElementById('input-beranda-sambutan').value = data.sambutan;
    if (document.getElementById('input-beranda-banner')) document.getElementById('input-beranda-banner').value = data.banner;
    if (document.getElementById('input-beranda-kepsek')) document.getElementById('input-beranda-kepsek').value = data.kepsek;
  }
}

// --- KELOLA DAFTAR KEGIATAN DINAMIS ---
function getKegiatanList() {
  const data = localStorage.getItem('smpn2_content_kegiatan_list');
  return data ? JSON.parse(data) : [];
}

function tambahKegiatan() {
  const judulEl = document.getElementById('input-kegiatan-judul');
  const tanggalEl = document.getElementById('input-kegiatan-tanggal');
  const deskripsiEl = document.getElementById('input-kegiatan-deskripsi');

  if (!judulEl || !deskripsiEl) return;

  const judul = judulEl.value.trim();
  const tanggal = tanggalEl.value.trim();
  const deskripsi = deskripsiEl.value.trim();

  if (!judul || !deskripsi) {
    alert('Judul dan Deskripsi kegiatan wajib diisi!');
    return;
  }

  let list = getKegiatanList();
  list.push({ judul, tanggal, deskripsi });
  localStorage.setItem('smpn2_content_kegiatan_list', JSON.stringify(list));

  judulEl.value = '';
  tanggalEl.value = '';
  deskripsiEl.value = '';

  renderKegiatanList();
  alert('Kegiatan berhasil ditambahkan!');
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
    adminListEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada kegiatan.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div><strong>${item.judul}</strong> (${item.tanggal || 'Tanpa Tanggal'})<p style="font-size: 0.85rem;">${item.deskripsi}</p></div>
        <button type="button" onclick="hapusKegiatan(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Hapus</button>
      </div>
    `).join('');
  }

  const publicListEl = document.getElementById('display-beranda-kegiatan-list');
  if (publicListEl) {
    publicListEl.innerHTML = list.length === 0 ? '<p style="color: var(--text-muted);">Belum ada informasi kegiatan terbaru.</p>' : list.map(item => `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
        <span style="font-size: 0.75rem; background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 4px; font-weight: 600;">${item.tanggal || 'Agenda Sekolah'}</span>
        <h4 style="color: var(--primary-color); margin: 10px 0 6px 0;">${item.judul}</h4>
        <p style="color: var(--text-muted); font-size: 0.9rem;">${item.deskripsi}</p>
      </div>
    `).join('');
  }
}

// --- KELOLA VIDEO KEGIATAN DINAMIS ---
function getVideoList() {
  const data = localStorage.getItem('smpn2_content_video_list');
  return data ? JSON.parse(data) : [];
}

function tambahVideo() {
  const judulEl = document.getElementById('input-video-judul');
  const urlEl = document.getElementById('input-video-url');
  const ketEl = document.getElementById('input-video-ket');

  if (!judulEl || !urlEl || !ketEl) return;

  const judul = judulEl.value.trim();
  const url = urlEl.value.trim();
  const ket = ketEl.value.trim();

  if (!judul || !url) {
    alert('Judul dan URL Embed Video wajib diisi!');
    return;
  }

  let list = getVideoList();
  list.push({ judul, url, ket });
  localStorage.setItem('smpn2_content_video_list', JSON.stringify(list));

  judulEl.value = '';
  urlEl.value = '';
  ketEl.value = '';

  renderVideoList();
  alert('Video kegiatan berhasil ditambahkan!');
}

function hapusVideo(index) {
  let list = getVideoList();
  list.splice(index, 1);
  localStorage.setItem('smpn2_content_video_list', JSON.stringify(list));
  renderVideoList();
}

function renderVideoList() {
  const list = getVideoList();
  const adminEl = document.getElementById('admin-video-list');
  if (adminEl) {
    adminEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada video.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div><strong>${item.judul}</strong><br><small style="color: var(--text-muted);">${item.url}</small></div>
        <button type="button" onclick="hapusVideo(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Hapus</button>
      </div>
    `).join('');
  }

  const publicEl = document.getElementById('display-beranda-video-list');
  if (publicEl) {
    publicEl.innerHTML = list.length === 0 ? '<p style="color: var(--text-muted);">Belum ada video kegiatan yang ditambahkan.</p>' : list.map(item => `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
        <div style="width: 100%; height: 200px;">
          <iframe src="${item.url}" title="${item.judul}" width="100%" height="100%" style="border:0;" allowfullscreen></iframe>
        </div>
        <div style="padding: 15px;">
          <h4 style="color: var(--primary-color); margin-bottom: 6px; font-size: 1.05rem;">${item.judul}</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem;">${item.ket}</p>
        </div>
      </div>
    `).join('');
  }
}

// --- KELOLA SARANA & PRASARANA DINAMIS ---
function getSaranaList() {
  const data = localStorage.getItem('smpn2_content_sarana_list');
  return data ? JSON.parse(data) : [];
}

function tambahSarana() {
  const namaEl = document.getElementById('input-sarana-nama');
  const fotoEl = document.getElementById('input-sarana-foto');
  const ketEl = document.getElementById('input-sarana-ket');

  if (!namaEl || !ketEl) return;

  const nama = namaEl.value.trim();
  const foto = fotoEl.value.trim() || 'https://via.placeholder.com/300x200';
  const ket = ketEl.value.trim();

  if (!nama || !ket) {
    alert('Nama sarana dan keterangan wajib diisi!');
    return;
  }

  let list = getSaranaList();
  list.push({ nama, foto, ket });
  localStorage.setItem('smpn2_content_sarana_list', JSON.stringify(list));

  namaEl.value = '';
  fotoEl.value = '';
  ketEl.value = '';

  renderSaranaList();
  alert('Sarana & Prasarana berhasil ditambahkan!');
}

function hapusSarana(index) {
  let list = getSaranaList();
  list.splice(index, 1);
  localStorage.setItem('smpn2_content_sarana_list', JSON.stringify(list));
  renderSaranaList();
}

function renderSaranaList() {
  const list = getSaranaList();
  const adminEl = document.getElementById('admin-sarana-list');
  if (adminEl) {
    adminEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada sarana.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; padding: 10px 15px; border-radius: 6px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="${item.foto}" style="width: 50px; height: 40px; border-radius: 4px; object-fit: cover;">
          <div><strong>${item.nama}</strong><br><small style="color: var(--text-muted);">${item.ket}</small></div>
        </div>
        <button type="button" onclick="hapusSarana(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Hapus</button>
      </div>
    `).join('');
  }

  const publicEl = document.getElementById('display-sarana-list');
  if (publicEl) {
    publicEl.innerHTML = list.length === 0 ? '<p style="color: var(--text-muted);">Belum ada data sarana dan prasarana.</p>' : list.map(item => `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
        <img src="${item.foto}" alt="${item.nama}" style="width: 100%; height: 180px; object-fit: cover;">
        <div style="padding: 15px;">
          <h4 style="color: var(--primary-color); margin-bottom: 8px; font-size: 1.05rem;">${item.nama}</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem;">${item.ket}</p>
        </div>
      </div>
    `).join('');
  }
}

// --- KELOLA GURU & STAF OTOMATIS (TANPA BINGKAI & BACKGROUND) ---
function getGuruList() {
  const data = localStorage.getItem('smpn2_content_guru_list');
  return data ? JSON.parse(data) : [];
}

function tambahGuru() {
  const namaEl = document.getElementById('input-guru-nama');
  const mapelEl = document.getElementById('input-guru-mapel');
  const fotoEl = document.getElementById('input-guru-foto');

  if (!namaEl || !mapelEl) return;

  const nama = namaEl.value.trim();
  const mapel = mapelEl.value.trim();
  const foto = fotoEl.value.trim() || 'https://via.placeholder.com/150';

  if (!nama || !mapel) {
    alert('Nama dan Jabatan/Mapel guru wajib diisi!');
    return;
  }

  let list = getGuruList();
  list.push({ nama, mapel, foto });
  localStorage.setItem('smpn2_content_guru_list', JSON.stringify(list));

  namaEl.value = '';
  mapelEl.value = '';
  fotoEl.value = '';

  renderGuruList();
  alert('Data guru berhasil ditambahkan!');
}

function hapusGuru(index) {
  let list = getGuruList();
  list.splice(index, 1);
  localStorage.setItem('smpn2_content_guru_list', JSON.stringify(list));
  renderGuruList();
}

function renderGuruList() {
  const list = getGuruList();
  const adminEl = document.getElementById('admin-guru-list');
  if (adminEl) {
    adminEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada guru.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; padding: 10px 15px; border-radius: 6px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="${item.foto}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
          <div><strong>${item.nama}</strong><br><small style="color: var(--text-muted);">${item.mapel}</small></div>
        </div>
        <button type="button" onclick="hapusGuru(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Hapus</button>
      </div>
    `).join('');
  }

  const publicEl = document.getElementById('display-guru-list');
  if (publicEl) {
    publicEl.innerHTML = list.length === 0 ? '<p style="color: var(--text-muted);">Belum ada daftar dewan guru yang ditampilkan.</p>' : list.map(item => `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
        <img src="${item.foto}" alt="${item.nama}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 12px; border: none; background: transparent;">
        <h4 style="color: var(--primary-color); margin-bottom: 5px; font-size: 1rem;">${item.nama}</h4>
        <p style="color: var(--text-muted); font-size: 0.85rem;">${item.mapel}</p>
      </div>
    `).join('');
  }
}

// --- KELOLA KEGIATAN PRAMUKA ---
function getPramukaList() {
  const data = localStorage.getItem('smpn2_content_pramuka_list');
  return data ? JSON.parse(data) : [];
}

function tambahPramuka() {
  const judulEl = document.getElementById('input-pramuka-judul');
  const fotoEl = document.getElementById('input-pramuka-foto');
  const ketEl = document.getElementById('input-pramuka-ket');

  if (!judulEl || !ketEl) return;

  const judul = judulEl.value.trim();
  const foto = fotoEl.value.trim() || 'https://via.placeholder.com/300x200';
  const ket = ketEl.value.trim();

  if (!judul || !ket) {
    alert('Judul dan Keterangan kegiatan pramuka wajib diisi!');
    return;
  }

  let list = getPramukaList();
  list.push({ judul, foto, ket });
  localStorage.setItem('smpn2_content_pramuka_list', JSON.stringify(list));

  judulEl.value = '';
  fotoEl.value = '';
  ketEl.value = '';

  renderPramukaList();
  alert('Kegiatan Pramuka berhasil ditambahkan!');
}

function hapusPramuka(index) {
  let list = getPramukaList();
  list.splice(index, 1);
  localStorage.setItem('smpn2_content_pramuka_list', JSON.stringify(list));
  renderPramukaList();
}

function renderPramukaList() {
  const list = getPramukaList();
  const adminEl = document.getElementById('admin-pramuka-list');
  if (adminEl) {
    adminEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada kegiatan.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; padding: 10px 15px; border-radius: 6px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="${item.foto}" style="width: 50px; height: 40px; border-radius: 4px; object-fit: cover;">
          <div><strong>${item.judul}</strong><br><small style="color: var(--text-muted);">${item.ket}</small></div>
        </div>
        <button type="button" onclick="hapusPramuka(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Hapus</button>
      </div>
    `).join('');
  }

  const publicEl = document.getElementById('display-pramuka-list');
  if (publicEl) {
    publicEl.innerHTML = list.length === 0 ? '<p style="color: var(--text-muted);">Belum ada dokumentasi kegiatan pramuka.</p>' : list.map(item => `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
        <img src="${item.foto}" alt="${item.judul}" style="width: 100%; height: 180px; object-fit: cover;">
        <div style="padding: 15px;">
          <h4 style="color: var(--primary-color); margin-bottom: 8px; font-size: 1.05rem;">${item.judul}</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem;">${item.ket}</p>
        </div>
      </div>
    `).join('');
  }
}

// --- KELOLA KEGIATAN PENCAK SILAT ---
function getSilatList() {
  const data = localStorage.getItem('smpn2_content_silat_list');
  return data ? JSON.parse(data) : [];
}

function tambahSilat() {
  const judulEl = document.getElementById('input-silat-judul');
  const fotoEl = document.getElementById('input-silat-foto');
  const ketEl = document.getElementById('input-silat-ket');

  if (!judulEl || !ketEl) return;

  const judul = judulEl.value.trim();
  const foto = fotoEl.value.trim() || 'https://via.placeholder.com/300x200';
  const ket = ketEl.value.trim();

  if (!judul || !ket) {
    alert('Judul dan Keterangan kegiatan pencak silat wajib diisi!');
    return;
  }

  let list = getSilatList();
  list.push({ judul, foto, ket });
  localStorage.setItem('smpn2_content_silat_list', JSON.stringify(list));

  judulEl.value = '';
  fotoEl.value = '';
  ketEl.value = '';

  renderSilatList();
  alert('Kegiatan Pencak Silat berhasil ditambahkan!');
}

function hapusSilat(index) {
  let list = getSilatList();
  list.splice(index, 1);
  localStorage.setItem('smpn2_content_silat_list', JSON.stringify(list));
  renderSilatList();
}

function renderSilatList() {
  const list = getSilatList();
  const adminEl = document.getElementById('admin-silat-list');
  if (adminEl) {
    adminEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada kegiatan.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; padding: 10px 15px; border-radius: 6px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="${item.foto}" style="width: 50px; height: 40px; border-radius: 4px; object-fit: cover;">
          <div><strong>${item.judul}</strong><br><small style="color: var(--text-muted);">${item.ket}</small></div>
        </div>
        <button type="button" onclick="hapusSilat(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Hapus</button>
      </div>
    `).join('');
  }

  const publicEl = document.getElementById('display-pencaksilat-list');
  if (publicEl) {
    publicEl.innerHTML = list.length === 0 ? '<p style="color: var(--text-muted);">Belum ada dokumentasi kegiatan pencak silat.</p>' : list.map(item => `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
        <img src="${item.foto}" alt="${item.judul}" style="width: 100%; height: 180px; object-fit: cover;">
        <div style="padding: 15px;">
          <h4 style="color: var(--primary-color); margin-bottom: 8px; font-size: 1.05rem;">${item.judul}</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem;">${item.ket}</p>
        </div>
      </div>
    `).join('');
  }
}

// --- 6. EKSEKUSI AWAL SAAT HALAMAN DIMUAT ---
window.addEventListener('DOMContentLoaded', () => {
  renderStudentData();
  renderPageContent();
  renderBerandaData();
  renderKegiatanList();
  renderVideoList();
  renderSaranaList();
  renderGuruList();
  renderPramukaList();
  renderSilatList();
});

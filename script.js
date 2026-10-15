// --- INISIALISASI SUPABASE (DATABASE CLOUD) ---
const SUPABASE_URL = 'https://lnspkgaiycmesydzxvaa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imluc3BrZ2FpeWNtZXN5ZHp4dmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMx...'; // Ganti dengan anon key Anda
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fungsi Umum Mengambil Data dari Supabase
async function fetchFromSupabase(sectionKey, defaultValue) {
  try {
    let { data, error } = await supabaseClient
      .from('site_content')
      .select('data_json')
      .eq('section_key', sectionKey)
      .maybeSingle();
    
    if (error) throw error;
    return data ? JSON.parse(data.data_json) : defaultValue;
  } catch (err) {
    console.error("Gagal mengambil data:", err);
    return defaultValue;
  }
}

// Fungsi Umum Menyimpan Data ke Supabase (Tanpa Alert Mengganggu)
async function saveToSupabase(sectionKey, jsonData) {
  try {
    const jsonString = JSON.stringify(jsonData);
    
    let { data } = await supabaseClient
      .from('site_content')
      .select('section_key')
      .eq('section_key', sectionKey)
      .maybeSingle();

    if (data) {
      await supabaseClient
        .from('site_content')
        .update({ data_json: jsonString })
        .eq('section_key', sectionKey);
    } else {
      await supabaseClient
        .from('site_content')
        .insert([{ section_key: sectionKey, data_json: jsonString }]);
    }
  } catch (err) {
    console.error("Gagal menyimpan ke cloud:", err);
  }
}


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


// --- FUNGSI AKSESIBILITAS SIDEBAR & UKURAN FONT ---
function toggleAccessibilityModal() {
  const modal = document.getElementById('accessibilityModal');
  if (modal) {
    modal.classList.toggle('active');
  }
}

let currentFontScale = 1;
function changeFontSize(amount) {
  currentFontScale += amount / 100;
  
  if (currentFontScale < 0.8) currentFontScale = 0.8;
  if (currentFontScale > 1.6) currentFontScale = 1.6;

  document.documentElement.style.setProperty('--font-scale', currentFontScale);
  
  const display = document.getElementById('fontSizeDisplay');
  if (display) {
    display.innerText = Math.round(currentFontScale * 100) + '%';
  }
}

function toggleBodyClass(className, enable) {
  if (enable) {
    document.body.classList.add(className);
  } else {
    document.body.classList.remove(className);
  }
}


// --- FUNGSI BANTUAN: KONSISTENSI URL YOUTUBE EMBED ---
function parseYoutubeEmbedUrl(url) {
  if (!url) return '';
  let videoId = '';
  
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('youtube.com/watch')) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    videoId = urlParams.get('v');
  } else if (url.includes('youtube.com/embed/')) {
    videoId = url.split('youtube.com/embed/')[1].split('?')[0];
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}


// --- KELOLA MENU TAUTAN EKSTERNAL DINAMIS ---
const defaultTautanList = [
  { nama: 'KEMENPAN-RB', url: 'https://www.menpan.go.id' },
  { nama: 'KEMENDIKDASMEN', url: 'https://www.kemendikbud.go.id' },
  { nama: 'Portal Kab. Buol', url: 'https://buolkab.go.id' },
  { nama: 'Dapodikdasmen', url: 'https://dapo.kemdikbud.go.id' }
];

async function renderTautanList() {
  let list = await fetchFromSupabase('tautan_list', defaultTautanList);
  
  const adminEl = document.getElementById('admin-tautan-list');
  if (adminEl) {
    adminEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada tautan.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; padding: 12px 15px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div><strong>${idx + 1}. ${item.nama}</strong><br><small style="color: var(--text-muted);">${item.url}</small></div>
        <button type="button" onclick="hapusTautanItem(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Hapus</button>
      </div>
    `).join('');
  }

  const navbarEl = document.getElementById('display-navbar-tautan');
  if (navbarEl) {
    navbarEl.innerHTML = list.map(item => `
      <li><a href="${item.url}" target="_blank"><i class="fas fa-external-link-alt"></i> ${item.nama}</a></li>
    `).join('');
  }
}

async function tambahTautanItem() {
  const namaEl = document.getElementById('input-tautan-nama');
  const urlEl = document.getElementById('input-tautan-url');

  if (!namaEl || !urlEl) return;
  const nama = namaEl.value.trim();
  const url = urlEl.value.trim();

  if (!nama || !url) {
    alert('Nama Tautan dan URL wajib diisi!');
    return;
  }

  let list = await fetchFromSupabase('tautan_list', defaultTautanList);
  list.push({ nama, url });
  
  localStorage.setItem('smpn2_content_tautan_list', JSON.stringify(list));
  await saveToSupabase('tautan_list', list);

  namaEl.value = '';
  urlEl.value = '';
  renderTautanList();
  alert('Tautan berhasil ditambahkan!');
}

async function hapusTautanItem(index) {
  let list = await fetchFromSupabase('tautan_list', defaultTautanList);
  list.splice(index, 1);
  
  localStorage.setItem('smpn2_content_tautan_list', JSON.stringify(list));
  await saveToSupabase('tautan_list', list);
  renderTautanList();
}


// --- 2. FITUR DINAMIS DATA SISWA ---
const defaultStudentData = {
  '7a': { l: 18, p: 17, wali: 'Dra. Hj. Nurain, M.Pd', foto: 'https://via.placeholder.com/150' },
  '7b': { l: 17, p: 18, wali: 'Moh. Rifai, S.Pd', foto: 'https://via.placeholder.com/150' },
  '8a': { l: 16, p: 18, wali: 'Siti Aminuh, S.Pd', foto: 'https://via.placeholder.com/150' },
  '8b': { l: 17, p: 15, wali: 'Ahmad Yado, S.Sos', foto: 'https://via.placeholder.com/150' },
  '9a': { l: 14, p: 17, wali: 'Irawati Nigi, S.Pd', foto: 'https://via.placeholder.com/150' },
  '9b': { l: 15, p: 16, wali: 'Supratman, S.Pd', foto: 'https://via.placeholder.com/150' }
};

async function renderStudentData() {
  let data = await fetchFromSupabase('student_data', defaultStudentData);
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

async function saveStudentData(event) {
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
  await saveToSupabase('student_data', newdata);
  
  renderStudentData();
  alert('Data peserta didik berhasil diperbarui!');
}


// --- 3. LOGIN & KONTROL PETUGAS ---
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
    alert('Username atau Password salah!');
  }
}

function handleLogout() {
  localStorage.removeItem('smpn2_petugas_logged_in');
  alert('Anda telah keluar.');
  showPage('view-beranda');
}


// --- 4. TAB SWITCHING ---
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


// --- 5. KELOLA VISI & MISI DINAMIS ---
const defaultVisi = "Mewujudkan Peserta Didik yang Berkarakter, Berakhlak Mulia dan Berbudaya berdasarkan Iman dan Taqwa, Berjiwa Kewargaan Serta Mampu Berkolaborasi dan Bertanggung Jawab";

const defaultMisiList = [
  "Menanamkan Keimanan, Ketakwaan dan Akhlak Mulia Melalui Pembiasaan Nilai-nilai Agama",
  "Menumbuhkan Sikap Disiplin, Tanggung jawab dan Cinta Tanah Air Sebagai Wujud Jiwa Kewargaan",
  "Mengembangkan Budaya Sekolah yang Santun, Bersih, Aman dan Menghargai Keberagaman",
  "Membiasakan Diri Bagi Peserta Didik Untuk Bekerjasama, Gotong-royong dan Peduli Terhadap Sesama",
  "Mengembangkan Potensi, Bakat dan Kreativitas Peserta Didik Secara Optimal"
];

async function renderVisiMisi() {
  let visiText = await fetchFromSupabase('visi_text', defaultVisi);
  let misiList = await fetchFromSupabase('misi_list', defaultMisiList);

  const visiEl = document.getElementById('display-visi');
  if (visiEl) visiEl.innerText = visiText;

  const inputVisi = document.getElementById('input-content-visi');
  if (inputVisi) inputVisi.value = visiText;

  const adminEl = document.getElementById('admin-misi-list');
  if (adminEl) {
    adminEl.innerHTML = misiList.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada poin misi.</p>' : misiList.map((item, idx) => `
      <div style="background: #f8fafc; padding: 10px 15px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div><strong>${idx + 1}.</strong> ${item}</div>
        <button type="button" onclick="hapusMisiPoin(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Hapus</button>
      </div>
    `).join('');
  }

  const publicEl = document.getElementById('display-misi-list');
  if (publicEl) {
    publicEl.innerHTML = misiList.length === 0 ? '<p style="color: var(--text-muted);">Belum ada misi.</p>' : misiList.map((item, idx) => `
      <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; gap: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
        <div style="background: var(--primary-color); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; font-size: 0.95rem;">${idx + 1}</div>
        <div style="color: var(--text-dark); font-weight: 500; font-size: 0.98rem; line-height: 1.5;">${item}</div>
      </div>
    `).join('');
  }
}

async function saveVisiOnly() {
  const val = document.getElementById('input-content-visi').value.trim();
  if (!val) return alert('Visi tidak boleh kosong!');
  
  localStorage.setItem('smpn2_content_visi', val);
  await saveToSupabase('visi_text', val);
  
  renderVisiMisi();
  alert('Visi berhasil diperbarui!');
}

async function tambahMisiPoin() {
  const inputEl = document.getElementById('input-misi-poin');
  if (!inputEl) return;
  const text = inputEl.value.trim();
  if (!text) return alert('Poin Misi tidak boleh kosong!');

  let list = await fetchFromSupabase('misi_list', defaultMisiList);
  list.push(text);
  
  localStorage.setItem('smpn2_content_misi_list', JSON.stringify(list));
  await saveToSupabase('misi_list', list);
  
  inputEl.value = '';
  renderVisiMisi();
  alert('Poin Misi berhasil ditambahkan!');
}

async function hapusMisiPoin(index) {
  let list = await fetchFromSupabase('misi_list', defaultMisiList);
  list.splice(index, 1);
  
  localStorage.setItem('smpn2_content_misi_list', JSON.stringify(list));
  await saveToSupabase('misi_list', list);
  renderVisiMisi();
}


// --- 6. KELOLA TUPOKSI DINAMIS ---
const defaultTupoksiList = [
  { judul: 'Kepala Sekolah', deskripsi: 'Mengoperasikan fungsi kepemimpinan dan manajerial sekolah untuk meningkatkan mutu pendidikan.' },
  { judul: 'Manajerial', deskripsi: 'Menyusun perencanaan sekolah (RKT/RKAS), mengelola kurikulum, kesiswaan, sarana prasarana, serta keuangan sekolah.' },
  { judul: 'Supervisi & Evaluasi', deskripsi: 'Melakukan supervisi akademis terhadap guru, mengevaluasi kinerja tenaga kependidikan, serta memantau program sekolah.' },
  { judul: 'Kewirausahaan', deskripsi: 'Mengembangkan inovasi, kemitraan, dan kreativitas untuk kemajuan dan kemandirian sekolah.' },
  { judul: 'Pengembangan SDM', deskripsi: 'Membina profesionalisme guru dan staf tata usaha secara berkelanjutan.' }
];

async function renderTupoksiList() {
  let list = await fetchFromSupabase('tupoksi_list', defaultTupoksiList);
  
  const adminEl = document.getElementById('admin-tupoksi-list');
  if (adminEl) {
    adminEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada tugas pokok.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; padding: 12px 15px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div><strong>${idx + 1}. ${item.judul}</strong>: <span style="color: var(--text-muted);">${item.deskripsi}</span></div>
        <button type="button" onclick="hapusTupoksiItem(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Hapus</button>
      </div>
    `).join('');
  }

  const publicEl = document.getElementById('display-tupoksi-list');
  if (publicEl) {
    publicEl.innerHTML = list.length === 0 ? '<p style="color: var(--text-muted);">Belum ada informasi tupoksi.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); display: flex; gap: 15px; align-items: flex-start;">
        <div style="background: var(--primary-color); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">${idx + 1}</div>
        <div>
          <h4 style="color: var(--primary-color); margin-bottom: 6px; font-size: 1.05rem;">${item.judul}</h4>
          <p style="color: var(--text-dark); line-height: 1.6; font-size: 0.95rem;">${item.deskripsi}</p>
        </div>
      </div>
    `).join('');
  }
}

async function tambahTupoksiItem() {
  const judulEl = document.getElementById('input-tupoksi-judul');
  const deskripsiEl = document.getElementById('input-tupoksi-deskripsi');

  if (!judulEl || !deskripsiEl) return;
  const judul = judulEl.value.trim();
  const deskripsi = deskripsiEl.value.trim();

  if (!judul || !deskripsi) {
    alert('Judul dan Rincian Tugas Pokok wajib diisi!');
    return;
  }

  let list = await fetchFromSupabase('tupoksi_list', defaultTupoksiList);
  list.push({ judul, deskripsi });
  
  localStorage.setItem('smpn2_content_tupoksi_list', JSON.stringify(list));
  await saveToSupabase('tupoksi_list', list);

  judulEl.value = '';
  deskripsiEl.value = '';
  renderTupoksiList();
  alert('Tugas Pokok berhasil ditambahkan!');
}

async function hapusTupoksiItem(index) {
  let list = await fetchFromSupabase('tupoksi_list', defaultTupoksiList);
  list.splice(index, 1);
  
  localStorage.setItem('smpn2_content_tupoksi_list', JSON.stringify(list));
  await saveToSupabase('tupoksi_list', list);
  renderTupoksiList();
}


// --- 7. KELOLA KONTEN HALAMAN LAINNYA ---
async function renderPageContent() {
  let sejarahData = await fetchFromSupabase('sejarah_data', { text: "Sejarah sekolah..." });
  if (sejarahData) {
    const el = document.getElementById('display-sejarah');
    if (el) el.innerHTML = `<p>${sejarahData.text}</p>`;
    const input1 = document.getElementById('input-content-sejarah');
    if (input1) input1.value = sejarahData.text;
  }

  let strukturImg = await fetchFromSupabase('struktur_img', 'https://via.placeholder.com/600x400');
  if (strukturImg) {
    const imgEl = document.getElementById('display-struktur-img');
    if (imgEl) imgEl.src = strukturImg;
    const inputStruktur = document.getElementById('input-struktur-img');
    if (inputStruktur) inputStruktur.value = strukturImg;
  }

  let kontakData = await fetchFromSupabase('kontak_data', { alamat: '', telp: '', email: '', maps: '' });
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

async function savePageContent(event, pageKey) {
  event.preventDefault();
  let contentdata = {};
  if (pageKey === 'sejarah') {
    contentdata.text = document.getElementById('input-content-sejarah').value;
  }
  localStorage.setItem('smpn2_content_' + pageKey, JSON.stringify(contentdata));
  await saveToSupabase(pageKey + '_data', contentdata);
  
  alert(`Data ${pageKey} berhasil diperbarui!`);
  renderPageContent();
}

async function saveStrukturGambar(event) {
  event.preventDefault();
  const imgUrl = document.getElementById('input-struktur-img').value.trim();
  localStorage.setItem('smpn2_content_struktur_img', imgUrl);
  await saveToSupabase('struktur_img', imgUrl);
  
  renderPageContent();
  alert('Gambar Struktur Organisasi berhasil diperbarui!');
}

async function saveKontakData(event) {
  event.preventDefault();
  const kontakData = {
    alamat: document.getElementById('input-kontak-alamat').value.trim(),
    telp: document.getElementById('input-kontak-telp').value.trim(),
    email: document.getElementById('input-kontak-email').value.trim(),
    maps: document.getElementById('input-kontak-maps').value.trim()
  };
  localStorage.setItem('smpn2_content_kontak', JSON.stringify(kontakData));
  await saveToSupabase('kontak_data', kontakData);
  
  renderPageContent();
  alert('Informasi Kontak berhasil diperbarui!');
}


// --- 8. KELOLA BERANDA ---
const defaultBerandaData = {
  sambutan: "Puji dan syukur marilah kita panjatkan ke hadirat Allah SWT, Tuhan Yang Maha Esa...",
  banner: "images/WhatsApp Video 2026-10-13 at 12.31.10.mp4",
  kepsek: "https://i.postimg.cc/sxPCtknH/Gemini-Generated-Image-tnppjqtnppjqtnpp.jpg"
};

async function renderBerandaData() {
  let data = await fetchFromSupabase('beranda_data', defaultBerandaData);

  if (document.getElementById('display-beranda-sambutan')) document.getElementById('display-beranda-sambutan').innerText = data.sambutan;
  
  const videoBg = document.getElementById('display-beranda-video-bg');
  const videoSrc = document.getElementById('display-beranda-video-src');
  if (videoBg && videoSrc) {
    if (videoSrc.getAttribute('src') !== data.banner) {
      videoSrc.setAttribute('src', data.banner);
      videoBg.load();
      videoBg.play().catch(() => {});
    }
  }

  if (document.getElementById('display-beranda-kepsek')) document.getElementById('display-beranda-kepsek').src = data.kepsek;

  if (document.getElementById('input-beranda-sambutan')) document.getElementById('input-beranda-sambutan').value = data.sambutan;
  if (document.getElementById('input-beranda-banner')) document.getElementById('input-beranda-banner').value = data.banner;
  if (document.getElementById('input-beranda-kepsek')) document.getElementById('input-beranda-kepsek').value = data.kepsek;
}

async function saveBerandaData(event) {
  event.preventDefault();
  const berandaData = {
    sambutan: document.getElementById('input-beranda-sambutan').value,
    banner: document.getElementById('input-beranda-banner').value,
    kepsek: document.getElementById('input-beranda-kepsek').value
  };

  localStorage.setItem('smpn2_content_beranda', JSON.stringify(berandaData));
  await saveToSupabase('beranda_data', berandaData);
  
  renderBerandaData();
  alert('Data Beranda berhasil diperbarui!');
}


// --- 9. KELOLA KEGIATAN ---
const defaultKegiatanList = [
  {
    judul: "Ucapan HUTDA ke 27 KaB. Buol",
    tanggal: "2026-10-12",
    foto: "https://i.postimg.cc/KjT84p0M/Whats-App-Image-2026-10-10-at-13-30-26.jpg",
    deskripsi: "Dalam rangka memperingati Hari Ulang Tahun Daerah (HUTDA) ke-27 Kabupaten Buol..."
  }
];

async function renderKegiatanList() {
  let list = await fetchFromSupabase('kegiatan_list', defaultKegiatanList);
  
  const adminListEl = document.getElementById('admin-kegiatan-list');
  if (adminListEl) {
    adminListEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada kegiatan.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 12px;">
          ${item.foto ? `<img src="${item.foto}" style="width: 50px; height: 40px; border-radius: 4px; object-fit: contain; background: #000;">` : ''}
          <div><strong>${item.judul}</strong> (${item.tanggal || 'Tanpa Tanggal'})</div>
        </div>
        <button type="button" onclick="hapusKegiatan(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Hapus</button>
      </div>
    `).join('');
  }

  const publicListEl = document.getElementById('display-beranda-kegiatan-list');
  if (publicListEl) {
    publicListEl.innerHTML = list.length === 0 ? '<p style="color: var(--text-muted);">Belum ada informasi kegiatan terbaru.</p>' : list.map(item => `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        ${item.foto ? `<div style="width: 100%; max-height: 380px; background: #0f172a; display: flex; align-items: center; justify-content: center; overflow: hidden;"><img src="${item.foto}" alt="${item.judul}" style="width: 100%; height: auto; max-height: 380px; object-fit: contain;"></div>` : ''}
        <div style="padding: 20px;">
          <span style="font-size: 0.75rem; background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 4px; font-weight: 600;">${item.tanggal || 'Agenda Sekolah'}</span>
          <h4 style="color: var(--primary-color); margin: 10px 0 6px 0;">${item.judul}</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem;">${item.deskripsi}</p>
        </div>
      </div>
    `).join('');
  }
}

async function tambahKegiatan() {
  const judulEl = document.getElementById('input-kegiatan-judul');
  const tanggalEl = document.getElementById('input-kegiatan-tanggal');
  const fotoEl = document.getElementById('input-kegiatan-foto');
  const deskripsiEl = document.getElementById('input-kegiatan-deskripsi');

  if (!judulEl || !deskripsiEl) return;
  const judul = judulEl.value.trim();
  const tanggal = tanggalEl.value.trim();
  const foto = fotoEl ? fotoEl.value.trim() : '';
  const deskripsi = deskripsiEl.value.trim();

  if (!judul || !deskripsi) {
    alert('Judul dan Deskripsi wajib diisi!');
    return;
  }

  let list = await fetchFromSupabase('kegiatan_list', defaultKegiatanList);
  list.push({ judul, tanggal, foto, deskripsi });
  
  localStorage.setItem('smpn2_content_kegiatan_list', JSON.stringify(list));
  await saveToSupabase('kegiatan_list', list);

  judulEl.value = '';
  tanggalEl.value = '';
  if (fotoEl) fotoEl.value = '';
  deskripsiEl.value = '';
  renderKegiatanList();
  alert('Kegiatan berhasil ditambahkan!');
}

async function hapusKegiatan(index) {
  let list = await fetchFromSupabase('kegiatan_list', defaultKegiatanList);
  list.splice(index, 1);
  
  localStorage.setItem('smpn2_content_kegiatan_list', JSON.stringify(list));
  await saveToSupabase('kegiatan_list', list);
  renderKegiatanList();
}


// --- 10. KELOLA VIDEO ---
async function renderVideoList() {
  let list = await fetchFromSupabase('video_list', []);
  const adminEl = document.getElementById('admin-video-list');
  if (adminEl) {
    adminEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada video.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div><strong>${item.judul}</strong></div>
        <button type="button" onclick="hapusVideo(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Hapus</button>
      </div>
    `).join('');
  }

  const publicEl = document.getElementById('display-beranda-video-list');
  if (publicEl) {
    publicEl.innerHTML = list.length === 0 ? '<p style="color: var(--text-muted);">Belum ada video yang ditambahkan.</p>' : list.map(item => {
      const embedUrl = parseYoutubeEmbedUrl(item.url);
      const isYoutube = embedUrl.includes('youtube.com') || embedUrl.includes('youtu.be');
      let playerHtml = isYoutube ? 
        `<iframe src="${embedUrl}" title="${item.judul}" width="100%" height="100%" style="border:0;" allowfullscreen></iframe>` : 
        `<video src="${embedUrl}" controls preload="metadata" style="width:100%; height:100%; object-fit:contain; background:#000;"></video>`;

      return `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
          <div style="width: 100%; height: 315px; background: #000; display: flex; align-items: center; justify-content: center;">${playerHtml}</div>
          <div style="padding: 20px;">
            <h4 style="color: var(--primary-color); margin-bottom: 6px; font-size: 1.05rem;">${item.judul}</h4>
            <p style="color: var(--text-muted); font-size: 0.9rem;">${item.ket}</p>
          </div>
        </div>
      `;
    }).join('');
  }
}

async function tambahVideo() {
  const judulEl = document.getElementById('input-video-judul');
  const urlEl = document.getElementById('input-video-url');
  const ketEl = document.getElementById('input-video-ket');

  if (!judulEl || !urlEl || !ketEl) return;
  const judul = judulEl.value.trim();
  const rawUrl = urlEl.value.trim();
  const ket = ketEl.value.trim();

  if (!judul || !rawUrl) {
    alert('Judul dan URL Video wajib diisi!');
    return;
  }

  const url = parseYoutubeEmbedUrl(rawUrl);
  let list = await fetchFromSupabase('video_list', []);
  list.push({ judul, url, ket });
  
  localStorage.setItem('smpn2_content_video_list', JSON.stringify(list));
  await saveToSupabase('video_list', list);

  judulEl.value = '';
  urlEl.value = '';
  ketEl.value = '';
  renderVideoList();
  alert('Video berhasil ditambahkan!');
}

async function hapusVideo(index) {
  let list = await fetchFromSupabase('video_list', []);
  list.splice(index, 1);
  
  localStorage.setItem('smpn2_content_video_list', JSON.stringify(list));
  await saveToSupabase('video_list', list);
  renderVideoList();
}


// --- 11. KELOLA SARANA ---
async function renderSaranaList() {
  let list = await fetchFromSupabase('sarana_list', []);
  const adminEl = document.getElementById('admin-sarana-list');
  if (adminEl) {
    adminEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada sarana.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; padding: 10px 15px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div><strong>${item.nama}</strong></div>
        <button type="button" onclick="hapusSarana(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Hapus</button>
      </div>
    `).join('');
  }

  const publicEl = document.getElementById('display-sarana-list');
  if (publicEl) {
    publicEl.innerHTML = list.length === 0 ? '<p style="color: var(--text-muted);">Belum ada data sarana.</p>' : list.map(item => `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="width: 100%; height: 200px; background: #0f172a; overflow: hidden; display: flex; align-items: center; justify-content: center;"><img src="${item.foto}" alt="${item.nama}" style="width: 100%; height: 100%; object-fit: contain;"></div>
        <div style="padding: 20px;">
          <h4 style="color: var(--primary-color); margin-bottom: 8px;">${item.nama}</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem;">${item.ket}</p>
        </div>
      </div>
    `).join('');
  }
}

async function tambahSarana() {
  const namaEl = document.getElementById('input-sarana-nama');
  const fotoEl = document.getElementById('input-sarana-foto');
  const ketEl = document.getElementById('input-sarana-ket');

  if (!namaEl || !ketEl) return;
  const nama = namaEl.value.trim();
  const foto = fotoEl.value.trim() || 'https://via.placeholder.com/300x200';
  const ket = ketEl.value.trim();

  if (!nama || !ket) {
    alert('Nama dan Keterangan wajib diisi!');
    return;
  }

  let list = await fetchFromSupabase('sarana_list', []);
  list.push({ nama, foto, ket });
  
  localStorage.setItem('smpn2_content_sarana_list', JSON.stringify(list));
  await saveToSupabase('sarana_list', list);

  namaEl.value = '';
  fotoEl.value = '';
  ketEl.value = '';
  renderSaranaList();
  alert('Sarana berhasil ditambahkan!');
}

async function hapusSarana(index) {
  let list = await fetchFromSupabase('sarana_list', []);
  list.splice(index, 1);
  
  localStorage.setItem('smpn2_content_sarana_list', JSON.stringify(list));
  await saveToSupabase('sarana_list', list);
  renderSaranaList();
}


// --- 12. KELOLA GURU ---
async function renderGuruList() {
  let list = await fetchFromSupabase('guru_list', []);
  const adminEl = document.getElementById('admin-guru-list');
  if (adminEl) {
    adminEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada guru.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; padding: 10px 15px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div><strong>${item.nama}</strong> (${item.mapel})</div>
        <button type="button" onclick="hapusGuru(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Hapus</button>
      </div>
    `).join('');
  }

  const publicEl = document.getElementById('display-guru-list');
  if (publicEl) {
    publicEl.innerHTML = list.length === 0 ? '<p style="color: var(--text-muted);">Belum ada daftar dewan guru.</p>' : list.map(item => `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <img src="${item.foto}" alt="${item.nama}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 12px;">
        <h4 style="color: var(--primary-color); margin-bottom: 5px;">${item.nama}</h4>
        <p style="color: var(--text-muted); font-size: 0.85rem;">${item.mapel}</p>
      </div>
    `).join('');
  }
}

async function tambahGuru() {
  const namaEl = document.getElementById('input-guru-nama');
  const mapelEl = document.getElementById('input-guru-mapel');
  const fotoEl = document.getElementById('input-guru-foto');

  if (!namaEl || !mapelEl) return;
  const nama = namaEl.value.trim();
  const mapel = mapelEl.value.trim();
  const foto = fotoEl.value.trim() || 'https://via.placeholder.com/150';

  if (!nama || !mapel) {
    alert('Nama dan Mapel wajib diisi!');
    return;
  }

  let list = await fetchFromSupabase('guru_list', []);
  list.push({ nama, mapel, foto });
  
  localStorage.setItem('smpn2_content_guru_list', JSON.stringify(list));
  await saveToSupabase('guru_list', list);

  namaEl.value = '';
  mapelEl.value = '';
  fotoEl.value = '';
  renderGuruList();
  alert('Guru berhasil ditambahkan!');
}

async function hapusGuru(index) {
  let list = await fetchFromSupabase('guru_list', []);
  list.splice(index, 1);
  
  localStorage.setItem('smpn2_content_guru_list', JSON.stringify(list));
  await saveToSupabase('guru_list', list);
  renderGuruList();
}


// --- 13. KELOLA PRAMUKA ---
async function renderPramukaList() {
  let list = await fetchFromSupabase('pramuka_list', []);
  const adminEl = document.getElementById('admin-pramuka-list');
  if (adminEl) {
    adminEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; padding: 10px 15px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div><strong>${item.judul}</strong></div>
        <button type="button" onclick="hapusPramuka(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Hapus</button>
      </div>
    `).join('');
  }

  const publicEl = document.getElementById('display-pramuka-list');
  if (publicEl) {
    publicEl.innerHTML = list.length === 0 ? '<p style="color: var(--text-muted);">Belum ada dokumentasi pramuka.</p>' : list.map(item => `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="width: 100%; height: 200px; background: #0f172a; overflow: hidden; display: flex; align-items: center; justify-content: center;"><img src="${item.foto}" alt="${item.judul}" style="width: 100%; height: 100%; object-fit: contain;"></div>
        <div style="padding: 20px;">
          <h4 style="color: var(--primary-color); margin-bottom: 8px;">${item.judul}</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem;">${item.ket}</p>
        </div>
      </div>
    `).join('');
  }
}

async function tambahPramuka() {
  const judulEl = document.getElementById('input-pramuka-judul');
  const fotoEl = document.getElementById('input-pramuka-foto');
  const ketEl = document.getElementById('input-pramuka-ket');

  if (!judulEl || !ketEl) return;
  const judul = judulEl.value.trim();
  const foto = fotoEl.value.trim() || 'https://via.placeholder.com/300x200';
  const ket = ketEl.value.trim();

  if (!judul || !ket) {
    alert('Judul dan Keterangan wajib diisi!');
    return;
  }

  let list = await fetchFromSupabase('pramuka_list', []);
  list.push({ judul, foto, ket });
  
  localStorage.setItem('smpn2_content_pramuka_list', JSON.stringify(list));
  await saveToSupabase('pramuka_list', list);

  judulEl.value = '';
  fotoEl.value = '';
  ketEl.value = '';
  renderPramukaList();
  alert('Pramuka berhasil ditambahkan!');
}

async function hapusPramuka(index) {
  let list = await fetchFromSupabase('pramuka_list', []);
  list.splice(index, 1);
  
  localStorage.setItem('smpn2_content_pramuka_list', JSON.stringify(list));
  await saveToSupabase('pramuka_list', list);
  renderPramukaList();
}


// --- 14. KELOLA SILAT ---
async function renderSilatList() {
  let list = await fetchFromSupabase('silat_list', []);
  const adminEl = document.getElementById('admin-silat-list');
  if (adminEl) {
    adminEl.innerHTML = list.length === 0 ? '<p style="font-size: 0.85rem; color: var(--text-muted);">Belum ada.</p>' : list.map((item, idx) => `
      <div style="background: #f8fafc; padding: 10px 15px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
        <div><strong>${item.judul}</strong></div>
        <button type="button" onclick="hapusSilat(${idx})" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Hapus</button>
      </div>
    `).join('');
  }

  const publicEl = document.getElementById('display-pencaksilat-list');
  if (publicEl) {
    publicEl.innerHTML = list.length === 0 ? '<p style="color: var(--text-muted);">Belum ada dokumentasi pencak silat.</p>' : list.map(item => `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="width: 100%; height: 200px; background: #0f172a; overflow: hidden; display: flex; align-items: center; justify-content: center;"><img src="${item.foto}" alt="${item.judul}" style="width: 100%; height: 100%; object-fit: contain;"></div>
        <div style="padding: 20px;">
          <h4 style="color: var(--primary-color); margin-bottom: 8px;">${item.judul}</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem;">${item.ket}</p>
        </div>
      </div>
    `).join('');
  }
}

async function tambahSilat() {
  const judulEl = document.getElementById('input-silat-judul');
  const fotoEl = document.getElementById('input-silat-foto');
  const ketEl = document.getElementById('input-silat-ket');

  if (!judulEl || !ketEl) return;
  const judul = judulEl.value.trim();
  const foto = fotoEl.value.trim() || 'https://via.placeholder.com/300x200';
  const ket = ketEl.value.trim();

  if (!judul || !ket) {
    alert('Judul dan Keterangan wajib diisi!');
    return;
  }

  let list = await fetchFromSupabase('silat_list', []);
  list.push({ judul, foto, ket });
  
  localStorage.setItem('smpn2_content_silat_list', JSON.stringify(list));
  await saveToSupabase('silat_list', list);

  judulEl.value = '';
  fotoEl.value = '';
  ketEl.value = '';
  renderSilatList();
  alert('Pencak Silat berhasil ditambahkan!');
}

async function hapusSilat(index) {
  let list = await fetchFromSupabase('silat_list', []);
  list.splice(index, 1);
  
  localStorage.setItem('smpn2_content_silat_list', JSON.stringify(list));
  await saveToSupabase('silat_list', list);
  renderSilatList();
}


// --- 15. INITIAL LOAD ---
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
  renderTupoksiList();
  renderVisiMisi();
  renderTautanList();
});

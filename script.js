// ==========================================
// 1. NAVIGASI MENU MOBILE (HAMBURGER MENU)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Inisialisasi awal tabel jadwal pelajaran
  filterJadwal();
});

// ==========================================
// 2. SWITCH TAB PROFIL (GURU, MAPEL, JADWAL)
// ==========================================
function switchProfilTab(evt, tabId) {
  const contents = document.getElementsByClassName("profil-tab-content");
  for (let i = 0; i < contents.length; i++) {
    contents[i].classList.remove("active");
  }

  const buttons = document.getElementsByClassName("profil-tab-btn");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }

  const selectedTab = document.getElementById(tabId);
  if (selectedTab) {
    selectedTab.classList.add("active");
  }

  if (evt && evt.currentTarget) {
    evt.currentTarget.classList.add("active");
  }
}

// ==========================================
// 3. DATA & FILTER JADWAL PELAJARAN
// ==========================================
const dataJadwal = {
  "7a": [
    { hari: "Senin", waktu: "07:30 - 09:00", mapel: "Upacara & PAI", guru: "Drs. Ahmad Dahlan", ruang: "R. VII-A" },
    { hari: "Senin", waktu: "09:15 - 11:30", mapel: "Matematika", guru: "Budi Santoso, S.Si.", ruang: "R. VII-A" },
    { hari: "Selasa", waktu: "07:30 - 09:30", mapel: "IPA Terpadu", guru: "Siti Rahma, S.Pd.", ruang: "Lab IPA" },
    { hari: "Rabu", waktu: "07:30 - 09:30", mapel: "Bahasa Inggris", guru: "Rina Marlina, S.Pd.", ruang: "R. VII-A" },
    { hari: "Kamis", waktu: "07:30 - 09:30", mapel: "Informatika", guru: "Tim IT", ruang: "Lab Komputer" }
  ],
  "8a": [
    { hari: "Senin", waktu: "07:30 - 09:00", mapel: "Upacara & B. Indo", guru: "Rina Marlina, S.Pd.", ruang: "R. VIII-A" },
    { hari: "Selasa", waktu: "07:30 - 09:30", mapel: "Matematika", guru: "Budi Santoso, S.Si.", ruang: "R. VIII-A" },
    { hari: "Rabu", waktu: "07:30 - 09:30", mapel: "IPA Terpadu", guru: "Siti Rahma, S.Pd.", ruang: "Lab IPA" }
  ],
  "9a": [
    { hari: "Senin", waktu: "07:30 - 09:00", mapel: "Upacara & IPS", guru: "Siti Rahma, S.Pd.", ruang: "R. IX-A" },
    { hari: "Selasa", waktu: "07:30 - 09:30", mapel: "Bahasa Inggris", guru: "Rina Marlina, S.Pd.", ruang: "R. IX-A" },
    { hari: "Kamis", waktu: "07:30 - 09:30", mapel: "Matematika", guru: "Budi Santoso, S.Si.", ruang: "R. IX-A" }
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

// ==========================================
// 4. INTEGRASI FORM PPDB KE GOOGLE APPS SCRIPT
// ==========================================
async function handlePPDB(event) {
  event.preventDefault();

  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim Data...';
  }

  // Mengambil input dari elemen HTML
  const namaInput = document.getElementById('nama');
  const nisnInput = document.getElementById('nisn');
  const asalInput = document.getElementById('asal');
  const hpInput = document.getElementById('hp');
  const alamatInput = document.getElementById('alamat');

  const payload = {
    nama: namaInput ? namaInput.value : '',
    nisn: nisnInput ? nisnInput.value : '',
    asalSekolah: asalInput ? asalInput.value : '',
    noHp: hpInput ? hpInput.value : '',
    alamat: alamatInput ? alamatInput.value : ''
  };

  // Endpoint Web App Google Apps Script SMPN 2 Karamat
  const endpoint = 'https://script.google.com/macros/s/AKfycbxg8l7jf8Y9iHxyH1TOUQSL7Znwx3-b8rMa42dWbdrnh3nEB7y54rYFwqP9lN8mxj1H/exec';

  try {
    // Pengiriman data menggunakan method POST
    await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    // Notifikasi sukses
    alert(`Terima kasih, ${payload.nama}!\n\nPendaftaran PPDB Online dengan NISN (${payload.nisn}) telah berhasil dikirim.\nData Anda sudah tersimpan di sistem PPDB SMPN 2 Karamat.`);
    
    // Reset isi form
    const formElement = document.getElementById('ppdbForm');
    if (formElement) {
      formElement.reset();
    }
  } catch (error) {
    alert('Terjadi kesalahan saat mengunggah data pendaftaran. Silakan periksa koneksi internet Anda dan coba lagi.');
    console.error('PPDB Submission Error:', error);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  }
}

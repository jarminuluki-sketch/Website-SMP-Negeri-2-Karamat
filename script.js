// Toggle Menu Mobile Navigation
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Switch Tab Profil (Guru, Mapel, Jadwal)
function switchProfilTab(evt, tabId) {
  const contents = document.getElementsByClassName("profil-tab-content");
  for (let i = 0; i < contents.length; i++) {
    contents[i].classList.remove("active");
  }

  const buttons = document.getElementsByClassName("profil-tab-btn");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }

  document.getElementById(tabId).classList.add("active");
  evt.currentTarget.classList.add("active");
}

// Data Jadwal Pelajaran Dummy
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

// Render Jadwal Berdasarkan Pilihan Kelas
function filterJadwal() {
  const kelas = document.getElementById("kelasSelect").value;
  const tbody = document.getElementById("jadwalBody");
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

// Inisialisasi Jadwal Awal saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  filterJadwal();
});

// Simulasi Form PPDB Online
function handlePPDB(event) {
  event.preventDefault();
  const nama = document.getElementById('nama').value;
  const nisn = document.getElementById('nisn').value;
  
  alert(`Terima Kasih, ${nama}!\n\nPendaftaran awal PPDB dengan NISN ${nisn} berhasil dikirim.\nPanitia PPDB SMPN 2 Karamat akan segera menghubungi Anda.`);
  document.getElementById('ppdbForm').reset();
}

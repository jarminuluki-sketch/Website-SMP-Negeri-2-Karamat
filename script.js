// Toggle Menu Mobile Navigation
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Tab Visi & Misi Switcher
function openTab(evt, tabName) {
  const tabContents = document.getElementsByClassName("tab-content");
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].classList.remove("active");
  }

  const tabButtons = document.getElementsByClassName("tab-btn");
  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove("active");
  }

  document.getElementById(tabName).classList.add("active");
  evt.currentTarget.classList.add("active");
}

// Simulasi Form PPDB Online
function handlePPDB(event) {
  event.preventDefault();
  
  const nama = document.getElementById('nama').value;
  const nisn = document.getElementById('nisn').value;
  
  alert(`Terima Kasih, ${nama}!\n\nPendaftaran awal PPDB dengan NISN ${nisn} berhasil dikirim.\nPanitia PPDB SMPN 2 Karamat akan segera menghubungi Anda melalui WhatsApp.`);
  
  // Reset Form
  document.getElementById('ppdbForm').reset();
}

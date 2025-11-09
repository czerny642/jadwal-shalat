const city = "Sukabumi,West Java,Indonesia";  // Bisa diganti sesuai kota
const country = "Indonesia";

// Fungsi update waktu saat ini tiap detik
function updateCurrentTime() {
  const now = new Date();
  const options = { hour: '2-digit', minute:'2-digit', second:'2-digit', hour12: true };
  const timeString = now.toLocaleTimeString('en-US', options);
  document.getElementById('current-time').textContent = timeString;
}

// Fungsi menampilkan tanggal lengkap dalam bahasa Indonesia
function updateDate() {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('id-ID', options);
  document.getElementById('full-date').textContent = formattedDate;
}

// Fungsi untuk fetch jadwal sholat dari API Aladhan
async function fetchPrayerTimes(city, country) {
  try {
    const today = new Date();
    const timestamp = Math.floor(today.getTime() / 1000); // UNIX timestamp
    const url = `https://api.aladhan.com/v1/timingsByCity/${timestamp}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 200) {
      return data.data.timings;
    } else {
      console.error("Gagal mengambil data jadwal sholat:", data);
      return null;
    }
  } catch (error) {
    console.error("Error fetch jadwal sholat:", error);
    return null;
  }
}

// Fungsi untuk tampilkan jadwal sholat di UI
function displayPrayerTimes(timings) {
  const container = document.getElementById('prayer-times');

  // Bersihkan dulu jadwal lama kecuali current-time
  const currentTimeElem = document.getElementById('current-time');
  container.innerHTML = '';
  container.appendChild(currentTimeElem);

  // Buat elemen jadwal sholat
  const prayerOrder = ['Imsak', 'Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']; // Ikuti nama API

  prayerOrder.forEach(prayer => {
    const time = (prayer === 'Imsak') ? '02:30' :timings[prayer];
    const prayerDiv = document.createElement('div');
    prayerDiv.classList.add('prayer-item');

    prayerDiv.innerHTML = `
      <div>Shalat ${prayer === 'Imsak' ? 'Tahajud' : prayer === 'Fajr' ? 'Shubuh' : prayer === 'Dhuhr' ? 'Dzuhur' : prayer === 'Asr' ? 'Ashar' : prayer === 'Isha' ? 'Isya' : prayer}</div>
      <div class="prayer-time">
        <span>${time}</span>
        <svg class="clock-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 1a11 11 0 1 0 11 11A11 11 0 0 0 12 1zm0 20a9 9 0 1 1 9-9 9 9 0 0 1-9 9zm.5-13h-1v6l5.25 3.15.5-.84-4.75-2.81z"></path>
        </svg>
      </div>
    `;
    container.appendChild(prayerDiv);
  });
}

// Inisialisasi tampilan
async function init() {
  document.getElementById('city-name').textContent = city;

  updateCurrentTime();
  updateDate();
  setInterval(updateCurrentTime, 1000);

  const timings = await fetchPrayerTimes(city, country);
  if (timings) {
    displayPrayerTimes(timings);
  } else {
    document.getElementById('prayer-times').innerHTML = '<p>Gagal memuat jadwal sholat.</p>';
  }
}

init();

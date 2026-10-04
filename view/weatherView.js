// VIEW: hanya menampilkan data dan menangkap event. Tidak memanggil API.
class WeatherView {
  constructor() {
    this.form = document.getElementById('search-form');
    this.input = document.getElementById('city-input');
    this.currentEl = document.getElementById('current-weather');
    this.forecastEl = document.getElementById('forecast');

    this._initMap();
  }
//   initial map di indonesia aja
  _initMap() {
    // Tampilan awal: Indonesia
    this.map = L.map('map').setView([-2.5, 118], 4);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = null;
  }

  updateMap(lat, lon, label) {
    this.map.setView([lat, lon], 10);

    if (this.marker) this.map.removeLayer(this.marker);
    this.marker = L.marker([lat, lon]).addTo(this.map).bindPopup(label).openPopup();
  }
   
//menampilkan current weather
  renderCurrent(w) {
    this.currentEl.innerHTML = '';

    const icon = document.createElement('img');
    icon.src = `https://openweathermap.org/img/wn/${w.icon}@2x.png`;
    icon.alt = w.description;

    const main = document.createElement('div');
    const city = document.createElement('h3');
    city.textContent = `${w.city}, ${w.country}`;
    const temp = document.createElement('div');
    temp.className = 'cw-temp';
    temp.textContent = `${w.temp}°C`;
    const desc = document.createElement('div');
    desc.className = 'cw-desc';
    desc.textContent = w.description;
    main.append(city, temp, desc);

    const details = document.createElement('div');
    details.className = 'cw-details';
    details.innerHTML = ''; // diisi lewat textContent di bawah
    const rows = [
      `Terasa: ${w.feelsLike}°C`,
      `Kelembapan: ${w.humidity}%`,
      `Angin: ${w.wind} m/s`
    ];
    rows.forEach(text => {
      const p = document.createElement('p');
      p.textContent = text;
      details.append(p);
    });

    this.currentEl.append(icon, main, details);
  }
  renderForecast(items) {
    this.forecastEl.innerHTML = '';

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'fc-item';

      const time = document.createElement('div');
      time.className = 'fc-time';
      time.textContent = new Date(`${item.date}T12:00:00`).toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'short'
      });

      const icon = document.createElement('img');
      icon.src = `https://openweathermap.org/img/wn/${item.icon}.png`;
      icon.alt = item.description;

      const temp = document.createElement('div');
      temp.className = 'fc-temp';
      temp.textContent = `${item.temp}°C`;

      card.append(time, icon, temp);
      this.forecastEl.append(card);
    });
  }
  showLoading() {
    this.currentEl.innerHTML = '<p>Memuat...</p>';
    this.forecastEl.innerHTML = '';
  }

  showError(message) {
    this.currentEl.innerHTML = '';
    this.forecastEl.innerHTML = '';

    const p = document.createElement('p');
    p.className = 'error';
    p.textContent = message;
    this.currentEl.append(p);
  }
//   untuk search
  bindSearch(handler) {
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      const city = this.input.value.trim();
      if (!city) return;
      handler(city);
    });
  }
}

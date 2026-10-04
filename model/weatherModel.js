// MODEL: mengambil dan merapikan data cuaca. Tidak menyentuh DOM.
class WeatherModel {
  constructor() {
    this.apiKey = API_KEY; // dari config.js
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }
  // Fungsi umum: memanggil endpoint dan menangani error
  async _request(endpoint, city) {
    const url = `${this.baseUrl}/${endpoint}` +
      `?q=${encodeURIComponent(city)}` +
      `&appid=${this.apiKey}&units=metric&lang=id`;

    const response = await fetch(url);

    if (response.status === 404) throw new Error('Kota tidak ditemukan');
    if (response.status === 401) throw new Error('API key tidak valid / belum aktif');
    if (!response.ok) throw new Error('Gagal mengambil data cuaca');

    return response.json();
  }

//   get current weather berdasarkan kota
    async getCurrent(city) {
    const data = await this._request('weather', city);

    // Ambil yang kita butuhkan saja, ubah ke bentuk yang rapi
    return {
      city: data.name,
      country: data.sys.country,
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      wind: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      lat: data.coord.lat,
      lon: data.coord.lon
    };
  }
    async getForecast(city) {
    const data = await this._request('forecast', city);

    // Ambil data jam 12:00 tiap hari saja
    const harian = data.list.filter(item => item.dt_txt.includes('12:00:00'));

    return harian.map(item => ({
      date: item.dt_txt.split(' ')[0],
      temp: Math.round(item.main.temp),
      description: item.weather[0].description,
      icon: item.weather[0].icon
    }));
  }
}


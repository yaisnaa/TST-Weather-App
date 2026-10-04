// CONTROLLER: penghubung Model dan View. Tidak memanggil API dan tidak menyentuh DOM.
class WeatherController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // View -> Controller: saat user mencari kota, jalankan handleSearch
    this.view.bindSearch(city => this.handleSearch(city));

    // Tampilan awal: langsung tampilkan satu kota
    this.handleSearch('Jakarta');
  }
  async handleSearch(city) {
    this.view.showLoading();

    try {
      // Dua panggilan API dijalankan bersamaan
      const [current, forecast] = await Promise.all([
        this.model.getCurrent(city),
        this.model.getForecast(city)
      ]);

      this.view.renderCurrent(current);
      this.view.renderForecast(forecast);
      this.view.updateMap(current.lat, current.lon, `${current.city}, ${current.country}`);
    } catch (error) {
      this.view.showError(error.message);
    }
  }
}
// Titik masuk: rakit Model, View, Controller
new WeatherController(new WeatherModel(), new WeatherView());

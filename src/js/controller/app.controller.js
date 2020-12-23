export default class AppController {
  constructor(model, viewListTableSearch, mapView, chartView) {
    this.model = model;
    this.viewListTableSearch = viewListTableSearch;
    this.mapView = mapView;
    this.chartView = chartView;

    this.mapView.on('chooseCountry', (countryCode, countryIndex) => {
      this.updateSelectedCountry(countryCode, countryIndex);
    });

    this.viewListTableSearch
      .on('chooseCountry', (countryCode, countryIndex) => {
        this.updateSelectedCountry(countryCode, countryIndex);
      })
      .on('searchCountry', (countryLetter) => {
        this.searchCountry(countryLetter);
      });
    this.model
      .on('changeCountry', () => {
        this.viewListTableSearch.rebuildTableByCountry();
        this.chartView.rebuildCharCountry();
      })
      .on('searchCountryBy', () => this.viewListTableSearch.rebuildList())
      .on('rebuildView', () => {
        this.viewListTableSearch.show();
        this.mapView.show();
        this.chartView.rebuildCharCountry();
      });
  }

  updateSelectedCountry(countryCode, countryIndex) {
    this.model.chooseCountry(countryCode, countryIndex);
  }

  searchCountry(letter) {
    this.model.searchCountryByLetter(letter);
  }

  changeCasesCheckbox(checkbox) {
    this.model.changeCasesView(checkbox);
  }

  changeForPopulationCheckbox(checkbox) {
    this.model.changeForPopulationView(checkbox);
  }
}

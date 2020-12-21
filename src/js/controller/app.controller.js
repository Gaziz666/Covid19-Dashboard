export default class AppController {
  constructor(model, viewListTableSearch, mapView, checkboxView) {
    this.model = model;
    this.viewListTableSearch = viewListTableSearch;
    this.mapView = mapView;
    this.checkboxView = checkboxView;

    this.mapView
      .on('changeCases', (checkbox) => {
        this.changeCasesCheckbox(checkbox);
      })
      .on('changeForPopulations', (checkbox) => {
        this.changeForPopulationCheckbox(checkbox);
      });

    this.viewListTableSearch
      .on('chooseCountry', (countryCode) => {
        this.updateSelectedCountry(countryCode);
      })
      .on('searchCountry', (countryLetter) => {
        this.searchCountry(countryLetter);
      })
      .on('changeCases', (checkbox) => {
        this.changeCasesCheckbox(checkbox);
      })
      .on('changeForPopulations', (checkbox) => {
        this.changeForPopulationCheckbox(checkbox);
      });
    this.mapView.on('chooseCountry', (countryCode) => {
      this.updateSelectedCountry(countryCode);
    });
    this.model
      .on('changeCountry', () => this.view.rebuildTableByCountry())
      .on('searchCountryBy', () => this.view.rebuildList())
      .on('rebuildView', () => {
        this.viewListTableSearch.show();
        this.mapView.show();
      });

    return this;
  }

  updateSelectedCountry(countryCode) {
    this.model.chooseCountry(countryCode);
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

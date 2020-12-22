export default class AppController {
  constructor(model, viewListTableSearch, mapView, checkboxView, chartView) {
    this.model = model;
    this.viewListTableSearch = viewListTableSearch;
    this.mapView = mapView;
    this.checkboxView = checkboxView;
    this.chartView = chartView;

    // this.checkboxView
    //   .on('changeCases', (checkbox) => {
    //     console.log('controler', checkbox);
    //     this.changeCasesCheckbox(checkbox);
    //   })
    //   .on('changeForPopulations', (checkbox) => {
    //     this.changeForPopulationCheckbox(checkbox);
    //   });

    this.chartView
      .on('changeCases', (checkbox) => {
        this.changeCasesCheckbox(checkbox);
      })
      .on('changeForPopulations', (checkbox) => {
        this.changeForPopulationCheckbox(checkbox);
      });

    this.mapView
      .on('changeCases', (checkbox) => {
        this.changeCasesCheckbox(checkbox);
      })
      .on('changeForPopulations', (checkbox) => {
        this.changeForPopulationCheckbox(checkbox);
      })
      .on('chooseCountry', (countryCode, countryIndex) => {
        this.updateSelectedCountry(countryCode, countryIndex);
      });

    this.viewListTableSearch
      .on('chooseCountry', (countryCode, countryIndex) => {
        this.updateSelectedCountry(countryCode, countryIndex);
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

    return this;
  }

  updateSelectedCountry(countryCode, countryIndex) {
    this.model.chooseCountry(countryCode, countryIndex);
  }

  searchCountry(letter) {
    this.model.searchCountryByLetter(letter);
  }

  changeCasesCheckbox(checkbox) {
    console.log(checkbox);
    this.model.changeCasesView(checkbox);
  }

  changeForPopulationCheckbox(checkbox) {
    this.model.changeForPopulationView(checkbox);
  }
}

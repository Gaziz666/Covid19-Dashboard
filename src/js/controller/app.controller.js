export default class AppController {
  constructor(model, view, appView) {
    this.model = model;
    this.view = view;
    this.appView = appView;

    this.view
      .on('chooseCountry', (countryCode) => {
        this.updateSelectedCountry(countryCode);
        console.log('chooscountry1');
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
    this.appView.on('chooseCountry', (countryCode) => {
      this.updateSelectedCountry(countryCode);
      console.log('chooscountry2');
    });
    this.model
      .on('changeCountry', () => this.view.rebuildTableByCountry())
      .on('searchCountryBy', () => this.view.rebuildList())
      .on('rebuildView', () => this.view.show());
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

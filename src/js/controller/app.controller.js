export default class AppController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view
      .on('chooseCountry', (countryCode) =>
        this.updateSelectedCountry(countryCode)
      )
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

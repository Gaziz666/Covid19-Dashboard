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
      });
    this.model
      .on('changeCountry', (code) => this.view.rebuildTableByCountry(code))
      .on('searchCountryBy', (letter) => this.view.rebuildList(letter));
  }

  updateSelectedCountry(countryCode) {
    this.model.chooseCountry(countryCode);
  }

  searchCountry(letter) {
    this.model.searchCountryByLetter(letter);
  }
}

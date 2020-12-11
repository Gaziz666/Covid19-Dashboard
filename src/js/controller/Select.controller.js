export default class SelectController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    view.on("chooseCountry", (countryCode) =>
      this.updateSelectedCountry(countryCode)
    );
    view.on("searchCountry", (countryLetter) => {
      this.searchCountry(countryLetter);
    });
  }

  updateSelectedCountry(countryCode) {
    this.model.chooseCountry(countryCode);
  }

  searchCountry(letter) {
    this.model.searchCountryByLetter(letter);
  }
}

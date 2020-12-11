import EventEmitter from "../eventEmitter";

export default class SelectModel extends EventEmitter {
  constructor(items) {
    super();
    this.items = items || [];
    this.selectedCountryCode = "";
    this.searchInputValue = "";
  }

  async fetchItems(url) {
    const response = await fetch(url);
    const json = await response.json();
    this.items = json;
  }

  getCountries() {
    return this.items.Countries.sort(
      (a, b) => b.TotalConfirmed - a.TotalConfirmed
    );
  }

  getCountryByCode(code) {
    return this.items.Countries.filter((item) => item.CountryCode === code)[0];
  }

  getGlobal() {
    return this.items.Global;
  }

  chooseCountry(code) {
    this.selectedCountryCode = code;
    this.emit("changeCountry", code);
  }

  searchCountryByLetter(letter) {
    this.searchInputValue = letter;
    this.emit("searchCountryBy", letter);
  }

  /*
  get selectedCountryIndex() {
    return this.selectedCountryIndex;
  }

  set selectedCountryIndex(index) {
    const previousIndex = this.selectedCountryIndex;
    console.log("index", index);
    this.selectedCountryIndex = index;
    this.emit("selectedIndexChanged", previousIndex);
  } */
}

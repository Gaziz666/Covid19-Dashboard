import EventEmitter from "../eventEmitter";

export default class SelectModel extends EventEmitter {
  constructor(objData) {
    super();
    this.objData = objData || {};
    this.selectedCountryCode = "";
    this.searchInputValue = "";
  }

  async fetchData(url) {
    const response = await fetch(url);
    const json = await response.json();
    this.objData = json;
  }

  getCountries() {
    return this.objData.Countries.sort(
      (a, b) => b.TotalConfirmed - a.TotalConfirmed
    );
  }

  getCountryByCode(code) {
    return this.objData.Countries.filter(
      (item) => item.CountryCode === code
    )[0];
  }

  getGlobal() {
    return this.objData.Global;
  }

  chooseCountry(countryCode) {
    this.selectedCountryCode = countryCode;
    this.emit("changeCountry", countryCode);
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

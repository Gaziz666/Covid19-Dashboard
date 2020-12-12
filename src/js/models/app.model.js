import EventEmitter from "../eventEmitter";

export default class AppModel extends EventEmitter {
  constructor(objData) {
    super();
    this.objData = objData || {};
    this.countryDataArr = [];
    this.selectedCountryCode = "";
    this.searchInputValue = "";
  }

  async fetchData(urlCountry, urlSummary) {
    const response = await fetch(urlSummary);
    const json = await response.json();
    this.objData = json;

    const responseCountry = await fetch(urlCountry);
    const jsonCountry = await responseCountry.json();
    this.countryDataArr = jsonCountry;
  }

  // getCoordinates() {
  //   console.log(this.countryDataArr);
  // }

  getCountries() {
    return this.countryDataArr.sort((a, b) => b.cases - a.cases);
  }

  getCountryByCode(countryCode) {
    return this.countryDataArr.filter(
      (item) => item.countryInfo.iso3 === countryCode
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

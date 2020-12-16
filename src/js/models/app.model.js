import EventEmitter from '../eventEmitter';

export default class AppModel extends EventEmitter {
  constructor(objData) {
    super();
    this.objData = objData || {};
    this.countryDataArr = [];
    this.selectedCountryCode = '';
    this.searchInputValue = '';
    this.checkboxCasesIsChecked = false;
    this.checkboxForPopulationIsChecked = false;
  }

  async fetchData(urlCountry, urlSummary) {
    let [resCountry, resSummary] = ['', ''];
    try {
      [resCountry, resSummary] = await Promise.all([
        fetch(urlCountry),
        fetch(urlSummary),
      ]);
    } catch (err) {
      console.log('error', err);
    }
    const countryData = await resCountry.json();
    const summaryData = await resSummary.json();
    this.objData = summaryData;
    this.countryDataArr = countryData;
  }

  // getCoordinates() {
  //   console.log(this.countryDataArr);
  // }

  getCountries() {
    let cases = '';
    if (!this.checkboxForPopulationIsChecked) {
      cases = this.checkboxCasesIsChecked ? 'todayCases' : 'cases';
    } else {
      cases = this.checkboxCasesIsChecked
        ? 'oneCasePerPeople'
        : 'casesPerOneMillion';
    }
    return this.countryDataArr.sort(
      (a, b) => Number(b[cases]) - Number(a[cases])
    );
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
    this.emit('changeCountry');
  }

  searchCountryByLetter(letter) {
    this.searchInputValue = letter;
    this.emit('searchCountryBy');
  }

  changeCasesView(checkbox) {
    this.checkboxCasesIsChecked = checkbox.checked;
    this.emit('rebuildView');
  }

  changeForPopulationView(checkbox) {
    this.checkboxForPopulationIsChecked = checkbox.checked;
    this.emit('rebuildView');
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

import EventEmitter from '../eventEmitter';
import { CASES } from '../utils/constants';

export default class AppModel extends EventEmitter {
  constructor(objData) {
    super();
    this.objData = objData || {};
    this.countryDataArr = [];
    this.countryHistoryCases = {};
    this.allDate = {};
    this.selectedCountrySlug = '';
    this.selectedCountryIndex = '';
    this.selectedCountryPopulation = '';
    this.searchInputValue = '';
    this.checkboxPerDayCasesIsChecked = false;
    this.checkboxFor100ThouthandPopulationIsChecked = false;
    this.casesTypeIndex = 0;
  }

  async fetchData(urlCountry, urlSummary, urlAllDays, urlAllPopulation) {
    let [resCountry, resSummary, resAllDays, resAllPopulation] = [
      '',
      '',
      '',
      {},
    ];
    try {
      [
        resCountry,
        resSummary,
        resAllDays,
        resAllPopulation,
      ] = await Promise.all([
        fetch(urlCountry),
        fetch(urlSummary),
        fetch(urlAllDays),
        fetch(urlAllPopulation),
      ]);
    } catch (err) {
      alert('Sorry API down. Please wait api response and refresh page');
    }

    const countryData = await resCountry.json();
    const summaryData = await resSummary.json();
    const allDays = await resAllDays.json();
    const allPopulation = await resAllPopulation.json();
    this.selectedCountryPopulation = allPopulation.population;
    if (summaryData.Message) {
      alert(`${summaryData.Message} Please wait api response and refresh page`);
    }
    this.allDate = allDays;
    this.objData = summaryData;
    summaryData.Countries.forEach((country, index) => {
      let condition = true;
      let i = 0;
      while (condition && i < 220) {
        if (countryData[i].countryInfo.iso2 === country.CountryCode) {
          condition = false;
          summaryData.Countries[index].CountryInfo = countryData[i].countryInfo;
          summaryData.Countries[index].Population = countryData[i].population;
        }
        i += 1;
        if (country.CountryCode === 'XK') {
          // second data don't have data of Kosovo
          summaryData.Countries[index].CountryInfo = {
            _id: '',
            iso2: 'XK',
            iso3: '',
            lat: 44,
            long: 20,
            flag: 'https://disease.sh/assets/img/flags/rs.png',
          };
        }
      }
    });
    this.countryDataArr = summaryData.Countries;
  }

  async fetchCountryData(url) {
    let resCountryHistory = '';
    try {
      resCountryHistory = await fetch(url);
    } catch (err) {
      alert(
        'Sorry API for Char down. Please wait api response and refresh page'
      );
    }
    this.countryHistoryCases = await resCountryHistory.json();
  }

  getCountries() {
    const cases = this.checkboxPerDayCasesIsChecked
      ? CASES[this.casesTypeIndex].NEW
      : CASES[this.casesTypeIndex].TOTAL;

    if (!this.checkboxFor100ThouthandPopulationIsChecked) {
      return this.countryDataArr
        .sort((a, b) => Number(b[cases]) - Number(a[cases]))
        .filter((obj) =>
          obj.Country.toLowerCase().includes(this.searchInputValue)
        );
    }
    const populationFor100000 = 100000;
    return this.countryDataArr
      .sort(
        (a, b) =>
          Number((+b[cases] / +b.Population) * populationFor100000) -
          Number((+a[cases] / +a.Population) * populationFor100000)
      )
      .filter((obj) =>
        obj.Country.toLowerCase().includes(this.searchInputValue)
      );
  }

  getCountryByCode(countrySlug) {
    return this.countryDataArr.filter((item) => item.Slug === countrySlug)[0];
  }

  getGlobal() {
    return this.objData.Global;
  }

  chooseCountry(countrySlug, countryIndex) {
    this.selectedCountrySlug = countrySlug;
    this.selectedCountryIndex = countryIndex;
    this.selectedCountryPopulation = this.countryDataArr[
      countryIndex
    ].Population;
    this.emit('changeCountry');
  }

  searchCountryByLetter(letter) {
    this.searchInputValue = letter;
    this.emit('searchCountryBy');
  }

  changeCasesView(checkbox) {
    this.checkboxPerDayCasesIsChecked = checkbox.checked;
    this.emit('rebuildView');
  }

  changeForPopulationView(checkbox) {
    this.checkboxFor100ThouthandPopulationIsChecked = checkbox.checked;
    this.emit('rebuildView');
  }

  changeCasesTypeViewAdd() {
    this.casesTypeIndex = (this.casesTypeIndex + 1) % 3;
    this.emit('rebuildView');
  }

  changeCasesTypeViewInc() {
    this.casesTypeIndex =
      this.casesTypeIndex - 1 < 0 ? 2 : this.casesTypeIndex - 1;
    this.emit('rebuildView');
  }

  returnCasesWithCheckCheckboxes(caseType, countryObject) {
    let cases = '';
    const caseTypeObj = caseType || CASES[this.casesTypeIndex];
    let countryObj = this.objData.Global;
    let population = this.selectedCountryPopulation;
    if (countryObject) {
      population = countryObject.Population;
      countryObj = countryObject;
    }
    if (countryObject === undefined && this.selectedCountryIndex) {
      countryObj = this.countryDataArr[this.selectedCountryIndex];
    }
    if (!this.checkboxFor100ThouthandPopulationIsChecked) {
      cases = this.checkboxPerDayCasesIsChecked
        ? countryObj[caseTypeObj.NEW]
        : countryObj[caseTypeObj.TOTAL];
    } else {
      const populationFor100000 = 100000;
      const casesTodayPerHundred =
        Math.ceil(
          (countryObj[caseTypeObj.NEW] / population) * populationFor100000 * 100
        ) / 100;
      const casesTotalPerHundred =
        Math.ceil(
          (countryObj[caseTypeObj.TOTAL] / population) *
            populationFor100000 *
            100
        ) / 100;
      cases = this.checkboxPerDayCasesIsChecked
        ? casesTodayPerHundred
        : casesTotalPerHundred;
    }

    return cases.toLocaleString('en-En');
  }
}

import EventEmitter from '../eventEmitter';
import { CASES, CASES_TYPES } from '../utils/constants';
import ApiError from '../apiError';

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
    this.checkboxFor100kPopulationIsChecked = false;
    this.casesTypeIndex = 0;
    this.population = 0;
  }

  async fetchData(urlCountry, urlSummary, urlAllDays, urlAllPopulation) {
    let [resCountry, resSummary, resAllDays, resAllPopulation] = [
      '',
      '',
      '',
      {},
    ];
    try {
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
        console.error(err, 'We are using backup data');
        throw err;
      }
    } catch (err) {
      [
        resCountry,
        resSummary,
        resAllDays,
        resAllPopulation,
      ] = await Promise.all([
        fetch('./assets/countries.data.json'),
        fetch('./assets/summary.data.json'),
        fetch('./assets/allDays366.data.json'),
        fetch('./assets/all.data.json'),
      ]);
    }

    const countryData = await resCountry.json();
    const summaryData = await resSummary.json();
    const allDays = await resAllDays.json();
    const allPopulation = await resAllPopulation.json();
    this.selectedCountryPopulation = allPopulation.population;
    if (summaryData.Message) {
      throw new ApiError(
        summaryData.Message,
        `Please wait api response and refresh page`
      );
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

  getCasesPerHundred(casesType) {
    return (
      Math.ceil((casesType / this.population) * CASES_TYPES.MAX_CASES * 100) /
      100
    );
  }

  async fetchCountryData(url) {
    let resCountryHistory = '';
    try {
      resCountryHistory = await fetch(url);
    } catch (err) {
      throw new ApiError(
        err.statusCode,
        'Sorry, the server is busy. Please try again later'
      );
    }
    this.countryHistoryCases = await resCountryHistory.json();
  }

  getCountries() {
    const cases = this.checkboxPerDayCasesIsChecked
      ? CASES[this.casesTypeIndex].NEW
      : CASES[this.casesTypeIndex].TOTAL;

    if (!this.checkboxFor100kPopulationIsChecked) {
      return this.countryDataArr
        .sort((a, b) => Number(b[cases]) - Number(a[cases]))
        .filter((obj) =>
          obj.Country.toLowerCase().includes(
            this.searchInputValue.toLowerCase()
          )
        );
    }
    function casesPer100k(countryObj) {
      return (
        (+countryObj[cases] / +countryObj.Population) * CASES_TYPES.MAX_CASES
      );
    }
    return this.countryDataArr
      .sort((a, b) => casesPer100k(b) - casesPer100k(a))
      .filter((obj) =>
        obj.Country.toLowerCase().includes(this.searchInputValue.toLowerCase())
      );
  }

  getCountryByCode(countrySlug) {
    return this.countryDataArr.find((item) => item.Slug === countrySlug);
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
    this.checkboxFor100kPopulationIsChecked = checkbox.checked;
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

  getCasesState(caseType, countryObject) {
    let cases = '';
    const caseTypeObj = caseType || CASES[this.casesTypeIndex];
    let countryObj = this.objData.Global;
    this.population = this.selectedCountryPopulation;

    if (countryObject) {
      this.population = countryObject.Population;
      countryObj = countryObject;
    }

    if (countryObject === undefined && this.selectedCountryIndex) {
      countryObj = this.countryDataArr[this.selectedCountryIndex];
    }
    if (!this.checkboxFor100kPopulationIsChecked) {
      cases = this.checkboxPerDayCasesIsChecked
        ? countryObj[caseTypeObj.NEW]
        : countryObj[caseTypeObj.TOTAL];
    } else {
      const casesTodayPerHundred = this.getCasesPerHundred(
        countryObj[caseTypeObj.NEW]
      );
      const casesTotalPerHundred = this.getCasesPerHundred(
        countryObj[caseTypeObj.TOTAL]
      );
      cases = this.checkboxPerDayCasesIsChecked
        ? casesTodayPerHundred
        : casesTotalPerHundred;
    }

    return cases.toLocaleString('en-En');
  }
}

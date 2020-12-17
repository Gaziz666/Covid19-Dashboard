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

  // getCoordinates() {
  //   console.log(this.countryDataArr);
  // }

  getCountries() {
    const cases = this.checkboxCasesIsChecked
      ? 'NewConfirmed'
      : 'TotalConfirmed';

    if (!this.checkboxForPopulationIsChecked) {
      return this.countryDataArr.sort(
        (a, b) => Number(b[cases]) - Number(a[cases])
      );
    }
    const populationFor100000 = 100000;
    return this.countryDataArr.sort(
      (a, b) =>
        Number((+b[cases] / +b.Population) * populationFor100000) -
        Number((+a[cases] / +a.Population) * populationFor100000)
    );
  }

  getCountryByCode(countryCode) {
    return this.countryDataArr.filter(
      (item) => item.CountryInfo.iso2 === countryCode
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

  returnCasesWithCheckCheckboxes(countryObj, type) {
    let cases = '';
    const vewType = {
      confirmed: {
        Total: 'TotalConfirmed',
        New: 'NewConfirmed',
        Population: 'Population',
      },
      deaths: {
        Total: 'TotalDeaths',
        New: 'NewDeaths',
        Population: 'Population',
      },
      recovered: {
        Total: 'TotalRecovered',
        New: 'NewRecovered',
        Population: 'Population',
      },
    };
    if (!this.checkboxForPopulationIsChecked) {
      cases = this.checkboxCasesIsChecked
        ? countryObj[vewType[type].New]
        : countryObj[vewType[type].Total];
    } else {
      const populationFor100000 = 100000;
      const casesTodayPerHundred =
        Math.ceil(
          (countryObj[vewType[type].New] / countryObj.Population) *
            populationFor100000 *
            100
        ) / 100;
      const casesTotalPerOneMillion =
        Math.ceil(
          (countryObj[vewType[type].Total] / countryObj.Population) *
            populationFor100000 *
            100
        ) / 100;
      cases = this.checkboxCasesIsChecked
        ? casesTodayPerHundred
        : casesTotalPerOneMillion;
    }
    return cases.toLocaleString();
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

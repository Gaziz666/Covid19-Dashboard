import EventEmitter from '../eventEmitter';
import create from '../utils/create';

import '../../css/checkbox.css';
import '../../css/select.css';
import '../../css/table.css';

export default class AppView extends EventEmitter {
  constructor(model, elements) {
    super();
    this.model = model;
    this.elements = elements;

    // attach listeners to HTML controls
    this.elements.inputSearch.addEventListener('input', (e) =>
      this.emit('searchCountry', e.target.value)
    );
    this.renderCheckbox();
  }

  show() {
    this.rebuildList();
    this.rebuildTotalCases();
    this.rebuildTable();
  }

  rebuildList() {
    const { list } = this.elements;
    const searchValue = this.model.searchInputValue;
    this.elements.list.innerHTML = '';
    const fragment = new DocumentFragment();
    this.model
      .getCountries()
      .filter((obj) => obj.Country.toLowerCase().includes(searchValue))
      .forEach((obj, index) => {
        const cases = this.returnCasesWithCheckCheckboxes(obj, 'confirmed');
        const flagImg = create('img', {
          className: 'flag-img',
          child: null,
          parent: null,
          dataAttr: [['src', obj.CountryInfo.flag]],
        });
        const countryName = create('span', {
          className: 'select__country-name',
          child: obj.Country,
        });
        const casesCount = create('span', {
          className: 'select__cases-count',
          child: `${cases.toLocaleString()} `,
        });
        const newLi = create('li', {
          className: 'list__li',
          child: [flagImg, casesCount, countryName],
          parent: null,
          dataAttr: [
            ['key', index],
            ['code', obj.CountryInfo.iso2],
          ],
        });
        fragment.append(newLi);
        newLi.addEventListener('click', (e) => {
          this.emit('chooseCountry', e.target.closest('li').dataset.code);
        });
      });
    list.append(fragment);
  }

  rebuildTotalCases() {
    const { globalCases } = this.elements;
    globalCases.innerHTML = '';
    create('h3', {
      className: 'global__header',
      child: 'Global Cases',
      parent: globalCases,
    });
    create('h3', {
      className: 'global__cases',
      child: this.model.getGlobal().TotalConfirmed.toLocaleString(),
      parent: globalCases,
    });
  }

  rebuildTableByCountry() {
    const countryCode = this.model.selectedCountryCode;
    const currentCountryObj = this.model.getCountryByCode(countryCode);
    const tableName = currentCountryObj.Country;
    const confirmed = this.returnCasesWithCheckCheckboxes(
      currentCountryObj,
      'confirmed'
    );
    const deaths = this.returnCasesWithCheckCheckboxes(
      currentCountryObj,
      'deaths'
    );
    const recovered = this.returnCasesWithCheckCheckboxes(
      currentCountryObj,
      'recovered'
    );
    let i = this.elements.tableCases.childNodes.length - 1;
    while (i > -1) {
      this.elements.tableCases.childNodes[i].remove();
      i -= 1;
    }

    this.renderTable(tableName, confirmed, deaths, recovered);
  }

  rebuildTable() {
    if (this.model.selectedCountryCode) {
      this.rebuildTableByCountry();
      return;
    }
    const currentCountryObj = this.model.getGlobal();
    const tableName = 'Global Cases';
    const confirmed = this.model.checkboxCasesIsChecked
      ? currentCountryObj.NewConfirmed
      : currentCountryObj.TotalConfirmed;
    const deaths = this.model.checkboxCasesIsChecked
      ? currentCountryObj.NewDeaths
      : currentCountryObj.TotalDeaths;
    const recovered = this.model.checkboxCasesIsChecked
      ? currentCountryObj.NewRecovered
      : currentCountryObj.TotalRecovered;
    this.renderTable(tableName, confirmed, deaths, recovered);
  }

  renderTable(tableName, confirmed, deaths, recovered) {
    const tableContainer = this.elements.tableCases;
    tableContainer.innerHTML = '';
    create('h3', {
      className: 'table__country-name',
      child: tableName,
      parent: tableContainer,
    });

    const confirmedColumn = create('div', {
      className: 'table-column',
      child: [
        create('div', {
          className: 'table-header',
          child: 'Confirmed',
        }),
        create('div', {
          className: 'table-body',
          child: confirmed.toLocaleString(),
        }),
      ],
    });
    const deathColumn = create('div', {
      className: 'table-column',
      child: [
        create('div', {
          className: 'table-header',
          child: 'Deaths',
        }),
        create('div', {
          className: 'table-body',
          child: deaths.toLocaleString(),
        }),
      ],
    });
    const recoveredColumn = create('div', {
      className: 'table-column',
      child: [
        create('div', {
          className: 'table-header',
          child: 'Recovered',
        }),
        create('div', {
          className: 'table-body',
          child: recovered.toLocaleString(),
        }),
      ],
    });
    create('div', {
      className: 'table',
      child: [confirmedColumn, deathColumn, recoveredColumn],
      parent: tableContainer,
    });
  }

  renderCheckbox() {
    const checkBoxContainer = create('div', {
      className: 'checkbox-container',
    });
    const onCases = create('span', {
      className: 'on',
      child: 'Cases per day',
    });
    const offCases = create('span', {
      className: 'off',
      child: 'All cases',
    });
    const labelCases = create('label', {
      className: 'checkbox-label',
      child: [onCases, offCases],
      parent: null,
      dataAttr: [['for', 'checkbox1']],
    });
    const inputCases = create('input', {
      className: 'checkbox',
      child: null,
      parent: null,
      dataAttr: [
        ['id', 'checkbox1'],
        ['type', 'checkbox'],
      ],
    });
    checkBoxContainer.append(inputCases, labelCases);

    const onPerHundred = create('span', {
      className: 'on',
      child: 'Cases for 100 000 population',
    });
    const offPerHundred = create('span', {
      className: 'off',
      child: 'Cases for all population',
    });
    const labelPerHundred = create('label', {
      className: 'checkbox-label',
      child: [onPerHundred, offPerHundred],
      parent: null,
      dataAttr: [['for', 'checkbox2']],
    });
    const inputPerHundred = create('input', {
      className: 'checkbox',
      child: null,
      parent: null,
      dataAttr: [
        ['id', 'checkbox2'],
        ['type', 'checkbox'],
      ],
    });

    checkBoxContainer.append(inputPerHundred, labelPerHundred);
    this.elements.list.parentNode.append(checkBoxContainer);
    this.elements.checkboxCases = inputCases;
    this.elements.checkboxPerHundred = inputPerHundred;
    this.elements.checkboxCases.onchange = (e) =>
      this.emit('changeCases', e.target);
    this.elements.checkboxPerHundred.onchange = (e) =>
      this.emit('changeForPopulations', e.target);
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
    if (!this.model.checkboxForPopulationIsChecked) {
      cases = this.model.checkboxCasesIsChecked
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
      cases = this.model.checkboxCasesIsChecked
        ? casesTodayPerHundred
        : casesTotalPerOneMillion;
    }
    return cases.toLocaleString();
  }
}

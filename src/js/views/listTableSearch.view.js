import EventEmitter from '../eventEmitter';
import create from '../utils/create';
import CheckboxView from './checkbox.view';

import '../../css/checkbox.css';
import '../../css/select.css';
import '../../css/table.css';

export default class ListTableSearchView extends EventEmitter {
  constructor(model, elements) {
    super();
    this.model = model;
    this.elements = elements;

    // attach listeners to HTML controls
    this.elements.inputSearch.addEventListener('input', (e) =>
      this.emit('searchCountry', e.target.value)
    );
  }

  show() {
    this.rebuildList();
    this.rebuildTotalCases();
    this.rebuildTable();
  }

  rebuildList() {
    const { list } = this.elements;
    this.elements.list.innerHTML = '';
    if (this.elements.list.nextSibling !== null) {
      this.elements.list.nextSibling.remove();
    }

    const fragment = new DocumentFragment();
    this.model.getCountries().forEach((obj, index) => {
      const cases = this.model.returnCasesWithCheckCheckboxes(obj, 'confirmed');
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
        child: `${cases.toLocaleString('en-EN')} `,
      });
      const newLi = create('li', {
        className: 'list__li',
        child: [flagImg, casesCount, countryName],
        parent: null,
        dataAttr: [
          ['key', index],
          ['name', obj.Country],
        ],
      });
      fragment.append(newLi);
      newLi.addEventListener('click', (e) =>
        this.emit(
          'chooseCountry',
          e.target.closest('li').dataset.name,
          e.target.closest('li').getAttribute('key')
        )
      );
    });
    list.append(fragment);
    const checkbox = this.renderCheckbox('forList');
    list.parentNode.append(checkbox);
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
      child: this.model.getGlobal().TotalConfirmed.toLocaleString('en-EN'),
      parent: globalCases,
    });
  }

  rebuildTableByCountry() {
    const countryName = this.model.selectedCountryName;
    const currentCountryObj = this.model.getCountryByCode(countryName);
    const tableName = currentCountryObj.Country;
    const confirmed = this.model.returnCasesWithCheckCheckboxes(
      currentCountryObj,
      'confirmed'
    );
    const deaths = this.model.returnCasesWithCheckCheckboxes(
      currentCountryObj,
      'deaths'
    );
    const recovered = this.model.returnCasesWithCheckCheckboxes(
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
    if (this.model.selectedCountryName) {
      this.rebuildTableByCountry();
      return;
    }
    const currentCountryObj = this.model.getGlobal();
    const tableName = 'Global Cases';
    const confirmed = this.model.checkboxPerDayCasesIsChecked
      ? currentCountryObj.NewConfirmed
      : currentCountryObj.TotalConfirmed;
    const deaths = this.model.checkboxPerDayCasesIsChecked
      ? currentCountryObj.NewDeaths
      : currentCountryObj.TotalDeaths;
    const recovered = this.model.checkboxPerDayCasesIsChecked
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
      className: 'table-column table-column__confirmed',
      child: [
        create('div', {
          className: 'table-header',
          child: 'Confirmed',
        }),
        create('div', {
          className: 'table-body',
          child: confirmed.toLocaleString('en-EN'),
        }),
      ],
    });
    const deathColumn = create('div', {
      className: 'table-column table-column__deaths',
      child: [
        create('div', {
          className: 'table-header',
          child: 'Deaths',
        }),
        create('div', {
          className: 'table-body',
          child: deaths.toLocaleString('en-EN'),
        }),
      ],
    });
    const recoveredColumn = create('div', {
      className: 'table-column table-column__recovered',
      child: [
        create('div', {
          className: 'table-header',
          child: 'Recovered',
        }),
        create('div', {
          className: 'table-body',
          child: recovered.toLocaleString('en-EN'),
        }),
      ],
    });
    create('div', {
      className: 'table',
      child: [confirmedColumn, deathColumn, recoveredColumn],
      parent: tableContainer,
    });
    const checkbox = this.renderCheckbox('forTable');
    tableContainer.append(checkbox);
  }

  renderCheckbox(name) {
    const checkbox = new CheckboxView(this.model);
    const checkBoxContainer = checkbox.renderCheckbox(name);
    checkbox.inputCases.onchange = (e) => {
      this.emit('changeCases', e.target);
    };
    checkbox.inputPerHundred.onchange = (e) => {
      this.emit('changeForPopulations', e.target);
    };
    return checkBoxContainer;
  }
}

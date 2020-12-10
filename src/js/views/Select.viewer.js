import EventEmitter from "../eventEmitter";
import create from "../utils/create";

export default class SelectView extends EventEmitter {
  constructor(model, elements) {
    super();
    this._model = model; // items = [data]
    this._elements = elements; // select

    /*// attach model listeners
    model.on('itemAdded', () => this.rebuildList())
      .on('itemRemoved', () => this.rebuildList());

    // attach listeners to HTML controls
    elements.select.addEventListener('change',
      e => this.emit('listModified', e.target.selectedIndex));*/
  }

  show() {
    this.rebuildSelect();
    this.rebuildTotalCases();
    this.rebuildTable();
  }

  rebuildSelect() {
    const select = this._elements.select;
    select.options.length = 0;
    this._model.getCountries().forEach((item) => {
      const countryName = create("span", {
        className: "select__country-name",
        child: item.Country,
      });
      const casesCount = create("span", {
        className: "select__cases-count",
        child: item.TotalConfirmed.toLocaleString() + " ",
      });
      const newOption = create("option", {
        className: "select__option",
        child: [casesCount, countryName],
      });
      select.options.add(newOption);
    });
    this._model.selectedIndex = -1;
  }

  rebuildTotalCases() {
    const globalCases = this._elements.globalCases;
    create("h3", {
      className: "global__header",
      child: "Global Cases",
      parent: globalCases,
    });
    create("h3", {
      className: "global__cases",
      child: this._model.getGlobal().TotalConfirmed.toLocaleString(),
      parent: globalCases,
    });
  }

  rebuildTable() {
    const globalCasesName = "Global Cases";
    const currentGlobal = this._model.getGlobal();
    const globalKeys = Object.keys(currentGlobal);
    const tableContainer = this._elements.tableCases;
    const countryName = create("h3", {
      className: "table__country-name",
      child: globalCasesName,
      parent: tableContainer,
    });
    const tableHeader = create("tr", {
      className: "table_tr",
      child: [
        create("th", {
          className: "table_th",
          child: "Total confirmed",
        }),
        create("th", {
          className: "table_th",
          child: "Total deaths",
        }),
        create("th", {
          className: "table_th",
          child: "Total Recovered",
        }),
      ],
    });
    const tableBody = create("tr", {
      className: "table_td",
      child: [
        create("td", {
          className: "table_td",
          child: currentGlobal.TotalConfirmed.toLocaleString(),
        }),
        create("td", {
          className: "table_td",
          child: currentGlobal.TotalDeaths.toLocaleString(),
        }),
        create("td", {
          className: "table_td",
          child: currentGlobal.TotalRecovered.toLocaleString(),
        }),
      ],
    });
    create("table", {
      className: "table",
      child: [tableHeader, tableBody],
      parent: tableContainer,
    });
  }
}

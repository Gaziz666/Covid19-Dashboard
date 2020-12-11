import EventEmitter from "../eventEmitter";
import create from "../utils/create";

export default class SelectView extends EventEmitter {
  constructor(model, elements) {
    super();
    this.model = model; // items = [data]
    this.elements = elements; // select

    // attach model listeners
    model
      .on("itemAdded", () => this.rebuildList())
      .on("itemRemoved", () => this.rebuildList())
      .on("changeCountry", (indexC) => this.rebuildTable(indexC));

    // attach listeners to HTML controls
    this.elements.select.addEventListener("change", (e) =>
      this.emit("chooseCountry", e.target.value)
    );
  }

  show() {
    this.rebuildSelect();
    this.rebuildTotalCases();
    this.rebuildTable();
  }

  rebuildSelect() {
    const { select } = this.elements;
    select.options.length = 0;
    this.model.getCountries().forEach((item, index) => {
      const countryName = create("span", {
        className: "select__country-name",
        child: item.Country,
      });
      const casesCount = create("span", {
        className: "select__cases-count",
        child: `${item.TotalConfirmed.toLocaleString()} `,
      });
      const newOption = create("option", {
        className: "select__option",
        child: [casesCount, countryName],
        parent: select,
        dataAttr: [["value", index]],
      });
      select.options.add(newOption);
    });
    this.model.selectedIndex = -1;
  }

  rebuildTotalCases() {
    const { globalCases } = this.elements;
    create("h3", {
      className: "global__header",
      child: "Global Cases",
      parent: globalCases,
    });
    create("h3", {
      className: "global__cases",
      child: this.model.getGlobal().TotalConfirmed.toLocaleString(),
      parent: globalCases,
    });
  }

  rebuildTable(indexC) {
    let currentCountryObj = this.model.getGlobal();
    let tableName = "Global Cases";
    if (indexC) {
      let i = this.elements.tableCases.childNodes.length - 1;
      while (i > -1) {
        this.elements.tableCases.childNodes[i].remove();
        i -= 1;
      }
      currentCountryObj = this.model.getCountryByIndex(indexC);
      tableName = this.model.getCountryByIndex(indexC).Country;
    }
    // const globalKeys = Object.keys(currentGlobal);
    const tableContainer = this.elements.tableCases;
    create("h3", {
      className: "table__country-name",
      child: tableName,
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
          child: currentCountryObj.TotalConfirmed.toLocaleString(),
        }),
        create("td", {
          className: "table_td",
          child: currentCountryObj.TotalDeaths.toLocaleString(),
        }),
        create("td", {
          className: "table_td",
          child: currentCountryObj.TotalRecovered.toLocaleString(),
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

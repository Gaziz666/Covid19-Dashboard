import EventEmitter from "../eventEmitter";
import create from "../utils/create";

export default class SelectView extends EventEmitter {
  constructor(model, elements) {
    super();
    this.model = model;
    this.elements = elements;

    // attach model listeners
    model
      .on("changeCountry", (code) => this.rebuildTable(code))
      .on("searchCountryBy", (letter) => this.rebuildList(letter));

    // attach listeners to HTML controls
    this.elements.inputSearch.addEventListener("input", (e) =>
      this.emit("searchCountry", e.target.value)
    );
  }

  show() {
    this.rebuildList();
    this.rebuildTotalCases();
    this.rebuildTable();
  }

  rebuildList(letter) {
    const { list } = this.elements;
    const searchValue = letter || "";
    this.elements.list.innerHTML = "";
    const fragment = new DocumentFragment();
    this.model
      .getCountries()
      .filter((obj) => obj.Country.toLowerCase().includes(searchValue))
      .forEach((obj, index) => {
        const countryName = create("span", {
          className: "select__country-name",
          child: obj.Country,
        });
        const casesCount = create("span", {
          className: "select__cases-count",
          child: `${obj.TotalConfirmed.toLocaleString()} `,
        });
        const newLi = create("li", {
          className: "list__li",
          child: [casesCount, countryName],
          parent: null,
          dataAttr: [
            ["key", index],
            ["code", obj.CountryCode],
          ],
        });
        fragment.append(newLi);
        newLi.addEventListener("click", (e) => {
          this.emit("chooseCountry", e.target.closest("li").dataset.code);
        });
      });
    list.append(fragment);
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

  rebuildTable(countryCode) {
    let currentCountryObj = this.model.getGlobal();
    let tableName = "Global Cases";
    if (countryCode) {
      let i = this.elements.tableCases.childNodes.length - 1;
      while (i > -1) {
        this.elements.tableCases.childNodes[i].remove();
        i -= 1;
      }
      currentCountryObj = this.model.getCountryByCode(countryCode);
      tableName = this.model.getCountryByCode(countryCode).Country;
      this.elements.inputSearch.value = "";
      this.rebuildList();
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

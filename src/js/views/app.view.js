import EventEmitter from "../eventEmitter";
import create from "../utils/create";

export default class AppView extends EventEmitter {
  constructor(model, elements) {
    super();
    this.model = model;
    this.elements = elements;

    // attach model listeners
    model
      .on("changeCountry", (code) => this.rebuildTableByCountry(code))
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
      .filter((obj) => obj.country.toLowerCase().includes(searchValue))
      .forEach((obj, index) => {
        const flagImg = create("img", {
          className: "flag-img",
          child: null,
          parent: null,
          dataAttr: [["src", obj.countryInfo.flag]],
        });
        const countryName = create("span", {
          className: "select__country-name",
          child: obj.country,
        });
        const casesCount = create("span", {
          className: "select__cases-count",
          child: `${obj.cases.toLocaleString()} `,
        });
        const newLi = create("li", {
          className: "list__li",
          child: [flagImg, casesCount, countryName],
          parent: null,

          dataAttr: [
            ["key", index],
            ["code", obj.countryInfo.iso3],
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

  rebuildTableByCountry(countryCode) {
    const currentCountryObj = this.model.getCountryByCode(countryCode);
    const tableName = this.model.getCountryByCode(countryCode).country;
    const { cases } = currentCountryObj;
    const { deaths } = currentCountryObj;
    const { recovered } = currentCountryObj;

    let i = this.elements.tableCases.childNodes.length - 1;
    while (i > -1) {
      this.elements.tableCases.childNodes[i].remove();
      i -= 1;
    }

    this.renderTable(tableName, cases, deaths, recovered);
  }

  rebuildTable() {
    const currentCountryObj = this.model.getGlobal();
    const tableName = "Global Cases";
    const confirmed = currentCountryObj.TotalConfirmed;
    const deaths = currentCountryObj.TotalDeaths;
    const recovered = currentCountryObj.TotalRecovered;
    this.renderTable(tableName, confirmed, deaths, recovered);
  }

  renderTable(tableName, confirmed, deaths, recovered) {
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
          child: confirmed.toLocaleString(),
        }),
        create("td", {
          className: "table_td",
          child: deaths.toLocaleString(),
        }),
        create("td", {
          className: "table_td",
          child: recovered.toLocaleString(),
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

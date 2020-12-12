import EventEmitter from "../eventEmitter";
import create from "../utils/create";

export default class AppView extends EventEmitter {
  constructor(model, elements) {
    super();
    this.model = model;
    this.elements = elements;

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
    this.renderCheckbox();
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
      className: "table_tr",
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

  renderCheckbox() {
    const checkBoxContainer = create("div", {
      className: "checkbox-container",
    });
    const onCases = create("span", {
      className: "on",
      child: "All cases",
    });
    const offCases = create("span", {
      className: "off",
      child: "Cases per day",
    });
    const labelCases = create("label", {
      className: "checkbox-label",
      child: [onCases, offCases],
      parent: null,
      dataAttr: [["for", "checkbox1"]],
    });
    const inputCases = create("input", {
      className: "checkbox",
      child: null,
      parent: null,
      dataAttr: [
        ["id", "checkbox1"],
        ["type", "checkbox"],
      ],
    });
    checkBoxContainer.append(inputCases, labelCases);

    const onPerHundred = create("span", {
      className: "on",
      child: "Cases for all population",
    });
    const offPerHundred = create("span", {
      className: "off",
    });
    offPerHundred.innerHTML = `Cases for 100 000 population`;
    const labelPerHundred = create("label", {
      className: "checkbox-label",
      child: [onPerHundred, offPerHundred],
      parent: null,
      dataAttr: [["for", "checkbox2"]],
    });
    const inputPerHundred = create("input", {
      className: "checkbox",
      child: null,
      parent: null,
      dataAttr: [
        ["id", "checkbox2"],
        ["type", "checkbox"],
      ],
    });

    checkBoxContainer.append(inputPerHundred, labelPerHundred);
    this.elements.list.parentNode.append(checkBoxContainer);
    if (inputCases.checked) {
      // console.log("checked");
    } else {
      // console.log("unchecked");
    }
  }
}

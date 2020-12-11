import EventEmitter from "../eventEmitter";

export default class SelectModel extends EventEmitter {
  constructor(items) {
    super();
    this.items = items || [];
    this.selectedCountryIndex = -1;
  }

  async fetchItems(url) {
    const response = await fetch(url);
    const json = await response.json();
    this.items = json;
  }

  getCountries() {
    this.items.Countries = this.items.Countries.sort(
      (a, b) => b.TotalConfirmed - a.TotalConfirmed
    );
    return this.items.Countries;
  }

  getCountryByIndex(index) {
    return this.items.Countries[index];
  }

  getGlobal() {
    return this.items.Global;
  }

  addItem(item) {
    this.items.push(item);
    this.emit("itemAdded", item);
  }

  removeItemAt(index) {
    const item = this.items.splice(index, 1)[0];
    this.emit("itemRemoved", item);
    if (index === this.selectedIndex) {
      this.selectedIndex = -1;
    }
  }

  chooseCountry(index) {
    this.selectedCountryIndex = index;
    this.emit("changeCountry", index);
  }

  /*
  get selectedCountryIndex() {
    return this.selectedCountryIndex;
  }

  set selectedCountryIndex(index) {
    const previousIndex = this.selectedCountryIndex;
    console.log("indexi", index);
    this.selectedCountryIndex = index;
    this.emit("selectedIndexChanged", previousIndex);
  } */
}

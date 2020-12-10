import EventEmitter from "../eventEmitter";

export default class SelectModel extends EventEmitter {
  constructor(items) {
    super();
    this.items = items || [];
    this.selectedIndex = -1;
  }

  async fetchItems(url) {
    const response = await fetch(url);
    const json = await response.json();
    this.items = json;
  }

  getCountries() {
    return this.items.Countries.slice().sort(
      (a, b) => b.TotalConfirmed - a.TotalConfirmed
    );
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

  get selectedIndex() {
    return this.selectedIndex;
  }

  set selectedIndex(index) {
    const previousIndex = this.selectedIndex;
    this.selectedIndex = index;
    this.emit("selectedIndexChanged", previousIndex);
  }
}

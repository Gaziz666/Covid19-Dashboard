import EventEmitter from "../eventEmitter";

export default class SelectModel extends EventEmitter {
  constructor(items) {
    super();
    this._items = items || [];
    this._selectedIndex = -1;
  }

  async fetchItems(url) {
    const response = await fetch(url);
    const json = await response.json();
    this._items = json.Countries;
  }

  getItems() {
    return this._items.slice();
  }

  addItem(item) {
    this._items.push(item);
    this.emit("itemAdded", item);
  }

  removeItemAt(index) {
    const item = this._items.splice(index, 1)[0];
    this.emit("itemRemoved", item);
    if (index === this._selectedIndex) {
      this.selectedIndex = -1;
    }
  }

  get selectedIndex() {
    return this._selectedIndex;
  }

  set selectedIndex(index) {
    const previousIndex = this._selectedIndex;
    this._selectedIndex = index;
    this.emit("selectedIndexChanged", previousIndex);
  }
}

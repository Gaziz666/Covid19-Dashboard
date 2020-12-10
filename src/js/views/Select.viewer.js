import EventEmitter from "../eventEmitter";

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
    this.rebuildList();
  }

  rebuildList() {
    const select = this._elements.select;
    select.options.length = 0;
    this._model
      .getItems()
      .forEach((item) => select.options.add(new Option(item.Country)));
    this._model.selectedIndex = -1;
  }
}

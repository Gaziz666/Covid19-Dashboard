import EventEmitter from "../eventEmitter";

export default class SelectView extends EventEmitter {
  constructor(model, elements) {
    super();
    this.model = model; // items = [data]
    this.elements = elements; // select

    /* // attach model listeners
    model.on('itemAdded', () => this.rebuildList())
      .on('itemRemoved', () => this.rebuildList());

    // attach listeners to HTML controls
    elements.select.addEventListener('change',
      e => this.emit('listModified', e.target.selectedIndex)); */
  }

  show() {
    this.rebuildList();
  }

  rebuildList() {
    const { select } = this.elements;
    select.options.length = 0;
    this.model
      .getItems()
      .forEach((item) => select.options.add(new Option(item.Country)));
    this.model.selectedIndex = -1;
  }
}

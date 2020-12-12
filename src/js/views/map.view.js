import EventEmitter from "../eventEmitter";
// import create from '../utils/create';

export default class SelectView extends EventEmitter {
  constructor(model, elements) {
    super();
    this.model = model; // items = [data]
    this.elements = elements; // select
    // console.log(this.model);
  }

  show() {
    this.rebuildMap();
  }

  // rebuildMap() {}
}

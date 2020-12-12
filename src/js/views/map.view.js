import EventEmitter from "../eventEmitter";
// import create from '../utils/create';

export default class SelectView extends EventEmitter {
  constructor(model, elements) {
    super();
    this.model = model;
    this.elements = elements;
    this.countryDataArr = this.model.countryDataArr;
  }

  show() {
    this.rebuildMap();
  }

  // rebuildMap() {
  // const { map } = this.elements;
  // console.log(this.countryDataArr);
  // console.log(this.mapContainer);
  // const mapContainer = create('div', {
  //   className: 'map',
  // });
  // }
}

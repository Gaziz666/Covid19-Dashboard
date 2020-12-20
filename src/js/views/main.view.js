import EventEmitter from '../eventEmitter';
import AppController from '../controller/app.controller';
import AppView from './app.view';
import MapView from './map.view';
import CheckboxView from './checkbox.view';
import create from '../utils/create';

export default class MainView extends EventEmitter {
  constructor(model) {
    super();
    this.model = model;
    this.elements = {};
  }

  show() {
    const main = create('div', { className: 'main' });
    const header = create('header', { className: 'header', child: 'COVID-19' });
    const selectMain = create('section', { className: 'select-main' });
    // const selectGraf = create('section', { className: 'select-graf' });
    const firstColumMain = create('div', { className: 'first-column' });
    const secondColumMain = create('div', { className: 'second-column' });

    this.elements.list = create('ul', { className: 'list-wrapper' });
    this.elements.inputSearch = create('input', {
      className: 'search-country',
      child: null,
      parent: null,
      dataAttr: [['placeholder', 'Search...']], // <input class="search-country" placeholder="Search...">
    });
    this.elements.globalCases = create('div', { className: 'global-cases' });
    this.elements.tableCases = create('div', { className: 'table-cases' });
    this.elements.map = create('div', { className: 'map' });
    const selectSearchWrapper = create('div', {
      className: 'select-search-wrapper',
      child: [this.elements.inputSearch, this.elements.list],
    });

    firstColumMain.append(this.elements.globalCases, selectSearchWrapper);
    secondColumMain.append(this.elements.map, this.elements.tableCases);
    selectMain.append(firstColumMain, secondColumMain);
    main.append(header, selectMain);

    document.body.prepend(main);
    const view = new AppView(this.model, this.elements);
    const mapView = new MapView(this.model, this.elements);
    const checkboxView = new CheckboxView(this.model);

    view.show();
    mapView.show();
    // eslint-disable-next-line no-unused-vars
    const controller = new AppController(
      this.model,
      view,
      mapView,
      checkboxView
    );
  }
}

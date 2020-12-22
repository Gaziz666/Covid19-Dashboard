import EventEmitter from '../eventEmitter';
import AppController from '../controller/app.controller';
import ListTableSearchView from './listTableSearch.view';
import MapView from './map.view';
import ChartView from './chart.view';
import create from '../utils/create';

export default class MainView extends EventEmitter {
  constructor(model) {
    super();
    this.model = model;
    this.elements = {};
  }

  show() {
    const header = create('header', {
      className: 'header',
      child: null,
    });
    create('h1', {
      className: 'header_title',
      child: 'COVID-19 Dashboard by RS School',
      parent: header,
    });
    const main = create('main', { className: 'main' });
    const footer = create('footer', { className: 'footer' });

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
    this.elements.chartContainer = create('div', { className: 'chart' });

    firstColumMain.append(this.elements.globalCases, selectSearchWrapper);
    secondColumMain.append(
      this.elements.map,
      this.elements.tableCases,
      this.elements.chartContainer
    );
    selectMain.append(firstColumMain, secondColumMain);
    main.appendChild(selectMain);

    document.body.prepend(footer);
    document.body.prepend(main);
    document.body.prepend(header);
    const viewListTableSearch = new ListTableSearchView(
      this.model,
      this.elements
    );
    const mapView = new MapView(this.model, this.elements);
    const chartView = new ChartView(this.model, this.elements);

    viewListTableSearch.show();
    mapView.show();
    chartView.show();
    // eslint-disable-next-line no-unused-vars
    const controller = new AppController(
      this.model,
      viewListTableSearch,
      mapView,
      chartView
    );
  }
}

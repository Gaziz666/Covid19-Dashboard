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

    const footer = create('footer', { className: 'footer' });
    const footerContainer = create('div', {
      className: 'footer_container',
      child: null,
      parent: footer,
    });
    const rsLink = create('div', {
      className: 'rs_link',
      child: null,
      parent: footerContainer,
    });
    const rsLogo = create('a', {
      className: 'rs_logo',
      child: null,
      parent: rsLink,
      dataAttr: [['href', 'https://rs.school/js/']],
    });
    const rsImg = create('img', {
      className: 'rs_image',
      child: null,
      parent: rsLogo,
      dataAttr: [
        ['src', './assets/img/rs_school_js.svg'],
        ['alt', 'RS School logo'],
      ],
    });
    const gitHubInfo = create('div', {
      className: 'github_info',
      child: null,
      parent: footerContainer,
    });
    const year = create('div', {
      className: 'year',
      child: 'created in 2020 by',
      parent: gitHubInfo,
    });
    const gitHubLinks = create('div', {
      className: 'github_links',
      child: null,
      parent: gitHubInfo,
    });
    const gitHubLogo = create('img', {
      className: 'github_logo',
      child: null,
      parent: gitHubInfo,
      dataAttr: [
        ['src', './assets/img/github-logo.svg'],
        ['alt', 'GitHub logo'],
      ],
    });
    create('a', {
      className: 'github_link',
      child: 'Gaziz666',
      parent: gitHubLinks,
      dataAttr: [['href', 'https://github.com/Gaziz666']],
    });
    create('a', {
      className: 'github_link',
      child: 'Rrroman',
      parent: gitHubLinks,
      dataAttr: [['href', 'https://github.com/Rrroman']],
    });
    create('a', {
      className: 'github_link',
      child: 'filonushka',
      parent: gitHubLinks,
      dataAttr: [['href', 'https://github.com/filonushka']],
    });
    const main = create('main', { className: 'main' });

    const sectionMain = create('section', { className: 'section-main' });
    const firstColumMain = create('div', { className: 'first-column' });
    const secondColumMain = create('div', {
      className: 'second-column relative',
    });
    const thirdColumMain = create('div', { className: 'third-column' });

    this.elements.list = create('ul', { className: 'list-wrapper' });
    this.elements.inputSearch = create('input', {
      className: 'search-country',
      child: null,
      parent: null,
      dataAttr: [['placeholder', 'Search...']], // <input class="search-country" placeholder="Search...">
    });
    this.elements.globalCases = create('div', { className: 'global-cases' });
    this.elements.tableCases = create('div', {
      className: 'table-cases relative',
    });
    this.elements.map = create('div', { className: 'map' });
    const selectSearchWrapper = create('div', {
      className: 'select-search-wrapper relative',
      child: [this.elements.inputSearch, this.elements.list],
    });
    this.elements.chartContainer = create('div', {
      className: 'chart relative',
    });

    firstColumMain.append(this.elements.globalCases, selectSearchWrapper);
    secondColumMain.append(this.elements.map);
    thirdColumMain.append(
      this.elements.tableCases,
      this.elements.chartContainer
    );

    rsLogo.append(rsImg);
    rsLink.append(rsLogo);
    gitHubInfo.append(year, gitHubLogo, gitHubLinks);
    footerContainer.append(rsLink, gitHubInfo);
    footer.append(footerContainer);

    sectionMain.append(firstColumMain, secondColumMain, thirdColumMain);
    main.appendChild(sectionMain);

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

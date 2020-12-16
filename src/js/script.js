import '../css/style.css';

import AppModel from './models/app.model';
import AppController from './controller/app.controller';
import AppView from './views/app.view';
import MapView from './views/map.view';
import create from './utils/create';
import { URL } from './utils/constants';

require.context('./../assets/img', true, /\.(png|svg|jpg|gif)$/);
// require.context("./../assets/audio", true, /\.wav$/);

const list = create('ul', { className: 'list-wrapper' });
const inputSearch = create('input', {
  className: 'search-country',
  child: null,
  parent: null,
  dataAttr: [['placeholder', 'Search...']],
});

const globalCases = create('div', { className: 'global-cases' });
const tableCases = create('div', { className: 'table-cases' });
const map = create('div', { className: 'map' });
const selectSearchWrapper = create('div', {
  className: 'select-search-wrapper',
  child: [inputSearch, list],
});

document.body.prepend(selectSearchWrapper, globalCases, tableCases, map);

const model = new AppModel();

const loadData = new Promise((resolve) => {
  resolve(model.fetchData(URL.COUNTRY, URL.SUMMARY));
  // reject('error load server');
});

loadData.then(() => {
  const view = new AppView(model, {
    list,
    inputSearch,
    globalCases,
    tableCases,
  });

  const mapView = new MapView(model, { map });

  mapView.show();
  view.show();

  // eslint-disable-next-line no-unused-vars
  const controller = new AppController(model, view, mapView);
});

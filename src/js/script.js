import '../css/style.css';

import AppModel from './models/app.model';
import { URL } from './utils/constants';
import MainView from './views/main.view';

require.context('./../assets/img', true, /\.(png|svg|jpg|gif)$/);

const model = new AppModel();

const loadData = new Promise((resolve) => {
  resolve(
    model.fetchData(
      URL.COUNTRY_ARR,
      URL.SUMMARY,
      URL.ALL_DAYS,
      URL.ALL_POPULATION
    )
  );
}).catch((err) => alert(err.message));

loadData.then(() => {
  const view = new MainView(model);

  view.show();
});

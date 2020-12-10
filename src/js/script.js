import "../css/style.css";
import SelectModel from "./models/Select.model";
// import ListController from './controller/List.controller';
import SelectView from "./views/Select.viewer";
import create from "./utils/create";
import URL from "./utils/constants";

require.context("./../assets/img", true, /\.(png|svg|jpg|gif)$/);
require.context("./../assets/audio", true, /\.wav$/);

const select = create("select", {
  className: "select-block",
  child: null,
  parent: null,
  dataAttr: [["size", "10"]],
});

document.body.append(select);

const model = new SelectModel();

const p1 = new Promise((resolve) => {
  resolve(model.fetchItems(URL.SUMMARY));
  // reject('error load server');
});

p1.then(() => {
  const view = new SelectView(model, {
    select,
  });
  // const controller = new ListController(model, view);

  view.show();
});

// test

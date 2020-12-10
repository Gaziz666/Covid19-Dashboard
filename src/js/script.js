import "../css/style.css";
import "../css/select.css";
import SelectModel from "./models/Select.model";
// import ListController from './controller/List.controller';
import SelectView from "./views/Select.viewer";
import create from "./utils/create";
import URL from "./utils/constants";

// require.context("./../assets/img", true, /\.(png|svg|jpg|gif)$/);
// require.context("./../assets/audio", true, /\.wav$/);

const select = create("select", {
  className: "select-block",
  child: null,
  parent: null,
  dataAttr: [["size", "10"]],
});
const globalCases = create("div", { className: "global-cases" });
const tableCases = create("div", { className: "table-cases" });

document.body.append(select, globalCases, tableCases);

const model = new SelectModel();

const loadData = new Promise((resolve) => {
  resolve(model.fetchItems(URL.SUMMARY));
  // reject('error load server');
});

loadData.then(() => {
  const view = new SelectView(model, {
    select,
    globalCases,
    tableCases,
  });
  // const controller = new ListController(model, view);

  view.show();
});

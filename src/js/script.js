import "../css/style.css";
import "../css/select.css";
import SelectModel from "./models/Select.model";
import SelectController from "./controller/Select.controller";
import SelectView from "./views/Select.viewer";
import create from "./utils/create";
import URL from "./utils/constants";

// require.context("./../assets/img", true, /\.(png|svg|jpg|gif)$/);
// require.context("./../assets/audio", true, /\.wav$/);

const list = create("ul", { className: "list-wrapper" });
const inputSearch = create("input", {
  className: "search-country",
  child: null,
  parent: null,
  dataAttr: [["placeholder", "Search..."]],
});
const globalCases = create("div", { className: "global-cases" });
const tableCases = create("div", { className: "table-cases" });
const selectSearchWrapper = create("div", {
  className: "select-search-wrapper",
  child: [inputSearch, list],
});

document.body.append(selectSearchWrapper, globalCases, tableCases);

const model = new SelectModel();

const loadData = new Promise((resolve) => {
  resolve(model.fetchData(URL.SUMMARY));
  // reject('error load server');
});

loadData.then(() => {
  const view = new SelectView(model, {
    list,
    inputSearch,
    globalCases,
    tableCases,
  });
  // eslint-disable-next-line no-unused-vars
  const controller = new SelectController(model, view);
  view.show();
});

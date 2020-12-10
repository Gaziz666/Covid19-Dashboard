export default class ListController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    view.on("listModified", (idx) => this.updateSelected(idx));
    view.on("addButtonClicked", () => this.addItem());
    view.on("delButtonClicked", () => this.delItem());
  }

  addItem() {
    const item = "Add item:";
    if (item) {
      this.model.addItem(item);
    }
  }

  delItem() {
    const index = this.model.selectedIndex;
    if (index !== -1) {
      this.model.removeItemAt(index);
    }
  }

  updateSelected(index) {
    this.model.selectedIndex = index;
  }
}

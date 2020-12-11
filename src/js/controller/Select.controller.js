export default class SelectController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    view.on("chooseCountry", (countryIndex) =>
      this.updateSelectedCountry(countryIndex)
    );
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

  updateSelectedCountry(index) {
    this.model.chooseCountry(index);
  }
}

export default class CasesBtnController {
  constructor(model, casesTypeButton) {
    this.model = model;
    this.casesTypeButton = casesTypeButton;

    this.casesTypeButton
      .on('changeCasesViewRight', () => this.changeCasesTypeViewAdd())
      .on('changeCasesViewLeft', () => this.changeCasesTypeViewInc());
  }

  changeCasesTypeViewAdd() {
    this.model.changeCasesTypeViewAdd();
  }

  changeCasesTypeViewInc() {
    this.model.changeCasesTypeViewInc();
  }
}

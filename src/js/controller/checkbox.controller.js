export default class CheckboxController {
  constructor(model, checkboxView) {
    this.model = model;
    this.checkboxView = checkboxView;

    this.checkboxView
      .on('changeCases', (checkbox) => {
        this.changeCasesCheckbox(checkbox);
      })
      .on('changeForPopulations', (checkbox) => {
        this.changeForPopulationCheckbox(checkbox);
      });
  }

  changeCasesCheckbox(checkbox) {
    this.model.changeCasesView(checkbox);
  }

  changeForPopulationCheckbox(checkbox) {
    this.model.changeForPopulationView(checkbox);
  }
}

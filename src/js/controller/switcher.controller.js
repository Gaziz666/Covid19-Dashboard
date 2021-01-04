export default class SwitcherController {
  constructor(model, checkboxView) {
    this.model = model;
    this.checkboxView = checkboxView;

    this.checkboxView
      .on('changeCases', (checkbox) => {
        this.changeCasesState(checkbox);
      })
      .on('changeForPopulations', (checkbox) => {
        this.changeForPopulationState(checkbox);
      });
  }

  changeCasesState(checkbox) {
    this.model.changeCasesView(checkbox);
  }

  changeForPopulationState(checkbox) {
    this.model.changeForPopulationView(checkbox);
  }
}

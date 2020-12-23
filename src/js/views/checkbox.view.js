import '../../css/checkbox.css';

import create from '../utils/create';
import EventEmitter from '../eventEmitter';

export default class CheckboxView extends EventEmitter {
  constructor(model) {
    super();
    this.model = model;
    this.inputPerHundred = null;
    this.inputCases = null;
  }

  renderCheckbox(name) {
    const checkBoxContainer = create('div', {
      className: 'checkbox-container',
    });
    const onCases = create('div', {
      className: 'on',
      child: 'Cases per day',
    });
    const offCases = create('div', {
      className: 'off',
      child: 'All cases',
    });
    const labelCases = create('label', {
      className: 'checkbox-label',
      child: [onCases, offCases],
      parent: null,
      dataAttr: [['for', `${name}1`]],
    });
    const inputCases = create('input', {
      className: 'checkbox',
      child: null,
      parent: null,
      dataAttr: [
        ['id', `${name}1`],
        ['type', 'checkbox'],
      ],
    });
    checkBoxContainer.append(inputCases, labelCases);

    const onPerHundred = create('div', {
      className: 'on',
      child: 'Cases for 100 000 p',
    });
    const offPerHundred = create('div', {
      className: 'off',
      child: 'Cases for all population',
    });
    const labelPerHundred = create('label', {
      className: 'checkbox-label',
      child: [onPerHundred, offPerHundred],
      parent: null,
      dataAttr: [['for', `${name}2`]],
    });
    const inputPerHundred = create('input', {
      className: 'checkbox',
      child: null,
      parent: null,
      dataAttr: [
        ['id', `${name}2`],
        ['type', 'checkbox'],
      ],
    });

    inputCases.checked = this.model.checkboxPerDayCasesIsChecked;
    inputPerHundred.checked = this.model.checkboxFor100ThouthandPopulationIsChecked;

    checkBoxContainer.append(inputPerHundred, labelPerHundred);
    this.inputCases = inputCases;
    this.inputPerHundred = inputPerHundred;

    inputCases.onchange = (e) => {
      this.emit('changeCases', e.target);
    };
    inputPerHundred.onchange = (e) => {
      this.emit('changeForPopulations', e.target);
    };

    return checkBoxContainer;
  }
}

import create from '../utils/create';
import EventEmitter from '../eventEmitter';

import '../../css/casesTypeBtn.css';

export default class CasesTypeBtnView extends EventEmitter {
  constructor(model) {
    super();
    this.model = model;
  }

  renderButton() {
    const casesTypes = ['Confirmed', 'Deaths', 'Recovered'];
    const buttonContainer = create('div', {
      className: 'button-container',
    });
    const buttonRight = create('button', {
      className: 'button-right',
      child: create('span', { className: 'arrow', child: '>' }),
    });
    const buttonLeft = create('button', {
      className: 'button-left',
      child: create('span', { className: 'arrow', child: '<' }),
    });
    const casesType = create('div', {
      className: 'cases-type',
      child: casesTypes[this.model.casesTypeIndex],
    });
    buttonContainer.append(buttonLeft, casesType, buttonRight);
    buttonRight.addEventListener('click', () => {
      this.emit('changeCasesViewRight');
    });
    buttonLeft.addEventListener('click', () => {
      this.emit('changeCasesViewLeft');
    });

    return buttonContainer;
  }
}

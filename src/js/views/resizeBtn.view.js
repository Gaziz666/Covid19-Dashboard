import '../../css/checkbox.css';

import create from '../utils/create';
import EventEmitter from '../eventEmitter';

export default class ResizeBtnView extends EventEmitter {
  constructor(model) {
    super();
    this.model = model;
  }

  renderResizeBtn() {
    const bigBtn = create('div', {
      className: 'resize-button',
    });
    const smallBtn = create('div', {
      className: 'small-button disable',
    });

    bigBtn.onclick = () => {
      this.emit('bigSize', { bigBtn, smallBtn });
    };
    smallBtn.onclick = () => {
      this.emit('smallSize', { bigBtn, smallBtn });
    };

    return { bigBtn, smallBtn };
  }
}

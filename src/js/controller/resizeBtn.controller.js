export default class ResizeController {
  constructor(resizeBtnView, element) {
    this.resizeBtnView = resizeBtnView;
    this.parentElement = element;

    this.resizeBtnView
      .on('bigSize', (buttons) => {
        this.bigSizeBlock(buttons);
      })
      .on('smallSize', (buttons) => {
        this.smallSizeBlock(buttons);
      });
  }

  bigSizeBlock(buttons) {
    const { bigBtn, smallBtn } = buttons;
    this.parentElement.classList.remove('relative');
    this.parentElement.classList.add('full-page');
    bigBtn.classList.add('disable');
    smallBtn.classList.remove('disable');
  }

  smallSizeBlock(buttons) {
    const { bigBtn, smallBtn } = buttons;

    this.parentElement.classList.add('relative');
    this.parentElement.classList.remove('full-page');
    bigBtn.classList.remove('disable');
    smallBtn.classList.add('disable');
  }
}

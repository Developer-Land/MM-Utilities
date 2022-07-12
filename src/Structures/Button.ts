import { ButtonType } from '../Typings/Button';

export class Button {
  constructor(buttonOptions: ButtonType) {
    Object.assign(this, buttonOptions);
  }
}

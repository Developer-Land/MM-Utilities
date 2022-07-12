import { SelectMenuType } from '../Typings/SelectMenu';

export class SelectMenu {
  constructor(selectMenuOptions: SelectMenuType) {
    Object.assign(this, selectMenuOptions);
  }
}

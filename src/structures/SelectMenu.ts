import { SelectMenuType } from '../typings/SelectMenu';

export class SelectMenu {
  constructor(selectMenuOptions: SelectMenuType) {
    Object.assign(this, selectMenuOptions);
  }
}

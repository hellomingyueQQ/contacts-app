import { Directive } from '@angular/core';

@Directive({
  selector: 'input([type=date])[formControlName],input([type=date])[formControl],input([type=date])[ngModel]',
  // Question：我不明白为什么加阔号，回头看看选择器吧
})
export class DataValueAccessorDirective {
  constructor() {}
}


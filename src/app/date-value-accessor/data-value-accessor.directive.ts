import { Directive, Provider, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
const DATE_VALUE_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DataValueAccessorDirective), //forwordref跟引用在定义前面有关
  multi: true,
};

// application service没有学透

@Directive({
  selector: 'input([type=date])[formControlName],input([type=date])[formControl],input([type=date])[ngModel]',
  // Question：我不明白为什么加阔号，回头看看选择器吧
  providers: [DATE_VALUE_PROVIDER],
})
export class DataValueAccessorDirective {
  constructor() {}
}

// 至此定义，全部是壳子

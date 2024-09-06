import { Directive, ElementRef, Provider, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
const DATE_VALUE_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DataValueAccessorDirective), //forwordref跟引用在定义前面有关
  multi: true,
};

// application service没有学透
// 为什么这些accessor用的时候，不需要指定，直接自然就被用给html element？跟服务有关么？

@Directive({
  selector: 'input([type=date])[formControlName],input([type=date])[formControl],input([type=date])[ngModel]',
  // Question：我不明白为什么加阔号，回头看看选择器吧
  // 这个做好了试试去掉阔号，看看还能行不
  providers: [DATE_VALUE_PROVIDER],
})
export class DataValueAccessorDirective implements ControlValueAccessor {
  constructor(private element: ElementRef) {}

  // FormControl change => update HTML Element
  writeValue(newValue: any): void {
    // yyyy-mmm-dd
    // 用户可能存入FormControl nonDate type
    if (newValue instanceof Date) {
      this.element.nativeElement.value = newValue.toISOString().split('T')[0];
    }
    // yyyy-mm--ddThh:mm:ss.000Z
  }

  // HTML element change => update FormControl
  registerOnChange(fn: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }
}

// 至此定义，全部是壳子

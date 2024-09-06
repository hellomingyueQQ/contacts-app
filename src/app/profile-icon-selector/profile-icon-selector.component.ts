import { Component } from '@angular/core';
import { profileIconNames } from './profile-icon-names';
import { Provider, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
const PROFILE_ICON_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ProfileIconSelectorComponent), //forwordref跟引用在定义前面有关
  multi: true,
};

@Component({
  selector: 'con-profile-icon-selector',
  templateUrl: './profile-icon-selector.component.html',
  styleUrls: ['./profile-icon-selector.component.css'],
  providers: [PROFILE_ICON_VALUE_ACCESSOR],
})
export class ProfileIconSelectorComponent implements ControlValueAccessor {
  profileIcons = profileIconNames;
  showAllIcons: boolean = true;
  selectedIcon!: string | null;
  iconSelected(icon: string) {
    this.showAllIcons = false;
    this.selectedIcon = icon;
    this.onChange(icon);
  }
  private onChange!: Function;
  private onTouched!: Function;

  // FormControl change => update HTML Element
  writeValue(icon: string | null): void {
    this.selectedIcon = icon;
    if (icon && icon !== '') {
      this.showAllIcons = false;
    } else {
      this.showAllIcons = true;
    }
  }

  // HTML element change => update FormControl
  registerOnChange(fn: Function): void {
    this.onChange = (icon: string) => {
      fn(icon);
    };
  }
  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {}
}


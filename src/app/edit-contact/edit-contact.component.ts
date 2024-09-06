import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from '../contacts/contacts.service';
import { debounceTime, distinctUntilChanged, first } from 'rxjs';
import { addressTypeValues, phoneTypeValues } from '../contacts/contact.model';
import { restrictedWords } from '../validators/restricted-words.validators';

@Component({
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css'],
})
export class EditContactComponent implements OnInit {
  phoneTypes = phoneTypeValues;
  addressTypes = addressTypeValues;
  contactForm = this.fb.nonNullable.group({
    id: '',
    icon: '',
    personal: false,
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    lastName: '',
    dateOfBirth: <Date | null>null,
    favoritesRanking: <number | null>null,
    phones: this.fb.array([this.createPhoneGroup()]), //formarray初始化的方法
    address: this.fb.nonNullable.group({
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      addressType: '',
    }),
    notes: ['', restrictedWords(['foo', 'bar'])],
  });

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactsService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    const contactId = this.route.snapshot.params['id'];
    if (!contactId) return;
    this.contactService.getContact(contactId).subscribe(contact => {
      if (!contact) {
        this.subscribeToAddressChanges();
        return;
      }
      // 这里需要给除了phone的第一个元素外，创建formGroup壳子
      for (let i = 1; i < contact.phones.length; i++) {
        this.addPhone();
      }
      this.contactForm.setValue(contact);
      this.subscribeToAddressChanges();
    });
  }

  subscribeToAddressChanges() {
    const addressGroup = this.contactForm.controls.address;
    addressGroup.valueChanges.pipe(distinctUntilChanged(this.stringCompare)).subscribe(() => {
      // 这样是loop出control的名字属性名
      for (const controlName in addressGroup.controls) {
        addressGroup.get(controlName)?.removeValidators([Validators.required]);
        // 用controlname获取control
        addressGroup.get(controlName)?.updateValueAndValidity();
      }
    });

    // 安静两分钟后，emit the values
    addressGroup.valueChanges.pipe(debounceTime(2000), distinctUntilChanged(this.stringCompare)).subscribe(() => {
      for (const controlName in addressGroup.controls) {
        addressGroup.get(controlName)?.addValidators([Validators.required]);
        addressGroup.get(controlName)?.updateValueAndValidity();
      }
    });
    // 综合效果就是input哪个，error都会小时，静止2分钟后，再出现error message
  }
  stringCompare(a: any, b: any) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  createPhoneGroup() {
    const phoneGroup = this.fb.nonNullable.group({
      phoneNumber: '',
      phoneType: '',
      preferred: false,
    });

    // phoneGroup.valueChanges.subscribe 如果想watch any value of the phonegroup
    // phoneGroup.controls.preferred.statusChanges validity change会激发这个流
    // formControl都有valuechanges, 这个定义的非常有针对性，不是更上一层
    phoneGroup.controls.preferred.valueChanges
      .pipe(distinctUntilChanged(this.stringCompare)) //打破循环
      .subscribe(value => {
        if (value) {
          // 动态添加validator，如果为true，那么phone number需要添加required的validator
          phoneGroup.controls.phoneNumber.addValidators([Validators.required]);
        } else {
          // 动态删除validator
          phoneGroup.controls.phoneNumber.removeValidators([Validators.required]);
          //但是光上面那句，uncheck prefer后，phonenumber还是有warning，这是因为
          // angular没有 revaluate the validity of this control
          // 没有操作在input元素上，所以没有机会trigger phone number的valuation
        }
        phoneGroup.controls.phoneNumber.updateValueAndValidity();
        // 有可能造成循环，updateValueAndValidity导致valueChanges
        // trigger update vlaue， 但是没有值进一步改变，需要distinctUntilChanged打破循环
      });

    return phoneGroup;
  }

  addPhone() {
    // 创建新的phone，先创建壳子
    this.contactForm.controls.phones.push(this.createPhoneGroup());
  }

  get firstName() {
    return this.contactForm.controls.firstName;
  }

  get notes() {
    return this.contactForm.controls.notes;
  }

  saveContact() {
    this.contactService.saveContact(this.contactForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/contacts']),
    });
  }
}

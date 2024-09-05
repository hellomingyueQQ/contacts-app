import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from '../contacts/contacts.service';
import { first } from 'rxjs';
import { phoneTypeValues } from '../contacts/contact.model';

@Component({
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css'],
})
export class EditContactComponent implements OnInit {
  phoneTypes = phoneTypeValues; //用于自动生成input:radio
  // Question: if FormControl is not initialized, then the type of firstName is any, is this okay?
  // 类型最好匹配绑定数据的类型
  // 1. 使用generic 的类型，同时要给初始化值  new FormControl<string>(""),
  // 但是给了初始化值，不需要给generic type  new FormControl("")，但是id这个时候的类型为string或者null
  // Question: 这不符合Contact的id的类型，怎么办?
  // string|null=>string  new FormControl('',{nonNullable:true}),

  // 下面的group是nullable的写法，如果是not nullable的写法：this.fb.nonNullable.group
  contactForm = this.fb.nonNullable.group({
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: <Date | null>null, //如果仅为null，那么类型为null
    favoritesRanking: <number | null>null, //
    phone: this.fb.nonNullable.group({
      phoneNumber: '',
      phoneType: '',
    }),
    address: this.fb.nonNullable.group({
      streetAddress: '',
      city: '',
      state: '',
      postalCode: '',
      addressType: '',
    }),
  });
  // 这里的问题是defining formgroup messy

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactsService,
    private router: Router,
    private fb: FormBuilder
  ) {}
  // 使用FormBulder可以简化formgroup的定义， 它是inject来的

  ngOnInit() {
    const contactId = this.route.snapshot.params['id'];
    if (!contactId) return;
    this.contactService.getContact(contactId).subscribe(contact => {
      if (!contact) {
        return;
      }
      // setValue不设置generic那就是any数据类型可以设置进去
      // this.contactForm.controls.id.setValue(contact.id);
      // this.contactForm.controls.firstName.setValue(contact.firstName);
      // this.contactForm.controls.lastName.setValue(contact.lastName);
      // this.contactForm.controls.dateOfBirth.setValue(contact.dateOfBirth);
      // this.contactForm.controls.favoritesRanking.setValue(
      //   contact.favoritesRanking
      // );
      // this.contactForm.controls.phone.controls.phoneNumber.setValue(
      //   contact.phone.phoneNumber
      // );
      // this.contactForm.controls.phone.controls.phoneType.setValue(
      //   contact.phone.phoneType
      // );
      // this.contactForm.controls.address.controls.streetAddress.setValue(
      //   contact.address.streetAddress
      // );
      // this.contactForm.controls.address.controls.city.setValue(
      //   contact.address.city
      // );
      // this.contactForm.controls.address.controls.postalCode.setValue(
      //   contact.address.postalCode
      // );
      // this.contactForm.controls.address.controls.state.setValue(
      //   contact.address.state
      // );
      // this.contactForm.controls.address.controls.addressType.setValue(
      //   contact.address.addressType
      // );
      // 这里的问题是初始化formgroup messy
      this.contactForm.setValue(contact);
      //这个代码可以拆分，可以简单些，比如address和phone再调用controls.xxx.setValue
      // this.contactForm.controls.id.setValue(contact.id);
      // this.contactForm.controls.firstName.setValue(contact.firstName);
      // this.contactForm.controls.lastName.setValue(contact.lastName);
      // this.contactForm.controls.dateOfBirth.setValue(contact.dateOfBirth);
      // this.contactForm.controls.favoritesRanking.setValue(
      //   contact.favoritesRanking
      // );
      // this.contactForm.controls.phone.setValue(contact.phone);
      // this.contactForm.controls.address.setValue(contact.address);

      //部分修改，比如，我想修改firstName,lastName不用control的setvalue，使用patchValue
      const names = {
        firstName: contact.firstName,
        lastName: contact.lastName,
      };
      this.contactForm.patchValue(names);
      // patchValue只能修改部分值，不能修改整个formgroup的值
    });
  }

  saveContact() {
    this.contactService.saveContact(this.contactForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/contacts']),
    });
    // Wire up address and phone by creating a new formgroup, why can not use the same formgroup?
    // 1. Use one formgroup cann't make contactForm.value have the same shape as Contact. the structure is flat
    // 2. the fileds of address and phone needs their own validation. it's convenient to use formgroup

    // hover "value" of "this.contactForm.value", you can get the real type of the value of the contactForm
    // getRawValue() will return all values of the formgroup, so the  value of getRawValue() dose not contain partial type=> Good solution
    // value will return the value which is not disabled or readonly and contains partial type
  }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContactsService } from '../contacts/contacts.service';

@Component({
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css'],
})
export class EditContactComponent implements OnInit {
  // 这些form control是isolated，如果做form层级validation，需要formgroup
  // formGroup更容易设置值，也更容易获取所有Form control的值
  // 用formGroup可以实现form级别的validation，后面会讲
  contactForm = new FormGroup({
    firstName: new FormControl('Jim'),
    lastName: new FormControl(),
    dateOfBirth: new FormControl(),
    favoritesRanking: new FormControl(),
  });

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactsService
  ) {}

  ngOnInit() {
    const contactId = this.route.snapshot.params['id'];
    if (!contactId) return;
    this.contactService.getContact(contactId).subscribe((contact) => {
      if (!contact) {
        return;
      }
      // 从formgroup的controls里面获取formcontrol，然后设置值
      this.contactForm.controls.firstName.setValue(contact.firstName);
      this.contactForm.controls.lastName.setValue(contact.lastName);
      this.contactForm.controls.dateOfBirth.setValue(contact.dateOfBirth);
      this.contactForm.controls.favoritesRanking.setValue(
        contact.favoritesRanking
      );
    });
  }

  saveContact() {
    // 从formgroup的controls array里面获取formcontrol
    console.log(this.contactForm.controls.firstName.value);
    console.log(this.contactForm.controls.lastName.value);
    console.log(this.contactForm.controls.dateOfBirth.value);
    console.log(this.contactForm.controls.favoritesRanking.value);
  }
}

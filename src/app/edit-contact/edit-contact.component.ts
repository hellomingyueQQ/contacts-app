import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContactsService } from '../contacts/contacts.service';

@Component({
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css'],
})
export class EditContactComponent implements OnInit {
  // 1. form control给form element传递值，一般给intial value
  firstName = new FormControl('Jim');
  lastName = new FormControl();
  dateOfBirth = new FormControl();
  favoritesRanking = new FormControl();

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactsService
  ) {}

  ngOnInit() {
    // 2. create form control之后，再给form control赋值
    // 使用setValue
    const contactId = this.route.snapshot.params['id'];
    if (!contactId) return;
    this.contactService.getContact(contactId).subscribe((contact) => {
      if (!contact) {
        return;
      }
      this.firstName.setValue(contact.firstName);
      this.lastName.setValue(contact.lastName);
      this.dateOfBirth.setValue(contact.dateOfBirth);
      this.favoritesRanking.setValue(contact.favoritesRanking);
    });
  }

  saveContact() {
    console.log(this.firstName.value);
    console.log(this.lastName.value);
    console.log(this.dateOfBirth.value);
    console.log(this.favoritesRanking.value);
    // if a user input value in the input element, then the control value will be set to that value
    // reactive form is one-way binding
    // angular tracks the values of those form controls
  }
}

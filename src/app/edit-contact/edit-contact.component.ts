import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from '../contacts/contacts.service';

@Component({
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css'],
})
export class EditContactComponent implements OnInit {
  contactForm = new FormGroup({
    id: new FormControl(), // not bind to html template, but the id will be shown in this.contactForm.value
    firstName: new FormControl(), // Question: if FormControl is not initialized, then the type of firstName is any, is this okay?
    lastName: new FormControl(),
    dateOfBirth: new FormControl(),
    favoritesRanking: new FormControl(),
    phone: new FormGroup({
      phoneNumber: new FormControl(),
      phoneType: new FormControl(),
    }),
    address: new FormGroup({
      streetAddress: new FormControl(),
      city: new FormControl(),
      state: new FormControl(),
      postalCode: new FormControl(),
      addressType: new FormControl(),
    }),
  });

  constructor(private route: ActivatedRoute, private contactService: ContactsService, private router: Router) {}

  ngOnInit() {
    const contactId = this.route.snapshot.params['id'];
    if (!contactId) return;
    this.contactService.getContact(contactId).subscribe(contact => {
      if (!contact) {
        return;
      }
      this.contactForm.controls.id.setValue(contact.id);
      this.contactForm.controls.firstName.setValue(contact.firstName);
      this.contactForm.controls.lastName.setValue(contact.lastName);
      this.contactForm.controls.dateOfBirth.setValue(contact.dateOfBirth);
      this.contactForm.controls.favoritesRanking.setValue(contact.favoritesRanking);
    });
  }

  saveContact() {
    console.log(this.contactForm.value);

    this.contactService.saveContact(this.contactForm.value).subscribe({
      next: () => this.router.navigate(['/contacts']),
    });
    // Wire up address and phone by creating a new formgroup, why can not use the same formgroup?
    // 1. Use one formgroup cann't make contactForm.value have the same shape as Contact. the structure is flat
    // 2. the fileds of address and phone needs their own validation. it's convenient to use formgroup

    // hover "value" of "this.contactForm.value", you can get the real type of the value of the contactForm
  }
}

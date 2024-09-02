import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css'],
})
export class EditContactComponent implements OnInit {
  firstName = new FormControl(); // collecting element value and perform validation
  lastName = new FormControl();
  dateOfBirth = new FormControl();
  favoritesRanking = new FormControl();
  // next step: wire up the form controls to the input
  // then angular will track input state, like value, if the filed is dirty or touched, valid

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const contactId = this.route.snapshot.params['id'];
    if (!contactId) return;
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

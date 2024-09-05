import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Contact } from './contact.model';
import { nanoid } from 'nanoid';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  constructor(private http: HttpClient) {}

  getContact(id: string): Observable<Contact | undefined> {
    return this.http.get<Contact>(`api/contacts/${id}`).pipe(
      map(c => {
        // console.log(c, typeof c.dateOfBirth);
        // dateOfBirth is string. 这里转了一道变为Date了
        // 前端用value属性和date pipe进行了转换
        // 但是还是有warning

        const dob = c.dateOfBirth ? new Date(c.dateOfBirth) : null;
        return { ...c, dateOfBirth: dob };
      })
    );
  }

  getAllContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>('api/contacts');
  }

  saveContact(contact: Partial<Contact>): Observable<Contact> {
    const headers = { headers: { 'Content-Type': 'application/json' } };

    if (!contact.id || contact.id === '') {
      let newContact: Partial<Contact> = { ...contact, id: nanoid(5) };
      return this.http.post<Contact>('api/contacts/', newContact, headers);
    } else {
      return this.http.put<Contact>('api/contacts/', contact, headers);
    }
  }
}

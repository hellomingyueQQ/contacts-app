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
    // json不支持date，需要自己手动转一下
    // return this.http.get<Contact>(`api/contacts/${id}`).pipe(
    //   map(c => {
    //     const dob = c.dateOfBirth ? new Date(c.dateOfBirth) : null;
    //     return { ...c, dateOfBirth: dob };
    //   })
    // );

    //下面的方式，返回的dateOfBirth是字符串，Jim倾向于处理字符串
    return this.http.get<Contact>(`api/contacts/${id}`).pipe(
      map(c => {
        // 1986-11-07T16:00:00.000Z
        c.dateOfBirth = c.dateOfBirth.split('T')[0];
        console.log(c.dateOfBirth); // 1986-11-07

        return c;
        //还是要改变格式，这样就不会有warning
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

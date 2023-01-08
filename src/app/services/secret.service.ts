import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root'
})
export class SecretService {
    constructor(private firestore: AngularFirestore) { }

    public getPwd() {
        return this.firestore.collection('secrets').doc('password').ref.get();
    }
}

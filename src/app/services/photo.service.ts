import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root'
})
export class PhotoService {
    constructor(private firestore: AngularFirestore) { }

    create(photo: Photo) {
        return this.firestore.collection<Photo>('photos').add(photo);
    }

    getAll() {
        return this.firestore.collection('photos').snapshotChanges();
    }

    delete(id: string) {
        this.firestore.doc('photos/' + id).delete();
    }
}

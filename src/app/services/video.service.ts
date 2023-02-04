import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root'
})
export class VideoService {
    constructor(private firestore: AngularFirestore) { }

    create(video: Video) {
        return this.firestore.collection<Video>('videos').add(video);
    }

    getAll() {
        return this.firestore.collection('videos').snapshotChanges();
    }

    delete(id: string) {
        this.firestore.doc('videos/' + id).delete();
    }
}

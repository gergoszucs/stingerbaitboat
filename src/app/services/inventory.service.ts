import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root'
})
export class InventoryService {
    constructor(private firestore: AngularFirestore) { }

    create(item: InventoryItem) {
        return this.firestore.collection<InventoryItem>('inventory').add(item);
    }

    getAll() {
        return this.firestore.collection('inventory').snapshotChanges();
    }

    update(item: InventoryItem) {
        this.firestore.doc('inventory/' + item.id).update(item);
    }

    delete(id: string) {
        this.firestore.doc('inventory/' + id).delete();
    }
}

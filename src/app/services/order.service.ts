import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    constructor(private firestore: AngularFirestore) { }

    create(order: Order) {
        return this.firestore.collection<Order>('orders').add(order);
    }

    getAll() {
        return this.firestore.collection('orders').snapshotChanges();
    }

    update(order: Order) {
        this.firestore.doc('orders/' + order.id).update(order);
    }

    delete(id: string) {
        this.firestore.doc('orders/' + id).delete();
    }
}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root'
})
export class CouponService {
    constructor(private firestore: AngularFirestore) { }

    create(coupon: Coupon) {
        return this.firestore.collection<Coupon>('coupons').add(coupon);
    }

    getAll() {
        return this.firestore.collection('coupons').snapshotChanges();
    }

    update(coupon: Coupon) {
        this.firestore.doc('coupons/' + coupon.id).update(coupon);
    }

    delete(id: string) {
        this.firestore.doc('coupons/' + id).delete();
    }
}

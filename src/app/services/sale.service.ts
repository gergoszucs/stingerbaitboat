import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root'
})
export class SaleService {
    public static saleId = 'UWWKqGVbsbNHClnrRoCc';

    constructor(private firestore: AngularFirestore) { }

    update(sale: Sale) {
        this.firestore.doc('sale/' + SaleService.saleId).update(sale);
    }

    get() {
        return this.firestore.doc<Sale>('sale/' + SaleService.saleId).valueChanges();
    }
}

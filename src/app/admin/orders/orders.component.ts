import { Component, OnInit } from '@angular/core';
import { OrderService } from 'app/services/order.service';
import { IDatePickerConfig } from 'ng2-date-picker';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
    orders: Order[] = [];
    expandedOrder: string = "";
    orderToEdit?: Order;
    orderToCreate?: Order;
    isAdding = false;
    selectedDate: Date;
    config: IDatePickerConfig = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        monthFormat: 'YYYY-MMM',
        disableKeypress: false,
        showNearMonthDays: false
    };

    constructor(public orderService: OrderService) { }

    ngOnInit() {
        this.orderService.getAll().subscribe(data => {
            this.orders = data.map(e => {
                var fulfilledDate = (e.payload.doc.data() as any).fulfilledDate;
                var orderDate = (e.payload.doc.data() as any).orderDate;
                var warrantyDate = (e.payload.doc.data() as any).warrantyDate;

                return {
                    id: e.payload.doc.id,
                    ...e.payload.doc.data() as Order,
                    fulfilledDate: fulfilledDate ? new Date(fulfilledDate) : null,
                    orderDate: orderDate ? new Date(orderDate) : null,
                    warrantyDate: warrantyDate ? new Date(warrantyDate) : null
                };
            });
        });
    }

    list() {
        console.log(this.orders);
    }

    onEdit(order: Order) {
        this.orderToEdit = {
            ...order
        };
    }

    onCancel() {
        this.orderToEdit = undefined;
    }

    onSave() {
        if (this.orderToEdit.fulfilledDate)
            this.orderToEdit.fulfilledDate = this.orderToEdit.fulfilledDate.toString();
        if (this.orderToEdit.warrantyDate)
            this.orderToEdit.warrantyDate = this.orderToEdit.warrantyDate.toString();
        if (this.orderToEdit.orderDate)
            this.orderToEdit.orderDate = this.orderToEdit.orderDate.toString();
        this.orderService.update(this.orderToEdit);
        this.orderToEdit = undefined;
    }

    onDelete(id: string) {
        var shouldDelete = confirm("Biztosan törlöd?");
        if (shouldDelete) {
            this.orderService.delete(id);
            this.orderToEdit = undefined;
        }
    }

    onView(id: string) {
        this.expandedOrder === id ? this.expandedOrder = "" : this.expandedOrder = id;
    }

    onFulfill(order: Order) {
        this.orderToEdit = { ...order };
        this.orderToEdit.fulfilledDate = new Date();
        var tempDate = new Date();
        tempDate.setFullYear(this.orderToEdit.fulfilledDate.getFullYear() + 3)
        this.orderToEdit.warrantyDate = tempDate;
        this.onSave();
    }

    onCreate() {
        this.isAdding = true;
        this.orderToCreate = {
            boat: '',
            fulfilledDate: '',
            name: '',
            orderDate: new Date(),
            warrantyDate: ''
        };
    }

    onSaveNew() {
        this.orderToCreate = {
            boat: this.orderToCreate.boat,
            fulfilledDate: this.orderToCreate.fulfilledDate.toString(),
            name: this.orderToCreate.name,
            orderDate: this.orderToCreate.orderDate.toString(),
            warrantyDate: this.orderToCreate.warrantyDate.toString()
        }

        this.orderService.create(this.orderToCreate);
        this.orderToCreate = undefined;
    }

    findActive(orders: Order[]): Order[] {
        return orders.filter(o => o.fulfilledDate === null);
    }

    findFulfilled(orders: Order[]): Order[] {
        return orders.filter(o => o.fulfilledDate !== null);
    }

    onCancelNew() {
        this.orderToCreate = undefined;
    }

    parseName(event: any) {
        this.orderToEdit.name = event.target.value;
    }

    parseBoat(event: any) {
        this.orderToEdit.boat = event.target.value;
    }

    parseOrderDate(event: any) {
        this.orderToEdit.orderDate = event.$d;
    }

    parseNewName(event: any) {
        this.orderToCreate.name = event.target.value;
    }

    parseNewBoat(event: any) {
        this.orderToCreate.boat = event.target.value;
    }

    parseNewOrderDate(event: any) {
        this.orderToCreate.orderDate = event.$d;
    }

    parseNewFulfilledDate(event: any) {
        this.orderToCreate.fulfilledDate = event.$d;
    }

    parseNewWarrantyDate(event: any) {
        this.orderToCreate.warrantyDate = event.$d;
    }
}

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
    expandedWarrantyOrder: string = "";
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

    onViewWarr(id: string) {
        this.expandedWarrantyOrder === id ? this.expandedWarrantyOrder = "" : this.expandedWarrantyOrder = id;
    }

    onFulfill(order: Order) {
        this.orderToEdit = { ...order };

        if (!this.orderToEdit.fulfilledDate) {
            this.orderToEdit.fulfilledDate = new Date();
        }

        if (!this.orderToEdit.warrantyDate) {
            var tempDate = new Date();
            tempDate.setFullYear((this.orderToEdit.fulfilledDate as Date).getFullYear() + 2)
            this.orderToEdit.warrantyDate = tempDate;
        }

        this.onSave();
    }

    onCreate() {
        this.isAdding = true;
        this.orderToCreate = {
            address: '',
            autopilot: '',
            bag: false,
            battery: '',
            color: '',
            email: '',
            light: false,
            phone: '',
            price: 0,
            radar: '',
            seaweed: false,
            boat: '',
            fulfilledDate: '',
            name: '',
            orderDate: '',
            warrantyDate: ''
        };
    }

    onSaveNew() {
        this.orderToCreate = {
            address: this.orderToCreate.address,
            autopilot: this.orderToCreate.autopilot,
            bag: this.orderToCreate.bag,
            battery: this.orderToCreate.battery,
            color: this.orderToCreate.color,
            email: this.orderToCreate.email,
            light: this.orderToCreate.light,
            phone: this.orderToCreate.phone,
            price: this.orderToCreate.price,
            radar: this.orderToCreate.radar,
            seaweed: this.orderToCreate.seaweed,
            boat: this.orderToCreate.boat,
            fulfilledDate: this.orderToCreate.fulfilledDate.toString(),
            name: this.orderToCreate.name,
            orderDate: this.orderToCreate.orderDate.toString(),
            warrantyDate: this.orderToCreate.warrantyDate.toString(),
            warrantyFirst: this.orderToCreate.warrantyFirst ?? false,
            warrantySecond: this.orderToCreate.warrantySecond ?? false
        }

        this.orderService.create(this.orderToCreate);
        this.orderToCreate = undefined;
    }

    findActive(orders: Order[]): Order[] {
        return orders.filter(o => o.fulfilledDate === null)
            .sort((a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime());
    }

    findFulfilled(orders: Order[]): Order[] {
        return orders.filter(o => o.fulfilledDate !== null && this.isOrderIn2YearsOr3WithChecks(o))
            .sort((a, b) => new Date(a.fulfilledDate).getTime() - new Date(b.fulfilledDate).getTime());
    }

    findExpiredWarranty(orders: Order[]): Order[] {
        return orders.filter(o => o.fulfilledDate !== null && !this.isOrderIn2YearsOr3WithChecks(o))
            .sort((a, b) => new Date(a.fulfilledDate).getTime() - new Date(b.fulfilledDate).getTime());
    }

    isOrderIn2YearsOr3WithChecks(o: Order) {
        const twoYear = new Date();
        twoYear.setFullYear(twoYear.getFullYear() - 2);
        const threeYear = new Date();
        threeYear.setFullYear(threeYear.getFullYear() - 3);
        const fullGuarantee = !!o.warrantyFirst && !!o.warrantySecond && o.fulfilledDate > threeYear;
        return (o.fulfilledDate > twoYear || fullGuarantee);
    }

    findWarrantyIssues(orders: Order[]): Order[] {
        let currentDate = new Date();

        return orders.filter(o => {
            if (o.fulfilledDate === null) {
                return;
            }

            let oneYearLater = new Date(o.fulfilledDate);
            oneYearLater.setMonth(oneYearLater.getMonth() + 10);
            let twoYearLater = new Date(o.fulfilledDate);
            twoYearLater.setMonth(oneYearLater.getMonth() + 10);
            let firstYearOff = (currentDate >= oneYearLater && !o.warrantyFirst);
            let secondYearOff = (currentDate >= twoYearLater && !o.warrantySecond);
            return firstYearOff || secondYearOff;
        }).sort((a, b) => new Date(a.fulfilledDate).getTime() - new Date(b.fulfilledDate).getTime());
    }

    firstYearWarrantyExpired(order: Order): boolean {
        let currentDate = new Date();
        let oneYearLater = new Date(order.fulfilledDate);
        oneYearLater.setMonth(oneYearLater.getMonth() + 10);
        let firstYearOff = (currentDate > oneYearLater && !order.warrantyFirst);
        return firstYearOff;
    }

    secondYearWarrantyExpired(order: Order): boolean {
        let currentDate = new Date();
        let twoYearLater = new Date(order.fulfilledDate);
        twoYearLater.setFullYear(twoYearLater.getFullYear() + 1);
        twoYearLater.setMonth(twoYearLater.getMonth() + 10);
        let secondYearOff = (currentDate > twoYearLater && !order.warrantySecond);
        return secondYearOff;
    }

    onFirstWarrantyOk(order: Order): void {
        order.warrantyFirst = true;
        if (order.fulfilledDate)
            order.fulfilledDate = order.fulfilledDate.toString();
        if (order.warrantyDate)
            order.warrantyDate = order.warrantyDate.toString();
        if (order.orderDate)
            order.orderDate = order.orderDate.toString();
        this.orderService.update(order);
    }

    onSecondWarrantyOk(order: Order): void {
        order.warrantySecond = true;
        if (order.fulfilledDate)
            order.fulfilledDate = order.fulfilledDate.toString();
        if (order.warrantyDate) {
            const dateCopy = new Date(order.warrantyDate);
            dateCopy.setFullYear(dateCopy.getFullYear() + 1);
            order.warrantyDate = dateCopy.toString();
        }
        if (order.orderDate)
            order.orderDate = order.orderDate.toString();
        this.orderService.update(order);
    }

    onCancelNew() {
        this.orderToCreate = undefined;
    }

    parseName(event: any) {
        this.orderToEdit.name = event.target.value;
    }

    parsePhone(event: any) {
        this.orderToEdit.phone = event.target.value;
    }

    parseEmail(event: any) {
        this.orderToEdit.email = event.target.value;
    }

    parseAddress(event: any) {
        this.orderToEdit.address = event.target.value;
    }

    parseBoat(event: any) {
        this.orderToEdit.boat = event.target.value;
    }

    parsePrice(event: any) {
        this.orderToEdit.price = event.target.value;
    }

    parseColor(event: any) {
        this.orderToEdit.color = event.target.value;
    }

    parseRadar(event: any) {
        this.orderToEdit.radar = event.target.value;
    }

    parseAutopilot(event: any) {
        this.orderToEdit.autopilot = event.target.value;
    }

    parseBattery(event: any) {
        this.orderToEdit.battery = event.target.value;
    }

    parseSeaweed(event: any) {
        this.orderToEdit.seaweed = event.target.checked;
    }

    parseBag(event: any) {
        this.orderToEdit.bag = event.target.checked;
    }

    parseLight(event: any) {
        this.orderToEdit.light = event.target.checked;
    }

    parseOrderDate(event: any) {
        this.orderToEdit.orderDate = event.$d;
    }

    parseFulfilledDate(event: any) {
        this.orderToEdit.fulfilledDate = event.$d;
    }

    parseWarrantyDate(event: any) {
        this.orderToEdit.warrantyDate = event.$d;
    }

    parseFirstWarranty(event: any) {
        this.orderToEdit.warrantyFirst = event.target.checked;
    }

    parseSecondWarranty(event: any) {
        this.orderToEdit.warrantySecond = event.target.checked;
    }

    parseNewName(event: any) {
        this.orderToCreate.name = event.target.value;
    }

    parseNewPhone(event: any) {
        this.orderToCreate.phone = event.target.value;
    }

    parseNewEmail(event: any) {
        this.orderToCreate.email = event.target.value;
    }

    parseNewAddress(event: any) {
        this.orderToCreate.address = event.target.value;
    }

    parseNewBoat(event: any) {
        this.orderToCreate.boat = event.target.value;
    }

    parseNewPrice(event: any) {
        this.orderToCreate.price = event.target.value;
    }

    parseNewColor(event: any) {
        this.orderToCreate.color = event.target.value;
    }

    parseNewRadar(event: any) {
        this.orderToCreate.radar = event.target.value;
    }

    parseNewAutopilot(event: any) {
        this.orderToCreate.autopilot = event.target.value;
    }

    parseNewBattery(event: any) {
        this.orderToCreate.battery = event.target.value;
    }

    parseNewSeaweed(event: any) {
        this.orderToCreate.seaweed = event.target.checked;
    }

    parseNewBag(event: any) {
        this.orderToCreate.bag = event.target.checked;
    }

    parseNewLight(event: any) {
        this.orderToCreate.light = event.target.checked;
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

    parseNewFirstWarranty(event: any) {
        this.orderToCreate.warrantyFirst = event.target.checked;
    }

    parseNewSecondWarranty(event: any) {
        this.orderToCreate.warrantySecond = event.target.checked;
    }

    // getCompletedWarrantyDate(order: Order) {
    //     if (order.warrantyDate) {
    //         return order.warrantyDate;
    //     }

    //     var tempDate = new Date(order.fulfilledDate);
    //     tempDate.setFullYear((order.fulfilledDate as Date).getFullYear() + 3)
    //     return tempDate;
    // }
}

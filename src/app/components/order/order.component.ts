import { Component, OnInit } from '@angular/core';
import { CouponService } from 'app/services/coupon.service';
import { InventoryService } from 'app/services/inventory.service';
import { MailService } from 'app/services/mail.service';
import { OrderService } from 'app/services/order.service';
import { SaleService } from 'app/services/sale.service';

@Component({
	selector: 'app-order',
	templateUrl: './order.component.html',
	styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit {
	inventoryItems: InventoryItem[] = [];
	coupons: Coupon[] = [];
	sale: Sale;

	boat: Item = {
		name: "Beluga Basic",
		price: 260000
	};

	color: Item = {
		name: "Fehér",
		price: 0
	};

	radar: Item = {
		name: "Nem kérem",
		price: 0
	};

	autopilot: Item = {
		name: "Nem kérem",
		price: 0
	};

	battery: Item = {
		name: "Nem kérem",
		price: 0
	};

	bag: Item = {
		name: "Hajó és távírányító táska",
		price: 30000
	}
	bagChecked = false;

	light: Item = {
		name: "Reflektor",
		price: 20000
	}
	lightChecked = false;

	seaweed: Item = {
		name: "Hínárvédő",
		price: 15000
	}
	seaweedChecked = false;

	totalPrice: number;
	discountedPrice = 0;
	name: string;
	phone: string;
	email: string;
	address: string;
	canSubmitOrder = false;
	showSubmitError = false;
	orderProcessed = false;
	isGlobalSale = false;
	discount: number;
	coupon: Coupon;
	couponName: string;
	couponMessage: string;

	constructor(private mailService: MailService, private orderService: OrderService, private inventoryService: InventoryService,
		private saleService: SaleService, public couponService: CouponService) {
		this.totalPrice = this.boat.price + this.color.price + this.radar.price + this.autopilot.price
			+ this.battery.price;
	}

	ngOnInit() {
		this.inventoryService.getAll().subscribe(data => {
			this.inventoryItems = data.map(e => {
				return {
					id: e.payload.doc.id,
					...e.payload.doc.data() as InventoryItem
				};
			});
		});

		this.saleService.get().subscribe(sale => {
			this.sale = sale;
			this.isGlobalSale = this.sale && this.sale.isEnabled && this.sale.discount > 0;

			if (this.isGlobalSale) {
				this.discount = this.sale.discount;
				this.discountedPrice = this.totalPrice * ((100 - this.sale.discount) / 100);
			}
		});

		this.couponService.getAll().subscribe(data => {
			this.coupons = data.map(e => {
				return {
					id: e.payload.doc.id,
					...e.payload.doc.data() as Coupon
				};
			});
		});
	}

	recalculateTotalPrice() {
		this.totalPrice = this.boat.price + this.color.price + this.radar.price + this.autopilot.price
			+ this.battery.price;

		if (this.bagChecked) {
			this.totalPrice += this.bag.price;
		}

		if (this.lightChecked) {
			this.totalPrice += this.light.price;
		}

		if (this.seaweedChecked) {
			this.totalPrice += this.seaweed.price;
		}

		if (this.isGlobalSale) {
			this.discountedPrice = this.totalPrice * ((100 - this.sale.discount) / 100);
		} else if (this.coupon) {
			this.discountedPrice = this.totalPrice * ((100 - this.coupon.discount) / 100);
		}
	}

	onBoatChange(event) {
		this.boat = {
			name: event.target.id,
			price: +event.target.value
		}

		this.recalculateTotalPrice();
	}

	onColorChange(event) {
		this.color = {
			name: event.target.id,
			price: +event.target.value
		}

		this.recalculateTotalPrice();
	}

	onRadarChange(event) {
		this.radar = {
			name: event.target.id,
			price: +event.target.value
		}

		this.recalculateTotalPrice();
	}

	onAutopilotChange(event) {
		this.autopilot = {
			name: event.target.id,
			price: +event.target.value
		}

		this.recalculateTotalPrice();
	}

	onBatteryChange(event) {
		this.battery = {
			name: event.target.id,
			price: +event.target.value
		}

		this.recalculateTotalPrice();
	}

	parseCoupon(event: any) {
		this.couponName = event.target.value;
	}

	onCouponSubmitted() {
		this.coupon = this.coupons.find(c => c.name === this.couponName);

		if (!!this.coupon) {
			this.discount = this.coupon.discount;
			this.couponMessage = this.coupon.discount + "% kedvezmény érvényesítve";
			this.recalculateTotalPrice();
		} else {
			this.couponMessage = "Érvénytelen kupon kód";
		}
	}

	toggleBag() {
		this.bagChecked = !this.bagChecked;
		this.recalculateTotalPrice();
	}

	toggleLight() {
		this.lightChecked = !this.lightChecked;
		this.recalculateTotalPrice();
	}

	toggleSeaweed() {
		this.seaweedChecked = !this.seaweedChecked;
		this.recalculateTotalPrice();
	}

	nameUpdated(event) {
		this.name = event.target.value;
		this.checkIfCanSubmitOrder();
	}

	emailUpdated(event) {
		this.email = event.target.value;
		this.checkIfCanSubmitOrder();
	}

	addressUpdated(event) {
		this.address = event.target.value;
		this.checkIfCanSubmitOrder();
	}

	phoneUpdated(event) {
		this.phone = event.target.value;
		this.checkIfCanSubmitOrder();
	}

	order() {
		if (!this.canSubmitOrder) {
			this.showSubmitError = true;
			return;
		}

		var order = {
			address: this.address,
			autopilot: this.autopilot.name,
			bag: this.bagChecked,
			battery: this.battery.name,
			boat: this.boat.name,
			color: this.color.name,
			email: this.email,
			light: this.lightChecked,
			name: this.name,
			phone: this.phone,
			price: this.discountedPrice > 0 ? this.discountedPrice : this.totalPrice,
			radar: this.radar.name,
			seaweed: this.seaweedChecked,
			fulfilledDate: '',
			orderDate: new Date().toString(),
			warrantyDate: '',
			coupon: this.coupon ? this.coupon.name : this.sale ? this.sale.text : '',
			discount: this.discount ? this.discount : 0
		};

		this.mailService.sendOrderConfirmation(order).finally(() => {
			this.orderProcessed = true;
			this.updateInventoryOnPurchase(order);
			this.mailService.sendOrderPlacedNotification(order);
			this.orderService.create(order);
		})
	}

	private checkIfCanSubmitOrder() {
		this.canSubmitOrder = !!this.name && !!this.email && !!this.address && !!this.phone;
	}

	private updateInventoryOnPurchase(order: Order) {
		let lowCountItems: InventoryItem[] = [];

		this.inventoryItems.forEach(inventoryItem => {
			if (inventoryItem.belugaReq > 0) {
				this.updateItem(inventoryItem.name, inventoryItem.belugaReq, lowCountItems);
			}
		});

		// Optional parts
		if (order.boat.includes("Basic")) {
			this.updateItem("200W", 1, lowCountItems);
			this.updateItem("5000", 1, lowCountItems);
			this.updateItem("Szabályzó kefés", 1, lowCountItems);
		}
		if (order.boat.includes("Medium")) {
			this.updateItem("1600W", 1, lowCountItems);
			this.updateItem("5000", 1, lowCountItems);
			this.updateItem("80A BL", 1, lowCountItems);
		}
		if (order.boat.includes("Max")) {
			this.updateItem("2000W", 1, lowCountItems);
			this.updateItem("8000", 1, lowCountItems);
			this.updateItem("120A BL", 1, lowCountItems);
		}

		if (order.seaweed) {
			this.updateItem("Hínárvédő", 2, lowCountItems);
		}
		if (order.bag) {
			this.updateItem("táska", 1, lowCountItems);
		}
		if (order.light) {
			this.updateItem("Reflektor", 1, lowCountItems);
		}

		if (order.battery.includes("5000")) {
			this.updateItem("5000", 1, lowCountItems);
		}
		if (order.battery.includes("6200")) {
			this.updateItem("6200", 1, lowCountItems);
		}
		if (order.battery.includes("8000")) {
			this.updateItem("8000", 1, lowCountItems);
		}

		if (lowCountItems.length > 0) {
			this.mailService.sendInventoryThresholdReached(lowCountItems);
		}
	}

	private updateItem(name: string, required: number, lowCountItems: InventoryItem[]) {
		const matchingItem = this.inventoryItems.find(i => i.name.includes(name));
		if (matchingItem) {
			matchingItem.count -= required;

			if (matchingItem.count < matchingItem.threshold) {
				lowCountItems.push(matchingItem);
			}

			this.inventoryService.update(matchingItem);
		}
	}
}

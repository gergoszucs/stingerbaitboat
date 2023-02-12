import { Component, OnInit } from '@angular/core';
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
	sale: Sale;

	boat: Item = {
		name: "Beluga Basic",
		price: 250000
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
		price: 15000
	}
	lightChecked = false;

	seaweed: Item = {
		name: "Hínárvédő",
		price: 7000
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
	isSale = false;

	constructor(private mailService: MailService, private orderService: OrderService, private inventoryService: InventoryService, private saleService: SaleService) {
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
			this.isSale = this.sale && this.sale.isEnabled && this.sale.discount > 0;

			if (this.isSale) {
				this.discountedPrice = this.totalPrice * ((100 - this.sale.discount) / 100);
			}
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

		if (this.isSale) {
			this.discountedPrice = this.totalPrice * ((100 - this.sale.discount) / 100);
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
			warrantyDate: ''
		};

		this.mailService.sendMail(order).finally(() => {
			this.orderProcessed = true;
			this.updateInventoryOnPurchase(order);
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
		}
		if (order.boat.includes("Medium")) {
			this.updateItem("1600W", 1, lowCountItems);
		}
		if (order.boat.includes("Max")) {
			this.updateItem("2000W", 1, lowCountItems);
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
		if (order.battery.includes("9500")) {
			this.updateItem("9500", 1, lowCountItems);
		}

		if (lowCountItems.length > 0) {
			this.mailService.inventoryThresholdReached(lowCountItems);
		}

		// this.inventoryService.getBoatParts().subscribe(data => {
		// 	let parts = data.map(e => {
		// 		return {
		// 			id: e.payload.doc.id,
		// 			parts: [e.payload.doc.data()]
		// 		};
		// 	});

		// 	let boat = parts.find(p => p.id === boatType)

		// 	if (!boat) {
		// 		return;
		// 	}

		// 	let itemMap = boat.parts[0] as any;

		// 	// Fix parts
		// 	for (const item in itemMap) {
		// 		this.updateItem(item, itemMap[item], lowCountItems);
		// 	}
		// });
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

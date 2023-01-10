import { Component, OnInit } from '@angular/core';
import { MailService } from 'app/services/mail.service';

@Component({
	selector: 'app-order',
	templateUrl: './order.component.html',
	styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit {
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
	bagChecked: boolean;

	light: Item = {
		name: "Reflektor",
		price: 15000
	}
	lightChecked: boolean;

	seaweed: Item = {
		name: "Hínárvédő",
		price: 7000
	}
	seaweedChecked: boolean;

	totalPrice: number;
	name: string;
	phone: string;
	email: string;
	address: string;
	canSubmitOrder = false;
	showSubmitError = false;
	orderProcessed = false;

	constructor(private mailService: MailService) {
		this.totalPrice = this.boat.price + this.color.price + this.radar.price + this.autopilot.price
			+ this.battery.price;
	}

	ngOnInit() { }

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

		this.mailService.sendMail(
			{
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
				price: this.totalPrice,
				radar: this.radar.name,
				seaweed: this.seaweedChecked,
				fulfilledDate: '',
				orderDate: new Date().toString(),
				warrantyDate: ''
			}
		).finally(() => {
			this.orderProcessed = true;
		})
	}

	private checkIfCanSubmitOrder() {
		this.canSubmitOrder = !!this.name && !!this.email && !!this.address && !!this.phone;
	}
}

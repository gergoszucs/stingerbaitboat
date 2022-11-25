import { Component, OnInit } from '@angular/core';

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
		name: "Nem kérek",
		price: 0
	};

	autopilot: Item = {
		name: "Nem kérek",
		price: 0
	};

	battery: Item = {
		name: "Nem kérek",
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

	constructor() {
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
}

import { Component, OnInit } from '@angular/core';
import { CouponService } from 'app/services/coupon.service';

@Component({
	selector: 'app-coupon',
	templateUrl: './coupon.component.html',
	styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {
	items: Coupon[] = [];
	itemToEdit?: Coupon;
	itemToCreate?: Coupon;
	isAdding = false;

	constructor(public couponService: CouponService) { }

	ngOnInit() {
		this.couponService.getAll().subscribe(data => {
			this.items = data.map(e => {
				return {
					id: e.payload.doc.id,
					...e.payload.doc.data() as Coupon
				};
			});
		});
	}

	sortBy(prop: string) {
		return this.items.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
	}

	isBeingEdited(id: string) {
		return id === this.itemToEdit?.id;
	}

	onEdit(item: Coupon) {
		this.itemToEdit = { ...item };
	}

	onCancel() {
		this.itemToEdit = undefined;
	}

	onSave() {
		this.couponService.update(this.itemToEdit);
		this.itemToEdit = undefined;
	}

	onDelete(id: string) {
		var shouldDelete = confirm("Biztosan törlöd?");
		if (shouldDelete) {
			this.couponService.delete(id);
			this.itemToEdit = undefined;
		}
	}

	onCreate() {
		this.isAdding = true;
		this.itemToCreate = {
			name: '',
			discount: 0
		};
	}

	onSaveNew() {
		this.itemToCreate = {
			name: this.itemToCreate.name,
			discount: this.itemToCreate.discount
		}

		this.couponService.create(this.itemToCreate);
	}

	onCancelNew() {
		this.itemToCreate = undefined;
	}

	parseName(event: any) {
		this.itemToEdit.name = event.target.value;
	}

	parseDiscount(event: any) {
		this.itemToEdit.discount = event.target.value;
	}

	parseNewName(event: any) {
		this.itemToCreate.name = event.target.value;
	}

	parseNewDiscount(event: any) {
		this.itemToCreate.discount = event.target.value;
	}
}

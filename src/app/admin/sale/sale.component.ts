import { Component, OnInit } from '@angular/core';
import { SaleService } from 'app/services/sale.service';

@Component({
	selector: 'app-sale',
	templateUrl: './sale.component.html',
	styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {
	sale: Sale;
	saleToUpdate: Sale;
	isEditing = false;

	constructor(private saleService: SaleService) { }

	ngOnInit() {
		this.saleService.get().subscribe(sale => {
			this.sale = sale;
		});
	}

	onEdit() {
		this.isEditing = true;
		this.saleToUpdate = {
			id: SaleService.saleId,
			isEnabled: this.sale.isEnabled,
			text: this.sale.text,
			discount: this.sale.discount
		}
	}

	onCancel() {
		this.isEditing = false;
	}

	parseDiscount(event: any) {
		this.saleToUpdate.discount = event.target.value;
	}

	parseText(event: any) {
		this.saleToUpdate.text = event.target.value;
	}

	parseEnabled(event: any) {
		this.saleToUpdate.isEnabled = event.target.checked;
	}

	onSave() {
		this.saleService.update(this.saleToUpdate);
		this.isEditing = false;
	}
}

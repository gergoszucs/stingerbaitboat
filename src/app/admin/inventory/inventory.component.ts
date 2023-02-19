import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'app/services/inventory.service';

@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
    items: InventoryItem[] = [];
    itemToEdit?: InventoryItem;
    itemToCreate?: InventoryItem;
    isAdding = false;

    constructor(public inventoryService: InventoryService) { }

    ngOnInit() {
        this.inventoryService.getAll().subscribe(data => {
            this.items = data.map(e => {
                return {
                    id: e.payload.doc.id,
                    ...e.payload.doc.data() as InventoryItem
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

    onEdit(item: InventoryItem) {
        this.itemToEdit = { ...item };
    }

    onCancel() {
        this.itemToEdit = undefined;
    }

    onSave() {
        this.inventoryService.update(this.itemToEdit);
        this.itemToEdit = undefined;
    }

    onDelete(id: string) {
        var shouldDelete = confirm("Biztosan törlöd?");
        if (shouldDelete) {
            this.inventoryService.delete(id);
            this.itemToEdit = undefined;
        }
    }

    onCreate() {
        this.isAdding = true;
        this.itemToCreate = {
            name: '',
            belugaReq: 0,
            count: 0,
            threshold: 0
        };
    }

    onSaveNew() {
        this.itemToCreate = {
            name: this.itemToCreate.name,
            belugaReq: this.itemToCreate.belugaReq,
            count: this.itemToCreate.count,
            threshold: this.itemToCreate.threshold
        }

        this.inventoryService.create(this.itemToCreate);
    }

    onCancelNew() {
        this.itemToCreate = undefined;
    }

    parseBelugaCount(event: any) {
        this.itemToEdit.belugaReq = event.target.value;
    }

    parseCount(event: any) {
        this.itemToEdit.count = event.target.value;
    }

    parseThreshold(event: any) {
        this.itemToEdit.threshold = event.target.value;
    }

    parseNewName(event: any) {
        this.itemToCreate.name = event.target.value;
    }

    parseNewBelugaCount(event: any) {
        this.itemToCreate.belugaReq = event.target.value;
    }

    parseNewCount(event: any) {
        this.itemToCreate.count = event.target.value;
    }

    parseNewThreshold(event: any) {
        this.itemToCreate.threshold = event.target.value;
    }
}

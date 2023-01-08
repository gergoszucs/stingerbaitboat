import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin.component';
import { OrdersComponent } from './orders/orders.component';
import { InventoryComponent } from './inventory/inventory.component';
import { DpDatePickerModule } from 'ng2-date-picker';

const routes: Routes = [
    { path: '', component: LoginComponent }
];

@NgModule({
    declarations: [
        LoginComponent,
        AdminComponent,
        OrdersComponent,
        InventoryComponent
    ],
    imports: [
        HttpClientModule,
        CommonModule,
        NgbModule,
        RouterModule.forChild(routes),
        DpDatePickerModule
    ]
})
export class AdminModule { }

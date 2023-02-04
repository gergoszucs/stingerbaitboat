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
import { AdminPhotoComponent } from './adminphoto/adminphoto.component';
import { AdminVideoComponent } from './adminvideo/adminvideo.component';
import { YouTubePlayerModule } from '@angular/youtube-player';

const routes: Routes = [
    { path: '', component: LoginComponent }
];

@NgModule({
    declarations: [
        LoginComponent,
        AdminComponent,
        OrdersComponent,
        AdminPhotoComponent,
        AdminVideoComponent,
        InventoryComponent
    ],
    imports: [
        HttpClientModule,
        CommonModule,
        NgbModule,
        RouterModule.forChild(routes),
        DpDatePickerModule,
        YouTubePlayerModule
    ]
})
export class AdminModule { }

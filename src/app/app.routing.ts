import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { ComponentsComponent } from './components/components.component';
import { PrivacyComponent } from "./components/privacy/privacy.component";
import { OrderComponent } from "./components/order/order.component";
import { OrdersComponent } from './admin/orders/orders.component';
import { InventoryComponent } from './admin/inventory/inventory.component';
import { AuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth.service';
import { PhotoComponent } from './components/photo/photo.component';
import { AdminPhotoComponent } from './admin/adminphoto/adminphoto.component';
import { AdminVideoComponent } from './admin/adminvideo/adminvideo.component';
import { VideoComponent } from './components/video/video.component';

const routes: Routes = [
	{ path: '', redirectTo: 'index', pathMatch: 'full' },
	{ path: 'index', component: ComponentsComponent },
	{ path: 'adatkezeles', component: PrivacyComponent },
	{ path: 'rendeles', component: OrderComponent },
	{ path: 'kepek', component: PhotoComponent },
	{ path: 'videok', component: VideoComponent },
	{ path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
	{ path: 'admin/rendelesek', component: OrdersComponent, canActivate: [AuthGuard] },
	{ path: 'admin/keszlet', component: InventoryComponent, canActivate: [AuthGuard] },
	{ path: 'admin/kepek', component: AdminPhotoComponent, canActivate: [AuthGuard] },
	{ path: 'admin/videok', component: AdminVideoComponent, canActivate: [AuthGuard] }
];

@NgModule({
	imports: [
		CommonModule,
		BrowserModule,
		RouterModule.forRoot(routes, {
			scrollPositionRestoration: 'enabled'
		})
	],
	providers: [AuthService, AuthGuard],
	exports: [
	],
})
export class AppRoutingModule { }

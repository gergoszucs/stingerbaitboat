import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { ComponentsComponent } from './components/components.component';
import { PrivacyComponent } from "./components/privacy/privacy.component";
import { OrderComponent } from "./components/order/order.component";

const routes: Routes = [
	{ path: '', redirectTo: 'index', pathMatch: 'full' },
	{ path: 'index', component: ComponentsComponent },
	{ path: 'adatkezeles', component: PrivacyComponent },
	{ path: 'rendelés', component: OrderComponent }
];

@NgModule({
	imports: [
		CommonModule,
		BrowserModule,
		RouterModule.forRoot(routes, {
			useHash: true,
			scrollPositionRestoration: 'enabled'
		})
	],
	exports: [
	],
})
export class AppRoutingModule { }

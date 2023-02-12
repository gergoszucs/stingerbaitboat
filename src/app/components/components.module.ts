import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';
import { RouterModule } from '@angular/router';

import { BasicelementsComponent } from './basicelements/basicelements.component';
import { ComponentsComponent } from './components.component';
import { OrderComponent } from "./order/order.component";
import { PrivacyComponent } from "./privacy/privacy.component";
import { YouTubePlayerModule } from '@angular/youtube-player';
import { PhotoComponent } from './photo/photo.component';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import { VideoComponent } from './video/video.component';
import { RadarComponent } from './radar/radar.component';
import { BasicComponent } from './basic/basic.component';
import { MediumComponent } from './medium/medium.component';
import { MaxComponent } from './max/max.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		NgbModule,
		NouisliderModule,
		RouterModule,
		YouTubePlayerModule,
		JwBootstrapSwitchNg2Module,
		NgImageFullscreenViewModule
	],
	declarations: [
		ComponentsComponent,
		BasicelementsComponent,
		OrderComponent,
		PrivacyComponent,
		PhotoComponent,
		VideoComponent,
		RadarComponent,
		BasicComponent,
		MediumComponent,
		MaxComponent
	],
	exports: [ComponentsComponent]
})
export class ComponentsModule { }

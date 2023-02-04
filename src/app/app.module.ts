import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";

import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

import { ComponentsModule } from './components/components.module';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { AngularFireModule } from '@angular/fire/compat';
import { DpDatePickerModule } from 'ng2-date-picker';
import { DatePipe, DecimalPipe } from '@angular/common';


@NgModule({
	declarations: [
		AppComponent,
		NavbarComponent,
		FooterComponent
	],
	imports: [
		BrowserModule,
		NgbModule,
		FormsModule,
		RouterModule,
		ComponentsModule,
		AppRoutingModule,
		YouTubePlayerModule,
		ScrollToModule.forRoot(),
		AngularFireModule.initializeApp(environment.firebase, 'stinger'),
		AngularFirestoreModule,
		DpDatePickerModule
	],
	providers: [DecimalPipe, DatePipe],
	bootstrap: [AppComponent]
})
export class AppModule { }

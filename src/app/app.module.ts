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
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';


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
		ScrollToModule.forRoot(),
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideDatabase(() => getDatabase()),
  provideFirestore(() => getFirestore())
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }

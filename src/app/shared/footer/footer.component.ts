import { Component } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
	test: Date = new Date();
	isRules: boolean;

	constructor(router: Router) {
		router.events.filter(event => event instanceof NavigationEnd)
			.subscribe(event => {
				this.isRules = (event as NavigationEnd).url.includes('adatkezeles');
			});
	}
}

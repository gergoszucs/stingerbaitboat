import { Component } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { ScrollToService } from "@nicky-lenaers/ngx-scroll-to";

@Component({
	selector: 'app-basicelements',
	templateUrl: './basicelements.component.html',
	styleUrls: ['./basicelements.component.scss']
})
export class BasicelementsComponent {
	fragment: string;

	constructor(router: Router, scrollToService: ScrollToService) {
		router.events.filter(event => event instanceof NavigationEnd)
			.subscribe(event => {
				const url = (event as NavigationEnd).url;
				if (url.includes('#')) {
					this.fragment = url.substring(url.indexOf('#'), url.length);
					scrollToService.scrollTo({
						target: this.fragment
					});
				}
			});
	}
}

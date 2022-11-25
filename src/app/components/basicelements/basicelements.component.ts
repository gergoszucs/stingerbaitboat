import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { ScrollToService } from "@nicky-lenaers/ngx-scroll-to";

let apiLoaded = false;

@Component({
	selector: 'app-basicelements',
	templateUrl: './basicelements.component.html',
	styleUrls: ['./basicelements.component.scss']
})
export class BasicelementsComponent implements OnInit {
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

	ngOnInit () {
		if (!apiLoaded) {
			// This code loads the IFrame Player API code asynchronously, according to the instructions at
			// https://developers.google.com/youtube/iframe_api_reference#Getting_Started
			const tag = document.createElement('script');
			tag.src = 'https://www.youtube.com/iframe_api';
			document.body.appendChild(tag);
			apiLoaded = true;
		}
	}
}

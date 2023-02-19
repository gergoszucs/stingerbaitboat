import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ScrollToService } from "@nicky-lenaers/ngx-scroll-to";
import { NewsService } from 'app/services/news.service';

let apiLoaded = false;

@Component({
	selector: 'app-basicelements',
	templateUrl: './basicelements.component.html',
	styleUrls: ['./basicelements.component.scss']
})
export class BasicelementsComponent implements OnInit {
	fragment: string;
	screenWidth = 640;
	screenHeight = 390;
	news: News = null;

	constructor(router: Router, scrollToService: ScrollToService, config: NgbCarouselConfig, private newsService: NewsService) {
		router.events.filter(event => event instanceof NavigationEnd)
			.subscribe(event => {
				const url = (event as NavigationEnd).url;
				if (url.includes('#')) {
					this.fragment = url.substring(url.indexOf('#'), url.length);
					scrollToService.scrollTo({
						target: this.fragment,
						easing: 'easeOutElastic',
						duration: 150
					});
				}
			});


		config.interval = 3000;
		config.animation = true;
		config.showNavigationArrows = true;
		config.pauseOnHover = false;
		config.pauseOnFocus = false;

		let originalWidth = this.screenWidth;

		if (window.innerWidth < this.screenWidth) {
			this.screenWidth = window.innerWidth * 0.9;

			let widthChange = this.screenWidth / originalWidth;
			this.screenHeight *= widthChange;
		}
	}

	ngOnInit() {
		if (!apiLoaded) {
			// This code loads the IFrame Player API code asynchronously, according to the instructions at
			// https://developers.google.com/youtube/iframe_api_reference#Getting_Started
			const tag = document.createElement('script');
			tag.src = 'https://www.youtube.com/iframe_api';
			document.body.appendChild(tag);
			apiLoaded = true;
		}

		this.newsService.get().subscribe(news => {
			this.news = news;
		});
	}

	getFullUrl(id: string) {
		return `https://drive.google.com/uc?id=${id}`;
	}
}

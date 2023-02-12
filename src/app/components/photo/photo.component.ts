import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { PhotoService } from 'app/services/photo.service';

@Component({
	selector: 'app-photo',
	templateUrl: './photo.component.html',
	styleUrls: ['./photo.component.scss']
})

export class PhotoComponent implements OnInit {
	photos: Photo[] = [];
	images: Array<object> = [];
	showFlag: boolean = false;
	selectedImageIndex: number = -1;
	currentIndex = 0;

	constructor(private photoService: PhotoService, config: NgbCarouselConfig) {
		config.interval = 3000;
		config.animation = true;
		config.showNavigationArrows = true;
		config.pauseOnHover = false;
		config.pauseOnFocus = false;
	}

	ngOnInit() {
		this.photoService.getAll().subscribe(data => {
			this.photos = data.map(e => {
				return {
					id: e.payload.doc.id,
					...e.payload.doc.data() as Photo
				};
			});

			this.photos.forEach(photo => {
				this.images.push({
					image: this.getFullUrl(photo.url),
					alt: photo.title,
					title: photo.title
				})
			});
		});
	}

	showLightbox(index) {
		this.selectedImageIndex = index;
		this.showFlag = true;
	}

	closeEventHandler() {
		this.showFlag = false;
		this.currentIndex = -1;
	}

	getFullUrl(id: string) {
		return `https://drive.google.com/uc?id=${id}`;
	}
}

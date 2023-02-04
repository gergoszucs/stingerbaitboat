import { Component, OnInit } from '@angular/core';
import { VideoService } from 'app/services/video.service';

let apiLoaded = false;

@Component({
	selector: 'app-video',
	templateUrl: './video.component.html',
	styleUrls: ['./video.component.scss']
})

export class VideoComponent implements OnInit {
	videos: Video[] = [];
	screenWidth = 640;
	screenHeight = 390;

	constructor(private videoService: VideoService) {
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

		this.videoService.getAll().subscribe(data => {
			this.videos = data.map(e => {
				return {
					id: e.payload.doc.id,
					...e.payload.doc.data() as Video
				};
			});
		});
	}
}

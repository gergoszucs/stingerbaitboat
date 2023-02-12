import { Component, OnInit } from '@angular/core';
import { VideoService } from 'app/services/video.service';

let apiLoaded = false;

@Component({
	selector: 'app-adminvideo',
	templateUrl: './adminvideo.component.html',
	styleUrls: ['./adminvideo.component.scss']
})
export class AdminVideoComponent implements OnInit {
	videos: Video[] = [];
	videoToCreate?: Video;
	isAdding = false;
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

	onCreate() {
		this.isAdding = true;
		this.videoToCreate = {
			url: '',
			title: null
		};
	}

	parseVideo(event: any) {
		this.videoToCreate.url = event.target.value;
	}

	parseTitle(event: any) {
		this.videoToCreate.title = event.target.value;
	}

	onSaveNew() {
		this.videoService.create(this.videoToCreate);
	}

	onCancelNew() {
		this.videoToCreate = undefined;
	}

	onDelete(id: string) {
		var shouldDelete = confirm("Biztosan törlöd?");
		if (shouldDelete) {
			this.videoService.delete(id);
		}
	}
}

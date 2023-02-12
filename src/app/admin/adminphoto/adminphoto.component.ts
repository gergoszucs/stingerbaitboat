import { Component, OnInit } from '@angular/core';
import { PhotoService } from 'app/services/photo.service';

@Component({
	selector: 'app-adminphoto',
	templateUrl: './adminphoto.component.html',
	styleUrls: ['./adminphoto.component.scss']
})

export class AdminPhotoComponent implements OnInit {
	photos: Photo[] = [];
	photoToCreate?: Photo;
	isAdding = false;

	constructor(private photoService: PhotoService) { }

	ngOnInit() {
		this.photoService.getAll().subscribe(data => {
			this.photos = data.map(e => {
				return {
					id: e.payload.doc.id,
					...e.payload.doc.data() as Photo
				};
			});
		});
	}

	onCreate() {
		this.isAdding = true;
		this.photoToCreate = {
			url: '',
			title: null
		};
	}

	parsePhoto(event: any) {
		let url: string = event.target.value;
		this.photoToCreate.url = url.substring(url.indexOf("/d/") + 3, url.indexOf("/view"));
	}

	parseTitle(event: any) {
		this.photoToCreate.title = event.target.value;
	}

	onSaveNew() {
		this.photoService.create(this.photoToCreate);
	}

	onCancelNew() {
		this.photoToCreate = undefined;
	}

	getFullUrl(id: string) {
		return `https://drive.google.com/uc?id=${id}`;
	}

	onDelete(id: string) {
		var shouldDelete = confirm("Biztosan törlöd?");
		if (shouldDelete) {
			this.photoService.delete(id);
		}
	}
}

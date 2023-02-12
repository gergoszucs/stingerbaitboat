import { Component, OnInit } from '@angular/core';
import { NewsService } from 'app/services/news.service';

@Component({
	selector: 'app-news',
	templateUrl: './news.component.html',
	styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
	news: News;
	newsToUpdate: News;
	isEditing = false;

	constructor(private newsService: NewsService) { }

	ngOnInit() {
		this.newsService.get().subscribe(news => {
			this.news = news;
		});
	}

	onEdit() {
		this.isEditing = true;
		this.newsToUpdate = {
			id: NewsService.newsId,
			isEnabled: this.news.isEnabled,
			text: this.news.text,
			photoUrl: this.news.photoUrl,
			videoUrl: this.news.videoUrl
		}
	}

	onCancel() {
		this.isEditing = false;
	}

	parsePhoto(event: any) {
		var url = event.target.value;
		this.newsToUpdate.photoUrl = url.substring(url.indexOf("/d/") + 3, url.indexOf("/view"));
	}

	getFullUrl(id: string) {
		return `https://drive.google.com/uc?id=${id}`;
	}

	parseVideo(event: any) {
		this.newsToUpdate.videoUrl = event.target.value;
	}

	parseText(event: any) {
		this.newsToUpdate.text = event.target.value;
	}

	parseEnabled(event: any) {
		this.newsToUpdate.isEnabled = event.target.checked;
	}

	onSave() {
		this.newsService.update(this.newsToUpdate);
		this.isEditing = false;
	}
}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root'
})
export class NewsService {
    public static newsId = 'jCYNv6lsa7Gv2anPiey0';

    constructor(private firestore: AngularFirestore) { }

    update(news: News) {
        this.firestore.doc('news/' + NewsService.newsId).update(news);
    }

    get() {
        return this.firestore.doc<News>('news/' + NewsService.newsId).valueChanges();
    }
}

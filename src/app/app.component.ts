import { Component, OnInit, Renderer2, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';
import { Location } from '@angular/common';
import { NavbarComponent } from './shared/navbar/navbar.component';
import * as dayjs from 'dayjs';
import { SaleService } from './services/sale.service';

dayjs.locale('hu-hu') // use locale

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    isAdmin: boolean;
    sale: Sale;
    @ViewChild(NavbarComponent) navbar: NavbarComponent;
    private scrollText: ElementRef;
    @ViewChild('scrollText') set content(scrollText: ElementRef) {
        if (scrollText) {
            this.scrollText = scrollText;
        }
    }
    animationTimingFunction = "linear";
    animationDuration = "4s";
    animationName = "my-animation";
    animationIterationCount = "infinite";

    constructor(private renderer: Renderer2, private router: Router, private element: ElementRef, public location: Location, private saleService: SaleService) {
        router.events.filter(event => event instanceof NavigationEnd)
            .subscribe(event => {
                this.isAdmin = (event as NavigationEnd).url.includes('admin');
            });
    }

    ngOnInit() {
        this.saleService.get().subscribe(sale => {
            this.sale = sale;
            if (!!sale && sale.isEnabled) {
                setTimeout(() => {
                    this.animationDuration = (this.scrollText.nativeElement.offsetWidth / 70) + "s";
                });
            }
        });

        this.router.events.filter(event => event instanceof NavigationEnd).subscribe((_: NavigationEnd) => {
            if (window.outerWidth > 991) {
                window.document.children[0].scrollTop = 0;
            } else {
                window.document.activeElement.scrollTop = 0;
            }

            this.navbar.sidebarClose();

            if (this.isAdmin) {
                navbar.classList.remove('navbar-transparent');
            }
        });

        var navbar: HTMLElement = this.element.nativeElement.children[0].children[0];

        this.renderer.listen('window', 'scroll', (_) => {
            if (this.isAdmin) {
                navbar.classList.remove('navbar-transparent');
                return;
            }
            const number = window.scrollY;
            if (number > 150 || window.pageYOffset > 150) {
                navbar.classList.remove('navbar-transparent');
            } else {
                navbar.classList.add('navbar-transparent');
            }
        });

        var ua = window.navigator.userAgent;
        var trident = ua.indexOf('Trident/');

        if (trident > 0) {
            var rv = ua.indexOf('rv:');
            var version = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        if (version) {
            var body = document.getElementsByTagName('body')[0];
            body.classList.add('ie-background');

        }
    }

    removeFooter() {
        var title = this.location.prepareExternalUrl(this.location.path());
        return !(title.includes('admin') || title.includes('adatkezeles'));
    }
}

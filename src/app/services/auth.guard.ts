import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SecretService } from './secret.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    isLoggedIn: boolean;

    constructor(private authService: AuthService, private router: Router, private secretService: SecretService) {

    };

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot) {
        return this.secretService.getPwd().then((doc) => {
            const secret = (doc.data() as any).password as string;

            if (atob(localStorage.getItem("stingerPwd")) === secret) {
                this.isLoggedIn = true;
            }

            if (this.isLoggedIn) {
                return true
            } else {
                this.router.navigate(['/admin']);
            }
        }).catch(() => { return false; });
    }
}
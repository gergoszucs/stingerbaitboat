import { Component } from '@angular/core';
import { SecretService } from 'app/services/secret.service';
import { AuthService } from 'app/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    shouldShake = false;
    password: string;
    secret: string;
    authenticated = false;
    wrongPassword = false;

    constructor(secretService: SecretService, private authService: AuthService) {
        secretService.getPwd().then((doc) => {
            this.secret = (doc.data() as any).password as string;
        });
    }

    login() {
        this.authenticated = this.password === this.secret;
        if (!this.authenticated) {
            this.wrongPassword = true;
        } else {
            this.authService.isLoggedIn = true;
        }
    }

    passwordUpdated(event) {
        this.password = event.target.value;
        this.login();
    }
}

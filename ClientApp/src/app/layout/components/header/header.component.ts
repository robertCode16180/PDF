import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserSessionService } from '../../../shared/services/user-session';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    pushRightClass: 'push-right';

    public userName: string;
    public Today: Date = new Date();

    constructor(public router: Router, private Session: UserSessionService) {
    }

    ngOnInit() {
        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
        const current_user = JSON.parse(sessionStorage.getItem('current_user'));
        this.userName = current_user.name.toLowerCase();
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    public getUserName(): string {
        return localStorage.getItem('userName');
    }

    onLoggedout(): void {
        sessionStorage.clear();
        localStorage.clear();
        this.Session.clear();
    }
}

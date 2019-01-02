import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { UserSessionService } from '../../shared/services/user-session';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {

    constructor(private Session: UserSessionService) {
        // console.log(`%c usuario sesion: %c ${this.Session.getUser.name}`, 'color: red', 'color: blue');
    }

    ngOnInit() {
    }
}

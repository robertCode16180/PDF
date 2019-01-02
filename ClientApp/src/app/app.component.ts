import { Component, OnInit } from '@angular/core';
import { LocalStoreManager } from './shared/local-store/local-store-manager.service';
import { SercoAuthService } from './login/services/serco-auth.service';
import { environment } from '../environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    isUserLoggedIn: boolean;

    constructor(public storageManager: LocalStoreManager,
                public sercoAuthService: SercoAuthService) {
        storageManager.initialiseStorageSyncListener();
    }

    ngOnInit() {
        this.isUserLoggedIn = this.sercoAuthService.isLoggedIn;
        // console.log('%c Web environment:', 'color: red', environment);
    }
}

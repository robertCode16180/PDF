import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { SercoAuthService } from './login/services/serco-auth.service';
import { LocalStoreManager } from './shared/local-store/local-store-manager.service';
import { UserSessionService } from './shared/services/user-session/user-session.service';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        NgxSpinnerModule,
        AppRoutingModule
    ],
    declarations: [AppComponent],
    providers: [
                SercoAuthService,
                AuthGuard,
                LocalStoreManager,
                UserSessionService
               ],
    bootstrap: [AppComponent]
})
export class AppModule {}

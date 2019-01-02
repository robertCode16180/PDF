import { Component, TemplateRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { routerTransition } from '../router.animations';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgxSpinnerService  } from 'ngx-spinner';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { SercoAuthService } from './services/serco-auth.service';
import { AuthBearer } from './services/AuthBearerInterface';
import { LocalStoreManager } from '../shared/local-store/local-store-manager.service';
import { Router } from '@angular/router';
import { JwtHelper } from './services/jwt-helper.service';
import { UserSession, UserLogin } from './models/user-session';
import { SessionKeys } from '../shared/local-store/sessionKeys';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit, OnDestroy {

    submitted = false;
    public title: string;
    public content: string;
    suscription:  Subscription;
    loginForm: FormGroup;
    userNameCtrl: FormControl;
    passwordCtrl: FormControl;

    constructor(private formBuilder: FormBuilder,
                public sercoAuthService: SercoAuthService,
                public localStorage: LocalStoreManager,
                private router: Router,
                private spinner: NgxSpinnerService,
                private modalService: BsModalService) {
        this.cleanSession();
    }

    @ViewChild('messageModal') modalTemplate: TemplateRef<any>;
    public bsModalRef: BsModalRef;

    ngOnInit() {
        if (typeof(Storage) === 'undefined') {
            throw new Error('LocalStorage no soportado en este navegador');
        }

        const unamePattern = '^[a-zA-Z0-9]*$';
        this.loginForm = this.formBuilder
                             .group({
                                     userName: this.userNameCtrl,
                                     password: ['', [
                                                     Validators.required
                                                 ]]});
        this.userNameCtrl = this.formBuilder.control('', {
            validators: [Validators.required, Validators.pattern(unamePattern),  Validators.maxLength(15)]
        });

        this.passwordCtrl = this.formBuilder.control('', {
            validators: [Validators.required]
        });
    }

    onSubmit() {
        this.submitted = true;
        this.spinner.show();
        if (this.passwordCtrl.valid && this.userNameCtrl.valid) {

            const userAuth = new UserLogin(
                this.userNameCtrl.value,
                this.passwordCtrl.value
            );

            this.suscription = this.sercoAuthService
                                   .login(userAuth)
                                   .subscribe((Response: AuthBearer) => {
                                                  this.processLoginResponse(Response);
                                               },
                                               error => {
                                                  this.spinner.hide();
                                                  console.error(error);
                                               });
        }
    }

    private processLoginResponse(Response: AuthBearer) {
       console.log(Response);
       if (typeof Response === 'undefined' || Response.state !== 1) {
           this.spinner.hide();
           const message = `<p class="txt-bold">${Response.message}</p>`;
           this.openModal(message, 'Signar - Aviso');
           return;
       }
       if (Response.state && Response.state === 1 && Response.data && Response.data.accessToken) {
           const accessToken = Response.data.accessToken;
           const jwtHelper = new JwtHelper();
           const decodeToken = jwtHelper.decodeToken(Response.data.accessToken);
           const expiresIn = decodeToken.exp;
           const userSession = new UserSession(
               decodeToken.jti,
               decodeToken.unique_name,
               decodeToken.c_hash,
           );
           this.saveUserSession(userSession, accessToken, expiresIn);
           this.router.navigate(['/home']);
       } else {
           this.spinner.hide();
           this.openModal(Response.message);
           console.error('c% processLoginResponse:', 'color: red', Response.MessageException);
       }
    }

    openModal(message: string, title: string = 'Signar') {
        this.content = message;
        this.title = title;
        const initialState = {
            title: message,
            content: this.content
        };
        this.bsModalRef = this.modalService.show(this.modalTemplate, {
                                                                      initialState,
                                                                      class: 'gray modal-md'});
    }

    private saveUserSession(userSession: UserSession, accessToken: string, expiresIn: Date) {
        this.localStorage.sessionStorageSetItem(SessionKeys.ACCESS_TOKEN, accessToken);
        this.localStorage.sessionStorageSetItem(SessionKeys.CURRENT_USER, userSession);
    }

    private cleanSession(): void {
        sessionStorage.clear();
        localStorage.clear();
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }
}


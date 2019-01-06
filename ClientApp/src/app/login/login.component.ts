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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit, OnDestroy {
    /**
     * @property {boolean} submitted Flag que indica que el formulario fue enviado
     */
    public submitted: boolean;
    /**
     * @property {string} title Almacena el titulo
     */
    public title: string;
    /**
     * @property {string} content Almacena el contenido
     */
    public content: string;
    /**
     * @property {Subject<void>} destroySubject Observable para eliminar las suscripciones
    */
    private destroySubject$: Subject<void> = new Subject();
    /**
     * @property {FormGroup} loginForm Iniciar instancia del formulario
    */
    public loginForm: FormGroup;
    /**
     * @property {string} unamePattern Patron para validar que el email sea valido
     */
    private unamePattern: string;
    /**
     * @property {BsModalRef} bsModalRef Modal referencial
     */
    public bsModalRef: BsModalRef;
    /**
     * @property {TemplateRef} modalTemplate Template referencia
     */
    @ViewChild('messageModal')
    public modalTemplate: TemplateRef<any>;

    constructor(
        private formBuilder: FormBuilder,
        public sercoAuthService: SercoAuthService,
        public localStorage: LocalStoreManager,
        private router: Router,
        private spinner: NgxSpinnerService,
        private modalService: BsModalService
        ) {
            this.cleanSession();
            this.unamePattern = '^[a-zA-Z0-9]*$';
        }

    ngOnInit() {
        this.initForm();
        this.validateStorage();
    }

    /**
     * Metodo para iniciar el formulario
     * @method initForm
     */
    private initForm(): void {
        this.loginForm = this.formBuilder.group({
            userName: [null, [ Validators.required, Validators.pattern(this.unamePattern), Validators.maxLength(15) ]],
            password: [null, [ Validators.required]],
        });
    }

    /**
     * Metodo para validar que el navegador soporta localstore
     * @method validateStorage
     */
    private validateStorage(): void {
        if (typeof(Storage) === 'undefined') {
            throw new Error('LocalStorage no soportado en este navegador');
        }
    }

    /**
     * Metodo que captura el submit del formulario
     * @method onSubmit
     */
    public onSubmit(): void {
        this.submitted = true;
        if (this.loginForm.valid) {
            this.spinner.show();

            const userAuth = new UserLogin(
                this.loginForm.controls.userName.value,
                this.loginForm.controls.passwordCtrl.value,
            );

            this.sercoAuthService.login(userAuth).pipe(takeUntil(this.destroySubject$)).subscribe((Response: AuthBearer) => {
                this.processLoginResponse(Response);
            },
            error => {
                this.handleError(error);
            });
        }
    }

    /**
     * Metodo para manajera los errores de la respuesta
     * @param {err}
     * @method handleError
     */
    private handleError(err): void {
        this.spinner.hide();
        this.openModal(err.message);
    }

    /**
     * Metodo que maneja la respuesta de la peticion al servicio
     * @param {AuthBearer} response
     * @method processLoginResponse
     */
    private processLoginResponse(response: AuthBearer) {
        this.spinner.hide();
       if (typeof response === 'undefined' || response.state !== 1) {
           this.handleUndefinedResponse(response);
       }
       if (response.state && response.state === 1 && response.data && response.data.accessToken) {
           this.handleSuccesResponse(response);
       } else {
           this.handleError(response);
       }
    }

    /**
     * Metodo para manejar la respuesta undefined del servicio
     * @param {AuthBearer} data
     * @method handleUndefinedResponse
     */
    private handleUndefinedResponse(response: AuthBearer): void {
        const message = `<p class="txt-bold">${response.message}</p>`;
        this.openModal(message, 'Signar - Aviso');
   }

    /**
     * Metodo para manejar la respuesta exitosa del servicio
     * @param {AuthBearer} data
     * @method handleUndefinedResponse
     */
    private handleSuccesResponse(response: AuthBearer): void {
        const accessToken = response.data.accessToken;
           const jwtHelper = new JwtHelper();
           const decodeToken = jwtHelper.decodeToken(response.data.accessToken);
           const userSession = new UserSession(
               decodeToken.jti,
               decodeToken.unique_name,
               decodeToken.c_hash,
           );
           this.saveUserSession(userSession, accessToken);
           this.router.navigate(['/home']);
   }

    public openModal(content: string, title: string = 'Signar'): void {
        const initialState = { title, content };
        this.modalService.show(this.modalTemplate, {
                                                    initialState,
                                                    class: 'gray modal-md'
                                                });
    }

    private saveUserSession(userSession: UserSession, accessToken: string): void {
        this.localStorage.sessionStorageSetItem(SessionKeys.ACCESS_TOKEN, accessToken);
        this.localStorage.sessionStorageSetItem(SessionKeys.CURRENT_USER, userSession);
    }

    private cleanSession(): void {
        sessionStorage.clear();
        localStorage.clear();
    }

    ngOnDestroy(): void {
        this.destroySubject$.next();
    }
}


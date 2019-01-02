import { Component, ViewChild, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { routerTransition } from '../../router.animations';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';

import { DocumentoService } from '../../shared/services/documento';
import { Documento } from '../../shared/models/Documento';
import { ResponseMessage } from '../../shared/interfaces/response-message';
import { UserSessionService } from '../../shared/services/user-session';

@Component({
    selector: 'app-firmar-documentos',
    templateUrl: './firmar-documentos.component.html',
    styleUrls: ['./firmar-documentos.component.scss'],
    animations: [routerTransition()]
})
export class FirmarDocumentosComponent implements OnInit, OnDestroy {

    public Documento: Documento;
    public titleModal: string;
    public titleMessage: string;
    public content: string;
    public firmarModalRef: BsModalRef;
    public messageModalRef: BsModalRef;
    public agregarFirmantesModalRef: BsModalRef;
    public confirmModalRef: BsModalRef;
    public detalleModalRef: BsModalRef;

    FormFirmante: FormGroup;
    Firmante = { nombre: ''};
    Firmado = { estado: ''};

    public reloadTable = 0;

    @ViewChild('messageModal') modalTemplate: TemplateRef<any>;
    @ViewChild('AgregarFirmantesModal') modalTemplateAgregarF: TemplateRef<any>;
    @ViewChild('confirmModal') modalTemplateConfirm: TemplateRef<any>;
    @ViewChild('GestionPDFModal') GestionPDFModal: TemplateRef<any>;
    @ViewChild(ModalDirective) AgregarFirmantesModal: ModalDirective;
    @ViewChild('detalleModal') modalTemplateDetalle: TemplateRef<any>;

    Suscription: Subscription;
    sendingFile: boolean;

    SuscriptionVerificar: Subscription;
    SuscriptionFirmar: Subscription;
    userAuth = '';

    userValid: boolean;
    Message: any;
    MessageFormat: string;
    interval: NodeJS.Timeout;

    // FormFirmante: FormGroup;
    nombreFirmanteCtrl: FormControl;
    showSpinner: boolean;
    listaDetallle: any;

    constructor(private documentoService: DocumentoService,
                private session: UserSessionService,
                private modalService: BsModalService,
                private formBuilder: FormBuilder) {
    }

    ngOnInit(): void {

    }

    // convenience getter for easy access to form fields
    public get f() { return this.FormFirmante.controls; }

    openGestionPDFModal(documento: Documento): void {

        this.Documento = documento;

        if (this.session.UserName === this.Documento.propietario) {
            this.Documento.owner = true;
        } else {
            this.Documento.owner = false;
        }

        this.titleModal = 'Signar - Firmar Documento: ';
        const initialState = {
            titleModal: this.titleModal
        };
        this.firmarModalRef = this.modalService.show(this.GestionPDFModal, {
            initialState,
            class: 'gray modal-xl',
            backdrop: 'static',
            keyboard: false
        });
    }

    get nombreFirmante() {
        return this.FormFirmante.get('nombreFirmante');
    }

    openAgregarFirmantes(): void {

        const unamePattern = '^[a-zA-Z0-9]*$';

        this.FormFirmante = this.formBuilder.group({
            nombreFirmante : this.nombreFirmanteCtrl,
        });

        this.nombreFirmanteCtrl = this.formBuilder.control('',
                                                            [ Validators.required,
                                                              Validators.pattern(unamePattern),
                                                              Validators.maxLength(15)
                                                            ]);

        const initialState = {
            titleModal: this.titleModal
        };
        this.agregarFirmantesModalRef = this.modalService
            .show(
                this.modalTemplateAgregarF,
                {
                    initialState,
                    class: 'gray modal-md',
                    backdrop: 'static',
                    keyboard: false
                }
            );
    }

    openConfirm(): void {

        const initialState = {
            titleModal: this.titleModal
        };
        this.confirmModalRef = this.modalService
            .show(
                this.modalTemplateConfirm,
                {
                    initialState,
                    class: 'gray modal-md',
                    backdrop: 'static',
                    keyboard: false
                }
            );
    }

    AgregarFirmaCoordenada(e?: any): void {

        if (this.nombreFirmanteCtrl.valid && this.userValid) {

            console.log(this.nombreFirmanteCtrl.valid);

            this.Firmante = {
                nombre: this.nombreFirmanteCtrl.value.toUpperCase()
            };
            this.agregarFirmantesModalRef.hide();
        }
    }

    FirmarDocumento(): void {
        this.sendingFile = true;

        this.SuscriptionFirmar =
        this.documentoService
            .Firmar(this.Documento)
            .subscribe(
                (response: ResponseMessage) => {
                    if (response.Message === 'OK') {
                        this.VerificaFirmaDocumento(this.Documento);
                    } else {
                        const message = `<p class="txt-bold">No se pudo Firmar el documento o ya fue firmado</p>`;
                        this.openModal(message, 'Signar - Aviso');
                        console.log(response);
                    }
                    console.log(response);
                },
                error => {
                    this.openModal('No se pudo Firmar el documento: ' + this.Documento.nombre, 'Signar - Aviso');
                    console.log(error);
                }, () => {
                    this.sendingFile = false;
                    if (this.confirmModalRef) {
                        this.confirmModalRef.hide();
                    }
                }
            );
    }

    private VerificaFirmaDocumento(documento: Documento): void {
        this.SuscriptionVerificar =
        this.documentoService.VerificarFirma<any>(documento)
            .subscribe(
                (response: any) => {
                    if (response.Message === 'OK') {
                        this.Firmado = {
                            estado: 'si'
                        };
                        const message = `<p class="txt-bold">El Documento Firmado y Verificado exitosamente: <span>${this.Documento.nombre}</span></p>`;
                        setTimeout(() => {
                            this.sendingFile = false;
                            this.confirmModalRef.hide();
                            this.openModal(message, 'Signar - Aviso');
                        }, 100);
                        this.reloadTable++;
                    } else {
                        const message = `<p class="txt-bold">Intente nuevamente</p>`;
                        this.openModal(message, 'Signar - Aviso');
                    }
                },
                error => {
                    const message = `<p class="txt-bold">No se pudo Firmar el documento: <span>${documento.nombre}</span></p>`;
                    this.openModal(message, 'Signar - Aviso');
                    console.log(error);
                }
            );
    }

    validarUsuario(usuario: string) {
        this.documentoService.ValidaUsuario(usuario)
                             .subscribe( (response: any) => {
                                 if (response === 'OK') {
                                   this.userValid = true;
                                 } else if (response.state === 0) {
                                   this.Message = response.message;
                                   this.userValid = false;
                                 }
                                 this.showSpinner = false;
                                 console.log(response);
                             });
    }

    onKey(usuario: string) {
      this.userValid = false;

      if (usuario.length > 0) {
        this.showSpinner = true;
      } else {
        this.showSpinner = false;
      }

      if (this.interval) {
        clearInterval(this.interval); // Al escribir, limpio el intervalo
      }
      this.interval = setInterval( () => { // Y vuelve a iniciar
          // Cumplido el tiempo, se muestra el mensaje
          if (this.nombreFirmanteCtrl.valid) {
            // console.log('string VALIDO');
            this.validarUsuario(usuario);
          }
          clearInterval(this.interval); // Limpio el intervalo
      }, 500);
    }

    detalleDocumento(eventDocumento: any): void {
        this.Documento = eventDocumento;
        const initialState = {
            Documento: this.Documento
         };

        this.detalleModalRef = this.modalService.show(this.modalTemplateDetalle, {
            initialState,
            class: 'gray modal-xl',
            backdrop: 'static',
            keyboard: false
        });
    }

    openModalMessage(messageEvent: string) {
        const message = `<p>${messageEvent}</p>`;
        this.openModal(message, 'Signar - Aviso');
    }

    openModal(message: string, titleMessage: string = 'Signar - Aviso'): void {
        this.content = message;
        this.titleMessage = titleMessage;
        const initialState = {
            titleMessage: titleMessage,
            content: this.content
        };
        this.messageModalRef = this.modalService.show(this.modalTemplate, {
            initialState,
            class: 'gray modal-md',
            backdrop: 'static'
        });
    }

    ngOnDestroy(): void {
        if (this.SuscriptionVerificar) {
            this.SuscriptionVerificar.unsubscribe();
        }
        if (this.SuscriptionFirmar) {
            this.SuscriptionFirmar.unsubscribe();
        }
    }
}





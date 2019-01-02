import { Component, ViewChild, TemplateRef } from '@angular/core';
import { routerTransition } from '../../router.animations';

import { DocumentoService } from '../../shared/services/documento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Documento } from '../../shared/models/Documento';
import { ResponseMessage } from '../../shared/interfaces/response-message';
import { UserSessionService } from '../../shared/services/user-session';

@Component({
    selector: 'app-validar-documentos',
    templateUrl: './validar-documentos.component.html',
    styleUrls: ['./validar-documentos.component.scss'],
    animations: [routerTransition()]
})

export class ValidarDocumentosComponent {

  public Documento: Documento;
  public titleModal: string;
  public titlePDF: string;
  public titleMessage: string;
  public content: string;

  public bsModalRef: BsModalRef;
  public bsValidarModalRef: BsModalRef;
  public bsConfirmModalRef: BsModalRef;
  public bsPDFModalRef: BsModalRef;
  public detalleModalRef: BsModalRef;

  public reloadTable = 0;

  @ViewChild('messageModal') TempRefMessage: TemplateRef<any>;
  @ViewChild('templateValidarModal') TempRefValidar: TemplateRef<any>;
  @ViewChild('confirmValidarModal') TempRefValidarModal: TemplateRef<any>;
  @ViewChild('detalleModal') modalTemplateDetalle: TemplateRef<any>;

  sendingFile: boolean;
  listaDetallle: any;

  constructor(private documentoService: DocumentoService,
              private session: UserSessionService,
              private modalService: BsModalService) {
  }

  openValidarPDFModal(documento: Documento): void {
    this.Documento = documento;

    if (this.session.UserName === this.Documento.propietario) {
        this.Documento.owner = true;
    } else {
        this.Documento.owner = false;
    }

    this.titleModal = 'Signar - Validar Documento: ';
    const initialState = {
        title: this.titleModal,
        content: this.content
    };
    this.bsValidarModalRef = this.modalService.show(this.TempRefValidar, {
                                                                          initialState,
                                                                          class: 'gray modal-xl',
                                                                          backdrop: 'static'});
  }

  openConfirmarValidar(): void {

    this.content = '<p class="txt-bold">Est&aacute; seguro que desea Validar el siguiente documento documento?: </p>' +
            '<span class="text-red">' + this.Documento.nombre + '</span>';

        const initialState = {
            titleModal: this.titleModal
        };
        this.bsConfirmModalRef = this.modalService
            .show(
                this.TempRefValidarModal,
                {
                    initialState,
                    class: 'gray modal-md',
                    backdrop: 'static',
                    keyboard: false
                }
            );
  }

  ValidarDocumento() {
    this.sendingFile = true;

    this.documentoService
        .Validar(this.Documento)
        .subscribe(
                    (response: ResponseMessage | any) => {
                        if (response.Message === 'OK') {
                        const message = `<p class="txt-bold">Documento Validado con éxito: <span>${this.Documento.nombre}</span></p>`;
                        setTimeout(() => {
                            this.sendingFile = false;
                            this.bsConfirmModalRef.hide();
                            this.openModal(message, 'Signar - Aviso');
                        }, 100);
                        this.reloadTable++;
                        } else {
                        this.openModal('No se pudo Validar el documento: ' + this.Documento.nombre);
                        }
                        console.log(response);
                    },
                    error => {
                        console.log(error);
                    }, () => {
                        console.log('Service firmar completed');
                        this.sendingFile = false;
                            if (this.bsConfirmModalRef) {
                                this.bsConfirmModalRef.hide();
                            }
                    }
            );
  }

  openModal(message: string, title: string = 'Signar - Aviso') {
      this.content = message;
      this.titleMessage = title;
      const initialState = {
          title: title,
          content: message
      };
      this.bsModalRef = this.modalService.show(this.TempRefMessage, {
                                                                    initialState,
                                                                    class: 'gray modal-md',
                                                                    backdrop: 'static'});
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

}



import { Component, TemplateRef, ViewChild, OnDestroy, OnInit} from '@angular/core';
import { routerTransition } from '../../router.animations';
import { DocumentoService } from '../../shared/services/documento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { Documento } from '../../shared/models/Documento';
import { ResponseMessage } from '../../shared/interfaces/response-message';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-tables',
    templateUrl: './documentos-guardados.component.html',
    styleUrls: ['./documentos-guardados.component.scss'],
    animations: [routerTransition()]
})
export class DocumentosGuardadosComponent implements OnInit, OnDestroy {

  /***** Modal parametros *****/
  public titleMessage: string;
  public content: string;
  public messageModalRef: BsModalRef;
  public bsPDFModalRef: BsModalRef;
  public confirmModalRef: BsModalRef;
  public detalleModalRef: BsModalRef;

  @ViewChild('messageModal') modalTemplate: TemplateRef<any>;
  @ViewChild('pdfPreviewModal') modalTemplatePDF: TemplateRef<any>;
  @ViewChild('confirmModal') modalTemplateConfirm: TemplateRef<any>;
  @ViewChild('detalleModal') modalTemplateDetalle: TemplateRef<any>;

  public Documento: Documento;
  public titleModal: string;
  AnularSubscription: Subscription;

  public reloadTable = 0;

  listaDetallle: any;

  constructor(private modalService: BsModalService, private service: DocumentoService) {
  }

  ngOnInit(): void {

  }

  VerDocumentoPDF(documento: Documento): void {

    this.Documento = documento;

    this.titleModal = 'Signar - Documento: ';
    const initialState = {
        titleModal: this.titleModal,
        content: this.content
    };
    this.bsPDFModalRef = this.modalService.show(this.modalTemplatePDF, {
        initialState,
        class: 'gray modal-xl',
        backdrop: 'static'
    });
  }

  AnularEvent(documento: Documento): void {
    this.Documento = documento;
    this.openConfirm();
  }

  AnularDocumento(): void {

    this.AnularSubscription =
    this.service.Anular(this.Documento)
                .subscribe((response: ResponseMessage) => {

                  if (response.Message === 'OK') {
                    this.reloadTable++;
                    const message = `<p class="txt-bold">Se Anuló el documento: <span class="txt-red">${this.Documento.nombre}</span></p>`;
                    this.openModal(message, 'Signar - Aviso');
                  } else {
                    const message = `<p class="txt-bold">No se pudo eliminar el documento: ${this.Documento.nombre}</p>`;
                    this.openModal(message, 'Signar - Aviso');
                  }

                },
                error => {
                    const message = `<p class="txt-bold">No se pudo eliminar el Documento: ${this.Documento.nombre}</p>`;
                    this.openModal(message, 'Signar - Aviso');
                    console.log(error);
                }, () => {
                    console.log('Service aNULAR completed');
                    if (this.confirmModalRef) {
                        this.confirmModalRef.hide();
                    }
                });
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
                backdrop: 'static'
            }
        );
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

  ngOnDestroy(): void {
      if (this.AnularSubscription) {
        this.AnularSubscription.unsubscribe();
      }
  }


}

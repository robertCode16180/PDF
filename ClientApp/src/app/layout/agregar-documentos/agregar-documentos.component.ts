import { Component, ViewChild, TemplateRef, OnInit, OnDestroy, HostListener } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { Documento } from '../../shared/models/Documento';
import { Subscription } from 'rxjs';
import { ResponseMessage } from '../../shared/interfaces/response-message';
import { DocumentoService } from '../../shared/services/documento';

@Component({
    selector: 'app-agregar-documentos',
    templateUrl: './agregar-documentos.component.html',
    styleUrls: ['./agregar-documentos.component.scss'],
    animations: [routerTransition()]
})
export class AregarDocumentosComponent implements OnInit, OnDestroy {

    public Documento: Documento;

    public titleModal: string;
    public content: string;
    public messageModalRef: BsModalRef;
    public bsPDFModalRef: BsModalRef;
    public confirmModalRef: BsModalRef;
    public detalleModalRef: BsModalRef;

    public reloadTable = 0;

    @ViewChild('messageModal') modalTemplate: TemplateRef<any>;
    @ViewChild('pdfPreviewModal') modalTemplatePDF: TemplateRef<any>;
    @ViewChild('confirmModal') modalTemplateConfirm: TemplateRef<any>;
    @ViewChild('detalleModal') modalTemplateDetalle: TemplateRef<any>;

    AnularSubscription: Subscription;
    listaDetallle: any;

    constructor(private modalService: BsModalService, private service: DocumentoService) {
    }

    ngOnInit(): void {
    }

    VerDocumentoPDF(documento: Documento): void {

        this.Documento = documento;

        this.titleModal = 'Signar - Documento: ';
        const initialState = {
            titleModal: this.titleModal
        };
        this.bsPDFModalRef = this.modalService.show(this.modalTemplatePDF, {
            initialState,
            class: 'gray modal-xl',
            backdrop: 'static',
            keyboard: false
        });
    }

    EventDocumentoGuardado() {
        this.reloadTable++;
    }

    AnularEvent(documento: Documento): void {
        this.Documento = documento;
        this.openConfirm();
    }

    AnularDocumento(): void {

        this.AnularSubscription =
        this.service
            .Anular(this.Documento)
            .subscribe((response: ResponseMessage) => {
                this.confirmModalRef.hide();
                if (response.Message === 'OK') {
                this.reloadTable++;
                const message = `<p class="txt-bold">Se Anuló  el documento: <span class="text-red">${this.Documento.nombre}</span></p>`;
                this.openModal(message, 'Signar - Aviso');

                } else {
                const message = `<p class="txt-bold">No se pudo eliminar el documento: <span class="text-red">${this.Documento.nombre}</span></p>`;
                this.openModal(message, 'Signar - Aviso');
                }

            },
            error => {
                const message = `<p class="txt-bold">No se pudo eliminar el Documento: ${this.Documento.nombre}</p>`;
                this.openModal(message, 'Signar - Aviso');
                console.log(error);
            }, () => {
                console.log('Service aNULAR completed');
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

    openModal(message: string, titleModal: string = 'Signar - Aviso') {
        this.content = message;
        this.titleModal = titleModal;
        const initialState = {
            titleModal: titleModal,
            content: this.content
        };
        this.messageModalRef = this.modalService.show(this.modalTemplate, {
            initialState,
            class: 'gray modal-md',
            backdrop: 'static'
        });
    }

    onErrorPDF(event: Error): void {
        this.openModal('Documento no disponible');
        console.log(event);
    }

    ngOnDestroy(): void {
        if (this.AnularSubscription) {
            this.AnularSubscription.unsubscribe();
        }
    }
}


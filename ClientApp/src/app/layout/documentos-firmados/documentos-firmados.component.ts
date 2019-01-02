import { Component, OnInit, TemplateRef, ViewChild, OnDestroy} from '@angular/core';
import { routerTransition } from '../../router.animations';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { Documento } from '../../shared/models/Documento';

@Component({
    selector: 'app-tables',
    templateUrl: './documentos-firmados.component.html',
    styleUrls: ['./documentos-firmados.component.scss'],
    animations: [routerTransition()]
})
export class DocumentosFirmadosComponent implements OnInit, OnDestroy {

    public Documento: Documento;

    /***** Modal parametros *****/
    public titleModal: string;
    public content: string;
    public bsModalRef: BsModalRef;
    public bsPDFModalRef: BsModalRef;
    public detalleModalRef: BsModalRef;

    @ViewChild('messageModal') modalTemplate: TemplateRef<any>;
    @ViewChild('pdfPreviewModal') modalTemplatePDF: TemplateRef<any>;
    @ViewChild('detalleModal') modalTemplateDetalle: TemplateRef<any>;

    listaDetallle: any;

    constructor(private modalService: BsModalService) {
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
    }

    VerDocumentoPDF(documento: Documento): void {

        this.Documento = documento;

        this.titleModal = 'Signar - Documento Firmado: ';
        const initialState = {
            titleModal: this.titleModal,
            content: this.content
        };
        this.bsPDFModalRef = this.modalService
                                 .show(this.modalTemplatePDF, {
                                                                initialState,
                                                                class: 'gray modal-xl',
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

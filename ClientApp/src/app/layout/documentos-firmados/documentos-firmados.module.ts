import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { DocumentosFirmadosRoutingModule } from './documentos-firmados-routing.module';
import { DocumentosFirmadosComponent } from './documentos-firmados.component';
import { PageHeaderModule } from '../../shared';

import { PDFViewerModule } from '../../shared/pdf-viewer';
import { NgxDataTableModule } from '../../shared/ngx-data-table';
import { NgxDataTableDetalleModule } from '../../shared/ngx-data-table-detalle';

@NgModule({
    imports: [
              CommonModule,
              FormsModule,
              DocumentosFirmadosRoutingModule,
              PageHeaderModule,
              NgbModule.forRoot(),
              NgxDataTableModule,
              NgxDataTableDetalleModule,
              PDFViewerModule
            ],
    declarations: [DocumentosFirmadosComponent]
})
export class DocumentosFirmadosModule {}

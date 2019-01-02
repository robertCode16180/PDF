import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { DocumentosValidadosRoutingModule } from './documentos-validados-routing.module';
import { DocumentosValidadosComponent } from './documentos-validados.component';
import { PageHeaderModule } from '../../shared';

import { PDFViewerModule } from '../../shared/pdf-viewer';
import { NgxDataTableModule } from '../../shared/ngx-data-table';
import { NgxDataTableDetalleModule } from '../../shared/ngx-data-table-detalle';

@NgModule({
    imports: [
            CommonModule,
            FormsModule,
            DocumentosValidadosRoutingModule,
            PageHeaderModule,
            NgbModule.forRoot(),
            NgxDataTableModule,
            NgxDataTableDetalleModule,
            PDFViewerModule
        ],
    declarations: [DocumentosValidadosComponent]
})
export class DocumentosValidadosModule {}

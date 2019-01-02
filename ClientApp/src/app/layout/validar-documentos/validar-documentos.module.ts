import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { ValidarDocumentosRoutingModule } from './validar-documentos-routing.module';
import { ValidarDocumentosComponent } from './validar-documentos.component';
import { PageHeaderModule } from '../../shared';

import { PDFViewerModule } from '../../shared/pdf-viewer';
import { NgxDataTableModule } from '../../shared/ngx-data-table';
import { NgxDataTableDetalleModule } from '../../shared/ngx-data-table-detalle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    imports: [
            CommonModule,
            FormsModule,
            ValidarDocumentosRoutingModule,
            PageHeaderModule,
            NgbModule.forRoot(),
            NgxDataTableModule,
            NgxDataTableDetalleModule,
            PDFViewerModule,
            MatProgressSpinnerModule
        ],
    declarations: [ValidarDocumentosComponent]
})
export class ValidarDocumentosModule {}

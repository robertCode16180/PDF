import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PageHeaderModule } from '../../shared';
import { AregarDocumentosRoutingModule } from './agregar-documentos-routing.module';
import { AregarDocumentosComponent } from './agregar-documentos.component';
import { NgxDataTableModule } from '../../shared/ngx-data-table';
import { NgxDataTableDetalleModule } from '../../shared/ngx-data-table-detalle';

import { NgxFileDropModule } from './components/ngx-file-drop';
import { PDFViewerModule } from '../../shared/pdf-viewer';
import { MatButtonModule } from '@angular/material';

@NgModule({
    imports: [
               CommonModule,
               NgbModule.forRoot(),
               PageHeaderModule,
               AregarDocumentosRoutingModule,
               NgxDataTableModule,
               NgxDataTableDetalleModule,
               PDFViewerModule,
               NgxFileDropModule,
               MatButtonModule
            ],
    declarations: [
                    AregarDocumentosComponent
                  ]
})
export class AgregarDocumentosModule {}

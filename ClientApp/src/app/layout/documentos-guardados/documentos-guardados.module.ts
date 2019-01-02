import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { DocumentosGuardadosRoutingModule } from './documentos-guardados-routing.module';
import { DocumentosGuardadosComponent } from './documentos-guardados.component';
import { PageHeaderModule } from '../../shared';

import { PDFViewerModule } from '../../shared/pdf-viewer';
import { NgxDataTableModule } from '../../shared/ngx-data-table';
import { NgxDataTableDetalleModule } from '../../shared/ngx-data-table-detalle';

import { MatButtonModule } from '@angular/material';

@NgModule({
    imports: [
              CommonModule,
              FormsModule,
              DocumentosGuardadosRoutingModule,
              PageHeaderModule,
              NgbModule.forRoot(),
              NgxDataTableModule,
              NgxDataTableDetalleModule,
              PDFViewerModule,
              MatButtonModule
             ],
    declarations: [DocumentosGuardadosComponent]
})
export class DocumentosGuardadosModule {}

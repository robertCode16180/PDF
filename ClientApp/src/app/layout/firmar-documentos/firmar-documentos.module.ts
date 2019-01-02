import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FirmarDocumentosRoutingModule } from './firmar-documentos-routing.module';
import { FirmarDocumentosComponent } from './firmar-documentos.component';
import { PageHeaderModule } from '../../shared';

import { PDFViewerModule } from '../../shared/pdf-viewer';
import { AngularDraggableModule } from 'angular2-draggable';
import { NgxDataTableModule } from '../../shared/ngx-data-table';
import { NgxDataTableDetalleModule } from '../../shared/ngx-data-table-detalle';

import { MatButtonModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AutofocusDirective } from './directives/autofocus.directive';

@NgModule({
    imports: [
            CommonModule,
            FormsModule,
            ReactiveFormsModule,
            FirmarDocumentosRoutingModule,
            PageHeaderModule,
            NgbModule.forRoot(),
            NgxDataTableModule,
            NgxDataTableDetalleModule,
            PDFViewerModule,
            AngularDraggableModule,
            MatButtonModule,
            MatInputModule,
            MatFormFieldModule,
            MatProgressSpinnerModule
        ],
    declarations: [FirmarDocumentosComponent, AutofocusDirective ]
})
export class FirmarDocumentosModule {}

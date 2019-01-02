import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PDFViewerComponent } from './pdf-viewer.component';
import { AngularDraggableModule } from 'angular2-draggable';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { PDFJSStatic } from 'pdfjs-dist';
import { CoordenadasService } from './services/coordenadas.service';
import { PaginateComponent } from './paginate/paginate.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export { PDFJSStatic, PDFDocumentProxy, PDFViewerParams, PDFPageProxy, PDFSource, PDFProgressData, PDFPromise } from 'pdfjs-dist';

declare global {
  const PDFJS: PDFJSStatic;
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AngularDraggableModule,
    NgbDropdownModule.forRoot(),
    MatProgressSpinnerModule
  ],
  declarations: [ PDFViewerComponent, PaginateComponent ],
  exports: [ PDFViewerComponent ],
  providers: [
    CoordenadasService
  ]
})
export class PDFViewerModule { }

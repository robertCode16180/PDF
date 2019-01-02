import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxDataTableDetalleComponent } from './ngx-data-table-detalle.component';

@NgModule({
  declarations: [ NgxDataTableDetalleComponent ],
  imports: [
            CommonModule,
            RouterModule,
            NgxDatatableModule
  ],
  exports: [ NgxDataTableDetalleComponent ]
})
export class NgxDataTableDetalleModule { }

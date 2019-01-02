import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxDataTableComponent } from './ngx-data-table.component';

import {MatButtonModule} from '@angular/material';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [NgxDataTableComponent],
  imports: [
            CommonModule,
            RouterModule,
            NgxDatatableModule,
            MatButtonModule,
            MatInputModule
  ],
  exports: [NgxDataTableComponent]
})
export class NgxDataTableModule { }

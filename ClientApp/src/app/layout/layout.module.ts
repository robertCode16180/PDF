import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        NgbDropdownModule.forRoot(),
        ButtonsModule.forRoot(),
        ModalModule.forRoot(),
        TooltipModule.forRoot()
    ],
    declarations: [
                   LayoutComponent,
                   SidebarComponent,
                   HeaderComponent
                  ],
    schemas: [ NO_ERRORS_SCHEMA ]
})
export class LayoutModule {}

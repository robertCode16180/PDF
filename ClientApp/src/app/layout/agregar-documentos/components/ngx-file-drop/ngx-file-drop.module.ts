import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxFileDropComponent } from './ngx-file-drop.component';
import { FileDropModule } from 'ngx-file-drop';
import { ConvertSize } from './pipe/convert-size';

import {MatButtonModule} from '@angular/material';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { FileAutofocusDirective } from './directives/file-autofocus.directive';

@NgModule({
    imports: [
            CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NgbModule.forRoot(),
            FileDropModule,
            MatButtonModule,
            MatInputModule,
            MatFormFieldModule,
            MatIconModule,
            MatProgressSpinnerModule
        ],
    declarations: [ NgxFileDropComponent, ConvertSize, FileAutofocusDirective ],
    exports: [ NgxFileDropComponent ]
})
export class NgxFileDropModule {}

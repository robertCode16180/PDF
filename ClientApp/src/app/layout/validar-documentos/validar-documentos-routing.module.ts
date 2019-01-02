import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ValidarDocumentosComponent } from './validar-documentos.component';

const routes: Routes = [
    {
        path: '', component: ValidarDocumentosComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ValidarDocumentosRoutingModule {
}

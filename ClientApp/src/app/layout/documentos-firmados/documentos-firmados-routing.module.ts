import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentosFirmadosComponent } from './documentos-firmados.component';

const routes: Routes = [
    {
        path: '', component: DocumentosFirmadosComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocumentosFirmadosRoutingModule {
}

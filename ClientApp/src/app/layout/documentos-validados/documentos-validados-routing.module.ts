import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentosValidadosComponent } from './documentos-validados.component';

const routes: Routes = [
    {
        path: '', component: DocumentosValidadosComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocumentosValidadosRoutingModule {
}

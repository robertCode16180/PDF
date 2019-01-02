import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentosGuardadosComponent } from './documentos-guardados.component';

const routes: Routes = [
    {
        path: '', component: DocumentosGuardadosComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocumentosGuardadosRoutingModule {
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FirmarDocumentosComponent } from './firmar-documentos.component';

const routes: Routes = [
    {
        path: '', component: FirmarDocumentosComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FirmarDocumentosRoutingModule {
}

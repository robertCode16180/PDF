import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AregarDocumentosComponent } from './agregar-documentos.component';

const routes: Routes = [
    {
        path: '', component: AregarDocumentosComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AregarDocumentosRoutingModule {
}

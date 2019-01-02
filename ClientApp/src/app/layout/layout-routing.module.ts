import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'home', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'agregar-documentos', loadChildren: './agregar-documentos/agregar-documentos.module#AgregarDocumentosModule' },
            { path: 'firmar-documentos', loadChildren: './firmar-documentos/firmar-documentos.module#FirmarDocumentosModule' },
            { path: 'validar-documentos', loadChildren: './validar-documentos/validar-documentos.module#ValidarDocumentosModule' },
            { path: 'documentos-guardados', loadChildren: './documentos-guardados/documentos-guardados.module#DocumentosGuardadosModule' },
            { path: 'documentos-firmados', loadChildren: './documentos-firmados/documentos-firmados.module#DocumentosFirmadosModule' },
            { path: 'documentos-validados', loadChildren: './documentos-validados/documentos-validados.module#DocumentosValidadosModule' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}

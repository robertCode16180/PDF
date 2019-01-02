import { Component, ViewChild, Input, Output, EventEmitter, OnInit, OnDestroy, DoCheck, OnChanges, SimpleChanges} from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { DocumentoService } from '../services/documento';
import { ListaDocumentos } from '../models/Documento';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'ngx-data-table',
    templateUrl: './ngx-data-table.component.html',
    styleUrls: ['./ngx-data-table.component.scss']
})
export class NgxDataTableComponent implements OnInit, OnChanges, OnDestroy {

    loadingIndicator: boolean;
    rows: Observable<any[] | ListaDocumentos>;
    temp: any[] = [];
    onSelected = [];

    subscription: Subscription;

    @ViewChild(DatatableComponent) table: DatatableComponent;

    @Input() private filtro: string;
    @Input() public titleColumn = 'Ver Documento';
    @Input() public reloadTable = null;
    @Input() public DeleteButton = false;

    @Output() SelectedDocumento = new EventEmitter<any>();
    @Output() detalleDocumento = new EventEmitter<any>();
    @Output() AnularDocumento = new EventEmitter<any>();

    constructor(private documentoService: DocumentoService) {
    }

    ngOnInit() {
        this.loadingIndicator = true;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['reloadTable'] || changes['reloadTable'] === undefined) {
            this.listarDocumentos();
        }
    }

    private listarDocumentos(): void {
        this.subscription = this.documentoService
                                .listarDocumentos(this.filtro)
                                .subscribe((response: ListaDocumentos | any) => {
                                   this.rows = observableOf(response);
                                   this.temp = [...response];
                                   this.loadingIndicator = false;
                                });
    }

    Refresh(): void {
        this.listarDocumentos();
    }

    updateFilter(event) {
        const val = event.target.value.toLowerCase();
        // filter our data
        const temp = this.temp.filter(function(d) {
            return (d.nombre.toLowerCase().indexOf(val) !== -1 || !val) || (d.id.indexOf(val) !== -1 || !val) || (d.usuario.indexOf(val) !== -1 || !val);
        });
        // update the rows
        this.rows = observableOf(temp);

        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
    }

    onSelect({ selected }) {
        this.onSelected = selected;
    }

    onActivate(event) {
        this.onSelected = event['row'];
    }

    GetRow(): void {
        // Get current Row
        // const selectedDocumento: Documento = this.temp.filter(row => row.id === value).pop();
        this.SelectedDocumento.emit(this.onSelected);
    }

    public Anular(): void {
        this.AnularDocumento.emit(this.onSelected);
    }

    verDetalle(): void {

        this.detalleDocumento.emit(this.onSelected);

    }

    ngOnDestroy() {
      if (this.subscription) {
          this.subscription.unsubscribe();
      }
    }
}

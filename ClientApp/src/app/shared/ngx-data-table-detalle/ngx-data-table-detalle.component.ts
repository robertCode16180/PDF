import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { DocumentoService } from '../services/documento';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-data-table-detalle',
  templateUrl: './ngx-data-table-detalle.component.html',
  styleUrls: ['./ngx-data-table-detalle.component.scss']
})
export class NgxDataTableDetalleComponent implements OnInit, OnChanges, OnDestroy {

  listaDetalle$: Observable<any>;

  public loadingIndicator: boolean;
  serviceSuscription: Subscription;


  constructor(private service: DocumentoService) {
    this.loadingIndicator = true;
  }

  @Input() Documento: any;

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges');
    if (changes['Documento']) {
      this.serviceSuscription =
      this.service
          .Detalle(this.Documento)
          .subscribe(response => {
            console.log(response);
            this.listaDetalle$ = of(response);
            this.loadingIndicator = false;
          });
    }
  }

  ngOnInit(): void {
    console.log('ngOnInit');
  }

  ngOnDestroy(): void {
    if (this.serviceSuscription) {
      this.serviceSuscription.unsubscribe();
    }
  }

}

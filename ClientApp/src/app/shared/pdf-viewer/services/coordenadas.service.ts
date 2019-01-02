import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription, BehaviorSubject, Subject } from 'rxjs';
import { CoordenadasFirmante, AnulaCoordenada, AgregarCoordenada } from '../../models/Documento';
import { DocumentoService } from '../../services/documento/documento.service';

@Injectable()
export class CoordenadasService implements OnDestroy {

  CoordenadasFirma: CoordenadasFirmante[] = [];
  CoordenadasSubject: BehaviorSubject<any> = new BehaviorSubject<CoordenadasFirmante[]>([]);
  AnularCoordenadaSubject: BehaviorSubject<string> = new BehaviorSubject<string>('sendig');
  AgregarCoordenadaSubject: BehaviorSubject<string> = new BehaviorSubject<string>('sendig');

  Subscription: Subscription;

  constructor(private documentoService: DocumentoService) { }

  public GetConvertHTML(Documento: any, PageHeight: number): Observable<CoordenadasFirmante[]> {
    this.Subscription =
    this.documentoService
        .ObtieneCoordenadas(Documento)
        .subscribe((CoordenadasPDF: CoordenadasFirmante[]) => {
                    this.CoordenadasFirma = CoordenadasPDF;
                    this.CoordenadasFirma.map((e) => {
                                                e.coordenadas.y = PageHeight - (Math.abs(e.coordenadas.y + 50));
                                                e.coordenadaHTML.y = e.coordenadas.y;
                                                e.isMoved = false;
                                                e.onStoped = true;
                                                e.modified = false;
                                                e.onInit = true;
                                             });
                    this.CoordenadasSubject.next(this.CoordenadasFirma);
                    },
                    error => {
                      console.log(error);
                      this.CoordenadasSubject.next(this.CoordenadasFirma);
                    }
                    );
    return this.CoordenadasSubject.asObservable();
  }

  public Anular(Coordenada: AnulaCoordenada): Observable<any> {
    this.documentoService
        .AnulaCoordenada(Coordenada)
        .subscribe((response: any) => {
            this.AnularCoordenadaSubject.next(response);
          }, error => {
            console.log(error);
            this.CoordenadasSubject.next('error');
        }, () => {console.log('completada'); });
    return this.AnularCoordenadaSubject.asObservable();
  }

  ngOnDestroy(): void {
    if (this.Subscription) {
      this.Subscription.unsubscribe();
    }
  }

}

/**
 *
 * return new Observable((observer) => {
    let i = 0;
    const id = setInterval(() => {
      observer.next(i++);
    }, interval);
    return () => {
      clearInterval(id);
      console.log('Observable.interval: unsubscribbed');
    };
  });
 *
 */

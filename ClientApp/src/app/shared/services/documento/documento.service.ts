import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { UserSessionService } from '../user-session/user-session.service';
import { EndpointFactoryService } from '../endpoint-factory.service';
import { Documento,
         CoordenadasFirmante,
         AgregarCoordenada,
         AnulaCoordenada,
         ListaDocumentos,
         DocumentoCoordenada} from '../../models/Documento';

import { ResponseMessage } from '../../interfaces/response-message';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  private API_URL = environment.localHost;

  private UserAUTH = '';

  constructor(
              private http:  HttpClient,
              private Session: UserSessionService,
              private endpoint: EndpointFactoryService ) {

    this.UserAUTH = this.Session.UserName;
  }

  public listarDocumentos(filtro: string): Observable<any[]> {

     return this.http.post(`${this.API_URL}/Documento/listar?filtro=${filtro}`,
                              this.Session.getUser,
                              this.endpoint.getRequestHeaders())
                     .pipe(
                           tap(console.log),
                           map((response: ListaDocumentos[]) => {
                               // Post successful response
                                if (Array.isArray(response)) {

                                 return response.filter((item: ListaDocumentos) => item.id.length > 0)
                                                .map((item: ListaDocumentos) => {
                                                    if (this.UserAUTH === item.propietario) {
                                                        item.owner = true;
                                                        return item;
                                                    } else {
                                                        item.owner = false;
                                                        return item;
                                                    }
                                                });
                               } else {
                                 return [];
                               }
                           })
                     );
  }

  public Guardar(fileFormData: FormData): Observable<ResponseMessage> {

      fileFormData.append('userSession', JSON.stringify(this.Session.getUser));

      return this.http.post(`${this.API_URL}/Documento/guardar`,
                                             fileFormData)
                      .pipe<ResponseMessage>(
                            // debounceTime(200),
                            map((response: ResponseMessage) => {
                                // Post successful response
                                return response;
                            })
                      );
  }

  public ValidaUsuario(usuario: string): Observable<any> {

    const bodyJson = {
        usuario: usuario
    };

    return this.http.post(`${this.API_URL}/Documento/PropiedadUsuario`,
                             bodyJson,
                             this.endpoint.getRequestHeaders())
                    .pipe(
                          // debounceTime(200),
                          map((data: ResponseMessage) => {
                              // Post successful response
                              return data;
                          }),
                          catchError(this.handleError<any>('ValidaUsuario'))
                    );
  }

  public Anular(documento: Documento): Observable<ResponseMessage> {

    documento.userSession = this.Session.getUser;

    return this.http.post(`${this.API_URL}/Documento/AnulaDocumento`,
                           documento,
                           this.endpoint.getRequestHeaders())
                    .pipe<ResponseMessage>(
                          // debounceTime(200),
                          map((response: ResponseMessage) => {
                              // Post successful response
                              return response;
                          })
                    );
}

public ObtieneDocumento(documento: Documento): Observable<Blob> {

    documento.userSession = this.Session.getUser;

    return this.http.post(`${this.API_URL}/Documento/Obtiene`,
                             documento,
                             this.endpoint.getRequestHeadersBlob())
                    .pipe(
                          // debounceTime(200),
                          map((data: Blob) => {
                              // Post successful response
                              return data;
                          }),
                          catchError(this.handleError<any>('ObtieneDocumento'))
                    );
 }

 public ObtieneCoordenadas(documentoCoordenada: DocumentoCoordenada): Observable<CoordenadasFirmante[]> {

    documentoCoordenada.UserSession = this.Session.getUser;

    return this.http.post<CoordenadasFirmante[]>(`${this.API_URL}/Documento/ObtieneCoordenadas`,
                                               documentoCoordenada,
                                               this.endpoint.getRequestHeaders())
                    .pipe(
                          // tap(console.log),
                          map((response: CoordenadasFirmante[]) => {
                            // Post successful response
                            if (Array.isArray(response)) {
                                return response.filter(item => (item.id.length > 0)).map(this.Parser);
                            } else {
                                return [];
                            }
                          }),
                          catchError(this.handleError<any>('ObtieneCoordenadas'))
                    );
 }

 private Parser(data: any): CoordenadasFirmante {
     const splitted = (data.coordenadas as string).split(',');
     return {
             id: data.id,
             id_doc: (data.id_doc as string),
             firmante: data.firmante,
             pagina: Number(data.pagina),
             coordenadaPDF: {
                x: Number(splitted[0]),
                y: Number(splitted[1])
             },
             coordenadaHTML: {
                x: 0,
                y: 0
             },
             coordenadas: {
                            x: Number(splitted[0]),
                            y: Number(splitted[1])
             }
     };
 }

 public AgregarCoordenada(FirmanteCoordenada: AgregarCoordenada): Observable<any> {

    FirmanteCoordenada.userSession = this.Session.getUser;
    // return of(FirmanteCoordenada);
    return this.http.post(`${this.API_URL}/Documento/AgregarCoordenadas`,
                           FirmanteCoordenada)
                    .pipe(
                          // debounceTime(200),
                          // tap(console.log),
                          map(response => {
                              // Post successful response
                              return response;
                          })
                    );
 }

 public AnulaCoordenada(Coordenada: AnulaCoordenada): Observable<any> {

    Coordenada.userSession = this.Session.getUser;

    return this.http.post(`${this.API_URL}/Documento/AnulaCoordenadasFirma`,
                           Coordenada,
                           this.endpoint.getRequestHeaders())
                    .pipe(
                          // debounceTime(200),
                          map(response => {
                              // Post successful response
                              return response;
                          })
                    );
 }

 public Detalle(documento: any): Observable<any> {

    documento.userSession = this.Session.getUser;

    return this.http.post(`${this.API_URL}/Documento/Detalle`,
                           documento,
                           this.endpoint.getRequestHeaders())
                    .pipe(
                          // debounceTime(200),
                          map(response => {
                              // Post successful response
                              return response;
                          })
                    );
 }

 public Firmar<T>(documento: Documento): Observable<T> {

    return this.http.post<T>(`${this.API_URL}/Documento/Firmar`,
                                documento,
                                this.endpoint.getRequestHeaders())
                    .pipe<T>(
                            // debounceTime(200),
                            map(response => {
                                // Post successful response
                                return response;
                            })
                    );
 }

 public VerificarFirma<T>(documento: Documento): Observable<T> {

    return this.http.post<T>(`${this.API_URL}/Documento/VerificaFirmaDocumento`,
                                documento,
                                this.endpoint.getRequestHeaders())
                    .pipe<T>(
                            // debounceTime(200),
                            map(response => {
                                // Post successful response
                                return response;
                            })
                    );
 }

 public Validar<T>(documento: Documento): Observable<T> {

    return this.http.post<T>(`${this.API_URL}/Documento/Validar`,
                                documento,
                                this.endpoint.getRequestHeaders())
                    .pipe<T>(
                            // debounceTime(200),
                            map(response => {
                                // Post successful response
                                return response;
                            }),
                    );
 }

 private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
        console.error(`${operation} error: ${error.message}`);
        return of(result as T);
    };
 }

}

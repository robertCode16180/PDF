import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpHeader, HttpHeaderBlob } from '../interfaces/http-request';

@Injectable({
  providedIn: 'root'
})
export class EndpointFactoryService {

  constructor() { }

  public getRequestHeaders(): HttpHeader {
    const headers = new HttpHeaders({
      // 'Authorization': 'Bearer ' + this.authService.getAccessToken,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*'
    });
    return { headers: headers };
  }

  public getRequestHeadersBlob(): HttpHeaderBlob {

    const headers = new HttpHeaders({
      // 'Authorization': 'Bearer ' + this.authService.getAccessToken,
      'Content-Type': 'application/json',
      'Accept': 'application/pdf'
    });

    return { headers: headers, responseType: 'blob' };
  }

}

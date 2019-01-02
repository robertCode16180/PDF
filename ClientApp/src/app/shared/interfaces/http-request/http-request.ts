import { HttpHeaders } from '@angular/common/http';

export interface HttpHeader {
    headers: HttpHeaders | { [header: string]: string | string[]; };
}

export interface HttpHeaderBlob {
    [header: string]: string | string[] | HttpHeaders;
}

import { Injectable } from '@angular/core';

@Injectable()
export class SessionKeys {

    public static readonly CURRENT_USER = 'current_user';
    public static readonly ACCESS_TOKEN = 'access_token';
    public static readonly TOKEN_EXPIRES_IN = 'expires_in';

}

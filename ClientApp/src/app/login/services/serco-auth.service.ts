import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of, Subject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { UserSession, UserLogin } from '../models/user-session';
import { SessionKeys } from '../../shared/local-store/sessionKeys';
import { LocalStoreManager } from '../../shared/local-store/local-store-manager.service';
import { EndpointFactoryService } from '../../shared/services/endpoint-factory.service';

@Injectable()
export class SercoAuthService {

  public loginRedirectUrl: string;
  private previousIsLoggedInCheck = false;
  private _loginStatus = new Subject<boolean>();

  constructor(private http: HttpClient,
              private localStorage: LocalStoreManager,
              private endpoint: EndpointFactoryService ) {
    this.initializeLoginStatus();
  }

  private initializeLoginStatus() {
    this.localStorage.getInitEvent().subscribe(() => {
      this.reevaluateLoginStatus();
    });
  }

  private reevaluateLoginStatus(currentUser?: UserSession) {

    const user = currentUser || this.localStorage.getDataObject<UserSession>(SessionKeys.CURRENT_USER);
    const isLoggedIn = user != null;
    if (this.previousIsLoggedInCheck !== isLoggedIn) {
      setTimeout(() => {
        this._loginStatus.next(isLoggedIn);
      });
    }
    this.previousIsLoggedInCheck = isLoggedIn;
  }

  get isLoggedIn(): boolean {
    return this.userSession != null;
  }

  get userSession(): UserSession {
    const user = this.localStorage.getDataObject<UserSession>(SessionKeys.CURRENT_USER);
    return user;
  }

  get getAccessToken(): any {

    this.reevaluateLoginStatus();
    return this.localStorage.getData(SessionKeys.ACCESS_TOKEN);
  }

  login<T>(UserAuth: UserLogin): Observable<T> {
    const header = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers: header };
    return this.http.post<T>(`${environment.localHost}/Auth/Login`,
                              UserAuth,
                              this.endpoint.getRequestHeaders() /*options */)
                    .pipe(
                        // debounceTime(200),
                        // tap(console.log),
                        map(response => {
                            // Post successful response
                            return response;
                        }),
                        catchError(this.handleError<any>('SercoResponse'))
                    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
          console.error(`${operation} error: ${error.message}`);
          return of(result as T);
      };
  }

}

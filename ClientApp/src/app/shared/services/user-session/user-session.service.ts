import { Injectable } from '@angular/core';
import { UserSession } from '../../../login/models/user-session';
import { LocalStoreManager } from '../../local-store/local-store-manager.service';

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {

  constructor(public localStorage: LocalStoreManager) { }

  get getUser(): UserSession {
    return this.localStorage.getDataObject<UserSession>();
  }

  get UserName(): string {
    return this.localStorage.getDataObject<UserSession>().name;
  }

  clear(): void {
    this.localStorage.deleteData();
  }

}

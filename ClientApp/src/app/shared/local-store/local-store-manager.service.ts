import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStoreManager {
  private initEvent = new Subject();
  // tslint:disable-next-line:member-ordering
  private static syncListenerInitialised = false;
  // tslint:disable-next-line:member-ordering
  public static readonly DBKEY_USER_DATA = 'current_user';

  public initialiseStorageSyncListener() {
    if (LocalStoreManager.syncListenerInitialised === true) {
      return;
    }
    LocalStoreManager.syncListenerInitialised = true;
    window.addEventListener('storage', this.sessionStorageTransferHandler, false);
  }

  public savePermanentData(key: string, data: any) {
    this.testForInvalidKeys(key);
    this.removeFromSessionStorage(key);
    this.sessionStorageSetItem(key, data);
  }

  public sessionStorageSetItem(key: string, data: any) {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  private testForInvalidKeys(key: string) {
    if (!key) {
      throw new Error('key cannot be empty');
    }
  }

  private removeFromSessionStorage(keyToRemove: string) {
    this.removeFromSessionStorageHelper(keyToRemove);
  }

  private removeFromSessionStorageHelper(keyToRemove: string) {
    sessionStorage.removeItem(keyToRemove);
  }

  public getDataObject<T>(key = LocalStoreManager.DBKEY_USER_DATA): T {
    return JSON.parse(sessionStorage.getItem(key));
  }

  public getData(key = LocalStoreManager.DBKEY_USER_DATA) {

    this.testForInvalidKeys(key);

    const data = this.sessionStorageGetItem(key);

    return data;
  }

  private sessionStorageGetItem(key: string) {
      const value = sessionStorage.getItem(key);
      try {

            return JSON.parse(value);

      } catch (e) {

            if (value === 'undefined') {
                return void 0;
            }
            return value;
      }
  }

  public getInitEvent(): Observable<{}> {
      return this.initEvent.asObservable();
  }

  private sessionStorageTransferHandler = (event: StorageEvent) => {

    if (!event.newValue) {
      return;
    }
    if (event.key === 'setSessionStorage') {

      const data = JSON.parse(event.newValue);
      // tslint:disable-next-line:no-console
      console.info('Set => Key: Transfer setSessionStorage' + ',  data: ' + JSON.stringify(data));
      // for (const key in data) {
      //   if (this.syncKeysContains(key)) {
      //     this.sessionStorageSetItem(key, JSON.parse(data[key]));
      //   }
      // }
      this.onInit();
    }
  }

  private onInit() {
    setTimeout(() => {
      this.initEvent.next();
      this.initEvent.complete();
    });
  }

  public deleteData(key = LocalStoreManager.DBKEY_USER_DATA): void {

    this.removeFromSessionStorage(key);
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
    sessionStorage.clear();
  }

}

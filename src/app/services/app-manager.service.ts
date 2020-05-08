import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class AppManagerService {

  constructor() { }


  public runCount(): Promise<number> {
    return Storage.get({ key: 'run_count' })
      .then(data => {
        return Promise.resolve(data ? Number(JSON.parse(data.value)) : 0);
      })
      .catch(err => { return Promise.reject(err) });
  }


  public incRunCount() {
    this.runCount()
      .then(count => {
        Storage.set({
          key: 'run_count',
          value: Number(count + 1).toString()
        });
        //  .then(() => {Promise.resolve(true);})
        //   .catch(err => { return Promise.reject(false) });
      });
  }
}

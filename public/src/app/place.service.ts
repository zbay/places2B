import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PlaceService {

  constructor(private _http: HttpClient) { }

  search(query, successCallback, failCallback){
    return this._http.post('/api/search', query)
    .toPromise()
    .then((data) => {
      successCallback(data);
    })
    .catch((err) => {
      failCallback(JSON.parse(err._body).error);
    });
  }

  swap(query, successCallback, failCallback){
    return this._http.post('/api/swap', query)
    .toPromise()
    .then((data) => {
      successCallback(data);
    })
    .catch((err) => {
      console.log(err);
      failCallback(JSON.parse(err._body).error);
    });
  }
}

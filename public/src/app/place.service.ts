import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PlaceService {

  constructor(private _http: Http) { }
  
  search(query, successCallback, failCallback){
    return this._http.post('/api/search', query)
    .map(response => response.json())
    .toPromise()
    .then((data) => {
      successCallback(data.results);
    })
    .catch((err) => {
      failCallback(JSON.parse(err._body).error);
    });
  }

  swap(query, successCallback, failCallback){
    return this._http.post('/api/swap', query)
    .map(response => response.json())
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

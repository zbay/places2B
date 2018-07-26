import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../environments/environment';

@Injectable()
export class PlaceService {

  private _latestSearchError = new BehaviorSubject<string>(null)
  private _latestSearchResults = new BehaviorSubject<any>([]);
  private _latestQuery: any = null;
  destNames = [];
  latestSearchError = this._latestSearchError.asObservable();
  latestSearchResults = this._latestSearchResults.asObservable();

  constructor(private _http: HttpClient) { }

  private queryWithDestinationTypes(query){
    let queryTypes = [];
    for(var i = 0; i < query.destinations.length; i++){
        if(queryTypes.indexOf(query.destinations[i].kind) === -1){
            queryTypes.push(query.destinations[i].kind)
        }
    }
    query.queryTypes = queryTypes;
    return query;
  }

  search(query: any): void{
    this._http.post(`${environment.apiEndpoint}/api/search`, this.queryWithDestinationTypes(query))
      .pipe(first())
      .subscribe((data: any) => {
        this._latestQuery = query;
        if(data.results){
          this._latestSearchResults.next(data.results);
        }
      },
      err => {
        console.log(err);
        this._latestSearchError.next(JSON.parse(err._body).error);
      })
  }

  // get swap working again
  swap(category: string, index: number): void{
    const lastQuery = Object.assign({}, this._latestQuery);
    lastQuery.category = category;
    lastQuery.otherDests = this.getNames(); // get the names from latest query names
    console.log(lastQuery);
    this._http.post(`${environment.apiEndpoint}/api/swap`, lastQuery)
      .pipe(first())
      .subscribe((destination: any) => {
        console.log(destination);
        let results = this._latestSearchResults.value;
        results[index] = destination;
        this._latestSearchResults.next(results);
      });
  }

  getNames(): string[]{
    return this._latestSearchResults.value.map(result => result.name);
  }
}

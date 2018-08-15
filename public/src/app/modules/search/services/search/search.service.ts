import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject,
         Subject } from 'rxjs';
import { first, retry } from 'rxjs/operators';

import { environment } from '@env/environment';
import { DestinationResult,
         SearchQuery } from '@models/types';
import { DestinationType } from '@models/enums';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private _isSearchPending = new Subject<boolean>();
  private _latestSearchError = new BehaviorSubject<string>(null);
  private _latestSearchResults = new BehaviorSubject<DestinationResult[]>([]);
  private _latestSwap = new Subject<any>();
  private _latestQuery: SearchQuery = null;
  isSearchPending = this._isSearchPending.asObservable();
  latestSearchError = this._latestSearchError.asObservable();
  latestSwap = this._latestSwap.asObservable();
  latestSearchResults = this._latestSearchResults.asObservable();

  constructor(private _http: HttpClient) { }

  static queryWithDestinationTypes(query: SearchQuery) {
    const queryTypes = [];
    for (let i = 0; i < query.destinations.length; i++) {
        if (queryTypes.indexOf(query.destinations[i].kind) === -1) {
            queryTypes.push(query.destinations[i].kind);
        }
    }
    query.queryTypes = queryTypes;
    return query;
  }

  static getIDs(results: DestinationResult[]): string[] {
    return results.map(result => result.id);
  }

  clearResults() {
    this._latestSearchResults.next([]);
  }

  search(query: SearchQuery): void {
    this._isSearchPending.next(true);
    this._http.post(`${environment.apiEndpoint}/api/search`, SearchService.queryWithDestinationTypes(query))
      .pipe(first())
      .subscribe((data: any) => {
        this._latestQuery = query;
        if (data.results) {
          this._latestSearchResults.next(data.results);
        }
      },
      err => {
        console.log(err.toString());
        this._latestSearchError.next('Failed search!');
      },
      () => this._isSearchPending.next(false));
  }

  swap(category: DestinationType, index: number): void {
    const lastQuery: SearchQuery = Object.assign({}, this._latestQuery);
    lastQuery.category = category;
    lastQuery.otherDestIDs = SearchService.getIDs(this._latestSearchResults.value); // get the names from latest query names
    // console.log(lastQuery);
    this._http.post(`${environment.apiEndpoint}/api/swap`, lastQuery)
      .pipe(first())
      .subscribe((destination: DestinationResult) => {
        this._latestSwap.next({ result: destination, index: index});
      },
        err => {
          this._latestSearchError.next('Failed swap!');
        });
  }
}

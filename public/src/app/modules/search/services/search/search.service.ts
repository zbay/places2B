import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  BehaviorSubject, Observable,
  Subject
} from 'rxjs';
import { first } from 'rxjs/operators';

import { environment } from '@env/environment';
import {
  DestinationResult,
  SearchQuery, SwapEvent, SwapTrigger
} from '@models/types';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  // some of these are public for testing purposes
  private _isSearchPending = new Subject<boolean>();
  private _latestSearchError = new BehaviorSubject<string>(null);
  _latestSearchResults = new BehaviorSubject<DestinationResult[]>([]);
  private _latestSwap = new Subject<any>();
  _latestQuery: SearchQuery = null;

  isSearchPending$: Observable<boolean> = this._isSearchPending.asObservable();
  latestSearchError$: Observable<string> = this._latestSearchError.asObservable();
  latestSwap$: Observable<SwapEvent> = this._latestSwap.asObservable();
  latestSearchResults$: Observable<DestinationResult[]> = this._latestSearchResults.asObservable();

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

  clearResults(): void {
    this._latestSearchResults.next([]);
    this._latestSearchError.next(null);
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

  swap(swapTrigger: SwapTrigger): void {
    const lastQuery: SearchQuery = Object.assign({}, this._latestQuery);
    lastQuery.category = swapTrigger.category;
    lastQuery.otherDestIDs = SearchService.getIDs(this._latestSearchResults.value); // get the names from latest query names
    this._http.post(`${environment.apiEndpoint}/api/swap`, lastQuery)
      .pipe(first())
      .subscribe((destination: DestinationResult) => {
        this._latestSwap.next({ result: destination, index: swapTrigger.index});
      },
        err => {
          this._latestSearchError.next('Failed swap!');
        });
  }
}

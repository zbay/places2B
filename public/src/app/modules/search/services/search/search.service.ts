import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Store, select } from '@ngrx/store';

import {
  BehaviorSubject, Observable,
  Subject
} from 'rxjs';
import { first } from 'rxjs/operators';

import { environment } from '@env/environment';
import {
  DestinationResult,
  SearchQuery, SwapTrigger
} from '@models/types';
import { AppState } from '@app/store/app-state';
import { FullUpdate } from '@app/store/latest-search-results/actions/full-update';
import { NewItemSwap } from '@app/store/latest-search-results/actions/new_item_swap';
import { ClearUpdate } from '@app/store/latest-search-results/actions/clear-update';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  // some of these are public for testing purposes
  private _isSearchPending = new Subject<boolean>();
  private _latestSearchError = new BehaviorSubject<string>(null);
  _latestQuery: SearchQuery = null;

  isSearchPending$: Observable<boolean> = this._isSearchPending.asObservable();
  latestSearchError$: Observable<string> = this._latestSearchError.asObservable();

  constructor(private _http: HttpClient,
              private _store: Store<AppState>) { }

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
    this._store.dispatch(new ClearUpdate());
    this._latestSearchError.next(null);
  }

  search(query: SearchQuery): void {
    this._isSearchPending.next(true);
    this._http.post(`${environment.apiEndpoint}/api/search`, SearchService.queryWithDestinationTypes(query))
      .pipe(first())
      .subscribe((data: {results: DestinationResult[]}) => {
        this._latestQuery = query;
        if (data.results) {
          this._store.dispatch(new FullUpdate(data.results));
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
    this._store.pipe(select('latestSearchResults'), first())
      .subscribe((lastResults) => {
        lastQuery.otherDestIDs = SearchService.getIDs(lastResults); // get the names from latest query names

        this._http.post(`${environment.apiEndpoint}/api/swap`, lastQuery)
          .pipe(first())
          .subscribe((destination: DestinationResult) => {
            this._store.dispatch(new NewItemSwap({ result: destination, index: swapTrigger.index }));
            },
            (err) => {
              this._latestSearchError.next('Failed swap!');
            });
      }, (err) => {
        this._latestSearchError.next('Failed swap!');
      });
  }
}

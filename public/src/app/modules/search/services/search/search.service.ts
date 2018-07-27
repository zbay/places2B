import { HttpClient }       from '@angular/common/http';
import { Injectable }       from '@angular/core';

import { BehaviorSubject }  from 'rxjs';
import { first }            from 'rxjs/operators';

import { environment }      from '@env/environment';
import { DestinationResult,
         SearchQuery }      from '@models/types';
import { DestinationType }  from '@models/enums';

@Injectable()
export class SearchService {

  private _latestSearchError = new BehaviorSubject<string>(null)
  private _latestSearchResults = new BehaviorSubject<DestinationResult[]>([]);
  private _latestQuery: SearchQuery = null;
  latestSearchError = this._latestSearchError.asObservable();
  latestSearchResults = this._latestSearchResults.asObservable();

  constructor(private _http: HttpClient) { }

  private queryWithDestinationTypes(query: SearchQuery) {
    const queryTypes = [];
    for (let i = 0; i < query.destinations.length; i++){
        if (queryTypes.indexOf(query.destinations[i].kind) === -1) {
            queryTypes.push(query.destinations[i].kind);
        }
    }
    query.queryTypes = queryTypes;
    return query;
  }

  search(query: SearchQuery): void{
    this._http.post(`${environment.apiEndpoint}/api/search`, this.queryWithDestinationTypes(query))
      .pipe(first())
      .subscribe((data: any) => {
        this._latestQuery = query;
        if (data.results){
          this._latestSearchResults.next(data.results);
        }
      },
      err => {
        console.log(err);
        this._latestSearchError.next(JSON.parse(err._body).error);
      });
  }

  // get swap working again
  swap(category: DestinationType, index: number): void {
    const lastQuery: SearchQuery = Object.assign({}, this._latestQuery);
    lastQuery.category = category;
    lastQuery.otherDests = this.getNames(); // get the names from latest query names
    console.log(lastQuery);
    this._http.post(`${environment.apiEndpoint}/api/swap`, lastQuery)
      .pipe(first())
      .subscribe((destination: DestinationResult) => {
        console.log(destination);
        const results = this._latestSearchResults.value;
        results[index] = destination;
        this._latestSearchResults.next(results);
      });
  }

  getNames(): string[]{
    return this._latestSearchResults.value.map(result => result.name);
  }
}

import { Component,
         EventEmitter,
         Input,
         OnInit,
         Output }          from '@angular/core';

import { DestinationType } from '@shared/enums';
import { SearchService }   from '@app/services';
import { SearchQuery }     from '@shared/models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  DestinationType = DestinationType;
  errorMessage: string = null;
  searchQuery: SearchQuery = { destinations: [{kind: DestinationType.Restaurants}], city: 'McLean, VA', radius: 25, queryTypes: [] };

  constructor(private _searchService: SearchService) { }

  ngOnInit() {
    this._searchService.latestSearchError.subscribe(err => {
      this.errorMessage = err;
    });
  }

  triggerSearch(){
    this._searchService.search(this.searchQuery);
  }

  addDestination(){
    this.searchQuery.destinations.push({'kind': DestinationType.Restaurants});
  }

  removeDestination(){
    this.searchQuery.destinations.pop();
  }

  setDestination(idx, destination){
    this.searchQuery.destinations[idx] = {kind: destination};
  }

  nothing(){}

}

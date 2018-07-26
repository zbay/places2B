import { Component,
         EventEmitter,
         Input,
         OnInit,
         Output }          from '@angular/core';

import { DestinationType } from '../shared';
import { PlaceService }    from '../place.service';
import { SearchQuery }     from '../shared';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  errorMessage: string = null;
  searchQuery: SearchQuery = { destinations: [{kind: 'restaurants'}], city: 'McLean, VA', radius: 25, queryTypes: [] };

  constructor(private _placeService: PlaceService) { }

  ngOnInit() {
    this._placeService.latestSearchError.subscribe(err => {
      this.errorMessage = err;
    });
  }

  triggerSearch(){
    this._placeService.search(this.searchQuery);
  }

  addDestination(){
    this.searchQuery.destinations.push({'kind': 'restaurants'});
  }

  removeDestination(){
    this.searchQuery.destinations.pop();
  }

  setDestination(idx, destination){
    this.searchQuery.destinations[idx] = {kind: destination};
  }

  nothing(){}

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlaceService } from '../place.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchQuery = {destinations: [{kind: 'restaurants'}], city: 'McLean, VA', radius: 25, queryTypes: []};
  errorMessage: string = null;

  constructor(private _placeService: PlaceService) { }

  ngOnInit() {
    this._placeService.latestSearchError.subscribe(err => {
      this.errorMessage = err;
    });
  }

  triggerSearch(){
    this._placeService.search(this.searchQuery);
    // this.formDataEmitter.emit(this.searchQuery);
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

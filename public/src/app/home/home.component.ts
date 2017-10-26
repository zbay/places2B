import { Component, OnInit } from '@angular/core';
import { PlaceService } from '../place.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  lastQuery = {destinations: [{kind: 'restaurants'}], city: 'McLean, VA', radius: 25, queryTypes: []};
  destinationTypes = ['restaurants', 'active', 'arts', 'nightlife', ''];
  errorMessage;
  searchResults = [];
  destNames = [];

  constructor(private _placeService: PlaceService) { 
    console.log("home component...");
  }

  ngOnInit() {
    console.log("home component");
  }

  search(query){
    query.queryTypes = this.requestedDestinationTypes(query);
    this.lastQuery = query;
    this._placeService.search(query, this.showResults.bind(this), this.showError.bind(this));
  }

  showResults(results){
    console.log(results);
    for(let i = 0; i < results.length; i++){
      let starArray = [];
      for(let s = 0; s < results[i].rating; s++){
        starArray.push(s);
      }
      results[i].starArray = starArray;
    }
    this.searchResults = results;
  }

  showError(err){
    console.log(err);
    this.errorMessage = err;
  }

  requestedDestinationTypes(query){
    var kinds = []
    for(var i = 0; i < query.destinations.length; i++){
        if(kinds.indexOf(query.destinations[i].kind) === -1){
            kinds.push(query.destinations[i].kind)
        }
    }
    return kinds;
  } 

  swapOut(place){
    //send out request to swap a destination for another one in the same category
    let query = {city: this.lastQuery.city, radius: this.lastQuery.city, otherDests: this.getNames(), category: place.category}
    this._placeService.swap(query, (destination) => {
      console.log(destination);
      this.searchResults[place.index] = destination;
    }, this.showError.bind(this));
  }

  getNames(){
    if(this.destNames.length === 0){
      let count = 0;
      for(let i= 0; i < this.searchResults.length; i++){
          this.destNames.push(this.searchResults[i].name);
          count++;
          if(count === this.searchResults.length){
              console.log(this.destNames);
              return this.destNames;
          }
      }
  }   
  else{
    if(this.destNames.length > 33){ // if the memory list gets too long, purge it and replace with the current destinations
        this.destNames = [];
        let count = 0;
        for(let i= 0; i < this.searchResults.length; i++){
            this.destNames.push(this.searchResults[i].name);
            count++;
            if(count === this.searchResults.length){
                console.log(this.destNames);
                return this.destNames;
            }
        }
    }
    console.log(this.destNames);
    return this.destNames;
}
}
}
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

  constructor(private _placeService: PlaceService) { }

  ngOnInit() { }

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

}

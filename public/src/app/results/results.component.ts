import { Component,
         EventEmitter,
         OnInit,
         Input,
         Output }       from '@angular/core';

import { DestinationResult } from '../shared';
import { PlaceService } from '../place.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  searchResults: DestinationResult[] = [];

  constructor(private _placeService: PlaceService) { }

  ngOnInit() {
    this._placeService.latestSearchResults.subscribe(results => {
      this.searchResults = results;
    });
  }

  triggerSwap(category: string, index: number){
    this._placeService.swap(category, index);
  }

}

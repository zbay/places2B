import { Component,
         EventEmitter,
         OnInit,
         Input,
         Output }            from '@angular/core';

import { DestinationResult } from '@shared/models';
import { DestinationType }   from '@shared/enums';
import { SearchService }   from '@app/modules/search/services/search/search.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  searchResults: DestinationResult[] = [];

  constructor(private _searchService: SearchService) { }

  ngOnInit() {
    this._searchService.latestSearchResults.subscribe(results => {
      this.searchResults = results;
    });
  }

  triggerSwap(category: DestinationType, index: number){
    this._searchService.swap(category, index);
  }

}

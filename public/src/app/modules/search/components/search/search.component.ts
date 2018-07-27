import { Component,
         OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { DestinationType } from '@models/enums';
import { SearchService } from '@app/modules/search/services/search/search.service';
import { SearchQuery } from '@models/types';
import { SubscribingComponent } from '@app/modules/shared/components/subscribing/subscribing.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent extends SubscribingComponent implements OnInit {
  DestinationType = DestinationType;
  errorMessage: string = null;
  searchQuery: SearchQuery = { destinations: [{kind: DestinationType.Restaurants}], city: 'McLean, VA', radius: 25, queryTypes: [] };

  constructor(private _searchService: SearchService) {
    super();
   }

  ngOnInit() {
    this._searchService.latestSearchError
      .pipe(takeUntil(this.destroy$))
      .subscribe((err: string) => {
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

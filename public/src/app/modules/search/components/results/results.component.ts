import { Component,
         OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { DestinationResult } from '@models/types';
import { DestinationType } from '@models/enums';
import { SearchService } from '@app/modules/search/services/search/search.service';
import { SubscribingComponent } from '@app/modules/shared/components/subscribing/subscribing.component';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent extends SubscribingComponent implements OnInit {
  searchResults: DestinationResult[] = [];

  constructor(private _searchService: SearchService) {
    super();
  }

  ngOnInit() {
    this._searchService.latestSearchResults
      .pipe(takeUntil(this.destroy$))
      .subscribe(results => {
        this.searchResults = results;
      });
  }

  triggerSwap(category: DestinationType, index: number){
    this._searchService.swap(category, index);
  }

}

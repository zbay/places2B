import { Component,
         OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { DestinationResult } from '@models/types';
import { DestinationType } from '@models/enums';
import { SearchService } from '@app/modules/search/services/search/search.service';
import { SubscribingComponent } from '@app/modules/shared/components/subscribing/subscribing.component';
import { Animations } from '@models/animations';

@Component({
  animations: [Animations.fadeIn, Animations.fadeSwap],
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent extends SubscribingComponent implements OnInit {
  searchResults: DestinationResult[] = [];

  constructor(private _searchService: SearchService) {
    super();
  }

  private slowSwap(oldResult: DestinationResult, newResult: DestinationResult): void {
    oldResult.swapStatus = 'beginSwap';
    setTimeout(() => {
      for (const key in oldResult) {
        if (oldResult.hasOwnProperty(key) && key !== 'swapStatus') {
          oldResult[key] = newResult[key];
        }
      }
      oldResult.swapStatus = 'finishSwap';
    }, 300);
  }

  ngOnInit() {

    this._searchService.latestSearchResults
      .pipe(takeUntil(this.destroy$))
      .subscribe(results => {
        this.searchResults = results;
      });

    this._searchService.latestSwap
      .pipe(takeUntil(this.destroy$))
      .subscribe((swapEvent: { index: number, result: DestinationResult}) => {
        this.slowSwap(this.searchResults[swapEvent.index], swapEvent.result);
      });

  }

  triggerSwap(category: DestinationType, idx: number) {
    this._searchService.swap(category, idx);
  }

}

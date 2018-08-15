import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { Animations } from '@models/animations';
import { DestinationResult, SwapEvent } from '@models/types';
import { DestinationType } from '@models/enums';
import { SearchService } from '@app/modules/search/services/search/search.service';
import { SubscribingComponent } from '@app/modules/shared/components/subscribing/subscribing.component';

@Component({
  animations: [Animations.fadeIn, Animations.scaleHorizAndFadeIn, Animations.scaleVertFadeSwap],
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent extends SubscribingComponent implements OnInit, OnDestroy {
  searchResults: DestinationResult[] = [];

  constructor(private _searchService: SearchService) {
    super();
  }

  private slowSwap(oldResult: DestinationResult, newResult: DestinationResult): void {
    oldResult.swapStatus = 'hidden';
    setTimeout(() => {
      for (const key in oldResult) {
        if (oldResult.hasOwnProperty(key) && key !== 'swapStatus') {
          oldResult[key] = newResult[key];
        }
      }
      setTimeout(() => { oldResult.swapStatus = 'showing'; }, 300);
    }, 300);
  }

  ngOnInit() {

    this._searchService.latestSearchResults$
      .pipe(takeUntil(this.destroy$))
      .subscribe(results => {
        this.searchResults = results;
      });

    this._searchService.latestSwap$
      .pipe(takeUntil(this.destroy$))
      .subscribe((swapEvent: SwapEvent) => {
        this.slowSwap(this.searchResults[swapEvent.index], swapEvent.result);
      });

  }

  ngOnDestroy() {
    this._searchService.clearResults();
  }

  triggerSwap(category: DestinationType, idx: number) {
    this._searchService.swap(category, idx);
  }

}

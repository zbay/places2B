import { Component, OnDestroy, OnInit } from '@angular/core';

import { takeUntil } from 'rxjs/operators';

import { Animations } from '@models/animations';
import { DestinationResult, SwapEvent, SwapTrigger } from '@models/types';
import { SearchService } from '@app/modules/search/services/search/search.service';
import { SubscribingComponent } from '@app/modules/shared/components/subscribing/subscribing.component';

enum DisplayType {
  LIST = 'list',
  MAP = 'map'
}

@Component({
  animations: [Animations.fadeIn,
    Animations.scaleHorizAndFadeIn,
    Animations.scaleVertFadeSwap],
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent extends SubscribingComponent implements OnInit, OnDestroy {
  // displayType: DisplayType = DisplayType.LIST;
  DisplayType = DisplayType;
  hasLoaded = false;
  searchResults: DestinationResult[] = [];
  mapStatus = 'hidden';

  constructor(private _searchService: SearchService) {
    super();
  }

  static slowSwap(oldResult: DestinationResult, newResult: DestinationResult): void {
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
        // this.searchResults = results;
        if (!this.hasLoaded) {
          this.searchResults = results;
        } else {
          if (results.length < this.searchResults.length) {
            this.searchResults = results.slice(0, results.length);
          }
          for (let i = 0; i < this.searchResults.length; i++) {
            if (this.searchResults[i].id !== results[i].id) {
              ResultsComponent.slowSwap(this.searchResults[i], results[i]);
            }
          }
          for (let i = this.searchResults.length; i < results.length; i++) {
            this.searchResults.push(results[i]);
          }
        }
        this.hasLoaded = !!this.searchResults.length;
      });

    this._searchService.latestSwap$
      .pipe(takeUntil(this.destroy$))
      .subscribe((swapEvent: SwapEvent) => {
        ResultsComponent.slowSwap(this.searchResults[swapEvent.index], swapEvent.result);
      });
  }

  ngOnDestroy() {
    this._searchService.clearResults();
  }

  changeDisplayType(displayType: DisplayType) {
    // this.displayType = displayType;
    this.mapStatus = displayType === DisplayType.MAP ? 'showing' : 'hidden';
  }

  triggerSwap(swapTrigger: SwapTrigger) {
    this._searchService.swap(swapTrigger);
  }

}

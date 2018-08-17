import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { Animations } from '@models/animations';
import { DestinationResult, SwapTrigger } from '@models/types';
import { SearchService } from '@app/modules/search/services/search/search.service';
import { SubscribingComponent } from '@app/modules/shared/components/subscribing/subscribing.component';
import { AppState } from '@app/store/app-state';

@Component({
  animations: [Animations.fadeIn, Animations.scaleHorizAndFadeIn, Animations.scaleVertFadeSwap],
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent extends SubscribingComponent implements OnInit, OnDestroy {
  hasLoaded = false;
  searchResults: DestinationResult[] = [];

  constructor(private _searchService: SearchService,
              private _store: Store<AppState>) {
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
    this._store.pipe(
      select('latestSearchResults'),
      takeUntil(this.destroy$)
    ).subscribe((results: DestinationResult[]) => {
      // On load: set whole array. On re-search or swap: slow swap for smoother transition
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
  }

  ngOnDestroy() {
    this._searchService.clearResults();
  }

  triggerSwap(swapTrigger: SwapTrigger) {
    this._searchService.swap(swapTrigger);
  }

}

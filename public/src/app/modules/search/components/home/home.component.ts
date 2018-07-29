import { Component,
         OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { SearchService } from '@app/modules/search/services/search/search.service';
import { SubscribingComponent } from '@app/modules/shared/components/subscribing/subscribing.component';

@Component({
  animations: [],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends SubscribingComponent implements OnInit {
  isLoading = false;

  constructor(private _searchService: SearchService) {
    super();
  }

  ngOnInit() {
    this._searchService.isSearchPending
      .pipe(takeUntil(this.destroy$))
      .subscribe((changedLoadingStatus: boolean) => {
        this.isLoading = changedLoadingStatus;
      });
  }

}

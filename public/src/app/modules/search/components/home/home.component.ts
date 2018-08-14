import { Component,
         OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';

import { takeUntil } from 'rxjs/operators';

import { SearchService } from '@app/modules/search/services/search/search.service';
import { SubscribingComponent } from '@app/modules/shared/components/subscribing/subscribing.component';
import { ErrorDialogComponent } from '@app/modules/shared/components/error-dialog/error-dialog/error-dialog.component';

@Component({
  animations: [],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends SubscribingComponent implements OnInit {
  isLoading = false;

  constructor(private _dialog: MatDialog,
    private _searchService: SearchService) {
    super();
  }

  ngOnInit() {
    this._searchService.isSearchPending
      .pipe(takeUntil(this.destroy$))
      .subscribe((changedLoadingStatus: boolean) => {
        this.isLoading = changedLoadingStatus;
      });

    this._searchService.latestSearchError
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: string) => {
        if (error) {
          console.log(error);
          this.openErrorDialog();
        }
      });
  }

  openErrorDialog(message?: string) {
    this.isLoading = false;
    const dialogConfig: MatDialogConfig =  {
      disableClose: false,
      autoFocus: true,
      minHeight: '20%',
      maxHeight: '60%',
      minWidth: '40%',
      maxWidth: '90%',
      panelClass: 'p2b-theme',
      data: {
        message: message || 'Places 2B is experiencing technical difficulties. Please try to search again later.'
      }
    };

    this._dialog.open(ErrorDialogComponent, dialogConfig);
  }

}

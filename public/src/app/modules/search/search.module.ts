import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/modules/shared/shared.module';

import { SearchRoutingModule } from '@app/modules/search/search-routing.module';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { ResultsComponent } from './components/results/results.component';
import { SearchService } from '@app/modules/search/services/search/search.service';
import { ErrorDialogComponent } from '@app/modules/shared/components/error-dialog/error-dialog/error-dialog.component';
import { ResultComponent } from './components/result/result.component';
import { MapModule } from '@app/modules/map/map.module';

@NgModule({
  declarations: [
    HomeComponent,
    SearchComponent,
    ResultsComponent,
    ResultComponent
  ],
  imports: [
    MapModule,
    SearchRoutingModule,
    SharedModule,
    HttpClientModule
  ],
  providers: [SearchService],
  entryComponents: [ErrorDialogComponent]
})
export class SearchModule { }

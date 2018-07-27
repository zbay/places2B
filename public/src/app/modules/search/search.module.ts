import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SearchRoutingModule } from '@app/modules/search/search-routing.module';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { ResultsComponent } from './components/results/results.component';
import { SearchService }   from '@app/modules/search/services/search/search.service';

@NgModule({
  declarations: [
    HomeComponent,
    SearchComponent,
    ResultsComponent
  ],
  imports: [
    CommonModule,
    SearchRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [SearchService]
})
export class SearchModule { }

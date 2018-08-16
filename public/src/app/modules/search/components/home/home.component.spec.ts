import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import 'hammerjs';

import { HomeComponent } from './home.component';
import { SharedModule } from '@app/modules/shared/shared.module';
import { SearchService } from '@app/modules/search/services/search/search.service';
import { Component } from '@angular/core';
import { from, of } from 'rxjs';

@Component({
  selector: 'app-results',
  template: '<p>Mock Results Component</p>'
})
class MockResultsComponent {}

@Component({
  selector: 'app-search',
  template: '<p>Mock Search Component</p>'
})
class MockSearchComponent {}


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  // let searchService;

  const searchServiceMock: Partial<SearchService> = {
    clearResults: () => {},
    // swap: (category: DestinationType, index: number) => {},
    latestSearchError$: from('Error!'),
    isSearchPending$: of(true)
    // latestSwap$: of({ result: destinationResults[1], index: 1 })
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent, MockResultsComponent, MockSearchComponent ],
      imports: [ SharedModule, NoopAnimationsModule ],
      providers: [ MatDialog,
        { provide: SearchService, useValue: searchServiceMock } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

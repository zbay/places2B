import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { of } from 'rxjs';

import { ResultsComponent } from './results.component';
import { MaterialModule } from '@app/modules/material/material.module';
import { SearchService } from '@app/modules/search/services/search/search.service';
import { DestinationType } from '@models/enums';
import { DestinationResult, SwapTrigger } from '@models/types';
import { ResultComponent } from '@app/modules/search/components/result/result.component';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;
  let searchService;
  let swapSpy;
  let debugElement: DebugElement;

  const destinationResults: DestinationResult[] = [{
      id: '1',
      category: DestinationType.Restaurants,
      image_url: 'https://www.image.com/img.jpg',
      loc: 'Loc',
      name: 'Name',
      price: '$',
      phone: '1234567890',
      rating: ['*'],
      reviews: '1243'
    },
    {
      id: '2',
      category: DestinationType.Nightlife,
      image_url: 'https://www.image.com/img2.jpg',
      loc: 'Location',
      name: 'Name 2',
      price: '$$',
      phone: '1234567891',
      rating: ['*', '*'],
      reviews: '1244'
    }];

  const searchServiceMock: Partial<SearchService> = {
    clearResults: () => {},
    swap: (swapTrigger: SwapTrigger) => {},
    latestSearchResults$: of(destinationResults),
    latestSwap$: of({ result: destinationResults[1], index: 1 })
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultComponent, ResultsComponent ],
      imports: [ MaterialModule, NoopAnimationsModule ],
      providers: [ { provide: SearchService, useValue: searchServiceMock } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    debugElement = fixture.debugElement;
    searchService = debugElement.injector.get(SearchService);
    swapSpy = spyOn(searchService, 'swap').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('triggerSwap', () => {
    it('should trigger swap', () => {
      component.triggerSwap({category: DestinationType.Nightlife, index: 1});
      expect(swapSpy).toHaveBeenCalled();
    });
  });

  describe('slowSwap', () => {
    it('should swap values', () => {
      component.searchResults = destinationResults;
      expect(component.searchResults[0]).toEqual(destinationResults[0]);
      ResultsComponent.slowSwap(destinationResults[0], destinationResults[1]);
      setTimeout(() => {
        expect(component.searchResults[0]).toEqual(destinationResults[1]);
      }, 1000);
    });
  });
});

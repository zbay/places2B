import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';


import { ResultsComponent } from './results.component';
import { MaterialModule } from '@app/modules/material/material.module';
import { SearchService } from '@app/modules/search/services/search/search.service';
import { DestinationType } from '@models/enums';
import { DestinationResult } from '@models/types';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;
  const destinationResults: DestinationResult[] = [{
      id: '1',
      category: 'restaurants',
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
      category: 'nightlife',
      image_url: 'https://www.image.com/img2.jpg',
      loc: 'Location',
      name: 'Name 2',
      price: '$$',
      phone: '1234567891',
      rating: ['*', '*'],
      reviews: '1244'
    }];

  const searchServiceStub: Partial<SearchService> = {
    clearResults: () => {},
    swap: (category: DestinationType, index: number) => {},
    latestSearchResults$: of(destinationResults),
    latestSwap$: of({ result: destinationResults[1], index: 1 })
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsComponent ],
      imports: [ MaterialModule, NoopAnimationsModule ],
      providers: [ {provide: SearchService, useValue: searchServiceStub } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

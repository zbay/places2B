import { TestBed, inject } from '@angular/core/testing';

import { SearchService } from './search.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { DestinationResult, SearchQuery } from '@models/types';
import { environment } from '@env/environment';
import { filter, skip } from 'rxjs/operators';

describe('SearchService', () => {
  const searchUrl = `${environment.apiEndpoint}/api/search`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [SearchService]
    });
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  it('should be created', inject([SearchService],
    (service: SearchService) => {
    expect(service).toBeTruthy();
  }));

  describe('search', () => {
    const searchQuery: SearchQuery = { city: 'Testburg, TN',
      radius: 25,
      price: '1,2,3',
      destinations: [{ kind: 'restaurants' }, { kind: 'nightlife' }]
    };
    const destinationResults: { results: DestinationResult[] } = { results: [{
        id: '1',
        category: 'restaurants',
        image_url: 'https://www.image.com/img.jpg',
        loc: 'Loc',
        name: 'Name',
        price: '$',
        phone: '1234567890',
        rating: ['*'],
        reviews: '1243'
      }]};

    it('should retrieve search results', (done: DoneFn) => { inject([SearchService, HttpTestingController],
      (service: SearchService, httpMock: HttpTestingController) => {
        // skip the first result, because it's a BehaviorSubject
        service.latestSearchResults
          .pipe(
            skip(1)
          )
          .subscribe((queries) => {
            expect(queries).toEqual(destinationResults.results);
            done();
          });

        service.search(searchQuery);

        const req = httpMock.expectOne(searchUrl);
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(searchQuery);
        req.flush(destinationResults);
      })();
    });

    it('should handle errors', (done: DoneFn) => { inject([SearchService, HttpTestingController],
      (service: SearchService, httpMock: HttpTestingController) => {
        // skip the first result, because it's a BehaviorSubject
        service.latestSearchError
          .pipe(skip(1))
          .subscribe((err) => {
            expect(err).toBeTruthy();
            done();
          });

        service.search(searchQuery);
        const req = httpMock.expectOne(searchUrl);
        req.error(new ErrorEvent('FAILED SEARCH'));
      })();
    });
  });
});

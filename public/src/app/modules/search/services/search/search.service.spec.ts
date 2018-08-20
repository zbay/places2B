import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';

import { skip } from 'rxjs/operators';

import { DestinationResult, SearchQuery } from '@models/types';
import { DestinationType } from '@models/enums';
import { environment } from '@env/environment';
import { SearchService } from './search.service';

describe('SearchService', () => {
  const searchUrl = `${environment.apiEndpoint}/api/search`;
  const swapUrl = `${environment.apiEndpoint}/api/swap`;
  const searchQuery: SearchQuery = { city: 'Testburg, TN',
    radius: 25,
    price: '1,2,3',
    destinations: [{ kind: 'restaurants' }, { kind: 'nightlife' }]
  };
  const destinationResults: DestinationResult[] = [{
    id: '1',
    category: DestinationType.Restaurants,
    image_url: 'https://www.image.com/img.jpg',
    loc: 'Loc',
    name: 'Name',
    price: '$',
    phone: '1234567890',
    rating: ['*'],
    reviews: '1243',
    coordinates: {
      latitude: 1.0,
      longitude: 2.0
    },
    url: 'https://www.abc.com'
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
      reviews: '1244',
      coordinates: {
        latitude: 1.1,
        longitude: 2.1
      },
      url: 'https://www.abc.com/'
    }];
  const swappedResult: DestinationResult = {
    id: '2',
    category: DestinationType.Nightlife,
    image_url: 'https://www.image.com/img2.jpg',
    loc: 'Location',
    name: 'Name 2',
    price: '$$',
    phone: '1234567891',
    rating: ['*', '*'],
    reviews: '1244',
    coordinates: {
      latitude: 1.1,
      longitude: 2.1
    },
    url: 'https://www.abc.com/'
  };

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

  describe('queryWithDestinationTypes', () => {
    it('should extract distinct destination types', inject([SearchService], (service: SearchService) => {
      const results = destinationResults;
      expect(SearchService.queryWithDestinationTypes(searchQuery).queryTypes)
        .toEqual([DestinationType.Restaurants, DestinationType.Nightlife]);
    }));
  });

  describe('getIDs', () => {
    it('should extract IDs', inject([SearchService], (service: SearchService) => {
      const results = destinationResults;
      expect(SearchService.getIDs(results)).toEqual([results[0].id, results[1].id]);
    }));
  });

  describe('search', () => {
    it('should retrieve search results', (done: DoneFn) => { inject([SearchService, HttpTestingController],
      (service: SearchService, httpMock: HttpTestingController) => {
        // skip the first result, because it's a BehaviorSubject
        service.latestSearchResults$
          .pipe(
            skip(1)
          )
          .subscribe((queries) => {
            expect(queries).toEqual(destinationResults);
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
        service.latestSearchError$
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

  describe('swap', () => {
    const SWAP_INDEX = 1;

    it('should swap result', (done: DoneFn) => { inject([SearchService, HttpTestingController],
      (service: SearchService, httpMock: HttpTestingController) => {
        service.latestSwap$
          .subscribe((result) => {
            expect(result.result).toEqual(swappedResult);
            expect(result.index).toEqual(SWAP_INDEX);
            done();
          });

        service._latestQuery = searchQuery;
        service._latestSearchResults.next(destinationResults);
        const lastQuery: SearchQuery = Object.assign({}, service._latestQuery);
        lastQuery.category = DestinationType.Nightlife;
        lastQuery.otherDestIDs = SearchService.getIDs(service._latestSearchResults.value);

        service.swap({category: DestinationType.Nightlife, index: SWAP_INDEX});

        const req = httpMock.expectOne(swapUrl);
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(lastQuery);
        req.flush(swappedResult);
      })();
    });
  });
});

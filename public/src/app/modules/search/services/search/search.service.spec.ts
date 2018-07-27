import { TestBed, inject } from '@angular/core/testing';

import { PlaceService } from './search.service';

describe('SearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchService]
    });
  });

  it('should be created', inject([PlaceService], (service: SearchService) => {
    expect(service).toBeTruthy();
  }));
});

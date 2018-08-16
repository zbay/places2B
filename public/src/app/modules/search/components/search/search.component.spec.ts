import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '../../../../../../node_modules/@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SearchComponent } from './search.component';
import { SharedModule } from '@app/modules/shared/shared.module';
import { SearchService } from '@app/modules/search/services/search/search.service';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchComponent ],
      imports: [ HttpClientTestingModule,
        NoopAnimationsModule,
        SharedModule ],
      providers: [ SearchService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addDestination and removeDestination', () => {
    it('should add/remove destinations from form', () => {
      expect(component.destinations.length).toBe(1);
      component.addDestination();
      expect(component.destinations.length).toBe(2);
      component.removeDestination();
      expect(component.destinations.length).toBe(1);
    });
  });

  describe('toggleSearch', () => {
    it('should toggle search', () => {
      expect(component.isSearchOpen).toBe(true);
      component.toggleSearchOpen();
      expect(component.isSearchOpen).toBe(false);
      component.toggleSearchOpen();
      expect(component.isSearchOpen).toBe(true);
    });
  });

  describe('toPriceString', () => {
    it('should produce the right price strings', () => {
      expect(SearchComponent.toPriceString(1, 4)).toEqual('1,2,3,4');
      expect(SearchComponent.toPriceString(2, 3)).toEqual('2,3');
    });
  });

  describe('triggerSearch', () => {
    it('should trigger search', () => {
      expect(component.isSearchOpen).toBe(true);
      expect(component.hasSubmitted).toBe(false);
      component.triggerSearch();
      expect(component.isSearchOpen).toBe(false);
      expect(component.hasSubmitted).toBe(true);
    });
  });
});

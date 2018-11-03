import { AbstractControl,
         FormArray,
         FormBuilder,
         FormGroup,
         Validators } from '@angular/forms';
import { Component,
         OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { Animations } from '@models/animations';
import { Countries } from '@models/arrays/countries';
import { Country } from '@models/types/country';
import { DestinationType } from '@models/enums';
import { DestinationTypes } from '@models/arrays/destination-types';
import { SearchQuery } from '@models/types';
import { SearchRadiusValidator } from '@app/modules/search/validators/search-radius/search-radius-validator';
import { SearchService } from '@app/modules/search/services/search/search.service';
import { SubscribingComponent } from '@app/modules/shared/components/subscribing/subscribing.component';

@Component({
  animations: [Animations.fadeIn],
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent extends SubscribingComponent implements OnInit {
  countries = Countries;
  DestinationType = DestinationType;
  destinationTypes = DestinationTypes;
  fb = new FormBuilder();
  optionsGroup: FormGroup = this.fb.group({
    filterByPrice: [false, Validators.required],
    minPrice: [{value: 1, disabled: true}, Validators.required],
    maxPrice: [{value: 4, disabled: true}, Validators.required]
  });
  locationGroup: FormGroup = this.fb.group({
    city: ['Alexandria, VA', Validators.required],
    country: [{code: 'US', name: 'United States'}, Validators.required],
    radius: [25, [Validators.required, SearchRadiusValidator]]});
  destinationsGroup: FormGroup = this.fb.group({
    destinations: this.fb.array([
      this.fb.control(this.DestinationType.Restaurants, Validators.required)
    ])
  });
  hasSubmitted = false;
  isSearchOpen = true;

  static toPriceString(min: number, max: number): string {
    let priceString = '';
    for (let i = min; i <= max; i++) {
      priceString += i;
      if (i !== max) {
        priceString += ',';
      }
    }
    return priceString;
  }

  get destinations() {
    return this.destinationsGroup.get('destinations') as FormArray;
  }

  addDestination() {
    this.destinations.push(this.fb.control(this.DestinationType.Restaurants, Validators.required));
  }

  constructor(private _searchService: SearchService) {
    super();
   }

  ngOnInit() {
    this._searchService.latestSearchError$
      .pipe(takeUntil(this.destroy$))
      .subscribe((err: string) => {
        this.isSearchOpen = true;
        this.hasSubmitted = false;
      });

    // automatically adjust price sliders if the user puts them in a contradictory state
    this.optionsGroup.get('minPrice').valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((minPrice) => {
        if (minPrice === 0) {
          this.optionsGroup.controls.minPrice.setValue(1);
        } else if (minPrice > this.optionsGroup.get('maxPrice').value) {
          this.optionsGroup.controls.maxPrice.setValue(minPrice);
        }
      });
    this.optionsGroup.get('maxPrice').valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((maxPrice) => {
        if (maxPrice === 0) {
          this.optionsGroup.controls.maxPrice.setValue(1);
        } else if (maxPrice < this.optionsGroup.get('minPrice').value) {
          this.optionsGroup.controls.minPrice.setValue(maxPrice);
        }
      });

    this.optionsGroup.get('filterByPrice').valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((isFiltering) => {
        if (!isFiltering) {
          this.optionsGroup.controls.minPrice.disable();
          this.optionsGroup.controls.maxPrice.disable();
        } else {
          this.optionsGroup.controls.minPrice.enable();
          this.optionsGroup.controls.maxPrice.enable();
        }
      });
  }

  removeDestination() {
    this.destinations.removeAt(this.destinations.length - 1);
  }

  toggleSearchOpen() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  triggerSearch() {
    // console.log(this.locationGroup.value);
    const searchQuery: SearchQuery = {
      city: '' + this.locationGroup.get('city').value,
      country: '' + this.locationGroup.get('country').value.code,
      radius: parseInt(this.locationGroup.get('radius').value, 10),
      price: this.optionsGroup.get('filterByPrice').value ?
        SearchComponent.toPriceString(this.optionsGroup.get('minPrice').value, this.optionsGroup.get('maxPrice').value)
        : undefined,
      destinations: this.destinations.controls
        .map((dest: AbstractControl) => ({kind: '' + dest.value}))
    };
    // console.log(searchQuery);
    this._searchService.search(searchQuery);
    this.isSearchOpen = false;
    this.hasSubmitted = true;
  }

  // used in the HTML
  public compareCountries(c1: Country, c2: Country) {
    return c1 && c2 && c1.code === c2.code;
  }

}

import { AbstractControl,
         FormArray,
         FormBuilder,
         FormGroup,
         Validators } from '@angular/forms';
import { Component,
         OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { DestinationType } from '@models/enums';
import { DestinationTypes } from '@models/arrays/destination-types';
import { SearchQuery } from '@models/types';
import { SearchRadiusValidator } from '@app/modules/search/validators/search-radius/search-radius-validator';
import { SearchService } from '@app/modules/search/services/search/search.service';
import { SubscribingComponent } from '@app/modules/shared/components/subscribing/subscribing.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent extends SubscribingComponent implements OnInit {
  DestinationType = DestinationType;
  destinationTypes = DestinationTypes;
  fb = new FormBuilder();
  optionsGroup: FormGroup = this.fb.group({
    nothing: ['']
  });
  locationGroup: FormGroup = this.fb.group({
    city: ['Alexandria, VA', Validators.required],
    radius: [25, [Validators.required, SearchRadiusValidator]]});
  destinationsGroup: FormGroup = this.fb.group({
    destinations: this.fb.array([
      this.fb.control(this.DestinationType.Restaurants, Validators.required)
    ])
  });
  hasSubmitted = false;
  isSearchOpen = true;

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
    this._searchService.latestSearchError
      .pipe(takeUntil(this.destroy$))
      .subscribe((err: string) => {
        this.isSearchOpen = true;
        this.hasSubmitted = false;
      });
  }

  removeDestination() {
    this.destinations.removeAt(this.destinations.length - 1);
  }

  toggleSearchOpen() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  triggerSearch() {
    const searchQuery: SearchQuery = { city: '' + this.locationGroup.get('city').value,
      radius: parseInt(this.locationGroup.get('radius').value, 10),
      destinations: this.destinations.controls
        .map((dest: AbstractControl) => ({kind: '' + dest.value}))
    };
    console.log(searchQuery);
    this._searchService.search(searchQuery);
    this.isSearchOpen = false;
    this.hasSubmitted = true;
  }

}

import { Component,
         OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { DestinationType } from '@models/enums';
import { SearchService } from '@app/modules/search/services/search/search.service';
import { SearchQuery } from '@models/types';
import { SubscribingComponent } from '@app/modules/shared/components/subscribing/subscribing.component';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DestinationTypes } from '@models/arrays/destination-types';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent extends SubscribingComponent implements OnInit {
  DestinationType = DestinationType;
  destinationTypes = DestinationTypes;
  errorMessage: string = null;
  fb = new FormBuilder();
  searchForm: FormGroup = this.fb.group({
    city: ['Alexandria, VA', Validators.required],
    radius: [25, Validators.required],
    destinations: this.fb.array([
      this.fb.control(this.DestinationType.Restaurants, Validators.required)
    ])
  });

  get destinations() {
    return this.searchForm.get('destinations') as FormArray;
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
        // TODO: display error
        this.errorMessage = err;
      });
  }

  removeDestination() {
    this.destinations.removeAt(this.destinations.length - 1);
  }

  triggerSearch() {
    console.log(this.destinations.controls);
    const searchQuery: SearchQuery = { city: '' + this.searchForm.get('city').value,
      radius: parseInt(this.searchForm.get('radius').value, 10),
      destinations: this.destinations.controls
        .map((dest: AbstractControl) => ({kind: '' + dest.value}))
    };
    console.log(searchQuery);
    this._searchService.search(searchQuery);
  }

}

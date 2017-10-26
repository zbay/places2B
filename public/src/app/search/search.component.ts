import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchQuery = {destinations: [{kind: 'restaurants'}], city: 'McLean, VA', radius: 25, queryTypes: []};
  @Output() formDataEmitter = new EventEmitter();
  @Input() errorMessage;
  

  constructor() {
    console.log("search component");
   }

  ngOnInit() {
  }

  triggerSearch(){
    this.formDataEmitter.emit(this.searchQuery);
  }

  addDestination(){
    this.searchQuery.destinations.push({'kind': 'restaurants'});
  }

  removeDestination(){
    this.searchQuery.destinations.pop();
  }

  setDestination(idx, destination){
    this.searchQuery.destinations[idx] = {kind: destination};
  }

  nothing(){}

}

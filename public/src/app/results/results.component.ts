import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  @Input() searchResults;
  @Output() swapEmitter = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  triggerSwap(category, index){
    this.swapEmitter.emit({category: category, index: index});
  }

}

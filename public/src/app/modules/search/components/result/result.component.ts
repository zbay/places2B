import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Animations } from '@models/animations';
import { DestinationResult } from '@models/types';
import { SwapTrigger } from '@models/types/swap-trigger';

@Component({
  animations: [Animations.scaleVertFadeSwap],
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  @Input() destination: DestinationResult;
  @Input() index: number;
  @Output() swapped = new EventEmitter<SwapTrigger>();

  constructor() { }

  ngOnInit() {
  }

  swap() {
    this.swapped.emit({category: this.destination.category, index: this.index});
  }

}

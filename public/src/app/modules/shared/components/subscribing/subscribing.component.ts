import { Component,
         OnDestroy } from '@angular/core';
import { Subject }   from 'rxjs';

// Extending this component facilitates auto-unsubscribe
@Component({
  selector: 'app-subscribing',
  template: '',
  styleUrls: []
})
export class SubscribingComponent implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor() {
    console.log('subsriber initializing');
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    console.log('unsubscribed!');
    this.destroy$.unsubscribe();
  }

}

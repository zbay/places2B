import { Component,
         OnInit } from '@angular/core';

import { Animations } from '../../models/animations';

@Component({
  animations: [Animations.fadeIn],
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

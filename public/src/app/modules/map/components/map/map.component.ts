import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { latLng, tileLayer } from 'leaflet';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 5,
    center: latLng(46.879966, -121.726909)
  };

  constructor() {}

  ngOnInit() {
  }

}

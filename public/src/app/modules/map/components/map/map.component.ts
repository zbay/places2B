import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { Icon, latLng, marker, tileLayer } from 'leaflet';
import { DestinationResult } from '@models/types';
import { DestinationType } from '@models/enums';

const MarkerIcon = Icon.extend({
  options: {
    iconSize:     [30, 70],
    shadowSize:   [50, 64],
    iconAnchor:   [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor:  [-3, -76]
  }
});

const drinkIcon = new MarkerIcon({iconUrl: '../../assets/map_marker-drink.png'});
const foodIcon = new MarkerIcon({iconUrl: '../../assets/map_marker-food.png'});
const activeIcon = new MarkerIcon({iconUrl: '../../assets/map_marker-active.png'});
const musicIcon = new MarkerIcon({iconUrl: '../../assets/map_marker-music.png'});
const emptyIcon = new MarkerIcon({iconUrl: '../../assets/map_marker-red.png'});

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Input() searchResults: DestinationResult[] = [];

  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 10,
    center: latLng(46.879966, -121.726909)
  };
  layers = [];

  constructor() {}

  static getIcon(category: DestinationType): Icon {
    switch (category) {
      case DestinationType.Restaurants:
        return foodIcon;
      case DestinationType.Nightlife:
        return drinkIcon;
      case DestinationType.Active:
        return activeIcon;
      case DestinationType.Arts:
        return musicIcon;
      default:
        return emptyIcon;
    }
  }

  ngOnInit() {
    this.centerMap();
    this.searchResults.map((result) => {
      this.layers.push(marker([result.coordinates.latitude, result.coordinates.longitude],
        {title: result.name, icon: MapComponent.getIcon(result.category) }));
    });
  }

  centerMap() {
    const centerCoordinates = this.searchResults
      .reduce((sumOfCoordinates, searchResults) => {
        return [sumOfCoordinates[0] + (searchResults.coordinates.latitude / this.searchResults.length),
          sumOfCoordinates[1] + (searchResults.coordinates.longitude / this.searchResults.length)];
      }, [0, 0]);
    this.options.center = latLng(centerCoordinates[0], centerCoordinates[1]);
  }

}

import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';

import { Icon, latLng, latLngBounds, LatLngBounds, marker, tileLayer } from 'leaflet';

import { DestinationResult } from '@models/types';
import { DestinationType } from '@models/enums';

const MarkerIcon = Icon.extend({
  options: {
    iconSize:     [30, 70],
    iconAnchor:   [22, 94],
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
export class MapComponent implements OnInit, OnChanges {
  @Input() searchResults: DestinationResult[] = [];

  fitBounds: LatLngBounds;
  layers = [];
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '...' })
    ]
  };

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

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.setMapBounds();
    this.layers = this.searchResults.map((result) => {
      return marker([result.coordinates.latitude, result.coordinates.longitude],
        {title: result.name, icon: MapComponent.getIcon(result.category) })
        .bindPopup(`<strong>${result.name}<br />${result.loc}</strong>`);
    });
  }

  setMapBounds(): void {
    const latitudes = this.getLatitudes();
    const longitudes = this.getLongitudes();
    const minLat = Math.min(...latitudes) - 0.001;
    const maxLat = Math.max(...latitudes) + 0.05;
    const minLong = Math.min(...longitudes) - 0.001;
    const maxLong = Math.max(...longitudes) + 0.001;
    const corner1 = latLng(minLat, minLong),
      corner2 = latLng(maxLat, maxLong);
    this.fitBounds = latLngBounds(corner1, corner2);
  }

  private getLatitudes() {
    return this.searchResults.length ? this.searchResults.map((d) => d.coordinates.latitude) : [0];
  }
  private getLongitudes() {
    return this.searchResults.length ? this.searchResults.map((d) => d.coordinates.longitude) : [0];
  }

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { MapComponent } from './components/map/map.component';
import { SharedModule } from '@app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    LeafletModule,
    SharedModule
  ],
  exports: [ MapComponent ],
  declarations: [ MapComponent ]
})
export class MapModule { }

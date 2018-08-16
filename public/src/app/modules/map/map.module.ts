import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapComponent } from './components/map/map.component';
import { SharedModule } from '@app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [ MapComponent ]
})
export class MapModule { }

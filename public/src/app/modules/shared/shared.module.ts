import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SubscribingComponent } from '@app/modules/shared/components/subscribing/subscribing.component';

@NgModule({
  declarations: [
    SubscribingComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }

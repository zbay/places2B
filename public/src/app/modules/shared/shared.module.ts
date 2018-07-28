import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SubscribingComponent } from '@app/modules/shared/components/subscribing/subscribing.component';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@app/modules/material/material.module';

@NgModule({
  declarations: [
    SubscribingComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class SharedModule { }

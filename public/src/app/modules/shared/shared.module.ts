import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SubscribingComponent } from '@app/modules/shared/components/subscribing/subscribing.component';

import { MaterialModule } from '@app/modules/material/material.module';

@NgModule({
  declarations: [
    SubscribingComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class SharedModule { }

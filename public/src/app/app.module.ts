import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig } from '@angular/material';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { AboutComponent } from '@app/about/about.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchModule } from '@app/modules/search/search.module';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    LeafletModule.forRoot(),
    SearchModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent],
  providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }]
})
export class AppModule { }

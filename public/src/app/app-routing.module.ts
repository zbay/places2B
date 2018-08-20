import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from '@app/about/about.component';
import { NotFoundComponent } from '@app/modules/shared/components/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'about', pathMatch: 'full', component: AboutComponent },
  { path: 'business', pathMatch: 'full', loadChildren: '@app/modules/business/business.module#BusinessModule' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

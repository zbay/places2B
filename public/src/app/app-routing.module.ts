import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from '@app/components/about/about.component';
import { NotFoundComponent } from '@app/modules/shared/components/not-found/not-found.component';

const routes: Routes = [
  {path: '', redirectTo: 'search', pathMatch: 'full'},
  {path: 'about', pathMatch: 'full', component: AboutComponent},
  {path: '**', component: NotFoundComponent}
  // {path: 'search', loadChildren: '@app/modules/search/search.module#SearchModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

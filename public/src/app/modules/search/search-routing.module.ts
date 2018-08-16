import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {path: 'search', component: HomeComponent}
];

// const routes: Routes = [
//   { path: 'search', component: HomeComponent,
//     children: [
//       { path: 'results', children: [
//           {
//             path: '', component: ResultsComponent
//           },
//           {
//             path: 'map', loadChildren: '@app/modules/map/map.module#MapModule'
//           }
//         ]
//       }
//     ]
//   }
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }

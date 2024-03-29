import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PokeDetailsDrawerComponent} from "./poke-details-drawer.component";

const routes: Routes = [
  {
    component: PokeDetailsDrawerComponent,
    path: 'drawer/:pokeName',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PokeDetailsRoutingModule { }

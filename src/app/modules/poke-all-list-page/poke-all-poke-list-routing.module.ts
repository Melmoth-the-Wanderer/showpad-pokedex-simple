import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PokeAllListPageComponent} from "./poke-all-list-page.component";

const routes: Routes = [
  {
    component: PokeAllListPageComponent,
    path: '',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PokeAllListRoutingModule {
}

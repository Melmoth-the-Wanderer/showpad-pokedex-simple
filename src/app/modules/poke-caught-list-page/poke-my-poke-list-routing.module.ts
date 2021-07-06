import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PokeCaughtListPageComponent} from "./poke-caught-list-page.component";

const routes: Routes = [
  {
    component: PokeCaughtListPageComponent,
    path: '',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PokeCaughtListRoutingModule {
}

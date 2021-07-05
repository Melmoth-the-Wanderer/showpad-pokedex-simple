import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MyPokemonsPageComponent} from "./components/my-pokemons-page/my-pokemons-page.component";
import {PokeListPageComponent} from "./components/poke-list-page/poke-list-page.component";
import {PokeCaughtResolverService} from "./services/poke-caught-resolver.service";
import {PokeListResolverService} from './services/poke-list-resolver.service';

const routes: Routes = [
  {
    outlet: 'drawer-outlet',
    path: 'poke-details',
    loadChildren: () => import('./modules/poke-details/poke-details.module').then(m => m.PokeDetailsModule),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'poke-list'
  },
  {
    component: MyPokemonsPageComponent,
    path: `${MyPokemonsPageComponent.routeBasePath}`,
    resolve: {pokes: PokeCaughtResolverService},
  },
  {
    component: PokeListPageComponent,
    path: `${PokeListPageComponent.routeBasePath}`,
    resolve: {pokes: PokeListResolverService},
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

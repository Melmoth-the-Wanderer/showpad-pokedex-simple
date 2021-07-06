import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PokeAllListResolverService} from './services/poke-all-list-resolver.service';
import {PokeCaughtListResolverService} from "./services/poke-caught-list-resolver.service";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'all-pokemons'
  },
  {
    outlet: 'drawer-outlet',
    path: 'poke-details',
    loadChildren: () => import('./modules/poke-details/poke-details.module').then(m => m.PokeDetailsModule),
  },
  {
    path: 'all-pokemons',
    loadChildren: () => import('./modules/poke-all-list-page/poke-all-list-page.module').then(m => m.PokeAllListPageModule),
    resolve: {pokes: PokeAllListResolverService}
  },
  {
    path: 'my-pokemons',
    loadChildren: () => import('./modules/poke-caught-list-page/poke-caught-list-page.module').then(m => m.PokeCaughtListPageModule),
    resolve: {pokes: PokeCaughtListResolverService},
  },
  {
    path: '**',
    redirectTo: 'all-pokemons', // TODO: 404 NF Component
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

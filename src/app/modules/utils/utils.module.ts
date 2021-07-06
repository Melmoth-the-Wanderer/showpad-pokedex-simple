import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzEmptyModule} from "ng-zorro-antd/empty";
import {NzListModule} from "ng-zorro-antd/list";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {PaginatedContentWrapperComponent} from './components/paginated-content-wrapper/paginated-content-wrapper.component';
import {PaginatedPokemonListComponent} from './components/paginated-pokemon-list/paginated-pokemon-list.component';
import {PokeListComponent} from "./components/poke-list/poke-list.component";

@NgModule({
  declarations: [
    PaginatedContentWrapperComponent,
    PaginatedPokemonListComponent,
    PokeListComponent,
  ],
  imports: [
    CommonModule,
    NzButtonModule,
    NzEmptyModule,
    NzListModule,
    NzPaginationModule,
    NzPopoverModule,
    NzSpinModule,
    NzTypographyModule,
  ],
  exports: [
    PaginatedContentWrapperComponent,
    PaginatedPokemonListComponent,
    PokeListComponent,
  ]
})
export class PokeUtilsModule {
}

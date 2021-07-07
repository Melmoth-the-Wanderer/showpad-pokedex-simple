import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {PokeUtilsModule} from "../utils/utils.module";
import {PokeCaughtSectionComponent} from "./components/poke-caught-section/poke-caught-section.component";
import {PokeCaughtListPageComponent} from "./poke-caught-list-page.component";
import {PokeCaughtListRoutingModule} from "./poke-caught-poke-list-routing.module";

@NgModule({
  exports: [
    PokeCaughtListPageComponent,
  ],
  declarations: [
    PokeCaughtListPageComponent,
    PokeCaughtSectionComponent,
  ],
  imports: [
    CommonModule,
    NzTypographyModule,
    PokeCaughtListRoutingModule,
    PokeUtilsModule,
  ]
})
export class PokeCaughtListPageModule { }

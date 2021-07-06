import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {PokeUtilsModule} from "../utils/utils.module";
import {PokeCaughtListRoutingModule} from "./poke-my-poke-list-routing.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NzTypographyModule,
    PokeCaughtListRoutingModule,
    PokeUtilsModule,
  ]
})
export class PokeCaughtListPageModule { }

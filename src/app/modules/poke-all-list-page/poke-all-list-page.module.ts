import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {PokeUtilsModule} from "../utils/utils.module";
import {SearchInputComponent} from './components/search-input/search-input.component';
import {PokeAllListPageComponent} from "./poke-all-list-page.component";
import {PokeAllListRoutingModule} from "./poke-all-poke-list-routing.module";

@NgModule({
  declarations: [
    PokeAllListPageComponent,
    SearchInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NzFormModule,
    NzIconModule,
    NzInputModule,
    NzToolTipModule,
    NzTypographyModule,
    PokeUtilsModule,
    PokeAllListRoutingModule,
    ReactiveFormsModule,
  ],
  exports: [
    PokeAllListPageComponent
  ]
})
export class PokeAllListPageModule { }

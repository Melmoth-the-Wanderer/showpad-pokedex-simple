import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import {PokeDetailsDrawerComponent} from './components/poke-details-drawer/poke-details-drawer.component';
import {PokeDetailsComponent} from './components/poke-details/poke-details.component';
import {PokeDetailsRoutingModule} from "./poke-details-routing.module";

@NgModule({
  declarations: [
    PokeDetailsComponent,
    PokeDetailsDrawerComponent,
  ],
  imports: [
    CommonModule,
    PokeDetailsRoutingModule,
    NzDrawerModule,
  ]
})
export class PokeDetailsModule { }

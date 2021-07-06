import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import {NzGraphModule} from "ng-zorro-antd/graph";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzTagModule} from "ng-zorro-antd/tag";
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
    NzAvatarModule,
    NzButtonModule,
    NzDrawerModule,
    NzGraphModule,
    NzGridModule,
    NzSpinModule,
    NzStatisticModule,
    NzTagModule,
  ]
})
export class PokeDetailsModule {
}

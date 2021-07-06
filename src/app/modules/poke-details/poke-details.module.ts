import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import {NzGraphModule} from "ng-zorro-antd/graph";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {PokeDetailsDrawerComponent} from './poke-details-drawer.component';
import {PokeDetailsPageComponent} from './poke-details-page.component';
import {PokeDetailsRoutingModule} from "./poke-details-routing.module";
import { DetailsTitleComponent } from './components/details-title/details-title.component';
import { DetailsStatsComponent } from './components/details-stats/details-stats.component';
import { DetailsMovesComponent } from './components/details-moves/details-moves.component';
import { DetailsTypesComponent } from './components/details-types/details-types.component';

@NgModule({
  declarations: [
    DetailsTitleComponent,
    DetailsStatsComponent,
    DetailsMovesComponent,
    DetailsTypesComponent,
    PokeDetailsDrawerComponent,
    PokeDetailsPageComponent,
  ],
  imports: [
    CommonModule,
    NzAvatarModule,
    NzButtonModule,
    NzDrawerModule,
    NzGraphModule,
    NzGridModule,
    NzModalModule,
    NzSpinModule,
    NzStatisticModule,
    NzTagModule,
    NzTypographyModule,
    PokeDetailsRoutingModule,
  ]
})
export class PokeDetailsModule {
}

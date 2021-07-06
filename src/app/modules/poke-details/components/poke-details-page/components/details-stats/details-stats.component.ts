import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {PokemonStatistic} from "./pokemon-statistic";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'poke-details-stats',
  templateUrl: './details-stats.component.html',
  styleUrls: ['./details-stats.component.scss']
})
export class DetailsStatsComponent {

  @Input() public pdPokeStats: PokemonStatistic[] | null | undefined = undefined;

}

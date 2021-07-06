import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'poke-details-title',
  templateUrl: './details-title.component.html',
  styleUrls: ['./details-title.component.scss']
})
export class DetailsTitleComponent {

  @Input() public pdPokeAvatarUrl: string | null | undefined = undefined;
  @Input() public pdPokeName: string | null | undefined = undefined;

}

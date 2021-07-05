import {AppState} from "../model/app-state";
import {PokesStateShape} from "../model/pokes-state";

export interface GuiState {
  appState: AppState,
  pokesState: PokesStateShape,
}

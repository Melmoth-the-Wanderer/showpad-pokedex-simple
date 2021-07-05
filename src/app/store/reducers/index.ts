import { ActionReducerMap } from "@ngrx/store";
import { GuiState } from "../gui-state";
import {appStateReducer} from "./app-state-reducer";
import {pokeStateReducer} from "./poke-state-reducer";

export const reducers: ActionReducerMap<GuiState> = {
  appState: appStateReducer,
  pokesState: pokeStateReducer,
};

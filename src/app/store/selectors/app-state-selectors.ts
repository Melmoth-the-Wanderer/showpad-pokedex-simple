import {createSelector} from "@ngrx/store";
import {GuiState} from "../gui-state";

export const selectAppState = (state: GuiState) => state.appState;

export const selectAppInitialized = createSelector(
  selectAppState,
  (state) => state.appInitialized,
)

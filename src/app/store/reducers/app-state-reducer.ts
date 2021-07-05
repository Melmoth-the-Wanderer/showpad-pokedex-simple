import {Action} from "@ngrx/store";
import {AppState, AppStateShape} from "../../model/app-state";
import {ActionType} from "../actions/action-type";

export function appStateReducer(state: AppStateShape = new AppState(), action: Action): AppState {
  switch (action.type) {
    case (ActionType.ReportAppInitialized): {
      return {
        ...state,
        appInitialized: true,
      };
    }
    default: {

      return state;
    }
  }
}

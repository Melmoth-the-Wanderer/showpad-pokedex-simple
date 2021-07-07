import {Action} from "@ngrx/store";
import {ActionType} from "../actions/action-type";
import {AppState, AppStateShape} from "../model/app-state";

export function appStateReducer(state: AppStateShape = new AppState(), action: Action): AppState {
  switch (action.type) {
    case (ActionType.ReportAppInitialized): {
      return {
        ...state,
        appInitialized: true,
      };
    }
    case(ActionType.ReportAppRouteDataResolving): {
      return {
        ...state,
        appRouteDataResolved: false,
      }
    }
    case(ActionType.ReportAppRouteDataResolved): {
      return {
        ...state,
        appRouteDataResolved: true,
      }
    }
    default: {
      return state;
    }
  }
}

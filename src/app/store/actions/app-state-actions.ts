import {Action} from "@ngrx/store";
import {ActionType} from "./action-type";

export class InitializeApp implements Action {
  public readonly type = ActionType.InitializeApp;
}

export class ReportAppInitialized implements Action {
  public readonly type = ActionType.ReportAppInitialized;
}

export class ReportAppRouteDataResolving implements Action {
  public readonly type = ActionType.ReportAppRouteDataResolving;
}

export class ReportAppRouteDataResolved implements Action {
  public readonly type = ActionType.ReportAppRouteDataResolved;
}

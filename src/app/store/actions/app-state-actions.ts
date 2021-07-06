import {Action} from "@ngrx/store";
import {ActionType} from "./action-type";

export class InitializeApp implements Action {
  public readonly type = ActionType.InitializeApp;
}

export class ReportAppInitialized implements Action {
  public readonly type = ActionType.ReportAppInitialized;
}

export class ReportAppRouteLoading implements Action {
  public readonly type = ActionType.ReportAppRouteLoading
}

export class ReportAppRouteLoaded implements Action {
  public readonly type = ActionType.ReportAppRouteLoaded
}

export interface AppStateShape {
  appInitialized: boolean;
  appRouteLoaded: boolean;
}

export class AppState implements AppStateShape {
  public appInitialized = false;
  public appRouteLoaded = false;
}

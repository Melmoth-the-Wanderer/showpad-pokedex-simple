export interface AppStateShape {
  appInitialized: boolean;
  appRouteDataResolved: boolean;
}

export class AppState implements AppStateShape {
  public appInitialized = false;
  public appRouteDataResolved = false;
}

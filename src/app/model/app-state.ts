export interface AppStateShape {
  appInitialized: boolean;
}

export class AppState implements AppStateShape {
  public appInitialized = false;
}

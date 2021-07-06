import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {getViewportWidth} from "../modules/utils/functions/get-viewport-width";

@Injectable({
  providedIn: 'root'
})
export class PokeViewportSizeService {

  private viewportWidth$ = new BehaviorSubject<number>(getViewportWidth());

  public viewportWidth = this.viewportWidth$.asObservable();

  public triggerViewportUpdate(): void {
    this.viewportWidth$.next(getViewportWidth());
  }

}

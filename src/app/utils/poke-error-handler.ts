import {ErrorHandler, Injectable} from "@angular/core";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {ErrorHandlerPayload} from "./error-handler-payload";

@Injectable()
export class PokeErrorHandler extends ErrorHandler {

  constructor(
    private readonly notification: NzNotificationService,
  ) {
    super();
  }

  public handleError(payload: ErrorHandlerPayload) {
    console.error(payload);
    this.notification.error(
      `An error occurred ${payload.when ? 'while ' + payload.when : ''}`, payload.error?.message ?? payload.error ?? payload,
      {
        nzDuration: 0,
      }
    );
  }
}

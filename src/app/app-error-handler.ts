import {ErrorHandler, Injectable} from "@angular/core";
import {NzNotificationService} from "ng-zorro-antd/notification";

export interface ErrorHandlerPayload {
  when: string;
  error: any;
}

@Injectable()
export class AppErrorHandler extends ErrorHandler {

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

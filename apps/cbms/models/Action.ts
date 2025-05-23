import type { Router } from "expo-router";
import type { EventLog } from "~/models/EventLog";

export abstract class Action {
  abstract execute(parameters: {
    eventLog: EventLog;
    route: {
      pathname: string;
    };
    router: Router;
  }): Promise<void>;

  abstract toString(): string;
}

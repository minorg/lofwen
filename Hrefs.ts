import type { Identifier } from "~/models";

export namespace Hrefs {
  export function action(action: { identifier: Identifier }): string {
    return `/action/${action.identifier}`;
  }
}

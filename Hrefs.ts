import type { Href } from "expo-router";
import type { Identifier } from "~/models";

export namespace Hrefs {
  export function action(action: { identifier: Identifier }): Href {
    return {
      pathname: "/action/[actionIdentifier]",
      params: { actionIdentifier: action.identifier },
    };
  }

  export function root(): Href {
    return {
      pathname: "/",
    };
  }
}

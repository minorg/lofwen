import type { Href } from "expo-router";
import type { Identifier } from "~/models";

export namespace Hrefs {
  export function action(action: { "@id": Identifier }): Href {
    return {
      pathname: "/action/[actionId]",
      params: { actionId: action["@id"] },
    };
  }

  export function root(): Href {
    return {
      pathname: "/",
    };
  }
}

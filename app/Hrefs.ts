import type { Href } from "expo-router";
import type { Identifier } from "~/models";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Hrefs {
  static action(action: { "@id": Identifier }): Href {
    return {
      pathname: "/(authenticated)/action/[actionId]",
      params: { actionId: action["@id"] },
    };
  }

  static get root(): Href {
    return {
      pathname: "/",
    };
  }

  static get signIn(): Href {
    return {
      pathname: "/(unauthenticated)/sign-in",
    };
  }

  static get signOut(): Href {
    return {
      pathname: "/(authenticated)/sign-out",
    };
  }
}

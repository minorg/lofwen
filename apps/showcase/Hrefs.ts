import type { Identifier } from "@lofwen/models";
import type { Href } from "expo-router";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Hrefs {
  static get chat(): Href {
    return {
      pathname: "/(authenticated)/chat",
    };
  }

  static question(question: { "@id": Identifier }): Href {
    return {
      pathname: "/(authenticated)/question/[questionId]",
      params: { questionId: question["@id"] },
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

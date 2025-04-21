import type { Identifier } from "@lofwen/models";
import type { Href } from "expo-router";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Hrefs {
  static instructions(instructions: { "@id": Identifier }): Href {
    return {
      pathname: "/(authenticated)/instructions/[instructionsId]",
      params: { instructionsId: instructions["@id"] },
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
}

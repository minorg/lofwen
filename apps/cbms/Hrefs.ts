import type { Identifier } from "@lofwen/models";
import type { Href } from "expo-router";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Hrefs {
  static get garden() {
    return {
      pathname: "/(authenticated)/garden",
    } satisfies Href;
  }

  static instructions(instructions: { "@id": Identifier }) {
    return {
      pathname: "/(authenticated)/instructions/[instructionsId]",
      params: { instructionsId: instructions["@id"] },
    } satisfies Href;
  }

  static question(question: { "@id": Identifier }) {
    return {
      pathname: "/(authenticated)/question/[questionId]",
      params: { questionId: question["@id"] },
    } satisfies Href;
  }

  static get root() {
    return {
      pathname: "/",
    } satisfies Href;
  }
}

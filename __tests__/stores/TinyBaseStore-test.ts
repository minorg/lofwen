import { questionAction } from "~/__tests__/data";
import { TinyBaseStore } from "~/stores/TinyBaseStore";

describe("TinyBaseStore", () => {
  const sut = TinyBaseStore.create();

  it("addAction", () => {
    sut.addAction(questionAction);
  });

  it("actions", () => {
    sut.addAction(questionAction);
    expect(sut.actions).toHaveLength(1);
    expect(sut.actions[0]).toEqual(questionAction);
  });
});

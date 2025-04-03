import { initialEvent, questionAction } from "~/__tests__/data";
import { TinyBaseStore } from "~/stores/TinyBaseStore";

describe("TinyBaseStore", () => {
  const sut = TinyBaseStore.create();

  it("addAction", () => {
    sut.addAction(questionAction);
  });

  it("addEvent", () => {
    sut.addEvent(initialEvent);
  });

  it("actions", () => {
    sut.addAction(questionAction);
    expect(sut.actions).toHaveLength(1);
    expect(sut.actions[0]).toEqual(questionAction);
  });

  it("events", () => {
    sut.addEvent(initialEvent);
    expect(sut.events).toHaveLength(1);
    expect(sut.events[0]).toEqual(initialEvent);
  });
});

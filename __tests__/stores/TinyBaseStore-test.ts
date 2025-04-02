import type { Action } from "~/models";
import { TinyBaseStore } from "~/stores/TinyBaseStore";

describe("TinyBaseStore", () => {
  const action: Action = {
    identifier: "action",
    question: {
      item: "Is this the best app ever?",
      responseCategories: [
        "Strongly disagree",
        "Disagree",
        "Neutral",
        "Agree",
        "Strongly agree",
      ].map((label, index) => ({
        label,
        value: index,
      })),
      type: "LikertScaleQuestion",
    },
    timestamp: new Date().getTime(),
    triggerEvent: {
      identifier: "event",
      timestamp: new Date().getTime(),
      type: "InitialEvent",
    },
    type: "QuestionAction",
  };
  const sut = TinyBaseStore.create();

  it("addAction", () => {
    sut.addAction(action);
  });

  it("actions", () => {
    sut.addAction(action);
    expect(sut.actions).toHaveLength(1);
    expect(sut.actions[0]).toEqual(action);
  });
});

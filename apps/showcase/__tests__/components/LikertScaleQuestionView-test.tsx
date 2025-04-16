import { render } from "@testing-library/react-native";
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from "react";
import { LikertScaleQuestionView } from "~/components/LikertScaleQuestionView";
import { likertScaleQuestion } from "../data";

it("renders correctly", () => {
  const tree = render(
    <LikertScaleQuestionView
      answer={null}
      onAnswer={() => {}}
      question={likertScaleQuestion}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

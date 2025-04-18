import { render } from "@testing-library/react-native";
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from "react";
import { DichotomousQuestionView } from "~/components/DichotomousQuestionView";
import { dichotomousQuestion } from "../data";

it("renders correctly", () => {
  const tree = render(
    <DichotomousQuestionView
      answer={null}
      onAnswer={() => {}}
      question={dichotomousQuestion}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

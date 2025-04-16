import { render } from "@testing-library/react-native";
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from "react";
import { TextQuestionView } from "~/components/TextQuestionView";
import { textQuestion } from "../data";

it("renders correctly", () => {
  const tree = render(
    <TextQuestionView
      answer={null}
      onAnswer={() => {}}
      question={textQuestion}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

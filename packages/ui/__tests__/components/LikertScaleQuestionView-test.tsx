import { render } from "@testing-library/react-native";
import { LikertScaleQuestionView } from "../../src/components/LikertScaleQuestionView";
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

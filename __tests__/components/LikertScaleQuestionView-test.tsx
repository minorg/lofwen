import { render } from "@testing-library/react-native";
import { likertScaleQuestion } from "~/__tests__/data";
import { LikertScaleQuestionView } from "~/components/LikertScaleQuestionView";

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

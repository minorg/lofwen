import renderer from "react-test-renderer";
import { likertScaleQuestion } from "~/__tests__/data";
import { LikertScaleQuestionView } from "~/components/LikertScaleQuestionView";

it("renders correctly", () => {
  const tree = renderer
    .create(
      <LikertScaleQuestionView
        answer={null}
        onAnswer={() => {}}
        question={likertScaleQuestion}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

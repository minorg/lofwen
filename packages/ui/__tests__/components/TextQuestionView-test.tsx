import { render } from "@testing-library/react-native";
import { TextQuestionView } from "../../src/components/TextQuestionView";
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

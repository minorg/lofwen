import { render } from "@testing-library/react-native";
import { textQuestionAction } from "~/__tests__/data";
import { TextQuestionActionView } from "~/components/TextQuestionActionView";

it("renders correctly", () => {
  const tree = render(
    <TextQuestionActionView
      action={textQuestionAction}
      onEvent={async () => {}}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

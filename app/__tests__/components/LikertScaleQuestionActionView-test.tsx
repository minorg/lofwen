import { render } from "@testing-library/react-native";
import { likertScaleQuestionAction } from "~/__tests__/data";
import { LikertScaleQuestionActionView } from "~/components/LikertScaleQuestionActionView";

it("renders correctly", () => {
  const tree = render(
    <LikertScaleQuestionActionView
      action={likertScaleQuestionAction}
      onEvent={async () => {}}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

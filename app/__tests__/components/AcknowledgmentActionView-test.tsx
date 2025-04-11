import { render } from "@testing-library/react-native";
import { acknowledgmentAction } from "~/__tests__/data";
import { AcknowledgmentActionView } from "~/components/AcknowledgmentActionView";

it("renders correctly", () => {
  const tree = render(
    <AcknowledgmentActionView
      action={acknowledgmentAction}
      onEvent={() => {}}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

import { Redirect } from "expo-router";
import { Hrefs } from "~/Hrefs";
import { useEventLog } from "~/hooks/useEventLog";
import { rootLogger } from "~/rootLogger";
import { workflow } from "~/workflow";

const logger = rootLogger.extend("RootScreen");

export default function RootScreen() {
  const eventLog = useEventLog();

  const action = workflow({ eventLog });
  switch (action["@type"]) {
    case "PoseQuestionAction": {
      eventLog.append({
        "@type": "QuestionFormulatedEvent",
      });
      return <Redirect href={Hrefs.question(action.question)} />;
    }
  }
}

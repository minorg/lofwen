import * as envalid from "envalid";
import { workflows } from "~/workflows/workflows";

function loadConfiguration() {
  const env = envalid.cleanEnv(process.env, {
    EXPO_PUBLIC_LOFWEN_WORKFLOW: envalid.str({
      choices: Object.keys(workflows),
      default: "singleLikertScaleQuestion",
    }),
  });

  if (!workflows[env.EXPO_PUBLIC_LOFWEN_WORKFLOW]) {
    throw new RangeError(env.EXPO_PUBLIC_LOFWEN_WORKFLOW);
  }

  return {
    workflow: workflows[env.EXPO_PUBLIC_LOFWEN_WORKFLOW]!,
  };
}

export const configuration = loadConfiguration();

import * as envalid from "envalid";
import "~/workflows";
import { perceivedStressScaleWorkflow, showcaseWorkflow } from "~/workflows";
import { workflows } from "~/workflows/workflows";
workflows["showcase"] = showcaseWorkflow;
workflows["perceivedStressScale"] = perceivedStressScaleWorkflow;

function loadConfiguration() {
  const env = envalid.cleanEnv(process.env, {
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: envalid.str({ default: "" }),
    EXPO_PUBLIC_LOFWEN_WORKFLOW: envalid.str({
      choices: Object.keys(workflows),
      default: "showcase",
    }),
    EXPO_PUBLIC_LOFWEN_SYNCHRONIZATION_SERVER_URL: envalid.str({ default: "" }),
  });

  if (!workflows[env.EXPO_PUBLIC_LOFWEN_WORKFLOW]) {
    throw new RangeError(env.EXPO_PUBLIC_LOFWEN_WORKFLOW);
  }

  return {
    clerk:
      env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY.length > 0
        ? {
            publishableKey: env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
          }
        : null,
    synchronization:
      env.EXPO_PUBLIC_LOFWEN_SYNCHRONIZATION_SERVER_URL.length > 0
        ? {
            serverUrl: env.EXPO_PUBLIC_LOFWEN_SYNCHRONIZATION_SERVER_URL,
          }
        : null,
    workflow: workflows[env.EXPO_PUBLIC_LOFWEN_WORKFLOW]!,
  };
}

export const configuration = loadConfiguration();

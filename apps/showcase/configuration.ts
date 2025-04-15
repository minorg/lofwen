import * as envalid from "envalid";

function loadConfiguration() {
  const env = envalid.cleanEnv(process.env, {
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: envalid.str({ default: "" }),
    EXPO_PUBLIC_LOFWEN_SYNCHRONIZATION_SERVER_URL: envalid.str({ default: "" }),
  });

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
  };
}

export const configuration = loadConfiguration();

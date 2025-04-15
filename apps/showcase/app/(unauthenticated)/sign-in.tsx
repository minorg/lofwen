import {
  type StartSSOFlowReturnType,
  isClerkAPIResponseError,
  useSSO,
} from "@clerk/clerk-expo";
import type { ClerkAPIError, OAuthStrategy } from "@clerk/types";
import { localUserStore, useUser, useWarmUpBrowser } from "@lofwen/auth";
import { Button, Text } from "@lofwen/ui";
import * as AuthSession from "expo-auth-session";
import { randomUUID } from "expo-crypto";
import { Redirect, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";
import { View } from "react-native";
import { Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Hrefs } from "~/Hrefs";
import { configuration } from "~/configuration";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("SignInScreen");

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  // Preload the browser for Android devices to reduce authentication load time
  if (configuration.clerk) {
    useWarmUpBrowser();
  }

  const { startSSOFlow } = configuration.clerk
    ? useSSO()
    : {
        startSSOFlow: () => {
          return {
            createdSessionId: null,
            setActive: undefined,
          } satisfies Pick<
            StartSSOFlowReturnType,
            "createdSessionId" | "setActive"
          >;
        },
      };
  const router = useRouter();
  const [errors, setErrors] = React.useState<ClerkAPIError[]>([]);
  const user = useUser({ configuration, logger });

  const onLocalButtonPress = React.useCallback(() => {
    localUserStore.setLocalUserSync({
      "@id": `local-user-${randomUUID()}`,
      "@type": "AuthenticatedUser",
    });
    logger.debug("redirecting to authenticated page");
    router.replace("/(authenticated)");
  }, [router]);

  const onSsoButtonPress = React.useCallback(
    async (strategy: OAuthStrategy) => {
      // if (process.env.EXPO_OS === "ios") {
      //   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      // }
      try {
        // Start the authentication process by calling `startSSOFlow()`
        logger.debug("starting", strategy, "SSO flow");
        const { createdSessionId, setActive } = await startSSOFlow({
          strategy,
          // concatenate (auth) since clerk's dashboard requires it
          // trying to use the scheme alone doesn't work, also for production
          // add the scheme in the "Allowlist for mobile SSO redirect" section under configure > sso connections
          redirectUrl: AuthSession.makeRedirectUri({
            path: "(unauthenticated)",
          }),
        });

        // logger.debug("auth session result:", JSON.stringify(authSessionResult));

        // If sign in was successful, set the active session
        if (createdSessionId) {
          logger.debug("created session id:", createdSessionId);
          setActive!({ session: createdSessionId });
          logger.debug("redirecting to authenticated page");
          router.replace("/(authenticated)");
        } else {
          logger.warn("missing requirements such as MFA; not implemented");
          // If there is no `createdSessionId`,
          // there are missing requirements, such as MFA
          // Use the `signIn` or `signUp` returned from `startSSOFlow`
          // to handle next steps
        }
      } catch (err) {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        if (isClerkAPIResponseError(err)) setErrors(err.errors);
        logger.error(JSON.stringify(err, null, 2));
      }
    },
    [router, startSSOFlow],
  );

  const onGoogleButtonPress = React.useCallback(
    () => onSsoButtonPress("oauth_google"),
    [onSsoButtonPress],
  );

  if (user["@type"] === "AuthenticatedUser") {
    logger.debug(
      "have authenticated user on sign-in screen, redirecting to authenticated page",
    );
    return <Redirect href={Hrefs.root} />;
  }

  if (!configuration.clerk) {
    useEffect(() => {
      localUserStore.setLocalUserSync({
        "@id": `local-user-${randomUUID()}`,
        "@type": "AuthenticatedUser",
      });
      router.replace(Hrefs.root);
    });
    return null;
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="flex flex-col flex-1 gap-4 items-center justify-center">
        {errors.map((error) => (
          <Text className="color-destructive" key={error.longMessage}>
            {error.longMessage}
          </Text>
        ))}

        <Text className="text-xl">Welcome.</Text>

        <View className="flex flex-col w-100 gap-2">
          <Button
            className="w-100"
            onPress={onLocalButtonPress}
            variant="outline"
          >
            <Text className="text-center">Use locally</Text>
          </Button>

          {configuration.clerk ? (
            <Button onPress={onGoogleButtonPress} variant="outline">
              <View className="flex flex-row items-center justify-center">
                <Image
                  source={require("../../assets/images/google-icon.png")}
                  style={{ height: 20, width: 20, marginRight: 12 }}
                />
                <Text>Continue with Google</Text>
              </View>
            </Button>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

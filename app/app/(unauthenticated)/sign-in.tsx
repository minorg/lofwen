import { isClerkAPIResponseError, useSSO } from "@clerk/clerk-expo";
import type { ClerkAPIError } from "@clerk/types";
import * as AuthSession from "expo-auth-session";
import { Redirect, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { View } from "react-native";
import { Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Hrefs } from "~/Hrefs";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useUser } from "~/hooks/useUser";
import { useWarmUpBrowser } from "~/hooks/useWarmUpBrowser";
import { logger } from "~/logger";

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  // Preload the browser for Android devices to reduce authentication load time
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [errors, setErrors] = React.useState<ClerkAPIError[]>([]);
  const user = useUser();

  // Handle the submission of the sign-in form
  const onGoogleButtonPress = React.useCallback(async () => {
    // if (process.env.EXPO_OS === "ios") {
    //   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // }
    try {
      // Start the authentication process by calling `startSSOFlow()`
      logger.debug("starting Google SSO flow");
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
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
  }, [router, startSSOFlow]);

  if (user["@type"] === "AuthenticatedUser") {
    logger.debug(
      "have authenticated user on sign-in screen, redirecting to authenticated page",
    );
    return <Redirect href={Hrefs.root} />;
  }

  return (
    <SafeAreaView>
      <View className="flex flex-col flex-1 gap-2 items-center justify-center">
        {errors.map((error) => (
          <Text className="color-destructive" key={error.longMessage}>
            {error.longMessage}
          </Text>
        ))}

        <Button onPress={onGoogleButtonPress} variant="outline">
          <View className="flex flex-row items-center justify-center">
            <Image
              source={require("../../assets/images/google-icon.png")}
              style={{ height: 20, width: 20, marginRight: 12 }}
            />
            <Text>Continue with Google</Text>
          </View>
        </Button>

        {/* <Button onPress={onSignInPress} disabled={isSigningIn}>
        Use locally
      </Button> */}
      </View>
    </SafeAreaView>
  );
}

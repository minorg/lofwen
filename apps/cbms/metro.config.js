const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// As of Expo SDK 52, no longer need to manually configure Metro for monorepos: https://docs.expo.dev/guides/monorepos/

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });

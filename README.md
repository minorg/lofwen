# LOFWEN: LOcal-First Workflow ENgine

## One-time setup

### Prerequisites

* [Node.js](https://nodejs.org/) 22

### Install dependencies

   ```bash
   npm install
   ```

## Run the showcase app locally

   ```bash
   cd apps/showcase
   npm start
   ```

In the output, you'll find options to open the app in

1. [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo. This option is useful for quickly seeing how the app will look on a mobile device.
1. [a web browser](http://localhost:8081). This option is useful for live-debugging the app.
1. [an Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
1. [an iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)

## Run the LiteLLM proxy to the OpenAI API (for chat functionality)

### Prerequisites

* [Docker](https://docs.docker.com/engine/) with [Docker Compose](https://docs.docker.com/compose/)

### Credentials

Put your OpenAI API key in `.env.docker` in the root of the repository:

   ```
   OPENAI_API_KEY=...
   ``` 

### Run the LiteLLM Docker container

   ```bash
   docker compose up litellm
   ```

## Development

### Notes on using SVG images

There are two ways to incorporate SVGs into an Expo / React Native apps. Both rely on the [`react-native-svg`](https://docs.expo.dev/versions/latest/sdk/svg/) at runtime to render SVG's as React components.

The two ways are:

1. Convert .svg files to React components manually using [SVGR](https://github.com/gregberge/svgr?tab=readme-ov-file) e.g.,

```
npm exec -- @svgr/cli --native assets/images/cbms-stress-1080x1920.svg >components/cbms-stress-1080x1920.jsx
```

and then manually cleaning up and formatting the code.

2. Convert .svg files to React components as part of Metro bundling using [`react-native-svg-transformer`](https://github.com/kristerkari/react-native-svg-transformer). Add an `svg.d.ts` for SVG files:

```
declare module "*.svg" {
  // biome-ignore lint/correctness/noUnusedImports: <explanation>
  import type React from "react";
  import type { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}
```

#2 is more convenient but has issues with some .svgs (including ones I tested with).

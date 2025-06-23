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

## Run up the LiteLLM proxy to the OpenAI API (for chat functionality)

### Prerequisites

* [Docker](https://docs.docker.com/engine/) with [Docker Compose](https://docs.docker.com/compose/)

### Credentials

Put your OpenAI API key in `.env.docker` in the root of the repository:

   ```
   OPENAI_API_KEY=...
   ``` 

### Run the liteLLM Docker container

   ```bash
   docker compose up litellm
   ```

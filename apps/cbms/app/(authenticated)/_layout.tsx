import "~/global.css";
import { TinyBaseEventLog } from "@lofwen/event-log";
import {} from "@react-navigation/native";
import { Slot } from "expo-router";
import { Platform } from "react-native";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("Persister");

export default function AuthenticatedLayout() {
  const { useCreatePersister, useCreateStore } = TinyBaseEventLog.UiReact;
  const store = useCreateStore(() => TinyBaseEventLog.Store.create());
  useCreatePersister(
    store,
    (store) => {
      if (Platform.OS === "web") {
        const {
          createSessionPersister,
        } = require("tinybase/persisters/persister-browser/with-schemas");
        const persister = createSessionPersister(store, "cbms-app");
        logger.debug("created browser session persister");
        return persister;
      }

      const { openDatabaseSync } = require("expo-sqlite");
      const db = openDatabaseSync("cbms-app");
      const {
        createExpoSqlitePersister,
      } = require("tinybase/persisters/persister-expo-sqlite/with-schemas");
      const persister = createExpoSqlitePersister(store, db);
      logger.debug("created Expo SQLite persister");
      return persister;
    },
    undefined,
    async (persister) => {
      await persister.startAutoLoad();
      logger.debug("started persister auto-load");
      await persister.startAutoSave();
      logger.debug("started persister auto-save");
    },
  );

  return (
    <TinyBaseEventLog.UiReact.Provider store={store}>
      <Slot screenOptions={{ headerShown: false }} />
    </TinyBaseEventLog.UiReact.Provider>
  );
}

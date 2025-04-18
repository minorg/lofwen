import "~/global.css";
import { TinyBaseEventLog } from "@lofwen/event-log";
import {} from "@react-navigation/native";
import { Slot } from "expo-router";
import { openDatabaseSync } from "expo-sqlite";
import { useMemo } from "react";
import { createExpoSqlitePersister } from "tinybase/persisters/persister-expo-sqlite/with-schemas";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("Synchronizer");

export default function AuthenticatedLayout() {
  const store = useMemo(() => TinyBaseEventLog.Store.create(), []);
  const { useCreatePersister } = TinyBaseEventLog.UiReact;
  useCreatePersister(
    store,
    (store) => {
      const db = openDatabaseSync("cbms-app");
      const persister = createExpoSqlitePersister(store, db);
      logger.debug("created persister");
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

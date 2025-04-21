import "~/global.css";
import { TinyBaseEventLog } from "@lofwen/event-log";
import {} from "@react-navigation/native";
import { Slot } from "expo-router";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("Persister");

export default function AuthenticatedLayout() {
  const { useCreateStore } = TinyBaseEventLog.UiReact;
  const store = useCreateStore(() => {
    const store = TinyBaseEventLog.Store.create();
    logger.debug("created store");
    return store;
  });
  // const persister = useCreatePersister(
  //   store,
  //   (store) => {
  //     if (Platform.OS === "web") {
  //       const {
  //         createSessionPersister,
  //       } = require("tinybase/persisters/persister-browser/with-schemas");
  //       const persister = createSessionPersister(store, "cbms-app2");
  //       logger.debug("created browser session persister");
  //       return persister;
  //     }

  //     const { openDatabaseSync } = require("expo-sqlite");
  //     const db = openDatabaseSync("cbms-app");
  //     const {
  //       createExpoSqlitePersister,
  //     } = require("tinybase/persisters/persister-expo-sqlite/with-schemas");
  //     const persister = createExpoSqlitePersister(store, db);
  //     logger.debug("created Expo SQLite persister");
  //     return persister;
  //   },
  //   undefined,
  //   async (persister) => {
  //     await persister.load();
  //     logger.debug("loaded from persister");
  //     await persister.startAutoLoad();
  //     logger.debug("started persister auto-load");
  //     await persister.startAutoSave();
  //     logger.debug("started persister auto-save");
  //   },
  //   undefined,
  //   () => {
  //     logger.debug("destroyed persister");
  //   },
  // );
  // const persisterStatus = usePersisterStatus(persister);
  // logger.debug(`persister status: ${persisterStatus}`);

  return (
    <TinyBaseEventLog.UiReact.Provider store={store}>
      <Slot screenOptions={{ headerShown: false }} />
    </TinyBaseEventLog.UiReact.Provider>
  );
}

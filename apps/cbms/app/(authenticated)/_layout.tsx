import "~/global.css";
import { TinyBaseEventLog } from "@lofwen/event-log";
import { Slot } from "expo-router";
import { rootLogger } from "~/rootLogger";

const logger = rootLogger.extend("AuthenticatedLayout");

// const storageName = "cbms-app-1745336397";
// process.env.NODE_ENV === "development" ? randomUUID() : "cbms-app";

export default function AuthenticatedLayout() {
  logger.debug("rendering");

  const { useCreateStore } = TinyBaseEventLog.UiReact;
  const store = useCreateStore(() => {
    const store = TinyBaseEventLog.Store.create();
    logger.debug("created store");
    return store;
  });

  // const { useCreatePersister, usePersisterStatus } = TinyBaseEventLog.UiReact;
  // useEffect(() => {
  //   logger.debug("storage name:", storageName);
  // }, []);
  // const [storeLoaded, setStoreLoaded] = useState(false);
  // const persister = useCreatePersister(
  //   store,
  //   (store) => {
  //     if (Platform.OS === "web") {
  //       const {
  //         createSessionPersister,
  //       } = require("tinybase/persisters/persister-browser/with-schemas");
  //       const persister = createSessionPersister(store, storageName);
  //       logger.debug("created browser session persister");
  //       return persister;
  //     }

  //     const { openDatabaseSync } = require("expo-sqlite");
  //     const db = openDatabaseSync(storageName);
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
  //     setStoreLoaded(true);
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

  // if (!storeLoaded) {
  //   logger.debug("store is not loaded yet, not rendering");
  //   return null;
  // }

  return (
    <TinyBaseEventLog.UiReact.Provider store={store}>
      <Slot screenOptions={{ headerShown: false }} />
    </TinyBaseEventLog.UiReact.Provider>
  );
}

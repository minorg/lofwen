#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createMergeableStore } from "tinybase";
import { createFilePersister } from "tinybase/persisters/persister-file";
import { createWsServer } from "tinybase/synchronizers/synchronizer-ws-server";
import { WebSocketServer } from "ws";

const dataDirectoryPath = fs.existsSync("/data") ? "/data" : ".";

const server = createWsServer(new WebSocketServer({ port: 8080 }), (pathId) =>
  createFilePersister(
    createMergeableStore(),
    path.join(
      dataDirectoryPath,
      `${pathId.replace(/[^a-zA-Z0-9]/g, "-")}.json`,
    ),
  ),
);

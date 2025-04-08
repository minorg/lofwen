#!/usr/bin/env node
import { createMergeableStore } from "tinybase";
import { createFilePersister } from "tinybase/persisters/persister-file";
import { createWsServer } from "tinybase/synchronizers/synchronizer-ws-server";
import { WebSocketServer } from "ws";

const server = createWsServer(new WebSocketServer({ port: 8080 }), (pathId) =>
  createFilePersister(
    createMergeableStore(),
    `${pathId.replace(/[^a-zA-Z0-9]/g, "-")}.json`,
  ),
);

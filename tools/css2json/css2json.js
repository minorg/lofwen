#!/usr/bin/env node

import fs from "node:fs";
import { parse } from "@adobe/css-tools";

const data = fs.readFileSync(0, "utf-8");
const ast = parse(data, { silent: true });
process.stdout.write(JSON.stringify(ast, undefined, 2));

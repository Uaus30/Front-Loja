import type { RequestHandler } from "express";

// @ts-expect-error Built server entry is generated at deploy time and has no type declarations.
import server from "../dist/index.cjs";

export default server as RequestHandler;

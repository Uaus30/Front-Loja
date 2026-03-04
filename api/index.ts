import type { RequestHandler } from "express";

const server = require("../dist/index.cjs") as RequestHandler;

export default server;
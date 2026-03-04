import type { Request, Response } from "express";
import handler from "./[...path]";

export default async function indexHandler(req: Request, res: Response) {
  return handler(req, res);
}

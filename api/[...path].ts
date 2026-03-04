import express, { type NextFunction, type Request, type Response } from "express";
import { loadEnv } from "../server/env.js";
import { registerRoutes } from "../server/routes.js";

loadEnv();

const app = express();

app.use(
  express.json({
    verify: (req, _res, buf) => {
      (req as Request & { rawBody?: Buffer }).rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: false }));

const appReady = (async () => {
  await registerRoutes({} as any, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });
})();

export default async function handler(req: Request, res: Response) {
  await appReady;
  return app(req, res);
}

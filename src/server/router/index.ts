// src/server/router/index.ts
import superjson from "superjson";
import { createRouter } from "./context";

import { friendsRouter } from "./friends";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("friends.", friendsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

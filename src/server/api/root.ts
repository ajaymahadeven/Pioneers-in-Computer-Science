import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { pioneerRouter } from "@/server/api/routers/pioneer";

export const appRouter = createTRPCRouter({
  pioneer: pioneerRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);

import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { businessRouter } from "./routers/business";
import { categoryRouter } from "./routers/category";
import { groupRouter } from "./routers/group";
import { collectionRouter } from "./routers/collection";
import { productsRouter } from "./routers/products";
import { paymentsRouter } from "./routers/payments";
import { ordersRouter } from "./routers/orders";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  business: businessRouter,
  categories: categoryRouter,
  groups: groupRouter,
  collections: collectionRouter,
  products: productsRouter,
  payments: paymentsRouter,
  orders: ordersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);



import { createRouter } from "@tanstack/react-router";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
  return createRouter({
    routeTree,
    Wrap: ({ children }) => <ConvexProvider client={convex}>{children}</ConvexProvider>,
  });
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}

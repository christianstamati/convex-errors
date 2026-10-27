// `createBot` and `navigate` stand for a mutation and the router's navigate.
import { attempt } from "./lib/attempt";

export const createAndOpen = (createBot: () => Promise<string>, navigate: (id: string) => void) =>
  attempt(createBot().then((id) => navigate(id)));

import { useQuery } from "convex-helpers/react";
import { makeFunctionReference } from "convex/server";
import { errors } from "./errors";

const listBots = makeFunctionReference<"query", {}, string[]>("bots:list");

export const useBotsError = () => {
  const result = useQuery(listBots, {});
  return result.status === "error" ? errors.message(result.error) : undefined;
};

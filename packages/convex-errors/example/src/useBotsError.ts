import { useQuery } from "convex-helpers/react";
import { api } from "@convex/_generated/api";
import { errors } from "@convex/errors";

export const useBotsError = () => {
  const result = useQuery(api.bots.list);
  return result.status === "error" ? errors.message(result.error) : undefined;
};

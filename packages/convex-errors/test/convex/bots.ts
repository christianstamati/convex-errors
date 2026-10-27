import { zCustomMutation } from "convex-helpers/server/zod4";
import { NoOp } from "convex-helpers/server/customFunctions";
import { mutationGeneric } from "convex/server";
import { v } from "convex/values";
import { z } from "zod";
import { errors } from "./errors";

const MAX_BOTS = 2;

export const createBot = mutationGeneric({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const bots = await ctx.db.query("bots").collect();
    if (bots.length >= MAX_BOTS) throw errors.create("too_many", { what: "bots", max: MAX_BOTS });
    return await ctx.db.insert("bots", { name });
  },
});

const zMutation = zCustomMutation(mutationGeneric, NoOp);

export const rename = zMutation({
  args: { name: z.string().min(3) },
  handler: async () => null,
});

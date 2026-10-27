import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { errors } from "./errors";

const MAX_BOTS = 5;

export const createBot = mutation({
  args: { projectId: v.string(), name: v.string() },
  returns: v.id("bots"),
  handler: async (ctx, { projectId, name }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw errors.create("sign_in");

    const bots = await ctx.db
      .query("bots")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .take(MAX_BOTS);
    if (bots.length >= MAX_BOTS) {
      throw errors.create("too_many", { what: "bots", max: MAX_BOTS });
    }
    return await ctx.db.insert("bots", { projectId, name });
  },
});

// These don't compile, which is the point:
// errors.create("not_found")                      params missing
// errors.create("not_found", { what: "robot" })   "robot" isn't a known thing
// errors.create("nope")                           unknown code

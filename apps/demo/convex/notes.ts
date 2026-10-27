import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("notes").order("desc").take(100);
  },
});

export const create = mutation({
  args: { text: v.string() },
  returns: v.id("notes"),
  handler: async (ctx, { text }) => {
    const trimmed = text.trim();
    if (trimmed.length === 0 || trimmed.length > 500) {
      throw new ConvexError("A note must be 1 to 500 characters.");
    }
    return await ctx.db.insert("notes", { text: trimmed });
  },
});

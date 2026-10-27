import { v } from "convex/values";
import { errors } from "./errors";
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
      throw errors.create("note_length", { max: 500 });
    }
    return await ctx.db.insert("notes", { text: trimmed });
  },
});

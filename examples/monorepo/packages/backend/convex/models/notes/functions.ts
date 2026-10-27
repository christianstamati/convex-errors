import { v } from "convex/values";
import { mutation, query } from "../../_generated/server";
import { errors } from "../../errors";

const MAX_LENGTH = 500;

const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("notes").order("desc").take(100);
  },
});

const create = mutation({
  args: { text: v.string() },
  returns: v.id("notes"),
  handler: async (ctx, { text }) => {
    const trimmed = text.trim();
    if (trimmed.length === 0 || trimmed.length > MAX_LENGTH) {
      throw errors.create("note_length", { max: MAX_LENGTH });
    }
    return await ctx.db.insert("notes", { text: trimmed });
  },
});

const remove = mutation({
  args: { id: v.id("notes") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    const note = await ctx.db.get("notes", id);
    if (note === null) throw errors.create("note_not_found");
    await ctx.db.delete("notes", id);
    return null;
  },
});

export const notesApi = { list, create, remove };

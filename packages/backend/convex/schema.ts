import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Example feature: delete this table and convex/notes.ts to remove it.
  notes: defineTable({
    text: v.string(),
  }),
});

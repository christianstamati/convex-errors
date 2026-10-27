import { defineTable } from "convex/server";
import { v } from "convex/values";

export const notesTable = defineTable({
  text: v.string(),
});

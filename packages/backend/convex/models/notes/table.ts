import { defineTable } from "convex/server";
import { v } from "convex/values";

/** Example feature: a shared note. There's no sign-in, so anyone can read and edit the list. */
export const notesTable = defineTable({
  text: v.string(),
});

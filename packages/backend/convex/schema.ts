import { defineSchema } from "convex/server";
import { notesTable } from "./models/notes/table";

export default defineSchema({
  // Example feature: delete this table and convex/models/notes to remove it.
  notes: notesTable,
});

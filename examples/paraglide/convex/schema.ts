import { defineSchema } from "convex/server";
import { notesTable } from "./models/notes/table";

export default defineSchema({
  notes: notesTable,
});

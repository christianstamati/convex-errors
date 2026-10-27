import { convexTest } from "convex-test";
import { describe, expect, test } from "vite-plus/test";
import { api } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

describe("notes", () => {
  test("creates and lists notes, newest first", async () => {
    const t = convexTest(schema, modules);
    await t.mutation(api.notes.create, { text: "  first  " });
    await t.mutation(api.notes.create, { text: "second" });

    const notes = await t.query(api.notes.list, {});
    expect(notes.map((note) => note.text)).toEqual(["second", "first"]);
  });

  test("rejects empty notes", async () => {
    const t = convexTest(schema, modules);
    await expect(t.mutation(api.notes.create, { text: "   " })).rejects.toThrow();
  });

  test("deletes a note", async () => {
    const t = convexTest(schema, modules);
    const id = await t.mutation(api.notes.create, { text: "gone soon" });

    await t.mutation(api.notes.remove, { id });
    expect(await t.query(api.notes.list, {})).toEqual([]);
    await expect(t.mutation(api.notes.remove, { id })).rejects.toThrow("Note not found");
  });
});

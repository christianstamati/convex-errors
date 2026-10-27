// Example feature: delete this file (and the link on the home page) to remove it.
import { Button } from "@tanstack-convex-starter/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@tanstack-convex-starter/ui/components/card";
import { Input } from "@tanstack-convex-starter/ui/components/input";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "#/lib/api";
import { errorMessage } from "#/lib/errors";

export const Route = createFileRoute("/notes")({ component: Notes });

function Notes() {
  const [text, setText] = useState("");
  const [error, setError] = useState<string>();
  const notes = useQuery(api.notes.list);
  const create = useMutation(api.notes.create);
  const remove = useMutation(api.notes.remove);

  return (
    <main className="mx-auto flex min-h-svh max-w-xl flex-col gap-4 p-6 pt-16">
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
          <CardDescription>Stored in Convex and updated live.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form
            className="flex gap-2"
            onSubmit={async (event) => {
              event.preventDefault();
              if (text.trim() === "") return;
              try {
                await create({ text });
                setText("");
                setError(undefined);
              } catch (e) {
                setError(errorMessage(e, "Couldn't add the note."));
              }
            }}
          >
            <Input
              aria-label="New note"
              placeholder="Write a note…"
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
            <Button type="submit">Add</Button>
          </form>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {notes === undefined ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : notes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notes yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {notes.map((note) => (
                <li key={note._id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="break-words">{note.text}</span>
                  <Button variant="ghost" size="sm" onClick={() => void remove({ id: note._id })}>
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

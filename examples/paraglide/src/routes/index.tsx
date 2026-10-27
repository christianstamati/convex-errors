import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { errorMessage } from "../lib/errors";
import { m } from "../paraglide/messages.js";
import { setLocale } from "../paraglide/runtime.js";

export const Route = createFileRoute("/")({ component: Notes });

function Notes() {
  const [text, setText] = useState("");
  const [error, setError] = useState<string>();
  const notes = useQuery(api.notes.list);
  const create = useMutation(api.notes.create);

  return (
    <main>
      <p>
        <button type="button" onClick={() => setLocale("en")}>
          English
        </button>{" "}
        <button type="button" onClick={() => setLocale("it")}>
          Italiano
        </button>
      </p>
      <h1>{m.notes()}</h1>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          try {
            await create({ text });
            setText("");
            setError(undefined);
          } catch (e) {
            setError(errorMessage(e));
          }
        }}
      >
        <input
          aria-label={m.notes()}
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <button type="submit">{m.add()}</button>
      </form>
      {error && <p role="alert">{error}</p>}
      <ul>
        {notes?.map((note) => (
          <li key={note._id}>{note.text}</li>
        ))}
      </ul>
    </main>
  );
}

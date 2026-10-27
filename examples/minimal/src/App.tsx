import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "./lib/api";
import { attempt } from "./lib/attempt";

export function App() {
  const [text, setText] = useState("");
  const notes = useQuery(api.notes.list);
  const create = useMutation(api.notes.create);

  return (
    <main>
      <h1>convex-errors</h1>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (await attempt(create({ text }), "Couldn't add the note.")) setText("");
        }}
      >
        <input
          aria-label="New note"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {notes?.map((note) => (
          <li key={note._id}>{note.text}</li>
        ))}
      </ul>
    </main>
  );
}

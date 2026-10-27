import { useMutation, useQuery } from "convex/react";
import { errorMessage } from "convex-errors";
import { useState } from "react";
import { api } from "../convex/_generated/api";

export function App() {
  const [text, setText] = useState("");
  const [error, setError] = useState<string>();
  const notes = useQuery(api.notes.list);
  const create = useMutation(api.notes.create);

  return (
    <main>
      <h1>convex-errors</h1>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          try {
            await create({ text });
            setText("");
            setError(undefined);
          } catch (e) {
            setError(errorMessage(e, "Couldn't add the note."));
          }
        }}
      >
        <input
          aria-label="New note"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <button type="submit">Add</button>
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

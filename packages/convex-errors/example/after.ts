import { attempt } from "./toast";

// `save`, `close`, `createBot` and `navigate` stand for a mutation and the app's own functions.
export const saveNote = async (save: () => Promise<null>, close: () => void) => {
  if (await attempt(save(), "Couldn't save the note.")) close();
};

export const createAndOpen = (createBot: () => Promise<string>, navigate: (id: string) => void) =>
  attempt(createBot().then((id) => navigate(id)));

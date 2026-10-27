// `save` and `close` stand for a mutation and the app's own function.
import { attempt } from "./lib/attempt";

export const saveNote = async (save: () => Promise<null>, close: () => void) => {
  if (await attempt(save(), "Couldn't save the note.")) close();
};

import { errors } from "@monorepo/backend/convex/errors";
import { createAttempt } from "convex-errors";
import { toast } from "sonner";

/** Runs a mutation a click started and shows a toast if it fails. Resolves to whether it worked. */
export const attempt = createAttempt(errors, { onError: (message) => toast.error(message) });

import { createAttempt } from "@cs-stack/convex-errors";
import { toast } from "sonner";
import { errors } from "../../convex/errors";

/** Runs a mutation a click started and shows a toast if it fails. Resolves to whether it worked. */
export const attempt = createAttempt(errors, { onError: (message) => toast.error(message) });

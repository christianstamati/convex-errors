import { createAttempt } from "convex-errors";
import { toast } from "sonner";
import { errors } from "./errors";

export const attempt = createAttempt(errors, { onError: (message) => toast.error(message) });

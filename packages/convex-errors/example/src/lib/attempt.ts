import { createAttempt } from "@cs-stack/convex-errors";
import { toast } from "sonner";
import { errors } from "../../convex/errors";

export const attempt = createAttempt(errors, { onError: (message) => toast.error(message) });

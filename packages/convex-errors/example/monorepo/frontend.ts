// The frontend of an app whose Convex functions live in their own package. (This repo maps
// the import to ../errors.ts in tsconfig.json.)
import { errors } from "@my-app/backend/convex/errors";

export const toMessage = (error: unknown) => errors.message(error);

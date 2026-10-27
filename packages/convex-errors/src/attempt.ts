import type { Errors } from "./define.js";
import type { Definitions, Locale, ParsedError } from "./types.js";

/**
 * Runs what a click started and reports a failure instead of losing it as an
 * unhandled rejection. Plug in your own toast: `onError: (m) => toast.error(m)`.
 * Resolves to whether the work succeeded, and never rejects:
 * `if (await attempt(save(note))) close()`.
 */
export const createAttempt =
  <D extends Definitions>(
    errors: Errors<D>,
    options: {
      onError: (message: string, parsed: ParsedError<D>) => void;
      /** The current language, read on each failure. */
      locale?: () => Locale<D> | undefined;
      /** Where the raw error goes. Defaults to `console.error`. */
      log?: (error: unknown) => void;
    },
  ) =>
  async (work: Promise<unknown>, fallback?: string): Promise<boolean> => {
    try {
      await work;
      return true;
    } catch (error) {
      try {
        (options.log ?? console.error)(error);
      } catch {
        // A broken logger mustn't stop the user from seeing the error.
      }
      try {
        options.onError(
          errors.message(error, { fallback, locale: options.locale?.() }),
          errors.parse(error, fallback),
        );
      } catch {
        // A broken toast must not turn into an unhandled rejection.
      }
      return false;
    }
  };

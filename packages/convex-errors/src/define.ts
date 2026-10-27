import { ConvexError } from "convex/values";
import type { Value } from "convex/values";
import { DEFAULT_FALLBACK, isConvexError, parseError } from "./parse.js";
import type {
  Checked,
  Definitions,
  ErrorData,
  InvalidArgsError,
  Locale,
  ParsedError,
} from "./types.js";

type MessageOptions<D extends Definitions> = {
  /** Shown for errors that aren't app errors or validation errors. */
  fallback?: string;
  /** Messages in the user's language. Without it, the default English messages are used. */
  locale?: Locale<D>;
};

export const defineErrors = <const D extends Definitions>(definitions: D & Checked<D>) => {
  /** `throw errors.create('not_found', { what: 'Bot' })` */
  const create = <C extends keyof D & string>(code: C, ...[params]: Parameters<D[C]>) => {
    const render = definitions[code] as unknown as (params: unknown) => string;
    const data = { code, params, message: render(params) };
    return new ConvexError(data as ErrorData<D, C> & Value);
  };

  /** Any caught error, sorted into an app error, a validation error or an unknown one. */
  const parse = (error: unknown, fallback?: string): ParsedError<D> =>
    parseError<D>(error, fallback);

  /** The text to show the user for any caught error. Never throws. */
  const message = (error: unknown, options: MessageOptions<D> = {}): string => {
    const { locale } = options;
    const fallback = options.fallback ?? locale?.fallback ?? DEFAULT_FALLBACK;
    try {
      const parsed = parse(error, fallback);
      if (parsed.code === "invalid_args") {
        return locale?.invalidArgs?.((parsed as InvalidArgsError).issues) ?? parsed.message;
      }
      if (parsed.code === "unknown") return parsed.message;
      if (!locale) return parsed.message;
      if (!Object.hasOwn(locale.messages, parsed.code)) return locale.fallback;
      const render = locale.messages[parsed.code] as unknown as (params: unknown) => string;
      return render("params" in parsed ? parsed.params : undefined);
    } catch {
      return fallback;
    }
  };

  /** Whether `error` is the app error `code`, narrowing its params. */
  const is = <C extends keyof D & string>(
    error: unknown,
    code: C,
  ): error is ConvexError<ErrorData<D, C> & Value> =>
    isConvexError(error) &&
    typeof error.data === "object" &&
    error.data !== null &&
    (error.data as { code?: unknown }).code === code;

  /** A locale for another language, checked against the codes and their params. */
  const translate = (locale: Locale<D>) => locale;

  return { create, parse, message, is, translate };
};

export type Errors<D extends Definitions> = ReturnType<typeof defineErrors<D>>;

import { expect, test, vi } from "vite-plus/test";
import { createAttempt } from "../src/index";
import { errors } from "./errors";

const setup = (locale?: () => ReturnType<typeof errors.translate> | undefined) => {
  const onError = vi.fn();
  const log = vi.fn();
  return { onError, log, attempt: createAttempt(errors, { onError, log, locale }) };
};

test("does nothing when the work succeeds", async () => {
  const { attempt, onError } = setup();
  await attempt(Promise.resolve(1));
  expect(onError).not.toHaveBeenCalled();
});

test("reports a failure with its message and parsed error", async () => {
  const { attempt, onError } = setup();
  await attempt(Promise.reject(errors.create("sign_in")));
  expect(onError).toHaveBeenCalledWith(
    "Sign in first.",
    expect.objectContaining({ code: "sign_in" }),
  );
});

test("reads the locale when it fails, not when it is created", async () => {
  const de = errors.translate({
    messages: { sign_in: () => "Melde dich an.", too_many: () => "Zu viele." },
    fallback: "Fehler.",
  });
  let current: typeof de | undefined;
  const { attempt, onError } = setup(() => current);
  await attempt(Promise.reject(errors.create("sign_in")));
  current = de;
  await attempt(Promise.reject(errors.create("sign_in")));
  expect(onError.mock.calls.map(([message]) => message)).toEqual([
    "Sign in first.",
    "Melde dich an.",
  ]);
});

test("passes the per-call fallback", async () => {
  const { attempt, onError } = setup();
  await attempt(Promise.reject(new Error()), "Could not save.");
  expect(onError).toHaveBeenCalledWith("Could not save.", expect.anything());
});

test("logs the raw error", async () => {
  const { attempt, log } = setup();
  const error = new Error("boom");
  await attempt(Promise.reject(error));
  expect(log).toHaveBeenCalledWith(error);
});

test("never rejects", async () => {
  const { attempt, onError } = setup();
  onError.mockImplementation(() => {
    throw new Error("toast broke");
  });
  await expect(attempt(Promise.reject(new Error()))).resolves.toBeUndefined();
});

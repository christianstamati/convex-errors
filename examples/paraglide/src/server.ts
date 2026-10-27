import handler from "@tanstack/react-start/server-entry";
import { paraglideMiddleware } from "./paraglide/server.js";

// Renders each request in the language from its cookie.
export default {
  fetch: (request: Request) => paraglideMiddleware(request, () => handler.fetch(request)),
};

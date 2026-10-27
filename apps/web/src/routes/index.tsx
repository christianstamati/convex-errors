import { buttonVariants } from "@cloud-stack/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="mx-auto flex min-h-svh max-w-xl flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">cloud-stack</h1>
      <p className="text-muted-foreground">TanStack Start, Convex and shadcn/ui on Base UI.</p>
      <div className="flex gap-2">
        <Link to="/notes" className={buttonVariants()}>
          Notes
        </Link>
      </div>
    </main>
  );
}

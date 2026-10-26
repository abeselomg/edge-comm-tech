import { EdgeLoader } from "@/components/ui/edge-loader";

/*
 * Shown inside #main (between header and footer) while a route is fetched or
 * suspends. The tall min-height keeps the footer from jumping up and back.
 * It exists only in transitions: a finished page never contains it.
 */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center overflow-x-clip">
      <EdgeLoader size="lg" />
    </div>
  );
}

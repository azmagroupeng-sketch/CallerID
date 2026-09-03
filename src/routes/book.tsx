import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/book")({
  component: BookLayout,
});

function BookLayout() {
  return <Outlet />;
}

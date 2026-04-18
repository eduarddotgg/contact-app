import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AppLayout } from "@/layouts/app-layout.tsx";

export const Route = createFileRoute("/_app")({
  component: () => {
    return (
      <AppLayout>
        <Outlet />
      </AppLayout>
    );
  },
});

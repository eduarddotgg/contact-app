import { createFileRoute } from "@tanstack/react-router";

import { Contacts } from "@/modules/contacts";

export const Route = createFileRoute("/_app/")({
  component: Contacts,
});

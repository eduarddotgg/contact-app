import { Contact } from "@contact-app/core/contact/contact";
import {
  contactIdSchema,
  createContactSchema,
  updateContactSchema,
} from "@contact-app/core/contact/contact.schema";

import { publicProcedure, router } from "./trpc";

export const trpcRouter = router({
  contact: {
    list: publicProcedure.query(() => Contact.list()),
    getById: publicProcedure.input(contactIdSchema).query(({ input }) => Contact.getById(input.id)),
    create: publicProcedure
      .input(createContactSchema)
      .mutation(({ input }) => Contact.create(input)),
    update: publicProcedure
      .input(updateContactSchema)
      .mutation(({ input }) => Contact.update(input)),
    delete: publicProcedure
      .input(contactIdSchema)
      .mutation(({ input }) => Contact.deleteById(input.id)),
  },
});

export type TrpcRouter = typeof trpcRouter;

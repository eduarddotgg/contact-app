import type { FC } from "react";

import type { Contact } from "@/types/trpc";
import { formatPhoneNumber } from "@/utils/phone";
import { getPhotoUrl } from "@/utils/photo";

import { ContactItemActions } from "./contact-item-actions";

type Props = {
  contact: Contact;
  onEdit: (contact: Contact) => void;
};

export const ContactItem: FC<Props> = ({ contact, onEdit }) => {
  const photoUrl = getPhotoUrl(contact.photo) ?? "/default-profile.png";
  const formattedPhone = formatPhoneNumber(contact.phone);

  return (
    <div className="group flex items-center gap-4 py-3">
      <img
        src={photoUrl}
        alt={contact.name}
        className="h-11 w-11 shrink-0 rounded-full border border-grey-60 object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-h3">{contact.name}</p>
        <p className="truncate text-foreground-secondary text-message">{formattedPhone}</p>
      </div>
      <ContactItemActions contact={contact} onEdit={onEdit} />
    </div>
  );
};

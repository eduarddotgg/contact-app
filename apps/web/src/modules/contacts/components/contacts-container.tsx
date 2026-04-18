import { ContactsForm } from "@/components/contacts-form";
import { ContactItem } from "@/modules/contacts/components/contact-item";
import { ContactsEmpty } from "@/modules/contacts/components/contacts-empty";
import { ContactsSkeleton } from "@/modules/contacts/components/contacts-skeleton";
import { useContacts } from "@/modules/contacts/hooks/use-contacts";

export const ContactsContainer = () => {
  const {
    parentRef,
    virtualContacts,
    totalSize,
    isLoading,
    isEmpty,
    editingContact,
    isEditOpen,
    handleEdit,
    handleEditOpenChange,
  } = useContacts();

  if (isLoading) return <ContactsSkeleton />;
  if (isEmpty) return <ContactsEmpty />;

  return (
    <div ref={parentRef}>
      <ul className="relative flex flex-col" style={{ height: `${totalSize}px` }}>
        {virtualContacts.map(({ contact, size, translateY }) => (
          <li
            key={contact.id}
            className="absolute top-0 left-0 w-full"
            style={{
              height: `${size}px`,
              transform: `translateY(${translateY}px)`,
            }}
          >
            <ContactItem contact={contact} onEdit={handleEdit} />
          </li>
        ))}
      </ul>
      <ContactsForm isOpen={isEditOpen} onOpenChange={handleEditOpenChange} data={editingContact} />
    </div>
  );
};

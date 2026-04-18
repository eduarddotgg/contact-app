import { useInfiniteQuery } from "@tanstack/react-query";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useMemo, useRef, useState } from "react";

import { CONTACTS_PAGE_SIZE, ITEM_HEIGHT, OVERSCAN } from "@/modules/contacts/constants.ts";
import { trpc } from "@/service/trpc";
import type { Contact } from "@/types/trpc";

export const useContacts = () => {
  const { data, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery(
      trpc.contact.list.infiniteQueryOptions(
        { limit: CONTACTS_PAGE_SIZE },
        {
          initialCursor: null,
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
      ),
    );

  const contacts = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const parentRef = useRef<HTMLDivElement>(null);
  const [editingContact, setEditingContact] = useState<Contact | undefined>(undefined);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const virtualizer = useWindowVirtualizer({
    count: contacts.length,
    estimateSize: () => ITEM_HEIGHT,
    overscan: OVERSCAN,
    scrollMargin: parentRef.current?.offsetTop ?? 0,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const lastItemIndex = virtualItems[virtualItems.length - 1]?.index ?? -1;

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    if (lastItemIndex >= contacts.length - 1) {
      void fetchNextPage();
    }
  }, [contacts.length, fetchNextPage, hasNextPage, isFetchingNextPage, lastItemIndex]);

  const virtualContacts = useMemo(
    () =>
      virtualItems.flatMap((virtualItem) => {
        const contact = contacts[virtualItem.index];

        if (!contact) return [];

        return [
          {
            contact,
            size: virtualItem.size,
            translateY: virtualItem.start - virtualizer.options.scrollMargin,
          },
        ];
      }),
    [contacts, virtualItems, virtualizer.options.scrollMargin],
  );

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsEditOpen(true);
  };

  const handleEditOpenChange = (open: boolean) => {
    setIsEditOpen(open);
    if (!open) {
      setEditingContact(undefined);
    }
  };

  return {
    parentRef,
    virtualContacts,
    totalSize: virtualizer.getTotalSize(),
    isLoading,
    isError,
    isEmpty: contacts.length === 0,
    editingContact,
    isEditOpen,
    handleEdit,
    handleEditOpenChange,
  };
};

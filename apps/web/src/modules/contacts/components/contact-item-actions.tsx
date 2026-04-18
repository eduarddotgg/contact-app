import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@contact-app/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type FC, useState } from "react";

import { trpc } from "@/service/trpc";
import type { Contact } from "@/types/trpc";

type Props = {
  contact: Contact;
  onEdit: (contact: Contact) => void;
};

export const ContactItemActions: FC<Props> = ({ contact, onEdit }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    ...trpc.contact.delete.mutationOptions(),
    onSuccess: () => queryClient.invalidateQueries(trpc.contact.list.pathFilter()),
  });

  const onRemove = () => deleteMutation.mutate({ id: contact.id });
  const quickActions = [
    {
      key: "mute",
      label: "Mute",
      icon: "/icons/mute.svg",
      onSelect: () => undefined,
    },
    {
      key: "call",
      label: "Call",
      icon: "/icons/call.svg",
      onSelect: () => undefined,
    },
  ] as const;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-2 opacity-100 transition-opacity lg:pointer-events-none lg:opacity-0 lg:group-hover:pointer-events-auto lg:group-hover:opacity-100 lg:group-focus-within:pointer-events-auto lg:group-focus-within:opacity-100",
        isMenuOpen && "lg:pointer-events-auto lg:opacity-100",
      )}
    >
      {quickActions.map((action) => (
        <Button
          key={action.key}
          type="button"
          variant="ghost"
          size="icon"
          className="hidden sm:inline-flex"
          aria-label={`${action.label} ${contact.name}`}
          onClick={action.onSelect}
        >
          <img src={action.icon} alt="" className="h-6 w-6" />
        </Button>
      ))}

      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn([isMenuOpen && "bg-accent"])}
            aria-label={`More actions for ${contact.name}`}
          >
            <img src="/icons/more.svg" alt="" className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={12} className="w-56 p-0">
          {quickActions.map((action) => (
            <DropdownMenuItem
              key={action.key}
              onSelect={action.onSelect}
              className="rounded-none sm:hidden"
            >
              <img src={action.icon} alt="" className="h-6 w-6 opacity-[0.56]" />
              {action.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator className="sm:hidden" />
          <DropdownMenuItem onSelect={() => onEdit(contact)} className="rounded-none">
            <img src="/icons/settings.svg" alt="" className="h-6 w-6 opacity-[0.56]" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => undefined} className="rounded-none">
            <img src="/icons/favourite.svg" alt="" className="h-6 w-6 opacity-[0.56]" />
            Favourite
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={onRemove}
            disabled={deleteMutation.isPending}
            className="rounded-none"
          >
            <img src="/icons/delete.svg" alt="" className="h-6 w-6 opacity-[0.56]" />
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import type { ComponentProps, FC } from "react";

import { cn } from "../lib/utils";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

export const DropdownMenuContent: FC<ComponentProps<typeof DropdownMenuPrimitive.Content>> = ({
  className,
  sideOffset = 8,
  ...props
}) => (
  <DropdownMenuPortal>
    <DropdownMenuPrimitive.Content
      sideOffset={sideOffset}
      className={cn(
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 z-50 min-w-48 overflow-hidden rounded-2xl border border-grey-60 bg-grey-70 p-2 text-foreground shadow-lg outline-hidden data-[state=closed]:animate-out data-[state=open]:animate-in",
        className,
      )}
      {...props}
    />
  </DropdownMenuPortal>
);

export type DropdownMenuItemProps = ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
};

export const DropdownMenuItem: FC<DropdownMenuItemProps> = ({ className, inset, ...props }) => (
  <DropdownMenuPrimitive.Item
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-3 rounded-xl px-3 py-3 font-medium text-body text-foreground outline-hidden transition-colors focus:bg-grey-60 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
);

export const DropdownMenuSeparator: FC<ComponentProps<typeof DropdownMenuPrimitive.Separator>> = ({
  className,
  ...props
}) => (
  <DropdownMenuPrimitive.Separator
    className={cn("mx-3 my-2 h-px bg-grey-60", className)}
    {...props}
  />
);

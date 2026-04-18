import * as DialogPrimitive from "@radix-ui/react-dialog";
// import { X } from "lucide-react";
import type { ComponentProps, FC, HTMLAttributes } from "react";

import { cn } from "../lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay: FC<ComponentProps<typeof DialogPrimitive.Overlay>> = ({
  className,
  ...props
}) => (
  <DialogPrimitive.Overlay
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/70 data-[state=closed]:animate-out data-[state=open]:animate-in",
      className,
    )}
    {...props}
  />
);

export const DialogContent: FC<ComponentProps<typeof DialogPrimitive.Content>> = ({
  className,
  children,
  ...props
}) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      className={cn(
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-6 rounded-2xl border border-border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in",
        className,
      )}
      {...props}
    >
      {children}
      {/*<DialogPrimitive.Close
        className="absolute top-4 right-4 rounded-sm text-muted-foreground opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring disabled:pointer-events-none"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </DialogPrimitive.Close>*/}
    </DialogPrimitive.Content>
  </DialogPortal>
);

export const DialogHeader: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("flex flex-col gap-1.5 text-left", className)} {...props} />
);

export const DialogFooter: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("flex flex-row items-center justify-end gap-2", className)} {...props} />
);

export const DialogTitle: FC<ComponentProps<typeof DialogPrimitive.Title>> = ({
  className,
  ...props
}) => (
  <DialogPrimitive.Title
    className={cn("font-serif text-foreground text-h1 leading-none", className)}
    {...props}
  />
);

export const DialogDescription: FC<ComponentProps<typeof DialogPrimitive.Description>> = ({
  className,
  ...props
}) => (
  <DialogPrimitive.Description
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
);

import type { ComponentProps, FC } from "react";

import { cn } from "../lib/utils";

export type InputProps = ComponentProps<"input">;

export const Input: FC<InputProps> = ({ className, type, ...props }) => (
  <input
    type={type}
    className={cn(
      "flex h-10 w-full rounded-lg border border-grey-60 bg-transparent px-3 py-2 text-foreground text-sm placeholder:text-[var(--color-foreground-muted)] focus-visible:border-grey-10 focus-visible:bg-grey-60 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive",
      className,
    )}
    {...props}
  />
);

import * as LabelPrimitive from "@radix-ui/react-label";
import type { ComponentProps, FC } from "react";

import { cn } from "../lib/utils";

export type LabelProps = ComponentProps<typeof LabelPrimitive.Root>;

export const Label: FC<LabelProps> = ({ className, ...props }) => (
  <LabelPrimitive.Root
    className={cn(
      "font-medium text-muted-foreground text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
    {...props}
  />
);

import type { FC } from "react";

const SKELETON_COUNT = 10;

export const ContactsSkeleton: FC = () => (
  <ul className="flex flex-col">
    {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
      <li key={index} className="flex items-center gap-4 py-3">
        <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-[var(--surface)]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-[var(--surface)]" />
          <div className="h-3 w-24 animate-pulse rounded bg-[var(--surface)]" />
        </div>
      </li>
    ))}
  </ul>
);

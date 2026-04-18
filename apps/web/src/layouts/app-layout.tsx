import type { FC, PropsWithChildren } from "react";

import Header from "@/components/header.tsx";

type Props = PropsWithChildren;

export const AppLayout: FC<Props> = ({ children }) => {
  return (
    <div className="flex h-full min-h-svh flex-col">
      <Header />
      <main className="flex w-full grow flex-row">
        <div className="hidden flex-1 items-center justify-end p-6 lg:flex"> </div>
        <div className="mx-auto w-full max-w-3xl shrink-0 border-r border-r-grey-60 border-l border-l-grey-60 px-3 lg:px-6">
          {children}
        </div>
        <div className="hidden flex-1 items-center justify-end p-6 lg:flex"> </div>
      </main>
    </div>
  );
};

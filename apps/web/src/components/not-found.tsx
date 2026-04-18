export const NotFound = () => {
  return (
    <div className="flex h-full min-h-svh flex-col">
      <main className="flex w-full grow flex-row">
        <div className="hidden flex-1 items-center justify-end p-6 lg:flex"> </div>
        <div className="mx-auto flex w-full max-w-3xl shrink-0 items-center justify-center border-r border-r-grey-60 border-l border-l-grey-60 px-3 lg:px-6">
          <h1 className="font-serif text-h2 lg:text-h1">Not Found</h1>
        </div>
        <div className="hidden flex-1 items-center justify-end p-6 lg:flex"> </div>
      </main>
    </div>
  );
};

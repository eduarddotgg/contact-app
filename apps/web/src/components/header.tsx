import { Button } from "@contact-app/ui";
import { Plus } from "lucide-react";
import { useState } from "react";

import { ContactsForm } from "@/components/contacts-form";

export default function Header() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <div className="flex w-full lg:min-h-24">
        <div className="mx-auto flex h-full w-full max-w-3xl shrink-0 items-center justify-between border-r border-r-grey-60 border-l border-l-grey-60 p-3 py-1 lg:min-h-24 lg:p-6 lg:py-6">
          <Button
            variant="ghost"
            rounded="full"
            size="icon"
            aria-label="Go back"
            className="lg:hidden"
          >
            <img src="/icons/back-arrow.svg" alt="" className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            rounded="full"
            size="icon"
            aria-label="Light mode"
            className="lg:hidden"
          >
            <img src="/icons/light-mode.svg" alt="" className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <header className="sticky top-0 left-0 z-50 flex w-full flex-row border-t border-t-grey-60 border-b border-b-grey-60 bg-grey-100">
        <div className="hidden flex-1 items-center justify-end p-6 lg:flex">
          <Button variant="ghost" rounded="full" size="icon" aria-label="Go back">
            <img src="/icons/back-arrow.svg" alt="" className="h-6 w-6" />
          </Button>
        </div>
        <div className="mx-auto flex w-full max-w-3xl shrink-0 items-center justify-between border-r border-r-grey-60 border-l border-l-grey-60 p-3 lg:p-6">
          <h1 className="font-serif text-h2 lg:text-h1">Contacts</h1>

          <div className="flex items-center gap-2 lg:gap-4">
            <Button variant="ghost" rounded="full" size="icon" aria-label="Settings">
              <img src="/icons/settings.svg" alt="" className="h-6 w-6" />
            </Button>
            <Button variant="ghost" rounded="full" size="icon" aria-label="Profile">
              <img src="/icons/profile-pic.svg" alt="" className="h-8 w-8 rounded-full" />
            </Button>
            <Button
              variant="default"
              rounded="full"
              onClick={() => setIsFormOpen(true)}
              aria-label="Add new"
              className="w-10 px-0 lg:w-auto lg:px-4"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden lg:inline">Add new</span>
            </Button>
          </div>
        </div>
        <div className="hidden flex-1 items-center justify-start p-6 lg:flex">
          <Button variant="ghost" rounded="full" size="icon" aria-label="Light mode">
            <img src="/icons/light-mode.svg" alt="" className="h-6 w-6" />
          </Button>
        </div>
        <ContactsForm isOpen={isFormOpen} onOpenChange={setIsFormOpen} />
      </header>
    </>
  );
}

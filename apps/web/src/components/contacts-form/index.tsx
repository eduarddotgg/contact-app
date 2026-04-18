import { PHONE_EXAMPLE } from "@contact-app/core/constants";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@contact-app/ui";
import type { FC } from "react";

import { useContactsForm } from "./hooks/use-contacts-form";
import type { Contact } from "#/types/trpc";
import { formatPhoneNumber } from "#/utils/phone";

const PHONE_PLACEHOLDER = formatPhoneNumber(PHONE_EXAMPLE);

type ContactsFormProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data?: Contact;
};

export const ContactsForm: FC<ContactsFormProps> = ({ isOpen, onOpenChange, data }) => {
  const {
    form,
    onSubmit,
    isPending,
    isEditMode,
    phoneInputValue,
    photoPreview,
    onPickImage,
    onPhoneChange,
    onClearImage,
    fileInputRef,
  } = useContactsForm({ data, onOpenChange, isOpen });

  const rootError = form.formState.errors.root?.message;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit contact" : "Add contact"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
            <div className="flex items-center gap-4">
              <img
                src={photoPreview ?? "/default-profile.png"}
                alt="Contact"
                className="h-20 w-20 shrink-0 rounded-full object-cover"
              />

              {photoPreview ? (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Change picture"
                    className="w-10 px-0 sm:w-auto sm:px-4"
                  >
                    <img src="/icons/change.svg" alt="" className="h-6 w-6" />
                    <span className="hidden sm:inline">Change picture</span>
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    onClick={onClearImage}
                    aria-label="Delete picture"
                  >
                    <img src="/icons/delete.svg" alt="" className="h-6 w-6" />
                  </Button>
                </div>
              ) : (
                <Button type="button" onClick={() => fileInputRef.current?.click()}>
                  <img src="/icons/add.svg" alt="" className="h-6 w-6" />
                  Add picture
                </Button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={onPickImage}
                className="hidden"
              />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jamie Wright" autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      name={field.name}
                      value={phoneInputValue}
                      placeholder={PHONE_PLACEHOLDER}
                      autoComplete="tel"
                      onChange={onPhoneChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="jamie.wright@mail.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-3">
              {rootError && <p className="font-medium text-destructive text-xs">{rootError}</p>}

              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  Done
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

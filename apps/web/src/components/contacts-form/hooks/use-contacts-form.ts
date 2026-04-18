import { PHONE_EXAMPLE, PHONE_REGEX } from "@contact-app/core/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { trpc } from "#/service/trpc";
import { uploadPhoto } from "#/service/upload";
import type { Contact } from "#/types/trpc";
import {
  formatHungarianPhoneInput,
  formatPhoneNumber,
  normalizeHungarianPhoneNumber,
} from "#/utils/phone";
import { getPhotoUrl } from "#/utils/photo";

const PHONE_EXAMPLE_DISPLAY = formatPhoneNumber(PHONE_EXAMPLE);
const PHONE_ERROR_MESSAGE = `Invalid phone number (e.g. ${PHONE_EXAMPLE_DISPLAY})`;

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.email("Invalid email address"),
  phone: z.string().regex(PHONE_REGEX, PHONE_ERROR_MESSAGE),
});

export type ContactsFormValues = z.infer<typeof formSchema>;

const defaultsFromData = (data?: Contact): ContactsFormValues => ({
  name: data?.name ?? "",
  email: data?.email ?? "",
  phone: data?.phone ?? "",
});

type Props = {
  data?: Contact;
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
};

export const useContactsForm = ({ data, onOpenChange, isOpen }: Props) => {
  const isEditMode = data !== undefined;
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoCleared, setPhotoCleared] = useState(false);
  const [phoneInputValue, setPhoneInputValue] = useState(() =>
    formatPhoneNumber(data?.phone ?? ""),
  );

  const form = useForm<ContactsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultsFromData(data),
  });

  useEffect(() => {
    if (!isOpen) return;
    form.reset(defaultsFromData(data));
    setPhotoFile(null);
    setPhotoCleared(false);
    setPhoneInputValue(formatPhoneNumber(data?.phone ?? ""));
  }, [isOpen, data, form]);

  const objectUrl = useMemo(() => (photoFile ? URL.createObjectURL(photoFile) : null), [photoFile]);

  useEffect(() => {
    if (!objectUrl) return;
    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  const photoPreview = (() => {
    if (objectUrl) return objectUrl;
    if (data?.photo && !photoCleared) return getPhotoUrl(data.photo);
    return null;
  })();

  const createMutation = useMutation({
    ...trpc.contact.create.mutationOptions(),
    onSuccess: () => queryClient.invalidateQueries(trpc.contact.list.pathFilter()),
  });

  const updateMutation = useMutation({
    ...trpc.contact.update.mutationOptions(),
    onSuccess: () => queryClient.invalidateQueries(trpc.contact.list.pathFilter()),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onPickImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setPhotoFile(file);
    setPhotoCleared(false);
  };

  const onClearImage = () => {
    setPhotoFile(null);
    setPhotoCleared(true);
  };

  const onPhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextInputValue = event.target.value;
    const normalizedPhone = normalizeHungarianPhoneNumber(nextInputValue) ?? "";
    const shouldValidate = form.formState.isSubmitted || form.getFieldState("phone").invalid;

    setPhoneInputValue(formatHungarianPhoneInput(nextInputValue));
    form.setValue("phone", normalizedPhone, {
      shouldDirty: true,
      shouldValidate,
    });
  };

  const resolvePhotoKey = async (): Promise<string | undefined> => {
    if (photoFile) return uploadPhoto(photoFile);
    if (isEditMode && photoCleared) return "";
    return undefined;
  };

  const onSubmit = form.handleSubmit(async (values) => {
    form.clearErrors("root");

    try {
      const photo = await resolvePhotoKey();

      if (isEditMode && data) {
        await updateMutation.mutateAsync({ id: data.id, ...values, photo });
      } else {
        await createMutation.mutateAsync({ ...values, photo });
      }

      form.reset();
      setPhotoFile(null);
      setPhotoCleared(false);
      setPhoneInputValue("");
      onOpenChange(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      form.setError("root", { message });
    }
  });

  return {
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
  };
};

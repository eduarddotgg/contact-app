import { AsYouType, parsePhoneNumberFromString } from "libphonenumber-js";

export const formatPhoneNumber = (phone: string) => {
  const parsedPhone = parsePhoneNumberFromString(phone, "HU");
  return parsedPhone?.formatInternational() ?? phone;
};

export const formatHungarianPhoneInput = (phone: string) =>
  phone ? new AsYouType("HU").input(phone) : phone;

export const normalizeHungarianPhoneNumber = (phone: string) => {
  const parsedPhone = parsePhoneNumberFromString(phone, "HU");
  return parsedPhone?.isValid() ? parsedPhone.number : null;
};

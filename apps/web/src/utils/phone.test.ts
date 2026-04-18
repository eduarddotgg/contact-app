import { describe, expect, it } from "vitest";

import {
  formatHungarianPhoneInput,
  formatPhoneNumber,
  normalizeHungarianPhoneNumber,
} from "./phone";

describe("phone utils", () => {
  it("formats canonical phone numbers for display", () => {
    expect(formatPhoneNumber("+36301234567")).toBe("+36 30 123 4567");
  });

  it("formats hungarian numbers as the user types", () => {
    expect(formatHungarianPhoneInput("06301234567")).toBe("06 30 123 4567");
  });

  it("normalizes hungarian local input to E.164", () => {
    expect(normalizeHungarianPhoneNumber("06 30 123 4567")).toBe("+36301234567");
  });

  it("normalizes hungarian international input to E.164", () => {
    expect(normalizeHungarianPhoneNumber("+36 30 123 4567")).toBe("+36301234567");
  });

  it("returns null for incomplete numbers", () => {
    expect(normalizeHungarianPhoneNumber("06 30 123")).toBeNull();
  });

  it("keeps incomplete input readable while typing", () => {
    expect(formatHungarianPhoneInput("0630123")).toBe("06 30 123");
  });
});

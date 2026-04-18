export const getPhotoUrl = (key: string | null | undefined): string | null => {
  if (!key) return null;
  return `${import.meta.env.VITE_API_URL}/uploads/${key}`;
};

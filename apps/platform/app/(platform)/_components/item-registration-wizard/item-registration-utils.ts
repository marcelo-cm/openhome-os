export function buildImageFormData(images: File[] | undefined): FormData | undefined {
  if (!images || images.length === 0) return undefined;

  const formData = new FormData();
  for (const file of images) formData.append('images', file);

  return formData;
}

export function toOptionalString(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

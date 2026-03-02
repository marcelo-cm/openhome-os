'use client';

import { ITEM_CONSTANTS } from '@openhome-os/core/models/item/item-constants';
import { ImagesStepSchema } from '@openhome-os/core/models/item/item-registration-schemas';
import type { WizardForm } from '@openhome-os/core/wizard/wizard-types';
import { ImageUploadArea } from '@openhome-os/particles/image-upload-area';
import type { AnyFieldApi } from '@tanstack/react-form';
import type { z } from 'zod';

type ImagesFields = z.infer<typeof ImagesStepSchema>;

interface ItemRegistrationImagesStepProps<TFormData extends ImagesFields> {
  form: WizardForm<TFormData>;
}

export function ItemRegistrationImagesStep<TFormData extends ImagesFields>({
  form,
}: ItemRegistrationImagesStepProps<TFormData>) {
  return (
    <div className="flex flex-col gap-4">
      <form.Field name="images">
        {(field: AnyFieldApi) => (
          <ImageUploadArea
            files={field.state.value ?? []}
            onFilesChange={(files: File[]) => field.handleChange(files)}
            maxFiles={ITEM_CONSTANTS.MAX_IMAGES}
          />
        )}
      </form.Field>
    </div>
  );
}

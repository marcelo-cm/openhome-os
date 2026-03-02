'use client';

import type { ReactNode } from 'react';

import { registerClothingItem } from '@openhome-os/core/models/item/item-registration-actions';
import { WizardProvider } from '@openhome-os/core/wizard/wizard-context';
import WizardDevTool from '@openhome-os/core/wizard/wizard-dev-tool';
import type {
  WizardForm,
  WizardStepConfig,
} from '@openhome-os/core/wizard/wizard-types';
import { useForm } from '@tanstack/react-form';

import { ItemRegistrationBasicInfoStep } from '../../_components/item-registration-wizard/item-registration-basic-info-step';
import { ItemRegistrationContent } from '../../_components/item-registration-wizard/item-registration-content';
import { ItemRegistrationControl } from '../../_components/item-registration-wizard/item-registration-control';
import { ItemRegistrationImagesStep } from '../../_components/item-registration-wizard/item-registration-images-step';
import { ItemRegistrationSettingsStep } from '../../_components/item-registration-wizard/item-registration-settings-step';
import {
  buildImageFormData,
  toOptionalString,
} from '../../_components/item-registration-wizard/item-registration-utils';
import { ClothingItemRegistrationDetailsStep } from './_components/clothing-item-registration-details-step';
import type { ClothingFormValues } from './_constants/clothing-registration-constants';
import {
  CLOTHING_DEFAULT_VALUES,
  CLOTHING_REGISTRATION_SCHEMA,
  CLOTHING_REGISTRATION_STEPS,
} from './_constants/clothing-registration-constants';

function renderStepContent(
  stepId: string,
  form: WizardForm<ClothingFormValues>,
): ReactNode {
  switch (stepId) {
    case 'basic-info':
      return <ItemRegistrationBasicInfoStep form={form} />;
    case 'clothing-details':
      return <ClothingItemRegistrationDetailsStep form={form} />;
    case 'settings':
      return <ItemRegistrationSettingsStep form={form} />;
    case 'images':
      return <ItemRegistrationImagesStep form={form} />;
    default:
      return null;
  }
}

export default function ClothingRegisterPage() {
  const form = useForm({
    defaultValues: CLOTHING_DEFAULT_VALUES,
    validators: {
      onChange: CLOTHING_REGISTRATION_SCHEMA,
    },
    onSubmit: async ({ value }: { value: ClothingFormValues }) => {
      const images = value.images ?? [];

      await registerClothingItem(
        {
          item: {
            name: value.name,
            description: value.description,
            brand: value.brand,
            base_color: toOptionalString(value.base_color),
            notes: toOptionalString(value.notes),
            purchase_price: toOptionalString(value.purchase_price),
            purchase_date: toOptionalString(value.purchase_date),
            location_id: value.location_id,
            status: value.status,
            privacy: value.privacy,
          },
          details: {
            size: toOptionalString(value.size),
            material: toOptionalString(value.material),
            care_instructions: toOptionalString(value.care_instructions),
          },
        },
        buildImageFormData(images),
      );
    },
  });

  const steps: WizardStepConfig[] = CLOTHING_REGISTRATION_STEPS.map((step) => ({
    ...step,
    content: renderStepContent(step.id, form),
  }));

  return (
    <WizardProvider steps={steps} form={form}>
      <div className="flex w-full max-w-xl flex-col gap-6">
        <ItemRegistrationContent />
        <ItemRegistrationControl />
        <WizardDevTool />
      </div>
    </WizardProvider>
  );
}

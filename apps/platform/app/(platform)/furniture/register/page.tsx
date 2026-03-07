'use client';

import type { ReactNode } from 'react';

import { registerFurnitureItem } from '@openhome-os/core/models/item/item-registration-actions';
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
import { FurnitureItemRegistrationDetailsStep } from './_components/furniture-item-registration-details-step';
import type { FurnitureFormValues } from './_constants/furniture-registration-constants';
import {
  FURNITURE_DEFAULT_VALUES,
  FURNITURE_REGISTRATION_SCHEMA,
  FURNITURE_REGISTRATION_STEPS,
} from './_constants/furniture-registration-constants';

function renderStepContent(
  stepId: string,
  form: WizardForm<FurnitureFormValues>,
): ReactNode {
  switch (stepId) {
    case 'basic-info':
      return <ItemRegistrationBasicInfoStep form={form} />;
    case 'furniture-details':
      return <FurnitureItemRegistrationDetailsStep form={form} />;
    case 'settings':
      return <ItemRegistrationSettingsStep form={form} />;
    case 'images':
      return <ItemRegistrationImagesStep form={form} />;
    default:
      return null;
  }
}

function buildFurnitureDimensions(value: FurnitureFormValues) {
  const hasAnyDimensionValue =
    value.dimension_width !== undefined ||
    value.dimension_height !== undefined ||
    value.dimension_depth !== undefined ||
    value.dimension_unit !== undefined;

  if (!hasAnyDimensionValue) return undefined;

  return {
    width: value.dimension_width!,
    height: value.dimension_height!,
    depth: value.dimension_depth!,
    unit: value.dimension_unit!,
  };
}

export default function FurnitureRegisterPage() {
  const form = useForm({
    defaultValues: FURNITURE_DEFAULT_VALUES,
    validators: {
      onChange: FURNITURE_REGISTRATION_SCHEMA,
    },
    onSubmit: async ({ value }: { value: FurnitureFormValues }) => {
      const images = value.images ?? [];

      await registerFurnitureItem(
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
            dimensions: buildFurnitureDimensions(value),
          },
        },
        buildImageFormData(images),
      );
    },
  });

  const steps: WizardStepConfig[] = FURNITURE_REGISTRATION_STEPS.map(
    (step) => ({
      ...step,
      content: renderStepContent(step.id, form),
    }),
  );

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

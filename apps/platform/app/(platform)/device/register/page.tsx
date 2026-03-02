'use client';

import type { ReactNode } from 'react';

import { registerDeviceItem } from '@openhome-os/core/models/item/item-registration-actions';
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
import { DeviceItemRegistrationDetailsStep } from './_components/device-item-registration-details-step';
import type { DeviceFormValues } from './_constants/device-registration-constants';
import {
  DEVICE_DEFAULT_VALUES,
  DEVICE_REGISTRATION_SCHEMA,
  DEVICE_REGISTRATION_STEPS,
} from './_constants/device-registration-constants';

function renderStepContent(
  stepId: string,
  form: WizardForm<DeviceFormValues>,
): ReactNode {
  switch (stepId) {
    case 'basic-info':
      return <ItemRegistrationBasicInfoStep form={form} />;
    case 'device-details':
      return <DeviceItemRegistrationDetailsStep form={form} />;
    case 'settings':
      return <ItemRegistrationSettingsStep form={form} />;
    case 'images':
      return <ItemRegistrationImagesStep form={form} />;
    default:
      return null;
  }
}

export default function DeviceRegisterPage() {
  const form = useForm({
    defaultValues: DEVICE_DEFAULT_VALUES,
    validators: {
      onChange: DEVICE_REGISTRATION_SCHEMA,
    },
    onSubmit: async ({ value }: { value: DeviceFormValues }) => {
      const images = value.images ?? [];

      await registerDeviceItem(
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
            serial_number: toOptionalString(value.serial_number),
            model_number: toOptionalString(value.model_number),
            warranty_expiration: toOptionalString(value.warranty_expiration),
          },
        },
        buildImageFormData(images),
      );
    },
  });

  const steps: WizardStepConfig[] = DEVICE_REGISTRATION_STEPS.map((step) => ({
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

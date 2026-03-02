'use client';

import type { ReactNode } from 'react';

import { registerPersonalItem } from '@openhome-os/core/models/item/item-registration-actions';
import { WizardProvider } from '@openhome-os/core/wizard/wizard-context';
import WizardDevTool from '@openhome-os/core/wizard/wizard-dev-tool';
import type {
  WizardForm,
  WizardStepConfig,
} from '@openhome-os/core/wizard/wizard-types';
import { useForm } from '@tanstack/react-form';

import { BasicInfoStep } from './_components/personal-item-registration-basic-info-step';
import PersonalItemRegistrationContent from './_components/personal-item-registration-content';
import PersonalItemRegistrationControl from './_components/personal-item-registration-control';
import { PersonalDetailsStep } from './_components/personal-item-registration-details-step';
import { ImagesStep } from './_components/personal-item-registration-images-step';
import { SettingsStep } from './_components/settings-step';
import type { PersonalFormValues } from './_constants/personal-registration-constants';
import {
  PERSONAL_DEFAULT_VALUES,
  PERSONAL_REGISTRATION_SCHEMA,
  PERSONAL_REGISTRATION_STEPS,
} from './_constants/personal-registration-constants';

function buildImageFormData(images: File[]): FormData | undefined {
  if (images.length === 0) return undefined;
  const fd = new FormData();
  for (const file of images) {
    fd.append('images', file);
  }
  return fd;
}

function renderStepContent(stepId: string, form: WizardForm): ReactNode {
  switch (stepId) {
    case 'basic-info':
      return <BasicInfoStep form={form} />;
    case 'personal-details':
      return <PersonalDetailsStep form={form} />;
    case 'settings':
      return <SettingsStep form={form} />;
    case 'images':
      return <ImagesStep form={form} />;
    default:
      return null;
  }
}

export default function PersonalRegisterPage() {
  const form = useForm({
    defaultValues: PERSONAL_DEFAULT_VALUES,
    validators: {
      onChange: PERSONAL_REGISTRATION_SCHEMA,
    },
    onSubmit: async ({ value }: { value: PersonalFormValues }) => {
      const images = (value.images ?? []) as File[];

      await registerPersonalItem(
        {
          item: {
            name: value.name,
            description: value.description || undefined,
            brand: value.brand || undefined,
            base_color: value.base_color,
            notes: value.notes,
            purchase_price: value.purchase_price,
            purchase_date: value.purchase_date,
            location_id: value.location_id,
            status: value.status as string,
            privacy: value.privacy as string,
          },
          details: {
            material: value.material,
            replacement_cycle_days: value.replacement_cycle_days,
          },
        },
        buildImageFormData(images),
      );
    },
  });

  const steps: WizardStepConfig[] = PERSONAL_REGISTRATION_STEPS.map((step) => ({
    ...step,
    content: renderStepContent(step.id, form),
  }));

  return (
    <WizardProvider steps={steps} form={form}>
      <div className="flex w-full max-w-xl flex-col gap-6">
        <PersonalItemRegistrationContent />
        <PersonalItemRegistrationControl />
        <WizardDevTool />
      </div>
    </WizardProvider>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react';

import type { ReactFormExtendedApi } from '@tanstack/react-form';
import type { z } from 'zod';

/**
 * Generic form type for the wizard system. Collapses the 11 validator type
 * params of ReactFormExtendedApi while preserving the form data type.
 *
 * - `WizardForm<PersonalFormValues>` -- typed form data
 * - `WizardForm` -- unparameterized, accepts any form (for shared components)
 */

export type WizardForm<TFormData = any> = ReactFormExtendedApi<
  TFormData,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;

export interface WizardStepConfig {
  id: string;
  label: string;

  schema: z.ZodObject<any>;
  content: ReactNode;
}

export interface WizardContextValue<TFormData> {
  steps: WizardStepConfig[];
  form: WizardForm<TFormData>;
  currentStepIndex: number;
  currentStep: WizardStepConfig;
  isFirstStep: boolean;
  isLastStep: boolean;
  isCurrentStepValid: boolean;
  isSubmitting: boolean;
  visitedSteps: Set<number>;
  next: () => Promise<boolean>;
  back: () => void;
  goToStep: (index: number) => void;
}

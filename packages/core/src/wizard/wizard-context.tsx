'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { useStore } from '@tanstack/react-form';

import type {
  WizardContextValue,
  WizardForm,
  WizardStepConfig,
} from './wizard-types';

const WizardContext = createContext<WizardContextValue<any> | null>(null);

interface WizardProviderProps<TFormData> {
  steps: WizardStepConfig[];
  form: WizardForm<TFormData>;
  children: React.ReactNode;
}

function getStepFields(step: WizardStepConfig): string[] {
  return Object.keys(step.schema.shape);
}

/**
 * Manages wizard step state, per-step validation, and navigation.
 *
 * Validation relies entirely on TanStack Form's native Standard Schema
 * integration. The form must be created with `validators: { onChange: schema }`
 * so errors are always present on invalid fields. This context only controls
 * *visibility* of those errors by marking fields as touched on "Next".
 */
export function WizardProvider<TFormData>({
  steps,
  form,
  children,
}: WizardProviderProps<TFormData>) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(
    () => new Set([0]),
  );

  const store = useStore(form.store);
  const { isSubmitting, values: formValues } = store;

  const isCurrentStepValid = useMemo(() => {
    const stepConfig = steps[currentStepIndex];
    if (!stepConfig) return false;
    return stepConfig.schema.safeParse(formValues).success;
  }, [steps, currentStepIndex, formValues]);

  const next = useCallback(async (): Promise<boolean> => {
    const stepConfig = steps[currentStepIndex];
    if (!stepConfig) return false;

    const stepFields = getStepFields(stepConfig);

    for (const field of stepFields) {
      form.setFieldMeta(field, (prev) => ({ ...prev, isTouched: true }));
    }

    const isValid = stepConfig.schema.safeParse(formValues).success;
    if (!isValid) return false;

    const isLast = currentStepIndex === steps.length - 1;

    if (isLast) {
      await form.handleSubmit();
      return true;
    }

    const nextIndex = currentStepIndex + 1;
    setCurrentStepIndex(nextIndex);
    setVisitedSteps((prev) => new Set([...prev, nextIndex]));
    return true;
  }, [steps, currentStepIndex, form, formValues]);

  const back = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToStep = useCallback(
    (index: number) => {
      if (index >= 0 && index < steps.length && visitedSteps.has(index)) {
        setCurrentStepIndex(index);
      }
    },
    [steps.length, visitedSteps],
  );

  const value = useMemo<WizardContextValue<TFormData>>(
    () => ({
      steps,
      form,
      currentStepIndex,
      currentStep: steps[currentStepIndex]!,
      isFirstStep: currentStepIndex === 0,
      isLastStep: currentStepIndex === steps.length - 1,
      isCurrentStepValid,
      isSubmitting,
      visitedSteps,
      next,
      back,
      goToStep,
    }),
    [
      steps,
      currentStepIndex,
      isCurrentStepValid,
      isSubmitting,
      visitedSteps,
      next,
      back,
      goToStep,
    ],
  );

  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
}

export function useWizard<TFormData>(): WizardContextValue<TFormData> {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}

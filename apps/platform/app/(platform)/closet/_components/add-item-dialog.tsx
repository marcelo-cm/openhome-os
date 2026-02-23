'use client';

import React, { useState } from 'react';

import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogPopup,
  DialogTitle,
} from '@openhome-os/ui/dialog';

import {
  RemoteTriggerProps,
  useRemoteTrigger,
} from '@/hooks/use-remote-trigger';

import { AIAnalysisStep } from './ai-analysis-step';
import { PhotoUploadStep } from './photo-upload-step';
import { ReviewFormStep } from './review-form-step';

type UploadStep = 'upload' | 'analyzing' | 'review';

interface ItemFormData {
  photos: File[];
  aiAnalysis?: {
    brand?: string;
    category?: string;
    baseColor?: string;
    hasGraphic?: boolean;
    description?: string;
    tags?: string[];
    confidenceScores?: Record<string, number>;
  };
  name?: string;
  locationId?: string;
  brand?: string;
  size?: string;
  condition?: string;
  notes?: string;
}

export function AddItemDialog({
  open,
  onOpenChange,
  children,
}: RemoteTriggerProps) {
  const [isOpen, handleOpenChange] = useRemoteTrigger({ open, onOpenChange });
  const [currentStep, setCurrentStep] = useState<UploadStep>('upload');
  const [itemData, setItemData] = useState<ItemFormData>({ photos: [] });

  const handlePhotosSelected = (files: File[]) => {
    setItemData({ ...itemData, photos: files });
    setCurrentStep('analyzing');
    // Simulate AI analysis
    setTimeout(() => {
      // Mock AI analysis results
      const mockAnalysis = {
        brand: 'Nike',
        category: 'T-Shirt',
        baseColor: 'Blue',
        hasGraphic: true,
        description: 'A blue Nike graphic t-shirt with a swoosh logo',
        tags: ['casual', 'athletic', 'cotton', 'short-sleeve'],
        confidenceScores: {
          brand: 0.92,
          category: 0.95,
          baseColor: 0.88,
          hasGraphic: 0.91,
        },
      };
      setItemData({ ...itemData, photos: files, aiAnalysis: mockAnalysis });
      setCurrentStep('review');
    }, 3000);
  };

  const handleSave = (data: ItemFormData) => {
    console.log('Saving item:', data);
    // TODO: Implement actual save logic with API call
    handleOpenChange(false);
    resetDialog();
  };

  const resetDialog = () => {
    setCurrentStep('upload');
    setItemData({ photos: [] });
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetDialog();
    }
    handleOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {children && children}
      <DialogPopup className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {currentStep === 'upload' && 'Add Item'}
            {currentStep === 'analyzing' && 'Analyzing Your Item...'}
            {currentStep === 'review' && 'Review & Complete'}
          </DialogTitle>
          <DialogDescription>
            {currentStep === 'upload' &&
              'Upload photo(s) of your item to get started'}
            {currentStep === 'analyzing' &&
              "AI is analyzing your item's details"}
            {currentStep === 'review' &&
              'Review the AI suggestions and complete the required fields'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {currentStep === 'upload' && (
            <PhotoUploadStep onPhotosSelected={handlePhotosSelected} />
          )}
          {currentStep === 'analyzing' && <AIAnalysisStep />}
          {currentStep === 'review' && (
            <ReviewFormStep
              itemData={itemData}
              onSave={handleSave}
              onCancel={() => handleClose(false)}
            />
          )}
        </div>
      </DialogPopup>
    </Dialog>
  );
}

'use client';

import React, { useState } from 'react';

import { SparklesIcon, XIcon } from 'lucide-react';

import { Badge } from '@openhome-os/ui/badge';
import { Button } from '@openhome-os/ui/button';
import { DialogFooter } from '@openhome-os/ui/dialog';
import { Field, FieldControl, FieldLabel } from '@openhome-os/ui/field';
import { Form } from '@openhome-os/ui/form';
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@openhome-os/ui/select';

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

interface ReviewFormStepProps {
  itemData: ItemFormData;
  onSave: (data: ItemFormData) => void;
  onCancel: () => void;
}

export function ReviewFormStep({
  itemData,
  onSave,
  onCancel,
}: ReviewFormStepProps) {
  const [tags, setTags] = useState<string[]>(itemData.aiAnalysis?.tags ?? []);
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: ItemFormData = {
      ...itemData,
      name: formData.get('name') as string,
      locationId: formData.get('location') as string,
      brand: formData.get('brand') as string,
      size: formData.get('size') as string,
      condition: formData.get('condition') as string,
      notes: formData.get('notes') as string,
    };
    onSave(data);
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const getConfidenceBadge = (field: string) => {
    const score = itemData.aiAnalysis?.confidenceScores?.[field];
    if (!score) return null;

    const percentage = Math.round(score * 100);
    return (
      <span
        className="text-muted-foreground inline-flex items-center gap-1 text-xs"
        title={`AI Confidence: ${percentage}%`}
      >
        <SparklesIcon className="size-3" />
        {percentage}%
      </span>
    );
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="max-h-[60vh] space-y-4 overflow-y-auto px-1">
        {/* Photo Preview */}
        <div className="grid grid-cols-4 gap-2">
          {itemData.photos.slice(0, 4).map((photo, index) => (
            <div
              key={index}
              className="aspect-square overflow-hidden rounded-lg border"
            >
              <img
                src={URL.createObjectURL(photo)}
                alt={`Item ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Required Fields */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-sm font-semibold">Required Information</h3>

          <Field>
            <FieldLabel className="flex items-center justify-between">
              Item Name
              {getConfidenceBadge('category')}
            </FieldLabel>
            <FieldControl
              name="name"
              type="text"
              placeholder="Blue Nike T-Shirt"
              defaultValue={
                itemData.aiAnalysis?.category
                  ? `${itemData.aiAnalysis.baseColor ?? ''} ${itemData.aiAnalysis.brand ?? ''} ${itemData.aiAnalysis.category}`
                  : ''
              }
              required
            />
          </Field>

          <Field>
            <FieldLabel>Current Location</FieldLabel>
            <Select name="location" required>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectPopup>
                <SelectItem value="sf-apartment">SF Apartment</SelectItem>
                <SelectItem value="toronto-house">Toronto House</SelectItem>
                <SelectItem value="storage-unit">Storage Unit</SelectItem>
              </SelectPopup>
            </Select>
          </Field>
        </div>

        {/* Optional Fields */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-sm font-semibold">
            Additional Details (Optional)
          </h3>

          <Field>
            <FieldLabel className="flex items-center justify-between">
              Brand
              {getConfidenceBadge('brand')}
            </FieldLabel>
            <FieldControl
              name="brand"
              type="text"
              placeholder="Nike"
              defaultValue={itemData.aiAnalysis?.brand}
            />
          </Field>

          <Field>
            <FieldLabel className="flex items-center justify-between">
              Base Color
              {getConfidenceBadge('baseColor')}
            </FieldLabel>
            <FieldControl
              name="color"
              type="text"
              placeholder="Blue"
              defaultValue={itemData.aiAnalysis?.baseColor}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Size</FieldLabel>
              <Select name="size">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  <SelectItem value="xs">XS</SelectItem>
                  <SelectItem value="s">S</SelectItem>
                  <SelectItem value="m">M</SelectItem>
                  <SelectItem value="l">L</SelectItem>
                  <SelectItem value="xl">XL</SelectItem>
                  <SelectItem value="xxl">XXL</SelectItem>
                </SelectPopup>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Condition</FieldLabel>
              <Select name="condition">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="like_new">Like New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="worn">Worn</SelectItem>
                </SelectPopup>
              </Select>
            </Field>
          </div>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <textarea
              name="description"
              placeholder="Add any additional notes..."
              defaultValue={itemData.aiAnalysis?.description}
              rows={3}
              className="border-input bg-background ring-ring/24 focus-visible:border-ring dark:bg-input/32 w-full resize-none rounded-lg border bg-clip-padding px-[calc(--spacing(3)-1px)] py-[calc(--spacing(1.5)-1px)] text-sm shadow-xs transition-shadow outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-disabled:not-focus-visible:not-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] focus-visible:ring-[3px] dark:not-in-data-[slot=group]:bg-clip-border dark:not-disabled:not-focus-visible:not-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/8%)]"
            />
          </Field>

          {/* Tags */}
          <div>
            <label className="mb-2 inline-flex items-baseline gap-2 text-sm/4 font-medium">
              Tags
              {itemData.aiAnalysis?.tags && (
                <span className="text-muted-foreground ml-2 text-xs">
                  (AI Suggested)
                </span>
              )}
            </label>
            <div className="mb-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:bg-destructive/20 rounded-full"
                  >
                    <XIcon className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(tagInput);
                  }
                }}
                placeholder="Add a tag..."
                className="border-input bg-background ring-ring/24 focus-visible:border-ring dark:bg-input/32 flex-1 rounded-lg border bg-clip-padding px-[calc(--spacing(3)-1px)] py-[calc(--spacing(1.5)-1px)] text-sm shadow-xs transition-shadow outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-focus-visible:not-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] focus-visible:ring-[3px] dark:not-in-data-[slot=group]:bg-clip-border dark:not-focus-visible:not-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/8%)]"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addTag(tagInput)}
                disabled={!tagInput.trim()}
              >
                Add
              </Button>
            </div>
          </div>

          <Field>
            <FieldLabel>Notes</FieldLabel>
            <textarea
              name="notes"
              placeholder="Any additional notes about this item..."
              rows={2}
              className="border-input bg-background ring-ring/24 focus-visible:border-ring dark:bg-input/32 w-full resize-none rounded-lg border bg-clip-padding px-[calc(--spacing(3)-1px)] py-[calc(--spacing(1.5)-1px)] text-sm shadow-xs transition-shadow outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] not-disabled:not-focus-visible:not-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] focus-visible:ring-[3px] dark:not-in-data-[slot=group]:bg-clip-border dark:not-disabled:not-focus-visible:not-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/8%)]"
            />
          </Field>
        </div>
      </div>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Item</Button>
      </DialogFooter>
    </Form>
  );
}

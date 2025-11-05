'use client';

import React from 'react';

import { Loader2Icon, SparklesIcon } from 'lucide-react';

export function AIAnalysisStep() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <div className="relative">
        <div className="bg-primary/10 rounded-full p-6">
          <SparklesIcon className="text-primary size-12" />
        </div>
        <div className="absolute -right-1 -bottom-1">
          <Loader2Icon className="text-primary size-6 animate-spin" />
        </div>
      </div>

      <div className="space-y-2 text-center">
        <h3 className="text-xl font-semibold">Analyzing Your Item</h3>
        <p className="text-muted-foreground max-w-md">
          Our AI is examining your photos to identify the brand, category,
          colors, and other attributes. This will only take a moment...
        </p>
      </div>

      <div className="w-full max-w-md space-y-3">
        <AnalysisProgressItem label="Identifying brand" delay={0} />
        <AnalysisProgressItem label="Detecting colors" delay={500} />
        <AnalysisProgressItem label="Analyzing patterns" delay={1000} />
        <AnalysisProgressItem label="Generating description" delay={1500} />
        <AnalysisProgressItem label="Suggesting tags" delay={2000} />
      </div>
    </div>
  );
}

function AnalysisProgressItem({
  label,
  delay,
}: {
  label: string;
  delay: number;
}) {
  const [isComplete, setIsComplete] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsComplete(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className="bg-background flex items-center gap-3 rounded-lg border p-3">
      <div
        className={`flex size-5 items-center justify-center rounded-full border-2 transition-colors ${
          isComplete ? 'border-primary bg-primary' : 'border-border'
        }`}
      >
        {isComplete && (
          <svg
            className="text-primary-foreground size-3"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M2 6L5 9L10 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span
        className={`text-sm ${isComplete ? 'text-foreground' : 'text-muted-foreground'}`}
      >
        {label}
      </span>
    </div>
  );
}

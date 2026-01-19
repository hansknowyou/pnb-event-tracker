'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STEPS, StepInfo } from '@/types/production';
import type { StepConfig } from '@/types/productionStepConfig';

interface StepProgressProps {
  currentStepKey: string;
  completedStepKeys: string[];
  onStepClick: (stepKey: string) => void;
  completionPercentage: number;
  stepConfig?: StepConfig[];
}

export default function StepProgress({
  currentStepKey,
  completedStepKeys,
  onStepClick,
  completionPercentage,
  stepConfig,
}: StepProgressProps) {
  // Use config order if available, otherwise fall back to default STEPS order
  const orderedSteps = stepConfig
    ? stepConfig
        .filter((s) => s.enabled)
        .sort((a, b) => a.order - b.order)
        .map((config, index) => {
          const defaultStep = STEPS.find(
            (s) => `step${s.number}` === config.stepKey
          );
          return {
            stepKey: config.stepKey,
            displayOrder: index + 1,
            name: defaultStep?.name || config.stepKey,
          };
        })
    : STEPS.map((s) => ({
        stepKey: `step${s.number}`,
        displayOrder: s.number,
        name: s.name,
      }));

  return (
    <div className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        {/* Overall Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Overall Progress</h2>
            <span className="text-lg font-bold text-blue-600">
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="overflow-x-auto">
          <div className="flex space-x-2 pb-2 min-w-max">
            {orderedSteps.map((step) => {
              const isCompleted = completedStepKeys.includes(step.stepKey);
              const isCurrent = currentStepKey === step.stepKey;

              return (
                <button
                  key={step.stepKey}
                  onClick={() => onStepClick(step.stepKey)}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-all',
                    isCurrent
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : isCompleted
                      ? 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100'
                      : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold',
                      isCurrent
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      step.displayOrder
                    )}
                  </div>
                  <span className="text-sm font-medium whitespace-nowrap">
                    {step.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

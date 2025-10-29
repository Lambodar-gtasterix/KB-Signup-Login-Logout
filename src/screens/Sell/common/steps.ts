import { StepConfig } from '../../../components/common/ProgressStepper';

const STEP_LABELS = ['Details', 'Photos', 'Confirm'] as const;

export type SellFlowStepIndex = 0 | 1 | 2;

export const buildSellFlowSteps = (activeIndex: SellFlowStepIndex): StepConfig[] =>
  STEP_LABELS.map((label, index) => {
    if (index < activeIndex) {
      return { label, status: 'completed' as const };
    }
    if (index === activeIndex) {
      return { label, status: 'current' as const };
    }
    return { label, status: 'upcoming' as const };
  });


// Configuration for a single production step
export interface StepConfig {
  stepKey: string; // e.g., 'step1', 'step2', etc.
  order: number;
  enabled: boolean;
  requiresVenue: boolean; // Whether this step can link to venues
}

// Full configuration document
export interface ProductionStepConfig {
  _id: string;
  steps: StepConfig[];
  createdAt: string;
  updatedAt: string;
}

// Default step definitions (schema in code)
export interface StepDefinition {
  stepKey: string;
  nameKey: string; // Translation key
  descriptionKey: string;
  defaultOrder: number;
  requiresVenue: boolean;
}

// Step definitions - the schema stays in code
export const STEP_DEFINITIONS: StepDefinition[] = [
  { stepKey: 'step1', nameKey: 'step1', descriptionKey: 'Contract', defaultOrder: 1, requiresVenue: false },
  { stepKey: 'step2', nameKey: 'step2', descriptionKey: 'Cities', defaultOrder: 2, requiresVenue: false },
  { stepKey: 'step3', nameKey: 'step3', descriptionKey: 'Venue Contracts', defaultOrder: 3, requiresVenue: true },
  { stepKey: 'step4', nameKey: 'step4', descriptionKey: 'Itinerary', defaultOrder: 4, requiresVenue: false },
  { stepKey: 'step5', nameKey: 'step5', descriptionKey: 'Materials', defaultOrder: 5, requiresVenue: false },
  { stepKey: 'step6', nameKey: 'step6', descriptionKey: 'Venue Info', defaultOrder: 6, requiresVenue: true },
  { stepKey: 'step7', nameKey: 'step7', descriptionKey: 'Designs', defaultOrder: 7, requiresVenue: false },
  { stepKey: 'step16', nameKey: 'step16', descriptionKey: 'Venue Media Design', defaultOrder: 7.5, requiresVenue: true },
  { stepKey: 'step8', nameKey: 'step8', descriptionKey: 'Promotional Images', defaultOrder: 8, requiresVenue: false },
  { stepKey: 'step9', nameKey: 'step9', descriptionKey: 'Videos', defaultOrder: 9, requiresVenue: false },
  { stepKey: 'step10', nameKey: 'step10', descriptionKey: 'Press Conference', defaultOrder: 10, requiresVenue: true },
  { stepKey: 'step11', nameKey: 'step11', descriptionKey: 'Performance Shooting', defaultOrder: 11, requiresVenue: true },
  { stepKey: 'step12', nameKey: 'step12', descriptionKey: 'Social Media', defaultOrder: 12, requiresVenue: false },
  { stepKey: 'step13', nameKey: 'step13', descriptionKey: 'Advertising', defaultOrder: 13, requiresVenue: false },
  { stepKey: 'step14', nameKey: 'step14', descriptionKey: 'Sponsorship Package Planning', defaultOrder: 14, requiresVenue: false },
  { stepKey: 'step15', nameKey: 'step15', descriptionKey: 'Community Alliance', defaultOrder: 15, requiresVenue: false },
];

// Steps that are disabled by default
const DISABLED_BY_DEFAULT = ['step14', 'step15'];

// Get default configuration based on step definitions
export function getDefaultStepConfig(): StepConfig[] {
  return STEP_DEFINITIONS.map((def) => ({
    stepKey: def.stepKey,
    order: def.defaultOrder,
    enabled: !DISABLED_BY_DEFAULT.includes(def.stepKey),
    requiresVenue: def.requiresVenue,
  }));
}

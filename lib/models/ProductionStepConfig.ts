import mongoose, { Schema, Document } from 'mongoose';
import { getDefaultStepConfig } from '@/types/productionStepConfig';

export interface IStepConfig {
  stepKey: string;
  order: number;
  enabled: boolean;
  requiresVenue: boolean;
}

export interface IProductionStepConfig extends Document {
  steps: IStepConfig[];
  createdAt: Date;
  updatedAt: Date;
}

const StepConfigSchema = new Schema<IStepConfig>({
  stepKey: { type: String, required: true },
  order: { type: Number, required: true },
  enabled: { type: Boolean, default: true },
  requiresVenue: { type: Boolean, default: false },
});

const ProductionStepConfigSchema = new Schema<IProductionStepConfig>(
  {
    steps: {
      type: [StepConfigSchema],
      default: getDefaultStepConfig,
    },
  },
  {
    timestamps: true,
  }
);

// We only have one configuration document (singleton pattern)
// Use a static method to get or create the single config
ProductionStepConfigSchema.statics.getConfig = async function () {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({ steps: getDefaultStepConfig() });
  }
  return config;
};

const ProductionStepConfig =
  mongoose.models.ProductionStepConfig ||
  mongoose.model<IProductionStepConfig>('ProductionStepConfig', ProductionStepConfigSchema);

export default ProductionStepConfig;

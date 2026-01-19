import mongoose, { Document, Model } from 'mongoose';

interface IGlobalKnowledgeLinks extends Document {
  links: Map<string, string[]>;
  createdAt: Date;
  updatedAt: Date;
}

interface IGlobalKnowledgeLinksModel extends Model<IGlobalKnowledgeLinks> {
  getInstance(): Promise<IGlobalKnowledgeLinks>;
}

// Global knowledge links that persist across all productions
const GlobalKnowledgeLinksSchema = new mongoose.Schema(
  {
    // Each key is a section (step1, step2, step5_videos, step7_backdrop, step8_16x9, etc.)
    // Value is an array of knowledge base item IDs
    links: {
      type: Map,
      of: [String],
      default: {},
    },
  },
  { timestamps: true }
);

// We only need one document, so we use a fixed ID
GlobalKnowledgeLinksSchema.statics.getInstance = async function () {
  let instance = await this.findOne();
  if (!instance) {
    instance = await this.create({ links: {} });
  }
  return instance;
};

export default (mongoose.models.GlobalKnowledgeLinks ||
  mongoose.model<IGlobalKnowledgeLinks, IGlobalKnowledgeLinksModel>('GlobalKnowledgeLinks', GlobalKnowledgeLinksSchema)) as IGlobalKnowledgeLinksModel;

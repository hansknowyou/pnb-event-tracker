import mongoose, { Schema, Document } from 'mongoose';

export interface IKnowledgeBaseItem extends Document {
  title: string;
  description: string; // Rich text HTML from TipTap
  imageUrl?: string; // S3 URL
  imageKey?: string; // S3 key for deletion
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean; // Soft delete
}

const KnowledgeBaseItemSchema = new Schema<IKnowledgeBaseItem>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      default: '',
      maxlength: 50000, // ~50KB of HTML
    },
    imageUrl: {
      type: String,
      default: '',
    },
    imageKey: {
      type: String,
      default: '',
    },
    createdBy: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
KnowledgeBaseItemSchema.index({ isDeleted: 1 });
KnowledgeBaseItemSchema.index({ createdBy: 1 });

const KnowledgeBaseItem =
  mongoose.models.KnowledgeBaseItem ||
  mongoose.model<IKnowledgeBaseItem>('KnowledgeBaseItem', KnowledgeBaseItemSchema);

export default KnowledgeBaseItem;

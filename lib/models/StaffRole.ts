import mongoose, { Schema, Document } from 'mongoose';

export interface IStaffRole extends Document {
  name: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const StaffRoleSchema = new Schema<IStaffRole>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500,
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

StaffRoleSchema.index({ isDeleted: 1 });
StaffRoleSchema.index({ name: 1 });

const StaffRole =
  mongoose.models.StaffRole ||
  mongoose.model<IStaffRole>('StaffRole', StaffRoleSchema);

export default StaffRole;

import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminLogo extends Document {
  title: string;
  googleFolderLink: string;
  colorLogoVertical: string;
  whiteLogoVertical: string;
  colorLogoHorizontal: string;
  whiteLogoHorizontal: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const AdminLogoSchema = new Schema<IAdminLogo>(
  {
    title: {
      type: String,
      default: '',
      trim: true,
      maxlength: 200,
    },
    googleFolderLink: {
      type: String,
      default: '',
      trim: true,
      maxlength: 500,
    },
    colorLogoVertical: {
      type: String,
      default: '',
    },
    whiteLogoVertical: {
      type: String,
      default: '',
    },
    colorLogoHorizontal: {
      type: String,
      default: '',
    },
    whiteLogoHorizontal: {
      type: String,
      default: '',
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

AdminLogoSchema.index({ isDeleted: 1 });
AdminLogoSchema.index({ googleFolderLink: 1 });

const existingAdminLogo = mongoose.models.AdminLogo;
if (existingAdminLogo) {
  const titlePath = existingAdminLogo.schema.path('title');
  const colorVerticalPath = existingAdminLogo.schema.path('colorLogoVertical');
  const whiteVerticalPath = existingAdminLogo.schema.path('whiteLogoVertical');
  const colorHorizontalPath = existingAdminLogo.schema.path('colorLogoHorizontal');
  const whiteHorizontalPath = existingAdminLogo.schema.path('whiteLogoHorizontal');
  if (!titlePath || !colorVerticalPath || !whiteVerticalPath || !colorHorizontalPath || !whiteHorizontalPath) {
    delete mongoose.models.AdminLogo;
  }
}

const AdminLogo =
  mongoose.models.AdminLogo ||
  mongoose.model<IAdminLogo>('AdminLogo', AdminLogoSchema);

export default AdminLogo;

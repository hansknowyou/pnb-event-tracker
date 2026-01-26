import mongoose, { Schema, Document } from 'mongoose';

export interface IQRCode extends Document {
  title: string;
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const QRCodeSchema = new Schema<IQRCode>(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, trim: true, maxlength: 2000, default: '' },
    image: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

QRCodeSchema.index({ isDeleted: 1 });
QRCodeSchema.index({ title: 1 });

const QRCode = mongoose.models.QRCode || mongoose.model<IQRCode>('QRCode', QRCodeSchema);

export default QRCode;

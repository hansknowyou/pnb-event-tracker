import mongoose, { Schema, Document } from 'mongoose';

export interface ICompanyStaff {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface ICompany extends Document {
  name: string;
  address: string;
  city: string;
  description: string;
  files: string;
  images: string;
  staff: ICompanyStaff[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const CompanyStaffSchema = new Schema<ICompanyStaff>({
  name: { type: String, default: '' },
  role: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
});

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true, maxlength: 200 },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    description: { type: String, default: '' },
    files: { type: String, default: '' },
    images: { type: String, default: '' },
    staff: { type: [CompanyStaffSchema], default: [] },
    createdBy: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Indexes
CompanySchema.index({ isDeleted: 1 });
CompanySchema.index({ name: 1 });
CompanySchema.index({ city: 1 });

const Company = mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);

export default Company;

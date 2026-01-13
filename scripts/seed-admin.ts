import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// This script creates the initial admin user
async function seedAdmin() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    const MONGODB_DB = process.env.MONGODB_DB || 'pnb-event-tracking';

    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in .env.local');
      console.error('Please add MONGODB_URI to your .env.local file');
      process.exit(1);
    }

    // Construct the full connection string with database name (same as lib/mongodb.ts)
    const uri = new URL(MONGODB_URI);
    uri.pathname = `/${MONGODB_DB}`;
    const connectionString = uri.toString();

    console.log('Connecting to MongoDB...');
    console.log(`Database: ${MONGODB_DB}`);
    await mongoose.connect(connectionString);
    console.log('Connected to MongoDB');

    // Define User schema inline
    const UserSchema = new mongoose.Schema({
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      displayName: { type: String, required: true },
      isAdmin: { type: Boolean, default: false },
      isActive: { type: Boolean, default: true },
      languagePreference: { type: String, enum: ['en', 'zh'], default: 'en' },
    }, { timestamps: true });

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      await mongoose.connection.close();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin', 10);

    // Create admin user
    await User.create({
      username: 'admin',
      password: hashedPassword,
      displayName: 'Administrator',
      isAdmin: true,
      isActive: true,
      languagePreference: 'en',
    });

    console.log('✓ Admin user created successfully!');
    console.log('  Username: admin');
    console.log('  Password: admin');
    console.log('  ⚠️  Please change the password after first login!');

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdmin();

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'pnb-event-tracking';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Construct the full connection string with database name
const getConnectionString = () => {
  const uri = new URL(MONGODB_URI);
  uri.pathname = `/${MONGODB_DB}`;
  return uri.toString();
};

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    const connectionString = getConnectionString();
    console.log(`Connecting to MongoDB database: ${MONGODB_DB}`);

    cached.promise = mongoose.connect(connectionString, opts).then(async (mongoose) => {
      console.log(`Successfully connected to MongoDB database: ${MONGODB_DB}`);

      // MongoDB automatically creates the database when you first write to it
      // This ensures the database is accessible and will be created on first write
      const db = mongoose.connection.db;
      if (db) {
        console.log(`Database "${db.databaseName}" is ready (will be created if it doesn't exist)`);
      }

      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

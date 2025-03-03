import mongoose, { ConnectOptions } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { conn: null, promise: null };

const clientOptions: ConnectOptions = {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
  dbName: 'connectify',
  bufferCommands: false,
};

// Connect to MongoDB
export const connectToDB = async () => {

  // Use cached connection if available
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) throw new Error("MongoDB URI is missing");

  // Save connection to cache memory
  cached.promise = cached.promise || mongoose.connect(MONGODB_URI, clientOptions);
  cached.conn = await cached.promise;

  // Check MongoDB still connected
  await mongoose.connection?.db?.admin().command({ ping: 1 });

  return cached.conn;
};
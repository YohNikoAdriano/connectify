import mongoose, { ConnectOptions } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("MongoDB URI is missing");

let cached = (global as any).mongoose || { conn: null, promise: null };

const clientOptions: ConnectOptions = {
  serverApi: {
    version: "1", // "1" is inferred as a literal type here
    strict: true,
    deprecationErrors: true,
  },
  dbName: 'connectify',
  bufferCommands: false,
};

export const connectToDB = async () => {
  if (cached.conn) return cached.conn;

  cached.promise = cached.promise || mongoose.connect(MONGODB_URI, clientOptions);
  cached.conn = await cached.promise;

  await mongoose.connection?.db?.admin().command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");

  return cached.conn;
};
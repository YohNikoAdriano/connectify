require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');

// Initialize cached connection in the global scope
let cached = (global as any).cached || { conn: null, promise: null };

const MONGODB_URI = "mongodb+srv://yohnikoadriano:iE6ABagbGDWWm1zr@cluster0.i5dsq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const connectToDB = async () => {
    if (cached.conn) return cached.conn; // Return cached connection if available
    if (!MONGODB_URI) throw new Error('MongoDB URI is missing');

    // Connect to MongoDB without deprecated options
    cached.promise = cached.promise || MongoClient.connect(MONGODB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    })
    .then((client:any) => {
        cached.conn = client.db('connectify'); // Select your database
        return cached.conn;
    });

    await cached.promise;
    return cached.conn;
};
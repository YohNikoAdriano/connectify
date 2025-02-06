require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');

// Store the cached connection
let cached = (global as any).mongo || { conn: null, promise: null };

const MONGODB_URI = "mongodb+srv://yohnikoadriano:iE6ABagbGDWWm1zr@cluster0.i5dsq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const connectToDB = async () => {
    if (cached.conn) return cached.conn; // Return the cached connection if it exists

    if (!MONGODB_URI) throw new Error('MongoDB URI is missing');

    // If no cached connection, start a new one
    cached.promise = cached.promise || MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    })
    .then((client: { db: (arg0: string) => any; }) => {
        cached.conn = client.db('connectify'); // Select the 'connectify' database
        return cached.conn;
    });

    // Wait for the connection to resolve
    await cached.promise;
    return cached.conn;
};
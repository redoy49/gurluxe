import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

// Stop app if Mongo URI is missing
if (!uri) {
  throw new Error("Mongo uri is missing in .env file");
}

// Create a Mongo client
const client = new MongoClient(uri);

export async function dbConnect(collectionName) {
  try {
    await client.connect();

    return client.db(process.env.DB_NAME);
  } catch (error) {
    console.error("Database connection failed", error);

    throw new Error("Failed to connect database");
  }
}

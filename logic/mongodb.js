// mongodb.js

import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_URI
const dbName = process.env.MONGO_DB
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}

let client

export async function connectToDatabase() {
    if (client) return client
    
    client = await MongoClient.connect(uri, options)
    client = client.db(dbName);
    return client
}

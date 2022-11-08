import {connectToDatabase} from "./mongodb";

export async function getClockFromLink(link) {
    const db = await connectToDatabase();
    const collection = db.collection('links');
    const data = await collection.findOne({slug: link});
    return { props: { data } };
}

export async function updateClockFromLink(link, data) {
    // create or update link
    const db = await connectToDatabase();
    const collection = db.collection('links');
    await collection.updateOne({slug: link}, {$set: {data}}, {upsert: true});
}

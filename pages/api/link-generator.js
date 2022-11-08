// generate a random slug that is not already in use

import {connectToDatabase} from "../../logic/mongodb";
import {randomString} from "../../logic/helpers";

export async function generateSlug() {
    const lengthRandom = 15;

    const db = await connectToDatabase();
    const collection = db.collection('links');
    let slug = randomString(lengthRandom);
    while (await collection.findOne({slug})) {
        slug = randomString(lengthRandom);
    }
    return slug;
}

export default async function handler(req, res) {
    const slug = await generateSlug();
    res.status(200).json({slug});
}

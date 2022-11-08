import {connectToDatabase} from "./mongodb";

export async function addLinkToUser(user, link) {
    const db = await connectToDatabase();
    const collection = db.collection("users");

    // check if link is already in user
    const userDoc = await collection.findOne({user: user.sub});
    if (userDoc && userDoc.links && userDoc.links.includes(link)) return;

    const result = await collection.updateOne(
        { user: user.sub },
        { $push: { links: link } },
        { upsert: true }
    );
    return result;
}

export async function removeLinkFromUser(user, link) {
    const db = await connectToDatabase();
    const collection = db.collection("users");
    const result = await collection.updateOne(
        { user: user.sub },
        { $pull: { links: link } },
        { upsert: true }
    );
    return result;
}

export async function getUserStorage(user) {
    const db = await connectToDatabase();
    const collection = db.collection("users");
    const result = await collection.findOne({ user: user.sub });
    return result;
}

import {updateClockFromLink} from "../../logic/linkLogic";
import {getSession} from "@auth0/nextjs-auth0";
import {addLinkToUser} from "../../logic/userlogic";

export default async function handler(req, res) {
    // only accept POST requests
    if (req.method !== 'POST') {
        res.status(405).json({message: 'Method Not Allowed'});
        return;
    }

    const session = getSession(req, res);
    let user = null;
    if (session) {
        user = session.user;
    }

    // get args from body
    const { link, data } = req.body;
    await updateClockFromLink(link, data);

    if(user) {
        await addLinkToUser(user, link);
    }

    res.status(200).json({message: 'Success'});
}

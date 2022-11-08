import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import {getUserStorage} from "../../logic/userlogic";

export default withApiAuthRequired(async function myApiRoute(req, res) {
    const { user } = getSession(req, res);

    const storage = await getUserStorage(user);
    res.status(200).json(storage);
});

export function getOpoId(text) {
    // get opo id from text
    // example: OGI04k Security Infrastructure, Sven Sanders, Publishing info: 3ELO-ICT alle groepen -> OGI04k
    // example: OGI04n AI, Katja Verbeeck, Publishing info: 3ELO-ICT groep 3 -> OGI04n
    // example: OGI03w Web Topics, Bart Delrue, Robbe Van hoorebeke, Publishing info: ELO-ICT, Co-working -> OGI03w

    const regex = /OGI\d{2}[a-z]/;
    const match = text.match(regex);
    if (match) {
        return match[0];
    }
    return null;
}


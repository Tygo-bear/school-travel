// input example string
// - OGI04k
// - OGI04n
// - OGI03w

export function seedRandom(seed) {
    // create a seeded random function from a string seed
    // https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
    let m_w = 123456789;
    let m_z = 987654321;
    let mask = 0xffffffff;

    for (let i = 0; i < seed.length; i++) {
        m_w = (123456789 + seed.charCodeAt(i)) & mask;
        m_z = (987654321 - seed.charCodeAt(i)) & mask;
    }

    return function () {
        m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
        m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
        let result = ((m_z << 16) + m_w) & mask;
        result /= 4294967296;
        return result + 0.5;
    }
}

export function getOpoColor(opoId) {
    const hash = seedRandom(opoId);
    return randomDarkColor(hash);
}

export function randomDarkColor(hash) {
    const hue = hash() * 180 + 60;
    const saturation = hash() * 25 + 30;
    const lightness = hash() * 25 + 25;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function randomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}





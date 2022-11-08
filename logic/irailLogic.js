const baseUrl = "https://api.irail.be"


export async function getAllTrainStations() {
    const res = await fetch(`${baseUrl}/stations/?format=json`);
    return await res.json();
}

export async function getConnections(from, to, date, time, timeSel) {
    const res = await fetch(`${baseUrl}/connections/?from=${from}&to=${to}&date=${date}&time=${time}&timeSel=${timeSel}&format=json`);
    return await res.json();
}

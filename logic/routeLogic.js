/*
transit: [
{
    type: "train",
    name: "test",
    startStation: {
        "locationX": "3.987794",
        "locationY": "51.108062",
        "id": "BE.NMBS.008894201",
        "name": "Lokeren",
        "@id": "http://irail.be/stations/NMBS/008894201",
        "standardname": "Lokeren"
    },
    endStation: {
        "locationX": "3.740591",
        "locationY": "51.056365",
        "id": "BE.NMBS.008893120",
        "name": "Ghent-Dampoort",
        "@id": "http://irail.be/stations/NMBS/008893120",
        "standardname": "Gent-Dampoort"
    },
    order: 0
}
]

given a transit list and a ical event, return a new transit list with
- the startDate of the transit
- the endDate of the transit
- the duration of the transit
 */

import {getConnections} from "./irailLogic";
import {applyTimezone} from "./CalenderLogic";

export function formatDate(date) {
    // date ddmmyy add 0 if needed
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear().toString().substr(-2);
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    return day + month + year;
}

export function formatTime(date) {
    // time hhmm add 0 if needed
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if (hours < 10) {
        hours = "0" + hours;
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    return hours.toString() + minutes.toString();
}

export function dateFromEpoch(epoch) {
    return new Date(epoch * 1000);
}

export async function getTrainRoute(transit, arrivalTime) {
    const from = transit.startStation.standardname;
    const to = transit.endStation.standardname;
    const date = formatDate(arrivalTime);
    const time = formatTime(arrivalTime);

    const res = await getConnections(from, to, date, time, "arrival");
    return res.connection;
}

export function getBestTrain(connections, targetArrivalTime) {
    let bestTrain = null;
    for (const connection of connections) {
        const arrivalTime = dateFromEpoch(connection.arrival.time);
        if (arrivalTime < targetArrivalTime) {
            if (bestTrain === null || arrivalTime > bestTrain.arrivalTime) {
                bestTrain = {
                    arrivalTime: arrivalTime,
                    connection: connection
                };
            }
        }
    }
    return bestTrain.connection;
}

export async function calculateRoute(transitList, event) {
    if(!isValidTransitList(transitList)) return [];

    let targetTime = applyTimezone(event.startDate);
    const route = [];

    for (let i = transitList.length - 1; i >= 0; i--) {
        const transit = transitList[i];

        if(transit.type === "delay") {
            const minutes = transit.delay;
            const endTime = new Date(targetTime.getTime());
            targetTime.setMinutes(targetTime.getMinutes() - minutes);

            // copy the transit and add the start and end time
            const newTransit = {...transit};
            newTransit.startTime = new Date(targetTime.getTime());
            newTransit.endTime = endTime;
            newTransit.transitTime = minutes;
            route.push(newTransit);
        }
        else if(transit.type === "train") {
            const trainRoute = await getTrainRoute(transit, targetTime);
            if(!trainRoute) throw new Error("No train route found");

            const newTransit = {...transit};

            newTransit.requestData = trainRoute;
            const bestTrain = getBestTrain(trainRoute, targetTime);

            const startTime = dateFromEpoch(bestTrain.departure.time);
            const endTime = dateFromEpoch(bestTrain.arrival.time);
            const transitTime = bestTrain.duration / 60;

            newTransit.startTime = startTime;
            newTransit.endTime = endTime;
            newTransit.transitTime = transitTime;

            targetTime = new Date(startTime.getTime());

            route.push(newTransit);
        }
    }

    return route.reverse();
}

export function isValidTransitList(transitList) {
    for (const transit of transitList) {
        if (transit.type === "train") {
            if (!transit.startStation || !transit.endStation) {
                return false;
            }
        }
    }
    return true;
}

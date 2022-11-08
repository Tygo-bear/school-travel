// read calendar with ical.js
const ICAL = require('ical.js');

export function readCalendar(source) {
    const calendar = ICAL.parse(source);
    const jcal = new ICAL.Component(calendar);
    const vevents = jcal.getAllSubcomponents("vevent");
    const events = [];
    for (const vevent of vevents) {
        const event = new ICAL.Event(vevent);
        events.push(event);
    }
    return events;
}

export function applyTimezone(time) {
    let jsonDate = time.toJSDate();
    let date = new Date(jsonDate);
    return date;
}

export async function getEventsFromUrl(url) {
    const res = await fetch(url);
    const source = await res.text();
    return readCalendar(source);
}

export function getNextEvent(events) {
    const now = new Date();
    let nextEvent = null;
    for (const event of events) {
        const start = applyTimezone(event.startDate);
        if (start > now) {
            if (nextEvent === null || start < nextEvent.startDate) {
                nextEvent = event;
            }
        }
    }
    return nextEvent;
}

export function isSimpelEvent(event, simpelEvent) {
    return event.summary === simpelEvent.summary && event.startDate.dayOfWeek() === simpelEvent.dayOfWeek;
}

export function filterEvents(events, inactiveEvents) {
    // inactiveEvents is a list of events that should be filtered out
    // and are simpel events
    if(!events) {
        return [];
    }
    return events.filter(event => {
        return !inactiveEvents.some(inactiveEvent => isSimpelEvent(event, inactiveEvent));
    });
}

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditIcon from '@mui/icons-material/Edit';
import {useEffect, useState} from "react";
import CachedIcon from '@mui/icons-material/Cached';
import CheckIcon from '@mui/icons-material/Check';
import {filterEvents, getEventsFromUrl, getNextEvent} from "../logic/CalenderLogic";
import {Modal} from "./Modal";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RouteIcon from '@mui/icons-material/Route';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrainIcon from '@mui/icons-material/Train';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import DeleteIcon from '@mui/icons-material/Delete';
import {TrainStationMap} from "./TrainStationMap";
import {StationSearch} from "./StationSearch";
import {CalenderEvent} from "./CalenderEvent";
import {ClockBlock} from "./ClockBlock";
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';

export default function RouteBuilder(props) {
    const [data, setData] = useState(props.data);
    const [eventsReady, setEventsReady] = useState(false);
    const [allEvents, setAllEvents] = useState(null);
    const [nextEvent, setNextEvent] = useState(null);
    const [showLoadModal, setShowLoadModal] = useState(false);

    function getNew() {
        return {source: "", transit: [], inactiveEvents: []};
    }

    useEffect(() => {
        if (typeof window !== "undefined" && !data && !showLoadModal) {
            if (localStorage.getItem("routeBuilderData") || localStorage.getItem("clock"))
                setShowLoadModal(true);
            else
                setData(getNew());

        }
    }, []);

    function hasKeyInStorage(key) {
        if (typeof window !== "undefined")
            return localStorage.getItem(key);
        return false;
    }

    function loadFromLocalStorageBuilder() {
        if (localStorage.getItem("routeBuilderData"))
            setData(JSON.parse(localStorage.getItem("routeBuilderData")));
        else
            setData(getNew());
        setShowLoadModal(false);
    }

    function loadFromLocalStorageClock() {
        if (localStorage.getItem("clock"))
            setData(JSON.parse(localStorage.getItem("clock")));
        else
            setData(getNew());
    }

    function loadNew() {
        setData(getNew());
        setShowLoadModal(false);
    }

    function updateInactiveEvents(events) {
        // strip data
        let inactiveEvents = events.map(e => {
            return {
                summary: e.summary,
                dayOfWeek: e.startDate.dayOfWeek(),
            }
        });
        setData({...data, inactiveEvents: inactiveEvents});
    }

    function eventsLoaded(events) {
        setEventsReady(true);
        setAllEvents(events);
    }

    function updateTransit(transit) {
        setData({...data, transit: transit});
    }


    useEffect(() => {
        if (!data || !allEvents || !data.inactiveEvents) return;

        setNextEvent(getNextEvent(filterEvents(allEvents, data.inactiveEvents)));
        localStorage.setItem("routeBuilderData", JSON.stringify(data));
    }, [data, allEvents]);

    if (!data) {
        return (
            <Modal show={showLoadModal} title={"Load Data"} icon={<CachedIcon/>}>
                <div className={"flex justify-center"}>
                    <div className={"flex flex-col justify-center m-1 my-10 flex-wrap px-3 py-2 w-80"}>
                        {
                            hasKeyInStorage("routeBuilderData") ?
                                <button
                                    className={"flex flex-row items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-1 mb-3"}
                                    onClick={loadFromLocalStorageBuilder}>
                                    <UploadIcon className={"mr-1"}/>Continue from last session
                                </button>
                                :
                                <></>
                        }
                        {
                            hasKeyInStorage("clock") ?
                                <button
                                    className={"flex flex-row items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-1 mb-3"}
                                    onClick={loadFromLocalStorageClock}>
                                    <AccessTimeIcon className={"mr-1"}/>Load from clock
                                </button>
                                :
                                <></>
                        }
                        <button
                            className={"flex flex-row items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-1 mb-3"}
                            onClick={loadNew}>
                            <AddIcon className={"mr-1"}/>Create new
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }

    return (
        <>
            <h2 className={"text-2xl font-bold text-white mb-3"}>Route Builder</h2>
            <CalanderSourceBlock source={data.source} inactive={data.inactiveEvents}
                                 updateSource={e => setData({...data, source: e})}
                                 updateInactive={updateInactiveEvents} eventsLoaded={eventsLoaded}/>
            {
                eventsReady ?
                    <>
                        <TransitBlock transit={data.transit} show={true} updateTransit={updateTransit}/>
                        <ClockBlock nextEvent={nextEvent} transit={data.transit}/>
                        <SaveBlock source={data}/>
                    </>
                    :
                    <></>
            }
            <div className={"mb-10"}></div>
        </>
    )
}

function CalanderSourceBlock(props) {
    const [showEditCalanderSource, setShowEditCalanderSource] = useState(false);
    const [calenderSource, setCalanderSource] = useState(props.source);
    const [events, setEvents] = useState(null);
    const [inactiveEvents, setInactiveEvents] = useState(props.inactive);
    const [error, setError] = useState(null);


    function filterUniqueEvens(events) {
        return events.filter((event, index, self) =>
                index === self.findIndex((t) => (
                    t.summary === event.summary && t.startDate.dayOfWeek() === event.startDate.dayOfWeek()
                ))
        )
    }

    async function updateCalanderSource() {
        let events = []
        setError(null);
        if (calenderSource === "") return;

        try {
            events = await getEventsFromUrl(calenderSource);
        } catch (e) {
            setError(e)
            return;
        }

        props.eventsLoaded(events);
        props.updateSource(calenderSource);
        events = filterUniqueEvens(events);

        // check events that match the inactive events on summary and day of week
        let inactiveEvents = [];
        if (props.inactive) {
            inactiveEvents = events.filter((event) => {
                return props.inactive.filter((inactive) => {
                    return inactive.summary === event.summary && inactive.dayOfWeek === event.startDate.dayOfWeek()
                }).length > 0
            });
        }
        setInactiveEvents(inactiveEvents);
        setEvents(events);
    }

    function disableAllEvents() {
        setInactiveEvents(events);
        props.updateInactive(events);
    }

    function enableAllEvents() {
        setInactiveEvents([]);
        props.updateInactive([]);
    }

    function toggleEvent(event) {
        if (inactiveEvents.filter((inactive) => {
            return inactive.summary === event.summary && inactive.startDate.dayOfWeek() === event.startDate.dayOfWeek()
        }).length > 0) {
            const newInactiveEvents = inactiveEvents.filter((inactive) => {
                return inactive.summary !== event.summary || inactive.startDate.dayOfWeek() !== event.startDate.dayOfWeek()
            })
            setInactiveEvents(newInactiveEvents);
            props.updateInactive(newInactiveEvents);
        } else {
            setInactiveEvents([...inactiveEvents, event]);
            props.updateInactive([...inactiveEvents, event]);
        }
    }

    // on first render update the calender source
    useEffect(() => {
        if (events === null) {
            updateCalanderSource();
        }
    }, [events, calenderSource]);

    return (
        <>
            <div className={"bg-background-dark shadow-lg rounded px-1 pb-1 text-gray-100"}>
                <div className={"flex justify-between p-2"}>
                    <h2 className={"flex items-center"}><CalendarMonthIcon className={"mr-1"}/>
                        {calenderSource.length > 0 ? calenderSource.length > 70 ? calenderSource.substring(0, 70) + "..." : calenderSource :
                            <span className={"text-red-500 flex items-center"}>No calender source <ErrorOutlineIcon
                                className={"ml-2"}/></span>}
                    </h2>
                    <button className={"bg-gradient-to-r from-gradient1 to-gradient3 text-white px-2 py-1 rounded"}
                            onClick={() => setShowEditCalanderSource(true)}>
                        <EditIcon/>
                    </button>
                </div>
                {
                    calenderSource.length === 0 ?
                        <div className={"bg-background rounded mt-1 p-2"}>
                            <EditCalanderSource source={calenderSource} setSource={setCalanderSource}/>
                        </div>
                        :
                        <></>
                }
                {
                    error ?
                        <div className={"bg-background rounded mt-1 p-2"}>
                            <p className={"text-red-500"}>Error loading calender</p>
                        </div>
                        :
                        <></>
                }
                {
                    events !== null ?
                        <div>
                            <div className={"bg-background rounded mt-1 p-2"}>
                                <CalenderWeekDisplay events={events} inactive={inactiveEvents}
                                                     toggleEvent={toggleEvent}/>
                            </div>
                            <div className={"flex flex-row justify-end items-center mt-1 p-1"}>
                                <p className={"text-gray-400 mr-2"}>{events.length - inactiveEvents.length} / {events.length} events
                                    selected</p>
                                <button className={"p-1 m-1 px-2 rounded bg-background"}
                                        onClick={_ => disableAllEvents()}>
                                    Disable all
                                </button>
                                <button className={"p-1 m-1 px-2 rounded bg-background"}
                                        onClick={_ => enableAllEvents()}>
                                    Enable all
                                </button>
                            </div>
                        </div>
                        :
                        <></>
                }
            </div>
            <EditCalanderSourceModal show={showEditCalanderSource} close={() => setShowEditCalanderSource(false)}
                                     setSource={async e => {
                                         setCalanderSource(e);
                                         await updateCalanderSource();
                                     }} source={calenderSource}/>
        </>
    );
}

function EditCalanderSource(props) {
    // props:
    // - source: string
    // - setSource: function

    // input: source
    // url with .ics extension
    // example: https://cloud.timeedit.net/be_kuleuven/web/student/ri6Yn90Yy05Z0Q3DA9FAC66FA7Z0391.ics
    // example: https://cloud.timeedit.net/be_kuleuven/web/student/ri6Yn90Yy09Z6ZQ6g08Y60435637.ics

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [urlSource, setUrlSource] = useState(props.source);
    const [events, setEvents] = useState(null);

    async function handleSubmit(input) {
        setUrlSource(input);
        setIsSubmitting(true);
        setError("");
        setEvents(null);

        if (input.length === 0) {
            setIsSubmitting(false);
            return;
        }

        // check if valid url
        // check if matches regex
        const regex = /https:\/\/cloud.timeedit.net\/be_kuleuven\/web\/student\/[a-zA-Z0-9]{10,}.ics/;
        if (!regex.test(input)) {
            setError("Invalid url \n" + input);
            setIsSubmitting(false);
            return;
        }

        // check if url is valid
        try {
            const res = await fetch(input);
            if (res.status !== 200) {
                setError("Url did not return 200 OK");
                setIsSubmitting(false);
                return;
            }
        } catch (e) {
            setError("Url did not return 200 OK");
            setIsSubmitting(false);
            return;
        }

        try {
            const appointments = await getEventsFromUrl(input);
            setEvents(appointments);
        } catch (e) {
            setError("Could not parse ics file");
            setIsSubmitting(false);
            return;
        }


        setIsSubmitting(false);
    }

    return (
        <div className={"flex flex-col"}>
            <div className={"text-sm mb-2"}>
                Calander source:
            </div>
            <div className={"flex flex-row items-center"}>
                <input type={"text"} className={"bg-background-light text-gray-100 rounded p-2 flex-grow m-0"}
                       value={urlSource}
                       placeholder={"https://cloud.timeedit.net/be_kuleuven/web/student/9FAC66..............6QZ690df.ics"}
                       onKeyPress={async (e) => {
                           if (e.key === "Enter") {
                               await handleSubmit(e);
                           }
                       }}
                       onChange={async (e) => {
                           setUrlSource(e.target.value);
                           await handleSubmit(e.target.value);
                       }}
                />
                <button
                    className={"bg-gradient-to-br from-gradient1 to-gradient3 text-white px-2 py-1 rounded ml-2 h-full"}
                    onClick={async e => await handleSubmit(urlSource)} disabled={isSubmitting}>
                    {isSubmitting ? <CachedIcon className={"animate-spin"}/> : <CheckIcon/>}
                </button>
            </div>
            <div className={"text-red-500 text-sm mt-2"}>
                {error}
            </div>
            {
                events !== null ?
                    <>
                        {
                            events.length < 10 ?
                                <p className={"text-yellow-300"}><PriorityHighIcon className={"mr-1"}/>Hmm, make sure
                                    you selected the whole year, {events.length} events is not much</p>
                                :
                                <></>
                        }
                        <p className={"flex items-center font-bold text-green-400"}>
                            <CheckIcon className={"mr-1"}/><span>Found {events.length} events</span>
                        </p>
                        <button
                            className={"ml-2 bg-gradient-to-br from-gradient1 to-gradient3 text-white px-2 py-1 rounded mt-5 h-full"}
                            onClick={() => {
                                props.setSource(urlSource);
                            }}>
                            Save
                        </button>
                    </>
                    : <></>
            }
            <div>
                <p className={"text-sm mt-2"}>How to get the url:</p>
                <ol className={"list-decimal list-inside text-sm"}>
                    <li className={"my-1"}>Go to <a href={"https://cloud.timeedit.net/be_kuleuven/web/student/"}
                                                    target={"_blank"} className={"rounded px-2 py-1 bg-background-dark"}
                                                    rel="noreferrer">https://cloud.timeedit.net/be_kuleuven/web</a></li>
                    <li className={"my-1"}>Login as student</li>
                    <li className={"my-1"}>Select personal raster</li>
                    <li className={"my-1"}>Select subscribe</li>
                    <li className={"my-1"}>Select the whole year for the best experience</li>
                    <li className={"my-1"}>Copy the url (ends with .ics)</li>
                </ol>
                <p className={"text-xs text-gray-400 mt-1"}>
                    {
                        events ?
                            <span>You did it on your own, good job! 👍</span>
                            :
                            error ?
                                <span>No, its not that url 😞</span>
                                :
                                <span>Site disabled embedding, so I can not do it for you 😢</span>
                    }
                </p>
            </div>
        </div>
    );
}

function EditCalanderSourceModal(props) {
    // props:
    // - show: boolean
    // - close: function
    // - source: string
    // - setSource: function


    async function handleSubmit(e) {
        props.close();
        props.setSource(e)
    }

    return (
        <Modal show={props.show} close={props.close} title={"Edit Calander Source"} icon={<CalendarMonthIcon/>}>
            <EditCalanderSource source={props.source} setSource={e => handleSubmit(e)}/>
        </Modal>
    );
}

function CalenderWeekDisplay(props) {
    // props:
    // - events: array of events

    // show events in a column for each day of the week
    function isActive(event) {
        return !props.inactive.includes(event);
    }

    return (
        <div className={"flex flex-col"}>
            <div className={"flex flex-row"}>
                <div className={"flex flex-col w-1/5 m-1"}>
                    <div className={"text-sm text-gray-400 font-bold mb-2"}>Monday</div>
                    {
                        props.events.map((e, i) => {
                            if (e.startDate.dayOfWeek() === 2) {
                                return (
                                    <div key={i} onClick={_ => props.toggleEvent(e)}><CalenderEvent event={e} key={i}
                                                                                                    active={isActive(e)}/>
                                    </div>)
                            }
                        })
                    }
                </div>
                <div className={"flex flex-col w-1/5 m-1"}>
                    <div className={"text-sm text-gray-400 font-bold mb-2"}>Tuesday</div>
                    {
                        props.events.map((e, i) => {
                            if (e.startDate.dayOfWeek() === 3) {
                                return (
                                    <div key={i} onClick={_ => props.toggleEvent(e)}><CalenderEvent event={e} key={i}
                                                                                                    active={isActive(e)}/>
                                    </div>)
                            }
                        })
                    }
                </div>
                <div className={"flex flex-col w-1/5 m-1"}>
                    <div className={"text-sm text-gray-400 font-bold mb-2"}>Wednesday</div>
                    {
                        props.events.map((e, i) => {
                            if (e.startDate.dayOfWeek() === 4) {
                                return (
                                    <div key={i} onClick={_ => props.toggleEvent(e)}><CalenderEvent event={e} key={i}
                                                                                                    active={isActive(e)}/>
                                    </div>)
                            }
                        })
                    }
                </div>
                <div className={"flex flex-col w-1/5 m-1"}>
                    <div className={"text-sm text-gray-400 font-bold mb-2"}>Thursday</div>
                    {
                        props.events.map((e, i) => {
                            if (e.startDate.dayOfWeek() === 5) {
                                return (
                                    <div key={i} onClick={_ => props.toggleEvent(e)}><CalenderEvent event={e} key={i}
                                                                                                    active={isActive(e)}/>
                                    </div>)
                            }
                        })
                    }
                </div>
                <div className={"flex flex-col w-1/5 m-1"}>
                    <div className={"text-sm text-gray-400 font-bold mb-2"}>Friday</div>
                    {
                        props.events.map((e, i) => {
                            if (e.startDate.dayOfWeek() === 6) {
                                return (
                                    <div key={i} onClick={_ => props.toggleEvent(e)}><CalenderEvent event={e} key={i}
                                                                                                    active={isActive(e)}/>
                                    </div>)
                            }
                        })
                    }
                </div>
            </div>
        </div>
    );
}

function TransitBlock(props) {
    const [transit, setTrans] = useState(props.transit);

    if (!props.show)
        return <></>

    function updateOrder(transitList) {
        return transitList.sort((a, b) => {
            return a.order - b.order;
        }).map((t, i) => {
            t.order = i;
            return t;
        });
    }

    function removeTransit(item) {
        let newTransit = transit.filter(t => t !== item)
        newTransit = updateOrder(newTransit);
        setTrans(newTransit);
        props.updateTransit(newTransit);
    }

    function addTransitDelay() {
        const newTransit = {
            type: "delay",
            name: "",
            delay: 0,
            order: transit.length
        }
        setTrans([...transit, newTransit]);
        props.updateTransit([...transit, newTransit]);
    }

    function addTransitTrain() {
        const newTransit = {
            type: "train",
            name: "",
            startStation: "",
            endStation: "",
            order: transit.length
        }
        setTrans([...transit, newTransit]);
        props.updateTransit([...transit, newTransit]);
    }

    function handleTransitChange(item, key, value) {
        let newTransit = transit.map(t => {
            if (t === item) {
                t[key] = value;
            }
            return t;
        });
        setTrans(newTransit);
        props.updateTransit(newTransit);
    }

    return (
        <>
            <div className={"bg-background-dark shadow-lg rounded px-1 pb-1 mt-5 text-gray-100"}>
                <div className={"flex justify-between p-2"}>
                    <h2 className={"flex items-center"}><RouteIcon className={"mr-1"}/>
                        Transit route
                    </h2>
                </div>
                <div className={"bg-background rounded mt-1 p-2"}>
                    {
                        transit.sort((a, b) => a.order - b.order).map((t, i) => {
                            if (t.type === "delay") {
                                return <DelayBlock delay={t} key={i} removeTransit={removeTransit}
                                                   updateTransit={handleTransitChange}/>
                            }
                            if (t.type === "train") {
                                return <TrainBlock train={t} key={i} removeTransit={removeTransit}
                                                   updateTransit={handleTransitChange}/>
                            }
                        })
                    }
                    <div
                        className={"flex flex-row justify-center border-dashed border-2 rounded border-background-light p-2"}>
                        <button
                            className={"bg-gradient-to-br from-green-500 to-green-600 text-white rounded p-1 m-1 px-2 mx-2 hover:shadow-green-900 shadow-lg shadow-inner"}
                            onClick={addTransitDelay}>
                            <AccessTimeIcon className={"mr-1"}/>Add time
                        </button>
                        <button
                            className={"bg-gradient-to-br from-green-500 to-green-600 text-white rounded p-1 m-1 px-2 mx-2 hover:shadow-green-900 shadow-lg shadow-inner"}
                            onClick={addTransitTrain}>
                            <TrainIcon className={"mr-1"}/>Add train
                        </button>
                        <button
                            className={"bg-gradient-to-br from-green-500 to-green-600 text-white rounded p-1 m-1 px-2 mx-2 hover:shadow-green-900 shadow-lg shadow-inner"}>
                            <DirectionsBusIcon className={"mr-1"}/>Add bus
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function DelayBlock(props) {
    // props:
    // - delay: object

    const [delay, setDelay] = useState(props.delay);

    function changeDelay(e) {
        if (e.target.value < 0)
            return;

        setDelay({...delay, delay: e.target.value});
        props.delay.delay = e.target.value;
        props.updateTransit(delay, "delay", e.target.value);
    }

    function changeName(e) {
        setDelay({...delay, name: e.target.value});
        props.delay.name = e.target.value;
        props.updateTransit(delay, "name", e.target.value);
    }

    return (
        <div className={"flex flex-row justify-between items-center p-2 px-3 bg-background-dark rounded my-2"}>
            <div className={"flex flex-row items-center"}>
                <div className={"text-sm font-bold"}><AccessTimeIcon className={"mr-1"}/></div>
                <input type={"text"} className={"bg-background-dark text-white text-sm ml-2 rounded p-1"}
                       placeholder={"Delay name"}
                       value={delay.name} onChange={changeName}/>
            </div>
            <div className={"flex flex-row items-center"}>
                <input type={"number"} className={"bg-background-light rounded p-1 text-sm text-gray-400 text-right"}
                       value={delay.delay} onChange={changeDelay}/>
                <div className={"text-sm font-bold ml-0.5 mr-2"}>min</div>
                <button className={"text-xs text-gray-400 ml-2"} onClick={() => props.removeTransit(props.delay)}>
                    <DeleteIcon/>
                </button>
            </div>
        </div>
    );
}

function TrainBlock(props) {
    // props:
    // - train: object

    const [train, setTrain] = useState(props.train);
    const [stations, setStations] = useState([]);

    useEffect(() => {
        fetch("https://api.irail.be/stations/?format=json")
            .then(response => response.json())
            .then(data => {
                setStations(data.station);
            })
    }, []);

    function changeName(e) {
        setTrain({...train, name: e.target.value});
        props.train.name = e.target.value;
        props.updateTransit(train, "name", e.target.value);
    }

    function changeStartStation(e) {
        setTrain({...train, startStation: e});
        props.train.startStation = e;
        props.updateTransit(train, "startStation", e);
    }

    function changeEndStation(e) {
        setTrain({...train, endStation: e});
        props.train.endStation = e;
        props.updateTransit(train, "endStation", e);
    }

    return (
        <div className={"p-2 px-3 bg-background-dark rounded my-2"}>
            <div className={"flex flex-row justify-between items-center"}>
                <div className={"flex flex-row items-center"}>
                    <div className={"text-sm font-bold"}><TrainIcon className={"mr-1"}/></div>
                    <input type={"text"} className={"bg-background-dark text-white text-sm ml-2 rounded p-1"}
                           placeholder={"Train name"}
                           value={train.name} onChange={changeName}/>
                </div>
                <div className={"flex flex-row items-center"}>
                    <StationSearch stations={stations} value={train.startStation} onChange={changeStartStation}
                                   placeholder={"start station"}/>
                    <div className={"text-sm font-bold mx-2"}>-</div>
                    <StationSearch stations={stations} value={train.endStation} onChange={changeEndStation}
                                   placeholder={"end station"}/>
                    <button className={"text-xs text-gray-400 ml-2"} onClick={() => props.removeTransit(props.train)}>
                        <DeleteIcon/>
                    </button>
                </div>
            </div>
            <div className={"my-3"}>
                <TrainStationMap startStation={train.startStation} endStation={train.endStation}/>
            </div>
        </div>
    );
}

function SaveBlock(props) {
    const [storageType, setStorageType] = useState(props.source.slug ? "link" : null);
    const [savedCorrectly, setSavedCorrectly] = useState(false);
    const [url, setUrl] = useState(null);

    async function saveRoute(storageType) {
        setSavedCorrectly(false);
        if (storageType === "local") {
            localStorage.setItem("clock", JSON.stringify(props.source));
        } else if (storageType === "link") {
            let link = props.source.slug;
            if(!link) {
                link = await fetch("/api/link-generator");
                link = await link.json();
                link = link.slug;
            }
            if (link) {
                props.source.slug = link;
                // send post request to api
                let result = await fetch("/api/save-link",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            link: link,
                            data: props.source
                        })
                    });
                // if result is ok, setSavedCorrectly to true
                if (result.ok) {
                    setUrl(window.location.origin + "/clock/" + link);
                    setSavedCorrectly(true);
                } else {
                    console.log("error");
                }
            }
        } else {
            console.log("Error while generating link");
        }
    }

    // wait 200ms to show the user that the route was saved
    setTimeout(() => {
        setSavedCorrectly(true);
    }, 200);


    useEffect(() => {
        if (storageType) {
            saveRoute(storageType);
        }
    }, [props.source]);

    return (
        <div className={"flex flex-col justify-center items-center mt-5 text-white"}>
            <div className={"p-1 my-1 bg-green-600 rounded-full z-10"}>
                {
                    savedCorrectly ? <CheckIcon/> : <CachedIcon className={"text-white animate-spin"}/>
                }
            </div>
            {
                storageType ? <></> : <div className={"text-sm text-gray-400"}>Select storage type</div>
            }
            <div className={"flex flex-row justify-center items-center my-5"}>
                <button
                    className={"shadow-lg border-2 border-background-dark/20 text-white font-bold py-2 px-2 rounded ml-5 flex flex-row justify-center items-center"}
                    onClick={() => {
                        setStorageType("local")
                        saveRoute("local")
                    }}>
                    {
                        storageType === "local" ? <CheckCircleOutlineIcon className={"mr-1"}/> :
                            <RadioButtonUncheckedIcon className={"mr-1"}/>
                    }
                    Local
                </button>
                <button
                    className={"shadow-lg border-2 border-background-dark/20 text-white font-bold py-2 px-2 rounded ml-5 flex flex-row justify-center items-center"}
                    onClick={() => {
                        setStorageType("link")
                        saveRoute("link")
                    }}>
                    {
                        storageType === "link" ? <CheckCircleOutlineIcon className={"mr-1"}/> :
                            <RadioButtonUncheckedIcon className={"mr-1"}/>
                    }
                    Link
                </button>
            </div>
            {
                url ? <div className={"text-sm text-gray-400"}>Link: <a href={url} className={"text-white"}>{url}</a></div> : <></>
            }
        </div>
    )
}


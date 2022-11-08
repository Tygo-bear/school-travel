import {useEffect, useState} from "react";
import {calculateRoute} from "../logic/routeLogic";
import CachedIcon from "@mui/icons-material/Cached";
import {TransitRoute} from "./TransitRoute";
import {CalenderEvent} from "./CalenderEvent";

export function ClockBlock(props) {
    const [route, setRoute] = useState(null);
    const [error, setError] = useState(null);

    function formatTime(time) {
        if (!time) return "";
        // hh:mm
        let hours = time.getHours();
        let minutes = time.getMinutes();
        return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}`;
    }

    function formatDate(date) {
        if (!date) return "";
        // dd/mm/yyyy
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        return `${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}/${year}`;
    }

    useEffect(() => {
        async function getRoute() {
            setError(null);
            if (!props.nextEvent) {
                setError({
                    message: "No next event found",
                })
                return;
            }

            // check if event is more than 7 days in the future
            let now = new Date();
            let eventDate = new Date(props.nextEvent.startDate.toJSDate());
            if (eventDate.getTime() - now.getTime() > 7 * 24 * 60 * 60 * 1000) {
                setError({
                    message: "Event is more than 7 days in the future",
                })
                return;
            }

            if (!props.transit || props.transit.length === 0) {
                setError({
                    message: "Create a route first",
                })
                return;
            }

            try {
                const suggestion = await calculateRoute(props.transit, props.nextEvent)
                setRoute(suggestion);
            } catch (e) {
                setError(e);
            }
        }

        getRoute();
    }, [props.nextEvent, props.transit]);

    if (error) {
        return (
            <div className={"bg-background-dark shadow-lg rounded px-2 py-5 mt-5 text-gray-100"}>
                <div className={"flex flex-row justify-center items-center my-20"}>
                    <div className={"flex flex-col justify-center items-center"}>
                        <div className={"text-2xl font-bold"}>{error.message}</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!route || !props.nextEvent || route.length === 0)
        return (
            <div className={"bg-background-dark shadow-lg rounded px-2 py-5 mt-5 text-gray-100"}>
                <div className={"flex flex-col justify-center items-center"}>
                    <CachedIcon className={"text-white animate-spin"} style={{fontSize: 100}}/>
                    <h2>Calculating route...</h2>
                </div>
            </div>
        );

    return (
        <div className={"bg-background-dark shadow-lg rounded px-2 py-5 mt-5 text-gray-100"}>
            <div className={"p-3 px-5"}>
                <TransitRoute transit={props.transit} route={route} endTime={props.nextEvent.startDate.toJSDate()}/>
            </div>
            <div className={"flex flex-row justify-center items-center my-20"}>
                <div className={"flex flex-col justify-center items-center"}>
                    <div className={"text-6xl font-bold text-center"}>{formatTime(route[0].startTime)}</div>
                    <div className={"text text-gray-400 text-center"}>{formatDate(route[0].startTime)}</div>
                </div>
            </div>
            <div className={"flex justify-center mb-5"}>
                {
                    props.nextEvent ?
                        <CalenderEvent event={props.nextEvent} active={true} display={true}/> : <></>
                }
            </div>
        </div>
    )
}

import {getClockFromLink} from "../../../logic/linkLogic";
import {useEffect, useState} from "react";
import MainWrap from "../../../components/MainWrap";
import {ClockBlock} from "../../../components/ClockBlock";
import {filterEvents, getEventsFromUrl, getNextEvent} from "../../../logic/CalenderLogic";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";

export default function Page({data}) {
    const [clock, setClock] = useState(data.props.data.data);
    const [allEvents, setAllEvents] = useState(null);

    useEffect(() => {
        async function getAllEvents() {
            const result = await getEventsFromUrl(clock.source)
            setAllEvents(result)
        }

        if (clock) getAllEvents();
    }, [clock]);

    return (
        <MainWrap>
            <div className={"flex justify-center"}>
                <div className={"container xl:mt-10 mt-5"}>
                    <ClockBlock nextEvent={getNextEvent(filterEvents(allEvents, clock.inactiveEvents))}
                                transit={clock.transit}/>
                    <div className={"flex flex-row justify-end"}>
                        <a href={clock.slug + "/builder"}>
                            <button
                                className={"bg-background-dark/70 hover:bg-background-dark/90 hover:shadow text-white text-xs rounded-b p-2 -mt-1 pt-3"}>
                                <EditIcon className={"mr-1"}/>Change settings
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </MainWrap>
    )


}


export async function getServerSideProps(context) {
    // get args from url
    const {link} = context.query;
    let data = await getClockFromLink(link);
    data = JSON.parse(JSON.stringify(data));
    return {props: {data}}
}

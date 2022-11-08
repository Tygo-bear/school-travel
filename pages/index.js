import MainWrap from "../components/MainWrap";
import RouteBuilder from "../components/RouteBuilder";
import {useEffect, useState} from "react";
import {filterEvents, getEventsFromUrl, getNextEvent} from "../logic/CalenderLogic";
import {ClockBlock} from "../components/ClockBlock";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from "next/link";
import {useUser} from "@auth0/nextjs-auth0";
import CachedIcon from '@mui/icons-material/Cached';

export default function Home() {
    const [data, setData] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [allEvents, setAllEvents] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined" && !data) {
            if (localStorage.getItem("clock"))
                setData(JSON.parse(localStorage.getItem("clock")));
            else
                setShowMenu(true);
        }
    }, []);

    useEffect(() => {
        async function getAllEvents() {
            const result = await getEventsFromUrl(data.source)
            setAllEvents(result)
        }

        if (data) getAllEvents();
    }, [data]);

    if (!showMenu && data) {
        return (
            <MainWrap>
                <div className={"flex justify-center"}>
                    <div className={"container xl:mt-10 mt-5"}>
                        <ClockBlock nextEvent={getNextEvent(filterEvents(allEvents, data.inactiveEvents))}
                                    transit={data.transit}/>
                        <div className={"flex flex-row justify-end"}>
                            <button
                                className={"bg-background-dark/70 hover:bg-background-dark/90 hover:shadow text-white text-xs rounded-b p-2 -mt-1 pt-3"}
                                onClick={() => setShowMenu(true)}>
                                <EditIcon className={"mr-1"}/>Change settings
                            </button>
                        </div>
                    </div>
                </div>
            </MainWrap>
        )
    }

    if (!showMenu) return <></>

    return (
        <MainWrap>
            <div className={"flex justify-center"}>
                <div className={"container mt-5"}>
                    <StorageManager/>
                </div>
            </div>
        </MainWrap>
    )
}

function StorageManager(props) {
    const {user, error, isLoading} = useUser();
    const [localStorageClock, setLocalStorageClock] = useState(null);
    const [builderStorage, setBuilderStorage] = useState(null);
    const [accountLinks, setAccountLinks] = useState(null);

    useEffect(() => {
        async function getUserStorage(user) {
            const result = await fetch("/api/user", {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`,
                },
            });
            let temp = await result.json();
            setAccountLinks(temp);
        }

        if (typeof window !== "undefined") {
            if (localStorage.getItem("routeBuilderData"))
                setBuilderStorage(JSON.parse(localStorage.getItem("routeBuilderData")));
            if (localStorage.getItem("clock"))
                setLocalStorageClock(JSON.parse(localStorage.getItem("clock")));
        }
        if (user) getUserStorage(user);
    }, [user]);

    function DeleteStorage() {
        localStorage.removeItem("clock");
        setLocalStorageClock(null);
    }

    function DeleteBuilderStorage() {
        localStorage.removeItem("routeBuilderData");
        setBuilderStorage(null);
    }

    return (
        <div className={"container"}>
            <h2 className={"text-2xl font-bold text-gray-100 mb-2"}>Local storage</h2>
            <div className={"flex flex-row items-stretch flex-wrap"}>
                {
                    localStorageClock ?
                        <StorageCard type={"local"} name={"Clock"} data={localStorageClock}
                                     DeleteStorage={DeleteStorage}
                                     discritpion={"The clock when opening the website"}/>
                        :
                        <></>
                }
                {
                    builderStorage ?
                        <StorageCard type={"builder"} name={"Route builder"} data={builderStorage}
                                     DeleteStorage={DeleteBuilderStorage}
                                     discritpion={"The route builder settings"}/>
                        :
                        <></>
                }

                <StorageCard type={"create"} name={"Clock"}/>
            </div>
            {
                accountLinks && accountLinks.links ?
                    <>
                        <h2 className={"text-2xl font-bold text-gray-100 mb-2 mt-5"}>Account storage</h2>
                        <div className={"flex flex-row items-stretch flex-wrap"}>
                            {
                                accountLinks.links.map((link, index) => {
                                    return (
                                        <StorageCard type={"account"} name={link} data={link} key={index}/>
                                    )
                                })
                            }
                        </div>
                    </>
                    :
                    <></>
            }
            {
                user && !accountLinks ?
                    <>
                        <h2 className={"text-2xl font-bold text-gray-100 mb-2 mt-5"}>Account storage</h2>
                        <div className={"flex justify-center items-center"}>
                            <CachedIcon className={"animate-spin text-gray-100"}/>
                        </div>
                    </>
                    :
                    <></>
            }
        </div>
    )
}

function StorageCard(props) {
    // props: type, name

    if (props.type === "create") {
        return (
            <Link href={"/builder"}>
                <div
                    className={"flex justify-center items-center border-background-dark/70 rounded border-2 border-dashed shadow-lg rounded" +
                        "px-4 py-4 mb-2 text-gray-100 mr-3 w-80 lg:w-1/4 hover:bg-background-dark/50 cursor-pointer"}>
                    <p className={"text-center text-xl"}>Create</p>
                </div>
            </Link>
        )
    }

    if (props.type === "account") {
        return (
            <div className={"bg-background-dark shadow-lg rounded px-4 py-2 text-gray-100 mr-3 mb-2 w-80 lg:w-1/4"}>
                <div>
                    <h3 className={"text-xl font-bold"}>{props.name}</h3>
                    <div className={"flex flex-row justify-between items-center"}>
                        <Link href={"/clock/" + props.name} className={"text-xs text-gray-300"}>Open</Link>
                        <button onClick={props.DeleteStorage}
                                className={"bg-background-dark/70 text-red-500 hover:bg-background-dark/90 hover:shadow text-white text-xs rounded-b p-2 -mt-1 pt-3"}>
                            <DeleteIcon/>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={"bg-background-dark shadow-lg rounded px-4 py-2 text-gray-100 mr-3 mb-2 w-80 lg:w-1/4"}
             onClick={props.onClick}>
            <div>
                <h3 className={"text-xl font-bold"}>{props.name}</h3>
                <div className={"flex flex-row justify-between items-center"}>
                    <p className={"text-sm text-gray-400"}>{props.discritpion}</p>
                    <button onClick={props.DeleteStorage}
                            className={"bg-background-dark/70 text-red-500 hover:bg-background-dark/90 hover:shadow text-white text-xs rounded-b p-2 -mt-1 pt-3"}>
                        <DeleteIcon/>
                    </button>
                </div>
            </div>
        </div>
    )

}

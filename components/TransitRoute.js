import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrainIcon from "@mui/icons-material/Train";
import SchoolIcon from "@mui/icons-material/School";

export function TransitRoute(props) {

    function formatTime(time) {
        if (!time) return "";
        // hh:mm
        let hours = time.getHours();
        let minutes = time.getMinutes();
        return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}`;
    }

    if (props.transit && !props.route) {
        return (
            <div className={"flex flex-row"}>
                {
                    props.transit.map((transit, index) => {
                        if (transit.type === "delay") {
                            return (
                                <div className={"flex flex-col justify-center items-center"} key={index*3}>
                                    <div className={"p-1 my-1 bg-green-600 rounded-full z-10"}>
                                        <AccessTimeIcon/>
                                    </div>
                                    <div>s</div>
                                </div>
                            );
                        } else if (transit.type === "train") {
                            return (
                                <>
                                    <div className={"flex flex-col justify-center items-center"} key={index*3}>
                                        <div className={"p-1 my-1 bg-green-600 rounded-full z-10"}>
                                            <TrainIcon/>
                                        </div>
                                        <div>s</div>
                                    </div>
                                    <div className={"flex flex-col flex-grow justify-center items-center -mx-4"}  key={index*3+1}>
                                        <div className={"h-2 w-full bg-green-600 rounded"}>
                                        </div>
                                        <span> {transit.startStation.name} - {transit.endStation.name}</span>
                                    </div>
                                    <div className={"flex flex-col justify-center items-center"} key={index*3+2}>
                                        <div className={"p-1 my-1 bg-green-600 rounded-full z-10"}>
                                            <TrainIcon/>
                                        </div>
                                        <div>s</div>
                                    </div>
                                </>
                            )
                        } else {
                            return <></>
                        }
                    })
                }
            </div>
        )
    }

    return (
        <div className={"flex flex-row"}>
            {
                props.route.map((transit, index) => {
                    if (transit.type === "delay") {
                        return (
                            <>
                                <div className={"flex flex-col justify-center items-center"} key={index*4}>
                                    <div style={{height: "1.5rem"}}></div>
                                    <div className={"p-1 my-1 bg-green-600 rounded-full z-10"}>
                                        <AccessTimeIcon/>
                                    </div>
                                    <div>{formatTime(transit.startTime)}</div>
                                </div>
                                <div className={"flex flex-col flex-grow justify-center items-center -mx-4"} key={index*4+1}>
                                    <div style={{height: "1.5rem"}}></div>
                                    <div className={"h-2 w-full bg-green-600 rounded"}>
                                    </div>
                                    <span>{transit.transitTime}min</span>
                                </div>
                            </>
                        );
                    } else if (transit.type === "train") {
                        return (
                            <>
                                <div className={"flex flex-col justify-center items-center"} key={index*4}>
                                    <div style={{height: "1.5rem"}}></div>
                                    <div className={"p-1 my-1 bg-green-600 rounded-full z-10"}>
                                        <TrainIcon/>
                                    </div>
                                    <div>{formatTime(transit.startTime)}</div>
                                </div>
                                <div className={"flex flex-col flex-grow justify-center items-center -mx-4"} key={index*4+1}>
                                    <span> {transit.startStation.name} - {transit.endStation.name}</span>
                                    <div className={"h-2 w-full bg-green-600 rounded"}>
                                    </div>
                                    <span> {transit.transitTime}min</span>
                                </div>
                                <div className={"flex flex-col justify-center items-center"} key={index*4+2}>
                                    <div style={{height: "1.5rem"}}></div>
                                    <div className={"p-1 my-1 bg-green-600 rounded-full z-10"}>
                                        <TrainIcon/>
                                    </div>
                                    <div>{formatTime(transit.endTime)}</div>
                                </div>
                                <div className={"flex flex-col w-10 justify-center items-center -mx-4"} key={index*4+3}>
                                    <div style={{height: "1.5rem"}}></div>
                                    <div className={"h-2 w-full bg-green-600 rounded"}>
                                    </div>
                                    <div style={{height: "1.5rem"}}></div>
                                </div>
                            </>
                        )
                    } else {
                        return <></>
                    }
                })
            }

            <div className={"flex flex-col justify-center items-center"} key={-1}>
                <div style={{height: "1.5rem"}}></div>
                <div className={"p-1 my-1 bg-green-600 rounded-full z-10"}>
                    <SchoolIcon/>
                </div>
                <div style={{height: "1.5rem"}}>{formatTime(props.endTime)}</div>
            </div>
        </div>
    )
}

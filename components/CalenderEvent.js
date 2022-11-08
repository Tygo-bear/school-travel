import {applyTimezone} from "../logic/CalenderLogic";
import {getOpoColor} from "../logic/helpers";
import {getOpoId} from "../logic/KuLeuvenLogic";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

export function CalenderEvent(props) {
    // props:
    // - event: object

    function getHourMinute(time) {
        time = applyTimezone(time);
        // add 0 if needed
        let hour = time.getHours();
        if (hour < 10) {
            hour = "0" + hour;
        }
        let minute = time.getMinutes();
        if (minute < 10) {
            minute = "0" + minute;
        }
        return hour + ":" + minute;
    }

    function isSelectionMode() {
        return props.display === undefined;
    }

    return (
        <div
            className={`flex flex-col bg-background-light rounded mb-1 cursor-pointer ${props.active ? "" : "text-gray-400"}`}>
            <div className={"flex flex-row items-center p-2 pb-1 rounded-t text-white"}
                 style={{backgroundColor: getOpoColor(getOpoId(props.event.summary))}}>
                <div className={"text-sm font-bold"}>{getHourMinute(props.event.startDate)}</div>
                <span>-</span>
                <div className={"text-sm font-bold"}>{getHourMinute(props.event.endDate)}</div>
                <div className={"text-sm ml-2 font-bold"}>{getOpoId(props.event.summary)}</div>
            </div>
            <div className={"p-2 pt-0"}>
                <div className={"text-sm font-bold"}>{props.event.summary}</div>
                <div className={"flex justify-between"}>
                    <div className={"text-xs text-gray-400"}>{props.event.location}</div>
                    {
                        isSelectionMode() ?
                            props.active ?
                                <button className={"text-xs text-green-400 m-1"}>
                                    <CheckCircleOutlineIcon/>
                                </button>
                                :
                                <button className={"text-xs text-white m-1"}>
                                    <RadioButtonUncheckedIcon/>
                                </button>
                            :
                            <></>
                    }
                </div>
            </div>
        </div>
    );
}

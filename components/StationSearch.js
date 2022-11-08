import {useState} from "react";
import CachedIcon from "@mui/icons-material/Cached";
import {ReactSearchAutocomplete} from "react-search-autocomplete";

export function StationSearch(props) {
    // note: the id field is mandatory
    // props:
    // - stations: array of objects
    // - setStation: function

    const [station, setStation] = useState(props.value);


    const handleOnSearch = (string, results) => {
        // onSearch will have as the first callback parameter
        // the string searched and for the second the results.
        //console.log(string, results)
    }

    const handleOnHover = (result) => {
        // the item hovered
        //console.log(result)
    }

    const handleOnSelect = (item) => {
        // the item selected
        //console.log(item)
        props.onChange(item);
        console.log(item);
    }

    const handleOnFocus = () => {
        //console.log('Focused')
    }

    const formatResult = (item) => {
        return (
            <>
                <span style={{display: 'block', textAlign: 'left'}}>{item.name}</span>
            </>
        )
    }

    if (props.stations.length === 0) {
        // show loading
        return (
            <>
                <CachedIcon className={"animate-spin"}/>
            </>
        );

    }

    return (
        <div className={"w-80 z-10"}>
            <ReactSearchAutocomplete
                items={props.stations}
                onSearch={handleOnSearch}
                onHover={handleOnHover}
                onSelect={handleOnSelect}
                onFocus={handleOnFocus}
                formatResult={formatResult}
                placeholder={props.placeholder}
                inputSearchString={props.value.name}
            />
        </div>
    )
}

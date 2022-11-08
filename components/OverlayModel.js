export function OverlayModel(props) {
    // generic overlay model that can be used for any overlay
    // props:
    // - show: boolean

    return (
        <div className={"fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50"}
             style={{display: props.show ? "block" : "none"}}>
            <div className={"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2"}>
                {props.children}
            </div>
        </div>
    );
}

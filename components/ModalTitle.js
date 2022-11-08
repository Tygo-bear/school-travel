export function ModalTitle(props) {
    // props:
    // - title: string
    // - icon: JSX.Element
    // - close: function

    return (
        <div className={"flex justify-between items-center"}>
            <div className={"flex items-center"}>
                <div className={"mr-2"}>
                    {props.icon}
                </div>
                <div className={"text-lg font-bold"}>
                    {props.title}
                </div>
            </div>
            <div className={"cursor-pointer"} onClick={props.close}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </div>
        </div>
    );
}

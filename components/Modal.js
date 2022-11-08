import {OverlayModel} from "./OverlayModel";
import {ModalTitle} from "./ModalTitle";

export function Modal(props) {
    // props:
    // - show: boolean
    // - close: function
    // - title: string
    // - icon: JSX.Element

    return (
        <OverlayModel show={props.show}>
            <div className={"bg-background-dark shadow-lg rounded p-2 text-gray-100"}>
                <ModalTitle title={props.title} icon={props.icon} close={props.close}/>
                {props.children}
            </div>
        </OverlayModel>
    );
}

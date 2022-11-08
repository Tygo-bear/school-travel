import {Navbar} from "./Navbar";

export default function MainWrap(props) {

    // show modal when display small screen
    return (
        <>
            <Navbar />
            {props.children}
            <div className={"fixed top-0 left-0 w-full h-full bg-background/95 z-50 block md:hidden"}>
                <div className={"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2"}>
                    <div className={"bg-background-dark shadow-lg rounded p-2 text-gray-100"}>
                        <div className={"flex justify-center"}>
                            <div className={"container m-5"}>
                                <div className={"text-center text-2xl font-bold text-gray-100"}>
                                    <p>Sorry, this page is not available on mobile devices.</p>
                                    <p>Please use a desktop or laptop computer.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


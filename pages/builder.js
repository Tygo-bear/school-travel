import MainWrap from "../components/MainWrap";
import RouteBuilder from "../components/RouteBuilder";

export default function Home() {
    return (
        <MainWrap>
            <div className={"flex justify-center"}>
                <div className={"container mt-5"}>
                    <RouteBuilder/>
                </div>
            </div>
        </MainWrap>
    )
}

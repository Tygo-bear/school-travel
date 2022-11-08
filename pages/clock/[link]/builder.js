import {useEffect, useState} from "react";
import {getClockFromLink} from "../../../logic/linkLogic";
import RouteBuilder from "../../../components/RouteBuilder";
import MainWrap from "../../../components/MainWrap";

export default function Page({data}) {
    const [clock, setClock] = useState(data.props.data.data);

    return (
        <MainWrap>
            <div className={"flex justify-center"}>
                <div className={"container mt-5"}>
                    <RouteBuilder data={clock}/>
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

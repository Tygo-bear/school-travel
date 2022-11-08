// props:
// - startStation: object
// - endStation: object

// display a map with all stations given in props
// the map shows a overview of the stations a marker is placed on the station
// if no stations are given, the map will show the gent area at 51.0603085,3.7078274,17z

// use openlayers to display the map

// station contains locationX and locationY
// locationX is the longitude
// locationY is the latitude
// this code can be used to convert the coordinates x and y to latitude and longitude
// const lon = parseFloat(props.startStation.locationX);
// const lat = parseFloat(props.startStation.locationY);

import {useEffect, useRef, useState} from "react";
import {Map, View} from "ol";
import {Tile as TileLayer, Vector as VectorLayer} from "ol/layer";
import {OSM, Vector as VectorSource} from "ol/source";
import {Icon, Style} from "ol/style";
import {fromLonLat} from "ol/proj";
import {Feature} from "ol";
import {Point} from "ol/geom";

export function TrainStationMap(props) {
    const [map, setMap] = useState(null);
    const [startStation, setStartStation] = useState(null);
    const [endStation, setEndStation] = useState(null);

    // ref map div
    const mapRef = useRef();
    const gent = fromLonLat([3.7078274, 51.0603085]);

    function createMap() {
        // create map
        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: gent,
                zoom: 12
            })
        });
        setMap(map);
        return map;
    }


    useEffect(() => {
        // only update map when stations are given
        // check if the map is already created

        let localMap = map;

        function updateStartStation() {
            if (startStation) {
                localMap.removeLayer(startStation);
            }

            if (props.startStation) {
                // update start station
                const lon = parseFloat(props.startStation.locationX);
                const lat = parseFloat(props.startStation.locationY);
                const station = fromLonLat([lon, lat]);

                const iconFeature = new Feature({
                    geometry: new Point(station),
                    name: props.startStation.name,
                    id: props.startStation.id
                });

                const iconStyle = new Style({
                    image: new Icon({
                        anchor: [0.5, 1],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        src: '/station.png',
                        scale: 0.1
                    })
                });

                iconFeature.setStyle(iconStyle);

                const vectorSource = new VectorSource({
                    features: [iconFeature]
                });

                const vectorLayer = new VectorLayer({
                    source: vectorSource
                });

                localMap.addLayer(vectorLayer);
                setStartStation(vectorLayer);
            }
        }

        function updateEndStation() {
            if (endStation) {
                localMap.removeLayer(endStation);
            }

            if (props.endStation) {
                // update end station
                const lon = parseFloat(props.endStation.locationX);
                const lat = parseFloat(props.endStation.locationY);
                const station = fromLonLat([lon, lat]);

                const iconFeature = new Feature({
                    geometry: new Point(station),
                    name: props.endStation.name,
                    id: props.endStation.id
                });

                const iconStyle = new Style({
                    image: new Icon({
                        anchor: [0.5, 1],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        src: '/station.png',
                        scale: 0.1
                    })
                });

                iconFeature.setStyle(iconStyle);

                const vectorSource = new VectorSource({
                    features: [iconFeature]
                });

                const vectorLayer = new VectorLayer({
                    source: vectorSource
                });

                localMap.addLayer(vectorLayer);
                setEndStation(vectorLayer);
            }
        }

        if (!map) {
            localMap = createMap()
        }

        // update map
        localMap.updateSize();
        if (props.startStation) {
            updateStartStation();
        } else {
            setStartStation(null);
        }
        if (props.endStation) {
            updateEndStation();
        } else {
            setEndStation(null);
        }

        if (props.startStation && props.endStation) {
            // bring both stations to center
            localMap.getView().setCenter(fromLonLat([(parseFloat(props.startStation.locationX) + parseFloat(props.endStation.locationX)) / 2, (parseFloat(props.startStation.locationY) + parseFloat(props.endStation.locationY)) / 2]));
            // estimate zoom level
            const distance = Math.sqrt(Math.pow(parseFloat(props.startStation.locationX) - parseFloat(props.endStation.locationX), 2) + Math.pow(parseFloat(props.startStation.locationY) - parseFloat(props.endStation.locationY), 2));
            console.log(distance);
            // set zoom level
            const zoom = 9 - Math.log2(distance);
            localMap.getView().setZoom(zoom);
            console.log(zoom);
        } else if (props.startStation) {
            // bring start station to center
            localMap.getView().setCenter(fromLonLat([parseFloat(props.startStation.locationX), parseFloat(props.startStation.locationY)]));
            localMap.getView().setZoom(15);
        } else if (props.endStation) {
            // bring end station to center
            localMap.getView().setCenter(fromLonLat([parseFloat(props.endStation.locationX), parseFloat(props.endStation.locationY)]));
            localMap.getView().setZoom(15);
        }

    }, [props.endStation, props.startStation]);


    return (
        <div className={"h-96 w-full"} ref={mapRef}/>
    );
}



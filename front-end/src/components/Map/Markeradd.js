import React, { useMemo, useRef } from 'react';
import iconImg from '../../images/marker_add.png';
import L from 'leaflet';
import { Marker, Popup } from 'react-leaflet';

const addIcon = L.icon({
    iconUrl: iconImg,
    iconSize: [22.75, 35.7],
    popupAnchor: [0, -20],
});

const Markeradd = (props) => {

    const markerRef = useRef(null)

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    console.log(marker.getLatLng())

                } else
                    console.log(marker)
            },
        }),
        [],
    )

    return (
        <Marker
            ref={markerRef}
            draggable={true}
            position={[41.2707, -8.5824]}
            icon={addIcon}
            opacity={1}
            eventHandlers={eventHandlers}>
            <Popup minWidth={90}>
                É possivel mudar a localização<br /> Basta me arrastares!
            </Popup>
        </Marker>
    );
}

export default Markeradd;
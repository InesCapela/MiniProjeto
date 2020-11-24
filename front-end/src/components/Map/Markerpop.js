import { Marker, Popup } from 'react-leaflet';
import iconImg from '../../images/marker.png';
import L from 'leaflet'

const myIcon = L.icon({
    iconUrl: iconImg,
    iconSize: [25, 35.7],
    popupAnchor: [0, -20],
});

const Markerpop = props => {
    return (
        <Marker position={[props.lat, props.long]} icon={myIcon}>
            <Popup>
                {props.name} <br /> # Pessoas.
            </Popup>
        </Marker>
    );
}

export default Markerpop;
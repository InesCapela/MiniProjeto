import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

const Place = props => {

    const place = {
        ID: props.id,
        name: props.name,
        latitude: props.lat,
        longitude: props.lng,
        people: props.persons,
    }

    return (
        <div>
            <ListItemLink>
                <ListItemText onClick={(event) => props.selectPlace(event, place)}><strong>{props.name + " - "}</strong><PeopleAltIcon />{" " + props.persons}</ListItemText>
            </ListItemLink>
        </div >
    );
}

export default Place;
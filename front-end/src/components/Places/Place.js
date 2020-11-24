import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import { useLocation } from 'react-router';

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

const Place = props => {

    return (
        <div>
            <ListItemLink href={useLocation().pathname + "/" + props.id}>
                <ListItemText><strong>{props.name + " - "}</strong><PeopleAltIcon />{" " + props.persons}</ListItemText>
            </ListItemLink>
        </div >
    );
}

export default Place;
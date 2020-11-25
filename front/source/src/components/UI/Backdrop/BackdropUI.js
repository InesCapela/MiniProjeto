import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import { useStyles } from '../../Styles/Styles';

const BackdropUI = props => {

    // styles
    const classes = useStyles();

    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
            {props.children}
        </Backdrop>
    );
}

export default BackdropUI;
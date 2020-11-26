import React from 'react';
import { connect } from 'react-redux';

import NavbarUI from '../UI/Navbar/NavbarUI';

const Layout = props => {

    return (
        <React.Fragment>
            {props.token ? <NavbarUI isAdmin={props.isAdmin} token={props.token} /> : null}
            <main className="Content">
                {props.children}
            </main>
        </React.Fragment>
    );
}

// get state from reducer
const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        isAdmin: state.auth.isAdmin,
    };
}

export default connect(mapStateToProps, null)(Layout);
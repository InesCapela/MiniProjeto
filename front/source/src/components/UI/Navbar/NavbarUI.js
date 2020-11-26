import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';

const NavbarUI = props => {

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={NavLink} to="/places">Places</Nav.Link>
                    <Nav.Link as={NavLink} to="/map">Map</Nav.Link>
                    {props.isAdmin === true ? <Nav.Link as={NavLink} to="/users">Users</Nav.Link> : null}
                </Nav>
                <Nav>
                    <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavbarUI;
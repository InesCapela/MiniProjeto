import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import './App.css';
import Layout from './components/Layout/Layout';
import Login from './components/Login/Login';
import MapLeaflet from './components/Map/MapLeaflet';
import Logout from './components/Logout/Logout';
import 'bootstrap/dist/css/bootstrap.min.css';
import Users from './components/Users/Users';
import { connect } from 'react-redux';
import PlacesPage from './components/Places/PlacesPage';

const App = props => {

  const routes = (
    <Switch>
      <Route path="/places" component={PlacesPage} />
      <Route path="/map" component={MapLeaflet} />
      <Route path="/users" component={Users} />
      <Route path="/logout" component={Logout} />
      <Route path="/" component={Login} />
      <Route render={() => <h1>Not found!</h1>} />
      <Redirect to="/" />
    </Switch>
  );

  return (
    <React.Fragment>
      <BrowserRouter>
        <div className="App">
          <Layout>
            {routes}
          </Layout>
        </div>
      </BrowserRouter>
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

export default connect(mapStateToProps, null)(App);

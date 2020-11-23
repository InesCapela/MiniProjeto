import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import './App.css';
import Login from './components/Login/Login';
import Places from './components/Places/Places';
import PlaceView from './components/PlaceView/PlaceView';

const App = props => {

  return (
    <BrowserRouter>
      <div className="App">

        <Switch>
          <Route path="/places" component={Places} />
          <Route path="/test" component={PlaceView} />
          <Route path="/" component={Login} />
          
          <Route render={() => <h1>Not found!</h1>} />
          <Redirect to="/" />
        </Switch>
      
      </div>
    </BrowserRouter>
  );

}

export default App;

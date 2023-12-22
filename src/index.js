import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';
import * as serviceWorker from './sw/serviceWorker.js';
import { store as storeToolkit } from './reducers/storeToolkit.js';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Config from "./config/index.js";
import Generate from "./generate/index.js"
import { Provider } from "react-redux";

const RootEl = () => (
  <Provider store={storeToolkit}>
    <Router>
      <Switch>
        <Route path="/config">
          <Config />
        </Route>
        <Route path="/generate">
          <Generate />
        </Route>
        <Route path="/">
          <App />
        </Route>
      </Switch>
    </Router>
  </Provider>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RootEl />);

reportWebVitals();
serviceWorker.register();

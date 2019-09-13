import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import {Provider} from 'react-redux'
import {createStore, applyMiddleware, compose} from 'redux'
import "bootstrap/dist/css/bootstrap.min.css";
import thunk from 'redux-thunk'
import reducers from './components/reducers/reducer.js'


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const STORE = createStore(
    reducers,
    composeEnhancers(applyMiddleware(thunk))
)

ReactDOM.render(
  <Provider store={STORE}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </Provider>,
  document.getElementById("root")
)

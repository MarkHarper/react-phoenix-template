// @flow

import React from 'react'
import ReactDOM from "react-dom";
import style from "./sharedStyles/index.css";
import {
  App
} from './containers'
import './components/index.js';

ReactDOM.render(
  <App/>,
  (document.getElementById('app'): any)
);

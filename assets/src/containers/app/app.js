// @flow

import React, { Component } from 'react';
import ReactDOM from "react-dom";
// $FlowFixMe
import mobile from "is-mobile";
import {
  Home,
  Nav
} from '../../views';

type Props = {};
type State = {
  route?: string,
  mobile: boolean
};

export class App extends Component<Props, State> {
  state = {
    route: "",
    mobile: mobile()
  };

  componentDidCatch(error: any, info: any) {
    console.log(error, info);
  }

  componentDidMount() {
    const router = (document.querySelector('a-router'): any);

    router.addEventListener('initialized', () => {
      this.setState({
        route: router.history.location.pathname
      });
    });

    router.addEventListener('historyChange', (h) => {
      this.setState({
        route: h.detail.location.pathname
      });
    });
  }

  render() {
    return (
      <a-router root="/" history="hash">
        <a-group>
          <a-route path="/" exact>
            <Home/>
          </a-route>
        </a-group>
      </a-router>
    );
  }
}
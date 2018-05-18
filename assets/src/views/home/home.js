// @flow

import React, { Component } from 'react';
import './home.css';

type Props = {};
type State = {
  width: number,
  height: number
};

export class Home extends Component<Props, State> {
  state = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  componentDidCatch(error: any, info: any) {
    console.log(error, info);
  }

  render() {
    return (
      <div>
        Home
      </div>
    );
  }
}
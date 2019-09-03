import * as React from 'react';
import './loader.scss';

export interface LoaderProps {}

export interface LoaderState {}

class Loader extends React.Component<LoaderProps, LoaderState> {
  state = {};
  render() {
    return <div className="lds-dual-ring"></div>;
  }
}

export default Loader;

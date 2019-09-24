import * as React from "react";

import './App.scss';

export interface AppProps { compiler: string; framework: string; }

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export class App extends React.Component<AppProps, {}> {
  render() {
    return (
      <div>
        <div className="jumbotron">
          <h1>Start coding...</h1>
        </div>
      </div>
    );
  }
}


import React from 'react';

export default class App extends React.Component {
  render() {
    const toto = (v) => v;
    const a = 2;
    const titi = (v) => v;
    return (
      <ul>
          <div>{ toto("It's my app!") }</div>
          <li>Hey</li>
      </ul>
    );
  }
}

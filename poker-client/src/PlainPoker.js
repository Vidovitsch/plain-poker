import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './PlainPoker.css';
import Game from './components/Game/Game';
import Lobby from './components/Lobby/Lobby';

const PlainPoker = () => (
  <Switch className="PlainPoker">
    <Route exact path="/" component={Lobby} />
    <Route path="/game/:id/:sessionId" component={Game} />
  </Switch>
);

export default PlainPoker;

// import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/header/Header';
import Navbar from './components/navbar/Navbar';

import PokeDex from './components/pokemon-dex/PokeDex';

function App() {
  return (
    <Router>
      <Navbar />
      <Header />
      <Switch>
        <Route path="/">
          <PokeDex />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

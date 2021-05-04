// import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import PokemonFinder from './components/pokemon-finder/PokemonFinder';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/">
          <PokemonFinder />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

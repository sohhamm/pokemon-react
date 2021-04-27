import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import LandingPage from './components/landing-page/LandingPage';
import Navbar from './components/navbar/Navbar';
import PokemonFinder from './components/pokemon-finder/PokemonFinder';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/pokemon">
          <PokemonFinder />
        </Route>
        <Route path="/">
          <LandingPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

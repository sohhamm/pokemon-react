import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route to="/pokemon">
          <PokemonSearcher />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

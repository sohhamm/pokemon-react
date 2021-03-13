import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Pokemon from './components/Pokemon/Pokemon';
import Header from './components/Navigation/Header';
import Footer from './components/Navigation/Footer';
import About from './components/About/About';

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route>
          <About path="/about" />
        </Route>
        <Route exact path="/">
          <Pokemon />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;

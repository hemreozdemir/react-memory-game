import logo from './logo.svg';
import './App.scss';
import { BrowserRouter, Route, Router, Switch } from 'react-router-dom';
import Entrance from './pages/Entrance';
import Settings from './pages/Settings';
import Play from './pages/Play';

function App() {
  return (
    <div className="main-content-container">
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact path="/">
              <Entrance />
            </Route>
            <Route path="/settings">
              <Settings />
            </Route>
            <Route path="/play">
              <Play />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

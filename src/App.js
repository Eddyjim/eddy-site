import logo from "./logo.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

/**
 * Root Application
 * @return {JSX.Element}
 * @constructor
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<DefaultApp />} />
      </Routes>
    </BrowserRouter>
  );
}

/**
 * Default App
 * @return {JSX.Element}
 * @constructor
 */
function DefaultApp() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

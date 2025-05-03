import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routing from "./Routing";
import { Provider } from "react-redux";
import store from "./store/index";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routing />
      </Router>
    </Provider>
  );
}

export default App;

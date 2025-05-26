import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
// import './assets/css/font-awesome.min.css'
import "./assets/css/all.min.css";
// import "./input.css";
import "./assets/css/style.css";
import { BrowserRouter as Router } from "react-router-dom";
import { store } from "./Redux-store/Store.js";
import { Provider } from "react-redux";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
        <Router>
            <Provider store={store}>
                <App />
            </Provider>
        </Router>
    </React.StrictMode>
);

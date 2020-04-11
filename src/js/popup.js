import "../css/popup.css";
import "../css/picnic.css";
import Greeting from "./popup/popup.jsx";
import React from "react";
import { render } from "react-dom";

render(<Greeting />, window.document.getElementById("app-container"));

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Global styles must load before App/component CSS modules — ESM import
// side effects run in written order, so global.css being listed after App
// meant its .container{padding:0 var(--gutter)} shorthand (which resets
// padding-top/bottom to 0) was cascading AFTER and silently overriding any
// component's padding-block on an element that also carries .container
// (Header's .bar did exactly this — its "taller navbar" padding was being
// zeroed out).
import "./styles/global.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

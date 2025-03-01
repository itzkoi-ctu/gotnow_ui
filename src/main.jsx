import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Provider } from "react-redux";
import { store } from "./store/Store.js";
import  {Elements} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51QxlKrRuePHYLySbKCNZLOaKitz1INET3Rcpq9gabe8JWZ2g7d6H0kuNGNh8prXa1c5Iwf6fq8VH4RNPaspcWe42002xwlt8lM")
const options = {
  locale: "en"
}
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Elements stripe={stripePromise} options={options}>
        <App/>
      </Elements>
    </Provider>
  </StrictMode>
);

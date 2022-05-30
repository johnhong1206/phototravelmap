import "../styles/globals.css";
//redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "../features/store";
import { Toaster } from "react-hot-toast";
import Router from "next/router";
import ProgressBar from "@badrap/bar-of-progress";

const progress = new ProgressBar({
  size: 4,
  color: "#3333ff",
  className: "z-50",
  delay: 100,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

import dynamic from "next/dynamic";
import Footer from "../components/Footer";
const Header = dynamic(() => import("../components/Header"));
let persistor = persistStore(store);

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div>
          <Header />
          <Component {...pageProps} />
        </div>
        <Toaster />
      </PersistGate>
    </Provider>
  );
}

export default MyApp;

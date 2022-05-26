import "../styles/globals.css";
//redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "../features/store";
import { Toaster } from "react-hot-toast";

import dynamic from "next/dynamic";
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
